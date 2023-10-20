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

export default function Parent({ collapsed }) {
  const { t, i18n, translationsLoaded } = useTranslation();
  const { myCurrentRoute, F_getHelper } = useMainContext();
  const permissions = F_getHelper().userPermissions;
  const isInTrainingCenter = F_getHelper().manageScopeIds.isTrainingCenter;
  const [navSubItems, setNavSubItems] = useState(['tab-library', 'tab-general', 'tab-learning']);
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
              <li className={`${current_url.includes("sentinel/home") ? 'menu_active' : ''}`}>
                <Link><Typography variant="body2" component="span">{t("General")} </Typography></Link>
                <ul className="submenu">
                  <li className={current_url.includes("sessions") ? 'active' : ''}>
                    <Link to={"/sentinel/home"} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("Dashboard")}</Typography>
                    </Link>
                  </li>
                </ul>
              </li>
              <li className={`${current_url.includes("my-courses") || current_url.includes("schedule") || current_url.includes("examinate") || current_url.includes("gradebooks-main") || current_url.includes("reports") || current_url.includes("program-trainer-preview") ? 'menu_active' : ''}`}>
                <Link><Typography variant="body2" component="span">{t("Learning")} </Typography></Link>
                <ul className="submenu">
                  {!isInTrainingCenter && (
                    <li className={current_url.includes("my-courses") ? 'active' : ''}>
                      <Link to={"/my-courses"} className="pro-item-content">
                        <Typography variant="body2" component="span">{t("My children's courses")}</Typography>
                      </Link>
                    </li>
                  )}
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
                  <li className={current_url.includes("gradebooks-main") ? 'active' : ''}>
                    <Link to={"/gradebooks-main"} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("Gradebook")}</Typography>
                    </Link>
                  </li>
                  <li className={current_url.includes("reports") ? 'active' : ''}>
                    <Link to={"/reports"} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("Reports")}</Typography>
                    </Link>
                  </li>
                  <li className={current_url.includes("program-trainer-preview") ? 'active' : ''}>
                    <Link to={"/program-trainer-preview"} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("Programs")}</Typography>
                    </Link>
                  </li>
                </ul>
              </li>
              <li className={`${current_url.includes("explore") ? 'menu_active' : ''}`}>
                <Link><Typography variant="body2" component="span">{t("Library")} </Typography></Link>
                <ul className="submenu">
                  <li className={current_url.includes("explore") ? 'active' : ''}>
                    <Link to={"/explore"} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("Explore")}</Typography>
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>


        {/* {collapsed ? (
        <>


          <MenuItem
            className={`collapsed-icon ${t(myCurrentRoute) === t("Dashboard") && "currActiveArchitect"
              }`}
            title={t("Dashboard")}
            icon={
              <Icon
                style={{
                  textAlign: "center",
                  height: "26px",
                  width: "26px",
                  fontSize: "0rem",
                  overflow: "visible",
                }}
              >
                <img
                  src="/img/icons/sidebar_dashboard.svg"
                  style={{ height: "100%" }}
                />
              </Icon>
            }
          >
            <Link to={"/dashboard"} className="pro-item-content">
              {t("Dashboard")}
            </Link>
          </MenuItem>

          <hr />
          {!isInTrainingCenter && (

            <MenuItem
              className={`collapsed-icon ${t(myCurrentRoute) === t("My courses") && "currActiveExam"
                }`}
              title={t("My courses")}
              icon={
                <Icon
                  style={{
                    textAlign: "center",
                    height: "25px",
                    width: "25px",
                    fontSize: "0rem",
                    overflow: "visible",
                  }}
                >
                  <img
                    src="/img/icons/sidebar_myCourses.svg"
                    style={{ height: "100%" }}
                  />
                </Icon>
              }
            >
              <Link to={"/my-courses"}
                className="pro-item-content">
                {t("My children's courses")}
              </Link>
            </MenuItem>
          )}
          <MenuItem
            className={`collapsed-icon ${t(myCurrentRoute) === t("Schedule") && "currActiveExam"
              }`}
            title={t("Schedule")}
            icon={
              <Icon
                style={{
                  textAlign: "center",
                  height: "26px",
                  width: "26px",
                  fontSize: "0rem",
                  overflow: "visible",
                }}
              >
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
            className={`collapsed-icon ${(t(myCurrentRoute) === t("Exams and assigments")) &&
              ("currActiveExam")
              }`}
            title={t("Exams and assigments")}
            icon={
              <Icon
                style={{
                  textAlign: "center",
                  height: "26px",
                  width: "26px",
                  fontSize: "0rem",
                  overflow: "visible",
                }}
              >
                <img
                  src="/img/icons/sidebar_examinate.svg"
                  style={{ height: "100%" }}
                />
              </Icon>
            }
          >
            <Link to={"/examinate"} className="pro-item-content">
              {t("Exams and assigments")}
            </Link>
          </MenuItem>
          <MenuItem
            className={`collapsed-icon ${(t(myCurrentRoute) === t("Gradebook") ||
              t(myCurrentRoute) === t("Subject average")) &&
              "currActiveExam"
              }`}
            title={t("Gradebook")}
            icon={
              <Icon
                style={{
                  textAlign: "center",
                  height: "26px",
                  width: "26px",
                  fontSize: "0rem",
                  overflow: "visible",
                }}
              >
                <img
                  src="/img/icons/sidebar_gradebook.svg"
                  style={{ height: "100%" }}
                />
              </Icon>
            }
          >
            <Link to={"/gradebooks-main"} className="pro-item-content">
              {t("Gradebook")}
            </Link>
          </MenuItem>
          <MenuItem
            className={`collapsed-icon ${t(myCurrentRoute) === t("Reports") && "currActiveExam"
              }`}
            title={t("Reports")}
            icon={
              <Icon
                style={{
                  textAlign: "center",
                  height: "26px",
                  width: "26px",
                  fontSize: "0rem",
                  overflow: "visible",
                }}
              >
                <img
                  src="/img/icons/sidebar_reports.svg"
                  style={{ height: "100%" }}
                />
              </Icon>
            }
          >
            <Link to={"/reports"} className="pro-item-content">
              {t("Reports")}
            </Link>
          </MenuItem>
          <MenuItem
            className={`collapsed-icon ${t(myCurrentRoute) === t("Program preview") && "currActiveExam"
              }`}
            title={t("Program Preview")}
            icon={
              <Icon
                style={{
                  textAlign: "center",
                  height: "26px",
                  width: "26px",
                  fontSize: "0rem",
                  overflow: "visible",
                }}
              >
                <img
                  src="/img/icons/sidebar_programs.svg"
                  style={{ height: "100%" }}
                />
              </Icon>
            }
          >
            <Link to={"/program-trainer-preview"} className="pro-item-content">
              {t("Program Preview")}
            </Link>
          </MenuItem>
          <hr />
          <MenuItem
            className={`collapsed-icon ${t(myCurrentRoute) === t("Explore") && "currActiveExplore"
              }`}
            title={t("Explore content")}
            icon={
              <Icon
                style={{
                  textAlign: "center",
                  height: "26px",
                  width: "26px",
                  fontSize: "0rem",
                  overflow: "visible",
                }}
              >
                <img src="/img/icons/explore.svg" style={{ height: "100%" }} />
              </Icon>
            }
          >
            <Link to={"/explore"} className="pro-item-content">
              {t("Explore content")}
            </Link>
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
            hidden={!navSubItems.includes('tab-general')}
            className={
              t(myCurrentRoute) === t("Dashboard") && "currActiveArchitect"
            }
            icon={<></>}
            id="general"
            prefix={
              <Icon
                style={{
                  textAlign: "center",
                  height: "25px",
                  width: "25px",
                  fontSize: "0rem",
                  overflow: "visible",
                }}
              >
                <img
                  src="/img/icons/sidebar_dashboard.svg"
                  style={{ height: "100%" }}
                />
              </Icon>
            }
          >
            <Link to={"/dashboard"} className="pro-item-content">
              {t("Dashboard")}
            </Link>
          </MenuItem>

          <ListItemButton style={{ justifyContent: "space-between", marginTop: 10, marginBottom: 8 }} dense
            onClick={() => toggleHandler('tab-learning')} >
            <span id="generals4" > {t("Learning")}</span>
            {navSubItems.includes('tab-learning') ? (<ExpandLessIcon id="generals4-big" />) : (<ExpandMoreIcon id="generals4-big" />)}
          </ListItemButton>
          {!isInTrainingCenter && (
            <MenuItem
              hidden={!navSubItems.includes('tab-learning')}
              className={
                t(myCurrentRoute) === t("My courses") && (isInTrainingCenter ? "currActiveArchitect" : "currActiveExam")
              }
              icon={<></>}
              id={(isInTrainingCenter ? "general" : "general4")}
              prefix={
                <Icon
                  style={{
                    textAlign: "center",
                    height: "25px",
                    width: "25px",
                    fontSize: "0rem",
                    overflow: "visible",
                  }}
                >
                  <img
                    src="/img/icons/sidebar_myCourses.svg"
                    style={{ height: "100%" }}
                  />
                </Icon>
              }
            >
              <Link to={"/my-courses"} className="pro-item-content">
                {t("My children's courses")}
              </Link>
            </MenuItem>
          )}
          <MenuItem
            hidden={!navSubItems.includes('tab-learning')}
            className={
              t(myCurrentRoute) === t("Schedule") && "currActiveExam"
            }
            icon={<></>}
            id="general4"
            prefix={
              <Icon
                style={{
                  textAlign: "center",
                  height: "25px",
                  width: "25px",
                  fontSize: "0rem",
                  overflow: "visible",
                }}
              >
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
            hidden={!navSubItems.includes('tab-learning')}
            className={
              t(myCurrentRoute) === t("Exams and assigments") && ("currActiveExam")
            }
            icon={<></>}
            id={("general4")}
            prefix={
              <Icon
                style={{
                  textAlign: "center",
                  height: "25px",
                  width: "25px",
                  fontSize: "0rem",
                  overflow: "visible",
                }}
              >
                <img
                  src="/img/icons/sidebar_examinate.svg"
                  style={{ height: "100%" }}
                />
              </Icon>
            }
          >
            <Link to={"/examinate"} className="pro-item-content">
              {t("Exams and assigments")}
            </Link>
          </MenuItem>
          <MenuItem
            hidden={!navSubItems.includes('tab-learning')}
            className={
              (t(myCurrentRoute) === t("Gradebook") ||
                t(myCurrentRoute) === t("Subject average")) &&
              "currActiveExam"
            }
            icon={<></>}
            id={("general4")}
            prefix={
              <Icon
                style={{
                  textAlign: "center",
                  height: "25px",
                  width: "25px",
                  fontSize: "0rem",
                  overflow: "visible",
                }}
              >
                <img
                  src="/img/icons/sidebar_gradebook.svg"
                  style={{ height: "100%" }}
                />
              </Icon>
            }
          >
            <Link to={"/gradebooks-main"} className="pro-item-content">
              {t("Gradebook")}
            </Link>
          </MenuItem>
          <MenuItem
            hidden={!navSubItems.includes('tab-learning')}
            className={t(myCurrentRoute) === t("Reports") && "currActiveExam"}
            icon={<></>}
            id={("general4")}
            prefix={
              <Icon
                style={{
                  textAlign: "center",
                  height: "25px",
                  width: "25px",
                  fontSize: "0rem",
                  overflow: "visible",
                }}
              >
                <img
                  src="/img/icons/sidebar_reports.svg"
                  style={{ height: "100%" }}
                />
              </Icon>
            }
          >
            <Link to={"/reports"} className="pro-item-content">
              {t("Reports")}
            </Link>
          </MenuItem>
          <MenuItem
            hidden={!navSubItems.includes('tab-learning')}
            className={
              t(myCurrentRoute) === t("Program preview") && "currActiveExam"
            }
            icon={<></>}
            id={("general4")}
            prefix={
              <Icon
                style={{
                  textAlign: "center",
                  height: "25px",
                  width: "25px",
                  fontSize: "0rem",
                  overflow: "visible",
                }}
              >
                <img
                  src="/img/icons/sidebar_programs.svg"
                  style={{ height: "100%" }}
                />
              </Icon>
            }
          >
            <Link to={"/program-trainer-preview"} className="pro-item-content">
              {t("Programs")}
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
              <Icon
                style={{
                  textAlign: "center",
                  height: "25px",
                  width: "25px",
                  fontSize: "0rem",
                  overflow: "visible",
                }}
              >
                <img src="/img/icons/explore.svg" style={{ height: "100%" }} />
              </Icon>
            }
          >
            <Link to={"/explore"} className="pro-item-content">
              {t("Explore")}
            </Link>
          </MenuItem>
        </>
      )} */}
      </div>
    </ThemeProvider>
  );
}
