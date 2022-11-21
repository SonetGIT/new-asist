import React, { useState, useEffect } from "react";
// import clsx from 'clsx';
// import { makeStyles} from '@material-ui/core/styles';
import MTable from "@material-ui/core/Table"; // Material ui table for usual form
import TableFooter from "@material-ui/core/TableFooter";
import { Table } from "reactstrap"; // Core ui table for grid form
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
import Snackbar from "@material-ui/core/Snackbar";
// Form components
import TextField from "@material-ui/core/TextField";
import Select from "react-select";
import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@material-ui/core/Tooltip";
// Libraries
import swal from "sweetalert"; // https://sweetalert.js.org/guides/

var generator = require("generate-password");

export default (props) => {
  // This.state
  const [userProfile] = useState(props.userProfile);
  const [session_id] = useState(props.userTask.session_id);
  const [process_id] = useState(props.userTask.process_id);
  const [taskID] = useState(props.userTask.taskID);
  const [Form] = useState(props.userTask.Form);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [userEnabled, setUserEnabled] = useState(null);
  const [formType] = useState(props.userTask.formType);
  const [docList, setDocList] = useState(null);
  const [filteredDocList, setFilteredDocList] = useState(null);
  const [initialDocList, setInitialDocList] = useState(null);
  const [gridForm] = useState(props.userTask.gridForm);
  const [gridFormButtons] = useState(props.userTask.gridFormButtons);
  const [enumData] = useState(props.userTask.enumData);
  const [gridFormEnumData] = useState(props.userTask.gridFormEnumData);
  const [fieldValue, setFieldValue] = useState({});
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [buttons] = useState(props.userTask.buttons);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [sectionColor] = useState("#B2E0C9");
  const [updateState, setUpdateState] = useState(false);

  const handleCheckboxChange = (event) => {
    if (event.target.name === "selectAllAdminFunctions") {
      for (let s = 0; s < Form.sections.length; s++) {
        if (Form.sections[s].name === "administartor") {
          for (let c = 0; c < Form.sections[s].contents.length; c++) {
            fieldValue[Form.sections[s].contents[c].name] =
              event.target.checked;
            setFieldValue(fieldValue);
          }
        }
      }
    } else if (event.target.name === "selectAllTradingFunctions") {
      for (let s = 0; s < Form.sections.length; s++) {
        if (Form.sections[s].name === "tradingSystems") {
          for (let c = 0; c < Form.sections[s].contents.length; c++) {
            fieldValue[Form.sections[s].contents[c].name] =
              event.target.checked;
            setFieldValue(fieldValue);
          }
        }
      }
    } else if (event.target.name === "selectAllMainFunctions") {
      for (let s = 0; s < Form.sections.length; s++) {
        if (Form.sections[s].name === "mainFunctions") {
          for (let c = 0; c < Form.sections[s].contents.length; c++) {
            fieldValue[Form.sections[s].contents[c].name] =
              event.target.checked;
            setFieldValue(fieldValue);
          }
        }
      }
    } else if (event.target.name === "selectAllAccountingFunctions") {
      for (let s = 0; s < Form.sections.length; s++) {
        if (Form.sections[s].name === "accountingDepartment") {
          for (let c = 0; c < Form.sections[s].contents.length; c++) {
            fieldValue[Form.sections[s].contents[c].name] =
              event.target.checked;
            setFieldValue(fieldValue);
          }
        }
      }
    } else if (event.target.name === "selectAllMortgageFunctions") {
      for (let s = 0; s < Form.sections.length; s++) {
        if (Form.sections[s].name === "mortgageCoverage") {
          for (let c = 0; c < Form.sections[s].contents.length; c++) {
            fieldValue[Form.sections[s].contents[c].name] =
              event.target.checked;
            setFieldValue(fieldValue);
          }
        }
      }
    } else if (event.target.name === "selectAllInstructionTypes") {
      for (let s = 0; s < Form.sections.length; s++) {
        if (Form.sections[s].name === "InstructionsAccessSection") {
          for (let c = 0; c < Form.sections[s].contents.length; c++) {
            fieldValue[Form.sections[s].contents[c].name] =
              event.target.checked;
            setFieldValue(fieldValue);
          }
        }
      }
    } else if (event.target.name === "selectAllReportTypes") {
      for (let s = 0; s < Form.sections.length; s++) {
        if (Form.sections[s].name === "ReportsAccessSection") {
          for (let c = 0; c < Form.sections[s].contents.length; c++) {
            fieldValue[Form.sections[s].contents[c].name] =
              event.target.checked;
            setFieldValue(fieldValue);
          }
        }
      }
    } else {
      setFieldValue({
        ...fieldValue,
        [event.target.name]: event.target.checked,
      });
    }
    setUpdateState(getUUID());
  };
  // Set data from props to state of component
  useEffect(() => {
    console.log("User PROPS", props.userTask);
    if (props.userTask.docList !== "null" && props.userTask.docList !== null) {
      let parsedData = JSON.parse(props.userTask.docList);
      setFilteredDocList(parsedData);
      setInitialDocList(parsedData);
      filterDocList(0, 10, parsedData);
    }
    if (
      props.userTask.selectedDoc !== "null" &&
      props.userTask.selectedDoc !== null
    ) {
      let parsedDoc = JSON.parse(props.userTask.selectedDoc);
      setUserEnabled(parsedDoc.enabled);
      let fields = {
        // id: parsedDoc.id,
        username: parsedDoc.username,
        firstName: parsedDoc.firstName,
        lastName: parsedDoc.lastName,
        email: parsedDoc.email,
      };
      for (let i in parsedDoc.attributes) {
        // if(i === "userRole"){
        //   let role = getIdByRole(parsedDoc.attributes[i][0])
        //   fields[i] = role
        // }
        // else{
        let value =
          parsedDoc.attributes[i][0] === "true"
            ? true
            : parsedDoc.attributes[i][0] === "false"
            ? false
            : parsedDoc.attributes[i][0];
        fields[i] = value;
        // }
      }
      setFieldValue(fields);
      setSelectedDoc(parsedDoc);
      console.log("SDOC", parsedDoc);
    }
  }, []);
  // Functions from props
  function sendFieldValues(commandJson) {
    props.sendFieldValues(commandJson);
  }
  function clearTabData(process_id) {
    props.clearTabData(process_id);
  }
  // filter users by filled parameters
  function filterDocList(fetchFrom, fetchTo, Data) {
    // setDocList([])
    // console.log("FVAL", fieldValue)
    var newDocList = [];
    if (Object.keys(fieldValue).length === 0) {
      newDocList = Data;
    } else {
      for (let i = 0; i < Data.length; i++) {
        let match = false;
        for (let key in fieldValue) {
          if (fieldValue[key] === null || fieldValue[key] === "") {
            match = true;
          } else {
            if (Data[i][key] !== null) {
              if (typeof Data[i][key] === "string") {
                let searchField = fieldValue[key].toLowerCase();
                let dataField = Data[i][key].toLowerCase();
                let includeSearch = dataField.includes(searchField);
                console.log(
                  "SEARCH STR",
                  searchField,
                  dataField,
                  dataField.includes(searchField)
                );
                if (includeSearch === true) {
                  match = true;
                } else {
                  match = false;
                }
              } else {
                console.log("SEARCH OTHER", fieldValue[key], Data[i][key]);
                if (fieldValue[key] === Data[i][key]) {
                  match = true;
                } else {
                  match = false;
                }
              }
            } else {
              match = false;
            }
          }
        }
        if (match === true) {
          newDocList.push(Data[i]);
        }
      }
    }
    setDocList(newDocList);
    fetchBySize(fetchFrom, fetchTo, newDocList);
  }
  // get rows amount of filtered users by size
  function fetchBySize(fetchFrom, fetchTo, Data) {
    // console.log("fetchFrom", "fetchTo")
    let newDocList = [];
    for (let i = fetchFrom; i < fetchTo; i++) {
      if (Data[i] !== undefined) {
        let newUser = {
          id: Data[i].id,
          enabled: Data[i].enabled,
          username: Data[i].username,
          firstName: Data[i].firstName,
          lastName: Data[i].lastName,
          email: Data[i].email,
          userRole: Data[i].attributes.userRole[0],
          // partner: Data[i].attributes.partner[0],
          address: Data[i].attributes.address[0],
          phone: Data[i].attributes.phone[0],
        };
        newDocList.push(newUser);
      }
    }
    setDocList(newDocList);
    console.log("DOCL", newDocList);
  }
  function KeyboardArrowFirstClick() {
    if (page !== 1) {
      setPage(1);
      filterDocList(0, size - 1, initialDocList);
    } else {
      setSnackBarMessage("Вы на первой странице!");
      setShowSnackBar(true);
    }
  }
  function KeyboardArrowLeftClick(page) {
    if (page !== 1) {
      var prevPage = page - 1;
      setPage(prevPage);
      let fetchFrom = (prevPage - 1) * size; //10
      let fetchTo = size * prevPage - 1;
      filterDocList(fetchFrom, fetchTo, initialDocList);
    } else {
      setSnackBarMessage("Вы на первой странице!");
      setShowSnackBar(true);
    }
  }
  function KeyboardArrowRightClick(page) {
    if (docList.length < size - 1) {
      // console.log("NO DATA")
      setSnackBarMessage("Больше нет данных!");
      setShowSnackBar(true);
    } else {
      setPage(page + 1);
      let fetchFrom = size * page;
      let fetchTo = (page + 1) * size - 1;
      filterDocList(fetchFrom, fetchTo, initialDocList);
    }
  }
  function handleChangeRowsPerPage(event) {
    setSize(event.target.value);
    filterDocList(0, event.target.value - 1, initialDocList);
    console.log("Rows amount changed: ", event.target.value);
  }
  function handlePageChange(event) {
    setPage(event.target.value);
  }
  function GoToPage() {
    let fetchFrom = page * size - 1 - size;
    let fetchTo = page * size - 1;
    filterDocList(fetchFrom, fetchTo, initialDocList);
  }
  function getPageAmount() {
    let pagesFloat = (filteredDocList.length + 1) / size;
    let mathRoundOfPages = Math.round(pagesFloat);
    if (pagesFloat > mathRoundOfPages) {
      return mathRoundOfPages + 1;
    } else {
      return mathRoundOfPages;
    }
  }
  function getUUID() {
    const uuidv1 = require("uuid/v1");
    return uuidv1();
  }
  function keyGen(length) {
    var password = generator.generate({
      length: length,
      numbers: true,
    });
    return password;
  }
  function handleChange(event) {
    // console.log("EVENT", event.target.name, event.target.value)
    fieldValue[event.target.name] = event.target.value;
    setFieldValue(fieldValue);
    console.log("FIELDVALUE", fieldValue);
  }
  function handleSelectChange(event) {
    fieldValue[event.name] = event.value;
    setFieldValue(fieldValue);
    let updateSelectedOptions = selectedOptions.slice();
    let noSuchOption = true;
    for (let i = 0; i < updateSelectedOptions.length; i++) {
      if (event.name === updateSelectedOptions[i].name) {
        updateSelectedOptions[i] = event;
        setSelectedOptions(updateSelectedOptions);
        // console.log("SO", selectedOptions)
        noSuchOption = false;
        break;
      } else {
        noSuchOption = true;
      }
    }
    if (noSuchOption === true) {
      updateSelectedOptions.push(event);
      setSelectedOptions(updateSelectedOptions);
      // console.log("SO", selectedOptions)
    }

    if (
      event.name === "userRole" &&
      props.userTask.taskType === "showCreateUser"
    ) {
      if (event.value === 3) {
        // console.log("SO", event.name, event.value)
        for (let i = 0; i < Form.sections.length; i++) {
          for (let c = 0; c < Form.sections[i].contents.length; c++) {
            if (Form.sections[i].contents[c].type === "Bool") {
              fieldValue[Form.sections[i].contents[c].name] = true;
              setFieldValue(fieldValue);
            }
          }
        }
      }
    }
  }
  // Returns Id of role by label of role
  function getIdByRole(role) {
    // console.log("ROLE", role)
    for (let k = 0; k < enumData.length; k++) {
      if (enumData[k].name === "userRole") {
        for (let d = 0; d < enumData[k].data.length; d++) {
          if (role === enumData[k].data[d].label) {
            return enumData[k].data[d].id;
          }
        }
      }
    }
  }
  // Collect data to create new user in REST
  function getFieldValuesRest(keycloakUser) {
    let restUser = {
      user_id: null,
      name: fieldValue["username"],
      lastname: fieldValue["lastName"],
      firstname: fieldValue["firstName"],
      email: fieldValue["email"],
      attributes: JSON.stringify(keycloakUser.attributes),
    };
    for (let key in keycloakUser.attributes) {
      if (key === "userId") {
        restUser["user_id"] = keycloakUser.attributes[key];
      }
    }
    return restUser;
  }
  // Collect data to create new user
  function getFieldValuesKeycloakCreate() {
    let attrs = {
      locale: "ru",
      userId: getUUID(),
      enabled: true,
    };
    for (let s = 0; s < Form.sections.length; s++) {
      for (let c = 0; c < Form.sections[s].contents.length; c++) {
        let name = Form.sections[s].contents[c].name;
        let type = Form.sections[s].contents[c].type;
        // console.log("NAME ", name, "VAL", fieldValue[name])
        if (
          name !== "username" &&
          name !== "firstName" &&
          name !== "lastName" &&
          name !== "email"
        ) {
          if (type === "Enum") {
            let value = fieldValue[name];
            attrs[name] = value;
          } else if (type === "Text") {
            if (fieldValue[name] === "" || fieldValue[name] === undefined) {
              attrs[name] = "Не указано";
            } else {
              let value = fieldValue[name];
              attrs[name] = value;
            }
          } else if (type === "Bool") {
            if (fieldValue[name] === undefined) {
              attrs[name] = false;
            } else {
              let value = fieldValue[name];
              attrs[name] = value;
            }
          }
        }
      }
    }
    let newUser = {
      username: fieldValue["username"],
      firstName: fieldValue["firstName"],
      lastName: fieldValue["lastName"],
      email: fieldValue["email"],
      emailVerified: true,
      enabled: true,
      requiredActions: ["UPDATE_PASSWORD"],
      attributes: attrs,
      credentials: [
        {
          type: "password",
          value: "12345",
        },
      ],
    };
    // console.log("USER", newUser)
    return newUser;
  }

  // Collect data to show user creating form
  // function getFieldValuesSelectedDoc(){
  //   let data = {
  //     username: fieldValue["username"] !== undefined ? fieldValue["username"] : "",
  //     firstName: fieldValue["firstName"] !== undefined ? fieldValue["firstName"] : "",
  //     lastName: fieldValue["lastName"] !== undefined ?  fieldValue["lastName"] : "",
  //     email: fieldValue["email"] !== undefined ?  fieldValue["email"] : "",
  //     attributes:
  //       {
  //         userId: userProfile.userId,
  //         // userRole: [getRole()],
  //         address: [fieldValue["address"] !== undefined ? fieldValue["address"]: ""],
  //         phone: [fieldValue["phone"] !== undefined ? fieldValue["phone"] : ""]
  //       }
  //   }
  //   return data
  // }
  // Collect data to update existed user
  function getFieldValuesKeycloakUpdate() {
    let attrs = {
      locale: "ru",
      userId: fieldValue["userId"],
      enabled: selectedDoc.enabled,
    };
    for (let s = 0; s < Form.sections.length; s++) {
      for (let c = 0; c < Form.sections[s].contents.length; c++) {
        let name = Form.sections[s].contents[c].name;
        let type = Form.sections[s].contents[c].type;
        if (
          name !== "username" &&
          name !== "firstName" &&
          name !== "lastName" &&
          name !== "email" &&
          name !== "selectAllAdminFunctions" &&
          name !== "selectAllTradingFunctions" &&
          name !== "selectAllMainFunctions" &&
          name !== "selectAllAccountingFunctions" &&
          name !== "selectAllMortgageFunctions" &&
          name !== "selectAllInstructionTypes" &&
          name !== "selectAllReportTypes"
        ) {
          if (type === "Enum") {
            let value = fieldValue[name];
            attrs[name] = value;
          } else if (type === "Text") {
            if (fieldValue[name] === "" || fieldValue[name] === undefined) {
              attrs[name] = "Не указано";
            } else {
              let value = fieldValue[name];
              attrs[name] = value;
            }
          } else if (type === "Bool") {
            if (fieldValue[name] === undefined) {
              attrs[name] = false;
            } else {
              let value = fieldValue[name];
              attrs[name] = value;
            }
          }
        }
      }
    }
    let updateUser = {
      username: fieldValue["username"],
      firstName: fieldValue["firstName"],
      lastName: fieldValue["lastName"],
      email: fieldValue["email"],
      emailVerified: true,
      enabled: selectedDoc.enabled,
      attributes: attrs,
    };
    // console.log("UPDATE", updateUser)
    return updateUser;
  }
  // Collect data to reset existed user password
  function getFieldValuesKeycloakResetPassword() {
    let attrs = {};
    for (let key in selectedDoc.attributes) {
      attrs[key] = selectedDoc.attributes[key][0];
    }

    let updateUser = {
      username: selectedDoc.username,
      firstName: selectedDoc["firstName"],
      lastName: selectedDoc["lastName"],
      email: selectedDoc["email"],
      emailVerified: true,
      enabled: selectedDoc.enabled,
      requiredActions: ["UPDATE_PASSWORD"],
      attributes: attrs,
      credentials: [
        {
          type: "password",
          value: "12345",
        },
      ],
    };
    return updateUser;
  }
  // Collect data to set state deleted
  function getFieldValuesKeycloakChangeAccesUser(access) {
    console.log("ACC", access);
    let attrs = {};
    for (let key in selectedDoc.attributes) {
      if (key === "enabled") {
        attrs[key] = access;
      } else {
        attrs[key] = selectedDoc.attributes[key][0];
      }
    }
    let updateUser = {
      username: selectedDoc.username,
      firstName: selectedDoc["firstName"],
      lastName: selectedDoc["lastName"],
      email: selectedDoc["email"],
      emailVerified: true,
      enabled: access,
      attributes: attrs,
    };
    return updateUser;
  }

  // Validate input data
  function checkForWrongFields(commandJson) {
    let enabledToSend = false;
    var parsedGridFormData = JSON.parse(props.userTask.docList);
    if (fieldValue["userRole"] !== undefined && fieldValue["userRole"] !== "") {
      if (
        fieldValue["username"] !== undefined &&
        fieldValue["username"] !== ""
      ) {
        if (
          fieldValue["firstName"] !== undefined &&
          fieldValue["firstName"] !== ""
        ) {
          if (
            fieldValue["lastName"] !== undefined &&
            fieldValue["lastName"] !== ""
          ) {
            if (
              fieldValue["username"] !== undefined &&
              fieldValue["username"] !== ""
            ) {
              if (
                fieldValue["partner"] !== undefined &&
                fieldValue["partner"] !== ""
              ) {
                for (let i = 0; i < parsedGridFormData.length; i++) {
                  if (
                    parsedGridFormData[i].username === fieldValue["username"]
                  ) {
                    enabledToSend = false;
                    return swAllert(
                      "Пользователь с таким логином уже существует",
                      "warning"
                    );
                  } else enabledToSend = true;
                }
              } else swAllert("Введите Контрагента", "warning");
            } else swAllert("Введите Email", "warning");
          } else swAllert("Введите Имя", "warning");
        } else swAllert("Введите Фамилию", "warning");
      } else swAllert("Введите Логин", "warning");
    } else swAllert("Введите Роль", "warning");
    if (enabledToSend === true) {
      sendFieldValues(commandJson);
      clearTabData(process_id);
      // swAllert("Пользователь успешно создан!", "success")
    }
  }
  function swAllert(text, icon) {
    return swal({
      text: text,
      icon: icon,
      buttons: { ok: "Ок" },
    }).then((click) => {
      if (click === "ok") {
        console.log("CLICK OK", click);
      }
    });
  }
  async function buttonClick(name, item) {
    if (name === "createUser") {
      // let KeycloakDoc = getFieldValuesSelectedDoc()
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          authorization: { value: "token" },
          userAction: { value: "createUser" },
          // selectedDoc: {value: JSON.stringify(KeycloakDoc)}
        },
      };
      console.log("button createUser: ", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    } else if (name === "saveUser") {
      // console.log("button saveUser: ", keycloakUser, restUser)
      let keycloakUser = getFieldValuesKeycloakCreate();
      // let role = getEnumLabelById("userRole")
      let restUser = getFieldValuesRest(keycloakUser);
      // let userMgment = role === "Администратор" ? "true" : "false"
      let userMgment = fieldValue["userRole"] === "3" ? "true" : "false";
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          authorization: { value: "token" },
          userAction: { value: "saveUser" },
          keycloakUserData: { value: JSON.stringify(keycloakUser) },
          restUserData: { value: JSON.stringify(restUser) },
          userManagement: { value: userMgment },
          createdUserName: { value: fieldValue["username"] },
        },
      };
      checkForWrongFields(commandJson);
    } else if (name === "findUser") {
      filterDocList(0, size, initialDocList);
    } else if (name === "editUser") {
      // console.log("ITEM", item)
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          authorization: { value: "token" },
          userAction: { value: "editUser" },
          keycloakUserId: { value: item.id },
        },
      };
      console.log("button editUser: ", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
    } else if (name === "updateUser") {
      let keycloakUser = getFieldValuesKeycloakUpdate();
      // let role = getEnumLabelById("userRole")
      let restUser = getFieldValuesRest(keycloakUser);
      // let userMgment = role === "Администратор" ? "true" : "false"
      let userMgment = fieldValue["userRole"] === "3" ? "true" : "false";
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          authorization: { value: "token" },
          userAction: { value: "updateUser" },
          keycloakUserId: { value: selectedDoc.id },
          keycloakUserData: { value: JSON.stringify(keycloakUser) },
          restUserData: { value: JSON.stringify(restUser) },
          userManagement: { value: userMgment },
          setRoleBody: {
            value: JSON.stringify([
              {
                id: "e0571b5a-3f10-4aa3-a975-86e1bc58af0f",
                name: "userManagement",
              },
            ]),
          },
        },
      };
      console.log("updateUser:", commandJson);
      sendFieldValues(commandJson);
      // swAllert("Пользователь успешно обновлен!", "success")
      clearTabData(process_id);
    } else if (name === "resetPassword") {
      swal({
        text: "Вы точно хотите сбросить пароль?",
        icon: "warning",
        buttons: { ok: "Да", cancel: "Отмена" },
      }).then((click) => {
        if (click === "ok") {
          var keycloakUser = getFieldValuesKeycloakResetPassword();
          let commandJson = {
            commandType: "completeTask",
            session_id: session_id,
            process_id: process_id,
            taskID: taskID,
            userId: userProfile.userId,
            userRole: userProfile.userRole,
            variables: {
              authorization: { value: "token" },
              userAction: { value: "resetPassword" },
              keycloakUserId: { value: selectedDoc.id },
              keycloakUserData: { value: JSON.stringify(keycloakUser) },
            },
          };
          sendFieldValues(commandJson);
          swAllert("Пароль успешно сброшен!", "success");
          clearTabData(process_id);
          console.log("REST PWD:", commandJson);
        }
      });
    } else if (name === "disableUser") {
      swal({
        text: "Вы точно хотите заблокировать пользователя?",
        icon: "warning",
        buttons: { ok: "Да", cancel: "Отмена" },
      }).then((click) => {
        if (click === "ok") {
          let keycloakUser = getFieldValuesKeycloakChangeAccesUser(false);
          let restUser = getFieldValuesRest(keycloakUser);
          let commandJson = {
            commandType: "completeTask",
            session_id: session_id,
            process_id: process_id,
            taskID: taskID,
            userId: userProfile.userId,
            userRole: userProfile.userRole,
            variables: {
              userAction: { value: "disableUser" },
              keycloakUserId: { value: selectedDoc.id },
              keycloakUserData: { value: JSON.stringify(keycloakUser) },
              restUserData: { value: JSON.stringify(restUser) },
            },
          };
          console.log("disableUser:", commandJson);
          sendFieldValues(commandJson);
          clearTabData(process_id);
          // swAllert("Пользователь заблокирован!", "success")
        }
      });
    } else if (name === "enableUser") {
      let keycloakUser = getFieldValuesKeycloakChangeAccesUser(true);
      let restUser = getFieldValuesRest(keycloakUser);
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "enableUser" },
          keycloakUserId: { value: selectedDoc.id },
          keycloakUserData: { value: JSON.stringify(keycloakUser) },
          restUserData: { value: JSON.stringify(restUser) },
        },
      };
      console.log("enableUser:", commandJson);
      sendFieldValues(commandJson);
      clearTabData(process_id);
      // swAllert("Пользователь разблокирован!", "success")
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
    } else {
      console.log("Button ", name);
    }
  }

  // Create sections with labels and call bodyBuilder function
  function sectionBuilder(section, index) {
    return (
      <MTable size="small" key={index + "table"}>
        <TableHead>
          <TableRow style={{ height: 30 }}>
            <TableCell
              key={(index = "head")}
              style={{
                color: "black",
                fontSize: 14,
                backgroundColor: sectionColor,
                width: "100%",
              }}
            >
              {section.label}
            </TableCell>
          </TableRow>
        </TableHead>
        {bodyBuilder(section)}
      </MTable>
    );
  }
  // Create body of each section and call contentBuilder function
  function bodyBuilder(section) {
    return (
      <MTable size="small">
        <TableBody>
          {section.contents.map((contentItem, index) => (
            <TableRow key={index} style={{ height: 30 }}>
              <TableCell
                key={index + "cell1"}
                align="left"
                style={{ width: "40%" }}
              >
                {contentItem.label}
              </TableCell>
              <TableCell
                key={index + "cell2"}
                align="left"
                style={{ width: "60%", height: 30 }}
              >
                {contentBuilder(contentItem)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </MTable>
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
      let options = [];
      options.push({
        value: "",
        label: "Пусто",
        name: contentItem.name,
      });
      for (let i = 0; i < enumData.length; i++) {
        if (contentItem.name === enumData[i].name) {
          for (let l = 0; l < enumData[i].data.length; l++) {
            options.push({
              value: enumData[i].data[l].id,
              label: enumData[i].data[l].label,
              name: contentItem.name,
            });
          }
        }
      }
      let selectedOption = {
        value: "",
        label: "Пусто",
        name: contentItem.name,
      };
      if (fieldValue[contentItem.name] !== undefined) {
        for (let i = 0; i < options.length; i++) {
          if (fieldValue[contentItem.name] === options[i].value.toString()) {
            selectedOption = options[i];
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
          // style={{height: 30, minWidth: 150}}
          options={options}
          isDisabled={
            formType === "view" || contentItem.edit === false ? true : false
          }
        />
      );
    } else if (contentItem.type === "Bool") {
      return (
        <Checkbox
          // key={this.getUUID()}
          style={{
            maxWidth: 20,
            height: 15,
            color:
              formType === "view" || contentItem.edit === false
                ? "grey"
                : "green",
          }}
          name={contentItem.name}
          onChange={handleCheckboxChange}
          disabled={
            formType === "view" || contentItem.edit === false ? true : false
          }
          checked={fieldValue[contentItem.name] === true ? true : false}
        />
      );
    }
  }
  function getGridFormItems(value, type, dataItem, name) {
    // console.log("ITEM", name, value, type)
    if (type === "Enum") {
      if (value === null || value === "" || value === undefined) {
        return (
          <td align="center" style={{ color: "black", fontSize: 12 }}>
            -
          </td>
        );
      } else {
        console.log("ENUM", name, value, type);
        for (let i = 0; i < gridFormEnumData.length; i++) {
          if (name === gridFormEnumData[i].name) {
            for (let l = 0; l < gridFormEnumData[i].data.length; l++) {
              if (gridFormEnumData[i].data[l].id === parseInt(value)) {
                return gridFormEnumData[i].data[l].label;
              }
            }
          }
        }
      }
    } else if (type === "Bool") {
      // console.log("ITEM", name, value, type)
      return (
        <Checkbox
          style={{
            maxWidth: 20,
            height: 15,
            color: value === false ? "red" : "green",
          }}
          // name = {name}
          checked={
            value === false || value === null || value === undefined
              ? false
              : true
          }
        />
      );
    } else if (type === "DateTime") {
      if (value === null || value === "" || value === undefined) {
        return (
          <td align="center" style={{ color: "black", fontSize: 12 }}>
            -
          </td>
        );
      } else {
        // console.log("ITEM", dataItem, value)
        let Date = value.substring(0, 10);
        let Time = value.substring(11, 16);
        return Date + " " + Time;
      }
    } else if (type === "Text") {
      // console.log("ITEM", name, value, type)
      if (value === null || value === "" || value === undefined) {
        return (
          <td align="center" style={{ color: "black", fontSize: 12 }}>
            -
          </td>
        );
      } else {
        return <td>{value}</td>;
      }
    } else {
      if (value === null || value === "" || value === undefined) {
        return (
          <td align="center" style={{ color: "black", fontSize: 12 }}>
            -
          </td>
        );
      } else {
        return <td>{value}</td>;
      }
    }
  }
  function handleCloseSnackBar() {
    setShowSnackBar(false);
  }
  // console.log("User PROPS", props)
  // console.log("FIELDS", fieldValue)
  // console.log("SOP", selectedOptions)
  if (docList === null && props.userTask.taskType === "showSearchUser") {
    return <LinearProgress />;
  } else {
    return (
      <Grid>
        {/* Create main search table */}
        <Grid container direction="row" justify="flex-start" spacing={1}>
          <Grid item xs={8}>
            <Paper>
              <MTable>
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                >
                  <TableHead>
                    <TableRow style={{ maxHeight: 25 }}>
                      <TableCell style={{ fontSize: 16, color: "black" }}>
                        {Form.label}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                </Grid>
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                >
                  {Form.sections.map((section, index) => {
                    return sectionBuilder(section, index);
                  })}
                </Grid>
                <Grid
                  container
                  direction="row"
                  justify="flex-start"
                  alignItems="flex-start"
                >
                  {buttons.map(
                    (button, index) => {
                      if (button.name === "disableUser") {
                        if (userEnabled === true) {
                          return (
                            <Button
                              key={button.name + index}
                              name={button.name}
                              variant="outlined"
                              value={button.name}
                              onClick={() => buttonClick(button.name, null)}
                              style={{
                                margin: 3,
                                backgroundColor: button.backgroundColor,
                                height: 32,
                                fontSize: 12,
                              }}
                            >
                              {button.label}
                            </Button>
                          );
                        }
                      } else if (button.name === "enableUser") {
                        if (userEnabled === false) {
                          return (
                            <Button
                              key={button.name + index}
                              name={button.name}
                              variant="outlined"
                              value={button.name}
                              onClick={() => buttonClick(button.name, null)}
                              style={{
                                margin: 3,
                                backgroundColor: button.backgroundColor,
                                height: 32,
                                fontSize: 12,
                              }}
                            >
                              {button.label}
                            </Button>
                          );
                        }
                      } else {
                        return (
                          <Button
                            key={button.name + index}
                            name={button.name}
                            variant="outlined"
                            value={button.name}
                            onClick={() => buttonClick(button.name, null)}
                            style={{
                              margin: 3,
                              backgroundColor: button.backgroundColor,
                              height: 32,
                              fontSize: 12,
                            }}
                          >
                            {button.label}
                          </Button>
                        );
                      }
                    }
                    // <Button
                    //   key={button.name + index}
                    //   name={button.name}
                    //   variant="outlined"
                    //   value={button.name}
                    //   onClick = {() => buttonClick(button.name, null)}
                    //   style={{
                    //     margin: 3,
                    //     backgroundColor: button.backgroundColor,
                    //     height: 32,
                    //     fontSize: 12
                    //   }}
                    // >{button.label}
                    // </Button>
                  )}
                </Grid>
              </MTable>
            </Paper>
          </Grid>
        </Grid>
        <br></br>
        {/* Create grid table with data from doclist */}
        {docList !== null && props.userTask.taskType === "showSearchUser" && (
          <Grid container direction="row" justify="flex-start" spacing={0}>
            <Grid item sm={"auto"}>
              <Paper>
                <table
                  size="small"
                  style={{ width: "100%", "border-collapse": "collapse" }}
                >
                  <thead style={{ backgroundColor: sectionColor }}>
                    <tr>
                      <td
                        colSpan="1"
                        style={{
                          color: "black",
                          fontSize: 12,
                          border: "1px solid grey",
                          "text-align": "center",
                        }}
                      ></td>
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
                        }}
                      >
                        Действие
                      </td>
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
                              }}
                            >
                              {contentItem.label}
                            </td>
                          );
                        })
                      )}
                    </tr>
                  </thead>
                  <TableBody>
                    {Object.keys(docList).length !== 0 &&
                      docList.map((dataItem) => (
                        <tr key={keyGen(5)} style={{ height: 30 }}>
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
                                  // id={dataItem.id}
                                  value={button.name}
                                  onClick={() =>
                                    buttonClick(button.name, dataItem)
                                  }
                                  style={{
                                    margin: 1,
                                    height: 24,
                                    fontSize: 9,
                                    maxWidth: 32,
                                    backgroundColor: button.backgroundColor,
                                  }}
                                >
                                  {button.label}
                                </Button>
                              ))}
                          </td>
                          {gridForm.sections.map((section) => {
                            return section.contents.map((contentItem) => {
                              for (let key in dataItem) {
                                if (key === contentItem.name) {
                                  return (
                                    <td
                                      key={keyGen(5)}
                                      style={{
                                        color: "black",
                                        fontSize: 12,
                                        "border-bottom": "1px solid grey",
                                      }}
                                    >
                                      {getGridFormItems(
                                        dataItem[key],
                                        contentItem.type,
                                        dataItem,
                                        key
                                      )}
                                    </td>
                                  );
                                }
                              }
                            });
                          })}
                        </tr>
                      ))}
                  </TableBody>
                </table>
                <tfoot>
                  <tr>
                    <td style={{ paddingLeft: "20px" }}>
                      <div style={{ minWidth: 90, color: "black" }}>
                        Кол-во записей
                      </div>
                    </td>
                    <td style={{ paddingLeft: "3px" }}>
                      <FormControl variant="outlined" style={{ minWidth: 30 }}>
                        <GridSelect
                          onChange={handleChangeRowsPerPage}
                          style={{ height: 25, color: "black" }}
                          value={size}
                        >
                          <MenuItem value={5}>5</MenuItem>
                          <MenuItem value={10}>10</MenuItem>
                          <MenuItem value={15}>15</MenuItem>
                          <MenuItem value={20}>20</MenuItem>
                          <MenuItem value={30}>30</MenuItem>
                        </GridSelect>
                      </FormControl>
                    </td>

                    <td>
                      <Tooltip title="На первую страницу">
                        <IconButton onClick={() => KeyboardArrowFirstClick()}>
                          <FirstPageIcon
                            style={{ fontSize: "large", color: "black" }}
                          />
                        </IconButton>
                      </Tooltip>
                    </td>
                    <td>
                      <Tooltip title="На предыдущюю страницу">
                        <IconButton
                          onClick={() => KeyboardArrowLeftClick(page)}
                        >
                          <ArrowBackIosIcon
                            style={{ fontSize: "medium", color: "black" }}
                          />
                        </IconButton>
                      </Tooltip>
                    </td>
                    <td style={{ color: "black", fontSize: 16 }}>
                      <input
                        style={{ maxWidth: 25 }}
                        value={page}
                        onChange={handlePageChange}
                      ></input>
                    </td>
                    <td style={{ paddingLeft: "3px" }}>
                      <Tooltip title="Перейти на указанную страницу">
                        <Button
                          onClick={() => GoToPage()}
                          variant="outlined"
                          style={{
                            height: 22,
                            backgroundColor: "#D1D6D6",
                            fontSize: 12,
                          }}
                        >
                          перейти
                        </Button>
                      </Tooltip>
                    </td>
                    <td>
                      <Tooltip title="На следующюю страницу">
                        <IconButton
                          onClick={() => KeyboardArrowRightClick(page)}
                        >
                          <ArrowForwardIosIcon
                            style={{ fontSize: "medium", color: "black" }}
                          />
                        </IconButton>
                      </Tooltip>
                    </td>
                    <td style={{ color: "black", fontSize: 16 }}>
                      Стр. {page} из {getPageAmount()}
                    </td>
                  </tr>
                </tfoot>
              </Paper>
            </Grid>
          </Grid>
        )}
        <Snackbar
          open={showSnackBar}
          onClose={() => handleCloseSnackBar()}
          autoHideDuration={1200}
          message={snackBarMessage}
        />
      </Grid>
    );
  }
};
