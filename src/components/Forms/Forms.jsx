import React, { useState, useEffect } from "react";
// import clsx from 'clsx';
// import { makeStyles} from '@material-ui/core/styles';
import Table from "@material-ui/core/Table"; // Material ui table for usual form
// import TableFooter from '@material-ui/core/TableFooter';
// import { Table} from 'reactstrap';  // Core ui table for grid form
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Button from "@material-ui/core/Button";
import { Grid } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
// import GridSelect from '@material-ui/core/Select';
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";

import MenuItem from "@material-ui/core/MenuItem";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import LinearProgress from "@material-ui/core/LinearProgress";
import Snackbar from "@material-ui/core/Snackbar";
import NumberFormat from "react-number-format";
import PropTypes from "prop-types";
// Form components
import TextField from "@material-ui/core/TextField";
import Select from "react-select";
import Checkbox from "@material-ui/core/Checkbox";
// Libraries
import swal from "sweetalert"; // https://sweetalert.js.org/guides/
import Tooltip from "@material-ui/core/Tooltip";
// import { useToasts } from 'react-toast-notifications' // https://jossmac.github.io/react-toast-notifications/
// import { FormWithToasts } from "./ToastProvider.jsx";
// import { ToastProvider, useToasts } from 'react-toast-notifications'

var generator = require("generate-password");

export default (props) => {
  // This.state
  const [userProfile] = useState(props.userProfile);
  const [session_id] = useState(props.userTask.session_id);
  const [process_id] = useState(props.userTask.process_id);
  const [taskID] = useState(props.userTask.taskID);
  const [Form, setForm] = useState(props.userTask.Form);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docId, setDocId] = useState(props.userTask.docId);
  const [fieldValue, setFieldValue] = useState({});
  const [buttons] = useState(props.userTask.buttons);
  const [sectionColor] = useState("#B2E0C9");
  const [updateState, setUpdateState] = useState(false);
  const [taskType] = useState(props.userTask.taskType);

  const handleCheckboxEditChange = (event) => {
    let contFields = fieldValue[event.target.name];
    let newVals = {
      edit: event.target.checked,
      show: contFields.show,
      required: contFields.required,
    };
    setFieldValue({ ...fieldValue, [event.target.name]: newVals });
    // console.log("FIELDVAL", fieldValue)
  };
  const handleCheckboxShowChange = (event) => {
    let contFields = fieldValue[event.target.name];
    let newVals = {
      edit: contFields.edit,
      show: event.target.checked,
      required: contFields.required,
    };
    setFieldValue({ ...fieldValue, [event.target.name]: newVals });
    console.log("FIELDVAL", newVals);
  };
  const handleCheckboxRequiredChange = (event) => {
    let contFields = fieldValue[event.target.name];
    let newVals = {
      edit: contFields.edit,
      show: contFields.show,
      required: event.target.checked,
    };
    setFieldValue({ ...fieldValue, [event.target.name]: newVals });
    // console.log("FIELDVAL", fieldValue)
  };
  // Set data from props to state of component
  useEffect(() => {
    console.log("MAINFORM PROPS", props);
    if (
      props.userTask.selectedDoc !== "null" &&
      props.userTask.selectedDoc !== undefined &&
      props.userTask.selectedDoc !== null
    ) {
      let parsedSelectedDoc = JSON.parse(props.userTask.selectedDoc);
      let fields = {};
      console.log("SDOC", parsedSelectedDoc);
      for (let s = 0; s < parsedSelectedDoc.sections.length; s++) {
        for (
          let c = 0;
          c < parsedSelectedDoc.sections[s].contents.length;
          c++
        ) {
          let contName = parsedSelectedDoc.sections[s].contents[c].name;
          // console.log("ITEM", parsedSelectedDoc.sections[s].contents[c].name)
          fields[contName] = {
            edit: parsedSelectedDoc.sections[s].contents[c].edit,
            show: parsedSelectedDoc.sections[s].contents[c].show,
            required:
              parsedSelectedDoc.sections[s].contents[c].required !== undefined
                ? parsedSelectedDoc.sections[s].contents[c].required
                : false,
          };
        }
      }
      console.log("FIELDVAL", fields);
      setFieldValue(fields);
      setSelectedDoc(parsedSelectedDoc);
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
  // Collect data to update doc
  function getFieldValuesUpdateForm() {
    let formToUpdate = selectedDoc;
    for (let s = 0; s < selectedDoc.sections.length; s++) {
      for (let c = 0; c < selectedDoc.sections[s].contents.length; c++) {
        let contName = selectedDoc.sections[s].contents[c].name;
        formToUpdate.sections[s].contents[c].edit = fieldValue[contName].edit;
        formToUpdate.sections[s].contents[c].show = fieldValue[contName].show;
        formToUpdate.sections[s].contents[c].required =
          fieldValue[contName].required;
      }
    }
    return formToUpdate;
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
  function parseDate(date) {
    // console.log("INC DATE", date)
    try {
      var newDate = new Date(date); // "2020-01-26"
      var dd = String(newDate.getDate()).padStart(2, "0");
      var mm = String(newDate.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = newDate.getFullYear();
      var convertedDate = yyyy + "-" + mm + "-" + dd;
      console.log("CDATE", convertedDate);
      return convertedDate;
      // return "2022-11-11"
    } catch (er) {
      // console.log("DATE NULL", "NaN.NaN.NaN")
      return "NaN.NaN.NaN";
    }
  }
  function buttonClick(name, item) {
    if (name === "updateDocument") {
      let form = getFieldValuesUpdateForm();
      let updateBody = {
        defid: selectedDoc.defid,
        created_at: getCurrentFullDateTime(new Date()),
        data: JSON.stringify(form),
      };
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
      console.log("updateForm:", form);
      sendFieldValues(commandJson);
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
      console.log("UNKNOWN Button ", name);
    }
  }
  // Create sections with labels and call bodyBuilder function
  function sectionBuilder(section) {
    return (
      <Table>
        <Table size="small" key={keyGen(5)}>
          <TableHead>
            <TableRow style={{ height: 30 }}>
              <TableCell
                key={keyGen(5)}
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
        </Table>
        {section.contents.length > 0 && bodyBuilder(section)}
      </Table>
    );
  }
  // Create body of each section and call contentBuilder function
  function bodyBuilder(section) {
    return (
      <Table size="small" style={{ "border-collapse": "collapse" }}>
        <TableHead>
          <TableRow key={keyGen(5)} style={{ height: 30 }}>
            <TableCell
              key={keyGen(5)}
              align="left"
              style={{ height: 30, border: "1px solid grey" }}
            >
              Наименование
            </TableCell>
            <TableCell
              key={keyGen(5)}
              align="left"
              style={{ height: 30, border: "1px solid grey" }}
            >
              Тип
            </TableCell>
            <TableCell
              key={keyGen(5)}
              align="left"
              style={{ height: 30, border: "1px solid grey" }}
            >
              Редактируемое
            </TableCell>
            <TableCell
              key={keyGen(5)}
              align="left"
              style={{ height: 30, border: "1px solid grey" }}
            >
              Отображаемое
            </TableCell>
            <TableCell
              key={keyGen(5)}
              align="left"
              style={{ height: 30, border: "1px solid grey" }}
            >
              Обязятельное
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {section.contents.map(
            (contentItem) =>
              contentItem.show === true && (
                <TableRow key={keyGen(5)} style={{ height: 30 }}>
                  <TableCell
                    key={keyGen(5)}
                    align="left"
                    style={{ height: 30, border: "1px solid grey" }}
                  >
                    {contentItem.label}
                  </TableCell>
                  <TableCell
                    key={keyGen(5)}
                    align="left"
                    style={{ height: 30, border: "1px solid grey" }}
                  >
                    {contentItem.type}
                  </TableCell>
                  <TableCell
                    key={keyGen(5)}
                    align="left"
                    style={{ height: 30, border: "1px solid grey" }}
                  >
                    <Checkbox
                      key={keyGen(5)}
                      style={{ maxWidth: 20, height: 15, color: "green" }}
                      name={contentItem.name}
                      onChange={handleCheckboxEditChange}
                      checked={fieldValue[contentItem.name].edit}
                    />
                  </TableCell>
                  <TableCell
                    key={keyGen(5)}
                    align="left"
                    style={{ height: 30, border: "1px solid grey" }}
                  >
                    <Checkbox
                      key={keyGen(5)}
                      style={{ maxWidth: 20, height: 15, color: "green" }}
                      name={contentItem.name}
                      onChange={handleCheckboxShowChange}
                      checked={fieldValue[contentItem.name].show}
                    />
                  </TableCell>
                  <TableCell
                    key={keyGen(5)}
                    align="left"
                    style={{ height: 30, border: "1px solid grey" }}
                  >
                    <Checkbox
                      key={keyGen(5)}
                      style={{ maxWidth: 20, height: 15, color: "green" }}
                      name={contentItem.name}
                      onChange={handleCheckboxRequiredChange}
                      checked={fieldValue[contentItem.name].required}
                    />
                  </TableCell>
                </TableRow>
              )
          )}
        </TableBody>
      </Table>
    );
  }

  if (updateState !== null) {
    try {
      return (
        <Grid>
          {/* Create main form */}
          <Grid container direction="row" justify="flex-start" spacing={1}>
            <Grid item xs={10}>
              <Paper>
                <Table style={{ width: "100%", "border-collapse": "collapse" }}>
                  <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                  >
                    <TableHead>
                      <TableRow style={{ maxHeight: 25 }}>
                        <TableCell style={{ fontSize: 25, color: "black" }}>
                          {selectedDoc.label}
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
                    {selectedDoc.sections.map((section) => {
                      return sectionBuilder(section);
                    })}
                  </Grid>
                  <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                  >
                    {buttons.map((button) => (
                      <Button
                        key={keyGen(5)}
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
                    ))}
                  </Grid>
                </Table>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      );
    } catch (er) {
      console.log("ERROR", er);
      return <LinearProgress />;
    }
  }
};
