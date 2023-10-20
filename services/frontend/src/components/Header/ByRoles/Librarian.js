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

export default function Librarian({ collapsed }) {
  const { t, i18n, translationsLoaded } = useTranslation();
  const { myCurrentRoute, F_getHelper } = useMainContext();
  const isInTrainingCenter = F_getHelper().manageScopeIds.isTrainingCenter;
  const permissions = F_getHelper().userPermissions;
  const [navSubItems, setNavSubItems] = useState(['tab-library']);
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
              <li className={`${current_url.includes("explore-courses") || current_url.includes("module-library") ? 'menu_active' : ''}`}>
                <Link><Typography variant="body2" component="span">{t("Library")} </Typography></Link>
                <ul className="submenu">
                  {/* <li className={current_url.includes("explore") ? 'active' : ''}>
                    <Link to={(isInTrainingCenter ? "/explore-courses" : "/explore")} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("Explore")}</Typography>
                    </Link>
                  </li> */}
                  <li className={current_url.includes("module-library") ? 'active' : ''}>
                    <Link to={"/module-library"} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("Library")}</Typography>
                    </Link>
                  </li>
                  <li>
                    <Link to={"/accepting-library-content"} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("Accept content")}</Typography>
                    </Link>
                  </li>
                  <li>
                    <Link to={"/accepting-library-course"} className="pro-item-content">
                      <Typography variant="body2" component="span">{t("Accept course")}</Typography>
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </ThemeProvider>
  );
}
