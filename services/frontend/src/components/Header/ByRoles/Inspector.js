import React, { useState } from "react";
import { Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import Icon from "@material-ui/core/Icon";
import { Link } from "react-router-dom";
import { useMainContext } from "../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import { useTranslation } from "react-i18next";
import ListItemButton from "@mui/material/ListItemButton";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Fade from '@mui/material/Fade';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { new_theme } from "NewMuiTheme";
import { ThemeProvider, Typography } from "@mui/material";
import "../Header.scss";

//Services
import CommonService from 'services/common.service'

export default function Inspector({ collapsed }) {
  const { t, i18n, translationsLoaded } = useTranslation();
  const { myCurrentRoute, F_getHelper } = useMainContext();
  const isInTrainingCenter = F_getHelper().manageScopeIds.isTrainingCenter;
  const permissions = F_getHelper().userPermissions;
  const [navSubItems, setNavSubItems] = useState(['tab-library', 'tab-stuff', 'tab-general']);
  const current_url = window.location.href;
  const toggleHandler = (item) => {
    if (navSubItems.includes(item)) {
      setNavSubItems(p => p.filter(i => i !== item))
    } else {
      setNavSubItems(p => ([...p, item]))
    }
  }
  return (
    <ThemeProvider theme={new_theme}>
      <div className="menu_bar">
        <div className="main_navigation">
          <nav className="nav_bar">
            <ul className="main_menu">
              <li className={`${current_url.includes("myspace") ? 'menu_active' : ''}`}>
                <Link><Typography variant="body2" component="span">{t("General")} </Typography></Link>
                <ul className="submenu">
                  <li className={current_url.includes("myspace") ? 'active' : ''}>
                    <Link to={"/myspace"} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("My space")}</Typography>
                    </Link>
                  </li>
                </ul>
              </li>
              <li className={`${current_url.includes("program-trainer-preview") || current_url.includes("gradebooks-main") || current_url.includes("schedule") || current_url.includes("reports") || current_url.includes("inspector-content") || current_url.includes("examinate") ? 'menu_active' : ''}`}>
                <Link><Typography variant="body2" component="span">{t("My stuff")} </Typography></Link>
                <ul className="submenu">
                  {!isInTrainingCenter && (
                    <li className={current_url.includes("program-trainer-preview") ? 'active' : ''}>
                      <Link to={"/program-trainer-preview"} className="pro-item-content">
                        <Typography variant="body2" component="span">{t("Program preview")}</Typography>
                      </Link>
                    </li>
                  )}
                  <li className={current_url.includes("gradebooks-main") ? 'active' : ''}>
                    <Link to={"/gradebooks-main"} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("Grade book")}</Typography>
                    </Link>
                  </li>
                  <li className={current_url.includes("schedule") ? 'active' : ''}>
                    <Link to={"/schedule"} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("Schedule")}</Typography>
                    </Link>
                  </li>
                  <li className={current_url.includes("reports") ? 'active' : ''}>
                    <Link to={"/reports"} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("Reports")}</Typography>
                    </Link>
                  </li>
                  <li className={current_url.includes("inspector-content") ? 'active' : ''}>
                    <Link to={"/inspector-content"} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("Inspect Library Content")}</Typography>
                    </Link>
                  </li>
                  <li className={current_url.includes("examinate") ? 'active' : ''}>
                    <Link to={"/examinate"} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("Exams & Homeworks")}</Typography>
                    </Link>
                  </li>
                </ul>
              </li>
              <li className={`${current_url.includes("explore") || current_url.includes("create-content") || current_url.includes("my-library") ? 'menu_active' : ''}`}>
                <Link><Typography variant="body2" component="span">{t("Library")} </Typography></Link>
                <ul className="submenu">
                  <li className={current_url.includes("explore") ? 'active' : ''}>
                    <Link to={(isInTrainingCenter ? "/explore-courses" : "/explore")} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("Explore")}</Typography>
                    </Link>
                  </li>
                  <li className={current_url.includes("create-content") ? 'active' : ''}>
                    <Link to={"/create-content"} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("Create")} </Typography>
                    </Link>
                  </li>
                  <li className={current_url.includes("my-library") ? 'active' : ''}>
                    <Link to={"/my-library"} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("My Library")}</Typography>
                    </Link>
                  </li>
                  <li>
                    <Link to={"/courses"} className="pro-item-content">
                      <Typography variant="body2" component="span"> {t("My Courses")}  </Typography>
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>

        {/* {collapsed ? (
        <>
          <hr />
          <MenuItem
            hidden={!CommonService.isDevelopment()}
            className={`collapsed-icon ${t(myCurrentRoute) === t("Cognitive space") && "currActiveExam"
              }`}
            title={t("Cognitive space")}
            icon={<Icon style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }}
            >  <img src="/img/icons/Lighbulb.svg" style={{ height: "100%" }} />  </Icon>}  >
            <Link to={"/myspace"} className="pro-item-content">
              {t("Cognitive space")}
            </Link>
          </MenuItem>
          <hr />
          {!isInTrainingCenter && (
            <MenuItem
              className={`collapsed-icon ${t(myCurrentRoute) === t("Program preview") &&
                "currActiveExam"
                }`}
              title={t("Program preview")}
              icon={
                <Icon style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }} >
                  <img src="/img/icons/sidebar_programs.svg" style={{ height: "100%" }} />
                </Icon>}>
              <Link to={"/program-trainer-preview"} className="pro-item-content">
                {t("Program preview")}
              </Link>
            </MenuItem>
          )}
          <MenuItem
            className={`collapsed-icon ${(t(myCurrentRoute) === t("Gradebook") ||
              t(myCurrentRoute) === t("Subject average")) &&
              "currActiveExam"
              }`}
            title={t("Grade book")}
            icon={
              <Icon style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }} >
                <img
                  src="/img/icons/sidebar_gradebook.svg"
                  style={{ height: "100%" }}
                />
              </Icon>
            }
          >
            <Link to={"/gradebooks-main"} className="pro-item-content">
              {t("Grade book")}
            </Link>
          </MenuItem>
          <MenuItem
            className={`collapsed-icon ${t(myCurrentRoute) === t("Schedule") && "currActiveExam"
              }`}
            title={t("Schedule")}
            icon={
              <Icon style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }} >
                <img
                  src="/img/icons/sidebar_schedule.svg"
                  style={{ height: "100%" }}
                />
              </Icon>
            }
          >
            <Link to={"/schedule"} className="pro-item-content">
              {t("Schedule")}
            </Link>
          </MenuItem>
          <MenuItem
            className={`collapsed-icon ${t(myCurrentRoute) === t("Reports") && "currActiveExam"
              }`}
            title={t("Reports")}
            icon={
              <Icon style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }} >
                <img src="/img/icons/sidebar_reports.svg" style={{ height: "100%" }} />
              </Icon>}>
            <Link to={"/reports"} className="pro-item-content">
              {t("Reports")}
            </Link>
          </MenuItem>
          <MenuItem
            className={`collapsed-icon ${t(myCurrentRoute) === t("Module library overview") && "currActiveExam"
              }`}
            title={t("Library")}
            icon={
              <Icon style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }} >
                <img src="/img/icons/manage_library.svg" style={{ height: "100%" }} />
              </Icon>}>
            <Link to={"/inspector-content"} className="pro-item-content">
              {t("Inspect Library Content")}
            </Link>
          </MenuItem>
          <MenuItem
            className={`collapsed-icon ${t(myCurrentRoute) === t("Exams and assigments") && "currActiveExam"
              }`}
            title={t("Exams and assigments")}
            icon={
              <Icon style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }} >
                <img src="/img/icons/sidebar_examinate.svg" style={{ height: "100%" }} />
              </Icon>}>
            <Link to={"/examinate"} className="pro-item-content">
              {t("Exams and assigments")}
            </Link>
          </MenuItem>
          <hr />
          <MenuItem
            className={`collapsed-icon ${t(myCurrentRoute) === t("Explore") && "currActiveExplore"}`}
            icon={
              <Icon style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }} >
                <img src="/img/icons/explore.svg" style={{ height: "100%" }} />
              </Icon>
            }
          >
            <Link to={(isInTrainingCenter ? "/explore-courses" : "/explore")} className="pro-item-content">
              {t("Explore")}
            </Link>
          </MenuItem>
          <MenuItem
            className={`collapsed-icon ${t(myCurrentRoute) === t("Content Factory") && "currActiveExplore"}`}
            title={t("Create content")}
            icon={<Icon style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }} > <img src="/img/icons/create.svg" style={{ height: "100%" }} />  </Icon>} >
            <Link to={"/create-content"} className="pro-item-content">  {t("Create content")} </Link>
          </MenuItem>
          <MenuItem
            className={`collapsed-icon ${t(myCurrentRoute) === t("Library") && "currActiveExplore"}`}
            title={t("My Library")}
            icon={<Icon style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }}><img src="/img/icons/my_library.svg" style={{ height: "100%" }} /> </Icon>} >
            <Link to={"/my-library"} className="pro-item-content"> {t("My Library")} </Link>
          </MenuItem>
        </>
      ) : (
        <>
          <ListItemButton style={{ justifyContent: "space-between", marginTop: 10, marginBottom: 8 }} dense
            onClick={() => toggleHandler('tab-general')} >
            <span id="generals" > {t("General")}</span>
            {navSubItems.includes('tab-general') ? (<ExpandLessIcon id="generals-big" />) : (<ExpandMoreIcon id="generals-big" />)}
          </ListItemButton>
          <MenuItem
            hidden={!CommonService.isDevelopment() || !navSubItems.includes('tab-general')}
            className={
              t(myCurrentRoute) === t("Cognitive space") && "currActiveExam"
            }
            icon={<></>}
            id="general4"
            prefix={
              <Icon
                style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }}
              >
                <img
                  src="/img/icons/Lighbulb.svg"
                  style={{ height: "100%" }}
                />
              </Icon>
            }
          >
            <Link to={"/myspace"} className="pro-item-content">
              {t("Cognitive space")}
            </Link>
          </MenuItem>
          <ListItemButton style={{ justifyContent: "space-between", marginTop: 10, marginBottom: 8 }} dense
            onClick={() => toggleHandler('tab-stuff')}
          >
            <span id="generals4" > {t("My stuff")}</span>
            {navSubItems.includes('tab-stuff') ? (<ExpandLessIcon id="generals4-big" />) : (<ExpandMoreIcon id="generals4-big" />)}
          </ListItemButton>

          {!isInTrainingCenter && (
            <MenuItem
              hidden={!navSubItems.includes('tab-stuff')}
              className={
                t(myCurrentRoute) === t("Program preview") &&
                "currActiveExam"
              }
              icon={<></>}
              id="general4"
              prefix={
                <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }} >
                  <img src="/img/icons/sidebar_programs.svg" style={{ height: "100%" }} />
                </Icon>}>
              <Link to={"/program-trainer-preview"} className="pro-item-content">
                {t("Program preview")}
              </Link>
            </MenuItem>
          )}
          <MenuItem
            hidden={!navSubItems.includes('tab-stuff')}
            className={
              (t(myCurrentRoute) === t("Gradebook") ||
                t(myCurrentRoute) === t("Subject average")) &&
              "currActiveExam"
            }
            icon={<></>}
            id="general4"
            prefix={
              <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }} >
                <img
                  src="/img/icons/sidebar_gradebook.svg"
                  style={{ height: "100%" }}
                />
              </Icon>
            }
          >
            <Link to={"/gradebooks-main"} className="pro-item-content">
              {t("Grade book")}
            </Link>
          </MenuItem>
          <MenuItem
            hidden={!navSubItems.includes('tab-stuff')}
            className={
              t(myCurrentRoute) === t("Schedule") && "currActiveExam"
            }
            icon={<></>}
            id="general4"
            prefix={
              <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }} >
                <img
                  src="/img/icons/sidebar_schedule.svg"
                  style={{ height: "100%" }}
                />
              </Icon>
            }
          >
            <Link to={"/schedule"} className="pro-item-content">
              {t("Schedule")}
            </Link>
          </MenuItem>
          <MenuItem
            hidden={!navSubItems.includes('tab-stuff')}
            className={
              t(myCurrentRoute) === t("Reports") && "currActiveExam"
            }
            icon={<></>}
            id="general4"
            prefix={
              <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }} >
                <img src="/img/icons/sidebar_reports.svg" style={{ height: "100%" }} />
              </Icon>}>
            <Link to={"/reports"} className="pro-item-content">
              {t("Reports")}
            </Link>
          </MenuItem>
          <MenuItem
            hidden={!navSubItems.includes('tab-stuff')}
            className={
              t(myCurrentRoute) === t("Module library overview") && "currActiveExam"
            }
            icon={<></>}
            id="general4"
            prefix={
              <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }} >
                <img src="/img/icons/manage_library.svg" style={{ height: "100%" }} />
              </Icon>}>
            <Link to={"/inspector-content"} className="pro-item-content">
              {t("Inspect Library Content")}
            </Link>
          </MenuItem>
          <MenuItem
            hidden={!navSubItems.includes('tab-stuff')}
            className={
              t(myCurrentRoute) === t("Exams and assigments") && "currActiveExam"
            }
            icon={<></>}
            id="general4"
            prefix={
              <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }} >
                <img src="/img/icons/sidebar_examinate.svg" style={{ height: "100%" }} />
              </Icon>}>
            <Link to={"/examinate"} className="pro-item-content">
              {t("Exams & Homeworks")}
            </Link>
          </MenuItem>
          <ListItemButton style={{ justifyContent: "space-between", marginTop: 10, marginBottom: 8 }} dense
            onClick={() => toggleHandler('tab-library')} >
            <span id="generals3" > {t("Library")}</span>
            {navSubItems.includes('tab-library') ? (<ExpandLessIcon id="generals3-big" />) : (<ExpandMoreIcon id="generals3-big" />)}
          </ListItemButton>
          <MenuItem
            hidden={!navSubItems.includes('tab-library')}
            className={
              t(myCurrentRoute) === t("Explore") && "currActiveExplore"
            }
            icon={<></>}
            id="explore_create"
            prefix={
              <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }} >
                <img src="/img/icons/explore.svg" style={{ height: "100%" }} />
              </Icon>
            }
          >
            <Link to={(isInTrainingCenter ? "/explore-courses" : "/explore")} className="pro-item-content">
              {t("Explore")}
            </Link>
          </MenuItem>
          <MenuItem
            hidden={!navSubItems.includes('tab-library')}
            className={t(myCurrentRoute) === t("Content Factory") && "currActiveExplore"}
            icon={<></>}
            id="explore_create"
            prefix={<Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible" }} > <img src="/img/icons/create.svg" style={{ height: "100%" }} /></Icon>}>
            <Link to={"/create-content"} className="pro-item-content"> {t("Create")} </Link>
          </MenuItem>
          <MenuItem
            hidden={!navSubItems.includes('tab-library')}
            className={t(myCurrentRoute) === t("Library") && "currActiveExplore"}
            icon={<></>} id="explore_create"
            prefix={<Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible" }} > <img src="/img/icons/my_library.svg" style={{ height: "100%" }} /> </Icon>} >
            <Link to={"/my-library"} className="pro-item-content"> {t("My Library")} </Link>
          </MenuItem>
        </>
      )} */}
      </div>
    </ThemeProvider>
  );
}
