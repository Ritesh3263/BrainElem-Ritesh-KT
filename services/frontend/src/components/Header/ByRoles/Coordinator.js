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

export default function Coordinator({ collapsed }) {
  const { t, i18n, translationsLoaded } = useTranslation();
  const { myCurrentRoute, F_getHelper } = useMainContext();
  const permissions = F_getHelper().userPermissions;
  const current_url = window.location.href;
  return (
    <ThemeProvider theme={new_theme}>
      <div className="menu_bar">
        <div className="main_navigation">
          <nav className="nav_bar">
            <ul className="main_menu">
              <li className={`${current_url.includes("myspace") || current_url.includes("sessions-free") || current_url.includes("sessions") ? 'menu_active' : ''}`}>
                <Link><Typography variant="body2" component="span">{t("General")} </Typography></Link>
                <ul className="submenu">
                  <li className={current_url.includes("myspace") ? 'active' : ''}>
                    <Link to={"/myspace"} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("My space")}</Typography>
                    </Link>
                  </li>
                  {/* <li className={current_url.includes("sessions-free") ? 'active' : ''}>
                    <Link to={"/sessions-free"} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("Sessions")}</Typography>
                    </Link>
                  </li>
                  <li className={current_url.includes("sessions") ? 'active' : ''}>
                    <Link to={"/sessions"} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("Sessions (BC)")}</Typography>
                    </Link>
                  </li> */}
                </ul>
              </li>
            </ul>
          </nav>
        </div>


        {/* {collapsed ? (
          <>
            <MenuItem
              hidden={!CommonService.isDevelopment()}
              className={`collapsed-icon ${t(myCurrentRoute) === t("Cognitive space") && "currActiveAdministration"
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
              <span id="generals4"> {t("General")}</span>
            </small>
            <MenuItem
              hidden={!CommonService.isDevelopment()}
              className={
                t(myCurrentRoute) === t("Cognitive space") && "currActiveAdministration"
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
