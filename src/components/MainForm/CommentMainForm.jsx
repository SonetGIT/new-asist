//ОСНОВНАЯ ФОРМА
import React, { useState, useEffect } from "react";
import Table from "@material-ui/core/Table"; // Material ui table for usual form
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Button from "@material-ui/core/Button";
import { Grid } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import GridSelect from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import LinearProgress from "@material-ui/core/LinearProgress";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import NumberFormat from "react-number-format";
import PropTypes from "prop-types";
// Form components
import TextField from "@material-ui/core/TextField";
import Select from "react-select";
import Checkbox from "@material-ui/core/Checkbox";
import AttachFileIcon from "@material-ui/icons/AttachFile";
// Libraries
import swal from "sweetalert"; // https://sweetalert.js.org/guides/
import Tooltip from "@material-ui/core/Tooltip";
import Moment from "moment";
import { green } from "@material-ui/core/colors";
import { CenterFocusStrong } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import XLSX from "xlsx";
import xlsxJsonJs from "xlsx-json-js";

var TableToExcel = require("table-to-excel");
var tableToExcel = new TableToExcel();
var generator = require("generate-password");

function FloatFormat(props) {
  const { inputRef, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      decimalSeparator={"."}
      thousandSeparator={" "}
      isNumericString
    />
  );
}
FloatFormat.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};
function IntegerFormat(props) {
  const { inputRef, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      // thousandSeparator={" "}
      isNumericString
    />
  );
}
IntegerFormat.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};
const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
  },
  paper: {
    width: 400,
    height: 300,
    overflow: "auto",
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
  importFile: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  inputFile: {
    display: "none",
  },
}));
export default (props) => {
  //This.state
  const classes = useStyles();
  const [userProfile] = useState(props.userProfile);
  const [session_id] = useState(props.userTask.session_id);
  const [process_id] = useState(props.userTask.process_id);
  const [taskID] = useState(props.userTask.taskID);
  const [Form, setForm] = useState(props.userTask.Form);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docId, setDocId] = useState(props.userTask.docId);
  const [formType] = useState(props.userTask.formType);
  const [docList, setDocList] = useState(null);

  const [gridForm] = useState(props.userTask.gridForm);
  const [gridFormButtons] = useState(props.userTask.gridFormButtons);
  const [tableFormButtons, setTableFormButtons] = useState(null);
  const [enumData] = useState(props.userTask.enumData);
  const [enumOptions, setEnumOptions] = useState({});
  const [fieldValue, setFieldValue] = useState({});
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [buttons] = useState(props.userTask.buttons);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [totalCount, setTotalCount] = useState(null);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [sectionColor] = useState("#B2E0C9");
  const [updateState, setUpdateState] = useState(false);
  const [taskType] = useState(props.userTask.taskType);
  const [gridTableId, setGridTableId] = useState(null);
  const [buttonFilesId, setbuttonFilesId] = useState(null);
  const [attachedDocs, setAttachedDocs] = useState([]);
  const [Blobs, setBlobs] = useState([]);

  const handleCheckboxChange = (event) => {
    setFieldValue({ ...fieldValue, [event.target.name]: event.target.checked });
  };
  // Integer input handler
  const handleIntChange = (event) => {
    console.log("EVENT", event.target.name, event.target.value);
    let stringNum = event.target.value.toString().replace(/ /g, "");
    let int = parseInt(stringNum);
    setFieldValue({ ...fieldValue, [event.target.name]: int });
  };
  // Float input handler
  const handleFloatChange = (event) => {
    let stringNum = event.target.value.toString().replace(/ /g, "");
    let float = parseFloat(stringNum);
    setFieldValue({ ...fieldValue, [event.target.name]: float });
    console.log("FLOAT CHANGE", event.target.name, fieldValue);
  };
  // Text input handler
  function handleAttachFile(files) {
    let selectedFile = files.target.files[0];
    setFieldValue({ ...fieldValue, ["LoadedFile"]: selectedFile.name });
    console.log("НАЗ-Е ФАЙЛА", selectedFile.name, fieldValue);

    const fileReader = new FileReader();
    fileReader.onload = function (event) {
      var data = event.target.result;
      var workbook = XLSX.read(data, {
        type: "binary",
        cellText: false,
        cellDates: true,
      });
      var wsname = workbook.SheetNames[0];
      var ws = workbook.Sheets[wsname];
      var data2 = XLSX.utils.sheet_to_json(ws, {
        header: 1,
        raw: false,
        dateNF: "dd-mm-yyyy",
      });
      console.log("data2", data2);
      workbook.SheetNames.forEach((sheet) => {
        let rowObject = XLSX.utils.sheet_to_row_object_array(
          workbook.Sheets[sheet]
        );

        let header = data2[7];
        console.log("HEAD", header);

        let attrsNames = {
          0: "LineNo",
          1: "PersonName",
          2: "AccountNo",
          3: "123test",
          4: "OpenDate",
          5: "ItemId",
        };
        let arrDocList = [];
        for (let i = 7; i < data2.length; i++) {
          let arrItems = [];
          for (let key in data2[i]) {
            let newItem = {
              name: attrsNames[key],
              value: data2[i][key],
            };
            arrItems.push(newItem);
            //console.log("ddd", dt)
          }
          arrDocList.push({ attributes: arrItems });
        }
        console.log("DOCL", arrDocList);
        setDocList(arrDocList);
      });
    };
    fileReader.readAsBinaryString(selectedFile);
  }

  function handleChange(event) {
    // console.log("EVENT", event.target.name, event.target.value)
    fieldValue[event.target.name] = event.target.value;
    setFieldValue(fieldValue);
    console.log("FIELDVALUE", fieldValue);
  }
  function handleSelectChange(option) {
    fieldValue[option.name] = option.value;
    console.log("OPT", option.name, option.value);
    var updateSelectedOptions = selectedOptions.slice();
    let noSuchOption = true;
    for (let i = 0; i < updateSelectedOptions.length; i++) {
      if (option.name === updateSelectedOptions[i].name) {
        updateSelectedOptions[i] = option;
        noSuchOption = false;
        setSelectedOptions(updateSelectedOptions);
        break;
      } else {
        noSuchOption = true;
      }
    }
    if (noSuchOption === true) {
      updateSelectedOptions.push(option);
      setSelectedOptions(updateSelectedOptions);
    }
    if (
      option.name === "payer_type" &&
      taskType === "showPaymentsForCDServicesCreatingForm"
    ) {
      // console.log("SEL", option.name, option.value)
      for (let s = 0; s < Form.sections.length; s++) {
        for (let c = 0; c < Form.sections[s].contents.length; c++) {
          if (Form.sections[s].contents[c].name === "depositor") {
            if (option.value === 1) {
              Form.sections[s].contents[c].show = true;
              Form.sections[s].contents[c].edit = true;
              fieldValue["issuer"] = null;
              for (let i = 0; i < updateSelectedOptions.length; i++) {
                if (updateSelectedOptions[i].name === "issuer") {
                  updateSelectedOptions[i] = {
                    value: "",
                    label: "Пусто",
                    name: "issuer",
                  };
                  setSelectedOptions(updateSelectedOptions);
                  break;
                }
              }
            } else {
              Form.sections[s].contents[c].show = false;
              Form.sections[s].contents[c].edit = false;
            }
          }
          if (Form.sections[s].contents[c].name === "issuer") {
            if (option.value === 2) {
              Form.sections[s].contents[c].show = true;
              Form.sections[s].contents[c].edit = true;
              fieldValue["depositor"] = null;
              for (let i = 0; i < updateSelectedOptions.length; i++) {
                if (updateSelectedOptions[i].name === "depositor") {
                  updateSelectedOptions[i] = {
                    value: "",
                    label: "Пусто",
                    name: "depositor",
                  };
                  setSelectedOptions(updateSelectedOptions);
                  break;
                }
              }
            } else {
              Form.sections[s].contents[c].show = false;
              Form.sections[s].contents[c].edit = false;
            }
          }
        }
      }
      setForm(Form);

      // console.log("NEW ENUMS")
    } else if (
      option.name === "recipient_type" &&
      taskType === "showTransitChargeForCDServicesCreatingForm"
    ) {
      console.log("RECIPIENT", option.name, option.value, fieldValue);
      for (let s = 0; s < Form.sections.length; s++) {
        for (let c = 0; c < Form.sections[s].contents.length; c++) {
          if (Form.sections[s].contents[c].name === "registrar") {
            if (option.value === 1) {
              Form.sections[s].contents[c].show = true;
              Form.sections[s].contents[c].edit = true;
              fieldValue["corr_depository"] = null;
              for (let i = 0; i < updateSelectedOptions.length; i++) {
                if (updateSelectedOptions[i].name === "corr_depository") {
                  updateSelectedOptions[i] = {
                    value: "",
                    label: "Пусто",
                    name: "corr_depository",
                  };
                  setSelectedOptions(updateSelectedOptions);
                  break;
                }
              }
            } else {
              Form.sections[s].contents[c].show = false;
              Form.sections[s].contents[c].edit = false;
            }
          }
          if (Form.sections[s].contents[c].name === "corr_depository") {
            if (option.value === 2) {
              Form.sections[s].contents[c].show = true;
              Form.sections[s].contents[c].edit = true;
              fieldValue["registrar"] = null;
              for (let i = 0; i < updateSelectedOptions.length; i++) {
                if (updateSelectedOptions[i].name === "registrar") {
                  updateSelectedOptions[i] = {
                    value: "",
                    label: "Пусто",
                    name: "registrar",
                  };
                  setSelectedOptions(updateSelectedOptions);
                  break;
                }
              }
            } else {
              Form.sections[s].contents[c].show = false;
              Form.sections[s].contents[c].edit = false;
            }
          }
        }
      }
      setForm(Form);
      // console.log("NEW ENUMS")
    }
  }
  function handleDateTimeChange(event) {
    let convertedDate = getCurrentFullDateTime(event.target.value);
    fieldValue[event.target.name] = convertedDate;
    setFieldValue(fieldValue);
    // console.log("DATE CHANGE", event.target.value)
  }
  function getCurrentFullDateTime(incDate) {
    var fullDate = parseDate(incDate);
    var hours = new Date().getHours();
    var minutes = new Date().getMinutes();
    var seconds = new Date().getSeconds();
    var offsetInHours = new Date().getTimezoneOffset() / -60;
    // console.log("OFFSET", offsetInHours)
    if (offsetInHours > 0) {
      if (offsetInHours < 10) {
        offsetInHours = "+0" + offsetInHours;
      } else {
        offsetInHours = "+" + offsetInHours;
      }
    } else {
      if (offsetInHours > -10) {
        offsetInHours = "-0" + Math.abs(offsetInHours);
      }
    }
    var convertedDate =
      fullDate + " " + hours + ":" + minutes + ":" + seconds + offsetInHours;
    return convertedDate;
  }
  // Set data from props to state of component
  useEffect(() => {
    console.log("MAINFORM PROPS", props);
    setbuttonFilesId(getUUID());
    if (props.userTask.docList !== "null" && props.userTask.docList !== null) {
      let parsedData = JSON.parse(props.userTask.docList);
      console.log("DOCL", parsedData);
      setDocList(parsedData);
      setSize(parseInt(props.userTask.size));
      setPage(parseInt(props.userTask.page));
      setTotalCount(parseInt(props.userTask.totalCount));
      setGridTableId(getUUID());
      // setFilteredDocList(parsedData)
      // setInitialDocList(parsedData)
      // filterDocList(0, parseInt(props.userTask.size)-1, parsedData)
    }
    if (
      props.userTask.selectedDoc !== "null" &&
      props.userTask.selectedDoc !== undefined &&
      props.userTask.selectedDoc !== null
    ) {
      let parsedSelectedDoc = JSON.parse(props.userTask.selectedDoc);
      let fields = {};
      // let Form = props.userTask.Form
      for (let s = 0; s < Form.sections.length; s++) {
        for (let c = 0; c < Form.sections[s].contents.length; c++) {
          let fieldName = Form.sections[s].contents[c].name;
          fields[fieldName] = parsedSelectedDoc[fieldName];
        }
      }
      console.log("SDOC", parsedSelectedDoc);
      // console.log("FIELDVAL", fields)
      setSelectedDoc(parsedSelectedDoc);
      setFieldValue(fields);
    }
    if (
      props.userTask.tableFormButtons !== "null" &&
      props.userTask.tableFormButtons !== undefined &&
      props.userTask.tableFormButtons !== null
    ) {
      setTableFormButtons(props.userTask.tableFormButtons);
    }
    if (
      props.userTask.enumData !== null &&
      props.userTask.enumData !== undefined &&
      props.userTask.enumData !== "null"
    ) {
      let newEnumOptions = {};
      for (let i = 0; i < props.userTask.enumData.length; i++) {
        let options = [
          {
            value: "",
            label: "Пусто",
            name: props.userTask.enumData[i].name,
          },
        ];
        for (let d = 0; d < props.userTask.enumData[i].data.length; d++) {
          options.push({
            value: props.userTask.enumData[i].data[d].id,
            label: props.userTask.enumData[i].data[d].label,
            name: props.userTask.enumData[i].name,
          });
        }
        newEnumOptions[props.userTask.enumData[i].name] = options;
      }
      setEnumOptions(newEnumOptions);
    }
    if (
      props.userTask.size !== undefined &&
      props.userTask.size !== "null" &&
      props.userTask.size !== null
    ) {
      setSize(parseInt(props.userTask.size));
      setPage(parseInt(props.userTask.page));
    }
    setUpdateState(getUUID());
  }, []);
  // Functions from props
  function sendFieldValues(commandJson) {
    props.sendFieldValues(commandJson);
  }
  function clearTabData(process_id) {
    props.clearTabData(process_id);
  }
  /**********************************************************************Pagination functions******************************************************************************/
  //Переход на первую страницу
  function KeyboardArrowFirstClick() {
    if (page !== 1) {
      setPage(1);
      let filterDoc = getFieldValuesFilterDocuments();
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "paginationClick" },
          searchBody: { value: JSON.stringify(filterDoc) },
          size: { value: size },
          page: { value: page - page + 1 },
        },
      };
      console.log("paginationClick:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    } else {
      setSnackBarMessage("Вы на первой странице!");
      setShowSnackBar(true);
    }
  }
  //Переход налево
  function KeyboardArrowLeftClick() {
    if (page === 1) {
      setSnackBarMessage("Вы на первой странице!");
      setShowSnackBar(true);
    } else {
      setPage(page - 1);
      let filterDoc = getFieldValuesFilterDocuments();
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "paginationClick" },
          searchBody: { value: JSON.stringify(filterDoc) },
          size: { value: size },
          page: { value: page - 1 },
        },
      };
      console.log("paginationClick:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
  }
  //Переход направо
  function KeyboardArrowRightClick() {
    if (docList.length < size) {
      setSnackBarMessage("Больше нет данных!");
      setShowSnackBar(true);
    } else {
      setPage(page + 1);
      let filterDoc = getFieldValuesFilterDocuments();
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "paginationClick" },
          searchBody: { value: JSON.stringify(filterDoc) },
          size: { value: size },
          page: { value: page + 1 },
        },
      };
      console.log("paginationClick:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    }
  }
  //Количество страниц
  function getPageAmount() {
    let pagesFloat = totalCount / size;
    let mathRoundOfPages = Math.round(pagesFloat);
    if (pagesFloat > mathRoundOfPages) {
      return mathRoundOfPages + 1;
    } else {
      return mathRoundOfPages;
    }
  }
  function handlePageChange(event) {
    setPage(event.target.value);
  }
  /**********************************************************************************************************************************************************/
  function handleCloseSnackBar() {
    setShowSnackBar(false);
  }
  // random UUID generator
  function getUUID() {
    const uuidv1 = require("uuid/v1");
    return uuidv1();
  }
  // random numbers generator
  function keyGen(length) {
    var password = generator.generate({
      length: length,
      numbers: true,
    });
    return password;
  }
  function swAllert(text, icon) {
    return swal({
      text: text,
      icon: icon,
      buttons: { ok: "Ок" },
    });
    // .then((click) => {
    //   if(click === "ok"){
    //     console.log("CLICK OK", click)
    //   }
    // })
  }
  // Collect data to save doc
  function getFieldValuesSaveDocument() {
    let docToSave = {};
    for (let s = 0; s < Form.sections.length; s++) {
      for (let c = 0; c < Form.sections[s].contents.length; c++) {
        let fieldName = Form.sections[s].contents[c].name;
        if (
          Form.sections[s].contents[c].type === "Bool" &&
          fieldValue[fieldName] === undefined
        ) {
          docToSave[fieldName] = false;
        } else {
          docToSave[fieldName] = fieldValue[fieldName];
        }
      }
    }
    return docToSave;
  }
  // Collect data to update doc
  function getFieldValuesUpdateDocument() {
    let docToUpdate = {};
    docToUpdate["created_at"] = selectedDoc.created_at;
    docToUpdate["id"] = parseInt(docId);
    for (let s = 0; s < Form.sections.length; s++) {
      for (let c = 0; c < Form.sections[s].contents.length; c++) {
        let fieldName = Form.sections[s].contents[c].name;
        if (
          Form.sections[s].contents[c].type === "Bool" &&
          (fieldValue[fieldName] === undefined ||
            fieldValue[fieldName] === null)
        ) {
          docToUpdate[fieldName] = false;
        } else {
          docToUpdate[fieldName] = fieldValue[fieldName];
        }
      }
    }
    return docToUpdate;
  }

  function checkForRequieredFields() {
    let checkedSuccessfuly = false;
    for (let s = 0; s < Form.sections.length; s++) {
      for (let c = 0; c < Form.sections[s].contents.length; c++) {
        let fieldName = Form.sections[s].contents[c].name;
        if (
          Form.sections[s].contents[c].required === true &&
          (fieldValue[fieldName] === undefined ||
            fieldValue[fieldName] === null ||
            fieldValue[fieldName] === "NaN.NaN.NaN" ||
            fieldValue[fieldName].length === 0)
        ) {
          checkedSuccessfuly = false;
          swAllert(
            'Внимание заполните поле "' +
              Form.sections[s].contents[c].label +
              '"'
          );
          break;
        } else {
          checkedSuccessfuly = true;
        }
      }
    }
    return checkedSuccessfuly;
  }

  //(для фильтрации)Сбор данных с полей интерфейса и формирования структуры для API
  function getFieldValuesFilterDocuments() {
    let attrs = {
      attributes: [],
    };
    if (Form !== null && Form !== "null") {
      for (let s = 0; s < Form.sections.length; s++) {
        for (let c = 0; c < Form.sections[s].contents.length; c++) {
          if (Form.sections[s].contents[c].searchable === true) {
            let name = Form.sections[s].contents[c].name;
            if (
              fieldValue[name] !== undefined &&
              fieldValue[name] !== null &&
              fieldValue[name] !== "" &&
              fieldValue[name] !== "NaN.NaN.NaN"
            ) {
              attrs.attributes.push({ name: name, value: fieldValue[name] });
            }
          }
        }
      }
    }

    if (attrs.attributes.length === 0) {
      return {};
    } else {
      return attrs;
    }
  }

  /*********************************USER_ACTION - действие пользователя***********************************************************************************************/
  function buttonClick(name, item) {
    if (name === "filterClMonthDocList") {
      let filterDoc = getFieldValuesFilterDocuments();

      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "filterClMonthDocList" },
          searchBody: { value: JSON.stringify(filterDoc) },
          size: { value: size },
          page: { value: page },
          selectedDoc: { value: JSON.stringify(fieldValue) },
        },
      };
      console.log("filterClMonthDocList:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    } else if (name === "createClosedMonthList") {
      let filterDoc = getFieldValuesFilterDocuments();
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "createClosedMonthList" },
          searchBody: { value: JSON.stringify(filterDoc) },
          year: { value: fieldValue["Year"] },
          month: { value: fieldValue["Month"] },
        },
      };
      console.log("createClosedMonthList:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    } else if (name === "completeCloseMonth") {
      let filterDoc = getFieldValuesFilterDocuments();
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "completeCloseMonth" },
          searchBody: { value: JSON.stringify(filterDoc) },
        },
      };
      console.log("completeCloseMonth:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    } else if (name === "openClMonthDocList") {
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "openClMonthDocList" },
          docId: { value: item.id },
        },
      };
      console.log("openClMonthDocList:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    } else if (name === "openBankAccountGetList") {
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "openBankAccountGetList" },
          docId: { value: item.id },
        },
      };
      console.log("openBankAccountGetList:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    } else if (name === "openBankAccountGetList") {
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "openBankAccountGetList" },
          docId: { value: item.id },
        },
      };
      console.log("openBankAccountGetList:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    } else if (name === "openBankAccountGetGrid") {
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "openBankAccountGetGrid" },
          docId: { value: item.id },
        },
      };
      console.log("openBankAccountGetGrid:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    } else if (name === "openBankAccDistrRegister") {
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "openBankAccDistrRegister" },
          docId: { value: item.id },
        },
      };
      console.log("openBankAccDistrRegister:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    } else if (name === "completeBankAccount") {
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "completeBankAccount" },
        },
      };
      console.log("completeBankAccount:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    } else if (name === "openUploadGetList") {
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "openUploadGetList" },
          docId: { value: item.id },
        },
      };
      console.log("openUploadGetList:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    } else if (name === "openPayRegisterGetList") {
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "openPayRegisterGetList" },
          docId: { value: item.id },
        },
      };
      console.log("openPayRegisterGetList:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    } else if (name === "openRegDistrDetailForm") {
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "openRegDistrDetailForm" },
          docId: { value: item.id },
        },
      };
      console.log("openRegDistrDetailForm:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    } else if (name === "createPayRegPreview") {
      let filterDoc = getFieldValuesFilterDocuments();
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "createPayRegPreview" },
          searchBody: { value: JSON.stringify(filterDoc) },
          year: { value: fieldValue["Year"] },
          month: { value: fieldValue["Month"] },
        },
      };
      console.log("createPayRegPreview:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    } else if (name === "openPreviewDocList") {
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          selectedDoc: { value: JSON.stringify(item) },
          userAction: { value: "openPreviewDocList" },
          docId: { value: item.id },
        },
      };
      console.log("button openPreviewDocList: ", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    } else if (name === "completePreviewDocList") {
      let filterDoc = getFieldValuesFilterDocuments();
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "completePreviewDocList" },
        },
      };
      console.log("completePreviewDocList:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    } else if (name === "downloadToExcel") {
      tableToExcel.render(gridTableId);
    } else if (name === "createDocument") {
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "createDocument" },
        },
      };
      console.log("createDocument:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    } else if (name === "cancel") {
      const commandJson = {
        commandType: "completeTask",
        process_id: process_id,
        session_id: session_id,
        taskID: taskID,
        userRole: userProfile.userRole,
        variables: {
          authorization: { value: "token" },
          userAction: { value: "cancel" },
        },
      };
      console.log("button cancel: ", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    } else if (name === "openDocument") {
      // console.log("ITEM", item)
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          selectedDoc: { value: JSON.stringify(item) },
          userAction: { value: "openDocument" },
          docId: { value: item.id },
        },
      };
      console.log("button openDocument: ", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    } else if (name === "openReferenceDocument") {
      // console.log("ITEM", item)
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          apiName: { value: item.controller },
          userAction: { value: "openReferenceDocument" },
          gridFormDefId: { value: item.grid_form },
          creatingFormDefId: { value: item.creating_form },
          editFormDefId: { value: item.edit_form },
        },
      };
      console.log("button openReferenceDocument: ", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    } else if (name === "updateDocument") {
      let updateBody = getFieldValuesUpdateDocument();
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "updateDocument" },
          document: { value: JSON.stringify(updateBody) },
        },
      };
      console.log("updateDocument:", commandJson);
      sendFieldValues(commandJson);
      // swAllert("Данные успешно обновлены!", "success")
      clearTabData(process_id);
    } else if (name === "saveDocument") {
      let docToSave = getFieldValuesSaveDocument();
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "saveDocument" },
          document: { value: JSON.stringify(docToSave) },
        },
      };
      console.log("saveDocument:", commandJson);
      sendFieldValues(commandJson);
      // swAllert("Данные сохранены!", "success")
      clearTabData(process_id);
    } else if (name === "back") {
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "back" },
        },
      };
      console.log("button back:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    } else {
      console.log("UNKNOWN Button ", name);
    }
  }
  // Convert date to approptiate format
  function parseDate(date) {
    try {
      var newDate = new Date(date); // "2020-01-26"
      var dd = String(newDate.getDate()).padStart(2, "0");
      var mm = String(newDate.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = newDate.getFullYear();
      var convertedDate = yyyy + "-" + mm + "-" + dd;
      // console.log("CDATE", convertedDate)
      return convertedDate;
    } catch (er) {
      return "NaN.NaN.NaN";
    }
  }
  // Create sections with labels and call bodyBuilder function
  function sectionBuilder(section) {
    return (
      <Table size="small" key={keyGen(5)}>
        <TableHead>
          <TableRow style={{ height: 30 }}>
            <TableCell
              key={keyGen(5)}
              style={{
                color: "white",
                fontSize: 14,
                backgroundColor: "#75879d",
                width: "100%",
                fontWeight: "bold",
              }}
            >
              {section.label}
            </TableCell>
          </TableRow>
        </TableHead>
        {bodyBuilder(section)}
      </Table>
    );
  }
  // Create body of each section and call contentBuilder function
  function bodyBuilder(section) {
    return (
      <Table size="small">
        <TableBody>
          {section.contents.map(
            (contentItem) =>
              contentItem.show === true && (
                <TableRow key={keyGen(5)} style={{ maxHeight: 30 }}>
                  <TableCell
                    key={keyGen(5)}
                    align="left"
                    style={{ width: "40%" }}
                  >
                    {contentItem.label}
                  </TableCell>
                  <TableCell
                    key={keyGen(5)}
                    align="left"
                    style={{ width: "60%", height: 30 }}
                  >
                    {contentBuilder(contentItem)}
                  </TableCell>
                </TableRow>
              )
          )}
        </TableBody>
      </Table>
    );
  }
  // Creating components by it's type
  function contentBuilder(contentItem) {
    // if(contentItem.show === true)
    // }
    if (contentItem.type === "Text") {
      return (
        <TextField
          multiline
          onBlur={handleChange}
          name={contentItem.name}
          style={{ width: "100%" }}
          disabled={
            formType === "view" || contentItem.edit === false ? true : false
          }
          defaultValue={
            fieldValue[contentItem.name] ? fieldValue[contentItem.name] : ""
          }
        />
      );
    } else if (contentItem.type === "Enum") {
      let selectedOption = {
        value: "",
        label: "Пусто",
        name: contentItem.name,
      };
      if (fieldValue[contentItem.name] !== undefined) {
        for (let i = 0; i < enumOptions[contentItem.name].length; i++) {
          if (
            parseInt(fieldValue[contentItem.name]) ===
            enumOptions[contentItem.name][i].value
          ) {
            selectedOption = enumOptions[contentItem.name][i];
            break;
          }
        }
      }
      if (selectedOptions.length !== 0) {
        for (let i = 0; i < selectedOptions.length; i++) {
          if (contentItem.name === selectedOptions[i].name) {
            selectedOption = selectedOptions[i];
          }
        }
      }
      return (
        <Select
          name={contentItem.name}
          value={selectedOption}
          onChange={handleSelectChange}
          options={enumOptions[contentItem.name]}
          isDisabled={
            formType === "view" || contentItem.edit === false ? true : false
          }
        />
      );
    } else if (contentItem.type === "Bool") {
      return (
        <Checkbox
          key={keyGen(5)}
          style={{
            maxWidth: 20,
            height: 15,
            color:
              formType === "view" || contentItem.edit === false
                ? "#37474f"
                : "grey",
          }}
          name={contentItem.name}
          onChange={handleCheckboxChange}
          disabled={
            formType === "view" || contentItem.edit === false ? true : false
          }
          checked={
            fieldValue[contentItem.name] === false ||
            fieldValue[contentItem.name] === null ||
            fieldValue[contentItem.name] === undefined
              ? false
              : true
          }
        />
      );
    } else if (contentItem.type === "Int") {
      return (
        <TextField
          disabled={
            formType === "view" || contentItem.edit === false ? true : false
          }
          style={{ width: "100%" }}
          defaultValue={
            fieldValue[contentItem.name] !== undefined
              ? fieldValue[contentItem.name]
              : ""
          }
          // value = {(fieldValue[contentItem.name] !== undefined) ? fieldValue[contentItem.name]: ""}
          onBlur={handleIntChange}
          name={contentItem.name}
          InputProps={{ inputComponent: IntegerFormat }}
        />
      );
    } else if (contentItem.type === "Float") {
      console.log("FLOAT VAL", fieldValue[contentItem.name]);
      return (
        <TextField
          name={contentItem.name}
          onBlur={handleFloatChange}
          value={fieldValue[contentItem.name]}
          style={{ width: "100%" }}
          disabled={
            formType === "view" || contentItem.edit === false ? true : false
          }
          InputProps={{ inputComponent: FloatFormat }}
        />
      );
    } else if (contentItem.type === "DateTime") {
      return (
        <TextField
          type="date"
          name={contentItem.name}
          onBlur={handleDateTimeChange}
          style={{ width: "100%" }}
          defaultValue={
            fieldValue[contentItem.name] !== undefined
              ? parseDate(fieldValue[contentItem.name])
              : ""
          }
          disabled={
            formType === "view" || contentItem.edit === false ? true : false
          }
          InputLabelProps={{
            shrink: true,
          }}
        />
      );
    }
  }
  // Create grid form components
  function getGridFormItems(attribute, formItem) {
    // console.log("ITEM", attribute, formItem)
    if (formItem.type === "Text") {
      if (
        attribute.value === null ||
        attribute.value === "" ||
        attribute.value === undefined
      ) {
        return (
          <td align="center" style={{ color: "black", fontSize: 12 }}>
            -
          </td>
        );
      } else {
        return <td>{attribute.value}</td>;
      }
    } else if (formItem.type === "DateTime") {
      if (
        attribute.value === null ||
        attribute.value === "" ||
        attribute.value === undefined
      ) {
        return (
          <td align="center" style={{ color: "black", fontSize: 12 }}>
            -
          </td>
        );
      } else {
        // console.log("ITEM", dataItem, value)
        let dateRev = attribute.value.substring(0, 10);
        let date = Moment(dateRev).format("DD-MM-YYYY");
        return date;
        //  + " " + Time
      }
    } else if (formItem.type === "Float") {
      if (
        attribute.value === null ||
        attribute.value === "" ||
        attribute.value === undefined
      ) {
        return (
          <td align="center" style={{ color: "black", fontSize: 12 }}></td>
        );
      } else {
        return <td>{parseFloat(attribute.value).toFixed(2)}</td>;
      }
    } else if (formItem.type === "Int") {
      if (
        attribute.value === null ||
        attribute.value === "" ||
        attribute.value === undefined
      ) {
        return (
          <td align="center" style={{ color: "black", fontSize: 12 }}></td>
        );
      } else {
        return <td>{attribute.value}</td>;
      }
    }
  }
  // console.log("FIELDS", fieldValue)
  // console.log("SOP", selectedOptions)
  if (updateState !== null) {
    try {
      return (
        <Grid>
          1{/* Create main search table */}
          {Form !== null && Form !== "null" && (
            <Grid
              container
              direction="row"
              justify="flex-start"
              spacing={0}
              style={{ marginTop: 17, borderRadius: "30px" }}
            >
              2
              <Grid
                item
                sm={"auto"}
                style={{
                  border: "solid 0.1px #c5c5c5",
                  borderCollapse: "collapse",
                  fontFamily: "Courier",
                }}
              >
                3
                <Paper>
                  4
                  <Table
                    style={{
                      border: "solid 0.1px #949494",
                      borderCollapse: "collapse",
                      fontFamily: "Courier",
                    }}
                    bordered
                    size="small"
                  >
                    5
                    <Grid
                      container
                      direction="row"
                      justify="center"
                      alignItems="center"
                    >
                      5,1
                      <TableHead>
                        <TableRow style={{ maxHeight: 25 }}>
                          <TableCell
                            style={{
                              fontSize: 14,
                              color: "black",
                              fontFamily: "Courier",
                            }}
                          >
                            {Form.label}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      5,1
                    </Grid>
                    5,2
                    <Grid
                      container
                      direction="row"
                      justify="center"
                      alignItems="center"
                    >
                      {Form.sections.map((section) => {
                        return sectionBuilder(section);
                      })}
                    </Grid>
                    5,2
                    {/* 3 */}
                    <Grid
                      container
                      direction="row"
                      justify="center"
                      alignItems="flex-start"
                      style={{ padding: 5 }}
                    >
                      6
                      {buttons.map((button, index) =>
                        button.name === "selectFile" ? (
                          <div className={classes.importFile}>
                            <input
                              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                              className={classes.inputFile}
                              id={buttonFilesId}
                              multiple
                              type="file"
                              onChange={handleAttachFile}
                            />
                            <label htmlFor={buttonFilesId}>
                              <Button
                                component="span"
                                key={index}
                                variant="outlined"
                                style={{
                                  padding: 6,
                                  margin: 6,
                                  height: 25,
                                  fontSize: 10,
                                  color: button.color,
                                  backgroundColor: button.backgroundColor,
                                  borderColor: "#000080",
                                }}
                                endIcon={<AttachFileIcon />}
                              >
                                Прикрепить файл
                              </Button>
                            </label>
                          </div>
                        ) : (
                          <Button
                            key={index}
                            name={button.name}
                            variant="outlined"
                            onClick={() => buttonClick(button.name, null)}
                            style={{
                              padding: 6,
                              margin: 6,
                              height: 25,
                              fontSize: 10,
                              color: button.color,
                              backgroundColor: button.backgroundColor,
                              borderColor: "#000080",
                            }}
                          >
                            {button.label}
                          </Button>
                        )
                      )}
                      6
                    </Grid>
                    5
                  </Table>
                  4
                </Paper>
                3
              </Grid>
              2
            </Grid>
          )}
          <br></br>
          <Grid>
            7
            {tableFormButtons !== null &&
              tableFormButtons.map((button) => (
                <Button
                  key={button.name}
                  name={button.name}
                  variant="outlined"
                  // id={dataItem.id}
                  value={button.name}
                  onClick={() => buttonClick(button.name, null)}
                  style={{
                    padding: 6,
                    margin: 6,
                    height: 25,
                    fontSize: 10,
                    color: button.color,
                    backgroundColor: button.backgroundColor,
                    borderColor: "#000080",
                  }}
                >
                  {button.label}
                </Button>
              ))}
            7
          </Grid>
          {/* Create grid table with data from doclist */}
          {docList !== null ? (
            <Grid
              container
              direction="row"
              justify="flex-start"
              spacing={0}
              style={{ borderRadius: "15px" }}
            >
              8
              <Grid
                item
                sm={"auto"}
                style={{
                  backgroundColor: "#F7F7F7",
                  border: "solid 0.1px #c5c5c5",
                  fontFamily: "Courier",
                }}
              >
                9
                <Paper>
                  10
                  <table
                    id={gridTableId}
                    size="auto"
                    style={{ width: "100%", "border-collapse": "collapse" }}
                  >
                    11
                    <thead size="auto" style={{ backgroundColor: "#DEDEEF" }}>
                      <tr>
                        {gridFormButtons !== null &&
                          gridFormButtons.length > 0 && (
                            <td
                              colSpan="1"
                              style={{
                                color: "black",
                                fontSize: 18,
                                border: "1px solid grey",
                                "text-align": "center",
                              }}
                            ></td>
                          )}
                        {gridForm.sections.map((section) => {
                          return (
                            <td
                              colSpan={section.contents.length}
                              key={keyGen(5)}
                              style={{
                                color: "black",
                                fontSize: 13,
                                border: "1px solid grey",
                                "text-align": "center",
                                "font-weight": "bold",
                              }}
                            >
                              {section.label}
                            </td>
                          );
                        })}
                      </tr>
                      <tr>
                        {gridFormButtons !== null &&
                          gridFormButtons.length > 0 && (
                            <td
                              rowSpan="2"
                              key={"action"}
                              style={{
                                color: "black",
                                fontSize: 12,
                                border: "1px solid grey",
                                "text-align": "center",
                                "font-weight": "bold",
                                minWidth: "70px",
                                "border-bottom": "1px solid grey",
                                padding: 10,
                              }}
                            >
                              Действие
                            </td>
                          )}
                        {gridForm.sections.map((section) =>
                          section.contents.map((contentItem) => {
                            return (
                              <td
                                rowSpan="2"
                                key={keyGen(5)}
                                style={{
                                  color: "black",
                                  fontSize: 12,
                                  border: "1px solid grey",
                                  "text-align": "center",
                                  "font-weight": "bold",
                                  padding: 10,
                                }}
                              >
                                {contentItem.label}
                              </td>
                            );
                          })
                        )}
                      </tr>
                      11
                    </thead>
                    <TableBody>
                      12
                      {Object.keys(docList).length !== 0 &&
                        docList.map((dataItem) => (
                          <tr key={keyGen(5)} style={{ height: 30 }}>
                            13
                            {gridFormButtons !== null &&
                              gridFormButtons.length > 0 && (
                                <td
                                  key={keyGen(5)}
                                  style={{
                                    maxWidth: 34,
                                    "border-bottom": "1px solid grey",
                                  }}
                                >
                                  {gridFormButtons !== "null" &&
                                    gridFormButtons.map((button) => (
                                      <Button
                                        key={button.name}
                                        name={button.name}
                                        variant="outlined"
                                        value={button.name}
                                        onClick={() =>
                                          buttonClick(button.name, dataItem)
                                        }
                                        style={{
                                          marginTop: 4,
                                          marginBottom: 4,
                                          height: 25,
                                          fontSize: 10,
                                          maxWidth: 36,
                                          color: button.color,
                                          fontWeight: button.fontWeight,
                                          backgroundColor:
                                            button.backgroundColor,
                                          borderColor: "#000080",
                                        }}
                                      >
                                        {button.label}
                                      </Button>
                                    ))}
                                </td>
                              )}
                            {gridForm.sections.map((section) => {
                              return section.contents.map((contentItem) => {
                                for (
                                  let a = 0;
                                  a < dataItem.attributes.length;
                                  a++
                                ) {
                                  // console.log("ITEM AZA", dataItem.attributes[a].name, "ITEM KGS", contentItem.name)
                                  //dataItem.attributes[a].name - название поля из API
                                  //contentItem.name - название поля из JSON
                                  if (
                                    dataItem.attributes[a].name ===
                                    contentItem.name
                                  ) {
                                    return (
                                      <td
                                        key={keyGen(5)}
                                        style={{
                                          "text-align": "center",
                                          color: "black",
                                          fontSize: 12,
                                          "border-bottom": "1px solid grey",
                                          minWidth: "70px",
                                        }}
                                      >
                                        {getGridFormItems(
                                          dataItem.attributes[a],
                                          contentItem
                                        )}
                                      </td>
                                    );
                                  }
                                }
                              });
                            })}
                            13
                          </tr>
                        ))}
                      12
                    </TableBody>
                  </table>
                  <tfoot>
                    <tr>
                      <td width="80%">
                        <td>
                          <Tooltip title="Переход на первую страницу">
                            <IconButton
                              onClick={() => KeyboardArrowFirstClick()}
                            >
                              <FirstPageIcon
                                style={{ fontSize: "large", color: "black" }}
                              />
                            </IconButton>
                          </Tooltip>
                        </td>
                        <td>
                          <Tooltip title="Переход на предыдущюю страницу">
                            <IconButton
                              onClick={() => KeyboardArrowLeftClick(page)}
                            >
                              <ArrowBackIosIcon
                                style={{ fontSize: "medium", color: "black" }}
                              />
                            </IconButton>
                          </Tooltip>
                        </td>
                        <td style={{ color: "black", fontSize: 14 }}>
                          <input
                            style={{ maxWidth: 25, textAlign: "center" }}
                            value={page}
                            onChange={handlePageChange}
                          ></input>
                        </td>
                        <td>
                          <Tooltip title="Переход на следующюю страницу">
                            <IconButton
                              onClick={() => KeyboardArrowRightClick(page)}
                            >
                              <ArrowForwardIosIcon
                                style={{ fontSize: "medium", color: "black" }}
                              />
                            </IconButton>
                          </Tooltip>
                        </td>
                        <td style={{ color: "black", fontSize: 14 }}>
                          Стр. {page} из {getPageAmount()}
                        </td>
                      </td>
                      <td width="20%" style={{ fontSize: 14 }}>
                        Кол-во строк: {totalCount}
                      </td>
                    </tr>
                  </tfoot>
                  10
                </Paper>
                9
              </Grid>
              8
            </Grid>
          ) : (
            <Grid container direction="row" justify="flex-start" spacing={0}>
              <Grid
                item
                sm={"auto"}
                style={{
                  backgroundColor: "#F7F7F7",
                  border: "solid 0.1px #c5c5c5",
                  fontFamily: "Courier",
                }}
              >
                <Paper>
                  <table
                    id={gridTableId}
                    size="auto"
                    style={{ width: "100%", "border-collapse": "collapse" }}
                  >
                    <thead size="auto" style={{ backgroundColor: "#DEDEEF" }}>
                      <tr>
                        {gridFormButtons !== null &&
                          gridFormButtons.length > 0 && (
                            <td
                              colSpan="1"
                              style={{
                                color: "black",
                                fontSize: 18,
                                border: "1px solid grey",
                                "text-align": "center",
                              }}
                            ></td>
                          )}
                        {gridForm.sections.map((section) => {
                          return (
                            <td
                              colSpan={section.contents.length}
                              key={keyGen(5)}
                              style={{
                                color: "black",
                                fontSize: 13,
                                fontFamily: "Courier",
                                border: "1px solid grey",
                                "text-align": "center",
                                "font-weight": "bold",
                              }}
                            >
                              {section.label}
                            </td>
                          );
                        })}
                      </tr>
                      <tr>
                        {gridFormButtons !== null &&
                          gridFormButtons.length > 0 && (
                            <td
                              rowSpan="2"
                              key={"action"}
                              style={{
                                color: "black",
                                fontSize: 12,
                                border: "1px solid grey",
                                "text-align": "center",
                                "font-weight": "bold",
                                minWidth: "70px",
                                "border-bottom": "1px solid grey",
                                padding: 10,
                              }}
                            >
                              Действие
                            </td>
                          )}
                        {gridForm.sections.map((section) =>
                          section.contents.map((contentItem) => {
                            return (
                              <td
                                rowSpan="2"
                                key={keyGen(5)}
                                style={{
                                  color: "black",
                                  fontSize: 12,
                                  border: "1px solid grey",
                                  "text-align": "center",
                                  "font-weight": "bold",
                                  padding: 10,
                                }}
                              >
                                {contentItem.label}
                              </td>
                            );
                          })
                        )}
                      </tr>
                    </thead>
                  </table>
                  <tfoot>
                    <tr>
                      <td width="80%">
                        <td>
                          <Tooltip title="Переход на первую страницу">
                            <IconButton
                              onClick={() => KeyboardArrowFirstClick()}
                            >
                              <FirstPageIcon
                                style={{ fontSize: "large", color: "black" }}
                              />
                            </IconButton>
                          </Tooltip>
                        </td>
                        <td>
                          <Tooltip title="Переход на предыдущюю страницу">
                            <IconButton
                              onClick={() => KeyboardArrowLeftClick(page)}
                            >
                              <ArrowBackIosIcon
                                style={{ fontSize: "medium", color: "black" }}
                              />
                            </IconButton>
                          </Tooltip>
                        </td>
                        <td style={{ color: "black", fontSize: 14 }}>
                          <input
                            style={{ maxWidth: 25, textAlign: "center" }}
                            value={page}
                            onChange={handlePageChange}
                          ></input>
                        </td>
                        <td>
                          <Tooltip title="Переход на следующюю страницу">
                            <IconButton
                              onClick={() => KeyboardArrowRightClick(page)}
                            >
                              <ArrowForwardIosIcon
                                style={{ fontSize: "medium", color: "black" }}
                              />
                            </IconButton>
                          </Tooltip>
                        </td>
                        <td style={{ color: "black", fontSize: 14 }}>
                          Стр. {page} из {getPageAmount()}
                        </td>
                      </td>
                      <td width="20%" style={{ fontSize: 14 }}>
                        Кол-во строк: {totalCount}
                      </td>
                    </tr>
                  </tfoot>
                </Paper>
              </Grid>
            </Grid>
          )}
          <Snackbar
            open={showSnackBar}
            autoHideDuration={1200}
            onClose={() => handleCloseSnackBar()}
          >
            <Alert severity="error">
              <strong>{snackBarMessage}</strong>
            </Alert>
          </Snackbar>
          1
        </Grid>
      );
    } catch (er) {
      console.log("ERROR", er);
      return <CircularProgress color="secondary" />;
    }
  }
};
