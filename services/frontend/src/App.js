import "bootstrap/dist/css/bootstrap.min.css";
import React, { lazy, Suspense, useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./App.scss";

// Components
import ESwitchWithTooltip from "styled_components/SwitchWithTooltip";
import Loader from "components/Loader/Loader";
import Cookies from './components/common/Cookies'
import ChangePasswordModal from './components/modals/ChangePassword';
import Navigation from "components/Navigation/Navigation";



// Services
import CommonService from "./services/common.service"
import AuthService from "./services/auth.service";
import LogService from "./services/log.service";


import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
import { Container, ThemeProvider, Box, Typography } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { boardingActions } from "app/features/OnBoarding/data";
import Popup from "components/common/Popup"
import ConfirmModal from "components/common/ConfirmModal";
import Confirm from "components/common/Hooks/Confirm";
import { Dialog } from '@mui/material';
import { new_theme } from "NewMuiTheme";

import { theme } from "MuiTheme";
const palette = theme.palette
// for all roles
const Login = lazy(() => import("components/Login/Login"));

// CREDITS FOR MARKETING MANAGER
const Credits = lazy(() => import("components/Credits/Credits"))
const CreditsForModules = lazy(() => import("components/Credits/CreditsForModules"));

const ContentCreateContent = lazy(() => import("./components/Content/ContentFactory/CreateContent"));
const ContentDisplayContent = lazy(() => import("./components/Content/Display/DisplayContent"));
const ContentDisplayBrainCoreTest = lazy(() => import("./components/Content/Display/BrainCoreTest/DisplayBraincoreTest"));
const ContentDisplayBrainCoreTestThankYou = lazy(() => import("./components/Content/Display/BrainCoreTest/ThankYouPage"));
const Explore = lazy(() => import("./components/Explore/New/Explore"));
const StyledComponentsPreview = lazy(() => import("new_styled_components/Preview"));

const ContentFactory = lazy(() => import("./components/Content/ContentFactory/Welcome"));
const TestingRoute = lazy(() => import("./components/0TestingRoute/TestMainComponent"));
const Page404 = lazy(() => import("./components/Page404/Page404"));

const ProfileOverview = lazy(() => import("components/Profile/ProfileOverview"));
const ProfileSettings = lazy(() => import("components/Profile/ProfileSettings"));
const FolderSystem = lazy(() => import("components/Folders/FolderSystem"));

const MyLibrary = lazy(() => import("components/Library/MyLibrary/MyLibrary"));

const IndividualExaminationView = lazy(() => import("components/Trainer/Examinate/Individual/IndividualExaminationView"));
const GroupExaminationView = lazy(() => import("components/Trainer/Examinate/Group/GroupExaminationView"));
const GroupExaminationViewForQuestion = lazy(() => import("components/Trainer/Examinate/Group/GroupExaminationViewForQuestion"));

// Old gradebooks
const Gradebooks2 = lazy(() => import("components/Gradebooks/Trainer/Gradebooks2"));
const TraineeGradebook2 = lazy(() => import("components/Gradebooks/Trainee/TraineeGradebook2"));
const ParentGradebook = lazy(() => import("components/Gradebooks/Parent/ParentGradebook"));
const GradebookSubjectsAverage = lazy(() => import("components/Gradebooks/SubjectsAverage/GradebookSubjectsAverage"));

const InspectorGradebook = lazy(() => import("components/Gradebooks/Inspector/InspectorGradebook"));

const UserActivity = lazy(() => import("components/UserActivity/UserActivity"));
const Statistics = lazy(() => import("components/Statistics/Statistics"));
const Internships = lazy(() => import("components/TrainingModule/Internships/InternShipsList"));
const Courses = lazy(() => import("components/TrainingModule/Courses/CoursesList"));
const VerifyCertification = lazy(() => import("components/TrainingModule/Sessions/NSession/Certificate/Verify"));

// Load routes by Roles
const XRootRole = lazy(() => import("components/xRouteByRole/XRootRole"));
const XEcoManagerRole = lazy(() => import("components/xRouteByRole/XEcoManagerRole"));
const XNetworkManagerRole = lazy(() => import("components/xRouteByRole/XNetworkManagerRole"));
const XModuleManagerRole = lazy(() => import("components/xRouteByRole/XModuleManagerRole"));
const XLibrarianRole = lazy(() => import("components/xRouteByRole/XLibrarianRole"));
const XArchitectRole = lazy(() => import("components/xRouteByRole/XArchitectRole"));
const XTrainerRole = lazy(() => import("components/xRouteByRole/XTrainerRole"));
const XCloudManagerRole = lazy(() => import("components/xRouteByRole/XCloudManagerRole"));
const XTraineeRole = lazy(() => import("components/xRouteByRole/XTraineeRole"));
const XParentRole = lazy(() => import("components/xRouteByRole/XParentRole"));
const XPartnerRole = lazy(() => import("components/xRouteByRole/XPartnerRole"));
const XInspectorRole = lazy(() => import("components/xRouteByRole/XInspectorRole"));
const XCoordinatorRole = lazy(() => import("components/xRouteByRole/XCoordinatorRole"));
const ExploreCourses = lazy(() => import("components/Explore/ExploreSessions/ExploreSessions"));
const Orders = lazy(() => import("components/Orders/Orders"));
const ShoppingCart = lazy(() => import("components/ShoppingCart/Main"));
const CognitivePricing = lazy(() => import("components/CognitiveSpace/Payment/Pricing"));
const CognitiveConfirmation = lazy(() => import("components/CognitiveSpace/Payment/Confirmation"));
const XTrainingManagerRole = lazy(() => import("components/xRouteByRole/XTrainingManagerRole"));

const NewDashboard = lazy(() => import("components/common/DashboardWidgets/NewDashboard"));

const CognitiveSpace = lazy(() => import("components/CognitiveSpace/CognitiveSpace"));
const ResourceDetail = lazy(() => import("components/CognitiveSpace/MyResources/ResourceDetails"));

const XDynamicRole = lazy(() => import("components/xRouteByRole/XDynamicRole"));
const SessionsWithoutCompany = lazy(() => import("components/TrainingModule/Sessions/NSessionMainWithoutCompany"));
const useStyles = makeStyles(theme => ({
  mainContainer: {
    flexGrow: 1,
    zIndex:0,
    boxSizing: 'border-box',
    padding: '24px 32px 24px 32px',
    [theme.breakpoints.down('md')]: {
      padding: '24px 16px 24px 16px',
    }
  },
}))

const App = ({ width }) => {
const navigate = useNavigate();
  const { t, i18n } = useTranslation(['translation', 'validators']);
  const { isConfirmed } = Confirm();
  const classes = useStyles();
  const {
    F_getHelper, showLoader, F_refreshToken, F_updateScreenSize, F_reloadUser,
    collapseSidebarMobile, F_collapseSidebarMobile,
    sidebarState, F_showToastMessage, showConfirm, setShowConfirm, F_handleSidebarChange
  } = useMainContext();
  const [onboardingStage, setOnboardingStage] = useState(0);
  const [actionModal, setActionModal] = useState({ open: false, title: '', content: '', action: null, actionText: '' });
  const { user, manageScopeIds, fullUser, isEdu, setIsEdu } = F_getHelper();
  const { collapsed } = sidebarState;
  const [forceChangePassword, setForceChangePassword] = useState(false);
  const dispatch = useDispatch();

  const urlLocation = useLocation();
  const searchParams = new URLSearchParams(urlLocation?.search)


  useEffect(() => {
    if(localStorage.getItem('isWelcome') === 'true') {
      navigate('login')
    }
    const storageModified = (event) => {
      // Make sure this is not current tab - fix issues on Safari and IE
      // https://stackoverflow.com/questions/61269238/safari-fires-storageevent-in-same-tab
      if (!document.hasFocus() && document.hidden) {
        if (event.key === 'user') {
          if (JSON.parse(event.newValue)?.moduleId){// Only when module is set
            if (JSON.parse(event.newValue)?.moduleId !== JSON.parse(event.oldValue)?.moduleId) F_reloadUser(true);
            else if (JSON.parse(event.newValue)?.id !== JSON.parse(event.oldValue)?.id) F_reloadUser(true);
            else if (JSON.parse(event.newValue)?.role !== JSON.parse(event.oldValue)?.role) F_reloadUser(true);
          }
        } else if (!event.key) {// localstorage was cleared
          F_reloadUser(true);
        }
      }
    }
    window.addEventListener("storage", (event) => { storageModified(event) }, false);

    LogService.trackUser(
      function (time, awayTime, inactiveTime, awayCount, inactiveCount) {
        // If user logged in log the activity to database

        let info = {
          appCodeName: window.navigator.appCodeName,
          appName: window.navigator.appName,
          appVersion: window.navigator.appVersion,
          geolocation: window.navigator.geolocation,
          platform: window.navigator.platform,
          connection: window.navigator.connection,
          userAgent: window.navigator.userAgent,
          userAgentData: window.navigator.userAgentData,
          language: window.navigator.language,
          languages: window.navigator.languages,
          cookieEnabled: window.navigator.cookieEnabled,
          doNotTrack: window.navigator.doNotTrack,
          hardwareConcurrency: window.navigator.hardwareConcurrency,
          maxTouchPoints: window.navigator.maxTouchPoints,
          product: window.navigator.product,
          productSub: window.navigator.productSub,
          vendor: window.navigator.vendor,
          vendorSub: window.navigator.vendorSub,
          screen: window.screen,
          visualViewport: window.visualViewport,
        }
        if (AuthService.getCurrentUser()) {
          LogService.logTime({ time, awayTime, inactiveTime, awayCount, inactiveCount, info });
        }
      }
      , 30 // run every x seconds
      , false
    );

    F_refreshToken();
    setForceChangePassword(AuthService.getForceChangePassword());
    F_updateScreenSize(width);

    return () => {
      console.log("storage - removeEventListener")
      window.removeEventListener("storage", storageModified);
    }
  }, []);

  useEffect(() => {
    F_updateScreenSize(width);
    if (collapseSidebarMobile && isWidthUp('md', width)) {
      F_collapseSidebarMobile();
    }
    if (!collapseSidebarMobile && !isWidthUp('md', width)) {
      F_collapseSidebarMobile();
      if (collapsed) {
        F_handleSidebarChange("COLLAPSE");
      }
    }
  }, [width]);

  useEffect(() => {
    if (user) {
      // When accessing platform via token from email
      // if user is already logged in we need to logout and reload page
      let access_token = searchParams.get('token');
      if (access_token){
        AuthService.logout()
        window.location.reload();
      }
    }
  }, [user])

  useEffect(() => {
    AuthService.setForceChangePassword(forceChangePassword)
  }, [forceChangePassword]);

  const finishTutorial = async (force = false) => {
    if (force && !await isConfirmed(t('Are you sure you want to abort/finish the tutorial?'))) return;

    setOnboardingStage(null);
    LogService.finishTutorial().then((res) => {
      F_showToastMessage(t(res.data.message), 'success');
    }).catch((err) => {
      F_showToastMessage(t(err.response.data.message), 'error');
    });
  }
  return (
    <ThemeProvider theme={new_theme}>
    <div className="app">
      {CommonService.isDevelopment() && <div style={{fontWeight: 'bold', borderRadius: '10px', background: new_theme.palette.primary.PWhite, zIndex: 10000, position: 'fixed', bottom: 1, right: 1}}>
        <ESwitchWithTooltip
          checked={isEdu} 
          onChange={() => setIsEdu(p => !p)}
          name={"EDU"}
          fontSize="16px">  
        </ESwitchWithTooltip>
      </div>}
      

      {Boolean(F_getHelper().user) && (<>

        {/* {!fullUser?.settings.hideTutorial && (<>
            {onboardingStage === 0 && <Popup 
              type="suggestion"
              title={t("Welcome to ELiA! part 1 of 3")}
              showTitleBorder={true}
              ameliaAnimation={true}
              abortCall={()=>{finishTutorial(true)}}
              absolutePosition={true}
              text={t(`Welcome to ELiA Mx ${user.name+' '+user.surname}! We are happy to have you on board. We will guide you through the first steps of your journey with ELiA. Let's get started!`)}
              cancelButtonText={t("Okay, let's go!")}
              cancelCallback={() => setOnboardingStage(1)}
            />}
            {onboardingStage === 1 && <Popup 
              type="onboarding"
              title={t("Welcome to ELiA! part 2 of 3")}
              showTitleBorder={true}
              ameliaAnimation={true}
              absolutePosition={true}
              abortCall={()=>{finishTutorial(true)}}
              shadowType='medium'
              text={t("You are now in the dashboard. Here you can see all the information you need to know about the system. You can also see the latest statistics on the dashboard.")}
              confirmButtonText={t("Next")}
              confirmCallback={()=>setOnboardingStage(2)}
              cancelButtonText={t("See Previous")}
              cancelCallback={() => setOnboardingStage(0)}
            />}
            {onboardingStage === 2 && <Popup
              type="onboarding"
              title={t("Welcome to ELiA! part 3 of 3")}
              showTitleBorder={true}
              showAmeliaInside={true}
              absolutePosition={true}
              shadowType='short'
              text={t("You managed to finish the tutorial! Enjoy!")}
              confirmButtonText={t("Finish")}
              confirmCallback={finishTutorial}
              cancelButtonText={t("See Previous")}
              cancelCallback={() => setOnboardingStage(1)}
            />}
          </>)} */}
      </>
      )}
      <div style={{ overflowX: "hidden" }} className="d-flex flex-column flex-fill flex-grow-1"
        onClick={() => { if (!collapseSidebarMobile && !isWidthUp('md', width)) { F_collapseSidebarMobile() } }}>
        {showLoader && (<Loader />)}

        <Suspense fallback={<Loader />}>
          {(F_getHelper().user === undefined) ?
            (<Routes>
              <Route path="/" element={<Login setForceChangePassword={setForceChangePassword} />} />
              <Route path="/login" element={<Login setForceChangePassword={setForceChangePassword} />} />
              {/* CREDITS FOR MARKETING MANAGER */}
              <Route path="/credits/:moduleId" element={<Credits isMarketingManager={true}/>} />
              <Route path="/credits/all" element={<CreditsForModules />} />
              {CommonService.isDevelopment() && <Route path="/components/preview" element={<StyledComponentsPreview/>} />}
              <Route path="/store" element={<ExploreCourses />} />
              <Route path="/certifications/verify/:certificationId" element={<VerifyCertification externalUser={true} />} />
              <Route path="/braincore/test" element={<ContentDisplayBrainCoreTest/>} />
              <Route path="/braincore/test/done" element={<ContentDisplayBrainCoreTestThankYou/>} />

              <Route path="*" element={<Navigate to="/" replace={true} />} />
            </Routes>) : (
              <>
                <Navigation />
                {(F_getHelper().user === null) ? (
                  <Loader />
                ) : (
                  // <div className="" style={{ paddingBottom: '1.5rem'}}>
                  <>
                  <Container component="main" maxWidth='xl' disableGutters={true} className={classes.mainContainer} sx={{mb: 0}}>
                    <Routes>
                      {/*For all*/}
                      {manageScopeIds.isTrainingCenter ? (
                        <Route path="/" element={<CognitiveSpace />} />
                      ) : (
                        <Route path="/" element={<NewDashboard />} />
                      )}
                      <Route path="/404" element={<Page404 />} />
                      <Route path="/test" element={<TestingRoute />} />
                      <Route path="/folder-system" element={<FolderSystem />} />
                      <Route path="/my-library" element={<MyLibrary />} />
                      <Route path="/profile-overview" element={<ProfileOverview />} />
                      <Route path="/profile-settings" element={<ProfileSettings />} />
                      <Route path="/profile-settings/:openParam" element={<ProfileSettings />} />


                      {manageScopeIds.isTrainingCenter ? (
                        <>
                          <Route path="/explore-courses/:searchQuery" element={<ExploreCourses />} />
                          <Route path="/explore-courses" element={<ExploreCourses />} />
                        </>
                      ) : (
                        <>
                          <Route path="/explore" element={<Explore />} />
                          <Route path="/explore/:query" element={<Explore />} />
                        </>
                      )}
                      <Route path="/login" element={<Login setForceChangePassword={setForceChangePassword} isLoggedIn={true} />} />
                      {/* CREDITS FOR MARKETING MANAGER */}
                      <Route path="/credits/:moduleId" element={<Credits isMarketingManager={true}/>} />
                      <Route path="/credits/all" element={<CreditsForModules />} />
                      {CommonService.isDevelopment() && <Route path="/components/preview" element={<StyledComponentsPreview/>} />}
                      <Route path="/certifications/verify/:certificationId" element={<VerifyCertification />} />
                      {/* CONTENT CREATE*/}
                      <Route path="/create-content" element={<ContentFactory />} />
                      {/* CONTENT EDIT*/}
                      <Route path="/edit-content/:contentId" element={<ContentFactory />} />
                      {/* OLD CONTENT EDIT - to be replaced by /edit-content/: */}
                      <Route path="/edit-test/:contentId" element={<ContentFactory />} />
                      <Route path="/edit-presentation/:contentId" element={<ContentFactory />} />
                      <Route path="/edit-asset/:contentId" element={<ContentFactory />} />
                      {/* CONTENT DISPLAY */}
                      <Route path="/content/display/:contentId" element={<ContentDisplayContent />} />
                      <Route path="/braincore/test" element={<ContentDisplayBrainCoreTest/>} />
                      <Route path="/content/preview/:contentId" element={<ContentDisplayContent isPreview={user?.role !== 'Trainee'} />} />
                      <Route path="/event/:eventId/content/display" element={<ContentDisplayContent />} />
                      <Route path="/event/:eventId/content/preview" element={<ContentDisplayContent isPreview={user?.role !== 'Trainee'} />} />
                      {/* CONTENT RESULTS */}
                      <Route path="/results/:userId/:contentId" element={<IndividualExaminationView />} />
                      <Route path="/results/event/:eventId/:userId" element={<IndividualExaminationView />} />
                      <Route path="/result/latest/:userId/:contentId" element={<IndividualExaminationView />} />
                      <Route path="/examinate/content/:contentId/all" element={<GroupExaminationView />} />
                      <Route path="/examinate/content/:contentId/all/questions" element={<GroupExaminationViewForQuestion />} />
                      <Route path="/examinate/content/:contentId/:userId" element={<IndividualExaminationView trainerMode={true} />} />

                      <Route path="/orders" element={<Orders />} />
                      <Route path="/shopping-cart" element={<ShoppingCart />} />
                      <Route path="/myspace" element={<CognitiveSpace />} />
                      <Route path="/coaches" element={<SessionsWithoutCompany/>}/>
                      <Route path="/coaches/:sessionId" element={<SessionsWithoutCompany/>}/>
                      <Route path="/cognitive-pricing" element={<CognitivePricing />} />
                      <Route path="/cognitive-confirmation" element={<CognitiveConfirmation />} />
                      <Route path="/resource-detals/:Id" element={<ResourceDetail />} />
                      <Route path="/sentinel/home" element={<NewDashboard />} />
                      {/*For all*/}



                      {/*Change name from internships to courses, the same route - what is this?*/}
                      <Route path="/internships" element={<Internships />} />

                      {/*Old gradebook route [trainee, trainer] - to remove?*/}
                      <Route path="/gradebooks2" element={<Gradebooks2 />} />
                      <Route path="/gradebook-subjects-average" element={<GradebookSubjectsAverage />} />
                      <Route path="/parentGradebook" element={<ParentGradebook />} />
                      <Route path="/inspectorGradebook" element={<InspectorGradebook />} />
                      <Route path="/traineeGradebook2" element={<TraineeGradebook2 />} />

                      {/*Is using?*/}
                      <Route path="/program/:programId/edit-test/:contentId" element={<ContentCreateContent contentType="TEST" />} />
                      <Route path="/program/:programId/edit-presentation/:contentId" element={<ContentCreateContent contentType="PRESENTATION" />} />
                      {/*----------------------------------------------*/}

                      {/*Not using right now - to remove or build?*/}
                      <Route path="/user-activity" element={<UserActivity />} />
                      <Route path="/statistics" element={<Statistics />} />
                      {/*----------------------------------------------*/}
                    </Routes>

                    {/** Root **/}
                    {user?.role === 'Root' && (<XRootRole />)}
                    {/** EcoManager **/}
                    {user?.role === 'EcoManager' && (<XEcoManagerRole />)}
                    {/** NetworkManager **/}
                    {user?.role === 'NetworkManager' && (<XNetworkManagerRole />)}
                    {/** ModuleManager **/}
                    {(user?.role === 'ModuleManager' || user?.role === 'Assistant') && (<XDynamicRole />)}
                    {/** CloudManager **/}
                    {user?.role === 'CloudManager' && (<XCloudManagerRole />)}
                    {/** Librarian **/}
                    {user?.role === 'Librarian' && (<XLibrarianRole />)}
                    {/** Architect **/}
                    {user?.role === 'Architect' && (<XArchitectRole />)}
                    {/** Trainer **/}
                    {user?.role === 'Trainer' && (<XTrainerRole isTrainingCenter={manageScopeIds.isTrainingCenter} />)}
                    {/** Trainee **/}
                    {user?.role === 'Trainee' && (<XTraineeRole isTrainingCenter={manageScopeIds.isTrainingCenter} />)}
                    {/** Parent **/}
                    {user?.role === 'Parent' && (<XParentRole isTrainingCenter={manageScopeIds.isTrainingCenter} />)}
                    {/** Inspector **/}
                    {user?.role === 'Inspector' && (<XInspectorRole />)}
                    {/** Coordinator **/}
                    {user?.role === 'Coordinator' && (<XCoordinatorRole />)}
                    {/** TrainingManager **/}
                    {user?.role === 'TrainingManager' && (<XTrainingManagerRole />)}
                    {/** Partner **/}
                    {user?.role === 'Partner' && (<XPartnerRole />)}
                    {/** Other - Sentinel  **/}
                    {user?.role === 'Other' && (<XDynamicRole />)}

                  </Container>
                  <Box sx={{borderTop: `1px solid ${new_theme.palette.newSecondary.NSIconBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '48px'}}>
                    <Typography variant="body4" component="span">{t('common:POWERED_BY')}  <span style={{color: new_theme.palette.primary.MedPurple}}>{t('common:FOOTER_BRAINELEM')}</span> ® {new Date().getFullYear()}</Typography>
                  </Box>
                  </>
                  // </div>
                )}
              </>
            )}
        </Suspense>
      </div>
      {(F_getHelper().user !== undefined) && <ChangePasswordModal
        show={forceChangePassword}
        onHide={() => setForceChangePassword(false)}
        forceChangePassword={true}
      />}
      
      <Cookies></Cookies>

      <ConfirmModal />
    </div>
    </ThemeProvider>
  );
};
export default withWidth()(App);