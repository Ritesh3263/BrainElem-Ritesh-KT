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

export default function Partner({ collapsed }) {
  const { t } = useTranslation();
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
              {/* <li className={current_url.includes("explore") ? 'menu_active' : ''}>
                <Link to={(isInTrainingCenter ? "/explore-courses" : "/explore")} className="pro-item-content">
                  <Typography variant="body2" component="span">{t("Explore")}</Typography>
                </Link>
              </li>
              <li className={current_url.includes("create-content") ? 'menu_active' : ''}>
                <Link to={"/create-content"} className="pro-item-content">
                  <Typography variant="body2" component="span">{t("Create")}</Typography>
                </Link>
              </li> */}
              <li className={`${current_url.includes("myspace") ? 'menu_active' : ''}`}>
                <Link><Typography variant="body2" component="span">{t("General")} </Typography></Link>
                <ul className="submenu">
                  {/* <li>
                    <Link className="pro-item-content">
                      <Typography variant="body2" component="span">{t("Statistics (coming soon! )")}</Typography>
                    </Link>
                  </li> */}
                  <li className={current_url.includes("myspace") ? 'active' : ''}>
                    <Link to={"/myspace"} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("My space")}</Typography>
                    </Link>
                  </li>

                </ul>
              </li>
              {/* <li className={`${current_url.includes("sessions") || current_url.includes("enquires") || current_url.includes("partners") ? 'menu_active' : ''}`}>
                <Link className="pro-item-content"><Typography variant="body2" component="span">{t("Session setup")} </Typography></Link>
                <ul className="submenu">
                  <li className={current_url.includes("sessions") ? 'active' : ''}>
                    <Link to={"/sessions"} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("Session")}</Typography>
                    </Link>
                  </li>
                  <li className={current_url.includes("enquires") ? 'active' : ''}>
                    <Link to={"/enquires"} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("Enquires")}</Typography>
                    </Link>
                  </li>
                  <li className={current_url.includes("partners") ? 'active' : ''}>
                    <Link to={"/partners"} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("Companies")}</Typography>
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
            title={t("Explore")}
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
              {t("Explore")}
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
          <hr />
          
          <MenuItem
            className={`collapsed-icon ${t(myCurrentRoute) === t("") && "currActiveArchitect"
              }`}
            title={t("")}
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
                <img src="/img/icons/sidebar_statistics.svg" style={{ height: "100%", opacity: "0.4" }} />
              </Icon>
            }
          >
          </MenuItem>
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
          <hr />
          <MenuItem
            className={`collapsed-icon ${t(myCurrentRoute) === t("Session") && "currActiveAdministration"
              }`}
            title={t("Session")}
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
                <img src="/img/icons/sidebar_classes.svg" style={{ height: "100%" }} />
              </Icon>
            }
          >
            <Link
              to={"/sessions"}
              className="pro-item-content"
            >
              {t("Session")}
            </Link>
          </MenuItem>
          <MenuItem
            className={`collapsed-icon ${t(myCurrentRoute) === t("Enquires") &&
              "currActiveAdministration"
              }`}
            title={t("Enquires")}
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
                  src="/img/icons/sidebar_curriculae.svg"
                  style={{ height: "100%" }}
                />
              </Icon>
            }
          >
            <Link to={"/enquires"} className="pro-item-content">
              {t("Enquires")}
            </Link>
          </MenuItem>
          <MenuItem
            className={`collapsed-icon ${t(myCurrentRoute) === t("Companies") && "currActiveExam"
              }`}
            title={t("Companies")}
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
                <img src="/img/icons/sidebar_companies.svg" style={{ height: "100%", opacity: "0.8" }} />
              </Icon>
            }
          >
            <Link to={"/partners"} className="pro-item-content">
              {t("Partners")}
            </Link>
          </MenuItem>
        </>
      ) : (
        <>
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
              t(myCurrentRoute) === t("Content Factory") && "currActiveExplore"
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
                <img src="/img/icons/create.svg" style={{ height: "100%" }} />
              </Icon>
            }
          >
            <Link to={"/create-content"} className="pro-item-content">
              {t("Create")}
            </Link>
          </MenuItem>
          <small className="d-flex flex-fill ml-2 mt-2">
            <span id="generals"> {t("General")}</span>
          </small>
          
          <MenuItem style={{ opacity: "0.4" }}
            className={
              t(myCurrentRoute) === t("") && "currActiveArchitect"
            }
            id="general"
            icon={<></>}
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
                <img src="/img/icons/sidebar_statistics.svg" style={{ height: "100%" }} />
              </Icon>
            }
          >
            {t("Statistics (coming soon! )")}
          </MenuItem>
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

          <small className="d-flex flex-fill ml-2 mt-2">
            <span id="generals2"> {t("Session setup")}</span>
          </small>
          <MenuItem
            className={
              t(myCurrentRoute) === t("Session") && "currActiveAdministration"
            }
            icon={<></>}
            id="general2"
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
                <img src="/img/icons/sidebar_classes.svg" style={{ height: "100%" }} />
              </Icon>
            }
          >
            <Link
              to={"/sessions"}
              className="pro-item-content"
            >
              {t("Session")}
            </Link>
          </MenuItem>
          <MenuItem
            className={
              t(myCurrentRoute) === t("Enquires") &&
              "currActiveAdministration"
            }
            icon={<></>}
            id="general2"
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
                  src="/img/icons/sidebar_curriculae.svg"
                  style={{ height: "100%" }}
                />
              </Icon>
            }
          >
            <Link to={"/enquires"} className="pro-item-content">
              {t("Enquires")}
            </Link>
          </MenuItem>
          <MenuItem
            className={
              t(myCurrentRoute) === t("Companies") && "currActiveExam"
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
                <img src="/img/icons/sidebar_companies.svg" style={{ height: "100%", opacity: "0.8" }} />
              </Icon>
            }
          >
            <Link to={"/partners"} className="pro-item-content">
              {t("Companies")}
            </Link>
          </MenuItem>
        </>
      )} */}
      </div>
    </ThemeProvider>
  );
}
