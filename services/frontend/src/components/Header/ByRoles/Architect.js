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

export default function Architect({ collapsed }) {
  const { t } = useTranslation();
  const { myCurrentRoute, F_getHelper } = useMainContext();
  const isInTrainingCenter = F_getHelper().manageScopeIds.isTrainingCenter;
  const permissions = F_getHelper().userPermissions;
  const [navSubItems, setNavSubItems] = useState(['tab-library', 'tab-session', 'tab-general', 'tab-manage', 'tab-stuff', 'tab-stuff-training', 'tab-catal']);
  const current_url = window.location.href;
  const toggleHandler = (item) => {
    if (navSubItems.includes(item)) {
      setNavSubItems(p => p.filter(i => i !== item))
    } else {
      setNavSubItems(p => ([...p, item]))
    }
  }
  return ( // UX TODO: adjust collapse and opened version alike new icons
    <ThemeProvider theme={new_theme}>
      <div className="menu_bar">
        <div className="main_navigation">
          <nav className="nav_bar">
            <ul className="main_menu">
              <li className={`${current_url.includes("sentinel/home") ? 'menu_active' : ''}`}>
                <Link><Typography variant="body2" component="span">{t("General")} </Typography></Link>
                <ul className="submenu">
                  <li className={current_url.includes("accepting-cloud-content") ? 'menu_active' : ''}>
                    <span className={t(myCurrentRoute) === t("Dashboard") && "currActiveArchitect"} id="general">
                      <Link to={"/sentinel/home"} className="pro-item-content">
                        <Typography variant="body2" component="span">{t("Dashboard")}</Typography>
                      </Link>
                    </span>
                  </li>
                </ul>
              </li>
              {!isInTrainingCenter && (
                <>
                  <li className={`${current_url.includes("program-edit") || current_url.includes("reports-settings") ? 'menu_active' : ''}`}>
                    <Link><Typography variant="body2" component="span">{t("My stuff")} </Typography></Link>
                    <ul className="submenu">
                      <li className={current_url.includes("accepting-cloud-content") ? 'menu_active' : ''}>
                        <Link to={"/program-edit"} className="pro-item-content">
                          <Typography variant="body2" component="span">{t("Program edit")}</Typography>
                        </Link>
                      </li>
                      <li className={current_url.includes("accepting-cloud-content") ? 'menu_active' : ''}>
                        <Link to={"/reports-settings"} className="pro-item-content">
                          <Typography variant="body2" component="span">{t("Reports")}</Typography>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className={`${current_url.includes("curriculae") || current_url.includes("architect-classes") ? 'menu_active' : ''}`}>
                    <Link><Typography variant="body2" component="span">{t("Management")} </Typography></Link>
                    <ul className="submenu">
                      <li className={current_url.includes("accepting-cloud-content") ? 'menu_active' : ''}>
                        <Link to={"/modules-core/curriculae"} className="pro-item-content">
                          <Typography variant="body2" component="span">{t("Curriculae")}</Typography>
                        </Link>
                      </li>
                      <li className={current_url.includes("accepting-cloud-content") ? 'menu_active' : ''}>
                        <Link to={"/architect-classes"} className="pro-item-content">
                          <Typography variant="body2" component="span">{t("Classes")}</Typography>
                        </Link>
                      </li>
                    </ul>
                  </li>
                </>
              )}
              {isInTrainingCenter && (
                <>
                  <li className={`${current_url.includes("sessions-free") || current_url.includes("sessions") ? 'menu_active' : ''}`}>
                    <Link><Typography variant="body2" component="span">{t("My stuff")} </Typography></Link>
                    <ul className="submenu">
                      <li className={current_url.includes("sessions-free") ? 'menu_active' : ''}>
                        <Link to={"/sessions-free"} className="pro-item-content">
                          <Typography variant="body2" component="span">{t("Sessions")}</Typography>
                        </Link>
                      </li>
                      <li className={current_url.includes("sessions") ? 'menu_active' : ''}>
                        <Link to={"/sessions"} className="pro-item-content">
                          <Typography variant="body2" component="span">{t("Sessions (BC)")}</Typography>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className={`${current_url.includes("courses") || current_url.includes("coursePath") || current_url.includes("internships") || current_url.includes("formats") || current_url.includes("competenceBlocks") ? 'menu_active' : ''}`}>
                    <Link><Typography variant="body2" component="span">{t("Catalogue")} </Typography></Link>
                    <ul className="submenu">
                      <li className={current_url.includes("courses") ? 'menu_active' : ''}>
                        <Link to={"/courses"} className="pro-item-content">
                          <Typography variant="body2" component="span">{t("Courses")}</Typography>
                        </Link>
                      </li>
                      <li className={current_url.includes("coursePath") ? 'menu_active' : ''}>
                        <Link to={"/coursePath"} className="pro-item-content">
                          <Typography variant="body2" component="span">{t("Course path")}</Typography>
                        </Link>
                      </li>
                      <li className={current_url.includes("internships") ? 'menu_active' : ''}>
                        <Link to={"/internships"} className="pro-item-content">
                          <Typography variant="body2" component="span">{t("Internships")}</Typography>
                        </Link>
                      </li>
                      <li className={current_url.includes("competenceBlocks") ? 'menu_active' : ''}>
                        <Link
                          to={"/certifications/competenceBlocks"}
                          className="pro-item-content"
                        >
                          <Typography variant="body2" component="span">{t("Certificate Templates")}</Typography>
                        </Link>
                      </li>
                      <li className={current_url.includes("formats") ? 'menu_active' : ''}>
                        <Link to={"/formats"} className="pro-item-content">
                          <Typography variant="body2" component="span">{t("Formats")}</Typography>
                        </Link>
                      </li>
                    </ul>
                  </li>
                </>
              )}
              <li className={`${current_url.includes("explore") || current_url.includes("create-content") || current_url.includes("my-library") || current_url.includes("source-materials") ? 'menu_active' : ''}`}>
                <Link><Typography variant="body2" component="span">{t("Library")} </Typography></Link>
                <ul className="submenu">
                  <li className={current_url.includes("explore") ? 'menu_active' : ''}>
                    <Link to={(isInTrainingCenter ? "/explore-courses" : "/explore")} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("Explore")}</Typography>
                    </Link>
                  </li>
                  <li className={current_url.includes("create-content") ? 'menu_active' : ''}>
                    <Link to={"/create-content"} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("Create")}</Typography>
                    </Link>
                  </li>
                  <li className={current_url.includes("my-library") ? 'menu_active' : ''}>
                    <Link to={"/my-library"} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("My Library")}</Typography>
                    </Link>
                  </li>
                  <li className={current_url.includes("source-materials") ? 'menu_active' : ''}>
                    <Link to={"/source-materials"} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("Books")}</Typography>
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
              className={`collapsed-icon ${t(myCurrentRoute) === t("Dashboard") && "currActiveArchitect"
                }`}
              title={t("Dashboard")}
              icon={
                <Icon
                  style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }} >
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
            {isInTrainingCenter && (
              <>
                <MenuItem
                  className={`collapsed-icon ${t(myCurrentRoute) === t("Session") && "currActiveAdministration"}`}
                  title={t("Sessions")}
                  icon={<Icon style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible" }} >
                    <img src="/img/icons/sidebar_classes.svg" style={{ height: "100%" }} />
                  </Icon>}  >
                  <Link to={"/sessions-free"} className="pro-item-content">
                    {t("Sessions")}
                  </Link>
                </MenuItem>
                <MenuItem
                  className={`collapsed-icon ${t(myCurrentRoute) === t("Session Business Client") && "currActiveAdministration"}`}
                  title={t("Sessions")}
                  icon={<Icon style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible" }} >
                    <img src="/img/icons/sidebar_classes.svg" style={{ height: "100%" }} />
                  </Icon>}  >
                  <Link to={"/sessions"} className="pro-item-content">
                    {t("Sessions (BC)")}
                  </Link>
                </MenuItem>
                <hr />
              </>
            )}
            {isInTrainingCenter && (
              <MenuItem
                className={`collapsed-icon ${t(myCurrentRoute) === t("Course") && "currActiveExam"
                  }`}
                title={t("Courses")}
                icon={
                  <Icon
                    style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }} >
                    <img src="/img/icons/sidebar_myCourses.svg" style={{ height: "100%" }} />
                  </Icon>
                }
              >
                <Link to={"/courses"} className="pro-item-content">
                  {t("Course")}
                </Link>
              </MenuItem>
            )}

            {isInTrainingCenter && (
              <MenuItem
                className={`collapsed-icon ${t(myCurrentRoute) === t("Course path") && "currActiveExam"
                  }`}
                title={t("Course path")}
                icon={
                  <Icon
                    style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }} >
                    <img src="/img/icons/sidebar_myCourses.svg" style={{ height: "100%" }} />
                  </Icon>
                }
              >
                <Link to={"/coursePath"} className="pro-item-content">
                  {t("Course path")}
                </Link>
              </MenuItem>
            )}

            {isInTrainingCenter && (
              <MenuItem
                className={`collapsed-icon ${t(myCurrentRoute) === t("Internships") && "currActiveExam"
                  }`}
                title={t("Internships")}
                icon={
                  <Icon
                    style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }} >
                    <img src="/img/icons/management.svg" style={{ height: "100%" }} />
                  </Icon>
                }
              >
                <Link to={"/internships"} className="pro-item-content">
                  {t("Internships")}
                </Link>
              </MenuItem>
            )}
            {isInTrainingCenter && (
              <MenuItem
                className={`collapsed-icon ${t(myCurrentRoute) === t("Certificate") && "currActiveExam"
                  }`}
                title={t("Certificate Templates")}
                icon={
                  <Icon
                    style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }} >
                    <img src="/img/icons/sidebar_programs.svg" style={{ height: "100%" }} />
                  </Icon>
                }
              >
                <Link
                  to={"/certifications/competenceBlocks"}
                  className="pro-item-content"
                >
                  {t("Certificate Templates")}
                </Link>
              </MenuItem>
            )}
            {!isInTrainingCenter && (
              <MenuItem
                className={`collapsed-icon ${t(myCurrentRoute) === t("Program edit") && "currActiveAdministration"
                  }`}
                title={t("Programs")}
                icon={
                  <Icon
                    style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }} >
                    <img
                      src="/img/icons/sidebar_programs.svg"
                      style={{ height: "100%" }}
                    />
                  </Icon>
                }
              >
                <Link to={"/program-edit"} className="pro-item-content">
                  {t("Program edit")}
                </Link>
              </MenuItem>
            )}
            {isInTrainingCenter && (
              <MenuItem
                className={`collapsed-icon ${t(myCurrentRoute) === t("Formats") && "currActiveAdministration"
                  }`}
                title={t("Formats")}
                icon={
                  <Icon
                    style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }} >
                    <img
                      src="/img/icons/sidebar_schedule.svg"
                      style={{ height: "100%" }}
                    />
                  </Icon>
                }
              >
                <Link to={"/formats"} className="pro-item-content">
                  {t("Formats")}
                </Link>
              </MenuItem>
            )}
            <MenuItem
              className={`collapsed-icon ${t(myCurrentRoute) === t("Reports") && "currActiveAdministration"
                }`}
              title={t("Reports")}
              icon={
                <Icon
                  style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }} >
                  <img
                    src="/img/icons/sidebar_reports.svg"
                    style={{ height: "100%" }}
                  />
                </Icon>
              }
            >
              <Link to={"/reports-settings"} className="pro-item-content">
                {t("Reports")}
              </Link>
            </MenuItem>

            <hr />
            {!isInTrainingCenter && (
              <MenuItem
                className={`collapsed-icon ${t(myCurrentRoute) === t("Curriculum") && "currActiveAdministration"
                  }`}
                title={t("Curriculae")}
                icon={
                  <Icon
                    style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }} >
                    <img
                      src="/img/icons/sidebar_curriculae.svg"
                      style={{ height: "100%" }}
                    />
                  </Icon>
                }
              >
                <Link to={"/modules-core/curriculae"} className="pro-item-content">
                  {t("Curriculae")}
                </Link>
              </MenuItem>
            )}
            {!isInTrainingCenter && (
              <MenuItem
                className={`collapsed-icon ${t(myCurrentRoute) === t("Class") && "currActiveAdministration"
                  }`}
                title={t("Classes")}
                icon={
                  <Icon
                    style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }} >
                    <img
                      src="/img/icons/sidebar_classes.svg"
                      style={{ height: "100%" }}
                    />
                  </Icon>
                }
              >
                <Link to={"/architect-classes"} className="pro-item-content">
                  {t("Classes")}
                </Link>
              </MenuItem>
            )}


            <hr />

            <MenuItem
              className={`collapsed-icon ${t(myCurrentRoute) === t("Explore") && "currActiveExplore"
                }`}
              title={t("Explore content")}
              icon={
                <Icon
                  style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }} >
                  <img src="/img/icons/explore.svg" style={{ height: "100%" }} />
                </Icon>
              }
            >
              <Link to={(isInTrainingCenter ? "/explore-courses" : "/explore")} className="pro-item-content">
                {t("Explore content")}
              </Link>
            </MenuItem>

            <MenuItem
              className={`collapsed-icon ${t(myCurrentRoute) === t("Content Factory") && "currActiveExplore"
                }`}
              title={t("Create content")}
              icon={
                <Icon
                  style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }} >
                  <img src="/img/icons/create.svg" style={{ height: "100%" }} />
                </Icon>
              }
            >
              <Link to={"/create-content"} className="pro-item-content">
                {t("Create content")}
              </Link>
            </MenuItem>
            <MenuItem
              className={`collapsed-icon ${t(myCurrentRoute) === t("Library") && "currActiveExplore"
                }`}
              title={t("My Library")}
              icon={
                <Icon
                  style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }} >
                  <img
                    src="/img/icons/my_library.svg"
                    style={{ height: "100%" }}
                  />
                </Icon>
              }
            >
              <Link to={"/my-library"} className="pro-item-content">
                {t("My Library")}
              </Link>
            </MenuItem>
            <MenuItem
              className={`collapsed-icon ${t(myCurrentRoute) === t("Books") && "currActiveExplore"
                }`}
              title={t("Books")}
              icon={
                <Icon
                  style={{ textAlign: "center", height: "26px", width: "26px", fontSize: "0rem", overflow: "visible", }} >
                  <img
                    src="/img/icons/sidebar_subjects.svg"
                    style={{ height: "100%" }}
                  />
                </Icon>
              }
            >
              <Link to={"/source-materials"} className="pro-item-content">
                {t("Books")}
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
                <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }} >
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

            {!isInTrainingCenter && (
              <>
                <ListItemButton style={{ justifyContent: "space-between", marginTop: 10, marginBottom: 8 }} dense
                  onClick={() => toggleHandler('tab-stuff')} >
                  <span id="generals4" > {t("My stuff")}</span>
                  {navSubItems.includes('tab-stuff') ? (<ExpandLessIcon id="generals2-big" />) : (<ExpandMoreIcon id="generals2-big" />)}
                </ListItemButton>
                <MenuItem
                  hidden={!navSubItems.includes('tab-stuff')}
                  className={
                    t(myCurrentRoute) === t("Program edit") &&
                    "currActiveAdministration"
                  }
                  icon={<></>}
                  id="general2"
                  prefix={
                    <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }} >
                      <img
                        src="/img/icons/sidebar_programs.svg"
                        style={{ height: "100%" }}
                      />
                    </Icon>
                  }
                >
                  <Link to={"/program-edit"} className="pro-item-content">
                    {t("Program edit")}
                  </Link>
                </MenuItem>
                <MenuItem
                  hidden={!navSubItems.includes('tab-stuff')}
                  className={
                    t(myCurrentRoute) === t("Reports") && "currActiveAdministration"
                  }
                  icon={<></>}
                  id="general2"
                  prefix={
                    <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }} >
                      <img
                        src="/img/icons/sidebar_reports.svg"
                        style={{ height: "100%" }}
                      />
                    </Icon>
                  }
                >
                  <Link to={"/reports-settings"} className="pro-item-content">
                    {t("Reports")}
                  </Link>
                </MenuItem>

                <ListItemButton style={{ justifyContent: "space-between", marginTop: 10, marginBottom: 8 }} dense
                  onClick={() => toggleHandler('tab-manage')} >
                  <span id="generals2" > {t("Management")}</span>
                  {navSubItems.includes('tab-manage') ? (<ExpandLessIcon id="generals2-big" />) : (<ExpandMoreIcon id="generals2-big" />)}
                </ListItemButton>
              </>
            )}
            {!isInTrainingCenter && (
              <MenuItem
                hidden={!navSubItems.includes('tab-manage')}
                className={
                  t(myCurrentRoute) === t("Curriculum") && "currActiveAdministration"
                }
                id="general2"
                icon={<></>}
                prefix={
                  <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }}>
                    <img
                      src="/img/icons/sidebar_curriculae.svg"
                      style={{ height: "100%" }}
                    />
                  </Icon>
                }
              >
                <Link to={"/modules-core/curriculae"} className="pro-item-content">
                  {t("Curriculae")}
                </Link>
              </MenuItem>
            )}
            {!isInTrainingCenter && (
              <MenuItem
                hidden={!navSubItems.includes('tab-manage')}
                className={
                  t(myCurrentRoute) === t("Class") && "currActiveAdministration"
                }
                id="general2"
                icon={<></>}
                prefix={
                  <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }}>
                    <img
                      src="/img/icons/sidebar_classes.svg"
                      style={{ height: "100%" }}
                    />
                  </Icon>
                }
              >
                <Link to={"/architect-classes"} className="pro-item-content">
                  {t("Classes")}
                </Link>
              </MenuItem>
            )}

            {isInTrainingCenter && (
              <ListItemButton style={{ justifyContent: "space-between", marginTop: 10, marginBottom: 8 }} dense
                onClick={() => toggleHandler('tab-stuff-training')} >
                <span id="generals4" > {t("My stuff")}</span>
                {navSubItems.includes('tab-stuff-training') ? (<ExpandLessIcon id="generals2-big" />) : (<ExpandMoreIcon id="generals2-big" />)}
              </ListItemButton>
            )}
            {isInTrainingCenter && (
              <>
                <MenuItem
                  hidden={!navSubItems.includes('tab-stuff-training')}
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
                <MenuItem
                  hidden={!navSubItems.includes('tab-stuff-training')}
                  className={t(myCurrentRoute) === t("Session Business Client") && "currActiveAdministration"}
                  id="general2" icon={<></>} prefix={
                    <Icon
                      style={{
                        textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible",
                      }}  >
                      <img src="/img/icons/sidebar_classes.svg" style={{ height: "100%" }} />
                    </Icon>} >
                  <Link to={"/sessions"} className="pro-item-content">
                    {t("Sessions (BC)")}
                  </Link>
                </MenuItem>
                <ListItemButton style={{ justifyContent: "space-between", marginTop: 10, marginBottom: 8 }} dense
                  onClick={() => toggleHandler('tab-catal')} >
                  <span id="generals2" > {t("Catalogue")}</span>
                  {navSubItems.includes('tab-catal') ? (<ExpandLessIcon id="generals2-big" />) : (<ExpandMoreIcon id="generals2-big" />)}
                </ListItemButton>

                <MenuItem
                  hidden={!navSubItems.includes('tab-catal')} className={
                    t(myCurrentRoute) === t("Course") && "currActiveExam"
                  } id="general4" icon={<></>} prefix={
                    <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }}>
                      <img src="/img/icons/sidebar_myCourses.svg" style={{ height: "100%" }} />
                    </Icon>} >
                  <Link to={"/courses"} className="pro-item-content">
                    {t("Courses")}
                  </Link>
                </MenuItem>
                <MenuItem
                  hidden={!navSubItems.includes('tab-catal')}
                  className={
                    t(myCurrentRoute) === t("Course path") && "currActiveExam"
                  }
                  id="general4"
                  icon={<></>}
                  prefix={
                    <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }} >
                      <img src="/img/icons/sidebar_myCourses.svg" style={{ height: "100%" }} />
                    </Icon>
                  }
                >
                  <Link to={"/coursePath"} className="pro-item-content">
                    {t("Course path")}
                  </Link>
                </MenuItem>
                <MenuItem
                  hidden={!navSubItems.includes('tab-catal')}
                  className={
                    t(myCurrentRoute) === t("Internships") && "currActiveExam"
                  }
                  id="general4" icon={<></>} prefix={
                    <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }} >
                      <img src="/img/icons/management.svg" style={{ height: "100%" }} />
                    </Icon>
                  }
                >
                  <Link to={"/internships"} className="pro-item-content">
                    {t("Internships")}
                  </Link>
                </MenuItem>
                <MenuItem
                  hidden={!navSubItems.includes('tab-catal')}
                  className={
                    t(myCurrentRoute) === t("Certificate") && "currActiveExam"
                  }
                  id="general4"
                  icon={<></>}
                  prefix={
                    <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }}>
                      <img src="/img/icons/sidebar_programs.svg" style={{ height: "100%" }} />
                    </Icon>
                  }
                >
                  <Link
                    to={"/certifications/competenceBlocks"}
                    className="pro-item-content"
                  >
                    {t("Certificate Templates")}
                  </Link>
                </MenuItem>

                <MenuItem
                  hidden={!navSubItems.includes('tab-catal')}
                  className={
                    t(myCurrentRoute) === t("Formats") && "currActiveAdministration"
                  }
                  icon={<></>}
                  id="general2"
                  prefix={
                    <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }} >
                      <img
                        src="/img/icons/sidebar_schedule.svg"
                        style={{ height: "100%" }}
                      />
                    </Icon>
                  }
                >
                  <Link to={"/formats"} className="pro-item-content">
                    {t("Formats")}
                  </Link>
                </MenuItem>
                <MenuItem
                  hidden={!navSubItems.includes('tab-catal')}
                  className={
                    t(myCurrentRoute) === t("Reports") && "currActiveAdministration"
                  }
                  icon={<></>}
                  id="general2"
                  prefix={
                    <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }} >
                      <img
                        src="/img/icons/sidebar_reports.svg"
                        style={{ height: "100%" }}
                      />
                    </Icon>
                  }
                >
                  <Link to={"/reports-settings"} className="pro-item-content">
                    {t("Reports")}
                  </Link>
                </MenuItem>
              </>
            )}
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
              className={
                t(myCurrentRoute) === t("Content Factory") && "currActiveExplore"
              }
              icon={<></>}
              id="explore_create"
              prefix={
                <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }} >
                  <img src="/img/icons/create.svg" style={{ height: "100%" }} />
                </Icon>
              }
            >
              <Link to={"/create-content"} className="pro-item-content">
                {t("Create")}
              </Link>
            </MenuItem>
            <MenuItem
              hidden={!navSubItems.includes('tab-library')}
              className={t(myCurrentRoute) === t("Library") && "currActiveExplore"}
              icon={<></>}
              id="explore_create"
              prefix={
                <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }}>
                  <img
                    src="/img/icons/my_library.svg"
                    style={{ height: "100%" }}
                  />
                </Icon>
              }
            >
              <Link to={"/my-library"} className="pro-item-content">
                {t("My Library")}
              </Link>
            </MenuItem>
            <MenuItem
              hidden={!navSubItems.includes('tab-library')}
              className={
                t(myCurrentRoute) === t("Books") && "currActiveAdministration"
              }
              icon={<></>}
              id="explore_create"
              prefix={
                <Icon style={{ textAlign: "center", height: "25px", width: "25px", fontSize: "0rem", overflow: "visible", }} >
                  <img src="/img/icons/sidebar_subjects.svg" style={{ height: "100%" }} />    </Icon>}  >
              <Link to={"/source-materials"} className="pro-item-content">
                {t("Books")}
              </Link>
            </MenuItem>
          </>
        )} */}
      </div>
    </ThemeProvider>
  );
}
