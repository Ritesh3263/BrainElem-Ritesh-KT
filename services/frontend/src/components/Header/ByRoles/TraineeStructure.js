import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMainContext } from "../../_ContextProviders/MainDataContextProvider/MainDataProvider"
import ContentService from "services/content.service";

const TraineeStructure = () =>{
  const current_url = window.location.href;
  const { t } = useTranslation([
    'translation', 
    'sentinel-MyTeams-Compare',
    'sentinel-MyUsers-BCTestRegistration',
    'sentinel-MyTeams-Results',
    'sentinel-MyTeams-Statistics',
    'sentinel-Admin-Credits'

  ]);
  const { myCurrentRoute, F_getHelper, F_handleSetShowLoader, F_showToastMessage, F_getErrorMessage, F_t } = useMainContext();
  const { user, userPermissions, isEdu } = F_getHelper();
  const permissions = F_getHelper().userPermissions;
  const isInTrainingCenter = F_getHelper().manageScopeIds.isTrainingCenter;
  const [show, setShow] = useState(false)
  useEffect(() => {
    F_handleSetShowLoader(true)
    ContentService.getBrainCoreTestResults().then(
        (response) => {
            if(response?.data?.length > 0){
              setShow(true)
            }
            F_handleSetShowLoader(false)
        },
        (error) => {
            let errorMessage = F_getErrorMessage(error)
            F_showToastMessage(errorMessage, 'error')
            F_handleSetShowLoader(false)
        }
    )
    }, []);
  var navItems = ['My Space', 'Learning', 'My Trainings'];

  navItems['My Space'] = {
    'name': t("common:MY SPACE"),
    'submenu': true,
    'to': (permissions.ms_myResults?.access ? "/myspace" : (permissions.ms_virtualCoach?.access ? "/virtualcoach" : "/myresources")),
    'icon': "icon_sessions",
    'onclick': true,
    'visible': (permissions.ms_myResults?.access || permissions.ms_virtualCoach?.access || permissions.ms_myResources?.access),
    'active': current_url.includes("myspace") || current_url.includes("virtualcoach") || current_url.includes("myresources") || current_url.includes("myprogress"),
    'menu': [
      {
        'name': t("mySpace-myResults:MY RESULTS"),
        'submenu': false,
        'to': '/myspace',
        'icon': "icon_sessions",
        'onclick': true,
        'visible': permissions.ms_myResults?.access
      },
      {
        'name': t("mySpace-virtualCoach:VIRTUAL COACH"),
        'submenu': false,
        'to': '/virtualcoach',
        'icon': "icon_programs",
        'onclick': true,
        'visible': show && permissions.ms_virtualCoach?.access
      },
      {
        'name': t("mySpace-myResources:MY RESOURCES"),
        'submenu': false,
        'to': '/myresources',
        'icon': "icon_users",
        'onclick': true,
        'visible': show && permissions.ms_myResources?.access
      }
    ],
  }
  navItems['Sessions'] = {
    'name': 'Sessions',
    'submenu': false,
    'to': "/sessions",
    'icon': "icon_programs",
    'onclick': true,
    'visible': user.moduleId === '200004000080000000000000' && userPermissions.bcTrainer.access
  }

  navItems['My Trainings']= {
    'name': F_t('My Trainings'),
    'submenu': true,
    'to': "/coaches",
    'icon': "icon_programs",
    'onclick': true,
    'visible': !isEdu && permissions.bcCoach.access,
    'active': current_url.includes("/coaches"),
    'menu': [
        {
          'name': t("BrainCore Coach"),
          'submenu': false,
          'to': "/coaches",
          'icon': "icon_sessions",
          'onclick': true,
          'visible': permissions.bcCoach?.access
        },
    ]
  }
  
  navItems['Learning'] = {
    'name': 'Learning',
    'submenu': true,
    'to': "/",
    'active':current_url.includes("schedule") || current_url.includes("my-courses") || current_url.includes("gradebooks-main") || current_url.includes("trainee-myCourses") || current_url.includes("traineeHomeworks"),
    'menu': [
      {
        'name': t("Schedule"),
        'submenu': false,
        'to': '/schedule',
        'icon': "icon_schedule",
        'onclick': true,
        'visible': true
      },
      {
        'name': t("My courses"),
        'submenu': false,
        'to': '/my-courses',
        'icon': "icon_myCourses",
        'onclick': true,
        'visible': true
      },
      {
        'name': t("My gradebook"),
        'submenu': false,
        'to': '/gradebooks-main',
        'icon': "icon_gradebook",
        'onclick': true,
        'visible': true
      },
      {
        'name': t("My program"),
        'submenu': false,
        'to': '/trainee-myCourses',
        'icon': "icon_programs",
        'onclick': true,
        'visible': true
      },
      {
        'name': t("Homeworks"),
        'submenu': false,
        'to': '/traineeHomeworks',
        'icon': "icon_homeworks",
        'onclick': true,
        'visible': true
      },
    ],
    'visible': !isInTrainingCenter
  }

  return navItems;
}
export default TraineeStructure;
