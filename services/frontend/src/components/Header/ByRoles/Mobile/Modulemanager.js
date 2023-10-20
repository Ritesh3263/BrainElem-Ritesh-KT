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
import { useTranslation } from "react-i18next";

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
const Modulemanager = (props) => {
  const { window } = props;
  const container = window !== undefined ? () => window().document.body : undefined;
  const { t } = useTranslation(['translation', 
    'sentinel-MyUsers-BCTestRegistration', 
    'sentinel-MyTeams-Statistics',
    'sentinel-MyTeams-Results',
    'common'
  ]);
  const drawerWidth = 240;
  const { myCurrentRoute, F_getHelper, F_hasPermissionTo, F_t } = useMainContext();
  const isInTrainingCenter = F_getHelper().manageScopeIds.isTrainingCenter;
  const isInCognitiveCenter = F_getHelper().user.isInCognitiveCenter;
  const navigate = useNavigate();
  const { user,userPermissions } = F_getHelper();

  var navItems = ['Home', 'Admin', 'My Team', 'My Projects', 'My Users'];
  // var navItemsForCognative = ['General', 'Management', 'Library'];
  var navItemsForCognative = ['General'];

  navItems['Home'] = {
    'name': 'Home',
    'submenu': false,
    'to': "/sentinel/home",
    'visible': user.permissions.find(o => (o.moduleName == 'Home'))?.access
  };

  navItems['Admin'] = {
    'name': 'Admin',
    'submenu': true,
    'visible': true,
    'to': "/",
    'menu': [
      // {
      //   'name': 'Users​',
      //   'submenu': false,
      //   'to': 'new-modules-core/users',
      //   'icon': "icon_users",
      //   'onclick': true,
      //   'visible': user.permissions.find(o => o.moduleName === 'Users')?.access
      // },
      {
        'name': 'Authorization​',
        'submenu': false,
        'to': "/sentinel/admin/authorizations/",
        'icon': "icon_explore",
        'onclick': false,
        'visible': userPermissions.admin_auth.access
      },
    ],
    'visible': user.permissions.find(o => (o.moduleName == 'Admin - Authorization' || o.moduleName == 'My Users - Users'))?.access
  }
  navItems['My Team'] = {
    'name': 'My Team',
    'submenu': true,
    'to': "/",
    'visible': user.permissions.find(o => (o.moduleName == 'Team creation & assignments' || o.moduleName == 'BC Test Registrations' || o.moduleName == 'BC Results for Team - NAD/QNAD' || o.moduleName == 'BC Results for Team - interpersonal dimensions' || o.moduleName == 'BC Results for Team - emotional intelligence' || o.moduleName == 'BC Results for Team - cost/time report'))?.access,
    'menu': [
      {
        'name': "Teams​",
        'submenu': false,
        'to': "/sentinel/myteams/teams/",
        'icon': "icon_create",
        'onclick': false,
        'visible': userPermissions.mt_teams.access
      },
      {
        'name': "BC Registrations​",
        'submenu': false,
        'to': "/sentinel/myteams/BC-test-registrations/users",
        'icon': "icon_create",
        'onclick': false,
        'visible': userPermissions.mt_bcTestReg.access
      },
      {
        'name': "Results",
        'submenu': false,
        'to': "/sentinel/myteams/Results",
        'icon': "icon_create",
        'onclick': false,
        'visible': true
      },
      {
        'name': "Stat",
        'submenu': false,
        'to': "/sentinel/myteams/Statistics",
        'icon': "icon_create",
        'onclick': false,
        'visible': userPermissions.mt_teams.access
      }
      // {
      //   'name': "BC Results for Group​",
      //   'submenu': true,
      //   'to': "/",
      //   'icon': "icon_create",
      //   'onclick': false,
      //   'menu': [
      //     {
      //       'name': "NAD/QNAD​​",
      //       'submenu': false,
      //       'to': "/BC-test-registrations/nad-qnad/",
      //       'icon': "icon_create",
      //       'onclick': false,
      //       'visible': user.permissions.find(o => o.moduleName === 'BC Results for Team - strong/weak points')?.access
      //     },
      //     {
      //       'name': "Strong/Weak​ Points",
      //       'submenu': false,
      //       'to': "/BC-test-registrations/strong-weakpoint/",
      //       'icon': "icon_create",
      //       'onclick': false,
      //       'visible': user.permissions.find(o => o.moduleName === 'BC Results for Team - NAD/QNAD')?.access
      //     },
      //     {
      //       'name': "Interpersonal Dimension​s",
      //       'submenu': false,
      //       'to': "/BC-test-registrations/interpersonal-dimension/",
      //       'icon': "icon_create",
      //       'onclick': false,
      //       'visible': user.permissions.find(o => o.moduleName === 'BC Results for Team - interpersonal dimensions')?.access
      //     },
      //     {
      //       'name': "Intrapersonal Dimension​s",
      //       'submenu': false,
      //       'to': "/BC-test-registrations/intrapersonal-dimension/",
      //       'icon': "icon_create",
      //       'onclick': false,
      //       'visible': user.permissions.find(o => o.moduleName === 'BC Results for Team - intrapersonal dimensions')?.access
      //     },
      //     {
      //       'name': "Emotional​ Intelligence",
      //       'submenu': false,
      //       'to': "/BC-test-registrations/emotional-inteligence/",
      //       'icon': "icon_create",
      //       'onclick': false,
      //       'visible': user.permissions.find(o => o.moduleName === 'BC Results for Team - emotional intelligence')?.access
      //     },
      //     {
      //       'name': "Cost/Time​ Reports",
      //       'submenu': false,
      //       'to': "/BC-test-registrations/cost-time/",
      //       'icon': "icon_create",
      //       'onclick': false,
      //       'visible': user.permissions.find(o => o.moduleName === 'BC Results for Team - cost/time report')?.access
      //     },
      //   ],
      //   'visible': user.permissions.find(o => (o.moduleName == 'BC Results for Team - strong/weak points' || o.moduleName == 'BC Results for Team - NAD/QNAD' || o.moduleName == 'BC Results for Team - interpersonal dimensions' || o.moduleName == 'BC Results for Team - intrapersonal dimensions' || o.moduleName == 'BC Results for Team - emotional intelligence' || o.moduleName == 'BC Results for Team - cost/time report'))?.access
      // },
    ]
  };
  navItems['My Projects'] = {
    'name': 'My Projects',
    'submenu': true,
    'visible': userPermissions.myProjects.access,
    'menu': [
      {
        'name': "Interactive CS​",
        'submenu': false,
        'icon': "icon_users",
        'to': "/",
        'onclick': false,
        'visible': user.permissions.find(o => o.moduleName === 'Interactive CS - authomatized projects - potential group')?.access
      },
      {
        'name': "Neuro Functions​",
        'submenu': false,
        'icon': "icon_users",
        'to': "/",
        'onclick': false,
        'visible': true
      },
    ]
  };
  navItems['My Users'] = {
    'name': 'My Users',
    'submenu': true,
    'visible': true,
    'menu': [
      {
        'name': "Users​​",
        'submenu': false,
        'icon': "icon_users",
        'to': "/sentinel/myusers/users",
        'onclick': false,
        'visible': true
      },
      {
        'name': "My Diary​",
        'submenu': false,
        'icon':"icon_gradebook",
        'to': "/sentinel/myusers/Braincoretestregistrations/users",
        'onclick': false,
        'visible': true
      },
    ]
  };
  navItems['My Diary'] = {
    'name': 'My Diary',
    'submenu': true,
    'visible': true,
    'menu': [
      {
        'name': "Diary",
        'submenu': false,
        'icon': "icon_users",
        'to': "/my-projects/my-diary/diary",
        'onclick': false,
        'visible': true
      },
    ]
  };
  navItemsForCognative['General'] = {
    'name': 'General',
    'submenu': true,
    'to': '/',
    'visible': true,
    'menu': [
      {
        'name': t("common:MY SPACE"),
        'submenu': false,
        'to': '/myspace',
        'visible': true,
        'onclick': false,
        'icon': "icon_cognitive_space",
      },
      // {
      //   'name': 'Activities',
      //   'submenu': false,
      //   'to': '/activities',
      //   'visible': true,
      //   'onclick': false,
      //   'icon': "icon_activities",
      // },
    ]
  };
  // navItemsForCognative['Management'] = {
  //   'name': 'Management',
  //   'submenu': true,
  //   'to': "/",
  //   'menu': [
  //     {
  //       'name': 'School year',
  //       'submenu': false,
  //       'to': '/modules-core/academic-year',
  //       'visible': !isInTrainingCenter,
  //       'onclick': false,
  //       'icon': "icon_school_year",
  //     },
  //     {
  //       'name': 'My Users',
  //       'submenu': false,
  //       'to': '/sentinel/myusers/users',
  //       'visible': F_hasPermissionTo("manage-user"),
  //       'onclick': false,
  //       'icon': "icon_users",
  //     },
  //     {
  //       'name': 'Subjects',
  //       'submenu': false,
  //       'to': '/modules-core/subjects',
  //       'visible': F_hasPermissionTo("create-subjects-and-chapters"),
  //       'onclick': false,
  //       'icon': "icon_subjects",
  //     },
  //     {
  //       'name': 'Classes',
  //       'submenu': false,
  //       'to': '/modules-core/classes',
  //       'visible': !isInTrainingCenter,
  //       'onclick': false,
  //       'icon': "icon_classes",
  //     },
  //     {
  //       'name': 'Grading scales',
  //       'submenu': false,
  //       'to': '/modules-core/grading-scales',
  //       'visible': true,
  //       'onclick': false,
  //       'icon': "icon_grading_scales",
  //     },

  //   ],
  //   'visible': true
  // };
  // navItemsForCognative['Library'] = {
  //   'name': 'Library',
  //   'submenu': true,
  //   'visible': !isInCognitiveCenter,
  //   'menu': [
  //     {
  //       'name': 'Explore',
  //       'submenu': false,
  //       'to': isInTrainingCenter ? "/explore-courses" : "/explore",
  //       'visible': true,
  //       'onclick': false,
  //       'icon': "icon_explore",
  //     },
  //     {
  //       'name': 'Create',
  //       'submenu': false,
  //       'to': '/create-content',
  //       'visible': true,
  //       'onclick': false,
  //       'icon': "icon_create",
  //     },
  //     {
  //       'name': 'My Library',
  //       'submenu': false,
  //       'to': '/my-library',
  //       'visible': true,
  //       'onclick': false,
  //       'icon': "icon_library",
  //     },
  //   ]
  // };

  const drawer = (
    <Box sx={{ textAlign: 'center' }}>
      <div className='header_top'>
        <div className='close_icon'>
          <IconButton className="arrowLeft" onClick={() => props.handle(false)}>
            <Close style={{ color: new_theme.palette.primary.PWhite, fontSize: '25px' }} />
          </IconButton>
        </div>
        <div className='logo_icon'>
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
          {/* <img src="/img/brand/mob_logo.png" /> */}
        </div>
      </div>

      <Divider />
      <List>
        {
          isInCognitiveCenter ?
            navItems.map((item) => (
              navItems[item].visible &&
              (navItems[item].submenu ?
                <NestedList name={item} menu={navItems[item].menu} />
                : <ListItem key={item} disablePadding className="list_item">
                  <ListItemButton sx={{ textAlign: 'center' }} className="list_item_button">
                    <ListItemText className="list_item_text" primary={item} onClick={() => {
                      navigate(navItems[item].to)
                    }} sx={{ fontWeight: 'bold', border: `1px solid ${new_theme.palette.newSupplementary.NSupText}` }} />

                  </ListItemButton>
                </ListItem>)
            )) : navItemsForCognative.map((item) => (
              navItemsForCognative[item].visible &&
              (navItemsForCognative[item].submenu ?
                <NestedList name={item} menu={navItemsForCognative[item].menu} />
                : <ListItem key={item} disablePadding className="list_item">
                  <ListItemButton sx={{ textAlign: 'center' }} className="list_item_button" onClick={() => {
                    navigate(navItemsForCognative[item].to)
                  }}>
                    <ListItemText className="list_item_text" primary={item} sx={{ fontWeight: 'bold', border: `1px solid ${new_theme.palette.newSupplementary.NSupText}` }} />
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

export default Modulemanager;