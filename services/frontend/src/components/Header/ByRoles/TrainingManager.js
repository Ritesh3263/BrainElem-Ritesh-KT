import React from "react";
import { Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import Icon from "@material-ui/core/Icon";
import { Link } from "react-router-dom";
import { useMainContext } from "../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import { useTranslation } from "react-i18next";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { new_theme } from "NewMuiTheme";
import { ThemeProvider, Typography } from "@mui/material";
import "../Header.scss";

//Services
import CommonService from 'services/common.service'

export default function TrainingManager({ collapsed }) {
  const { t, i18n, translationsLoaded } = useTranslation();
  const { myCurrentRoute, F_getHelper } = useMainContext();
  const isInTrainingCenter = F_getHelper().manageScopeIds.isTrainingCenter;
  const permissions = F_getHelper().userPermissions;
  const current_url = window.location.href;
  return (
    <ThemeProvider theme={new_theme}>
      <div className="menu_bar">
        <div className="main_navigation">
          <nav className="nav_bar">
            <ul className="main_menu">
              {/* <li className={`${current_url.includes("explore-courses") || current_url.includes("create-content") || current_url.includes("my-library") ? 'menu_active' : ''}`}>
                <Link><Typography variant="body2" component="span">{t("Library")} </Typography></Link>
                <ul className="submenu">
                  <li className={current_url.includes("explore-courses") ? 'active' : ''}>
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
                      <Typography variant="body2" component="span">{t("My Library")}</Typography>
                    </Link>
                  </li>
                </ul>
              </li> */}
              <li className={`${current_url.includes("myspace") || current_url.includes("reports-settings") ? 'menu_active' : ''}`}>
                <Link to={"/myspace"}><Typography variant="body2" component="span">{t("General")} </Typography></Link>
                <ul className="submenu">
                  <li className={current_url.includes("myspace") ? 'active' : ''}>
                    <Link to={"/myspace"} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("My space")}</Typography>
                    </Link>
                  </li>
                  {/* <li className={current_url.includes("reports-settings") ? 'active' : ''}>
                    <Link to={"/reports-settings"} className="pro-item-content hidesubtext">
                      <Typography variant="body2" component="span">{t("Reports")}</Typography>
                    </Link>
                  </li> */}

                </ul>
              </li>
              {/* <li className={`${current_url.includes("sessions-free") || current_url.includes("sessions") ? 'menu_active' : ''}`}>
                <Link><Typography variant="body2" component="span">{t("Session setup")} </Typography></Link>
                <ul className="submenu">
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
              </li> */}
            </ul>
          </nav>
        </div>





        {/* {collapsed ? (
        <>
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
                style={{
                  textAlign: "center",
                  height: "26px",
                  width: "26px",
                  fontSize: "0rem",
                  overflow: "visible",
                }}
              >
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
            title={t("Library")}
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
          <hr />
          <MenuItem
            hidden={!CommonService.isDevelopment()}
            className={`collapsed-icon ${t(myCurrentRoute) === t("Cognitive space") && "currActiveArchitect"
              }`}
            title={t("Cognitive space")}
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

        </>
      ) : (
        <>
          <small className="d-flex flex-fill ml-2 mt-2">
            <span id="generals3"> {t("Library")}</span>
          </small>
          <MenuItem
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
            <Link to={(isInTrainingCenter ? "/explore-courses" : "/explore")} className="pro-item-content">
              {t("Explore")}
            </Link>
          </MenuItem>
          <MenuItem
            className={
              t(myCurrentRoute) === t("Content Factory") && "currActiveExplore"}
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
                <img src="/img/icons/create.svg" style={{ height: "100%" }} />
              </Icon>
            }
          >
            <Link to={"/create-content"} className="pro-item-content">
              {t("Create")}
            </Link>
          </MenuItem>
          <MenuItem
            className={t(myCurrentRoute) === t("Library") && "currActiveExplore"}
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
          <small className="d-flex flex-fill ml-2 mt-2">
            <span id="generals"> {t("General")}</span>
          </small>
          <MenuItem
            hidden={!CommonService.isDevelopment()}
            className={
              t(myCurrentRoute) === t("Cognitive space") && "currActiveArchitect"
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
          <MenuItem
            className={
              t(myCurrentRoute) === t("Reports") && "currActiveAdministration"
            }
            icon={<></>}
            id="general"
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
          <small className="d-flex flex-fill ml-2 mt-2">
            <span id="generals2"> {t("Session setup")}</span>
          </small>
          <MenuItem
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
        </>
      )} */}
      </div>
    </ThemeProvider>
  );
}
