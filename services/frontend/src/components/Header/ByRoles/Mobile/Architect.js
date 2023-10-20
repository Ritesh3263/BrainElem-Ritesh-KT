import React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import NestedList from './NestedList';
import { useNavigate } from "react-router-dom";
import { Close } from "@mui/icons-material";
import { FaBullseye } from 'react-icons/fa';
import "./mobnav.scss";
import { new_theme } from 'NewMuiTheme';
import { useMainContext } from "../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
const Architect = (props) => {
  const { window } = props;
  const container = window !== undefined ? () => window().document.body : undefined;

  const drawerWidth = 240;
  const { myCurrentRoute, F_getHelper, F_hasPermissionTo } = useMainContext();
  const isInTrainingCenter = F_getHelper().manageScopeIds.isTrainingCenter;
  const isInCognitiveCenter = F_getHelper().user.isInCognitiveCenter;
  const navigate = useNavigate();
  const { user } = F_getHelper();

  var navItems = ['General', 'Library'];

  navItems['General'] = {
    'name': 'General',
    'submenu': true,
    'to': "/",
    'visible': true,
    'menu': [
      {
        'name': 'Dashboard',
        'submenu': false,
        'to': '/sentinel/home',
        'icon': "icon_dashboard",
        'onclick': true,
        'visible': user.permissions.find(o => o.moduleName === 'Dashboard')?.access
      },
    ],
  }
  navItems['Library'] = {
    'name': 'Library',
    'submenu': true,
    'to': "/",
    'visible': true,
    'menu': [
      {
        'name': "Explore​",
        'submenu': false,
        'to': "/explore-courses",
        'icon': "icon_explore",
        'onclick': false,
        'visible': user.permissions.find(o => o.moduleName === 'Explore')?.access
      },
      {
        'name': "Create",
        'submenu': false,
        'to': "/create-content",
        'icon': "icon_create",
        'onclick': false,
        'visible': user.permissions.find(o => o.moduleName === 'Create')?.access
      },
      {
        'name': "My Library",
        'submenu': false,
        'to': "/my-library",
        'icon': "icon_library",
        'onclick': false,
        'visible': user.permissions.find(o => o.moduleName === 'My Library')?.access
      },
      {
        'name': "Books",
        'submenu': false,
        'to': "/source-materials",
        'icon': "icon_create",
        'onclick': false,
        'visible': user.permissions.find(o => o.moduleName === 'Books')?.access
      },
    ]
  };
  navItems['My stuff'] = {
    'name': 'My stuff',
    'submenu': true,
    'visible': !isInTrainingCenter,
    'menu': [
      {
        'name': "Program edit",
        'submenu': false,
        'to': "/program-edit",
        'icon': "icon_programs",
        'onclick': false,
        'visible': user.permissions.find(o => o.moduleName === 'Program edit')?.access
      },
      {
        'name': "Reports​",
        'submenu': false,
        'to': "/reports-settings",
        'icon': "icon_formats",
        'onclick': false,
        'visible': user.permissions.find(o => o.moduleName === 'Reports')?.access
      },
    ]
  };
  navItems['My stuff'] = {
    'name': 'My stuff',
    'submenu': true,
    'visible': isInTrainingCenter,
    'menu': [
      {
        'name': "Sessions",
        'submenu': false,
        'to': "/sessions-free",
        'icon': "icon_sessions",
        'onclick': false,
        'visible': user.permissions.find(o => o.moduleName === 'Sessions')?.access
      },
      {
        'name': "Sessions (BC)​",
        'submenu': false,
        'to': "/sessions",
        'icon': "icon_sessions",
        'onclick': false,
        'visible': user.permissions.find(o => o.moduleName === 'Sessions (BC)')?.access
      },
    ]
  };
  navItems['Catalogue'] = {
    'name': 'Catalogue',
    'submenu': true,
    'visible': isInTrainingCenter,
    'menu': [
      {
        'name': "Courses",
        'submenu': false,
        'to': "/courses",
        'icon': "icon_myCourses",
        'onclick': false,
        'visible': user.permissions.find(o => o.moduleName === 'Courses')?.access
      },
      {
        'name': "Course path​",
        'submenu': false,
        'to': "/coursePath",
        'icon': "icon_myCourses",
        'onclick': false,
        'visible': user.permissions.find(o => o.moduleName === 'Course path')?.access
      },
      {
        'name': "Certificate Templates",
        'submenu': false,
        'to': "/certifications/competenceBlocks",
        'icon': "icon_certificate_template",
        'onclick': false,
        'visible': user.permissions.find(o => o.moduleName === 'Certificate Templates')?.access
      },
      {
        'name': "Formats",
        'submenu': false,
        'to': "/formats",
        'icon': "icon_formats",
        'onclick': false,
        'visible': user.permissions.find(o => o.moduleName === 'Formats')?.access
      },
    ]
  };
  navItems['Library'] = {
    'name': 'Library',
    'submenu': true,
    'visible': true,
    'menu': [
      {
        'name': "Explore",
        'submenu': false,
        'to': isInTrainingCenter ? "/explore-courses" : "/explore",
        'icon': "icon_explore",
        'onclick': false,
        'visible': user.permissions.find(o => o.moduleName === 'Explore')?.access
      },
      {
        'name': "Create",
        'submenu': false,
        'to': "/create-content",
        'icon': "icon_create",
        'onclick': false,
        'visible': user.permissions.find(o => o.moduleName === 'Create')?.access
      },
      {
        'name': "My Library",
        'submenu': false,
        'to': "/my-library",
        'icon': "icon_library",
        'onclick': false,
        'visible': user.permissions.find(o => o.moduleName === 'My Library')?.access
      },
      {
        'name': "Books",
        'submenu': false,
        'to': "/source-materials",
        'icon': "icon_gradebook",
        'onclick': false,
        'visible': user.permissions.find(o => o.moduleName === 'Books')?.access
      },
    ]
  };

  const drawer = (
    <Box sx={{ textAlign: 'center' }}>
      <div className='header_top'>
        <div className='close_icon'>
          <IconButton className="arrowLeft" onClick={() => props.handle(false)}>
            <Close style={{ color: new_theme.palette.primary.PWhite, fontSize: '25px' }} />
          </IconButton>
        </div>
        <div className='logo_icon'>
          {/* <img src="/img/brand/mob_logo.png" /> */}
          {
            isInCognitiveCenter ?
              <>
                <img src='/img/brand/BrainElem_Logo_Sentinel.svg' className='img-fluid' style={{height: '40px'}} />
              </>
              : isInTrainingCenter ?
                <>
                  <img src='/img/brand/BrainElem_Logo_Academy.svg' className='img-fluid' style={{height: '40px'}} />
                </>
                :
                <>
                  <img src='/img/brand/BrainElem_Logo_BrainCore.svg' className='img-fluid' style={{height: '40px'}} />
                </>

          }
        </div>
      </div>

      <Divider />
      <List>
        {
          navItems.map((item) => (
            navItems[item].visible &&
             ( navItems[item].submenu ?
              <NestedList name={item} menu={navItems[item].menu} />
              : <ListItem key={item} disablePadding className="list_item">
                <ListItemButton sx={{ textAlign: 'center' }} className="list_item_button">
                  <ListItemText className="list_item_text" primary={item} onClick={() => {
                    navigate(navItems[item].to)
                  }} sx={{ fontWeight: 'bold', border: `1px solid ${new_theme.palette.newSupplementary.NSupText}` }} />

                </ListItemButton>
              </ListItem>)
          ))
        }
      </List>
    </Box>
  );

  return (
    <div>
      <Box component="nav">
        <Drawer
          PaperProps={{
            sx: { width: "80% !important" },
          }}
          container={container}
          variant="temporary"
          open={props.drawerOpen}
          className="show-drawer"
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </div>
  );
};

export default Architect;