//ГЛАВНЫЙ КОМПОНЕНТ
import React from "react";
import Grid from "@material-ui/core/Grid";
import Card from '@material-ui/core/Card';
import CircularProgress from '@material-ui/core/CircularProgress';
// Custom components
import ViewUserForm from "../../components/ViewUserForm/ViewUserForm.jsx";
import Contracts from "../../components/Contracts/Contracts.jsx";
import Forms from "../../components/Forms/Forms.jsx";
import History from "../../components/History/History.jsx";
import MainForm from "../../components/MainForm/MainForm.jsx";
import DoubleGridForm from "../../components/Forms/DoubleGridForm";

export default (props) => {
  async function sendFieldValues(commandJson){
    props.sendFieldValues(commandJson)
  }
  async function handleCloseCurrentTab(process_id){
    props.handleCloseCurrentTab(process_id)
  }
  async function clearTabData(process_id){
    props.clearTabData(process_id)
  }

  // console.log("Main PROP", props)
  if (!props.userTask) return <CircularProgress/> 
  else if(props.userTask.taskType === "showDepositorsSearchForm" || props.userTask.taskType === "showPersonSearchForm" || props.userTask.taskType === "showCloseMonthCreateParamForm"
          || props.userTask.taskType === "showCloseMonthSearchParamForm" || props.userTask.taskType === "showCloseMonthOnlyReadForm" || props.userTask.taskType === "showCloseMonthGetListGridForm"
          || props.userTask.taskType === "showOpenBanckAccountGetListForm" || props.userTask.taskType === "showOpenBankAccountPreviewGridForm" || props.userTask.taskType === "showOpenBankAccountRegisterForm"
          || props.userTask.taskType === "showOpenBankDistrRegisterForm" || props.userTask.taskType === "showOpenBankAccDistrAppForms" || props.userTask.taskType === "showUploadGetListGridForm"
          || props.userTask.taskType === "showUploadDistrDetailGridForm" || props.userTask.taskType === "showUploadBankAccountFileForm" || props.userTask.taskType === "showUploadBankAccountSendFileForm" 
          || props.userTask.taskType === "showRegistersForPaymentGetListForm" || props.userTask.taskType === "showRegistersForPaymentDistrForm" || props.userTask.taskType === "showRegForPayCreatDetailForm"
          || props.userTask.taskType === "showPreviewRegForPayDocListForm" || props.userTask.taskType === "showRegForPayAssignDetailForm" || props.userTask.taskType === "showRegForPayCreatDistrForm")
  {
    return (
      <MainForm
        key = {props.userTask.process_id}
        userProfile = {props.userProfile}
        userTask = {props.userTask}
        sendFieldValues = {sendFieldValues}
        clearTabData = {clearTabData}
        handleCloseCurrentTab = {handleCloseCurrentTab}
      >
      </MainForm>
    )
  }
  else if(props.userTask.taskType === "showRegistersForPaymentDistrForm1"){
    return(
      <DoubleGridForm
        key = {props.userTask.process_id}
        userProfile = {props.userProfile}
        userTask = {props.userTask}
        sendFieldValues = {sendFieldValues}
        clearTabData = {clearTabData}
        handleCloseCurrentTab = {handleCloseCurrentTab}>
      </DoubleGridForm>
    )
  }
  else if(props.userTask.taskType === "showSearchUser" ||
  props.userTask.taskType === "showCreateUser"||
  props.userTask.taskType === "showEditUser"){
    return (
      <ViewUserForm
        key = {props.userTask.process_id}
        userProfile = {props.userProfile}
        userTask = {props.userTask}
        sendFieldValues = {sendFieldValues}
        clearTabData = {clearTabData}
        handleCloseCurrentTab = {handleCloseCurrentTab}
      >
      </ViewUserForm>
    )
  }
  else if(props.userTask.taskType === "showContractsSearchForm" || 
  props.userTask.taskType === "showContractsCreatingForm" || 
  props.userTask.taskType === "showContractsEditForm"){
    return (
      <Contracts
        id = {props.userTask.process_id}
        key = {props.userTask.process_id}
        userProfile = {props.userProfile}
        userTask = {props.userTask}
        sendFieldValues = {sendFieldValues}
        clearTabData = {clearTabData}
        handleCloseCurrentTab = {handleCloseCurrentTab}
      >
      </Contracts>
    )
  }

  else if(props.userTask.taskType === "showFormsEditForm"){
    return (
      <Forms
        id = {props.userTask.process_id}
        key = {props.userTask.process_id}
        userProfile = {props.userProfile}
        userTask = {props.userTask}
        sendFieldValues = {sendFieldValues}
        clearTabData = {clearTabData}
        handleCloseCurrentTab = {handleCloseCurrentTab}
      >
      </Forms>
    )
  }
  else if(
    props.userTask.taskType === "showHistoryForm" || 
    props.userTask.taskType === ""
  )
  {
    return (
      <History
        key = {props.userTask.process_id}
        userProfile = {props.userProfile}
        userTask = {props.userTask}
        sendFieldValues = {sendFieldValues}
        clearTabData = {clearTabData}
        handleCloseCurrentTab = {handleCloseCurrentTab}
      >
      </History>
    )
  }
  
  else if(props.userTask.taskType === "error"){
    return (
      <Grid container direction="row" justify="center" spacing={0}>
        <Grid item xs={12}>
          <Card>
            <table>
              <tbody>
                <tr>
                  <td>{props.userTask.taskType}</td>
                </tr>
                <tr>
                  <td>{props.userTask.process_id}</td>
                </tr>
              </tbody>
            </table>
          </Card>
        </Grid>
      </Grid>
    )
  }
  else{
    console.log("MAIN COMP ERR", props.userTask)
    return (
      <Grid container direction="row" justify="center" spacing={0}>
        <Grid item xs={12}>
          <Card>
            <CircularProgress/>
          </Card>
        </Grid>
      </Grid>
    )
  }
}
