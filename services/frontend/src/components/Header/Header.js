import React, { useState } from "react";
import "./Header.scss";
import { useTranslation } from "react-i18next";
import { ProSidebar, SidebarHeader, SidebarFooter, SidebarContent, } from "react-pro-sidebar";
import Admin from "./ByRoles/Admin";
import Ecomanager from "./ByRoles/Ecomanager";
import Networkmanager from "./ByRoles/Networkmanager";

import Others from "./ByRoles/Others";
import Architect from "./ByRoles/Architect";
import Librarian from "./ByRoles/Librarian";
import Cloudmanager from "./ByRoles/Cloudmanager";
import Trainer from "./ByRoles/Trainer";
import Trainee from "./ByRoles/Trainee";
import Parent from "./ByRoles/Parent";
import Partner from "./ByRoles/Partner";
import Inspector from "./ByRoles/Inspector";
import Coordinator from "./ByRoles/Coordinator";
import TrainingManager from "./ByRoles/TrainingManager";
import { useMainContext } from "../_ContextProviders/MainDataContextProvider/MainDataProvider";
import Avatar from "@material-ui/core/Avatar";
import { now } from "moment";
import { Typography } from "@mui/material";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import Icon from "@material-ui/core/Icon";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { theme } from "../../MuiTheme";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import IconButton from '@material-ui/core/IconButton';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Link } from "react-router-dom";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Fade from '@mui/material/Fade';

const useStyles = makeStyles((theme) => ({

  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

export default function Sidebar({ image, rtl, }) {

  const { F_getHelper } = useMainContext();
  const { user } = F_getHelper();


  const roleDependentHeader = (user) => {
    let role = user?.role
    switch (role) {
      case "Root": return (<Admin />);
      case "EcoManager": return (<Ecomanager />);
      case "Partner": return (<Partner />);
      case "TrainingManager": return (<TrainingManager />);
      case "Inspector": return (<Inspector />);
      case "NetworkManager": return (<Networkmanager />);
      case "ModuleManager": {// <------------------------------------ SENTINEL(only module managers)
      // Component with Navigation for ModuleManager will be removed
      // So far it was just a duplicate of Others.js and we had to update both files
          if (!user.moduleId) return (null);
          // # My Space + TC
          if (!user?.isInCognitiveCenter) return <Trainee />
          // # Sentinel
          else return (<Others />);
      }
      case "Assistant": return (<Others />);
      case "Coordinator": return (<Coordinator />);
      case "Architect": return (<Architect />);
      case "Librarian": return (<Librarian />);
      case "Trainee": {// <------------------------------------ MY SPACE
        if (!user.moduleId) return (null);
        return (<Trainee />);
      }
      case "Parent": return (<Parent />);
      case "Trainer": return (<Trainer />);
      case "Other": return (<Others />);// <-------------------- SENTINEL
      default: return (null);
    }
  }


  return (<>
    {roleDependentHeader(user)}    </>)
};
