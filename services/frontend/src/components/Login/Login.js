import * as React from 'react';
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
import { Typography, Grid, TextField } from '@mui/material';
import { Link, useNavigate, useParams, useLocation, useSearchParams } from "react-router-dom";
import { now } from "moment";
import { useTranslation } from "react-i18next";
import { FormControl, Box } from '@mui/material';
import { ETextField } from "new_styled_components";
import IconButton from "@material-ui/core/IconButton";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Visibility from "@material-ui/icons/Visibility";
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from "react";
import { useMainContext } from "../_ContextProviders/MainDataContextProvider/MainDataProvider";
import FormHelperText from "@material-ui/core/FormHelperText";
import ESwitch from 'new_styled_components/Switch/Switch.styled';
import ModuleSelectionModal from "./ModuleSelectionModal";
import ModuleTypeSwitchModal from "./ModuleTypeSwitchModal";
import ResetPasswordModal from "./ResetPasswordModal";
import RegisterForm from "./UserRegister/RegisterForm";
import { Container } from '@mui/material';
import styles from './login.module.scss';
import WelcomePage from "components/WelcomePage/WelcomePage";
import { new_theme } from 'NewMuiTheme';
import StyledButton from 'new_styled_components/Button/Button.styled';
import { ThemeProvider } from '@mui/material';

//Services
import AuthService from "../../services/auth.service";
import ResultService from "../../services/result.service";
import CommonService from "../../services/common.service";
import { useAuth0 } from '@auth0/auth0-react';

const Login = ({ width, setForceChangePassword, isLoggedIn = false }) => {
  const { t } = useTranslation(['login-welcome-registration', 'common']);
  // ([^a-zA-Z0-9])t\("(.*?)"\)
  // $1t("login-welcome-registration:\U$2")
  const navigate = useNavigate();
  const urlLocation = useLocation();
  const {loginWithRedirect} = useAuth0();

  const [searchParams, setSearchParams] = useSearchParams();
  const {
    F_getHelper,
    F_selectRole,
    F_reloadUser,
    F_gotoDefaultView,
    F_getErrorMessage,
    F_showToastMessage,
    asyncLocalStorage,
  } = useMainContext();

  const { user, userPermissions: r } = F_getHelper();
  const [tcRoles] = useState(['Root', 'EcoManager', 'CloudManager', 'NetworkManager', 'ModuleManager', "Trainer", "Trainee", "Librarian", "Inspector", "Assistant", 'Coordinator', 'TrainingManager', 'Partner', 'Other']);
  const [schoolRoles] = useState(['Root', 'EcoManager', 'CloudManager', 'NetworkManager', 'ModuleManager', "Trainer", "Trainee", "Librarian", "Inspector", "Architect", "Parent"]);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loadingButton, setLoadingButton] = useState(false);
  const [loginValidator, setLoginValidator] = useState(false);
  const [isOpenResetPasswordModal, setIsOpenResetPasswordModal] = useState(false);
  const [isRegistration, setIsRegistration] = useState(false);
  const [isWelcome, setIsWelcome] = useState(false);
  const [loginUser, setLoginUser] = useState({});

  // ModuleSelectionModal
  const [moduleSelection, setModuleSelection] = useState({ open: false, center: null, modules: [] });
  // ModuleTypeSwitchModal
  const [isOpenModuleTypeSwitchModal, setIsOpenModuleTypeSwitchModal] = useState(false)
  const [availableModule, setAvailableModule] = useState({ school: 0, training: 0, cognitive: 0 });

  // ################################################################################################################################
  // ################################################################################################################################
  // Log into school module
  const loginForSchool = (data) => {
    console.log("loginForSchool", data);
    let schoolModules = data.modules?.filter(x => x.moduleType === "SCHOOL")
    let trainingModules = data.modules?.filter(x => x.moduleType === "TRAINING")
    let cognitiveModules = data.modules.filter(x => x.moduleType === "COGNITIVE")

    let access_token = searchParams.get('token');
    searchParams.delete('token');
    setSearchParams(searchParams);
    let resetPassword = searchParams.get('resetPassword');
    let confirmEmail = searchParams.get('confirmEmail');

    let shouldSelectModule = !['Root', 'EcoManager', 'CloudManager', 'NetworkManager'].includes(data.role)

    if (shouldSelectModule && schoolModules?.length > 1) setModuleSelection({ open: true, center: "SCHOOL", modules: schoolModules });
    else if (shouldSelectModule && schoolModules?.length === 1) {
      AuthService.addModuleToScopes(schoolModules[0]._id);
      AuthService.refreshToken(access_token, schoolModules[0]._id).then(
        async (res) => {

          if (resetPassword) setForceChangePassword(true); // Inform App component
          if (confirmEmail) await AuthService.confirmEmail();

          // Set user in localstorage
          await asyncLocalStorage.setItem("user", JSON.stringify({ ...res.data, moduleId: schoolModules[0]._id }))

          if (!tcRoles.includes(data.role)) {
            let xRole = data.availableRoles.includes("Trainer") ? "Trainer" : data.availableRoles[0]
            F_selectRole(xRole)
            F_gotoDefaultView(xRole, true); // Go to default view
          } else {
            F_reloadUser(); // Set user in maindataprovider
            F_gotoDefaultView(data.role, true); // Go to default view
          }
          localStorage.setItem('isWelcome', false);
        },
        (error) => {
          F_showToastMessage(t("common:COULD NOT REFRESH THE TOKEN"), "error");
          setLoadingButton(false);
        }
      );

    } else if (trainingModules?.length){ //Logging for trainig-center but has no modules - redirect to school
      console.log('Logging for school-center but has no modules - redirect to training-center')
      F_showToastMessage(t("login-welcome-registration:REDIRECTING TO")+" "+t("common:TRAINING CENTER"), "info");
      loginForTraining(data)
    }
    else {
      // No modules 
      F_showToastMessage(t("login-welcome-registration:COULD NOT FIND ANY ACTIVE MODULE"), "error");
      AuthService.logout()
      setLoadingButton(false);
      throw Error("Could not find any active module.")
    }


  }


  // ################################################################################################################################
  // ################################################################################################################################
  // Log into training module
  const loginForTraining = (data) => {
    let schoolModules = data.modules?.filter(x => x.moduleType === "SCHOOL")
    let trainingModules = data.modules?.filter(x => x.moduleType === "TRAINING")
    let cognitiveModules = data.modules?.filter(x => x.moduleType === "COGNITIVE")

    let access_token = searchParams.get('token');
    searchParams.delete('token');
    setSearchParams(searchParams);
    let resetPassword = searchParams.get('resetPassword');
    let confirmEmail = searchParams.get('confirmEmail');

    let shouldSelectModule = !['Root', 'EcoManager', 'CloudManager', 'NetworkManager'].includes(data.role)

    if (shouldSelectModule && trainingModules?.length > 1) setModuleSelection({ open: true, center: "TRAINING", modules: trainingModules });
    else if (shouldSelectModule && trainingModules?.length === 1) {
      AuthService.addModuleToScopes(trainingModules[0]._id);
      AuthService.refreshToken(access_token, trainingModules[0]._id).then(
        async (res) => {

          if (resetPassword) setForceChangePassword(true); // Inform App component
          if (confirmEmail) await AuthService.confirmEmail();

          // Set user in localstorage
          await asyncLocalStorage.setItem("user", JSON.stringify({ ...res.data, moduleId: trainingModules[0]._id }))

          if (!tcRoles.includes(data.role)) {
            let xRole = data.availableRoles.includes("Trainer") ? "Trainer" : data.availableRoles[0]
            F_selectRole(xRole)
            F_gotoDefaultView(xRole, true); // Go to default view
          } else {
            F_reloadUser(); // Set user in maindataprovider
            // F_gotoDefaultView(data.role, true)
            F_gotoDefaultView(res.data.role, true); // Go to default view
          }
          localStorage.setItem('isWelcome', false);
        },
        (error) => {
          F_showToastMessage(t("common:COULD NOT REFRESH THE TOKEN"), "error");
          setLoadingButton(false);
        }
      );


    } else if (schoolModules?.length) {// Logging for trainig-center but has no modules - redirect to school
      F_showToastMessage(t("login-welcome-registration:REDIRECTING TO")+" "+t("login-welcome-registration:SCHOOL MODULE"), "info");
      console.log('Logging for trainig-center but has no modules - redirect to school')
      loginForSchool(data)
    }
    else {
      // No modules 
      F_showToastMessage(t("login-welcome-registration:COULD NOT FIND ANY ACTIVE MODULE"), "error");
      AuthService.logout()
      setLoadingButton(false);
      throw Error("Could not find any active module.")
    }
  }

  //==========>  Log into cognetive module
  const loginForCognetive = (data) => {
    // let schoolModules = data.modules?.filter(x => x.moduleType === "SCHOOL")
    // let trainingModules = data.modules?.filter(x => x.moduleType === "TRAINING")
    let cognitiveModules = data.modules.filter(x => x.moduleType === "COGNITIVE")
    console.log("------------", data)

    let access_token = searchParams.get('token');
    searchParams.delete('token');
    setSearchParams(searchParams);
    let resetPassword = searchParams.get('resetPassword');
    let confirmEmail = searchParams.get('confirmEmail');

    let shouldSelectModule = !['Root', 'EcoManager', 'CloudManager', 'NetworkManager'].includes(data.role)

    if (shouldSelectModule && cognitiveModules?.length > 1) setModuleSelection({ open: true, center: "COGNITIVE", modules: cognitiveModules });
    else if (shouldSelectModule && cognitiveModules?.length === 1) {
      AuthService.addModuleToScopes(cognitiveModules[0]._id);
      AuthService.refreshToken(access_token, cognitiveModules[0]._id).then(
        async (res) => {

          if (resetPassword) setForceChangePassword(true); // Inform App component
          if (confirmEmail) await AuthService.confirmEmail();

          // Set user in localstorage
          await asyncLocalStorage.setItem("user", JSON.stringify({ ...res.data, moduleId: cognitiveModules[0]._id }))

          // if (!tcRoles.includes(data.role)) {
          //   let xRole = data.availableRoles.includes("Trainer") ? "Trainer" : data.availableRoles[0]
          //   F_selectRole(xRole)
          //   F_gotoDefaultView(xRole, true); // Go to default view
          // } else {
          //   F_reloadUser(); // Set user in maindataprovider
          //   F_gotoDefaultView(data.role, true); // Go to default view
          // }

          if (!res.data.roleMaster) {
            const defaultRoleMasterId = '63c8f1cb88bbc68cce0eb2ea';
            const traineeRoleMasterId = '64058db74037cfa1d4085598';
            let xRole = (res.data.role === 'ModuleManager' ? defaultRoleMasterId : traineeRoleMasterId);
            if (res.data.availableRoleMasters && res.data.availableRoleMasters.length) {
              xRole = res.data.availableRoleMasters[0]._id;
            }
            F_selectRole(xRole)
            F_gotoDefaultView(xRole, true); // Go to default view
          } else {
            F_reloadUser(); // Set user in maindataprovider
            // F_gotoDefaultView(data.role, true); 
            F_gotoDefaultView(res.data.role, true); // Go to default view
          }
          localStorage.setItem('isWelcome', false);

        },
        (error) => {
          F_showToastMessage(t("common:COULD NOT REFRESH THE TOKEN"), "error");
          setLoadingButton(false);
        }
      );
    } else {
      // No modules 
      F_showToastMessage(t("login-welcome-registration:COULD NOT FIND ANY ACTIVE MODULE"), "error");
      AuthService.logout()
      setLoadingButton(false);
      throw Error("Could not find any active module.")
    }
  }


  useEffect(() => {
    if(localStorage.getItem('isWelcome') === 'true') {
      setIsWelcome(true)
      setLoginUser(JSON.parse(localStorage.getItem('user')))
    }
    setIsRegistration(false);
    setLoadingButton(false);
    setLoginValidator(false);
    if (searchParams.has('token') ||
      searchParams.has('resetPassword') ||
      searchParams.has('confirmEmail') || 
      searchParams.has('resultId')) {
      let access_token = searchParams.get('token');
      let resetPassword = searchParams.get('resetPassword');
      let confirmEmail = searchParams.get('confirmEmail');
      let resultId = searchParams.get('resultId');
      if (access_token) { // acess_token provided, eg. when entering from email link
        AuthService.refreshToken(access_token).then(
          (response) => {
            if (resetPassword) {
              AuthService.confirmEmail(); // If accessed this function it means he have access to the email
              setForceChangePassword(true); // Inform App component
            }
            if (confirmEmail) AuthService.confirmEmail();

            // If resultId was provided in the activation link, 
            //it means this result should be confirmed and assigned to this user
            if (resultId){
              ResultService.confirm(resultId).then(res=>{
                AuthService.logout()
                F_showToastMessage(t("login-welcome-registration:RESULT WAS CONFIRMED"), "success");
                return
              })
            } else {
            // login(response.data)
            // switch (loginType) {
            //   case 'school':
            //     loginForSchool(response.data)
            //     break
            //   case 'training':
            //     loginForTraining(response.data)
            //     break
            //   case 'cognitive':
            //   default:
            //     // let modules = response.data.modules
            //     navigate("/explore");
            //     F_reloadUser();
            //     break
            // }

            let count = 0;
            let target = '';
            if (response.data.isInSchoolCenter) { count = count + 1; target = 'school' };
            if (response.data.isInTrainingCenter) { count = count + 1; target = 'training' };
            if (response.data.isInCognitiveCenter) { count = count + 1; target = 'cognitive' };


            if (count == 0) {
              let shouldSelectModule = !['Root', 'EcoManager', 'CloudManager', 'NetworkManager'].includes(response.data.role)
              if (response.data.modules?.length && shouldSelectModule) {
                loginForSchool(response.data)
              } else {
                F_reloadUser()
                let isTrainingCenter = true
                F_gotoDefaultView(response.data.role, isTrainingCenter);
              }
            } else if (count == 1) {
              switch (target) {
                case 'school':
                  loginForSchool(response.data)
                  break;
                case 'training':
                  loginForTraining(response.data)
                  break;
                case 'cognitive':

                  loginForCognetive(response.data)
                  break;
              }
            }
            else {
              setLoginUser(response.data)
              setIsWelcome(true);
              localStorage.setItem('isWelcome', true);
            }
            }
          },
          (error) => {
            let errorMessage = F_getErrorMessage(error);
            if (error.response.status === 401)
              errorMessage = t("login-welcome-registration:THE TOKEN IS NO LONGER VALID");
            F_showToastMessage(t("login-welcome-registration:MISSING VALIDATION"), "error");
          }
        );
      }
    } else if (isLoggedIn) {
      console.log('User already logged in as ', user.role)
    }
  }, []);

  function handleLoginUser(e) {
    // e.preventDefault();
    setLoadingButton(true);
    if (loginData.username && loginData.password) {
      AuthService.login(loginData.username, loginData.password).then(
        (response) => {


          let count = 0;
          let target = '';
          if (response.data.isInSchoolCenter) { count = count + 1; target = 'school' };
          if (response.data.isInTrainingCenter) { count = count + 1; target = 'training' };
          if (response.data.isInCognitiveCenter) { count = count + 1; target = 'cognitive' };

          if (count == 0) {
            let shouldSelectModule = !['Root', 'EcoManager', 'CloudManager', 'NetworkManager'].includes(response.data.role)
            if (response.data.modules?.length && shouldSelectModule) {
              loginForSchool(response.data)
            } else {
              F_reloadUser()
              let isTrainingCenter = true
              F_gotoDefaultView(response.data.role, isTrainingCenter);
            }
          } else if (count == 1) {
            // For sellers in Markting module always show Welcome screen with selection for Sentinel and BrainCore EDU
            if (response.data.isInCognitiveCenter && CommonService.isMarketingModule(response.data)){
              setLoginUser(response.data)
              setIsWelcome(true);
              localStorage.setItem('isWelcome', true);
            }else {
              switch (target) {
                case 'school':
                  loginForSchool(response.data)
                  break;
                case 'training':
                  loginForTraining(response.data)
                  break;
                case 'cognitive':
                  loginForCognetive(response.data)
                  break;
                case 'Trainee':
                  loginForTraining(response.data)
                  break;
                case 'roleMaster':
                  loginForTraining(response.data)
                  break;
              }
            }
          }
          else {
            setLoginUser(response.data)
            setIsWelcome(true);
            localStorage.setItem('isWelcome', true);
          }
          F_showToastMessage(t("login-welcome-registration:SUCCESSFULLY LOGGED IN"), "success");
        },
        (error) => {
          let errorMessage = F_getErrorMessage(error);
          if ([401, 404].includes(error?.response?.status)) {
            setLoginValidator(true);
            errorMessage = t("login-welcome-registration:MISSING VALIDATION");
            F_showToastMessage(errorMessage, "error");
          } else if (error?.response?.status === 403) {
            setLoginValidator(true);
            if (error?.response?.data?.message=="DOMAIN_NOT_ALLOWED")
              errorMessage = t("login-welcome-registration:DOMAIN_NOT_ALLOWED");
            else if (error?.response?.data?.message=="EMAIL_NOT_CONFIRMED")
              errorMessage = t("login-welcome-registration:EMAIL_NOT_CONFIRMED");
            else errorMessage = t("login-welcome-registration:MISSING VALIDATION");
            F_showToastMessage(errorMessage, "error");
          } else if (error?.response?.status === 405) {
            errorMessage = t("login-welcome-registration:MISSING VALIDATION");
            F_showToastMessage(errorMessage, "error");
          } else {
            console.log(error);
          }
          setLoadingButton(false);
        }
      );
    } else {
      setLoginValidator(true);
      setLoadingButton(false);
    }
  };

  function handleKeyPress(e){
    if(e.key==='Enter'){
    console.log(e.key,'enter successfully');
    handleLoginUser();
    }
  }

  const handleCenterType = (loginType) => {
    switch (loginType) {
      case 'school':
        loginForSchool(loginUser)
        break;
      case 'training':
        loginForTraining(loginUser)
        break;
      case 'cognitive':
        loginForCognetive(loginUser)
        break;
    }
  }

  // if (isLoggedIn) return <></>
  return (
    <ThemeProvider theme={new_theme}>
      {(!isWelcome) && <> 
        
        <Container maxWidth="xl">
          <div className={styles.login_header}>
            <header>
              <div className={styles.top_border}>
                <div className={styles.topborder_line}></div>
              </div>
              <div className={styles.header_section}>
                <div className={styles.logo} onClick={() => { setIsOpenResetPasswordModal(false) }}>
                  <Link to={'/'}>
                    <img src="/img/brand/BrainCore_Solutions.png" alt='' />
                  </Link>
                </div>
                <div className={styles.CenterName}>
                  <Typography variant='h1'>{isRegistration && t("login-welcome-registration:SIGN UP NOW")}</Typography>
                </div>
              </div>
            </header>
          </div>
        </Container>
        <Container className={styles.login_main} component="main" maxWidth='xl' disableGutters={true}>
          <Container maxWidth="xl" className="mainContainerDiv">
            <div className={styles.login_wrapper}>
              <Grid container spacing={2} style={{height: '100%'}}>
                {/* <Grid item xs={12} className={styles.CenterName_mobile}>
                  <div>
                    <Typography variant='h3'>{isRegistration ? t("login-welcome-registration:SIGN UP NOW") : (isOpenResetPasswordModal ? t("login-welcome-registration:RESET THE PASSWORD") : '')}</Typography>
                  </div>
                </Grid> */}
                {isOpenResetPasswordModal ? (<>
                  <Grid item xs={12}>
                    <ResetPasswordModal
                      isOpenResetPasswordModal={isOpenResetPasswordModal}
                      setIsOpenResetPasswordModal={setIsOpenResetPasswordModal}
                    />
                  </Grid>
                </>) : (<> {isRegistration ? (
                  <Grid item xs={12}>
                    <div className={styles.login_container}>
                      <div className={styles.login_inner}>
                        <div className={styles.loginsubinner}>
                          <Grid container sx={{height: '100%'}}>
                            <Grid item xs={12} sm={12} md={6} className={styles.login_content_parent}>
                              <div className={styles.login_content}>
                                <div className={styles.heading}>
                                  <Typography variant="h4" component="h4">
                                    {t("common:HELLO")}
                                  </Typography>
                                  <Typography variant="body1" component="p">
                                    {t("login-welcome-registration:PLEASE ENTER YOUR DETAILS")}
                                  </Typography>
                                </div>
                                <div className={styles.login_form}>
                                  <RegisterForm setIsRegistration={setIsRegistration} />
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} className={styles.login_image_parent}>
                              <div className={styles.login_image}>
                                <img src='/img/brand/login_pic.png' className='img-fluid' />
                              </div>
                            </Grid>
                          </Grid>
                        </div>
                      </div>
                    </div>
                    {/* <div className={styles.bottomBorder}>
                  <Typography variant="body1" component="p" sx={{ position: "absolute", bottom: "9px", left: "50%", transform: "translateX(-50%)", textAlign: "center", marginBottom: "0", fontWeight: "400", fontSize: "14px", color: new_theme.palette.primary.PWhite }}>
                  {t("common:POWERED BY BRAINELEM")} &reg; {new Date(now()).getFullYear()}
                  </Typography>
                </div> */}
                  </Grid>
                ) : (
                  <Grid item xs={12}>
                    <div className={styles.login_container}>
                      <div className={styles.login_inner}>
                        <div className={styles.loginsubinner}>
                          <Grid container sx={{height: '100%'}}>
                            <Grid item xs={12} sm={12} md={12} lg={6} className={styles.login_content_parent}>
                              <div className={styles.login_content}>
                                <div className={styles.heading}>
                                  <Typography variant="h1" component="h1" sx={{mb: 2}}>
                                    {t("common:HELLO")}
                                  </Typography>
                                  <Typography variant="body2" component="p" sx={{fontWeight: '400', mb: 1}}>
                                    {t("login-welcome-registration:PLEASE ENTER YOUR DETAILS")}
                                  </Typography>
                                </div>
                                <div className={styles.login_form}>
                                  <Grid container className={styles.containerFlex}>
                                    <Grid item xs={12} className={styles.loginItem}>
                                      <FormControl fullWidth={true} as="form">

                                        {/* <TextField className='small_fields' placeholder={t("login-welcome-registration:USERNAME")+"*"} margin="dense" */}
                                        <ETextField className='small_fields' label={t("common:USERNAME")}
                                          required={true}
                                          variant="filled"
                                          size="medium"
                                          autoFocus
                                          value={loginData?.username}
                                          onChange={(e) => setLoginData(p => ({ ...p, username: e.target.value }))}
                                          onKeyDown={handleKeyPress}
                                          error={loginValidator}
                                        />
                                        {/* <TextField className='small_fields' placeholder={t("login-welcome-registration:PASSWORD")+"*"} margin="dense" */}
                                        <ETextField label={t("common:PASSWORD")}
                                          type={isPasswordVisible ? 'text' : 'password'}
                                          size="medium"
                                          required={true}
                                          variant="filled"
                                          value={loginData?.password}
                                          onChange={(e) => setLoginData(p => ({ ...p, password: e.target.value }))}
                                          onKeyDown={handleKeyPress}
                                          error={loginValidator}
                                          InputProps={{
                                            endAdornment:
                                              <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => { setIsPasswordVisible(p => !p) }}
                                                edge="end"
                                              >
                                                {isPasswordVisible ? <Visibility /> : <VisibilityOff />}
                                              </IconButton>,
                                          }}
                                        />
                                        {loginValidator && <FormHelperText error={true} className="text-center">{t("login-welcome-registration:MISSING VALIDATION")}</FormHelperText>}
                                        <div className={styles.forgetPassword}>
                                          <p>{t("login-welcome-registration:PROBLEMS WITH PASSWORD")} <span onClick={() => { setIsOpenResetPasswordModal(true) }}>{t("login-welcome-registration:CLICK HERE")}</span></p>
                                        </div>
                                        <div className={styles.mob_swap}>
                                          <div className={styles.privacypolicy}>
                                            <Typography variant="subtitle2" component="p" align="center" sx={{ lineHeight: 1 }}>
                                              {t("login-welcome-registration:BY LOGIN YOU ACCEPT")}
                                              <a target="_blank" href={t("login-welcome-registration:TERMS AND CONDITIONS LINK")} style={{ color: new_theme.palette.primary.MedPurple, fontWeight: "bold" }}>{` ${t("login-welcome-registration:TERMS AND CONDITIONS")} `}</a>
                                              {t("login-welcome-registration:AND")}
                                              <a target="_blank" href={t("login-welcome-registration:PRIVACY POLICY LINK")} style={{ color: new_theme.palette.primary.MedPurple, fontWeight: "bold" }}>{` ${t("login-welcome-registration:PRIVACY POLICY")}.`}</a>
                                            </Typography>
                                          </div>
                                          <StyledButton eVariant="primary" eSize="small" className={styles.btnLogin} onClick={(e) => handleLoginUser(e)}
                                            disabled={loadingButton}>
                                            {t("login-welcome-registration:LOGIN")}
                                          </StyledButton>

                                          {/* or 
                                          <StyledButton eVariant="primary" eSize="medium" className={styles.btnLogin} onClick={loginWithRedirect}>
                                            {t("login-welcome-registration:SINGLE SIGN ON")}
                                          </StyledButton> */}
                                        </div>
                                      </FormControl>
                                    </Grid>
                                    {/* <Grid item xs={12}>
                                      <div className={styles.signup}>
                                        <Typography variant="body2" component="p" align="center" sx={{ fontFamily: "'Nunito', san-serif", fontSize: "18px", fontWeight: "400", color: new_theme.palette.newSupplementary.NSupText, marginTop: "20px" }}>
                                          {t("login-welcome-registration:DON'T HAVE ACCOUNT?")}&nbsp;
                                          <span onClick={() => { setIsRegistration(true) }} style={{ color: new_theme.palette.primary.MedPurple, fontWeight: "bold", cursor: "pointer" }}>{t("login-welcome-registration:SIGN UP")}</span>
                                        </Typography>
                                      </div>
                                    </Grid> */}
                                  </Grid>
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={6} className={styles.login_image_parent}>
                              <div className={styles.login_image}>
                                <img src='/img/brand/login_pic.png' className='img-fluid' />
                              </div>
                            </Grid>
                          </Grid>
                        </div>
                      </div>
                    </div>
                    {/* <div className={styles.bottomBorder}>
                      <Typography variant="body1" component="p" sx={{ position: "absolute", bottom: "9px", left: "50%", transform: "translateX(-50%)", textAlign: "center", marginBottom: "0", fontWeight: "400", fontSize: "14px", color: new_theme.palette.primary.PWhite }}>
                      {t("common:POWERED BY BRAINELEM")} &reg; {new Date(now()).getFullYear()}
                      </Typography>
                    </div> */}
                  </Grid>
                )}</>)}
                <ModuleSelectionModal moduleSelection={moduleSelection}
                  setModuleSelection={setModuleSelection}
                />
                <ModuleTypeSwitchModal isOpenModuleTypeSwitchModal={isOpenModuleTypeSwitchModal}
                  setIsOpenModuleTypeSwitchModal={setIsOpenModuleTypeSwitchModal}
                  availableModule={availableModule}
                  gotoTraining={() => { setIsOpenModuleTypeSwitchModal(false); setModuleSelection({ open: true, center: "TRAINING" }) }}
                />

              </Grid>
            </div>
          </Container>
        </Container>
        <Box sx={{ borderTop: `1px solid ${new_theme.palette.newSecondary.NSIconBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '48px' }}>
          <Typography variant="body4" component="span">{t('common:POWERED_BY')}  <span style={{ color: new_theme.palette.primary.MedPurple }}>{t('common:FOOTER_BRAINELEM')}</span> ® {new Date().getFullYear()}</Typography>
        </Box>
      </>}
      {(isWelcome) &&
            <><WelcomePage onHide={() => setIsWelcome(false)} User={loginUser} handleCenterType={handleCenterType} /><ModuleSelectionModal moduleSelection={moduleSelection}
              setModuleSelection={setModuleSelection} /></>
          }
    </ThemeProvider>
  );
}
export default withWidth()(Login);