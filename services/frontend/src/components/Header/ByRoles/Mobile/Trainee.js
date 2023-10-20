import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// MUI v5
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Close } from "@mui/icons-material";

// Custom components
import NestedList from './NestedList';

// CSS
import "./mobnav.scss";

// Theme
import { new_theme } from 'NewMuiTheme';
import TraineeStructure from '../TraineeStructure';
import { useMainContext } from 'components/_ContextProviders/MainDataContextProvider/MainDataProvider';
const Trainee = (props) => {

  const { window } = props;
  const container = window !== undefined ? () => window().document.body : undefined;

  const drawerWidth = 240;
  const { F_getHelper } = useMainContext();
  const isInTrainingCenter = F_getHelper().manageScopeIds.isTrainingCenter;
  const isInCognitiveCenter = F_getHelper().user.isInCognitiveCenter;
  const navigate = useNavigate();
  const result = TraineeStructure();
  // var navItems = ['My Space', 'Sessions', 'My Trainings'];
 

  // navItems['My Space'] = {
  //   'name': t("common:MY SPACE"),
  //   'submenu': true,
  //   'to': "/myspace",
  //   'icon': "icon_sessions",
  //   'onclick': true,
  //   'visible': true,
  //   'menu': [
  //     {
  //       'name': t("mySpace-myResults:MY RESULTS"),
  //       'submenu': false,
  //       'to': '/myspace',
  //       'icon': "icon_sessions",
  //       'onclick': true,
  //       'visible': true
  //     },
  //     {

  //       'name': t("mySpace-virtualCoach:VIRTUAL COACH"),
  //       'submenu': false,
  //       'to': '/virtualcoach',
  //       'icon': "icon_programs",
  //       'onclick': true,
  //       'visible': show ? true : false
  //     },
  //     {
  //       'name': t("mySpace-myResources:MY RESOURCES"),
  //       'submenu': false,
  //       'to': '/myresources',
  //       'icon': "icon_users",
  //       'onclick': true,
  //       'visible': true
  //     }
  //   ],
  // }
  // navItems['Sessions'] = {
  //   'name': 'Sessions',
  //   'submenu': false,
  //   'to': "/sessions",
  //   'icon': "icon_programs",
  //   'onclick': true,
  //   'visible': user.moduleId === '200004000080000000000000' && userPermissions.bcTrainer.access
  // }

  // navItems['My Trainings']= {
  //   'name': F_t('My Trainings'),
  //   'submenu': false,
  //   'to': "/training-my-courses",
  //   'icon': "icon_users",
  //   'onclick': true,
  //   'visible': !isEdu && userPermissions.bcCoach.access
  // }
  // navItems['Session setup'] = {
  //   'name': 'Session setup',
  //   'submenu': true,
  //   'to': "/create-content",
  //   'menu': [
  //     {
  //       'name': 'Sessions',
  //       'submenu': false,
  //       'to': '/training-my-courses',
  //       'icon': "icon_sessions",
  //       'onclick': true,
  //       'visible': true
  //     }
  //   ],
  //   'visible': isInTrainingCenter
  // }
  // navItems['Library'] = {
  //   'name': 'Library',
  //   'submenu': true,
  //   'to': "/",
  //   'menu': [
  //     {
  //       'name': 'Explore',
  //       'submenu': false,
  //       'to': isInTrainingCenter ? "/explore-courses" : "/explore",
  //       'icon': "icon_explore",
  //       'onclick': true,
  //       'visible': true
  //     },
  //     {
  //       'name': 'Create',
  //       'submenu': false,
  //       'to': '/create-content',
  //       'icon': "icon_create",
  //       'onclick': true,
  //       'visible': true
  //     },
  //     {
  //       'name': 'My Library',
  //       'submenu': false,
  //       'to': '/my-library',
  //       'icon': "icon_library",
  //       'onclick': true,
  //       'visible': true
  //     },
  //   ],
  //   'visible': true
  // }
  // navItems['Learning'] = {
  //   'name': 'Learning',
  //   'submenu': true,
  //   'to': "/",
  //   'menu': [
  //     {
  //       'name': 'Schedule',
  //       'submenu': false,
  //       'to': '/schedule',
  //       'icon': "icon_schedule",
  //       'onclick': true,
  //       'visible': true
  //     },
  //     {
  //       'name': 'My courses',
  //       'submenu': false,
  //       'to': '/my-courses',
  //       'icon': "icon_myCourses",
  //       'onclick': true,
  //       'visible': true
  //     },
  //     {
  //       'name': 'My gradebook',
  //       'submenu': false,
  //       'to': '/gradebooks-main',
  //       'icon': "icon_gradebook",
  //       'onclick': true,
  //       'visible': true
  //     },
  //     {
  //       'name': 'My program',
  //       'submenu': false,
  //       'to': '/trainee-myCourses',
  //       'icon': "icon_programs",
  //       'onclick': true,
  //       'visible': true
  //     },
  //     {
  //       'name': 'Homeworks',
  //       'submenu': false,
  //       'to': '/traineeHomeworks',
  //       'icon': "icon_homeworks",
  //       'onclick': true,
  //       'visible': true
  //     },
  //   ],
  //   'visible': !isInTrainingCenter
  // }

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
          result.map((item) => (
            result[item].visible &&
             ( result[item].submenu ?
              <NestedList name={result[item].name} menu={result[item].menu} />
              : <ListItem key={item} disablePadding className="list_item">
                <ListItemButton sx={{ textAlign: 'center' }} className="list_item_button">
                  <ListItemText className="list_item_text" primary={result[item].name} onClick={() => {
                    navigate(result[item].to)
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

export default Trainee;