//ОТРИСОВКА ДВУХ GRID ФОРМ
import React, {useState, useEffect} from 'react';
import Table from "@material-ui/core/Table"; // Material ui table for usual form
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import GridSelect from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
// Form components
import TextField from '@material-ui/core/TextField';
import Select from 'react-select';
import Checkbox from '@material-ui/core/Checkbox';
// Libraries
import swal from 'sweetalert' // https://sweetalert.js.org/guides/
import Tooltip from '@material-ui/core/Tooltip';
import Moment from 'moment';
import { green } from '@material-ui/core/colors';
import { CenterFocusStrong } from '@material-ui/icons';
//import ReactHTMLTableToExcel from 'react-html-table-to-excel';
//import TableToExcel from "@linways/table-to-excel"; // https://github.com/linways/table-to-excel

var TableToExcel = require('table-to-excel');
var tableToExcel = new TableToExcel();
var generator = require('generate-password');

function FloatFormat(props){
  const { inputRef, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value,
          },
        })
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
}
function IntegerFormat(props) {
  const { inputRef, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
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
}
// downloadExcel(){
//   TableToExcel.convert(document.getElementById(this.state.tableUniqueId))
// }
export default (props) => {
    // This.state
  const [userProfile] = useState(props.userProfile)
  const [session_id] = useState(props.userTask.session_id)
  const [process_id] = useState(props.userTask.process_id)
  const [taskID] = useState(props.userTask.taskID)
  const [Form, setForm] = useState(props.userTask.Form)
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [docId, setDocId] = useState(props.userTask.docId)
  const [formType] = useState(props.userTask.formType)
  const [docList, setDocList] = useState(null)
  const [docList2, setDocList2] = useState(null)
  const [gridForm] = useState(props.userTask.gridForm)
  const [gridForm2] = useState(props.userTask.gridForm2)
  const [gridFormButtons] = useState(props.userTask.gridFormButtons)
  const [tableFormButtons, setTableFormButtons] = useState(null)
  const [enumData] = useState(props.userTask.enumData)
  const [enumOptions, setEnumOptions] = useState({})
  const [fieldValue, setFieldValue] = useState({})
  const [selectedOptions, setSelectedOptions] = useState([])
  const [buttons] = useState(props.userTask.buttons)
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10) 
  const [totalCount, setTotalCount] = useState(null) 
  const [showSnackBar, setShowSnackBar] = useState(false)
  const [snackBarMessage, setSnackBarMessage] = useState("")
  const [sectionColor] = useState("#B2E0C9")
  const [updateState, setUpdateState] = useState(false)
  const [taskType] = useState(props.userTask.taskType)
  const [gridTableId, setGridTableId] = useState(null)


  const handleCheckboxChange = (event) => {
    setFieldValue({ ...fieldValue, [event.target.name]: event.target.checked });
  }
  // Integer input handler
  const handleIntChange = (event) => {
    console.log("EVENT", event.target.name, event.target.value)
    let stringNum = event.target.value.toString().replace(/ /g,'');
    let int = parseInt(stringNum)
    setFieldValue({ ...fieldValue, [event.target.name]: int });
  }
  // Float input handler
  const handleFloatChange = (event) => {
    let stringNum = event.target.value.toString().replace(/ /g,'');
    let float = parseFloat(stringNum)
    setFieldValue({...fieldValue, [event.target.name]: float})
    console.log("FLOAT CHANGE", event.target.name, fieldValue)
  }
  // Text input handler
  function handleChange(event){
    // console.log("EVENT", event.target.name, event.target.value)
    fieldValue[event.target.name] = event.target.value
    setFieldValue(fieldValue)
    console.log("FIELDVALUE", fieldValue)
  }
  function handleSelectChange(option){
    fieldValue[option.name] = option.value
    console.log("OPT", option.name, option.value)
    var updateSelectedOptions = selectedOptions.slice()
    let noSuchOption = true
    for(let i=0; i<updateSelectedOptions.length; i++){
      if(option.name === updateSelectedOptions[i].name){
        updateSelectedOptions[i] = option
        noSuchOption = false
        setSelectedOptions(updateSelectedOptions)
        break
      }
      else {
        noSuchOption = true
      }
    }
    if(noSuchOption === true){
      updateSelectedOptions.push(option)
      setSelectedOptions(updateSelectedOptions)
    }
    if(option.name === "payer_type" && (taskType === "showPaymentsForCDServicesCreatingForm")){
      // console.log("SEL", option.name, option.value)
      for(let s=0; s<Form.sections.length; s++){
        for(let c=0; c<Form.sections[s].contents.length; c++){
          if(Form.sections[s].contents[c].name === "depositor"){
            if(option.value === 1){
              Form.sections[s].contents[c].show = true
              Form.sections[s].contents[c].edit = true
              fieldValue["issuer"] = null
              for(let i=0; i<updateSelectedOptions.length; i++){
                if(updateSelectedOptions[i].name === "issuer"){
                  updateSelectedOptions[i] = {
                    "value": "",
                    "label": "Пусто",
                    "name" : "issuer"
                  }
                  setSelectedOptions(updateSelectedOptions)
                  break
                }
              }
            }
            else{
              Form.sections[s].contents[c].show = false
              Form.sections[s].contents[c].edit = false
            }
          }
          if(Form.sections[s].contents[c].name === "issuer"){
            if(option.value === 2){
              Form.sections[s].contents[c].show = true
              Form.sections[s].contents[c].edit = true
              fieldValue["depositor"] = null
              for(let i=0; i<updateSelectedOptions.length; i++){
                if(updateSelectedOptions[i].name === "depositor"){
                  updateSelectedOptions[i] = {
                    "value": "",
                    "label": "Пусто",
                    "name" : "depositor"
                  }
                  setSelectedOptions(updateSelectedOptions)
                  break
                }
              }
            }
            else{
              Form.sections[s].contents[c].show = false
              Form.sections[s].contents[c].edit = false
            }
          }
        }
      }
      setForm(Form)      
      // console.log("NEW ENUMS")
    }
    else if(option.name === "recipient_type" && (taskType === "showTransitChargeForCDServicesCreatingForm" )){
      console.log("RECIPIENT", option.name, option.value, fieldValue)
      for(let s=0; s<Form.sections.length; s++){
        for(let c=0; c<Form.sections[s].contents.length; c++){
          if(Form.sections[s].contents[c].name === "registrar"){
            if(option.value === 1){
              Form.sections[s].contents[c].show = true
              Form.sections[s].contents[c].edit = true
              fieldValue["corr_depository"] = null
              for(let i=0; i<updateSelectedOptions.length; i++){
                if(updateSelectedOptions[i].name === "corr_depository"){
                  updateSelectedOptions[i] = {
                    "value": "",
                    "label": "Пусто",
                    "name" : "corr_depository"
                  }
                  setSelectedOptions(updateSelectedOptions)
                  break
                }
              }
            }
            else{
              Form.sections[s].contents[c].show = false
              Form.sections[s].contents[c].edit = false
            }
          }
          if(Form.sections[s].contents[c].name === "corr_depository"){
            if(option.value === 2){
              Form.sections[s].contents[c].show = true
              Form.sections[s].contents[c].edit = true
              fieldValue["registrar"] = null
              for(let i=0; i<updateSelectedOptions.length; i++){
                if(updateSelectedOptions[i].name === "registrar"){
                  updateSelectedOptions[i] = {
                    "value": "",
                    "label": "Пусто",
                    "name" : "registrar"
                  }
                  setSelectedOptions(updateSelectedOptions)
                  break
                }
              }
            }
            else{
              Form.sections[s].contents[c].show = false
              Form.sections[s].contents[c].edit = false
            }
          }
        }
      }
      setForm(Form)
      // console.log("NEW ENUMS")
    }
  }
  function handleDateTimeChange(event){
    let convertedDate = getCurrentFullDateTime(event.target.value)
    fieldValue[event.target.name] = convertedDate
    setFieldValue(fieldValue)
    // console.log("DATE CHANGE", event.target.value)
  }
  function getCurrentFullDateTime(incDate){
    var fullDate = parseDate(incDate)
    var hours = new Date().getHours()
    var minutes = new Date().getMinutes()
    var seconds = new Date().getSeconds()
    var offsetInHours = new Date().getTimezoneOffset() / -60
    // console.log("OFFSET", offsetInHours)
    if(offsetInHours > 0){
      if(offsetInHours < 10){
        offsetInHours = "+0" + offsetInHours
      }
      else{
        offsetInHours = "+" + offsetInHours
      }
    }
    else{
      if(offsetInHours > -10){
        offsetInHours = "-0" + Math.abs(offsetInHours)
      }
    }
    var convertedDate = fullDate + " " + hours + ":" + minutes + ":" + seconds + offsetInHours
    return convertedDate
  }
  // Set data from props to state of component
  useEffect(()=>{
    console.log("DOUBLEGRIDFORM PROPS", props)
    if(props.userTask.docList !== "null" && props.userTask.docList !== null && props.userTask.docList2 !== "null" && props.userTask.docList2 !== null){
      let parsedData  = JSON.parse(props.userTask.docList)
      let parsedData2  = JSON.parse(props.userTask.docList2)
      console.log("DOCL", parsedData)
      setDocList(parsedData)
      setDocList2(parsedData2)
      setSize(parseInt(props.userTask.size))
      setPage(parseInt(props.userTask.page))
      setTotalCount(parseInt(props.userTask.totalCount))
      setGridTableId(getUUID())
    }
    if(props.userTask.selectedDoc !== "null" && props.userTask.selectedDoc !== undefined && props.userTask.selectedDoc !== null){
      let parsedSelectedDoc = JSON.parse(props.userTask.selectedDoc)
      let fields = {}
      // let Form = props.userTask.Form
      for(let s=0; s<Form.sections.length; s++){
        for(let c=0; c<Form.sections[s].contents.length; c++){
          let fieldName = Form.sections[s].contents[c].name
          fields[fieldName] = parsedSelectedDoc[fieldName]
        }
      }      
      console.log("SDOC", parsedSelectedDoc)
      // console.log("FIELDVAL", fields)
      setSelectedDoc(parsedSelectedDoc)
      setFieldValue(fields)
    }
    if(props.userTask.tableFormButtons !== "null" && props.userTask.tableFormButtons !== undefined && props.userTask.tableFormButtons !== null){
      setTableFormButtons(props.userTask.tableFormButtons)   
    }
    if(props.userTask.enumData !== null && props.userTask.enumData !== undefined && props.userTask.enumData !== "null"){
      let newEnumOptions = {}
      for(let i=0; i<props.userTask.enumData.length; i++){
        let options = [{
          "value": "",
          "label": "Пусто",
          "name" : props.userTask.enumData[i].name
        }]
        for(let d=0; d<props.userTask.enumData[i].data.length; d++){
            options.push({
            "value": props.userTask.enumData[i].data[d].id,
            "label": props.userTask.enumData[i].data[d].label,
            "name" : props.userTask.enumData[i].name
          })
        }
        newEnumOptions[props.userTask.enumData[i].name] = options
      }
      setEnumOptions(newEnumOptions)
    }
    if(props.userTask.size !== undefined && props.userTask.size !== "null" && props.userTask.size !== null){
      setSize(parseInt(props.userTask.size))
      setPage(parseInt(props.userTask.page))
    }
    setUpdateState(getUUID())
  },[])
  // Functions from props
  function sendFieldValues(commandJson){
    props.sendFieldValues(commandJson)
  }
  function clearTabData(process_id){
    props.clearTabData(process_id)
  }
  /**********************************************************************Pagination functions******************************************************************************/  
  //Переход на первую страницу
  function KeyboardArrowFirstClick(){
    if(page !== 1){
      setPage(1)
      let filterDoc = getFieldValuesFilterDocuments()
      let commandJson = 
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,        
        variables: {
          userAction: {value: "paginationClick"},
          searchBody: {value: JSON.stringify(filterDoc)},
          size: {value: size},
          page: {value: page - page + 1}
        }
      }    
      console.log("paginationClick:", commandJson)
      sendFieldValues(commandJson)      
      clearTabData(process_id)
    }
    else{
      setSnackBarMessage("Вы на первой странице!") 
      setShowSnackBar(true)     
    }
  }
  //Переход налево
  function KeyboardArrowLeftClick(){    
    if(page === 1)
    {
      setSnackBarMessage("Вы на первой странице!")
      setShowSnackBar(true)
    } 
    else{
      setPage(page - 1)
      let filterDoc = getFieldValuesFilterDocuments()
      let commandJson = 
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,        
        variables: {
          userAction: {value: "paginationClick"},
          searchBody: {value: JSON.stringify(filterDoc)},
          size: {value: size},
          page: {value: page - 1}
        }
      }    
      console.log("paginationClick:", commandJson)
      sendFieldValues(commandJson)      
      clearTabData(process_id)
    }
  }
  //Переход направо
  function KeyboardArrowRightClick(){    
    if(docList.length < size){
      setSnackBarMessage("Больше нет данных!")
      setShowSnackBar(true)
    }
    else{
      setPage(page + 1)
      let filterDoc = getFieldValuesFilterDocuments()  
      let commandJson = 
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,        
        variables: {
          userAction: {value: "paginationClick"},
          searchBody: {value: JSON.stringify(filterDoc)},
          size: {value: size},          
          page: {value: page + 1}          
        }
      }
      console.log("paginationClick:", commandJson)
      sendFieldValues(commandJson)
      clearTabData(process_id)
    }
  }
  //Количество страниц
  function getPageAmount(){
    let pagesFloat = (totalCount)/size
    let mathRoundOfPages = Math.round(pagesFloat)
    if(pagesFloat > mathRoundOfPages){
      return mathRoundOfPages + 1
    }
    else{
      return mathRoundOfPages
    }
  }
  function handlePageChange(event){
    setPage(event.target.value)
  }
/**********************************************************************************************************************************************************/
  function handleCloseSnackBar(){
    setShowSnackBar(false)
  }
  // random UUID generator
  function getUUID() {
    const uuidv1 = require("uuid/v1")
    return uuidv1()
  }
  // random numbers generator
  function keyGen(length){
    var password = generator.generate({
      length: length,
      numbers: true
    })
    return password
  }
  function swAllert(text, icon){
    return(
      swal({
        text: text,
        icon: icon,
        buttons: {ok: "Ок"},
      })
      // .then((click) => {
      //   if(click === "ok"){
      //     console.log("CLICK OK", click)
      //   }
      // })
    )
  }
  // Collect data to save doc
  function getFieldValuesSaveDocument(){
    let docToSave = {}
    for(let s=0; s<Form.sections.length; s++){
      for(let c=0; c<Form.sections[s].contents.length; c++){
        let fieldName = Form.sections[s].contents[c].name
        if(Form.sections[s].contents[c].type === "Bool" && fieldValue[fieldName] === undefined){
          docToSave[fieldName] = false
        }
        else{
          docToSave[fieldName] = fieldValue[fieldName]
        }
      }
    }
    return docToSave
  }
  // Collect data to update doc
  function getFieldValuesUpdateDocument(){
    let docToUpdate = {}
    docToUpdate["created_at"] = selectedDoc.created_at
    docToUpdate["id"] = parseInt(docId)
    for(let s=0; s<Form.sections.length; s++){
      for(let c=0; c<Form.sections[s].contents.length; c++){
        let fieldName = Form.sections[s].contents[c].name
        if(Form.sections[s].contents[c].type === "Bool" && (fieldValue[fieldName] === undefined || fieldValue[fieldName] === null)){
          docToUpdate[fieldName] = false
        }
        else{
          docToUpdate[fieldName] = fieldValue[fieldName]
        }
      }
    }
    return docToUpdate
  }  
  //(для фильтрации)Сбор данных с полей интерфейса и формирования структуры для API
  function getFieldValuesFilterDocuments(){
    let attrs = {
      "attributes": []      
    }
    for(let s=0; s<Form.sections.length; s++){
      for(let c=0; c<Form.sections[s].contents.length; c++){
        if(Form.sections[s].contents[c].searchable === true){
          let name = Form.sections[s].contents[c].name
          if(fieldValue[name] !== undefined && fieldValue[name] !== null && fieldValue[name] !== "" && fieldValue[name] !== "NaN.NaN.NaN")
          {
            attrs.attributes.push({name: name, value: fieldValue[name]})
          }
        }
      }
    }
    if(attrs.attributes.length === 0)
    {
      return {}
    }
    else{
      return attrs;    
    }
  }
  
  /*********************************USER_ACTION - действие пользователя***********************************************************************************************/
  function buttonClick(name, item){      
    if(name === "filterClMonthDocList"){
      let filterDoc = getFieldValuesFilterDocuments()
      
      let commandJson = 
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,              
        variables: {
          userAction: {value: "filterClMonthDocList"},
          searchBody: {value: JSON.stringify(filterDoc)},
          size: {value: size},
          page: {value: page},
          selectedDoc: {value: JSON.stringify(fieldValue)}         
        }
      }
      console.log("filterClMonthDocList:", commandJson)
      sendFieldValues(commandJson)      
      clearTabData(process_id)      
    }
    else if(name === "createClosedMonthList"){
      let filterDoc = getFieldValuesFilterDocuments()
      let commandJson = 
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: {value: "createClosedMonthList"},
          searchBody: {value: JSON.stringify(filterDoc)},
          year: {value: fieldValue["Year"]},
          month: {value: fieldValue["Month"]}
        }
      }
      console.log("createClosedMonthList:", commandJson)
      sendFieldValues(commandJson)
      clearTabData(process_id)
    }
    else if(name === "completeCloseMonth"){
      let filterDoc = getFieldValuesFilterDocuments()
      let commandJson = 
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: {value: "completeCloseMonth"},
          searchBody: {value: JSON.stringify(filterDoc)}
          
        }
      }
      console.log("completeCloseMonth:", commandJson)
      sendFieldValues(commandJson)
      clearTabData(process_id)
    }
    else if(name === "openClMonthDocList"){
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: {value: "openClMonthDocList"},
          docId: {value: item.id}          
        }
      }
      console.log("openClMonthDocList:", commandJson)
      sendFieldValues(commandJson)
      clearTabData(process_id)
    }
    else if(name === "openBankAccountGetList"){
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: {value: "openBankAccountGetList"},
          docId: {value: item.id}
        }
      }
      console.log("openBankAccountGetList:", commandJson)
      sendFieldValues(commandJson)
      clearTabData(process_id)
    }
    else if(name === "openBankAccountGetList"){
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: {value: "openBankAccountGetList"},
          docId: {value: item.id}
        }
      }
      console.log("openBankAccountGetList:", commandJson)
      sendFieldValues(commandJson)
      clearTabData(process_id)
    }
    else if(name === "openBankAccountGetGrid"){
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: {value: "openBankAccountGetGrid"},
          docId: {value: item.id}
        }
      }
      console.log("openBankAccountGetGrid:", commandJson)
      sendFieldValues(commandJson)
      clearTabData(process_id)
    }
    else if(name === "openBankAccDistrRegister"){
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: {value: "openBankAccDistrRegister"},
          docId: {value: item.id}
        }
      }
      console.log("openBankAccDistrRegister:", commandJson)
      sendFieldValues(commandJson)
      clearTabData(process_id)
    }
    else if(name === "completeBankAccount"){
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: {value: "completeBankAccount"},
          // docId: {value: item.id}          
        }
      }
      console.log("completeBankAccount:", commandJson)
      sendFieldValues(commandJson)
      clearTabData(process_id)
    }
    else if(name === "openUploadGetList"){
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: {value: "openUploadGetList"},
          docId: {value: item.id}          
        }
      }
      console.log("openUploadGetList:", commandJson)
      sendFieldValues(commandJson)
      clearTabData(process_id)
    }
    else if(name === "openPayRegisterGetList"){
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: {value: "openPayRegisterGetList"},
          docId: {value: item.id}          
        }
      }
      console.log("openPayRegisterGetList:", commandJson)
      sendFieldValues(commandJson)
      clearTabData(process_id)
    } 
    else if(name === "openRegDistrDetailForm"){
      let commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: {value: "openRegDistrDetailForm"},
          docId: {value: item.id}          
        }
      }
      console.log("openRegDistrDetailForm:", commandJson)
      sendFieldValues(commandJson)
      clearTabData(process_id)
    }      
    else if(name === "downloadToExcel"){
      tableToExcel.render(gridTableId);       
    }
    else if(name === "createDocument"){
      let commandJson = 
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: {value: "createDocument"}
        }
      }
      console.log("createDocument:", commandJson)
      sendFieldValues(commandJson)
      clearTabData(process_id)
    }
    else if(name === "cancel"){
      const commandJson = 
      {
        commandType: "completeTask",
        process_id: process_id,
        session_id: session_id,
        taskID: taskID,
        userRole: userProfile.userRole,
        variables: {
          authorization: {value: "token"},
          userAction: {value: "cancel"},
        }
      }
      console.log("button cancel: ", commandJson)
      sendFieldValues(commandJson)
      clearTabData(process_id)
    }
    else if(name === "openDocument"){
      // console.log("ITEM", item)
      let commandJson = 
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          selectedDoc: {value: JSON.stringify(item)},
          userAction: {value: "openDocument"},
          docId: {value: item.id}
        }
      }
      console.log("button openDocument: ", commandJson)
      sendFieldValues(commandJson)
      clearTabData(process_id)
    }
    else if(name === "openReferenceDocument"){
      // console.log("ITEM", item)
      let commandJson = 
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          apiName: {value: item.controller},
          userAction: {value: "openReferenceDocument"},
          gridFormDefId: {value: item.grid_form},
          creatingFormDefId: {value: item.creating_form},
          editFormDefId: {value: item.edit_form}
        }
      }
      console.log("button openReferenceDocument: ", commandJson)
      sendFieldValues(commandJson)
      clearTabData(process_id)
    }
    else if(name === "updateDocument"){
      let updateBody = getFieldValuesUpdateDocument()
      let commandJson = 
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: {value: "updateDocument"},
          document: {value: JSON.stringify(updateBody)}
        }
      }
      console.log("updateDocument:", commandJson)
      sendFieldValues(commandJson)
      // swAllert("Данные успешно обновлены!", "success")
      clearTabData(process_id)
    }    
    else if(name === "saveDocument"){
      let docToSave = getFieldValuesSaveDocument()
      let commandJson = 
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: {value: "saveDocument"},
          document: {value: JSON.stringify(docToSave)}
        }
      }
      console.log("saveDocument:", commandJson)
      sendFieldValues(commandJson)
      // swAllert("Данные сохранены!", "success")
      clearTabData(process_id)
    }
    else if (name === "back"){
      let commandJson = 
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: {value: "back"},
        }
      }
      console.log("button back:", commandJson)
      sendFieldValues(commandJson)
      clearTabData(process_id)
    }    
    else{
      console.log("UNKNOWN Button ", name)
    }
  }
  // Convert date to approptiate format
  function parseDate(date){
    try{
      var newDate = new Date(date) // "2020-01-26"
      var dd = String(newDate.getDate()).padStart(2, '0')
      var mm = String(newDate.getMonth() + 1).padStart(2, '0') //January is 0!
      var yyyy = newDate.getFullYear()
      var convertedDate = yyyy + '-' + mm + '-' + dd
      // console.log("CDATE", convertedDate)
      return convertedDate
    }
    catch(er){
      return "NaN.NaN.NaN"
    }
  }
  // Create sections with labels and call bodyBuilder function
  function sectionBuilder(section){
    return (
      <Table size="small" key={keyGen(5)}>
        <TableHead>
          <TableRow style={{height: 30}}>
            <TableCell 
              key={keyGen(5)} 
              style={{
                color: "white",
                fontSize: 14,
                background: "linear-gradient(to left, #019CAD, #4c6686)",
                width: "100%",
                fontWeight: "bold"
              }}>
                {section.label}
            </TableCell> 
          </TableRow>
        </TableHead>
        {bodyBuilder(section)}
      </Table>
    )
  }
  // Create body of each section and call contentBuilder function
  function bodyBuilder(section){
    return(
      <Table size="small">
        <TableBody>
          {section.contents.map(contentItem=> (
            contentItem.show === true &&
              <TableRow key = {keyGen(5)} style={{maxHeight: 30}}> 
                <TableCell
                  key = {keyGen(5)}
                  align="left"
                  style={{width: "40%"}}>
                  {contentItem.label}
                </TableCell>                           
                <TableCell
                  key = {keyGen(5)}
                  align="left"
                  style={{width: "60%", height: 30}}
                  >{contentBuilder(contentItem)}
                </TableCell>
              </TableRow>
          ))} 
        </TableBody>
      </Table>
    )
  }
  // Creating components by it's type
  function contentBuilder(contentItem){
    // if(contentItem.show === true)
    // }
    if (contentItem.type === "Text"){
      return (
        <TextField
          multiline
          onBlur = {handleChange}
          name = {contentItem.name}
          style={{width: "100%"}}
          disabled={(formType === "view" || contentItem.edit === false) ? true : false}
          defaultValue = {(fieldValue[contentItem.name]) ? fieldValue[contentItem.name]: ""}
        />
      )
    }  
    else if (contentItem.type === "Enum"){
      let selectedOption = {
        "value": "",
        "label": "Пусто",
        "name" : contentItem.name
      }
      if(fieldValue[contentItem.name] !== undefined){
        for(let i=0; i<enumOptions[contentItem.name].length; i++){
          if(parseInt(fieldValue[contentItem.name]) === enumOptions[contentItem.name][i].value){
            selectedOption = enumOptions[contentItem.name][i]
            break
          }
        }
      }
      if(selectedOptions.length !== 0){
        for(let i=0; i<selectedOptions.length; i++){
          if(contentItem.name === selectedOptions[i].name){
            selectedOption = selectedOptions[i]
          }
        }
      }
      return (
        <Select
          name = {contentItem.name}
          value = {selectedOption}
          onChange={handleSelectChange}
          options={enumOptions[contentItem.name]}
          isDisabled ={(formType === "view" || contentItem.edit === false) ? true : false}
        />
      )
    }
    else if(contentItem.type === "Bool"){
      return(
        <Checkbox
          key={keyGen(5)}          
          style={{maxWidth: 20, height: 15, color: (formType === "view" || contentItem.edit === false) ? "#37474f" : "grey"}}
          name = {contentItem.name}
          onChange={handleCheckboxChange}
          disabled={(formType === "view" || contentItem.edit === false) ? true : false}
          checked = {(fieldValue[contentItem.name] === false || fieldValue[contentItem.name] === null || fieldValue[contentItem.name] === undefined) ? false : true}
        />
      )
    }
    else if(contentItem.type === "Int"){
      return (
        <TextField
          disabled={(formType === "view" || contentItem.edit === false) ? true : false}
          style={{width: "100%"}}
          defaultValue = {(fieldValue[contentItem.name] !== undefined) ? fieldValue[contentItem.name]: ""}
          // value = {(fieldValue[contentItem.name] !== undefined) ? fieldValue[contentItem.name]: ""}
          onBlur = {handleIntChange}
          name = {contentItem.name}
          InputProps={{inputComponent: IntegerFormat}}
        />
      )
    }
    else if(contentItem.type === "Float"){
      console.log("FLOAT VAL", fieldValue[contentItem.name])
      return(
        <TextField
          name = {contentItem.name}
          onBlur = {handleFloatChange}
          value = {fieldValue[contentItem.name]}
          style={{width: "100%"}}
          disabled={(formType === "view" || contentItem.edit === false) ? true : false}
          InputProps={{inputComponent: FloatFormat}}
        />
      )
    }
    else if (contentItem.type === "DateTime"){
      return (
        <TextField
          type="date"
          name = {contentItem.name}
          onBlur = {handleDateTimeChange}
          style={{width: "100%"}}
          defaultValue = {(fieldValue[contentItem.name] !== undefined) ? parseDate(fieldValue[contentItem.name]): ""}
          disabled={(formType === "view" || contentItem.edit === false) ? true : false}
          InputLabelProps={{
            shrink: true,
          }}
        />
      )
    }
  }
  // Create grid form components
  function getGridFormItems(attribute, formItem){
    // console.log("ITEM", attribute, formItem)
    if(formItem.type === "Text"){
      if(attribute.value === null || attribute.value === "" || attribute.value === undefined){
        return(<td align="center" style={{color: "black", fontSize: 12, fontFamily:"Courier"}}>-</td>)
      }
      else{
        return(<td>{attribute.value}</td>)
      }      
    }
    else if(formItem.type === "DateTime"){
      if(attribute.value === null || attribute.value === "" || attribute.value === undefined){
        return(<td align="center" style={{color: "black", fontSize: 12, fontFamily:"Courier"}}>-</td>)
      }
      else{
        // console.log("ITEM", dataItem, value)
        let dateRev = attribute.value.substring(0, 10)
        let date = Moment(dateRev).format('DD-MM-YYYY')
        return date
        //  + " " + Time
      }
    }
    else if(formItem.type === "Float"){
      if(attribute.value === null || attribute.value === "" || attribute.value === undefined){
        return(<td align = "center" style = {{color: "black", fontSize: 12, fontFamily:"Courier"}}></td>)
      }
      else{
        return(<td>{parseFloat(attribute.value).toFixed(2)}</td>)
      }
    }
    else if(formItem.type === "Int"){
      if(attribute.value === null || attribute.value === "" || attribute.value === undefined){
        return(<td align = "center" style = {{color: "black", fontSize: 12, fontFamily:"Courier"}}></td>)
      }
      else{
        return(<td>{attribute.value}</td>)
      }
    }
    // if(type === "Enum"){
    //   if(value === null || value === "" || value === undefined){
    //     return(<td align="center" style={{color: "black", fontSize: 12}}>-</td>)
    //   }
    //   else{
    //     // console.log("ENUM", name, value, type)
    //     // for(let i=0; i<gridFormEnumData.length; i++){
    //     //   if(name === gridFormEnumData[i].name){
    //     //     for(let l=0; l<gridFormEnumData[i].data.length; l++){
    //     //       if(gridFormEnumData[i].data[l].id === parseInt(value)){
    //     //         return gridFormEnumData[i].data[l].label
    //     //       }
    //     //     }
    //     //   }
    //     // }
    //   }
    // }
    // else if(type === "Bool"){
    //   // console.log("ITEM", name, value, type)
    //   return(
    //     <Checkbox
    //       style={{maxWidth: 20, height: 15, color: value === false ? "red" : "green"}}
    //       // name = {name}
    //       checked = {(value === false || value === null || value === undefined) ? false : true}
    //     />
    //   )
    // } 
    
    
    // else{
    //   if(value === null || value === "" || value === undefined){
    //     return(<td align="center" style={{color: "black", fontSize: 12}}>-</td>)
    //   }
    //   else{
    //     return(<td>{value}</td>)
    //   }
    // }
  }
  if(updateState !== null){
    try{
      return(
        <Grid>
          {/* Create main search table */}
          {Form !== "null" &&
            <Grid container direction="row" justify="flex-start" spacing={0} style={{marginTop:17}}>
              <Grid item sm={"auto"} style={{ border:"solid 0.1px #c5c5c5", borderCollapse:"collapse", fontFamily:"Courier"}}>
                <Paper>                
                  <Table style={{border:"solid 0.1px #949494", borderCollapse:"collapse", fontFamily:"Courier"}} 
                  bordered
                  size="small">                   
                    <Grid container direction="row" justify="center" alignItems="center">
                      <TableHead>
                        <TableRow style={{maxHeight: 25}}>                        
                        <TableCell style={{fontSize: 14, color: "black", fontFamily:"Courier"}}>{Form.label}</TableCell>
                        </TableRow>
                      </TableHead>
                    </Grid>                    
                    <Grid container direction="row" justify="center" alignItems="center">
                      {Form.sections.map(section => {
                        return sectionBuilder(section)
                      })}
                    </Grid>
                    <Grid container  direction="row" justify="center" alignItems="flex-start" style={{padding:5}}>
                        {buttons.map(button => (
                          <Button
                            key={keyGen(5)}
                            name={button.name}
                            variant="outlined"
                            value={button.name}
                            onClick = {() => buttonClick(button.name, null)}
                            style={{
                              padding: 6,
                              height: 25,
                              fontSize: 10,
                              color: button.color,
                              background: "linear-gradient(45deg, #019CAD, #4c6686)",
                              backgroundColor: button.backgroundColor,
                              borderColor:"#000080"
                            }}
                          >{button.label}
                          </Button>
                        )
                        )}
                    </Grid>
                  </Table>  
                </Paper>
              </Grid>
            </Grid> 
          }
          <br></br>
          <Grid>
            {tableFormButtons !== null &&
              tableFormButtons.map(button => 
              <Button
                key={button.name}
                name={button.name}
                variant="outlined"
                // id={dataItem.id}
                value={button.name}                               
                onClick = {() => buttonClick(button.name, null)}
                style={{
                  padding: 6,
                  height: 25,
                  fontSize: 10,
                  color: button.color,
                  background: "linear-gradient(45deg, #019CAD, #4c6686)",
                  backgroundColor: button.backgroundColor,
                  borderColor:"#330867"
                }}
              >{button.label}
              </Button>
            )}
          </Grid>
          {/* Create grid table with data from doclist */}
          {docList !== null &&
            <Grid container direction="row" justify="flex-start" spacing={0}>
              <Grid item sm={"auto"} style={{backgroundColor:"#F7F7F7", border:"solid 0.1px #c5c5c5", fontFamily:"Courier"}}>
                <Paper>                
                  <table 
                    id = {gridTableId}
                    size= "auto"
                    style = {{width:"100%", "border-collapse": "collapse"}}                    
                  >
                    <thead size="auto" style={{background: "linear-gradient(45deg, #9890e3, #b1f4cf)"}}>
                      <tr key = {keyGen(5)}>
                        {gridFormButtons !== null && gridFormButtons.length > 0 && 
                          <td data-exclude="true" style={{"color": "black", "fontSize": 18, fontFamily:"Courier", "border": "1px solid grey", "text-align": "center"}}></td>
                        }                        
                        {gridForm.sections.map(section => {
                          return (
                            <td colSpan={section.contents.length} key = {keyGen(5)} style={{"color": "black", "fontSize": 14, fontFamily:"Courier", "border": "1px solid grey", "text-align": "center", "font-weight":"bold"}}>{section.label}</td>
                          )
                        })}
                      </tr>
                      <tr>
                        {gridFormButtons !== null && gridFormButtons.length > 0 && 
                        <td rowSpan="2" key = {"action"} style={{"color": "black", "fontSize": 13, fontFamily:"Courier", "border": "1px solid grey", "text-align": "center", "font-weight":"bold", "minWidth": "70px", "border-bottom": "1px solid grey", padding:10}}>Действие</td>}
                        {gridForm.sections.map(section =>
                          section.contents.map(contentItem => {
                            return (
                              <td rowSpan="2" key = {keyGen(5)} style={{"color": "black", "fontSize": 13, fontFamily:"Courier", "border": "1px solid grey", "text-align": "center", "font-weight":"bold", padding:10}}>{contentItem.label}</td>
                            )
                          })
                        )}
                      </tr>
                    </thead>
                    <TableBody>
                      {Object.keys(docList).length !== 0 &&
                        docList.map(dataItem => (
                          <tr key={keyGen(5)} style={{"height": 30}}>
                            {gridFormButtons !== null && gridFormButtons.length > 0 &&
                              <td key={keyGen(5)} style={{"maxWidth": 34, "border-bottom": "1px solid grey"}}>
                                {gridFormButtons !== "null" &&
                                  gridFormButtons.map(button => 
                                  <Button
                                    key={button.name}
                                    name={button.name}
                                    variant="outlined"
                                    value={button.name}                               
                                    onClick = {() => buttonClick(button.name, dataItem)}
                                    style={{
                                      marginTop: 4,
                                      marginBottom: 4,
                                      height: 25,
                                      fontSize: 10,
                                      maxWidth: 36,
                                      color: button.color,
                                      fontWeight: button.fontWeight,
                                      background: "linear-gradient(45deg, #019CAD, #4c6686)",                                      
                                      backgroundColor: button.backgroundColor,
                                      borderColor:"#000080"                                    
                                    }}
                                  >{button.label}
                                  </Button>
                                )}
                              </td>
                            }
                              {gridForm.sections.map(section => {
                                return(
                                  section.contents.map(contentItem => {
                                    for(let a=0; a<dataItem.attributes.length; a++){
                                      // console.log("ITEM AZA", dataItem.attributes[a].name, "ITEM KGS", contentItem.name)
                                      //dataItem.attributes[a].name - название поля из API
                                      //contentItem.name - название поля из JSON
                                      if(dataItem.attributes[a].name === contentItem.name){
                                        return(
                                          <td key = {keyGen(5)}style={{"text-align": "center", "color": "black", "fontSize": 12, fontFamily:"Courier", "border-bottom": "1px solid grey", "minWidth": "70px"}}>
                                            {getGridFormItems(dataItem.attributes[a], contentItem)}
                                          </td>
                                        )
                                      }
                                    }
                                  }) 
                                )
                              })}
                          </tr>
                        )
                      )}                    
                    </TableBody>
                  </table> 
                  <tfoot>
                    <tr> 
                      <td width="80%">                        
                        <td>
                          <Tooltip title="Переход на первую страницу">
                            <IconButton onClick={() => KeyboardArrowFirstClick()}>
                              <FirstPageIcon style={{fontSize: "large", color: "black", fontFamily:"Courier"}}/>
                            </IconButton>
                          </Tooltip>
                        </td>
                        <td>
                          <Tooltip title="Переход на предыдущюю страницу">
                            <IconButton onClick={() => KeyboardArrowLeftClick(page)}>
                              <ArrowBackIosIcon style={{fontSize: "medium", color: "black", fontFamily:"Courier"}}/>
                            </IconButton>
                          </Tooltip>
                        </td>
                        <td style={{color: "black", fontSize: 14, fontFamily:"Courier"}}>
                          <input style={{maxWidth: 25, textAlign: "center" }} value={page} onChange={handlePageChange}></input>
                        </td>
                        <td>
                          <Tooltip title="Переход на следующюю страницу">
                            <IconButton onClick={() => KeyboardArrowRightClick(page)}>
                              <ArrowForwardIosIcon style={{fontSize: "medium", color: "black", fontFamily:"Courier"}}/>
                            </IconButton>
                          </Tooltip>
                        </td>
                        <td style={{color: "black", fontSize: 14, fontFamily:"Courier"}}>Стр. {page} из {getPageAmount()}</td>                      
                      </td>
                      <td width="20%" style={{fontSize: 14, fontFamily:"Courier"}}>Кол-во строк: {totalCount}</td>
                    </tr>                     
                  </tfoot>                 
                </Paper>                
              </Grid>
            </Grid>
          }
          {docList2 !== null &&
            <Grid container direction="row" justify="flex-start" spacing={0}>
              <Grid item sm={"auto"} style={{backgroundColor:"#F7F7F7", border:"solid 0.1px #c5c5c5", fontFamily:"Courier"}}>
                <Paper>                
                  <table
                    id = {gridTableId}
                    size="auto"
                    style={{width:"100%", "border-collapse": "collapse"}}
                  >
                    <thead size="auto" style={{background: "linear-gradient(45deg, #9890e3, #b1f4cf)"}}>
                      <tr>
                        {gridFormButtons !== null && gridFormButtons.length > 0 && 
                        <td colSpan="1" style={{"color": "black", "fontSize": 18, fontFamily:"Courier", "border": "1px solid grey", "text-align": "center"}}></td>
                        }                        
                        {gridForm2.sections.map(section => {
                          return (
                            <td colSpan={section.contents.length} key = {keyGen(5)} style={{"color": "black", "fontSize": 13, fontFamily:"Courier", "border": "1px solid grey", "text-align": "center", "font-weight":"bold"}}>{section.label}</td>
                          )
                        })}
                      </tr>
                      <tr>
                        {gridFormButtons !== null && gridFormButtons.length > 0 && 
                        <td rowSpan="2" key = {"action"} style={{"color": "black", "fontSize": 12, fontFamily:"Courier", "border": "1px solid grey", "text-align": "center", "font-weight":"bold", "minWidth": "70px", "border-bottom": "1px solid grey", padding:10}}>Действие</td>}
                        {gridForm2.sections.map(section =>
                          section.contents.map(contentItem => {
                            return (
                              <td rowSpan="2" key = {keyGen(5)} style={{"color": "black", "fontSize": 12, fontFamily:"Courier", "border": "1px solid grey", "text-align": "center", "font-weight":"bold", padding:10}}>{contentItem.label}</td>
                            )
                          })
                        )}
                      </tr>
                    </thead>
                    <TableBody>
                      {Object.keys(docList2).length !== 0 &&
                        docList2.map(dataItem => (
                          <tr key={keyGen(5)} style={{"height": 30}}>
                            {gridFormButtons !== null && gridFormButtons.length > 0 &&
                              <td key={keyGen(5)} style={{"maxWidth": 34, "border-bottom": "1px solid grey"}}>
                                {gridFormButtons !== "null" &&
                                  gridFormButtons.map(button => 
                                  <Button
                                    key={button.name}
                                    name={button.name}
                                    variant="outlined"
                                    value={button.name}                               
                                    onClick = {() => buttonClick(button.name, dataItem)}
                                    style={{
                                      marginTop: 4,
                                      marginBottom: 4,
                                      height: 25,
                                      fontSize: 10,
                                      maxWidth: 36,
                                      color: button.color,
                                      fontWeight: button.fontWeight, 
                                      background: "linear-gradient(45deg, #019CAD, #4c6686)",                                    
                                      backgroundColor: button.backgroundColor,
                                      borderColor:"#000080"                                    
                                    }}
                                  >{button.label}
                                  </Button>
                                )}
                              </td>
                            }
                              {gridForm2.sections.map(section => {
                                return(
                                  section.contents.map(contentItem => {
                                    for(let a=0; a<dataItem.attributes.length; a++){
                                      // console.log("ITEM AZA", dataItem.attributes[a].name, "ITEM KGS", contentItem.name)
                                      //dataItem.attributes[a].name - название поля из API
                                      //contentItem.name - название поля из JSON
                                      if(dataItem.attributes[a].name === contentItem.name){
                                        return(
                                          <td key = {keyGen(5)}style={{"text-align": "center", "color": "black", "fontSize": 12, fontFamily:"Courier", "border-bottom": "1px solid grey", "minWidth": "70px"}}>
                                            {getGridFormItems(dataItem.attributes[a], contentItem)}
                                          </td>
                                        )
                                      }
                                    }
                                  }) 
                                )
                              })}
                          </tr>
                        )
                      )}                    
                    </TableBody>
                  </table>                  
                </Paper>                
              </Grid>
            </Grid>
          }
          <Snackbar
            open={showSnackBar}
            autoHideDuration={1200} 
            onClose={()=> handleCloseSnackBar()}>
              <Alert severity="error">
                <strong>
                  {snackBarMessage}
                </strong>
              </Alert>                                         
          </Snackbar>
        </Grid>
      )
    }
    catch(er){
      console.log("ERRORDOUBLEGRID", er)
      return <CircularProgress color="secondary"/>
    }
  }
};
