import React, { useState, useEffect } from "react";
import { Card, CardActionArea, CardActions, CardContent, CardHeader, FormControl, Input, Paper } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { Link, useNavigate, useParams } from "react-router-dom";
import IndividualRegistrationForm from "./RegistrationType/IndividualRegistrationForm";
import TrainerRegistrationForm from "./RegistrationType/TrainerRegistrationForm";
import BusinessRegistrationForm from "./RegistrationType/BusinessRegistrationForm";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import UserService from "../../../services/user.service";
import AuthService from "../../../services/auth.service";
import { useTranslation } from "react-i18next";
import { useMainContext } from "../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import { Typography } from "@mui/material";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { new_theme } from 'NewMuiTheme';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import styles from '../login.module.scss';
import { ThemeProvider } from '@mui/material';
import StyledButton from "new_styled_components/Button/Button.styled";
const useStyles = makeStyles(theme => ({

    buttonRoot: {
        minHeight: "25px",
        minWidth: "98px",
        fontSize: "10px",
        fontFamily: "Roboto",
        width: "20px",
        margin: "0",
        padding: "0",
        overflowY: "none",
        marginLeft: "auto",
        marginRight: "auto",
        textTransform: "none"
    },
}));

const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const regexMail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

export default function RegisterForm({ setIsRegistration }) {
    const classes = useStyles();
    const navigate = useNavigate();
    const { F_reloadUser, F_showToastMessage, F_getErrorMessage } = useMainContext();
    const [visiblePassword, setVisiblePassword] = useState(false);
    const [registerType, setRegisterType] = useState("INDIVIDUAL");
    const { t } = useTranslation(['login-welcome-registration', 'common']);
    const [currentTab, setCurrentTab] = useState(0);

    // DEMO CODE
    useEffect(() => {
        if (0) {
            AuthService.isUsernameTaken("randomstring").then(res => {
                console.log("Is 'randomstring' available: ", res.data.exists)
            }).catch(error => console.log(error))
            AuthService.isUsernameTaken("classmanager1").then(res => {
                console.log("Is 'classmanager1' available: ", res.data.exists)
            }).catch(error => console.log(error))
        }
    }, []);
    // DEMO CODE

    const isUsernameTaken = async (username) => {
        return await AuthService.isUsernameTaken(username);
    }

    const isEmailTaken = async (email) => {
        return await AuthService.isEmailTaken(email);
    }

    const [userFormData, setUserFormData] = useState({
        registerType: "INDIVIDUAL",
        name: "",
        surname: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        academicTitle: "",
        companyName: "",
        ownerPosition: "",
    });

    const [validators, setValidators] = useState({
        isValidate: false,
        errorType: [],
        errorMessage: "",
    });

    useEffect(() => {
        if (validators.isValidate) {
            AuthService.register(userFormData).then(
                (response) => {
                    setIsRegistration(false)
                    F_reloadUser();
                    F_showToastMessage(t(response.data.message), 'success');
                    navigate("/login/training")
                },
                (error) => {
                    let errorMessage = F_getErrorMessage(error)
                    let message = error.response.data.message
                    if (message) {
                        if (message.hostname) message = message.hostname// In case message is an object instead od str
                        message = message.toLowerCase();
                        if (message.includes('message-broker')) { errorMessage = t("login-welcome-registration:COULD NOT SEND CONFIRMATION EMAIL"); }
                        else if (message.includes('already') && message.includes('username')) {
                            errorMessage = t("common:USERNAME IS ALREADY IN USE");
                            setUserFormData(p => ({ ...p, username: '', password: '', confirmPassword: '' }));
                            setValidators(p => ({ ...p, isValidate: false, errorType: ['USERNAME'], errorMessage: t("common:USERNAME IS EXIST") }))
                        }
                        else if (message.includes('already') && message.includes('email')) {
                            errorMessage = t("login-welcome-registration:EMAIL IS ALREADY IN USE");
                            setUserFormData(p => ({ ...p, email: '', password: '', confirmPassword: '' }));
                            setValidators(p => ({ ...p, isValidate: false, errorType: ['EMAIL'], errorMessage: t("common:ENTER CORRECT EMAIL ADDRESS") }))
                        }
                    }
                    F_showToastMessage(errorMessage, 'error')
                }
            );
        }
    }, [validators.isValidate])

    function save() {
        // request => create:
        // res => username and email is already exist?
        // let data ={
        //     registerType: userFormData.registerType,
        //     name: userFormData.name,
        //     surname: userFormData.surname,
        //     username: userFormData.username,
        //     email: userFormData.email,
        //     password: userFormData.password,
        //     confirmPassword: userFormData.confirmPassword,
        // }

        if (registerType === "INDIVIDUAL") {
            //
        } else if (registerType === "TRAINER") {
            //data.academicTitle = userFormData.academicTitle?? "-";
            setUserFormData(p => ({ ...p, academicTitle: '' }));
        } else if (registerType === "BUSINESS") {
            // data.companyName = userFormData.companyName?? "-";
            // data.ownerPosition = userFormData.ownerPosition?? "-";
            // setUserFormData(p=>({...p,companyName: '',ownerPosition:''})); // not sure why clearing companyName and owner Position
        }
        basicValidate(userFormData);
    }

    async function basicValidate(data) {
        if (data.name === '') {
            setValidators(p => ({ ...p, isValidate: false, errorType: ['NAME'], errorMessage: t("common:FIELD IS REQUIRED") }))
            console.log(validators)
        }
        else if (data.surname === '') {
            setValidators(p => ({ ...p, isValidate: false, errorType: ['SURNAME'], errorMessage: t("common:FIELD IS REQUIRED") }))
            console.log(validators)
        }
        else if (data.username === '') {
            setValidators(p => ({ ...p, isValidate: false, errorType: ['USERNAME'], errorMessage: t("common:FIELD IS REQUIRED") }))
            console.log(validators)
        }
        else if (!regexMail.test(data.email)) {
            setValidators(p => ({ ...p, isValidate: false, errorType: ['EMAIL'], errorMessage: t("common:ENTER CORRECT EMAIL ADDRESS") }))
            console.log(validators)
        }
        else if (data.registerType === 'BUSINESS' && data.companyName === '') {
            setValidators(p => ({ ...p, isValidate: false, errorType: ['COMPANY_NAME'], errorMessage: t("common:FIELD IS REQUIRED") }))
            console.log(validators)
        }
        else if (data.password === '' || data.password !== data.confirmPassword) {
            setValidators(p => ({ ...p, isValidate: false, errorType: ["PASSWORD", "CONFIRM_PASSWORD"], errorMessage: t("common:PASSWORD AND CONFIRM PASSWORD ARE DIFFERENT") }))
            console.log(validators)
        }
        else if (!regex.test(data.password)) {
            setValidators(p => ({ ...p, isValidate: false, errorType: ["PASSWORD"], errorMessage: t("common:PASSWORD VALIDATION MESSAGE" )}))
            console.log(validators)
        }
        else {
            let pass = true;
            if (data.username.length > 0) {
                let { data: { exists } } = await isUsernameTaken(data.username)
                if (exists) {
                    setValidators(p => ({ ...p, isValidate: false, errorType: ['USERNAME'], errorMessage: t("common:USERNAME IS ALREADY IN USE") }))
                    console.log(validators)
                    pass = false;
                }
            }

            if (data.email.length > 0) {
                let { data: { exists } } = await isEmailTaken(data.email)
                if (exists) {
                    setValidators(p => ({ ...p, isValidate: false, errorType: ['EMAIL'], errorMessage: t("login-welcome-registration:EMAIL IS ALREADY IN USE") }))
                    console.log(validators)
                    pass = false;
                }
            }

            if (pass) {
                setValidators(p => ({ ...p, isValidate: true, errorType: [], errorMessage: "" }))
                console.log(validators)
            }
        }
    }

    return (
        <>
        <ThemeProvider theme={new_theme}>
            <div className= {styles.rigistrationSec}>
                <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    defaultValue="INDIVIDUAL"
                    style={{ justifyContent: "center", marginTop: "15px", marginBottom: "15px" }}
                    className={styles.signupRadiobox}
                >
                    <FormControlLabel value="INDIVIDUAL" control={<Radio />} label={t("login-welcome-registration:INDIVIDUAL")} onClick={() => {
                        setRegisterType("INDIVIDUAL")
                        setUserFormData(p => ({ ...p, registerType: "INDIVIDUAL" }))
                    }} />
                    {/* <FormControlLabel value="BUSINESS" control={<Radio />} label={t("login-welcome-registration:BUSSINESS CLIENT")} onClick={() => {
                        setRegisterType("BUSINESS")
                        setUserFormData(p => ({ ...p, registerType: "BUSINESS" }))
                    }} /> */}
                </RadioGroup>
                {registerType === "INDIVIDUAL" && (<IndividualRegistrationForm
                    visiblePassword={visiblePassword}
                    setVisiblePassword={setVisiblePassword}
                    userFormData={userFormData}
                    setUserFormData={setUserFormData}
                    validators={validators}
                />)}
                {registerType === "TRAINER" && (<TrainerRegistrationForm
                    visiblePassword={visiblePassword}
                    setVisiblePassword={setVisiblePassword}
                    userFormData={userFormData}
                    setUserFormData={setUserFormData}
                    validators={validators}
                />)}
                {registerType === "BUSINESS" && (<BusinessRegistrationForm
                    visiblePassword={visiblePassword}
                    setVisiblePassword={setVisiblePassword}
                    userFormData={userFormData}
                    setUserFormData={setUserFormData}
                    validators={validators}
                />)}
            </div>
            
            <div className={styles.mob_swap}>
                <div className={styles.privacypolicy}>
                        <Typography variant="subtitle2" component="p" align="center">
                            {t("login-welcome-registration:BY SIGNUP YOU ACCEPT")}
                            <a target="_blank" href={t("login-welcome-registration:TERMS AND CONDITIONS LINK")} style={{ color: new_theme.palette.primary.PVoilet, fontWeight: "bold" }}>{` ${t("login-welcome-registration:TERMS AND CONDITIONS")} `}</a>
                            {t("login-welcome-registration:AND")}
                            <a target="_blank" href={t("login-welcome-registration:PRIVACY POLICY LINK")} style={{ color: new_theme.palette.primary.PVoilet, fontWeight: "bold" }}>{` ${t("login-welcome-registration:PRIVACY POLICY")}.`}</a>
                        </Typography>
                </div>
                <StyledButton eVariant="primary" eSize="medium" className={styles.btnLogin} onClick={save}>
                    {t("login-welcome-registration:SIGN UP")}
                </StyledButton>
            </div>
            <Grid item xs={12}>
                <div className={styles.signup}>
                    <Typography variant="body2" component="p" align="center" sx={{ fontFamily: "'Nunito', san-serif", fontSize: "18px", fontWeight: "400", color: new_theme.palette.newSupplementary.NSupText, marginTop: "20px" }}>
                        {t("login-welcome-registration:ALREADY HAVE AN ACCOUNT?")+' '}
                        <span onClick={() => { setIsRegistration(false) }} style={{ color: new_theme.palette.primary.MedPurple, fontWeight: "bold", cursor: "pointer" }}>{t("login-welcome-registration:SIGN IN")}</span>
                    </Typography>
                </div>
            </Grid>
        </ThemeProvider>
        </>
    )
}