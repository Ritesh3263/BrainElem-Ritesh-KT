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

import NestedList from './NestedList';
import { useNavigate } from "react-router-dom";
import { Close } from "@mui/icons-material";
import { FaBullseye } from 'react-icons/fa';
import "./mobnav.scss";
import { new_theme } from 'NewMuiTheme';
import { useMainContext } from "../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import { useTranslation } from "react-i18next";
import Structure from '../Structure';

//Services
import commonService from 'services/common.service'

const Others = (props, handle) => {
  const { window } = props;
  const container = window !== undefined ? () => window().document.body : undefined;
  const result = Structure();
  
  const { t } = useTranslation([
    'translation', 
    'sentinel-MyTeams-Compare',
    'sentinel-MyUsers-BCTestRegistration',
    'sentinel-MyTeams-Results',
    'sentinel-MyTeams-Statistics',
    'sentinel-Admin-Credits'

  ]);
  const drawerWidth = 240;
  const { myCurrentRoute, F_getHelper, F_hasPermissionTo, F_collapseSidebarMobile, F_t } = useMainContext();
  const isInTrainingCenter = F_getHelper().manageScopeIds.isTrainingCenter;
  const isInCognitiveCenter = F_getHelper().user.isInCognitiveCenter;
  const navigate = useNavigate();
  const { user, userPermissions, isEdu } = F_getHelper();
  const permissions = F_getHelper().userPermissions;
  var navItems = ['Home', 'Admin', 'My Teams', 'My Projects', 'My Users', 'My Trainings', 'sentinel-Admin-Teams'];
  var navItemsForCognative = ['General', 'Management', 'Library'];

  // navItems['Home'] = {
  //   'name': t('Home'),
  //   'submenu': false,
  //   'to': "/sentinel/home",
  //   'visible': user.permissions.find(o => (o.moduleName == 'Home'))?.access,
  // };

  // navItems['Admin'] = {
  //   'name': t('Admin'),
  //   'submenu': true,
  //   'visible': (permissions.admin_auth.access || permissions.admin_teams.access),
  //   'menu': [
  //     // {
  //     //   'name': 'My Users​',
  //     //   'submenu': false,
  //     //   'to': 'new-modules-core/users',
  //     //   'icon': "icon_users",
  //     //   'onclick': true,
  //     //   'visible': user.permissions.find(o => o.moduleName === 'Users')?.access
  //     // },
  //     {
  //       'name': t('Authorization'),
  //       'submenu': false,
  //       'to': "/sentinel/admin/authorizations/",
  //       'icon': "icon_explore",
  //       'visible': userPermissions.admin_auth.access
  //     },
  //     {
  //       'name': F_t("sentinel-Admin-Teams:TEAM_ACESSES"),
  //       'submenu': false,
  //       'to': "/sentinel/admin/teams-access/",
  //       'icon': "icon_explore",
  //       'visible': userPermissions.admin_teams.access
  //     },
  //     {
  //       'name': t('sentinel-Admin-Credits:CREDITS'),
  //       'submenu': false,
  //       'to': "/sentinel/admin/credits/",
  //       'icon': "icon_explore",
  //       'visible': userPermissions.admin_credits.access
  //     },
  //   ],
  // };
  // navItems['My Teams'] = {
  //   'name': F_t("My Teams"),
  //   'submenu': true,
  //   'visible': user.permissions.find(o => (o.moduleName == 'My Teams - Teams' || o.moduleName == 'My Teams - BC Test Registrations' || o.moduleName == 'My Teams - BC Results for Team - NAD/QNAD' || o.moduleName == 'My Teams - BC Results for Team - interpersonal dimensions' || o.moduleName == 'My Teams - BC Results for Team - emotional intelligence' || o.moduleName == 'My Teams - BC Results for Team - cost/time report' || o.moduleName === 'My Teams - Results' || o.moduleName === 'My Teams - Statistics'))?.access,
  //   'menu': [
  //     {
  //       'name': F_t("Teams"),
  //       'submenu': false,
  //       'to': "/sentinel/myteams/teams/",
  //       'icon': "icon_create",
  //       'visible': permissions.mt_teams.access
  //     },
  //     {
  //       'name': t("sentinel-MyUsers-BCTestRegistration:BRAINCORE_TEST_REGISTRATION"),
  //       'submenu': false,
  //       'to': "/sentinel/myteams/BC-test-registrations/users",
  //       'icon': "icon_create",
  //       'visible': permissions.mt_bcTestReg.access
  //     },
  //     {
  //       'name': t("sentinel-MyTeams-Results:RESULTS"),
  //       'submenu': false,
  //       'to': "/sentinel/myteams/Results",
  //       'icon': "icon_create",
  //       'visible': permissions.mt_results.access
  //     },
  //     {
  //       'name': t("sentinel-MyTeams-Statistics:STATISTICS"),
  //       'submenu': false,
  //       'to': "/sentinel/myteams/Statistics",
  //       'icon': "icon_create",
  //       'visible': permissions.mt_statistics.access
  //     },
  //     // {
  //     //   'name': "sentinel-MyTeams-Compare:COMPARE_TEAMS",
  //     //   'submenu': false,
  //     //   'to': "/sentinel/myteams/Compare",
  //     //   'icon': "icon_create",
  //     //   'visible': permissions.mt_statistics.access && commonService.isDevelopment()
  //     // },
  //   ]
  // };
  // navItems['My Projects'] = {
  //   'name': t("My Projects"),
  //   'submenu': true,
  //   'visible': permissions.myProjects.access,
  //   'menu': [
  //     {
  //       'name': t("Automated Projects"),
  //       'submenu': false,
  //       'to': "/my-projects/interactive-cs/automated-projects-cs",
  //       'icon': "icon_create",
  //       'onclick': false,
  //       'visible': true,
  //     },
  //     // {
  //     //   'name': "Recruting",
  //     //   'submenu': false,
  //     //   'to': "/",
  //     //   'icon': "icon_create",
  //     //   'onclick': false,
  //     //   'visible': true,
  //     // },
  //     // {
  //     //   'name': "Custom projects",
  //     //   'submenu': false,
  //     //   'to': "/",
  //     //   'icon': "icon_create",
  //     //   'onclick': false,
  //     //   'visible': true,
  //     // },
  //     // {
  //     //   'name': "Employee management",
  //     //   'submenu': false,
  //     //   'to': "/",
  //     //   'icon': "icon_create",
  //     //   'onclick': false,
  //     //   'visible': true,
  //     // }
  //   ]
  // };
  // navItems['My Users'] = {
  //   'name': F_t("My Users"),
  //   'submenu': true,
  //   'visible': (permissions.mu_users.access || permissions.mu_bcTestReg.access),
  //   'menu': [
  //     {
  //       'name':t("Users"),
  //       'submenu': false,
  //       'to': "/sentinel/myusers/users",
  //       'icon': "icon_create",
  //       'onclick': false,
  //       'visible': permissions.mu_users.access
  //     },
  //     {
  //       'name': t("sentinel-MyUsers-BCTestRegistration:BRAINCORE_TEST_REGISTRATION"),
  //       'submenu': false,
  //       'to': "/sentinel/myusers/Braincoretestregistrations/users",
  //       'icon': "icon_create",
  //       'onclick': false,
  //       'visible': permissions.mu_bcTestReg.access
  //     },
  //   ]
  // };
  // navItems['My Trainings'] = {
  //   'name': F_t("My Trainings"),
  //   'submenu': true,
  //   'visible': !isEdu && permissions.bcTrainer.access,
  //   'menu': [
  //     {
  //       'name': t("BrainCore Trainer"),
  //       'submenu': false,
  //       'to': "/sessions",
  //       'icon': "icon_create",
  //       'onclick': false,
  //       'visible': !isEdu && permissions.bcTrainer.access
  //     }
  //   ]
  // };

  const drawer = (
    <Box sx={{ textAlign: 'center' }}>
      <div className='header_top'>
        <div className='close_icon'>
          <IconButton className="arrowLeft" onClick={() => props.handle(false)}>
            <Close style={{color: new_theme.palette.primary.PWhite, fontSize: '25px'}} />
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
            result[item]?.visible &&
              (result[item].submenu ?
              <NestedList name={result[item].name} menu={result[item].menu} handle={props.handle} />
              : <ListItem key={item} disablePadding className="list_item" >
                <ListItemButton sx={{ textAlign: 'center' }} className="list_item_button" onClick={() => {
                    navigate(result[item].to)
                  }}>
                  <ListItemText className="list_item_text" primary={item} sx={{fontWeight: 'bold', border: `1px solid ${new_theme.palette.newSupplementary.NSupText}`}} />

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
          onClose={() => props.handle(false)}
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

export default Others;