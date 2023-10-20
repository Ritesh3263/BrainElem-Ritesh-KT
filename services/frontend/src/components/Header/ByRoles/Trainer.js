import React, { useState } from "react";
import { Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import Icon from "@material-ui/core/Icon";
import { Link } from "react-router-dom";
import { useMainContext } from "../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import { useTranslation } from "react-i18next";
import ListItemButton from "@mui/material/ListItemButton";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { new_theme } from "NewMuiTheme";
import { ThemeProvider, Typography } from "@mui/material";
import Fade from '@mui/material/Fade';
//Services
import CommonService from 'services/common.service'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import "../Header.scss";

export default function Trainer({ collapsed }) {
  const { t, i18n, translationsLoaded } = useTranslation(['translation', 'common', 'mySpace-virtualCoach']);
  const { myCurrentRoute, F_getHelper } = useMainContext();
  const isInTrainingCenter = F_getHelper().manageScopeIds.isTrainingCenter;
  const permissions = F_getHelper().userPermissions;
  const [navSubItems, setNavSubItems] = useState(['tab-library', 'tab-session', 'tab-general', 'tab-teaching']);

  const toggleHandler = (item) => {
    if (navSubItems.includes(item)) {
      setNavSubItems(p => p.filter(i => i !== item))
    } else {
      setNavSubItems(p => ([...p, item]))
    }
  }
  const current_url = window.location.href;
  return (
    <ThemeProvider theme={new_theme}>
      <div className="menu_bar">
        <div className="main_navigation">
          <nav className="nav_bar">
            <ul className="main_menu">
              <li className={`${current_url.includes("sentinel/myspace") || current_url.includes("myspace") ? 'menu_active' : ''}`}>
                <Link to={"/myspace"}><Typography variant="body2" component="span">{t("General")} </Typography></Link>
                <ul className="submenu">
                  {/* <li className={current_url.includes("dashboard") ? 'active' : ''}>
                    <Link to={"/dashboard"} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("Dashboard")}</Typography>
                    </Link>
                  </li> */}
                  <li className={current_url.includes("myspace") ? 'active' : ''}>
                    <Link to={"/myspace"} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("common:MY SPACE")}</Typography>
                    </Link>
                  </li>
                </ul>
              </li>
              {!isInTrainingCenter && (
                <>
                  <li className={`${current_url.includes("schedule") || current_url.includes("examinate") || current_url.includes("my-courses") || current_url.includes("gradebooks-main") || current_url.includes("program-trainer-preview") || current_url.includes("program-edit") ? 'menu_active' : ''}`}>
                    <Link><Typography variant="body2" component="span">{t("Teaching")} </Typography></Link>
                    <ul className="submenu">
                      <li className={current_url.includes("schedule") ? 'active' : ''}>
                        <Link to={"/schedule"} className="pro-item-content">
                          <Typography variant="body2" component="span">{t("Schedule")}</Typography>
                        </Link>
                      </li>
                      <li className={current_url.includes("examinate") ? 'active' : ''}>
                        <Link to={"/examinate"} className="pro-item-content">
                          <Typography variant="body2" component="span">{t("Exams and assigments")}</Typography>
                        </Link>
                      </li>
                      <li className={current_url.includes("my-courses") ? 'active' : ''}>
                        <Link to={"/my-courses"} className="pro-item-content">
                          <Typography variant="body2" component="span">{t("My courses")}</Typography>
                        </Link>
                      </li>
                      <li className={current_url.includes("gradebooks-main") ? 'active' : ''}>
                        <Link to={"/gradebooks-main"} className="pro-item-content">
                          <Typography variant="body2" component="span">{t("Grade book")}</Typography>
                        </Link>
                      </li>
                      <li className={current_url.includes("program-trainer-preview") ? 'active' : ''}>
                        <Link to={"/program-trainer-preview"} className="pro-item-content">
                          <Typography variant="body2" component="span">{t("Program preview")}</Typography>
                        </Link>
                      </li>
                      <li className={current_url.includes("program-edit") ? 'active' : ''}>
                        <Link to={"/program-edit"} className="pro-item-content">
                          <Typography variant="body2" component="span">{t("Edit Program")}</Typography>
                        </Link>
                      </li>
                    </ul>
                  </li>
                </>
              )}
              {/* {isInTrainingCenter && (
                <>
                  <li className={`${current_url.includes("examinate") || current_url.includes("sessions-free") || current_url.includes("sessions") ? 'menu_active' : ''}`}>
                    <Link><Typography variant="body2" component="span">{t("Session setup")} </Typography></Link>
                    <ul className="submenu">
                      <li className={current_url.includes("examinate") ? 'active' : ''}>
                        <Link to={"/examinate"} className="pro-item-content">
                          <Typography variant="body2" component="span">{t("Exams and assigments")}</Typography>
                        </Link>
                      </li>
                      <li className={current_url.includes("sessions-free") ? 'active' : ''}>
                        <Link to={"/sessions-free"} className="pro-item-content">
                          <Typography variant="body2" component="span">{t("Sessions")}</Typography>
                        </Link>
                      </li>
                      <li className={current_url.includes("sessions") ? 'active' : ''}>
                        <Link to={"/sessions"} className="pro-item-content">
                          <Typography variant="body2" component="span">{t("Sessions (BC)")}</Typography>
                        </Link>
                      </li>
                    </ul>
                  </li>
                </>
              )} */}
              {permissions.isClassManager && (
                <>
                  <li className={current_url.includes("reports") ? 'active' : ''}>
                    <Link to={"/reports"} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("Reports")}</Typography>
                    </Link>
                  </li>
                </>
              )}
              {/* <li className={`${current_url.includes("explore-courses") || current_url.includes("create-content") || current_url.includes("my-library") ? 'menu_active' : ''}`}>
                <Link to={"/my-library"}><Typography variant="body2" component="span">{t("Library")} </Typography></Link>
                <ul className="submenu">
                  <li className={current_url.includes("explore") ? 'active' : ''}>
                    <Link to={(isInTrainingCenter ? "/explore-courses" : "/explore")} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("Explore")}</Typography>
                    </Link>
                  </li>
                  <li className={current_url.includes("create-content") ? 'active' : ''}>
                    <Link to={"/create-content"} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("Create")}</Typography>
                    </Link>
                  </li>
                  <li className={current_url.includes("my-library") ? 'active' : ''}>
                    <Link to={"/my-library"} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("My library")}</Typography>
                    </Link>
                  </li>
                </ul>
              </li> */}
            </ul>
          </nav>
        </div>



        {/* {collapsed ? (
          <>
            <hr />
            <MenuItem
              className={`collapsed-icon ${t(myCurrentRoute) === t("Dashboard") && "currActiveArchitect"}`}
              title={t("Dashboard")}
              icon={
                <Icon style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }}>
                  <img src="/img/icons/sidebar_dashboard.svg" style={{ height: "100%" }} />
                </Icon>}>
              <Link to={"/dashboard"} className="pro-item-content">
                {t("Dashboard")}
              </Link>
            </MenuItem>
            <MenuItem
              hidden={!CommonService.isDevelopment()}
              className={`collapsed-icon ${t(myCurrentRoute) === t("Cognitive space") && "currActiveArchitect"}`}
              title={t("Cognitive space")}
              icon={
                <Icon style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }}>
                  <img src="/img/icons/Lighbulb.svg" style={{ height: "100%" }} />
                </Icon>}>
              <Link to={"/myspace"} className="pro-item-content">
                {t("Cognitive space")}
              </Link>
            </MenuItem>
            {!isInTrainingCenter &&
              (<hr />
              )}
            {!isInTrainingCenter && (
              <MenuItem
                className={`collapsed-icon ${t(myCurrentRoute) === t("Schedule") && (isInTrainingCenter ? "currActiveArchitect" : "currActiveExam")
                  }`}
                title={t("Schedule")}
                icon={
                  <Icon style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }} >
                    <img src="/img/icons/sidebar_schedule.svg" style={{ height: "100%" }} />
                  </Icon>}>
                <Link to={"/schedule"} className="pro-item-content">
                  {t("Schedule")}
                </Link>
              </MenuItem>
            )}
            {!isInTrainingCenter && (
              <MenuItem
                className={`collapsed-icon ${(t(myCurrentRoute) === t("Exams and assigments")) &&
                  (isInTrainingCenter ? "currActiveArchitect" : "currActiveExam")}`}
                title={t("Exams and assigments")}
                icon={
                  <Icon style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }}>
                    <img src="/img/icons/sidebar_examinate.svg" style={{ height: "100%" }} />
                  </Icon>}>
                <Link to={"/examinate"} className="pro-item-content">
                  {t("Exams and assigments")}
                </Link>
              </MenuItem>
            )}
            {!isInTrainingCenter && (
              <MenuItem
                className={`collapsed-icon ${t(myCurrentRoute) === t("My courses") && (isInTrainingCenter ? "currActiveArchitect" : "currActiveExam")
                  }`}
                title={t("My courses")}
                icon={
                  <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }} >
                    <img src="/img/icons/sidebar_myCourses.svg" style={{ height: "100%" }} />
                  </Icon>}>
                <Link to={"/my-courses"} className="pro-item-content">
                  {t("My courses")}
                </Link>
              </MenuItem>
            )}
            {!isInTrainingCenter && (
              <MenuItem
                className={`collapsed-icon ${(t(myCurrentRoute) === t("Gradebook") ||
                  t(myCurrentRoute) === t("Subject average")) &&
                  (isInTrainingCenter ? "currActiveArchitect" : "currActiveExam")
                  }`}
                title={t("Grade book")}
                icon={
                  <Icon style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }} >
                    <img src="/img/icons/sidebar_gradebook.svg" style={{ height: "100%" }} />
                  </Icon>}>
                <Link to={"/gradebooks-main"} className="pro-item-content">
                  {t("Grade book")}
                </Link>
              </MenuItem>
            )}
            {!isInTrainingCenter && (
              <MenuItem
                className={`collapsed-icon ${t(myCurrentRoute) === t("Program preview") &&
                  "currActiveExam"
                  }`}
                title={t("Program preview")}
                icon={
                  <Icon style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }}>
                    <img src="/img/icons/sidebar_programs.svg" style={{ height: "100%" }} />
                  </Icon>}>
                <Link to={"/program-trainer-preview"} className="pro-item-content">
                  {t("Program preview")}
                </Link>
              </MenuItem>
            )}
            {!isInTrainingCenter && (
              <MenuItem
                className={`collapsed-icon ${t(myCurrentRoute) === t("Program edit") &&
                  "currActiveExam"
                  }`}
                title={isInTrainingCenter ? t("Edit Session") : t("Edit Program")}
                icon={
                  <Icon style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }}>
                    <img src="/img/icons/sidebar_programs.svg" style={{ height: "100%" }} />
                  </Icon>}>
                <Link to={"/program-edit"} className="pro-item-content">
                  {isInTrainingCenter ? t("Edit Session") : t("Edit Program")}
                </Link>
              </MenuItem>
            )}
            {isInTrainingCenter && (
              <hr />
            )}
            {isInTrainingCenter && (
              <>
                <MenuItem
                  className={`collapsed-icon ${(t(myCurrentRoute) === t("Exams and assigments")) &&
                    (isInTrainingCenter ? "currActiveArchitect" : "currActiveExam")}`}
                  title={t("Exams and assigments")}
                  icon={
                    <Icon style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }}>
                      <img src="/img/icons/sidebar_examinate.svg" style={{ height: "100%" }} />
                    </Icon>}>
                  <Link to={"/examinate"} className="pro-item-content">
                    {t("Exams and assigments")}
                  </Link>
                </MenuItem>
                <MenuItem
                  className={`collapsed-icon ${t(myCurrentRoute) === t("Session") && "currActiveAdministration"}`} title={t("Sessions")}
                  icon={<Icon style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible" }} >
                    <img src="/img/icons/sidebar_classes.svg" style={{ height: "100%" }} />
                  </Icon>}  >
                  <Link to={"/sessions-free"} className="pro-item-content">
                    {t("Sessions")}
                  </Link>
                </MenuItem>
                <MenuItem
                  className={`collapsed-icon ${t(myCurrentRoute) === t("Session Business Client") && "currActiveAdministration"}`} title={t("Sessions")}
                  icon={<Icon style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible" }} >
                    <img src="/img/icons/sidebar_gradebook.svg" style={{ height: "100%" }} />
                  </Icon>}  >
                  <Link to={"/sessions"} className="pro-item-content">
                    {t("Sessions (BC)")}
                  </Link>
                </MenuItem>
              </>
            )}
            {permissions.isClassManager && (
              <MenuItem
                className={`collapsed-icon ${t(myCurrentRoute) === t("Reports") && "currActiveExam"
                  }`}
                title={t("Reports")}
                icon={
                  <Icon style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }}>
                    <img src="/img/icons/sidebar_reports.svg" style={{ height: "100%" }} />
                  </Icon>}>
                <Link to={"/reports"} className="pro-item-content">
                  {t("Reports")}
                </Link>
              </MenuItem>
            )}
            <>
              <hr />
              <MenuItem
                className={`collapsed-icon ${t(myCurrentRoute) === t("Explore") && "currActiveExplore"
                  }`}
                title={t("Explore content")}
                icon={
                  <Icon style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }} >
                    <img src="/img/icons/explore.svg" style={{ height: "100%" }} />
                  </Icon>}>
                <Link to={(isInTrainingCenter ? "/explore-courses" : "/explore")} className="pro-item-content">
                  {t("Explore content")}
                </Link>
              </MenuItem>
              <MenuItem
                className={`collapsed-icon ${t(myCurrentRoute) === t("Content Factory") && "currActiveExplore"
                  }`}
                title={t("Create content")}
                icon={
                  <Icon style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }} >
                    <img src="/img/icons/create.svg" style={{ height: "100%" }} />
                  </Icon>}>
                <Link to={"/create-content"} className="pro-item-content">
                  {t("Create content")}
                </Link>
              </MenuItem>
              <MenuItem
                className={`collapsed-icon ${t(myCurrentRoute) === t("Library") && "currActiveExplore"
                  }`}
                title={t("My Library")}
                icon={
                  <Icon style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }} >
                    <img src="/img/icons/my_library.svg" style={{ height: "100%" }} />
                  </Icon>}>
                <Link to={"/my-library"} className="pro-item-content">
                  {t("My Library")}
                </Link>
              </MenuItem>
            </>

            {isInTrainingCenter && (
              <hr />
            )}
          </>
        ) : (
          <>
            <ListItemButton style={{ justifyContent: "space-between", marginTop: 10, marginBottom: 8 }} dense
              onClick={() => toggleHandler('tab-general')} >
              <span id="generals" > {t("General")}</span>
              {navSubItems.includes('tab-general') ? (<ExpandLessIcon id="generals-big" />) : (<ExpandMoreIcon id="generals-big" />)}
            </ListItemButton>
            <Fade in={navSubItems.includes('tab-general')} timeout={1000}>
              <MenuItem
                hidden={!navSubItems.includes('tab-general')}
                className={
                  t(myCurrentRoute) === t("Dashboard") && "currActiveArchitect"
                }
                icon={<></>} id="general"
                prefix={
                  <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }}
                  >
                    <img src="/img/icons/sidebar_dashboard.svg" style={{ height: "100%" }} />
                  </Icon>}>
                <Link to={"/dashboard"} className="pro-item-content">
                  {t("Dashboard")}
                </Link>
              </MenuItem>
            </Fade>
            <Fade in={navSubItems.includes('tab-general')} timeout={1000}>
              <MenuItem
                hidden={!CommonService.isDevelopment() || !navSubItems.includes('tab-general')}
                className={
                  t(myCurrentRoute) === t("Cognitive space") && "currActiveArchitect"
                }
                icon={<></>} id="general"
                prefix={
                  <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }}
                  >
                    <img src="/img/icons/Lighbulb.svg" style={{ height: "100%" }} />
                  </Icon>}>
                <Link to={"/myspace"} className="pro-item-content">
                  {t("Cognitive space")}
                </Link>
              </MenuItem>
            </Fade>

            {!isInTrainingCenter && (
              <ListItemButton style={{ justifyContent: "space-between", marginTop: 10, marginBottom: 8 }} dense
                onClick={() => toggleHandler('tab-teaching')} >
                <span id="generals4" > {t("Teaching")}</span>
                {navSubItems.includes('tab-teaching') ? (<ExpandLessIcon id="generals4-big" />) : (<ExpandMoreIcon id="generals4-big" />)}
              </ListItemButton>
            )}
            {!isInTrainingCenter && (
              <Fade in={navSubItems.includes('tab-teaching')} timeout={1000}>
                <MenuItem
                  hidden={!navSubItems.includes('tab-teaching')}
                  className={
                    t(myCurrentRoute) === t("Schedule") && (isInTrainingCenter ? "currActiveArchitect" : "currActiveExam")
                  }
                  icon={<></>} id={(isInTrainingCenter ? "general" : "general4")}
                  prefix={
                    <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }}
                    >
                      <img src="/img/icons/sidebar_schedule.svg" style={{ height: "100%" }} />
                    </Icon>}>
                  <Link to={"/schedule"} className="pro-item-content">
                    {t("Schedule")}
                  </Link>
                </MenuItem>
              </Fade>
            )}
            {!isInTrainingCenter && (
              <Fade in={navSubItems.includes('tab-teaching')} timeout={1000}>
                <MenuItem
                  hidden={!navSubItems.includes('tab-teaching')}
                  className={
                    (t(myCurrentRoute) === t("Exams and assigments")) && (isInTrainingCenter ? "currActiveArchitect" : "currActiveExam")}
                  icon={<></>} id={(isInTrainingCenter ? "general" : "general4")}
                  prefix={
                    <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }}>
                      <img src="/img/icons/sidebar_examinate.svg" style={{ height: "100%" }} />
                    </Icon>}>
                  <Link to={"/examinate"} className="pro-item-content">
                    {t("Exams and assigments")}
                  </Link>
                </MenuItem>
              </Fade>
            )}
            {!isInTrainingCenter && (
              <Fade in={navSubItems.includes('tab-teaching')} timeout={1000}>
                <MenuItem
                  hidden={!navSubItems.includes('tab-teaching')}
                  className={
                    t(myCurrentRoute) === t("My courses") && (isInTrainingCenter ? "currActiveArchitect" : "currActiveExam")
                  }
                  icon={<></>} id={(isInTrainingCenter ? "general" : "general4")}
                  prefix={
                    <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }}
                    >
                      <img src="/img/icons/sidebar_myCourses.svg" style={{ height: "100%" }} />
                    </Icon>}>
                  <Link to={"/my-courses"} className="pro-item-content">
                    {t("My courses")}
                  </Link>
                </MenuItem>
              </Fade>
            )}
            {!isInTrainingCenter && (
              <Fade in={navSubItems.includes('tab-teaching')} timeout={1000}>
                <MenuItem
                  hidden={!navSubItems.includes('tab-teaching')}
                  className={
                    (t(myCurrentRoute) === t("Gradebook") ||
                      t(myCurrentRoute) === t("Subject average")) &&
                    (isInTrainingCenter ? "currActiveArchitect" : "currActiveExam")
                  }
                  icon={<></>} id={(isInTrainingCenter ? "general" : "general4")}
                  prefix={
                    <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }}
                    >
                      <img src="/img/icons/sidebar_gradebook.svg" style={{ height: "100%" }} />
                    </Icon>}>
                  <Link to={"/gradebooks-main"} className="pro-item-content">
                    {t("Grade book")}
                  </Link>
                </MenuItem>
              </Fade>
            )}
            {!isInTrainingCenter && (
              <Fade in={navSubItems.includes('tab-teaching')} timeout={1000}>
                <MenuItem
                  hidden={!navSubItems.includes('tab-teaching')}
                  className={t(myCurrentRoute) === t("Program preview") && "currActiveExam"}
                  icon={<></>} id="general4"
                  prefix={
                    <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }}>
                      <img src="/img/icons/sidebar_programs.svg" style={{ height: "100%" }} />
                    </Icon>}>
                  <Link to={"/program-trainer-preview"} className="pro-item-content">
                    {t("Program preview")}
                  </Link>
                </MenuItem>
              </Fade>
            )}
            {!isInTrainingCenter && (
              <Fade in={navSubItems.includes('tab-teaching')} timeout={1000}>
                <MenuItem
                  hidden={!navSubItems.includes('tab-teaching')}
                  className={t(myCurrentRoute) === t("Program edit") && "currActiveExam"}
                  icon={<></>} id="general4"
                  prefix={
                    <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }}>
                      <img src="/img/icons/sidebar_programs.svg" style={{ height: "100%" }} />
                    </Icon>}>
                  <Link to={"/program-edit"} className="pro-item-content">
                    {t("Edit Program")}
                  </Link>
                </MenuItem>
              </Fade>
            )}
            {isInTrainingCenter && (
              <>
                <ListItemButton style={{ justifyContent: "space-between", marginTop: 10, marginBottom: 8 }} dense
                  onClick={() => toggleHandler('tab-session')} >
                  <span id="generals2" > {t("Session setup")}</span>
                  {navSubItems.includes('tab-session') ? (<ExpandLessIcon id="generals2-big" />) : (<ExpandMoreIcon id="generals2-big" />)}
                </ListItemButton>
                <Fade in={navSubItems.includes('tab-session')} timeout={1000}>
                  <MenuItem
                    hidden={!navSubItems.includes('tab-session')}
                    className={
                      (t(myCurrentRoute) === t("Exams and assigments")) && (isInTrainingCenter ? "currActiveArchitect" : "currActiveExam")}
                    icon={<></>} id={(isInTrainingCenter ? "general" : "general4")}
                    prefix={
                      <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }}>
                        <img src="/img/icons/sidebar_examinate.svg" style={{ height: "100%" }} />
                      </Icon>}>
                    <Link to={"/examinate"} className="pro-item-content">
                      {t("Exams and assigments")}
                    </Link>
                  </MenuItem>
                </Fade>
              </>
            )}
            {isInTrainingCenter && (
              <>
                <Fade in={navSubItems.includes('tab-session')} timeout={1000}>
                  <MenuItem
                    hidden={!navSubItems.includes('tab-session')}
                    className={t(myCurrentRoute) === t("Session") && "currActiveAdministration"}
                    id="general2" icon={<></>} prefix={
                      <Icon
                        style={{
                          textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible",
                        }}  >
                        <img src="/img/icons/sidebar_classes.svg" style={{ height: "100%" }} />
                      </Icon>} >
                    <Link to={"/sessions-free"} className="pro-item-content">
                      {t("Sessions")}
                    </Link>
                  </MenuItem>
                </Fade>
                <Fade in={navSubItems.includes('tab-session')} timeout={1000}>
                  <MenuItem
                    hidden={!navSubItems.includes('tab-session')}
                    className={t(myCurrentRoute) === t("Session Business Client") && "currActiveAdministration"}
                    id="general2" icon={<></>} prefix={
                      <Icon
                        style={{
                          textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible",
                        }}  >
                        <img src="/img/icons/sidebar_gradebook.svg" style={{ height: "100%" }} />
                      </Icon>} >
                    <Link to={"/sessions"} className="pro-item-content">
                      {t("Sessions (BC)")}
                    </Link>
                  </MenuItem>
                </Fade>
              </>
            )}
            {permissions.isClassManager && (
              <Fade in={navSubItems.includes('tab-teaching')} timeout={1000}>
                <MenuItem
                  hidden={!navSubItems.includes('tab-teaching')}
                  className={t(myCurrentRoute) === t("Reports") && "currActiveExam"} icon={<></>} id="general4"
                  prefix={
                    <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }}>
                      <img src="/img/icons/sidebar_reports.svg" style={{ height: "100%" }} />
                    </Icon>}>
                  <Link to={"/reports"} className="pro-item-content">
                    {t("Reports")}
                  </Link>
                </MenuItem>
              </Fade>
            )}
            <ListItemButton style={{ justifyContent: "space-between", marginTop: 10, marginBottom: 8 }} dense
              onClick={() => toggleHandler('tab-library')} >
              <span id="generals3" > {t("Library")}</span>
              {navSubItems.includes('tab-library') ? (<ExpandLessIcon id="generals3-big" />) : (<ExpandMoreIcon id="generals3-big" />)}
            </ListItemButton>
            <>
              <Fade in={navSubItems.includes('tab-library')} timeout={1000}>
                <MenuItem
                  hidden={!navSubItems.includes('tab-library')}
                  className={t(myCurrentRoute) === t("Explore") && "currActiveExplore"}
                  icon={<></>} id="explore_create"
                  prefix={
                    <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible" }} >
                      <img src="/img/icons/explore.svg" style={{ height: "100%" }} />
                    </Icon>}  >
                  <Link to={(isInTrainingCenter ? "/explore-courses" : "/explore")} className="pro-item-content">  {t("Explore")} </Link>
                </MenuItem>
              </Fade>
              <Fade in={navSubItems.includes('tab-library')} timeout={1000}>
                <MenuItem
                  hidden={!navSubItems.includes('tab-library')}
                  className={t(myCurrentRoute) === t("Content Factory") && "currActiveExplore"}
                  icon={<></>} id="explore_create"
                  prefix={
                    <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }}  >
                      <img src="/img/icons/create.svg" style={{ height: "100%" }} />
                    </Icon>}  >
                  <Link to={"/create-content"} className="pro-item-content"> {t("Create")}</Link>
                </MenuItem>
              </Fade>
              <Fade in={navSubItems.includes('tab-library')} timeout={1000}>
                <MenuItem
                  hidden={!navSubItems.includes('tab-library')}
                  className={t(myCurrentRoute) === t("Library") && "currActiveExplore"}
                  icon={<></>} id="explore_create" prefix={
                    <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }} >
                      <img src="/img/icons/my_library.svg" style={{ height: "100%" }} />
                    </Icon>}   >
                  <Link to={"/my-library"} className="pro-item-content">  {t("My library")} </Link>
                </MenuItem>
              </Fade>
            </>
          </>
        )} */}
      </div>
    </ThemeProvider>
  );
}
