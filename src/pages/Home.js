import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import CircularProgress from "@material-ui/core/CircularProgress";
import Collapse from "@material-ui/core/Collapse";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import MainComponent from "../components/MainComponent/MainComponent.jsx";
import Box from "@material-ui/core/Box";
import { MdExitToApp } from "react-icons/io";
import { IoCloseCircle } from "react-icons/io5";
import "@fontsource/roboto-slab";
import logo from "./logo.png";
// Libs
import { useKeycloak } from "../lib";
import swal from "sweetalert"; // https://sweetalert.js.org/guides/
import { ToastContainer, toast } from "react-toastify"; // https://fkhadra.github.io/react-toastify/introduction/
import "react-toastify/dist/ReactToastify.css";

// Icons
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ExitToAppIcon from "@material-ui/icons/ExitToAppOutlined";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import AddCircleIcon from "@material-ui/icons/AddCircleOutlineOutlined";
// import AddToPhotosIcon from "@material-ui/icons/AddToPhotos";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotosOutlined";
import { MdLibraryAdd } from "react-icons/md";
import CloseIcon from "@material-ui/icons/Close";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Notification from "@material-ui/icons/Notifications";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import Badge from "@material-ui/core/Badge";
import { BiSend } from "react-icons/bi";
import { red } from "@material-ui/core/colors";

var crSnow = "#FFFAFA";
var crBlack = "#000000";
var crGreen = "#30aebc"; //контрастный оттенок светло-зеленого цвета.
var crBlue = "#304892"; //средний темный оттенок синего.
var crSnowBlue = "#2d838d"; //содержит в основном СИНИЙ цвет
var crSnowGrey = "#dfe0e1"; //светло серый

function TabPanel(props) {
  const { children, currentTab, selectedTab, ...other } = props;
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={currentTab !== selectedTab}
      id={`scrollable-auto-tabpanel-${selectedTab}`}
      aria-labelledby={`scrollable-auto-tab-${selectedTab}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}
function a11yProps(id) {
  return {
    id: `scrollable-auto-tab-${id}`,
    "aria-controls": `scrollable-auto-tabpanel-${id}`,
  };
}
var HashMap = require("hashmap");
const drawerWidth = 260;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 15, // keep right padding when drawer closed
    //ЦВЕТ ФОНА HEADER
    background: "linear-gradient(to top, #019CAD, #4c6686)",
    borderTop: "3px #304892 solid",
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "08px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  // appBarShift: {
  //   marginLeft: drawerWidth,
  //   width: `calc(100% - ${drawerWidth}px)`,
  //   transition: theme.transitions.create(["width", "margin"], {
  //     easing: theme.transitions.easing.sharp,
  //     duration: theme.transitions.duration.enteringScreen
  //   })
  // },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
    fontFamily: "Courier",
    textShadow: "2px 1px #A9A9A9",
  },
  drawerPaper: {
    // ЦВЕТ ШРИФТА МЕНЮ
    color: crBlack,
    width: drawerWidth,
    position: "relative",
    whiteSpace: "nowrap",
    fontFamily: "Courier",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  imagePaper: {
    position: "fixed",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  modal: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
const useStylesnav = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  listItemText: {
    fontSize: 14,
    // paddingLeft: 3,
    fontWeight: "bold",
    color: crBlue,
  },
  level1: {
    paddingLeft: theme.spacing(0),
    maxHeight: 22,
    margin: 3,
  },
  level2: {
    paddingLeft: theme.spacing(0.5),
    maxHeight: 22,
    margin: 3,
  },
  level3: {
    paddingLeft: theme.spacing(2),
    maxHeight: 22,
    margin: 3,
  },
  level4: {
    paddingLeft: theme.spacing(0),
    maxHeight: 22,
    margin: 3,
    color: crGreen,
    fontSize: 10,
  },
  tabs: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  addToIconStl: {
    color: crSnowBlue,
    fontSize: 18,
  },
  biSendStyle: {
    height: 18,
    color: crGreen,
    marginLeft: 4,
  },
}));

export default () => {
  const { keycloak } = useKeycloak();
  // This.state
  const [selectedTab, setSelectedTab] = useState(null);
  const [tabs, setTabs] = useState([]);
  // const [endpoint] = useState("ws://10.10.0.12:3120") //Server
  // const [mailRest] = useState("http://10.10.0.11:44327/api/Mail/SendMail") //Server
  const [endpoint] = useState("ws://192.168.2.19:3120"); //Local
  const [mailRest] = useState("http://192.168.2.150:44327/api/Mail/SendMail"); //Local
  const [routes, setRoutes] = useState([]);
  const [session_id, setSession_id] = useState(null);
  const [webSocketMessage, setWebSocketMessage] = useState(null);
  const [currTaskId, setCurrTaskId] = useState(null);
  // const [SOAT, setSOAT] = useState(null)
  const [opennav, setOpennav] = useState(false);
  const [open, setOpen] = useState(true);
  const [processInfo, setProcessInfo] = useState(null);
  const [tabCounter, setTabCounter] = useState(1);
  const [menuItemStates, setMenuItemStates] = useState([]);
  const [socket, setSocket] = useState(null);
  // const [tumarSocket, setTumarSocket] = useState(null)
  const [tabData, setTabData] = useState(null);
  const [operationDayStatus, setOperationDayStatus] = useState("Открыт");
  // User
  const [userProfile, setUserProfile] = useState({});
  // Scanner
  const [showScanComponent, setShowScanComponent] = useState(false);
  const [updateState, setUpdateState] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [unreadInstructions, setUnreadInstructions] = useState(0);
  const [urgentUnreadInstructions, setUrgentUnreadInstructions] =
    useState(false);
  const [lostCommand, setLostCommand] = useState(null);

  const classes = useStyles();
  const classesnav = useStylesnav();
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Main socket connection and data receiving
  if (socket === null && userProfile.userRole !== undefined) {
    setSocket(new WebSocket(endpoint));
    console.log("SS", socket);
  }
  if (socket !== null) {
    if (lostCommand !== null) {
      console.log("LOST COM", lostCommand);
      // sendFieldValues(lostCommand)
      // setLostCommand(null)
    }
    socket.onmessage = async function (message) {
      var incomingJson = JSON.parse(message.data);
      console.log("Socket message", incomingJson);
      if (incomingJson.messageType === "session_id") {
        setSession_id(incomingJson.session_id);
        socket.send(
          JSON.stringify({
            commandType: "getMenu",
            userProfile: userProfile,
            session_id: incomingJson.session_id,
          })
        );
        console.log("session_id", incomingJson.session_id);
      } else if (incomingJson.messageType === "Menu") {
        console.log("MENU", incomingJson.routes);
        let updatedMenuItemStates = menuItemStates.slice();
        for (let i = 0; i < incomingJson.routes.length; i++) {
          let newMenuItem = {
            name: incomingJson.routes[i].name,
            state: incomingJson.routes[i].state,
          };
          updatedMenuItemStates.push(newMenuItem);
          for (let l = 0; l < incomingJson.routes[i].level2.length; l++) {
            let newMenuItem2 = {
              name: incomingJson.routes[i].level2[l].name,
              state: incomingJson.routes[i].level2[l].state,
            };
            updatedMenuItemStates.push(newMenuItem2);
            for (
              let m = 0;
              m < incomingJson.routes[i].level2[l].level3.length;
              m++
            ) {
              if (incomingJson.routes[i].level2[l].level3[m].level4 !== null) {
                let newMenuItem3 = {
                  name: incomingJson.routes[i].level2[l].level3[m].name,
                  state: incomingJson.routes[i].level2[l].level3[m].state,
                };
                updatedMenuItemStates.push(newMenuItem3);
              }
            }
          }
        }
        socket.send(
          JSON.stringify({
            commandType: "restoreSession",
            userId: userProfile.userId,
            session_id: session_id,
            userRole: userProfile.userRole,
          })
        );
        setRoutes(incomingJson.routes);
        setMenuItemStates(updatedMenuItemStates);
        // console.log("MENU States", updatedMenuItemStates)
      } else if (incomingJson.messageType === "processInfo") {
        setProcessInfo(incomingJson);
        // console.log("processInfo", incomingJson)
      } else if (incomingJson.messageType === "completeTask") {
        console.log("Task complited ", incomingJson);
      } else if (incomingJson.messageType === "userTask") {
        let data = tabData.get(incomingJson.process_id);
        // console.log("OLD DATA", data)
        if (data === undefined) {
          tabData.set(incomingJson.process_id, incomingJson);
          setWebSocketMessage(incomingJson);
          setCurrTaskId(incomingJson.taskID);
        } else {
          clearTabData(incomingJson.process_id);
          tabData.set(incomingJson.process_id, incomingJson);
          // console.log("NEW DATA", tabData.get(incomingJson.process_id))
          setWebSocketMessage(incomingJson);
          setCurrTaskId(incomingJson.taskID);
        }
      } else if (incomingJson.messageType === "restoreTab") {
        // console.log("EXISTED DATA", tabData.get(incomingJson.process_id))
        if (tabData.get(incomingJson.process_id) === undefined) {
          await tabData.set(incomingJson.process_id, incomingJson);
          let updatedTabs = tabs.slice();
          updatedTabs.push({
            id: incomingJson.process_id,
            name: incomingJson.process_id,
            label: incomingJson.tabLabel + " " + tabCounter,
          });
          await setTabs(updatedTabs);
          await setSelectedTab(incomingJson.process_id);
          await setTabCounter(tabCounter + 1);
          await setCurrTaskId(incomingJson.taskID);
          await setWebSocketMessage(incomingJson);
          // // console.log("restoreTab", incomingJson)
        }
      } else if (incomingJson.messageType === "downloadBlob") {
        console.log("BLOB", incomingJson);
        //  var saveData = (function () {
        //     var a = document.createElement("a");
        //     document.body.appendChild(a);
        //     a.style = "display: none";
        //     return function (data, fileName) {
        //         var json = JSON.stringify(data),
        //             blob = new Blob([json], {type: "octet/stream"}),
        //             url = window.URL.createObjectURL(blob);
        //         a.href = url;
        //         a.download = fileName;
        //         a.click();
        //         window.URL.revokeObjectURL(url);
        //     };
        // }());
        // var data = { x: 42, s: "hello, world", d: new Date() },
        //     fileName = "my-download.json";
        // saveData(data, fileName);

        //   var a = document.createElement("a");
        //   document.body.appendChild(a);
        //   a.style = "display: none";
        //   return function () {
        //     let blob = incomingJson.blob
        //     let url = window.URL.createObjectURL(blob)
        //       a.href = url;
        //       a.download = "seset";
        //       a.click();
        //       window.URL.revokeObjectURL(url);
        //   }
        // }

        var url = window.URL.createObjectURL(incomingJson.blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = `fttfuh.xlsx`;
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();
        a.remove();
      }
      // else if (incomingJson.messageType === "error"){
      //   setWebSocketMessage(incomingJson)
      //   console.log("webSocket ERROR", incomingJson)
      //   tabData.set(incomingJson.process_id, incomingJson)
      //   setCurrTaskId(incomingJson.taskID)
      //   handleCloseCurrentTab(incomingJson.process_id)
      // }
      else if (incomingJson.messageType === "notifications") {
        let unreadInstructions = JSON.parse(incomingJson.unreadInstructions);
        console.log("NOTIFICATIONS", unreadInstructions);
        setUrgentUnreadInstructions(unreadInstructions.urgent);
        setUnreadInstructions(parseInt(unreadInstructions.count));
      } else if (incomingJson.messageType === "notification") {
        swal({
          text: incomingJson.text,
          icon: incomingJson.icon,
        });
      } else if (incomingJson.messageType === "toast") {
        if (incomingJson.toastType === "success") {
          toast(incomingJson.toastText, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else if (incomingJson.toastType === "error") {
          toast.error(incomingJson.toastText, {
            position: "top-right",
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      } else {
        console.log("Unknown RESTMessage", incomingJson);
      }
    };
  }

  useEffect(() => {
    if (tabData === null) {
      setTabData(new HashMap());
    }
    keycloak
      .loadUserProfile()
      .success(function (profile) {
        // console.log("PRO KKK ", profile)
        let curUserProfile = {
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          username: profile.username,
        };

        for (let i in profile.attributes) {
          // console.log("PROFILE ATR", i, profile.attributes[i][0])
          let value =
            profile.attributes[i][0] === "true"
              ? true
              : profile.attributes[i][0] === "false"
              ? false
              : profile.attributes[i][0];
          curUserProfile[i] = value;
        }
        setUserProfile(curUserProfile);
        // console.log("PROFILE: ", JSON.stringify(curUserProfile))
      })
      .error(function () {
        console.log("Failed to load user profile");
      });
  }, []);

  function handleCloseCurrentTab(tabId) {
    // await setSelectedTab(tabId)
    var selectedTabData = tabData.get(tabId);
    if (selectedTabData !== undefined) {
      var commandJson = {
        commandType: "completeTask",
        session_id: selectedTabData.session_id,
        process_id: selectedTabData.process_id,
        taskID: selectedTabData.taskID,
        variables: {
          userAction: { value: "cancel" },
          userId: { value: userProfile.userId },
          userRole: { value: userProfile.userRole },
        },
      };
      if (
        selectedTabData.taskType === "showSearchUser" ||
        selectedTabData.taskType === "showAccountsSearchForm" ||
        selectedTabData.taskType === "showSecuritiesSearchForm" ||
        selectedTabData.taskType === "showIssuersSearchForm" ||
        selectedTabData.taskType === "showDepositorsSearchForm" ||
        selectedTabData.taskType === "" ||
        selectedTabData.taskType === "" ||
        selectedTabData.taskType === "" ||
        selectedTabData.taskType === "" ||
        selectedTabData.taskType === "error"
      ) {
        sendFieldValues(commandJson);
        closeTab(tabId);
      } else
        handleOpenSwal(
          "Вы действительно хотите закрыть вкладку?",
          { yes: "Да", no: "Нет" },
          tabId
        );
    }
  }
  // Custom allert component
  function handleOpenSwal(text, swalButtons, tabId) {
    return swal({
      text: text,
      icon: "warning",
      buttons: swalButtons,
    }).then((click) => {
      if (click === "yes") {
        console.log("CLICK", click);
        handleCloseCurrentTabModal(tabId);
      } else {
        console.log("CLICK", click);
      }
    });
  }
  // Close current tab from opened alert component
  function handleCloseCurrentTabModal(tabId) {
    var selectedTabData = tabData.get(tabId);
    var commandJson = {
      commandType: "completeTask",
      session_id: selectedTabData.session_id,
      process_id: selectedTabData.process_id,
      taskID: selectedTabData.taskID,
      variables: {
        userAction: { value: "cancel" },
        userId: { value: userProfile.userId },
        userRole: { value: userProfile.userRole },
      },
    };
    sendFieldValues(commandJson);
    closeTab(tabId);
  }
  function sendFieldValues(commandJson) {
    if (socket.readyState === socket.OPEN) {
      if (
        commandJson.commandType !== "deleteSavedDoc" &&
        commandJson.commandType !== "downloadAccToExcel"
      ) {
        clearTabData(commandJson.process_id);
      }
      if (commandJson.variables !== undefined) {
        if (commandJson.variables["userAction"]["value"] === "cancel") {
          closeTab(selectedTab);
          socket.send(JSON.stringify(commandJson));
        } else {
          commandJson.variables["authorization"] = {
            value: "Bearer " + keycloak.token,
          };
          socket.send(JSON.stringify(commandJson));
          // console.log("HOME SEND", commandJson)
        }
      } else {
        socket.send(JSON.stringify(commandJson));
        // console.log("HOME SEND", commandJson)
      }
    } else {
      // alert("Проблема с соединением повторная попытка...")
      setSocket(null);
      setLostCommand(commandJson);
    }
    setCurrTaskId("");
  }
  // wrap up menu items
  function getUUID() {
    const uuidv1 = require("uuid/v1");
    return uuidv1();
  }
  async function handleTabChange(event, newValue) {
    setSelectedTab(newValue);
    setShowScanComponent(false);
    console.log("TAB CHANGE", newValue);
  }
  function clearTabData(process_id) {
    tabData.remove(process_id);
    setCurrTaskId(null);
    console.log("Clearing TabData", tabData, "ID", process_id);
  }
  // close selected tab clear it"s data from cache & change tab counter
  function closeTab(process_id) {
    if (process_id !== undefined) {
      console.log("Closing TAB", process_id);
      let updatedTabs = tabs.slice();
      for (var i = 0; i < updatedTabs.length; i++) {
        if (updatedTabs[i].id === process_id) {
          // console.log("INDEX", i)
          updatedTabs.splice(i, 1);
        }
      }
      if (updatedTabs[0] === undefined) {
        setSelectedTab(null);
        setTabCounter(1);
      } else setSelectedTab(updatedTabs[0].id);
      setTabs(updatedTabs);
    }
    // console.log("Closing TAB", process_id)
    let updatedTabs = tabs.slice();
    for (i = 0; i < updatedTabs.length; i++) {
      if (updatedTabs[i].id === process_id) {
        // console.log("INDEX", i)
        updatedTabs.splice(i, 1);
      }
    }
    if (Object.keys(updatedTabs).length === 0) {
      setSelectedTab(null);
      setTabCounter(1);
    } else {
      setSelectedTab(updatedTabs[0].id);
      setTabs(updatedTabs);
    }
  }
  function handleOpenMenuClick(name) {
    console.log("OPEN MENU", name);
    for (var i = 0; i < menuItemStates.length; i++) {
      if (menuItemStates[i].name === name) {
        if (menuItemStates[i].state === true) {
          menuItemStates[i].state = false;
        } else {
          menuItemStates[i].state = true;
        }
      }
    }
    setOpennav(!opennav);
  }
  // launch process related to menu button
  function handleMenuButtonClick(button) {
    console.log("LAUNCH", button);
    if (button.name !== "insertForm") {
      var process_id = getUUID();
      let updatedTabs = tabs.slice();
      updatedTabs.push({
        id: process_id,
        name: process_id,
        label: button.parentLabel + " " + tabCounter,
      });
      setTabs(updatedTabs);
      setSelectedTab(process_id);
      setTabCounter(tabCounter + 1);
    }
    const commandJson = {
      commandType: button.commandType,
      processKey: button.processKey,
      process_id: process_id,
      session_id: session_id,
      variables: {
        user_session_id: { value: session_id },
        process_id: { value: process_id },
        userAction: { value: "filter" },
        userId: { value: userProfile.userId },
        userRole: { value: userProfile.userRole },
        tabLabel: { value: button.parentLabel },
        authorization: { value: "Bearer " + keycloak.token },
      },
    };
    sendFieldValues(commandJson);
    console.log("Menu Button ", commandJson);
  }
  // Creating MENU Levels 1-3
  function getLevel1Items(level1, index) {
    // console.log("Creating Menu menuItemStates", menuItemStates)
    for (var i = 0; i < menuItemStates.length; i++) {
      if (menuItemStates[i].name === level1.name) {
        return (
          <List key={index}>
            <ListItem
              button
              key={index}
              className={classesnav.level1}
              // onClick={() => handleOpenMenuClick(level1.name)}
            >
              <MdLibraryAdd
                className={classesnav.addToIconStl}
                onClick={() => handleOpenMenuClick(level1.name)}
              />
              <div className={classesnav.listItemText}>{level1.label}</div>
              {/* {menuItemStates[i].state === true ? (
                <ExpandLess />
              ) : (
                <ExpandMore />
              )} */}
            </ListItem>
            <Collapse in={menuItemStates[i].state} timeout="auto" unmountOnExit>
              {level1.level2.map((level2Item, index) =>
                getLevel2Items(level2Item, index)
              )}
            </Collapse>
          </List>
        );
      }
    }
  }
  function getLevel2Items(level2, index) {
    // console.log("Level2", level2)
    for (var i = 0; i < menuItemStates.length; i++) {
      if (menuItemStates[i].name === level2.name) {
        return (
          <List component="div" disablePadding key={index}>
            <ListItem button className={classesnav.level2} key={index}>
              <MdLibraryAdd
                className={classesnav.addToIconStl}
                onClick={() => handleOpenMenuClick(level2.name)}
              />
              <div
                className={classesnav.listItemText}
                onClick={
                  level2.launchProcess === true
                    ? () => handleMenuButtonClick(level2)
                    : () => handleOpenMenuClick(level2.name)
                }
              >
                {level2.label}
              </div>
              {/* {menuItemStates[i].state === true ? (
                <ExpandLess />
              ) : (
                <ExpandMore />
              )} */}
            </ListItem>
            <Collapse in={menuItemStates[i].state} timeout="auto" unmountOnExit>
              {level2.level3.map((level3Item, index) =>
                getLevel3Items(level3Item, index)
              )}
            </Collapse>
          </List>
        );
      }
    }
  }
  function getLevel3Items(level3, index) {
    if (level3.level4 === null) {
      return (
        <ListItem
          button
          className={classesnav.level3}
          key={index}
          onClick={() => handleMenuButtonClick(level3)}
        >
          <BiSend className={classesnav.level4} />
          <div className={classesnav.listItemText}>{level3.label}</div>
        </ListItem>
      );
    } else {
      for (var i = 0; i < menuItemStates.length; i++) {
        if (menuItemStates[i].name === level3.name) {
          return (
            <List component="div" disablePadding key={index}>
              <ListItem button className={classesnav.level3} key={index}>
                <MdLibraryAdd
                  className={classesnav.addToIconStl}
                  onClick={() => handleOpenMenuClick(level3.name)}
                />
                <div
                  className={classesnav.listItemText}
                  onClick={
                    level3.launchProcess === true
                      ? () => handleMenuButtonClick(level3)
                      : () => handleOpenMenuClick(level3.name)
                  }
                >
                  {level3.label}
                </div>
                {/* {menuItemStates[i].state === true ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )} */}
              </ListItem>
              <Collapse
                in={menuItemStates[i].state}
                timeout="auto"
                unmountOnExit
              >
                {level3.level4.map((level3Item, index) =>
                  getLevel4Items(level3Item, index)
                )}
              </Collapse>
            </List>
          );
        }
      }
    }
  }
  function getLevel4Items(level4, index) {
    return (
      <ListItem
        button
        className={classesnav.level3}
        key={index}
        onClick={() => handleMenuButtonClick(level4)}
      >
        <BiSend className={classesnav.level4} />
        <div className={classesnav.listItemText}>{level4.label}</div>
      </ListItem>
    );
  }
  if (menuItemStates.length === 0) {
    return (
      <div align="center" style={{ paddingTop: 20 }}>
        <CircularProgress />
        <div>Loading...</div>
      </div>
    );
  }
  function getRole(roleId) {
    switch (roleId) {
      case "3":
        return "Администратор";
      // case "4" : return "Оператор"
      // case "5" : return "Брокер"
      // case "6" : return "Регистратор"
      // case "7" : return "Бухгалтер"
    }
  }
  // if(userId === null) return <div>No user</div>
  // console.log("Home", selectedTab)
  return (
    <Grid className={classes.root}>
      <CssBaseline />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          {/* style={{backgroundColor: "linear-gradient(to bottom, #4880EC, #019CAD)"}} */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <img src={logo} alt="Logo" />
          <Typography
            variant="h5"
            color="inherit"
            align="center"
            className={classes.title}
          >
            Адресная Социальная Информационная Система Таджикистана
          </Typography>
          <AccountCircleIcon fontSize="medium" />
          {userProfile.userId !== undefined &&
            (userProfile.userRole === "3" || userProfile.userRole === "4") && (
              <table>
                <tbody>
                  <tr>
                    {/* <td style={{paddingRight: 700}}>
                    <Badge badgeContent={2} color="primary">
                      <NotificationsActiveIcon fontSize="large" color="white"/>
                    </Badge>
                  </td> */}
                    {/* <td style={{paddingRight: 15}}>Операционный день: {operationDayStatus}</td> */}
                    {/* <td style={{paddingRight: 15}}>
                    <Badge badgeContent={unreadInstructions} color={unreadInstructions> 0 ? "secondary": "primary"}>
                      <Notification 
                        fontSize="large"
                        color={urgentUnreadInstructions === true ? "secondary" : "white"}
                        onClick={() => handleMenuButtonClick({commandType: "launchProcess", processKey: "process_892bad05-cc0e-46b2-8e76-6aa1fed7cde0", parentLabel: "Поручения"})}
                      />
                    </Badge>
                  </td> */}
                  </tr>
                </tbody>
              </table>
            )}
          {!!keycloak.authenticated && (
            <table>
              <tbody>
                <tr>
                  <td>
                    <table>
                      <tbody>
                        <tr>
                          <td style={{ fontSize: 12, fontFamily: "Courier" }}>
                            ФИО:
                          </td>
                          <td style={{ fontSize: 12, fontFamily: "Courier" }}>
                            {userProfile.firstName +
                              " " +
                              userProfile.lastName.substring(0, 1) +
                              "."}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ fontSize: 12, fontFamily: "Courier" }}>
                            Роль:
                          </td>
                          <td style={{ fontSize: 12, fontFamily: "Courier" }}>
                            {getRole(userProfile.userRole)}
                          </td>
                          Esc{" "}
                          <IoCloseCircle
                            style={{
                              fontSize: 28,
                              paddingLeft: 10,
                            }}
                            onClick={() => keycloak.logout()}
                            align="right"
                          />
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        "
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        {routes.map((level1, index) => getLevel1Items(level1, index))}
      </Drawer>
      <main className={classes.content}>
        <Grid className={classes.appBarSpacer} />
        <Grid>
          <AppBar
            position="fixed"
            color="default"
            style={{
              paddingTop: 60,
              paddingLeft: open === true ? drawerWidth : 65,
            }}
          >
            {/* ОТРИСОВКА TAB */}
            <Tabs
              position="fixed"
              value={selectedTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={tab.id}
                  label={
                    <Grid
                      style={{
                        fontFamily: "Courier",
                        color: "#000080",
                        fontSize: 11,
                        width: 290,
                        height: 10,
                      }}
                    >
                      {tab.label}
                      <IconButton onClick={() => handleCloseCurrentTab(tab.id)}>
                        <CloseIcon style={{ fontSize: 11, color: "#000080" }} />
                      </IconButton>
                    </Grid>
                  }
                  value={tab.id}
                  {...a11yProps(tab.id)}
                ></Tab>
              ))}
            </Tabs>
          </AppBar>
          {webSocketMessage !== null &&
            tabs.map((tab, index) => (
              <TabPanel
                position="fixed"
                currentTab={tab.id}
                selectedTab={selectedTab}
                key={tab.id}
                style={{ paddingTop: 60, paddingLeft: 40 }}
              >
                <MainComponent
                  userProfile={userProfile}
                  selectedTab={selectedTab}
                  showScanComponent={showScanComponent}
                  id={tab.id}
                  key={tab.id}
                  userTask={tabData.get(tab.id)}
                  sendFieldValues={sendFieldValues}
                  handleCloseCurrentTab={handleCloseCurrentTab}
                  clearTabData={clearTabData}
                  // closeTab = {closeTab}
                  mailRest={mailRest}
                ></MainComponent>
              </TabPanel>
            ))}
        </Grid>
        <ToastContainer />
        <Typography variant="body2" color="textSecondary" align="center">
          {"Copyright © "}
          {"АСИСТ "}
          {new Date().getFullYear()}
          {"."}
        </Typography>
      </main>
    </Grid>
  );
};
