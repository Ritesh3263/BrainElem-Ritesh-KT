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

export default function Admin({ collapsed }) {
  const { t, i18n, translationsLoaded } = useTranslation();
  const { myCurrentRoute } = useMainContext();
  return (
    <ThemeProvider theme={new_theme}>
    <div className="menu_bar">
      <div className="main_navigation">
        <nav className="nav_bar">
          <ul className="main_menu">
            <li className={t(myCurrentRoute) === t("Ecosystem") && "currActiveAdmin"}>
              <Link to={"/ecosystems"} className="pro-item-content"><Typography variant="body2" component="span">{t("Ecosystems")}</Typography></Link>
            </li>
            <li className={t(myCurrentRoute) === t("Ecosystem managers") && "currActiveAdmin"}>
              <Link to={"/ecosystems/managers"} className="pro-item-content">
                <Typography variant="body2" component="span">{t("Eco-managers")}</Typography>
              </Link>
            </li>
            <li className={t(myCurrentRoute) === t("Script") && "currActiveAdmin"}>
              <Link to={"/scripts"} className="pro-item-content">
                <Typography variant="body2" component="span">{t("Scripts")}</Typography>
              </Link>
            </li>
            <li className={t(myCurrentRoute) === t("Blockchain") && "currActiveAdmin"}>
              <Link to={"/blockchain/interface"} className="pro-item-content">
                <Typography variant="body2" component="span">{t("Blockchain")}</Typography>
              </Link>
            </li>
            <li className={t(myCurrentRoute) === t("Database") && "currActiveAdmin"}>
              <Link to={"/database/diagram"} className="pro-item-content">
                <Typography variant="body2" component="span">{t("Database")}</Typography>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      {/* {collapsed ? (
        <>
          <MenuItem
            className={`collapsed-icon ${t(myCurrentRoute) === t("Ecosystem") && "currActiveAdmin"
              }`}
            title={t("Ecosystems")}
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
                <img src="/img/icons/setup.svg" style={{ height: "100%" }} />
              </Icon>
            }
          >
            <Link to={"/ecosystems"} className="pro-item-content">
              {t("Ecosystem")}
            </Link>
          </MenuItem>
          <MenuItem
            className={`collapsed-icon ${t(myCurrentRoute) === t("Ecosystem managers") && "currActiveAdmin"
              }`}
            title={t("Ecosystem managers")}
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
                  src="/img/icons/management.svg"
                  style={{ height: "100%" }}
                />
              </Icon>
            }
          >
            <Link to={"/ecosystems/managers"} className="pro-item-content">
              {t("Eco-managers")}
            </Link>
          </MenuItem>
          <MenuItem
            className={`collapsed-icon ${t(myCurrentRoute) === t("Script") && "currActiveAdmin"
              }`}
            title={t("Script")}
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
                  src="/img/icons/setup.svg"
                  style={{ height: "100%" }}
                />
              </Icon>
            }
          >
            <Link to={"/scripts"} className="pro-item-content">
              {t("Eco-managers")}
            </Link>
          </MenuItem>
          <MenuItem
            className={`collapsed-icon ${t(myCurrentRoute) === t("Blockchain") && "currActiveAdmin"
              }`}
            title={t("Blockchain")}
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
                  src="/img/icons/blockchain.svg"
                  style={{ height: "100%" }}
                />
              </Icon>
            }
          >
            <Link to={"/blockchain/interface"} className="pro-item-content">
              {t("Blockchain")}
            </Link>
          </MenuItem>
          <MenuItem
            className={`collapsed-icon ${t(myCurrentRoute) === t("Database") && "currActiveAdmin"
              }`}
            title={t("Database")}
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
                  src="/img/icons/sidebar_networks.svg"
                  style={{ height: "100%" }}
                />
              </Icon>
            }
          >
            <Link to={"/database/diagram"} className="pro-item-content">
              {t("Database")}
            </Link>
          </MenuItem>
        </>
      ) : (
        <>
          <MenuItem
            className={
              t(myCurrentRoute) === t("Ecosystem") && "currActiveAdmin"
            }
            id="management-ecosystems"
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
                <img src="/img/icons/setup.svg" style={{ height: "100%" }} />
              </Icon>
            }
          >
            <Link to={"/ecosystems"} className="pro-item-content">
              {t("Ecosystem")}
            </Link>
          </MenuItem>
          <MenuItem
            className={
              t(myCurrentRoute) === t("Ecosystem managers") && "currActiveAdmin"
            }
            id="management-ecosystems-users"
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
                  src="/img/icons/management.svg"
                  style={{ height: "100%" }}
                />
              </Icon>
            }
          >
            <Link to={"/ecosystems/managers"} className="pro-item-content">
              {t("Eco-managers")}
            </Link>
          </MenuItem>
          <MenuItem
            className={
              t(myCurrentRoute) === t("Script") && "currActiveAdmin"
            }
            id="root-scripts"
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
                  src="/img/icons/setup.svg"
                  style={{ height: "100%" }}
                />
              </Icon>
            }
          >
            <Link to={"/scripts"} className="pro-item-content">
              {t("Scripts")}
            </Link>
          </MenuItem>
          <MenuItem
            className={
              t(myCurrentRoute) === t("Blockchain") && "currActiveAdmin"
            }
            id="root-scripts"
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
                  src="/img/icons/blockchain.svg"
                  style={{ height: "100%" }}
                />
              </Icon>
            }
          >
            <Link to={"/blockchain/interface"} className="pro-item-content">
              {t("Blockchain")}
            </Link>
          </MenuItem>
          <MenuItem
            className={
              t(myCurrentRoute) === t("Database") && "currActiveAdmin"
            }
            id="root-scripts"
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
                  src="/img/icons/sidebar_networks.svg"
                  style={{ height: "100%" }}
                />
              </Icon>
            }
          >
            <Link to={"/database/diagram"} className="pro-item-content">
              {t("Database")}
            </Link>
          </MenuItem>
        </>
      )} */}
    </div>
    </ThemeProvider>
  );
}
