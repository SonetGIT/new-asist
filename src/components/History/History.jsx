import React, {useState, useEffect} from 'react';
// import clsx from 'clsx';
// import { makeStyles} from '@material-ui/core/styles';
import Table from "@material-ui/core/Table"; // Material ui table for usual form
// import TableFooter from '@material-ui/core/TableFooter';
// import { Table} from 'reactstrap';  // Core ui table for grid form
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
import Snackbar from '@material-ui/core/Snackbar';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
// Form components
import TextField from '@material-ui/core/TextField';
import Select from 'react-select';
import Checkbox from '@material-ui/core/Checkbox';
// Libraries
import swal from 'sweetalert' // https://sweetalert.js.org/guides/
import Tooltip from '@material-ui/core/Tooltip';

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
      thousandSeparator={" "}
      isNumericString
    />
  );
}
IntegerFormat.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
}
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
  const [filteredDocList, setFilteredDocList] = useState(null)
  const [initialDocList, setInitialDocList] = useState(null)
  const [gridForm] = useState(props.userTask.gridForm)
  const [gridFormButtons] = useState(props.userTask.gridFormButtons)
  const [enumData] = useState(props.userTask.enumData)
  const [enumOptions, setEnumOptions] = useState({})
  const [gridFormEnumData] = useState(props.userTask.gridFormEnumData)
  const [fieldValue, setFieldValue] = useState({})
  const [selectedOptions, setSelectedOptions] = useState([])
  const [buttons] = useState(props.userTask.buttons)
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [showSnackBar, setShowSnackBar] = useState(false)
  const [snackBarMessage, setSnackBarMessage] = useState("")
  const [sectionColor] = useState("#B2E0C9")
  const [updateState, setUpdateState] = useState(false)
  const [taskType] = useState(props.userTask.taskType)
  
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
  // Set data from props to state of component
  useEffect(()=>{
    console.log("HISTORY PROPS", props)
    if(props.userTask.docList !== "null" && props.userTask.docList !== null){
      let parsedData  = JSON.parse(props.userTask.docList)
      console.log("DOCL", parsedData)
      if(props.userTask.taskType === "showAccountsSearchForm"){
        if(props.userProfile.userRole === "3"){
          setFilteredDocList(parsedData)
          setInitialDocList(parsedData)
          filterDocList(0, parseInt(props.userTask.size)-1, parsedData)
        }
        else{
          let newDocList = []
          for(let i=0; i<parsedData.length; i++){
            let accPart = parsedData[i].partner.toString()
            if(accPart === props.userProfile.partner){
              // console.log("MATCH", parsedData[i])
              newDocList.push(parsedData[i])
            }
          }
          setFilteredDocList(newDocList)
          setInitialDocList(newDocList)
          filterDocList(0, parseInt(props.userTask.size)-1, newDocList)
        }
      }
      else{
        setFilteredDocList(parsedData)
        setInitialDocList(parsedData)
        filterDocList(0, parseInt(props.userTask.size)-1, parsedData)
      } 
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
  function getContentType(key){
    for(let s=0; s<Form.sections.length; s++){
      for(let c=0; c<Form.sections[s].contents.length; c++){
        if(key === Form.sections[s].contents[c].name){
          return Form.sections[s].contents[c].type
        }
      }
    }
  }
  // filter users by filled parameters
  function filterDocList(fetchFrom, fetchTo, Data){
    var newDocList = []
    if(Object.keys(fieldValue).length === 0){
      newDocList = Data
    }
    else{
      for(let i=0; i<Data.length; i++){
        let match = false
        for(let key in fieldValue){
          if(Data[i][key] !== null){
            if(fieldValue[key] === null || fieldValue[key] === ""){
              match = true
            }
            else{
              let contentType = getContentType(key)
              if(contentType === "Text"){
                try{
                  let searchField = fieldValue[key].toLowerCase()
                  let dataField = Data[i][key].toLowerCase()
                  let includeSearch = dataField.includes(searchField)
                  if(includeSearch === true){
                    match = true
                  }
                  else{
                    match = false
                    break
                  }
                }
                catch(er){
                  console.log("ERR", er)
                  match = true
                }
              }
              else if(contentType === "Int" || contentType === "Float"){
                if(fieldValue[key] >= 0 || fieldValue[key] < 0){
                  let searchField = fieldValue[key].toString()
                  let dataField = Data[i][key].toString()
                  let includeSearch = dataField.includes(searchField)
                  if(includeSearch === true){
                    match = true
                  }
                  else{
                    match = false
                    break
                  }
                }
                else{match = true}
              }
              else if(contentType === "Enum"){
                if(fieldValue[key] === Data[i][key]){
                  match = true
                }
                else{
                  match = false
                  break
                }
              }
              else if(contentType === "DateTime"){
                let searchField = parseDate(fieldValue[key])
                let dataField = parseDate(Data[i][key])
                console.log("DATES", searchField, dataField, searchField.includes(dataField))
                if(searchField === "NaN-NaN-NaN"){
                  match = true
                }
                else{
                  if(searchField.includes(dataField) === true){
                    match = true
                  }
                  else{
                    match = false
                    break
                  }
                }
              }
              else if(contentType === "Bool"){
                if(fieldValue[key] === Data[i][key]){
                  match = true
                }
                else{
                  match = false
                  break
                }
              }
            }
          }
          else{
            match = false
            break
          }
        }
        if(match === true){
          newDocList.push(Data[i])
        }
      }
    }
    setFilteredDocList(newDocList)
    fetchBySize(fetchFrom, fetchTo, newDocList)
  }
  // get rows amount of filtered users by size
  function fetchBySize(fetchFrom, fetchTo, Data){
    // console.log("fetchFrom", "fetchTo")
    let newDocList = []
    for(let i=fetchFrom; i<=fetchTo; i++){
      if(Data[i] !== undefined){
        newDocList.push(Data[i])
      }
    }
    setDocList(newDocList)
  }
  // Pagination functions
  function KeyboardArrowFirstClick(){
    if(page !== 1){
      setPage(1)
      filterDocList(0, size-1, initialDocList)
    }
    else{
      setSnackBarMessage("Вы на первой странице!")
      setShowSnackBar(true)
    }
  }
  function KeyboardArrowLeftClick(page){
    if(page !== 1){
      var prevPage = page - 1
      setPage(prevPage)
      let fetchFrom = ((prevPage -1) * size) //10
      let fetchTo = (size * prevPage)-1
      filterDocList(fetchFrom, fetchTo, initialDocList)
    }
    else{
      setSnackBarMessage("Вы на первой странице!")
      setShowSnackBar(true)
    }
  }
  function KeyboardArrowRightClick(page){
    if(docList.length < size-1){
      // console.log("NO DATA")
      setSnackBarMessage("Больше нет данных!")
      setShowSnackBar(true)
    } 
    else{
      setPage(page + 1)
      let fetchFrom = (size * page)
      let fetchTo = ((page + 1) * size)-1
      filterDocList(fetchFrom, fetchTo, initialDocList)
    }
    
  }
  function handleChangeRowsPerPage(event){
    setSize(event.target.value)
    filterDocList(0, event.target.value-1, initialDocList)
    console.log("Rows amount changed: ", event.target.value)
  } 
  function GoToPage(){
    let fetchFrom = (page*size-1)-size
    let fetchTo = page*size-1
    filterDocList(fetchFrom, fetchTo, initialDocList)
  }
  function handlePageChange(event){
    setPage(event.target.value)
  }
  function handleCloseSnackBar(){
    setShowSnackBar(false)
  }
  function getPageAmount(){
    let pagesFloat = (filteredDocList.length+1)/size
    let mathRoundOfPages = Math.round(pagesFloat)
    if(pagesFloat > mathRoundOfPages){
      return mathRoundOfPages + 1
    }
    else{
      return mathRoundOfPages
    }
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
  function buttonClick(name, item){      
    if(name === "findDocument"){
      filterDocList(0, size, initialDocList)
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
  // Create grid form components
  function getGridFormItems(value, type, dataItem, name){
    if(type === "Bool"){
      // console.log("ITEM", name, value, type)
      return(
        <Checkbox
          style={{maxWidth: 20, height: 15, color: value === false ? "red" : "green"}}
          // name = {name}
          checked = {(value === false || value === null || value === undefined) ? false : true}
        />
      )
    } 
    else if(type === "DateTime"){
      if(value === null || value === "" || value === undefined){
        return(<td align="center" style={{color: "black", fontSize: 12}}>-</td>)
      }
      else{
        // console.log("ITEM", dataItem, value)
        let Date = value.substring(0, 10)
        let Time = value.substring(11, 16)
        return Date + " " + Time
      }
    }
    else{
      if(value === null || value === "" || value === undefined){
        return(<td align="center" style={{color: "black", fontSize: 12}}>-</td>)
      }
      else{
        return(<td>{value}</td>)
      }
    }
  }
  // console.log("FIELDS", fieldValue)
  // console.log("SOP", selectedOptions)
  if(updateState !== null){
    try{
      return(
        <Grid>
          {/* Create main search table */}
          <Grid container direction="row" justify="flex-start" spacing={1}>
            <Grid item xs={8}>
              <Paper>
                <Table
                  style={{width:"100%", "border-collapse": "collapse"}}>
                  <Grid container direction="row" justify="center" alignItems="center">
                    <TableHead>
                      <TableRow style={{maxHeight: 25}}>
                        <TableCell style={{fontSize: 16, color: "black"}}>История изменений записи</TableCell>
                      </TableRow>
                    </TableHead>
                  </Grid>
                  <Grid container  direction="row" justify="flex-start" alignItems="flex-start">
                      {buttons.map(button => (
                        <Button
                          key={keyGen(5)}
                          name={button.name}
                          variant="outlined"
                          value={button.name}
                          onClick = {() => buttonClick(button.name, null)}
                          style={{
                            margin: 3,
                            backgroundColor: button.backgroundColor,
                            height: 32,
                            fontSize: 12
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
          <br></br>
          {/* Create grid table with data from doclist */}
          {docList !== null &&
            <Grid container direction="row" justify="flex-start" spacing={0}>
              <Grid item sm={"auto"}>
                <Paper>
                  <table
                    size="small"
                    style={{width:"100%", "border-collapse": "collapse"}}
                  >
                    <thead style={{backgroundColor: sectionColor}}>
                      <tr>
                        {gridForm.sections.map(section => {
                          return (
                            <td colSpan={section.contents.length} key = {keyGen(5)} style={{"color": "black", "fontSize": 13, "border": "1px solid grey", "text-align": "center", "font-weight":"bold"}}>{section.label}</td>
                          )
                        })}
                      </tr>
                      <tr>
                        {gridForm.sections.map(section =>
                          section.contents.map(contentItem => {
                            return (
                              <td rowSpan="2" key = {keyGen(5)} style={{"color": "black", "fontSize": 12, "border": "1px solid grey", "text-align": "center", "font-weight":"bold"}}>{contentItem.label}</td>
                            )
                          })
                        )}
                      </tr>
                    </thead>
                    <TableBody>
                      {Object.keys(docList).length !== 0 &&
                        docList.map(dataItem => (
                          <tr key={keyGen(5)} style={{"height": 30}}>
                            <td key={keyGen(5)} style={{"maxWidth": 34, "border-bottom": "1px solid grey"}}>
                              {gridFormButtons !== "null" &&
                                gridFormButtons.map(button => 
                                <Button
                                  key={button.name}
                                  name={button.name}
                                  variant="outlined"
                                  // id={dataItem.id}
                                  value={button.name}                               
                                  onClick = {() => buttonClick(button.name, dataItem)}
                                  style={{
                                      margin: 1,
                                      height: 24,
                                      fontSize: 9,
                                      maxWidth: 32,
                                      backgroundColor: button.backgroundColor
                                  }}
                                >{button.label}
                                </Button>
                              )}
                            </td>
                              {gridForm.sections.map(section => {
                                return(
                                  section.contents.map(contentItem => {
                                    for(let key in dataItem){
                                      if(key === contentItem.name){
                                        return(
                                          <td key = {keyGen(5)}style={{"color": "black", "fontSize": 12, "border-bottom": "1px solid grey"}}>
                                            {getGridFormItems(dataItem[key], contentItem.type, dataItem, key)}
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
                      <td style={{paddingLeft: "20px"}}>
                        <div style={{minWidth: 90, color: "black"}}>Кол-во записей</div>
                      </td>                    
                      <td style={{paddingLeft: "3px"}}>
                        <FormControl
                          variant="outlined"
                          style={{minWidth: 30}}
                        >
                          <GridSelect 
                            onChange={handleChangeRowsPerPage}
                            style={{height: 25, color: "black"}}
                            value = {size}
                            > 
                            <MenuItem value = {5}>5</MenuItem>
                            <MenuItem value = {10}>10</MenuItem>
                            <MenuItem value = {15}>15</MenuItem>
                            <MenuItem value = {20}>20</MenuItem>
                            <MenuItem value = {30}>30</MenuItem>
                          </GridSelect>
                        </FormControl>
                      </td>
                      
                      <td>
                        <Tooltip title="На первую страницу">
                          <IconButton onClick={() => KeyboardArrowFirstClick()}>
                            <FirstPageIcon style={{fontSize: "large", color: "black"}}/>
                          </IconButton>
                        </Tooltip>
                      </td>
                      <td>
                        <Tooltip title="На предыдущюю страницу">
                          <IconButton onClick={() => KeyboardArrowLeftClick(page)}>
                            <ArrowBackIosIcon style={{fontSize: "medium", color: "black"}}/>
                          </IconButton>
                        </Tooltip>
                      </td>
                      <td style={{color: "black", fontSize: 16}}>
                        <input style={{maxWidth: 25}} value={page} onChange={handlePageChange}></input>
                      </td>
                      <td style={{paddingLeft: "3px"}}>
                        <Tooltip title="Перейти на указанную страницу">                              
                            <Button
                              onClick={()=> GoToPage()}
                              variant="outlined"
                              style={{
                                height: 22,
                                backgroundColor: "#D1D6D6",
                                fontSize: 12
                              }}
                            >перейти
                            </Button>
                        </Tooltip>
                      </td>
                      <td>
                        <Tooltip title="На следующюю страницу">
                          <IconButton onClick={() => KeyboardArrowRightClick(page)}>
                            <ArrowForwardIosIcon style={{fontSize: "medium", color: "black"}}/>
                          </IconButton>
                        </Tooltip>
                      </td>
                      <td style={{color: "black", fontSize: 16}}>Стр. {page} из {getPageAmount()}</td>                   
                    </tr>
                    
                  </tfoot>                
                </Paper>
              </Grid>
            </Grid>
          }
          <Snackbar
            open={showSnackBar}
            onClose={()=> handleCloseSnackBar()}
            autoHideDuration={1200} 
            message={snackBarMessage}
          />  
        </Grid>
      )
    }
    catch(er){
      console.log("ERROR", er)
      return <LinearProgress/>
    }
  }
};
