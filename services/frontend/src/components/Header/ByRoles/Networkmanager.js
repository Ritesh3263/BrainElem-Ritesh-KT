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

export default function Networkmanager({ collapsed }) {
  const { t, i18n, translationsLoaded } = useTranslation();
  const { myCurrentRoute, F_getHelper } = useMainContext();
  const permissions = F_getHelper().userPermissions;
  const [navSubItems, setNavSubItems] = useState(['tab-manag']);
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
              <li className={current_url.includes("modules") || current_url.includes("modules/managers") ? 'menu_active' : ''}>
                <Link to={"/modules"}><Typography variant="body2" component="span">{t("Management")} </Typography></Link>
                <ul className="submenu">
                  <li className={current_url.includes("modules/managers") !== current_url.includes("modules") ? 'active' : ''}>
                    <Link to={"/modules"} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("Modules")}</Typography>
                    </Link>
                  </li>
                  <li className={current_url.includes("managers") ? 'active' : ''}>
                    <Link to={"/modules/managers"} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("Users")}</Typography>
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
            hidden={!navSubItems.includes('tab-manag')}
            className={`collapsed-icon ${t(myCurrentRoute) === t("Module") && "currActiveAdmin"
              }`}
            title={t("Modules")}
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
                  src="/img/icons/sidebar_modules.svg"
                  style={{ height: "100%" }}
                />
              </Icon>
            }
          >
            <Link to={"/modules"} className="pro-item-content">
              {t("Modules")}
            </Link>
          </MenuItem>
          <MenuItem
            hidden={!navSubItems.includes('tab-manag')}
            className={`collapsed-icon ${t(myCurrentRoute) === t("Module managers") &&
              "currActiveAdmin"
              }`}
            title={t("Users")}
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
                  src="/img/icons/sidebar_users.svg"
                  style={{ height: "100%" }}
                />
              </Icon>
            }
          >
            <Link to={"/modules/managers"} className="pro-item-content">
              {t("Users")}
            </Link>
          </MenuItem>
        </>
      ) : (
        <>
          <ListItemButton style={{ justifyContent: "space-between", marginTop: 10, marginBottom: 8 }} dense
            onClick={() => toggleHandler('tab-manag')} >
            <span id="generals4" > {t("Management")}</span>
            {navSubItems.includes('tab-manag') ? (<ExpandLessIcon id="generals4-big" />) : (<ExpandMoreIcon id="generals4-big" />)}
          </ListItemButton>
          <MenuItem
            hidden={!navSubItems.includes('tab-manag')}
            className={
              t(myCurrentRoute) === t("Module") && "currActiveAdmin"
            }
            id="setup-networks-users"
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
                <img
                  src="/img/icons/sidebar_modules.svg"
                  style={{ height: "100%" }}
                />
              </Icon>
            }
          >
            <Link to={"/modules"} className="pro-item-content">
              {t("Modules")}
            </Link>
          </MenuItem>
          <MenuItem
            hidden={!navSubItems.includes('tab-manag')}
            className={
              t(myCurrentRoute) === t("Module managers") &&
              "currActiveAdmin"
            }
            id="setup-networks-users"
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
                <img
                  src="/img/icons/sidebar_users.svg"
                  style={{ height: "100%" }}
                />
              </Icon>
            }
          >
            <Link to={"/modules/managers"} className="pro-item-content">
              {t("Users")}
            </Link>
          </MenuItem>
        </>
      )} */}
      </div>
    </ThemeProvider>
  );
}
