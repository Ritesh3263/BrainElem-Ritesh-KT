// import React from "react";
import { useTranslation } from "react-i18next";
import { useMainContext } from "../../_ContextProviders/MainDataContextProvider/MainDataProvider"

const Structure = () =>{
  const current_url = window.location.href;
  const { t } = useTranslation([
    'translation', 
    'sentinel-MyTeams-Compare',
    'sentinel-MyUsers-BCTestRegistration',
    'sentinel-MyTeams-Results',
    'sentinel-MyTeams-Statistics',
    'sentinel-Admin-Credits'

  ]);
  const { F_getHelper, F_t, F_hasPermissionTo } = useMainContext();
  const { user, userPermissions, isEdu } = F_getHelper();
  const permissions = F_getHelper().userPermissions;
  const isInTrainingCenter = F_getHelper().manageScopeIds.isTrainingCenter;
  const isInCognitiveCenter = F_getHelper().user.isInCognitiveCenter;
  var navItems = ['Home', 'Admin', 'My Teams', 'My Projects', 'My Users', 'My Trainings', 'General', 'Management', 'Catalogue', 'My Stuff', 'Library'];

  navItems['Home'] = {
    'name': t('Home'),
    'submenu': false,
    'to': "/sentinel/home",
    'visible': user.permissions.find(o => (o.moduleName == 'Home'))?.access && isInCognitiveCenter,
  };

  navItems['Admin'] = {
    'name': F_t('Admin'),
    'to': permissions.admin_auth?.access ? "/sentinel/admin/authorizations/" : (permissions.admin_teams.access ? "/sentinel/admin/teams-access/" : "/sentinel/admin/credits/"),
    'submenu': true,
    'visible': (permissions.admin_auth?.access || permissions.admin_teams.access || userPermissions?.admin_credits?.access) && isInCognitiveCenter,
    'active': current_url.includes("sentinel/admin/authorizations") || current_url.includes("teams-access") ||  current_url.includes("credits"),
    'menu': [
      {
        'name': t('Authorization'),
        'submenu': false,
        'to': "/sentinel/admin/authorizations/",
        'icon': "icon_explore",
        'visible': userPermissions?.admin_auth?.access,
      },
      {
        'name': F_t("sentinel-Admin-Teams:TEAM_ACESSES"),
        'submenu': false,
        'to': "/sentinel/admin/teams-access/",
        'icon': "icon_explore",
        'visible': userPermissions?.admin_teams?.access
      },
      {
        'name': t("sentinel-Admin-Credits:CREDITS"),
        'submenu': false,
        'to': "/sentinel/admin/credits/",
        'icon': "icon_explore",
        'visible': userPermissions?.admin_credits?.access
      }
    ],
  };

  navItems['My Teams'] = {
    'name': F_t("My Teams"),
    'to' : (permissions.mt_teams.access ? '/sentinel/myteams/teams' : (permissions.mt_bcTestReg.access ? '/sentinel/myteams/BC-test-registrations/users' : (permissions.mt_results.access ? '/sentinel/myteams/Results' : "/sentinel/myteams/Statistics"))),
    'submenu': true,
    'visible': (user.permissions.find(o => (o.moduleName == 'My Teams - Teams' || o.moduleName == 'My Teams - BC Test Registrations' || o.moduleName == 'My Teams - BC Results for Team - NAD/QNAD' || o.moduleName == 'My Teams - BC Results for Team - interpersonal dimensions' || o.moduleName == 'My Teams - BC Results for Team - emotional intelligence' || o.moduleName == 'My Teams - BC Results for Team - cost/time report' || o.moduleName === 'My Teams - Results' || o.moduleName === 'My Teams - Statistics'))?.access) && isInCognitiveCenter,
    'active': current_url.includes("/sentinel/myteams/teams") || current_url.includes("BC-test-registrations") || current_url.includes("Results") || current_url.includes("/sentinel/myteams/Statistics"),
    'menu': [
      {
        'name': F_t("Teams"),
        'submenu': false,
        'to': "/sentinel/myteams/teams",
        'icon': "icon_create",
        'visible': permissions.mt_teams.access
      },
      {
        'name': t("sentinel-MyUsers-BCTestRegistration:BRAINCORE_TEST_REGISTRATION"),
        'submenu': false,
        'to': "/sentinel/myteams/BC-test-registrations/users",
        'icon': "icon_create",
        'visible': permissions.mt_bcTestReg.access
      },
      {
        'name': t("sentinel-MyTeams-Results:RESULTS"),
        'submenu': false,
        'to': "/sentinel/myteams/Results",
        'icon': "icon_create",
        'visible': permissions.mt_results.access
      },
      {
        'name': t("sentinel-MyTeams-Statistics:STATISTICS"),
        'submenu': false,
        'to': "/sentinel/myteams/Statistics",
        'icon': "icon_create",
        'visible': permissions.mt_statistics.access
      },
      // {
      //   'name': "sentinel-MyTeams-Compare:COMPARE_TEAMS",
      //   'submenu': false,
      //   'to': "/sentinel/myteams/Compare",
      //   'icon': "icon_create",
      //   'visible': permissions.mt_statistics.access && commonService.isDevelopment()
      // },
    ]
  };

  navItems['My Projects'] = {
    'name': t("My Projects"),
    'to': "/my-projects/interactive-cs/automated-projects-cs",
    'submenu': true,
    'visible': permissions?.myProjects?.access && isInCognitiveCenter,
    'active': current_url.includes("interactive-cs") || current_url.includes("neuro-functions"),
    'menu': [
      {
        'name': t("Automated Projects"),
        'submenu': false,
        'to': "/my-projects/interactive-cs/automated-projects-cs",
        'icon': "icon_create",
        'onclick': false,
        'visible': true,
      },
    ]
  };

  navItems['My Users'] = {
    'name': F_t("My Users"),
    'submenu': true,
    'visible': (permissions?.mu_users?.access || permissions?.mu_bcTestReg?.access) && isInCognitiveCenter,
    'to': permissions?.mu_users?.access ? "/sentinel/myusers/users" : "/sentinel/myusers/Braincoretestregistrations/users",
    'active': current_url.includes("/sentinel/myusers/users") || current_url.includes("Braincoretestregistrations/users"),
    'menu': [
      {
        'name':t("Users"),
        'submenu': false,
        'to': "/sentinel/myusers/users",
        'icon': "icon_create",
        'onclick': false,
        'visible': permissions?.mu_users?.access
      },
      {
        'name': t("sentinel-MyUsers-BCTestRegistration:BRAINCORE_TEST_REGISTRATION"),
        'submenu': false,
        'to': "/sentinel/myusers/Braincoretestregistrations/users",
        'icon': "icon_create",
        'onclick': false,
        'visible': permissions?.mu_bcTestReg.access
      },
    ]
  };

  navItems['My Trainings'] = {
    'name': F_t("My Trainings"),
    'submenu': true,
    'visible': !isEdu && permissions.bcTrainer.access && isInCognitiveCenter,
    'to': "/sessions-free",
    'active': current_url.includes("/mytrainings") || current_url.includes("/sessions-free"),
    'menu': [
      {
        'name': t("BrainCore Trainer"),
        'submenu': false,
        'to': "/sessions-free",
        'icon': "icon_create",
        'onclick': false,
        'visible': !isEdu && permissions.bcTrainer.access
      }
    ]
  };

  navItems['General'] = {
    'name': F_t("General"),
    'submenu': true,
    'visible': !isInCognitiveCenter,
    'to': "/sentinel/home",
    'active': current_url.includes("sentinel/home") || current_url.includes("activities"),
    'menu': [
      {
        'name': t("Dashboard"),
        'submenu': false,
        'to': "/sentinel/home",
        'icon': "icon_create",
        'onclick': false,
        'visible': true
      },
      {
        'name': t("Activities"),
        'submenu': false,
        'to': "/activities",
        'icon': "icon_create",
        'onclick': false,
        'visible': true
      }
    ]
  };

  navItems['Management'] = {
    'name': F_t("Management"),
    'submenu': true,
    'visible': !isInCognitiveCenter,
    'to': "/sentinel/myusers/users",
    'active': current_url.includes("academic-year") || current_url.includes("sentinel/myusers/users") || current_url.includes("modules-core/subjects") || current_url.includes("modules-core/classes") || current_url.includes("grading-scales"),
    'menu': [
      {
        'name': t("School year"),
        'submenu': false,
        'to': "/modules-core/academic-year",
        'icon': "icon_create",
        'onclick': false,
        'visible': !isInTrainingCenter
      },
      {
        'name': F_t("My Users"),
        'submenu': false,
        'to': "/sentinel/myusers/users",
        'icon': "icon_create",
        'onclick': false,
        'visible': F_hasPermissionTo("manage-user")
      },
      {
        'name': t(isInTrainingCenter ? "Subjects/Categories" : "Subjects"),
        'submenu': false,
        'to': "/modules-core/subjects",
        'icon': "icon_create",
        'onclick': false,
        'visible': F_hasPermissionTo("create-subjects-and-chapters")
      },
      {
        'name': t("Classes"),
        'submenu': false,
        'to': "/modules-core/classes",
        'icon': "icon_create",
        'onclick': false,
        'visible': !isInTrainingCenter
      },
      {
        'name': t("Grading scales"),
        'submenu': false,
        'to': "/modules-core/grading-scales",
        'icon': "icon_create",
        'onclick': false,
        'visible': true
      },
    ]
  };

  navItems['Catalogue'] = {
    'name': F_t("Catalogue"),
    'submenu': true,
    'visible': isInTrainingCenter,
    'to': "/courses",
    'active': current_url.includes("courses") && current_url.includes("-") || current_url.includes("coursePath") || current_url.includes("internships") || current_url.includes("competenceBlocks") || current_url.includes("formats"),
    'menu': [
      {
        'name': t("Course"),
        'submenu': false,
        'to': "/courses",
        'icon': "icon_create",
        'onclick': false,
        'visible': F_hasPermissionTo("create-course")
      },
      {
        'name': t("Course path"),
        'submenu': false,
        'to': "/coursePath",
        'icon': "icon_create",
        'onclick': false,
        'visible': F_hasPermissionTo("create-course-path")
      },
      {
        'name': t("Internships"),
        'submenu': false,
        'to': "/internships",
        'icon': "icon_create",
        'onclick': false,
        'visible': F_hasPermissionTo("create-internship")
      },
      {
        'name': t("Certificate Templates"),
        'submenu': false,
        'to': "/certifications/competenceBlocks",
        'icon': "icon_create",
        'onclick': false,
        'visible':F_hasPermissionTo("create-competences")
      },
      {
        'name': t("Formats"),
        'submenu': false,
        'to': "/formats",
        'icon': "icon_create",
        'onclick': false,
        'visible': true
      },
    ]
  };

  navItems['My Stuff'] = {
    'name': t("My Stuff"),
    'submenu': true,
    'visible': isInTrainingCenter,
    'to': "/sessions-free",
    'active': current_url.includes("sessions-free") || current_url.includes("sessions") || current_url.includes("approve-verifications") || current_url.includes("enquires") || current_url.includes("partners"),
    'menu': [
      {
        'name': t("Sessions"),
        'submenu': false,
        'to': "/sessions-free",
        'icon': "icon_create",
        'onclick': false,
        'visible': F_hasPermissionTo("manage-session")
      },
      {
        'name': t("Sessions (BC)"),
        'submenu': false,
        'to': "/sessions",
        'icon': "icon_create",
        'onclick': false,
        'visible': F_hasPermissionTo("manage-session")
      },
      {
        'name': t("Approve Verifications"),
        'submenu': false,
        'to': "/approve-verifications",
        'icon': "icon_create",
        'onclick': false,
        'visible': F_hasPermissionTo("manage-session")
      },
      {
        'name': t("Enquires"),
        'submenu': false,
        'to': "/enquires",
        'icon': "icon_create",
        'onclick': false,
        'visible': F_hasPermissionTo("answer-to-inquiry")
      },
      {
        'name': t("Partners"),
        'submenu': false,
        'to': "/partners",
        'icon': "icon_create",
        'onclick': false,
        'visible': F_hasPermissionTo("create-company")
      },
    ]
  };

  navItems['Library'] = {
    'name': t("Library"),
    'to' : isInTrainingCenter ? "/explore-courses" : "/explore",
    'submenu': true,
    'visible': !isInCognitiveCenter,
    'active': current_url.includes("explore") || current_url.includes("create-content") || current_url.includes("my-library"),
    'menu': [
      {
        'name': t("Explore"),
        'submenu': false,
        'to': isInTrainingCenter ? "/explore-courses" : "/explore",
        'icon': "icon_create",
        'visible': true
      },
      {
        'name': t("Create"),
        'submenu': false,
        'to': "/create-content",
        'icon': "icon_create",
        'visible': true
      },
      {
        'name': t("My Library"),
        'submenu': false,
        'to': "/my-library",
        'icon': "icon_create",
        'visible': true
      }
    ]
  };

  return navItems;
}
export default Structure;
