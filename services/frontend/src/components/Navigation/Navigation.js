import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { io } from 'socket.io-client';
import { useTranslation } from "react-i18next";
import Header from "components/Header/Header";
import { useLocation } from "react-router-dom";


import { VscMenu } from "react-icons/vsc";
import { Container } from '@mui/material';
import Grid from "@mui/material/Grid";

import NotificationsModal from "../NotoficationsModal/NotificationsModal";
import NotificationsMenu from "../NotoficationsModal/NoticicationsMenu";

// Contexts
import { useMainContext } from "../_ContextProviders/MainDataContextProvider/MainDataProvider";
import { useShoppingCartContext } from "components/_ContextProviders/ShoppingCartProvider/ShoppingCartProvider";

// MUI v4
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Avatar from "@mui/material/Avatar";
import { Badge } from "@mui/material";
import { isWidthUp, isWidthDown } from '@material-ui/core/withWidth';
import Icon from "@material-ui/core/Icon";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
//Services
import AuthService from "services/auth.service";
import UserService from "services/user.service"
import LogService from "services/log.service";
import CommonDataService from "services/commonData.service";
import NotificationService from "services/notification.service";
import ContentService from 'services/content.service'
import CertificationSessionService from 'services/certification_session.service'

// MUI v5
import { Box } from "@mui/material";
import { Button, Typography } from "@mui/material";
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { ThemeProvider } from '@mui/material';
import { new_theme } from 'NewMuiTheme';
import SwitchRightIcon from '@mui/icons-material/SwitchRight';
//Styled components
import Autocomplete from 'styled_components/Autocomplete'
import { EIconButton, ETab, ETabBar } from "styled_components";
import Confirm from "components/common/Hooks/Confirm";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { boardingActions as boardingActionsStore } from "../../app/features/OnBoarding/data";
import { add, remove, setActiveIndex } from "app/features/ContentFactory/data"
import { setSearchQuery } from "app/features/Explore/data"

// Icons
import ESvgIcon from "styled_components/SvgIcon";
import { ReactComponent as Lesson } from "icons/icons_32/Lesson.svg";
import { ReactComponent as Exam } from "icons/icons_32/Exam.svg";
import { ReactComponent as Asset } from "icons/icons_32/Asset.svg";

import { ReactComponent as HomeIcon } from 'icons/icons_32/Home_32.svg';
import { ReactComponent as AddIcon } from 'icons/icons_32/Add2_32.svg';
import { ReactComponent as CloseIcon } from 'icons/icons_32/Close_32.svg';
import useMediaQuery from '@mui/material/useMediaQuery';
import "./navigation.scss";
import { Link } from 'react-router-dom';
import MobileHeader from 'components/Header/MobileHeader';
import ModuleSelectionModal from "../Login/ModuleSelectionModal";
import { useAuth0 } from '@auth0/auth0-react';
import StyledEIconButton from 'new_styled_components/IconButton.js/IconButton.styled';

export default function PrimarySearchAppBar({ setForceChangePassword }) {
  const { t } = useTranslation(['navigation', 'common', 'payment']);
  // const classes = useStyles();
  const urlLocation = useLocation();
  const searchParams = new URLSearchParams(urlLocation?.search)
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsMenuAnchorEl, setNotificationsMenuAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [notificationModalHelper, setNotificationModalHelper] = useState({ isOpen: false });
  const [moduleSelection, setModuleSelection] = useState({ open: false, center: null, modules: [] });
  const [tcRoles] = useState(['Root', 'EcoManager', 'CloudManager', 'NetworkManager', 'ModuleManager', "Trainer", "Trainee", "Librarian", "Inspector", "Assistant", 'Coordinator', 'TrainingManager', 'Partner', 'Other']);
  const [loadingButton, setLoadingButton] = useState(false);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isNotificationMenuOpen = Boolean(notificationsMenuAnchorEl);

  const [searchQueryValue, setSearchQueryValue] = useState('');
  const [searchQueryInputValue, setSearchQueryInputValue] = useState('');
  const navigate = useNavigate();

  const isFirstRun = useRef(true);
  const socket = useRef();
  const matches = useMediaQuery('(max-width:600px)');
  // current route
  const { myCurrentRoute,
    F_handleSetShowLoader,
    F_reloadUser,
    F_gotoDefaultView,
    F_showToastMessage,
    asyncLocalStorage,
    F_getHelper,
    F_logout,
    F_handleSidebarChange,
    currentScreenSize,
    F_collapseSidebarMobile,
    collapseSidebarMobile,
    sidebarState,
    userNotifications,
    setUserNotifications,
    navigationTabs,
    activeNavigationTab,
    setActiveNavigationTab,
    F_selectRole,
    F_t
  } = useMainContext();

  const {
    currentShoppingCart
  } = useShoppingCartContext();

  const { collapsed, toggled } = sidebarState;
  const { fullUser, userPermissions } = F_getHelper();
  const isTrainingCenter = F_getHelper().manageScopeIds.isTrainingCenter;
  // const isInCognitiveCenter = F_getHelper().user.isInCognitiveCenter;
  const [user, setUser] = useState(null);
  const isNewuser = F_getHelper().user;
  const [period, setPeriod] = useState(null);
  const dispatch = useDispatch();
  const { item: boardingItem = {} } = useSelector(s => s.boarding);
  // Load state from Redux store
  const { activeIndex, contents } = useSelector(s => s.contentFactory);

  // Confirmation modal
  const { isConfirmed } = Confirm();

  const { searchQuery } = useSelector(s => s.explore);
  // const {logout: logoutAuth0} = useAuth0();

  useEffect(() => {
    socket.current = io('', {
      reconnectionDelayMax: 10000,
      auth: {
        token: "123"
      },
      query: {
        "my-key": "my-value"
      }
    });

    socket.current.on('new_notifications', (data) => {
      // if(data.users.includes(user.id)){
      setUserNotifications((s) => ([...s, { name: 'ttt' }]));
      F_showToastMessage("You have got 1 new notification!", "success");
      // }
    });


    return () => {// Turn off socket
      socket.current.off(`new_notifications`)
    }
  }, []);


  useEffect(() => {
    if (user !== undefined && user !== null) {
      socket.current.emit('addUser', user.id);
      //socket.current.on('getUsers',users=>{console.log(users)})
      if (user.selectedPeriod) {
        CommonDataService.getPeriod(user.selectedPeriod).then((response) => {
          setPeriod(response.data);
        });
      }
    }

  }, [user]);


  const clearPeriod = async () => {
    try {
      await AuthService.refreshToken(user.access_token, user.moduleId, user.role, null)
    } catch (error) {
      // Resolve error promise from AuthService.refreshToken
    }
    F_showToastMessage("Preview from earlier period ends!", "success")
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const changeProfile = (id) => {
    var req = {
      "moduleId": id
    }
    UserService.switchUser(req).then((response) => {
      console.log("result--->", response);
      let count = 0;
      let target = '';
      if (response.data.isInTrainingCenter) { count = count + 1; target = 'training' };
      if (response.data.isInCognitiveCenter) { count = count + 1; target = 'cognitive' };
      switch (target) {

        case 'training':
          loginForTraining(response.data)
          break;
        case 'cognitive':
          loginForCognetive(response.data)
          break;

      }
    })
  }

  // Log into training module
  const loginForTraining = (data) => {
    let schoolModules = data.modules?.filter(x => x.moduleType === "SCHOOL")
    let trainingModules = data.modules?.filter(x => x.moduleType === "TRAINING")
    let cognitiveModules = data.modules.filter(x => x.moduleType === "COGNITIVE")

    let access_token = searchParams.get('token');
    let resetPassword = searchParams.get('resetPassword');
    let confirmEmail = searchParams.get('confirmEmail');

    let shouldSelectModule = !['Root', 'EcoManager', 'CloudManager', 'NetworkManager'].includes(data.role)

    if (shouldSelectModule && trainingModules.length > 1) setModuleSelection({ open: true, center: "TRAINING", modules: trainingModules });
    else if (shouldSelectModule && trainingModules.length === 1) {
      AuthService.addModuleToScopes(trainingModules[0]._id);
      AuthService.refreshToken(access_token, trainingModules[0]._id).then(
        async (res) => {

          if (resetPassword) setForceChangePassword(true); // Inform App component
          if (confirmEmail) await AuthService.confirmEmail();

          // Set user in localstorage
          await asyncLocalStorage.setItem("user", JSON.stringify({ ...res.data, moduleId: trainingModules[0]._id }))

          if (!tcRoles.includes(data.role)) {
            let xRole = data.availableRoles.includes("Trainer") ? "Trainer" : data.availableRoles[0]
            F_selectRole(xRole)
            F_gotoDefaultView(xRole, true); // Go to default view
          } else {
            F_reloadUser(); // Set user in maindataprovider
            F_gotoDefaultView(data.role, true); // Go to default view
          }
        },
        (error) => {
          F_showToastMessage(t("common:COULD NOT REFRESH THE TOKEN"), "error");
          setLoadingButton(false);
        }
      );


    }
  }

  //==========>  Log into cognetive module
  const loginForCognetive = (data) => {
    // let schoolModules = data.modules?.filter(x => x.moduleType === "SCHOOL")
    // let trainingModules = data.modules?.filter(x => x.moduleType === "TRAINING")
    let cognitiveModules = data.modules.filter(x => x.moduleType === "COGNITIVE")
    console.log("------------", data)

    let access_token = searchParams.get('token');
    let resetPassword = searchParams.get('resetPassword');
    let confirmEmail = searchParams.get('confirmEmail');

    let shouldSelectModule = !['Root', 'EcoManager', 'CloudManager', 'NetworkManager'].includes(data.role)

    if (shouldSelectModule && cognitiveModules.length > 1) setModuleSelection({ open: true, center: "COGNITIVE", modules: cognitiveModules });
    else if (shouldSelectModule && cognitiveModules.length === 1) {
      AuthService.addModuleToScopes(cognitiveModules[0]._id);
      AuthService.refreshToken(access_token, cognitiveModules[0]._id).then(
        async (res) => {

          if (resetPassword) setForceChangePassword(true); // Inform App component
          if (confirmEmail) await AuthService.confirmEmail();

          // Set user in localstorage
          await asyncLocalStorage.setItem("user", JSON.stringify({ ...res.data, moduleId: cognitiveModules[0]._id }))

          // if (!tcRoles.includes(data.role)) {
          //   let xRole = data.availableRoles.includes("Trainer") ? "Trainer" : data.availableRoles[0]
          //   F_selectRole(xRole)
          //   F_gotoDefaultView(xRole, true); // Go to default view
          // } else {
          //   F_reloadUser(); // Set user in maindataprovider
          //   F_gotoDefaultView(data.role, true); // Go to default view
          // }

          if (!res.data.roleMaster) {
            const defaultRoleMasterId = '63c8f1cb88bbc68cce0eb2ea';
            const traineeRoleMasterId = '64058db74037cfa1d4085598';
            let xRole = (res.data.role === 'ModuleManager' ? defaultRoleMasterId : traineeRoleMasterId);
            if (res.data.availableRoleMasters && res.data.availableRoleMasters.length) {
              xRole = res.data.availableRoleMasters[0]._id;
            }
            F_selectRole(xRole)
            F_gotoDefaultView(xRole, true); // Go to default view
          } else {
            F_reloadUser(); // Set user in maindataprovider
            F_gotoDefaultView(data.role, true); // Go to default view
          }

        },
        (error) => {
          F_showToastMessage(t("common:COULD NOT REFRESH THE TOKEN"), "error");
          setLoadingButton(false);
        }
      );
    }
  }

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };


  const logout = () => {
    // AuthService.logout();
    // props.helper.reloadUser();
    // navigate("/")
    LogService.closeLog().then(res => {
      if (res.status === 200) {
        F_logout();
        setUser(null);
        handleMenuClose()
      }
    });
    // logoutAuth0();
  };

  const changeRoute = (value) => {
    navigate(value);
    handleMenuClose();
  }

  const openBadges = () => {
    navigate("/badges")
    handleMenuClose()
  }

  const openNotifications = () => {
    navigate("/notifications")
    handleMenuClose()
  }



  const renderUserAvatar = (role) => {
    switch (role) {
      case "Root": return "Root";
      case "EcoManager": return "EcoMan";
      case "Partner": return "Partner";
      case "TrainingManager": return "ClassMan";
      case "Inspector": return "Inspector";
      case "NetworkManager": return "NetworkMan";
      case "ModuleManager": return "ModuleMan";
      case "Assistant": return "ModuleMan";
      case "Coordinator": return "Architect";
      case "Architect": return "Coordinator";
      case "Librarian": return "Librarian";
      case "Trainee": return "Student";
      case "Parent": return "Parent";
      case "Trainer": return userPermissions.isClassManager ? "ClassMan" : "Teacher";
      default: return "Student";
    }
  }
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  }, [fullUser, localStorage.getItem("user")]);

  const search = (query) => {
    if (query && query.length > 0) {
      if (isTrainingCenter) {
        navigate(`/explore-courses/${query}`);
      } else {
        navigate(`/explore/${query}`);
      }
    } else {
      if (isTrainingCenter) {
        navigate(`/explore-courses/${query}`);
      } else if (myCurrentRoute == "Explore") {
        //navigate(`/explore`);
      }
    }
  }

  useEffect(() => {
    if (user !== null && user !== undefined) {
      getNotifications();
    }
  }, [user, notificationModalHelper.isOpen]);


  const getNotifications = () => {
    NotificationService.readUnReadUserNotifications(user?.id).then(res => {
      if (res.status === 200 && res.data) {
        setUserNotifications(p => res.data);
      }
    }).catch(err => console.log(err));
  };

  const showHelp = () => {
    if (boardingItem?.name === myCurrentRoute) {
      dispatch(boardingActionsStore.boardingHelper({ type: 'OPEN', item: { ...boardingItem, isCompleted: false, postponedTo: null } }));
      handleMenuClose();
    }
  }

  const switchUserHandler = (type) => {
    if (user?.modules.some(item => item.moduleType === type)) {
      const modules = user?.modules?.filter((mod) => mod._id !== user.moduleId)
      if (modules.length > 1) {
        setModuleSelection({ open: true, center: type, modules: modules })
      } else {
        changeProfile(modules[0]._id)
      }
    }
    // Close menu after switching modules
    handleMenuClose()
  }

  const showSwitchToMySpace = () =>{
    return user?.isInCognitiveCenter && user?.modules.some(item => item.moduleType === 'TRAINING') && user?.isInTrainingCenterByPermissions
  }
  const showSwitchToSentinel = () =>{
    return user?.isInTrainingCenter && user?.modules.some(item => item.moduleType === 'COGNITIVE')  && user?.isInCognitiveCenterByPermissions
  }
  const showSwitch = () =>{
    return  showSwitchToMySpace || showSwitchToSentinel
            
  }

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu dense
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {/* {user &&
      <div className="text-center switch-role">
        <Typography variant='subtitle2' component='h3' sx={{textAlign:'left', paddingLeft:'1rem', fontWeight:600}}>{t("navigation:SWITCH ROLE")}</Typography>
        {fullUser?.settings?.availableRoles?.filter(x => x)
          .filter(item => {
            if (isTrainingCenter) { // available roles in training center
              return ["Root", "EcoManager", "NetworkManager", "ModuleManager", "Trainer", "Trainee", "Librarian", "Inspector", "Assistant", 'Coordinator', 'TrainingManager', 'Partner'].includes(item)
            } else { // available roles in school
              return ["Root", "EcoManager", "NetworkManager", "ModuleManager", "Trainer", "Trainee", "Librarian", "Inspector", "Architect", "Parent"].includes(item)
            }
          })
          .map((item, index) => (
            <MenuItem key={index} selected={item === user.role} disabled={item === user.role} onClick={() => { F_selectRole(item); handleMenuClose() }}>
              <ListItemIcon
                edge="end"
                style={{ margin: "0px", minWidth: "32px" }}
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={() => {
                  F_selectRole.bind(this, item);
                  handleMenuClose()
                }}
                color="inherit"
                size="small"
                disableFocusRipple={true}
                disableRipple={true}
              >
                <Avatar sx={{mr:1, width:'30px' , height:'30px'}} src={`/img/user_icons_by_roles/${renderUserAvatar(item)}.png`} alt="user-icon-avatar" />
              </ListItemIcon>
              <ListItemText className='role-txt' primary={item === user.role ? `${t("navigation:ACTIVE ROLE")}: ${t(item)}` : `${t("navigation:")} ${t(item)}`} />
            </MenuItem>
          ))
        }
        <Divider />
      </div>
      } */}
      {/* <MenuItem onClick={()=>changeRoute("/profile-overview")}>
        <ListItemIcon style={{minWidth:'30px'}} >
          <PersonIcon/>
        </ListItemIcon>
        <ListItemText>{t("navigation:PROFILE")}</ListItemText>
      </MenuItem> */}

      {/* {JSON.parse(localStorage.getItem("user"))?.modules?.filter((mod)=>mod._id!=JSON.parse(localStorage.getItem("user")).moduleId).map((module)=>{
           return <MenuItem key={module._id} onClick={()=>changeProfile(module._id)}>
           <ListItemIcon style={{ minWidth: '30px' }} >
             <SettingsIcon style={{ fill: new_theme.palette.newSupplementary.NSupText }} />
           </ListItemIcon>
           <ListItemText className='menuTxt'> {module.moduleType}</ListItemText>
         </MenuItem>
      })} */}
      
      {showSwitch() && <Typography variant='subtitle2' component='h3' sx={{ textAlign: 'left', paddingLeft: '1rem', fontWeight: 600 }}>{t("navigation:SWITCH CENTER")}</Typography>}
      {showSwitchToSentinel() &&
        <MenuItem>
          <ListItemIcon style={{ minWidth: '30px' }} >
            <SwitchRightIcon style={{ fill: new_theme.palette.newSupplementary.NSupText }} />
          </ListItemIcon>
          <ListItemText onClick={() => switchUserHandler('COGNITIVE')} className='menuTxt'>{t("navigation:SWITCH TO") + " " + F_t("common:SENTINEL")}</ListItemText>
        </MenuItem>}
      {showSwitchToMySpace() &&
        <MenuItem>
          <ListItemIcon style={{ minWidth: '30px' }} >
            <SwitchRightIcon style={{ fill: new_theme.palette.newSupplementary.NSupText }} />
          </ListItemIcon>
          <ListItemText onClick={() => switchUserHandler('TRAINING')} className='menuTxt'>{t("navigation:SWITCH TO") + " " + t("common:MY SPACE")}</ListItemText>
        </MenuItem>}
      {showSwitch() && <Divider />}
        
      
      <MenuItem onClick={() => changeRoute("/profile-settings")}>
        <ListItemIcon style={{ minWidth: '30px' }} >
          <SettingsIcon style={{ fill: new_theme.palette.newSupplementary.NSupText }} />
        </ListItemIcon>
        <ListItemText className='menuTxt'> {t("navigation:SETTINGS")}</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => changeRoute("/orders")}>
        <ListItemIcon style={{ minWidth: '30px' }} >
          <FormatListBulletedIcon style={{ fill: new_theme.palette.newSupplementary.NSupText }} />
        </ListItemIcon>
        <ListItemText className='menuTxt'> {t("payment:ORDERS")}</ListItemText>
      </MenuItem>
      {/*<MenuItem onClick={()=>setNotificationModalHelper({isOpen: true})}>*/}
      {/*  <Badge overlap="circular"*/}
      {/*         anchorOrigin={{ vertical: 'top', horizontal: 'left' }}*/}
      {/*         color='secondary'*/}
      {/*         badgeContent={userNotifications?.length}*/}
      {/*  >*/}
      {/*  <ListItemIcon style={{minWidth:'30px'}} >*/}
      {/*    <NotificationsIcon />*/}
      {/*  </ListItemIcon>*/}
      {/*  </Badge>*/}
      {/*  <ListItemText>{t("navigation:NOTIFICATIONS")}</ListItemText>*/}
      {/*</MenuItem>*/}
      {boardingItem?.name === myCurrentRoute && (
        <MenuItem onClick={showHelp}>
          <ListItemIcon style={{ minWidth: '30px' }} >
            <HelpIcon style={{ fill: new_theme.palette.newSupplementary.NSupText }} />
          </ListItemIcon>
          <ListItemText className='menuTxt'>{`${t("navigation:NEED HELP")}?`}</ListItemText>
        </MenuItem>
      )}

      <MenuItem onClick={logout}>
        <ListItemIcon style={{ minWidth: '30px' }} >
          <LogoutIcon style={{ fill: new_theme.palette.newSupplementary.NSupText }} />
        </ListItemIcon>
        <ListItemText className='menuTxt'>{t("common:LOGOUT")}</ListItemText>
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu dense
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >{user && <div>
      {fullUser?.settings?.availableRoles?.filter(x => x).map((item, index) => (
        <MenuItem key={index} selected={item === user.role} disabled={item === user.role} onClick={() => F_selectRole(item)}>
          <ListItemIcon
            edge="end"
            style={{ margin: "0px", minWidth: "32px" }}
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={F_selectRole.bind(this, item)}
            color="inherit"
            size="small"
            disableFocusRipple={true}
            disableRipple={true}
          >
            <Avatar src={`/img/user_icons_by_roles/${renderUserAvatar(item)}.png`} alt="user-icon-avatar" />
          </ListItemIcon>
          <ListItemText primary={t(item)} />
        </MenuItem>
      ))}
      <Divider />
    </div>
      }
      <MenuItem onClick={() => changeRoute("/profile-overview")}>
        <ListItemIcon style={{ minWidth: '30px' }} >
          <PersonIcon style={{ fill: new_theme.palette.secondary.DarkPurple }} />
        </ListItemIcon>
        <ListItemText>{t("navigation:PROFILE")}</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => changeRoute("/profile-settings")}>
        <ListItemIcon style={{ minWidth: '30px' }} >
          <SettingsIcon style={{ fill: new_theme.palette.secondary.DarkPurple }} />
        </ListItemIcon>
        <ListItemText> {t("navigation:SETTINGS")}</ListItemText>
      </MenuItem>
      {/*<MenuItem onClick={()=>setNotificationModalHelper({isOpen: true})}>*/}
      {/*  <ListItemIcon style={{minWidth:'30px'}} >*/}
      {/*    <NotificationsIcon />*/}
      {/*  </ListItemIcon>*/}
      {/*  <ListItemText>{t("common:NOTIFICATIONS")}</ListItemText>*/}
      {/*</MenuItem>*/}
      <MenuItem onClick={logout}>
        <ListItemIcon style={{ minWidth: '30px' }} >
          <LogoutIcon style={{ fill: new_theme.palette.secondary.DarkPurple }} />
        </ListItemIcon>
        <ListItemText>{t("common:LOGOUT")}</ListItemText>
      </MenuItem>
    </Menu>
  );


  const renderNavigationTabs = (mobile = false) => {
    return <Box sx={{ overflow: 'hidden', pt: { xs: 2, lg: 0 }, ml: { xs: 0, lg: 3 } }}>
      <ETabBar
        value={activeNavigationTab}
        onChange={(e, i) => {
          setActiveNavigationTab(i)
          e.target.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          });

        }}
        eSize={mobile ? 'small' : 'xsmall'}
      >
        {navigationTabs?.map((tab, index) => (
          <ETab key={index} sx={{ color: 'white', minWidth: { xs: '100px', lg: '160px' } }} index={index} label={tab.name} cptRef={tab.cptRef} eSize={mobile ? 'small' : 'xsmall'} />
        ))}
      </ETabBar>
    </Box>
  }

  // Working tabs - used eg. in CF
  const renderWorkingTabs = () => {
    return <Box sx={{ overflow: 'hidden' }}>
      <ETabBar
        etype="working"
        value={activeIndex}
        onChange={(e, i) => {
          dispatch(setActiveIndex(i))

          e.target.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          });
        }}
      >
        {getWorkingTabs()?.map((tab, index) => {
          return <ETab
            key={index} etype="working"
            icon={tab.icon} iconPosition="end" background={tab.background}
            label={tab.label} onClick={(e) => { if (tab.action) tab.action(e) }}
            index={index} cptRef={tab.cptRef}
          />
        })}
      </ETabBar>
    </Box>
  }

  // Get list of objects representing working tabs
  const getWorkingTabs = () => {
    var tabs = [{ icon: <ESvgIcon viewBox="4 4 24 24" component={HomeIcon} />, action: () => { navigate("/create-content", { replace: true }) } }]

    contents?.forEach((content, index) => {
      let name = content.name || content.title || t("navigation:UNTITLED")
      let Icon = HomeIcon
      let viewBox = '4 4 24 24'

      if (content.contentType) {
        if (content.contentType == "TEST") Icon = Exam
        else if (content.contentType == "PRESENTATION") Icon = Lesson
        else Icon = Asset
        viewBox = "0 0 48 48"
      }

      tabs.push({
        label: <><ESvgIcon viewBox={viewBox} sx={{ mr: '8px' }} component={Icon} /><span>{name}</span></>,
        icon: <ESvgIcon viewBox="-2 -2 36 36" onClick={async (e) => {
          e.stopPropagation();
          if (!await isConfirmed(t("navigation:ARE YOU SURE YOU WANT TO DISMISS ALL THE CHANGES")+"?")) return
          else {
            dispatch(remove(index))
            navigate("/create-content")
          }
        }} component={CloseIcon} />
      })
    })

    tabs.push({
      icon: <ESvgIcon color={'black'} viewBox="0 0 32 32" component={AddIcon} />,
      background: 'transparent',
      action: (e) => {
        dispatch(add({}))
        e.stopPropagation()
      }
    })

    return tabs
  }




  return (
    <>
      <ThemeProvider theme={new_theme}>
        {user && (localStorage.getItem('isWelcome') === 'false' || localStorage.getItem('isWelcome') === null || user.role === 'Trainee') &&
          <Box className="sticky-top border_top nav-shadow">
            <Container maxWidth="xl" className='main_navigation_container'>
              <Grid container spacing={2} sx={{ paddingTop: '8px' }}>
                <Grid item xs={12}>
                  <div className='header_inner'>

                    <div className='top_header'>
                      <div className='header_logo' style={{ display: 'flex', alignItems: 'center' }}>
                        {!isWidthUp('md', currentScreenSize) && (
                          <div className='burger_menu'>
                            <IconButton
                              className="d-flex justify-content-end align-items-center pr-1"
                              style={{
                                width: "35px",
                                height: "40px",
                                marginRight: "10px"
                              }}
                              onClick={() => F_collapseSidebarMobile(true)}
                            >
                              <VscMenu style={{ fontSize: "24px", fill: new_theme.palette.newSupplementary }} />
                            </IconButton>

                            <MobileHeader drawerOpen={collapseSidebarMobile} handle={F_collapseSidebarMobile} />
                          </div>
                        )}
                        <NavLink exact className='logo'>
                          {/* <img src='/img/brand/Logo.png' className='img-fluid' /> */}
                             {
                              user.isInCognitiveCenter ? 
                              <>
                                {F_getHelper().isEdu && <img className='img-fluid' src="/img/brand/BrainElem_Logo_EDU.svg" />}
                                {!F_getHelper().isEdu && <img className='img-fluid' src="/img/brand/BrainElem_Logo_Sentinel.svg"/>}
                              </> 
                              : user.isInTrainingCenter ? 
                              <>
                                <img src='/img/brand/BrainElem_Logo_Academy.svg' className='img-fluid' />
                              </> 
                              : 
                              <>
                                <img src='/img/brand/BrainElem_Logo_BrainCore.svg' className='img-fluid' />
                              </>
                              
                             } 
                          
                        </NavLink>
                      </div>
                      {isWidthUp('md', currentScreenSize) && (
                        <div className='navigation'>
                          <Header />
                        </div>
                      )}
                      <div className='right_sec'>
                        <div style={{ display: 'flex' }}>
                          <div className="user_name">
                            <span className='users' style={{ fontSize: '11px', fontWeight: 'normal' }}>{t("common:HELLO")},<br /> <span>{`${isNewuser?.name} ${isNewuser?.surname}`}</span></span>
                          </div>
                          {/* <IconButton
                            style={{ marginTop: "auto", marginBottom: "auto" }}
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                            size="small"
                            disableFocusRipple={true}
                            disableRipple={true}
                          >
                            <Avatar style={{ position: "absolute", width: '45px', height: '45px' }} src={`/img/user_icons_by_roles/${renderUserAvatar(user.role)}.png`} alt="user-icon-avatar" />
                          </IconButton> */}
                          <div className='profile_icon' onClick={handleProfileMenuOpen}>
                            <StyledEIconButton color="primary" size="medium">
                              <PersonOutlineIcon />
                            </StyledEIconButton>
                            {/* <img src="/img/icons/profile-icon.svg" alt="user-icon-avatar" /> */}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          {/* {isTrainingCenter && userPermissions.isTrainee && (
                            <Badge overlap="circular"
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                              color="primary"
                              //variant='dot'
                              badgeContent={currentShoppingCart.length}
                            >
                              <EIconButton
                               className="cart_icon"
                                style={{ padding: 0, margin: 0 }}
                                edge="end"
                                aria-label="notifications"
                                aria-controls="notifications-menu"
                                aria-haspopup="true"
                                onClick={() => { navigate("/shopping-cart") }}
                                //color="inherit"
                                size="small"
                                disableFocusRipple={true}
                                disableRipple={true}
                              >
                                <img src="/img/icons/cart-figma.svg" style={{ height: "100%" }} />
                                 <Icon
                                  // style={{
                                  //   textAlign: "center",
                                  //   height: "20px",
                                  //   width: "20px",
                                  //   display: "flex",
                                  //   overflow: "visible",
                                  // }}
                                >
                                  
                                </Icon> 
                              </EIconButton>
                            </Badge>
                          )} */}
                          {/* {isWidthUp('md', currentScreenSize) && ( */}
                            <div className='Notification_icon' onClick={({ currentTarget }) => { setNotificationsMenuAnchorEl(currentTarget) }}>
                              <StyledEIconButton color="primary" size="medium">
                                <NotificationsNoneIcon />
                              </StyledEIconButton>
                              {/* <img src="/img/icons/Notifications.svg" style={{ height: "100%" }} /> */}
                            </div>
                          {/* )} */}
                        </div>
                        {/* <Badge overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            color="primary"
                            //variant='dot'
                            badgeContent={userNotifications?.length}
                          >
                            <div className='Notification_icon' onClick={({ currentTarget }) => { setNotificationsMenuAnchorEl(currentTarget) }}>
                              <img src="/img/icons/navbar_notifications.svg" style={{ height: "100%" }} />
                            </div>
                            <EIconButton
                              style={{ backgroundClip: "content-box", padding: "3px", marginTop: "auto", marginBottom: "auto", marginLeft: '25px', width: '50px', height: '50px' }}
                              color='secondary'
                              border={true}
                              edge="end"
                              aria-label="notifications"
                              aria-controls="notifications-menu"
                              aria-haspopup="true"
                              onClick={({ currentTarget }) => { setNotificationsMenuAnchorEl(currentTarget) }}
                              //color="inherit"
                              size="small"
                              disableFocusRipple={true}
                              disableRipple={true}
                            >
                              <Icon
                                style={{
                                  textAlign: "center",
                                  height: "26px",
                                  width: "26px",
                                  fontSize: "0rem",
                                  overflow: "visible",
                                }}
                              >
                                <img src="/img/icons/navbar_notifications.svg" style={{ height: "100%" }} />
                              </Icon>
                            </EIconButton>
                          </Badge> */}

                      </div>
                    </div>

                    {/* <AppBar className={classes.appBar} position="static">
                  <Toolbar className={`${collapseSidebarMobile ? "pl-0 m-0" : "pl-0 m-0"}`} style={{ minHeight: 'unset', padding: '0px' }}>




                    <div className={classes.grow} />
                    
                  </Toolbar>
                  {navigationTabs?.length > 0 &&
                    <Box sx={{ display: { xs: 'flexblock', lg: 'none', width: 'fit-content', maxWidth: '100%' } }}>
                      {renderNavigationTabs(true)}
                    </Box>
                  }
                </AppBar> */}
                    {/* additional white sticky bar with a text in the middle and a button on the far right, below the navbar */}
                    {period && <Box sx={{ display: { xs: 'none', lg: 'block', width: '100%', height: '20px', backgroundColor: 'white', position: 'sticky', top: '0px', zIndex: '1000' } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'left', alignItems: 'left', width: '60%', height: '100%', paddingTop: '2px', paddingLeft: '10px' }}>
                          <Typography variant="body2" sx={{ color: new_theme.palette.secondary.DarkPurple, fontSize: '10px', fontWeight: 'bold', textAlign: 'center' }}>
                            {t("navigation:SHOWING NOW:")}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                          <Typography variant="body2" sx={{ color: new_theme.palette.secondary.DarkPurple, fontSize: '10px', fontWeight: 'bold', textAlign: 'center' }}>
                            {period.name}, {period.period.name} ({new Date(period.period.startDate).toLocaleDateString()} - {new Date(period.period.endDate).toLocaleDateString()})
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'right', width: '60%', height: '100%', paddingRight: '20px', paddingTop: '2px' }}>
                          <Button onClick={() => clearPeriod()} variant="outlined" sx={{ fontSize: '8px', textTransform: 'uppercase', borderRadius: '10px', height: '16px', padding: '0px 20px', margin: '0px', '&:hover': { backgroundColor: new_theme.palette.secondary.DarkPurple, color: 'white' } }}>
                            {t("navigation:DONE")}
                          </Button>
                        </Box>
                      </Box>
                    </Box>}
                    {renderMobileMenu}
                    {renderMenu}
                    <ModuleSelectionModal moduleSelection={moduleSelection}
                      setModuleSelection={setModuleSelection}
                    />
                    <NotificationsMenu notificationsMenuAnchorEl={notificationsMenuAnchorEl}
                      isNotificationMenuOpen={isNotificationMenuOpen}
                      setNotificationsMenuAnchorEl={setNotificationsMenuAnchorEl}
                      setNotificationModalHelper={setNotificationModalHelper}
                    />
                  </div>
                </Grid>
              </Grid>
            </Container>
          </Box>
        }
        <NotificationsModal notificationModalHelper={notificationModalHelper} setNotificationModalHelper={setNotificationModalHelper} />


        {myCurrentRoute == "Content Factory" &&
          <Box sx={{ width: 'fit-content', maxWidth: '100%' }}>
            {renderWorkingTabs(true)}
          </Box>
        }

        {/* SUB HEADER START */}
        {/* <div style={{ marginTop: '20px' }}>
        {myCurrentRoute == "Explore" && <Autocomplete
          explore={true}
          freeSolo
          //blurOnSelect={true}
          value={searchQueryValue}
          inputValue={searchQueryInputValue}
          onInputChange={(event, value) => {
            setSearchQueryInputValue(value)
          }
          }
          onChange={(event, value) => {
            if (value) dispatch(setSearchQuery(value))
          }}
          suggestions={[]}
          getSuggestions={async (query) => {
            if (isTrainingCenter) {
              let res = await CertificationSessionService.getSessionsForExplore(undefined, query)
              let data = res?.data?.hits?.hits
              if (data) return data.map(a => a._source?.name)
              else return []
            }
            else {
              let res = await ContentService.suggest(query)
              let data = res?.data?.hits?.hits
              data = data.filter(a => a._source.contentType != "ASSET")//Ignore assets
              if (data) return data.map(a => a._source.title)
              else return []
            }
          }}


          sx={{ ml: '32px', border: "1px solid gray", color: "gray" }}
          placeholder={`${t("navigation:SEARCH")}`}
        >
        </Autocomplete>}
        {navigationTabs?.length > 0 &&
          <Box sx={{ display: { xs: 'none', lg: 'inline-block', width: 'fit-content', maxWidth: '100%' } }}>
            {renderNavigationTabs()}
          </Box>
        }
      </div> */}
        {/* SUB HEADER END */}
      </ThemeProvider>
    </>
  );
}
