import React from "react";
import { Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import Icon from "@material-ui/core/Icon";
import { Link } from "react-router-dom";
import { useMainContext } from "../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import { useTranslation } from "react-i18next";
import { new_theme } from "NewMuiTheme";
import { ThemeProvider, Typography } from "@mui/material";
import "../Header.scss";

export default function Cloudmanager({ collapsed }) {
  const { t } = useTranslation();
  const { myCurrentRoute, F_getHelper } = useMainContext();
  const permissions = F_getHelper().userPermissions;
  const current_url = window.location.href;
  return (
    <div className="menu_bar">
      {/* {permissions.isAdmin && (
        <p className="text-success text-md-center">Cloud Manager</p>
      )} */}
      <div className="main_navigation">
        <nav className="nav_bar">
          <ul className="main_menu">
            <li className={current_url.includes("accepting-cloud-content") ? 'menu_active' : ''}>
              <Link to={"/accepting-cloud-content"} className="pro-item-content">
                <Typography variant="body2" component="span">{t("Manage cloud")}</Typography>
              </Link>
            </li>
            <li className={current_url.includes("module-cloud") ? 'menu_active' : ''}>
              <Link to={"/module-cloud"} className="pro-item-content">
                <Typography variant="body2" component="span">{t("Storage")}</Typography>
              </Link>
            </li>
          </ul>
        </nav>
      </div>



      {/* {collapsed ? (
        <>
          <MenuItem
            className={`collapsed-icon ${t(myCurrentRoute) === t("Manage cloud") && "currActiveAdmin"
              }`}
            title={t("Manage cloud")}
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
                  src="/img/icons/manage_library.svg"
                  style={{ height: "100%" }}
                />
              </Icon>
            }
          >
            <Link to={"/accepting-cloud-content"} className="pro-item-content">
              {t("Manage cloud")}
            </Link>
          </MenuItem>
          <MenuItem
            className={`collapsed-icon ${t(myCurrentRoute) === t("Storage") &&
              "currActiveAdmin"
              }`}
            title={t("Storage")}
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
                  src="/img/icons/manage_library.svg"
                  style={{ height: "100%" }}
                />
              </Icon>
            }
          >
            <Link to={"/module-cloud"} className="pro-item-content">
              {t("Storage")}
            </Link>
          </MenuItem>
        </>
      ) : (
        <>
          <MenuItem
            className={
              t(myCurrentRoute) === t("Manage cloud") && "currActiveAdmin"
            }
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
                  src="/img/icons/manage_library.svg"
                  style={{ height: "100%" }}
                />
              </Icon>
            }
          >
            <Link to={"/accepting-cloud-content"} className="pro-item-content">
              {t("Manage cloud")}
            </Link>
          </MenuItem>
          <MenuItem
            className={
              t(myCurrentRoute) === t("Storage") &&
              "currActiveAdmin"
            }
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
                  src="/img/icons/manage_library.svg"
                  style={{ height: "100%" }}
                />
              </Icon>
            }
          >
            <Link to={"/module-cloud"} className="pro-item-content">
              {t("Storage")}
            </Link>
          </MenuItem>
        </>
      )} */}
    </div>
  );
}
