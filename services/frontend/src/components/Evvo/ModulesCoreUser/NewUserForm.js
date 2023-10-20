import React, { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    Divider,
    IconButton, ListSubheader, Typography, Grid, TextField
} from "@mui/material";
import Chip from "@mui/material/Chip";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import ConfirmActionModal from "../../common/ConfirmActionModal";
import { useTranslation } from "react-i18next";
import { useMainContext } from "../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import userService from "../../../services/user.service";
import moduleCoreService from "../../../services/module-core.service";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import CertificationList from "./AvailableRoles/Certifications";
import MenuItem from "@mui/material/MenuItem";
import EMenu from "new_styled_components/Menu/Menu.styled";
import { ETextField, ESelect } from "new_styled_components";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Checkbox from "@mui/material/Checkbox";
import { KeyboardDatePicker } from "@material-ui/pickers";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SearchField from "../../common/Search/SearchField";
import TableSearch from "../../common/Table/TableSearch";
import AvailableRoles from "./AvailableRoles/AvailableRoles";
import PermissionList from "./PermissionList";
import InternshipService from "../../../services/internship.service";
import { theme } from "../../../MuiTheme";
import SyncProblemIcon from '@mui/icons-material/SyncProblem';
import VerifiedIcon from '@mui/icons-material/Verified';
import AuthService from "services/auth.service";
import Confirm from "components/common/Hooks/Confirm";
import { usePrompt } from "components/common/Hooks/usePrompt";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import "./UserList.scss"
import StyledButton from "new_styled_components/Button/Button.styled";
import { new_theme } from "NewMuiTheme";
import { ThemeProvider } from "@mui/material";
import { color } from "@mui/system";

// Services
import ValidatorsService from "services/validators.service";
import CommonDataService from "services/commonData.service";


const initialUserState = {
    name: "",
    surname: "",
    username: "",
    email: "",
    password: "",
    otherPassword: "",
    settings: {
        isActive: true,
        role: "", // default new user is trainee
        defaultRole: "", // default new user is trainee
        availableRoles: [], // default new user is trainee
        roleMaster: '',
        defaultRoleMaster: '',
        availableRoleMasters: [],
        emailConfirmed: false,
        level: '1',
        assignedCompany: '',
    },
    details: {
        fullName: "",
        displayName: "",
        phone: "",
        street: "",
        buildNr: "",
        postcode: "",
        city: "",
        country: "",
        dateOfBirth: "",
        description: ""
    }
};
const initialUserWithouMastersState = {
    name: "",
    surname: "",
    username: "",
    email: "",
    password: "",
    otherPassword: "",
    settings: {
        isActive: true,
        role: "", // default new user is trainee
        defaultRole: "", // default new user is trainee
        availableRoles: [], // default new user is trainee
        defaultRoleMaster: '',
        availableRoleMasters: [],
        emailConfirmed: false,
        level: '1',
        assignedCompany: '',
    },
    details: {
        fullName: "",
        displayName: "",
        phone: "",
        street: "",
        buildNr: "",
        postcode: "",
        city: "",
        country: "",
        dateOfBirth: "",
        description: ""
    }
};
const levels = ['1', '2', '3', '4', '5', '6', '7', '8', '9A', '9B', '10A', '10B', '11A', '11B', '12', '13', '14'];

export default function NewUserForm({ editFormHelper, setEditFormHelper }) {
    const { t, i18n } = useTranslation(['common', 'sentinel-MyUsers-Users']);
    const { isConfirmed } = Confirm();
    const { F_showToastMessage, F_hasPermissionTo, F_getHelper, F_handleSetShowLoader } = useMainContext();
    const { manageScopeIds } = F_getHelper();
    const [actionModal, setActionModal] = useState({ isOpen: false, returnedValue: false });
    const [activeTab, setActiveTab] = useState('INFORMATION');
    const { userPermissions, user } = F_getHelper();
    const [students, setStudents] = useState([]);
    const [visiblePassword, setVisiblePassword] = useState(false);
    const [assignChildrenDrawer, setAssignChildrenDrawer] = useState(false);
    const [searchingText, setSearchingText] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [validators, setValidators] = useState({ email: false, username: false, emailAvailable: false, usernameAvailable: false, name: false, surname: false, password: false, passwordConfirm: false, defaultRoleMaster: false });
    const { currentScreenSize } = useMainContext();
    const [currentTab, setCurrentTab] = useState(0);
    const [isEmailAvailable, setIsEmailAvailable] = useState(false);
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
    const [rows, setRows] = useState([]);
    const [availableRoles, setAvailableRole] = useState([]);
    initialUserState.settings.language = i18n?.language||'en'
    const [currentUser, setCurrentUser] = useState(initialUserState);

    useEffect(() => {
        // to avoid the empty tab when changing users from assistant to non-assistant
        setActiveTab('INFORMATION');
        setCurrentTab(0);

        if (manageScopeIds.isTrainingCenter) {
            InternshipService.readAllCompanies().then(res => {
                if (res.status === 200 && res.data) {
                    setCompanies(res.data);
                }
            }).catch(error => console.log(error));
        }

        if (editFormHelper.isOpen && editFormHelper.userId !== 'NEW') {
            userService.read(editFormHelper.userId).then(res => {
                if (res.status === 200 && res.data) {
                    setAvailableRole(res.data.settings.availableRoleMasters);
                    console.log("default role master", res.data.settings.defaultRoleMaster);
                    if (res.data.settings.defaultRoleMaster != undefined) {
                        const id = res.data.settings.defaultRoleMaster._id;
                        res.data.settings.defaultRoleMaster = id;

                    }

                    const av_ids = res.data.settings.availableRoleMasters.map((role) => role._id);

                    res.data.settings.availableRoleMasters = av_ids;

                    setCurrentUser(res.data);

                    // setCurrentUser({ ...res.data, settings: { ...res.data.settings, availableRoleMasters: [...res.data.settings.availableRoleMasters, event.target.value] } })

                    if (res.data.settings.availableRoles.includes("Parent")) {
                        moduleCoreService.readAllTrainees(manageScopeIds.moduleId).then(res2 => {
                            if (res2.data) {
                                let newData = [];
                                newData = res2.data.map(trainee => {
                                    res.data.details.children.map(child => {
                                        if (trainee._id === child._id) {
                                            trainee.isSelected = true;
                                        }
                                    });
                                    return trainee;
                                })
                                setStudents(newData);
                            }
                        });
                    }
                    F_handleSetShowLoader(false)
                }
            }).catch(err => console.log(err));
        } else if (editFormHelper.isOpen && editFormHelper.openType === 'ADD') {
            var initUser = manageScopeIds?.module === "COGNITIVE" ? initialUserState : initialUserWithouMastersState;
            setCurrentUser(initUser);
            moduleCoreService.readAllTrainees(manageScopeIds.moduleId).then(res2 => {
                if (res2.data.length > 0) {
                    setStudents(res2.data);
                }
                F_handleSetShowLoader(false)
            });
        }else F_handleSetShowLoader(false)
    }, [editFormHelper.isOpen, editFormHelper.userId]);


    useEffect(() => {
        F_handleSetShowLoader(true)
        CommonDataService.readAvailableRolesByModuleName(manageScopeIds?.module).then(res => {
            console.log("---------->data", res.data)
            setRows(res.data);

        }).catch(error => console.error(error))
    }, [])
    useEffect(() => {
        if (actionModal.returnedValue) {
            remove();
        }
    }, [actionModal.returnedValue]);

    useEffect(() => {
        setFilteredData(students);
    }, [students]);


    const remove = () => {
        moduleCoreService.removeModuleUser(manageScopeIds.moduleId, editFormHelper.userId).then(res => {
            F_showToastMessage(t("common:USER_REMOVED"), "success")
            setEditFormHelper({ isOpen: false, openType: 'PREVIEW', userId: undefined, isBlocking: false })
        }
        ).catch(error => console.error(error))
    }

    const save = async () => {
        // Calling setCurrentUser just before sending this object to backend is risky
        // It's bettter to create copy and then modify it
        var userToSave = {...currentUser}
        if (manageScopeIds.isTrainingCenter) {
            userToSave = {...userToSave, settings: {...userToSave.settings, selfRegistered: true, emailConfirmed: true }}
        }


        if (availableRoles.length == 1) {
            if (manageScopeIds?.module === "COGNITIVE") {
                userToSave = {...userToSave, settings: {...userToSave.settings, defaultRoleMaster: availableRoles[0], roleMaster: availableRoles[0] }}
            }
        }

        let allFieldsValid = false;
        if (editFormHelper.isMinimal) allFieldsValid = await minimalValidation()
        else allFieldsValid = await validateFields()
        if (allFieldsValid) {

            if (editFormHelper.userId === "NEW") {
                // By default new user will not be active
                if (editFormHelper.isMinimal) userToSave = {...userToSave, settings: {...userToSave.settings, isActive: false}}
                moduleCoreService.addModuleUser(manageScopeIds.moduleId, userToSave).then(res => {
                    F_showToastMessage(res.data.message, res.status === 200 ? "success" : "warning");
                    setEditFormHelper({ isOpen: false, openType: 'PREVIEW', userId: undefined, isBlocking: false })
                }).catch(error => {
                    const re1 = /username/i;
                    const re2 = /e-mail/i;
                    if (error?.response?.data?.message?.keyValue?.username || re1.test(error?.response?.data?.message)) {
                        F_showToastMessage(`${t('common:USERNAME_TAKEN')}`, "error");
                        setCurrentUser(p => ({ ...p, username: '' }));
                    }
                    if (error?.response?.data?.message?.keyValue?.email || re2.test(error?.response?.data?.message)) {
                        F_showToastMessage(`${t('common;EMAIL_TAKEN')}`, "error");
                        setCurrentUser(p => ({ ...p, email: '' }));
                    }
                })
            } else {
                moduleCoreService.updateModuleUser(userToSave).then(res => {
                    //display res.message in toast
                    F_showToastMessage(res.data.message, res.status === 200 ? "success" : "warning");
                    setEditFormHelper({ isOpen: false, openType: 'PREVIEW', userId: undefined, isBlocking: false })
                }).catch(error => {
                    if (error?.response?.data?.message?.keyValue?.email) {
                        F_showToastMessage(`${t('common:EMAIL_TAKEN')}`, "error");
                        setCurrentUser(p => ({ ...p, email: '' }));
                    }
                });
            }
        } else {
            F_showToastMessage(t("common:CORRECT_FEILDS"), "warning");
        }

    }


    async function checkUsername() {
        let { data: { exists } } = await AuthService.isUsernameTaken(currentUser.username, currentUser._id);
        setIsUsernameAvailable(() => !exists)
        setValidators(p => ({ ...p, usernameAvailable: exists }))
        return !exists;
    }

    async function validateFields() {
        let isValidate = true;
        // if(MSUser.email.length < 3 || MSUser.email.length){
        //     setValidators(p=>({...p,email: true}));
        //     isValidate = false;
        // }else{
        //     setValidators(p=>({...p,email: false}));
        // }

        if (currentUser.username.length < 3) {
            setValidators(p => ({ ...p, username: true }));
            isValidate = false;
        } else {
            let available = await checkUsername();
            if (!available) {
                setValidators(p => ({ ...p, usernameAvailable: true, username: false }));
                isValidate = false;
            } else {
                setValidators(p => ({ ...p, usernameAvailable: false, username: false }));
            }
        }

        if (currentUser.name.length < 3 || currentUser.name.length > 20) {
            setValidators(p => ({ ...p, name: true }));
            isValidate = false;
        } else {
            setValidators(p => ({ ...p, name: false }));
        }

        if (currentUser.email.length < 3) {
            setValidators(p => ({ ...p, email: true }));
            isValidate = false;
        } else {
            setValidators(p => ({ ...p, email: false }));
        }

        if (currentUser.surname.length < 3 || currentUser.surname.length > 20) {
            setValidators(p => ({ ...p, surname: true }));
            isValidate = false;
        } else {
            setValidators(p => ({ ...p, surname: false }));
        }


        if (editFormHelper.userId === "NEW") {
            if (currentUser?.password?.length >= 8 &&
                currentUser.password.match(/[a-z]/i) &&
                currentUser.password.match(/[A-Z]/i) &&
                currentUser.password.match(/[0-9]/) &&
                currentUser.password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)) {
                setValidators(p => ({ ...p, password: false }));
            } else {
                setValidators(p => ({ ...p, password: true }));
                isValidate = false;
            }
        }
        if (editFormHelper.userId === "NEW") {
            if (currentUser.confirmPassword !== currentUser.password) {
                setValidators(p => ({ ...p, passwordConfirm: true }));
                isValidate = false;
            } else {
                setValidators(p => ({ ...p, passwordConfirm: false }));
            }
        }

        if (editFormHelper.userId === "EDIT") {
            if (currentUser?.otherPassword?.password?.length >= 8 &&
                currentUser.otherPassword.password.match(/[a-z]/i) &&
                currentUser.otherPassword.password.match(/[A-Z]/i) &&
                currentUser.otherPassword.password.match(/[0-9]/) &&
                currentUser.otherPassword.password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)) {
                setValidators(p => ({ ...p, otherPassword: false }));
            } else {
                setValidators(p => ({ ...p, otherPassword: true }));
                isValidate = false;
            }
        }

        if (manageScopeIds?.module === "COGNITIVE") {
            if (currentUser.settings.defaultRoleMaster) {
                setValidators(p => ({ ...p, defaultRoleMaster: false }));
            } else {
                setValidators(p => ({ ...p, defaultRoleMaster: true }));
                isValidate = false;
            }
        }
        return isValidate;
    };

    const levelList = levels?.length > 0 ? levels.map((level, index) => <MenuItem key={index} value={level}>{level}</MenuItem>) : [];
    const companiesList = companies.length > 0 ? companies.map((item) => (<MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>)) : [];

    const assignedStudentsList = currentUser?.details?.children?.map((item, index) =>
        <Chip
            className="m-1"
            key={item._id}
            label={`${item.name} ${item.surname}`}
        />
    );


    const setFirstAvailableRoleAsDefault = ()=>{
        let available = currentUser.settings.availableRoleMasters;
        if (available.length>0) setCurrentUser(p => ({ ...p, settings: { ...p.settings, roleMaster: available[0], defaultRoleMaster: available[0] } }));
        else setCurrentUser(p => ({ ...p, settings: { ...p.settings, roleMaster: undefined, defaultRoleMaster: undefined } }));
    }

    useEffect(() => {
        let available = currentUser.settings.availableRoleMasters;
        let defaultRole = currentUser.settings.defaultRoleMaster;

        // If default role is missing or if it is no longer available on the list
        if (!defaultRole || (defaultRole && !available.includes(defaultRole))){
            setFirstAvailableRoleAsDefault()
        }

    }, [currentUser.settings.availableRoleMasters])

    useEffect(() => {
        var roles = [];
        if (manageScopeIds?.module === "COGNITIVE") {
            roles = rows.filter((role) => currentUser.settings.availableRoleMasters.includes(role._id));
        } else {
            roles = rows.filter((role) => currentUser.settings.availableRoles.includes(role.roleName));

        }

        setAvailableRole(roles)
        // if (roles.length == 0) {
        //     setCurrentUser(p => ({ ...p, settings: { ...p.settings, defaultRoleMaster: '', roleMaster: '' } }));
        //     // setValidators(p => ({ ...p, defaultRoleMaster: true }));
        // }else{
        //     setCurrentUser(p => ({ ...p, settings: { ...p.settings, defaultRoleMaster: currentUser.settings.defaultRoleMaster, roleMaster: '' } }));

        // }

    }, [currentUser.settings.availableRoleMasters, currentUser.settings.availableRoles, rows])
    const handleChange = (event) => {
        setEditFormHelper(p => ({ ...p, isBlocking: true }))
        console.log(event.target);
        if (event.target.checked) {
            if (manageScopeIds?.module === "COGNITIVE") {
                setCurrentUser({ ...currentUser, settings: { ...currentUser.settings, availableRoleMasters: [...currentUser.settings.availableRoleMasters, event.target.value] } })
            } else {
                setCurrentUser({ ...currentUser, settings: { ...currentUser.settings, availableRoles: [...currentUser.settings.availableRoles, event.target.value] } })

            }

        } else {
            let roles = manageScopeIds?.module === "COGNITIVE" ? [...currentUser.settings.availableRoleMasters] : [...currentUser.settings.availableRoles];
            const filterRoles = roles.filter((id) => id !== event.target.value);
            if (manageScopeIds?.module === "COGNITIVE") {
                setCurrentUser({ ...currentUser, settings: { ...currentUser.settings, availableRoleMasters: filterRoles } })
            } else {
                setCurrentUser({ ...currentUser, settings: { ...currentUser.settings, availableRoles: filterRoles } })
            }
        }

    }

    const getTitleComponent = (title) => {
        return <>
            <div className="admin_content" style={{ paddingTop: "0" }}>
                <div className="admin_heading" style={{ marginBottom: "0" }}>
                    <Grid>
                        <Typography variant="h1" component="h1" >{title}</Typography>
                        <Divider variant="insert" className='heading_divider' />
                    </Grid>
                </div>
            </div>
        </>
    }
    // Component with buttons
    const getButtons = () => {
        return <Grid container className="btn-flex btn-grid-mb">
            <Grid item className="text-right">
                <StyledButton eVariant="secondary" eSize="medium" onClick={back}>
                    {t("common:BACK")}
                </StyledButton>
            </Grid>
            <Grid item >
                {
                    editFormHelper.openType === "EDIT" &&
                    <StyledButton eVariant="primary" eSize="medium" disabled={!editFormHelper.isBlocking || validators.otherPassword} onClick={save}>
                        {t("common:SAVE")}
                    </StyledButton>
                }
                {
                    editFormHelper.openType === "ADD" &&
                    <StyledButton eVariant="primary" eSize="medium" disabled={!editFormHelper.isBlocking || validators.otherPassword} onClick={save}>
                        {t("common:SUBMIT")}
                    </StyledButton>
                }
            </Grid>
        </Grid>
    }

    const back = () => {
        setEditFormHelper({ isOpen: false, openType: 'PREVIEW', userId: undefined, isBlocking: false })

    }

    useEffect(() => {
        if (rows.length){
            // By default set role to trainee for new users
            if (editFormHelper.openType === 'ADD'){
                let traineeRole = rows.find(r=>r.name=="Trainee")
                if (traineeRole) setCurrentUser(p => ({ ...p, settings: { ...p.settings, defaultRoleMaster: traineeRole._id, roleMaster: traineeRole._id, availableRoleMasters: [traineeRole._id] } }));
            }
        }

    }, [rows])


    // Check if fields for minimal form are valid
    async function minimalValidation() {
        let validName = await validateName()
        let validSurname = await validateSurname()
        let validEmail = await validateEmail()
        return validEmail && validName && validSurname
    }

    // Check name
    // checkEmpty - when set to false it will not return error when fields are empty
    async function  validateName(checkEmpty=true) {
        let missingName = !currentUser.name
        if (!checkEmpty){
            setValidators(p => ({ ...p, name: false}));
            return true
        }else setValidators(p => ({ ...p, name:  missingName}));
        return !missingName
    }

    // Check surname
    // checkEmpty - when set to false it will not return error when fields are empty
    async function  validateSurname(checkEmpty=true) {
        let missingSurname = !currentUser.surname
        if (!checkEmpty){
            setValidators(p => ({ ...p, surname: false}));
            return true
        }else setValidators(p => ({ ...p, surname: missingSurname}));

        return !missingSurname
    }

    // Check if email is valid and available
    // checkEmpty - when set to false it will not return error when email is empty
    async function validateEmail(checkEmpty=true) {
        if (!checkEmpty){
            if (!currentUser.email) return true
        }else{
            // Missing
            if (!currentUser.email){
                setValidators(p => ({ ...p,  email: true}));
                return false
            }
        }
        
        // Is email correct
        let isCorrectEmail = ValidatorsService.isValidEmailAddress(currentUser.email)
        setValidators(p => ({ ...p, email: !isCorrectEmail }));
        
        // Is email available
        if (isCorrectEmail){
            let { data: { exists } } = await AuthService.isEmailTaken(currentUser.email, currentUser._id);
            setIsEmailAvailable(() => !exists)
            setValidators(p => ({ ...p, emailAvailable: exists }))
            return !exists;
        }else return false 
    }

    useEffect(() => {// Validate email every 500ms
        const timer = setTimeout(() =>{
            validateEmail(false)
        }, 500)
        return () => clearTimeout(timer)
    }, [currentUser.email, currentUser.name, currentUser.surname])

    useEffect(() => {// Validate Name every 500ms
        const timer = setTimeout(() =>{
            validateName(false)
        }, 500)
        return () => clearTimeout(timer)
    }, [currentUser.name])
    
    useEffect(() => {// Validate Surname every 500ms
        const timer = setTimeout(() =>{
            validateSurname(false)
        }, 500)
        return () => clearTimeout(timer)
    }, [currentUser.surname])

    if (editFormHelper.isMinimal) return <ThemeProvider theme={new_theme}>

        <Grid item xs={12}>
            {getTitleComponent(t("sentinel-MyUsers-Users:CREATE_NEW_USER"))}
            <Grid><ETextField label={t("common:E-MAIL")} style={{ maxWidth: '400px' }}
                fullWidth={true}
                variant={editFormHelper.openType === 'PREVIEW' ? 'standard' : 'filled'}
                name='email'
                required={true}
                
                InputProps={{
                    readOnly: editFormHelper.openType === 'PREVIEW',
                    disableUnderline: editFormHelper.openType === 'PREVIEW',
                    endAdornment: currentUser.email && <IconButton
                        aria-label="check email availability"
                        edge="end"
                    >
                        {isEmailAvailable ? <VerifiedIcon /> : <SyncProblemIcon />}
                    </IconButton>,
                }}
                value={currentUser.email}
                //helperText={validators.email ? "Incorrect email" : null}
                helperText={validators.email ? t('common:INCORRECT E-MAIL') : validators.emailAvailable ? t('sentinel-MyUsers-Users:EMAIL_NOT_AVAILABLE') : null}
                error={validators.email || validators.emailAvailable}
                onInput={({ target }) => {
                    setEditFormHelper(p => ({ ...p, isBlocking: true }))
                    setCurrentUser(p => ({ ...p, [target.name]: target.value, username: target.value }))
                }}
            /></Grid>
            <Grid><ETextField label={t("sentinel-MyUsers-Users:NAME_OF_USER")} style={{ maxWidth: '400px' }}
                fullWidth={true}
                variant={editFormHelper.openType === 'PREVIEW' ? 'standard' : 'filled'}
                name='name'
                
                InputProps={{
                    readOnly: editFormHelper.openType === 'PREVIEW',
                    disableUnderline: editFormHelper.openType === 'PREVIEW',
                }}
                error={validators.name}
                helperText={validators.name ? t("sentinel-MyUsers-Users:PLEASE_PROVIDE_NAME") : null}
                value={currentUser.name}
                required={true}
                onInput={({ target }) => {
                    setEditFormHelper(p => ({ ...p, isBlocking: true }))
                    setCurrentUser(p => ({ ...p, [target.name]: target.value.replace(/[^A-Za-z-_ ]/ig, '') }))
                }}
            /></Grid>
            <Grid><ETextField label={t("sentinel-MyUsers-Users:SURNAME")} style={{ maxWidth: '400px' }}
                fullWidth={true}
                name='surname'
                variant={editFormHelper.openType === 'PREVIEW' ? 'standard' : 'filled'}
                
                InputProps={{
                    readOnly: editFormHelper.openType === 'PREVIEW',
                    disableUnderline: editFormHelper.openType === 'PREVIEW',
                }}
                error={validators.surname}
                helperText={validators.surname ? t("sentinel-MyUsers-Users:PLEASE_PROVIDE_SURNAME") : null}
                value={currentUser.surname}
                required={true}
                onInput={({ target }) => {
                    setEditFormHelper(p => ({ ...p, isBlocking: true }))
                    setCurrentUser(p => ({ ...p, [target.name]: target.value.replace(/[^A-Za-z-_ ]/ig, '') }))
                }}
            /></Grid>
            {getButtons()}

        </Grid>
    </ThemeProvider>
    
    else return (
        <ThemeProvider theme={new_theme}>
            <Grid container>
                <div className="admin_content" style={{ paddingTop: "0" }}>
                    {getTitleComponent(editFormHelper.openType === 'ADD' ? t("sentinel-MyUsers-Users:CREATE_NEW_USER") : t("common:USER"))}

                    <Grid item xs={12}>
                        <Grid container className="account-grid" sx={{ mt: 4 }}>
                            {/* User role selection only allowed for admin */}
                            {userPermissions?.admin_auth?.access && <>
                                <Grid item xs={12} className="role-sec">
                                    <Typography variant="subtitle3" component="h6" sx={{ mb: 2 }}>{t("sentinel-MyUsers-Users:SELECT_ROLES")}</Typography>
                                    <FormGroup className="role-checkbox">
                                        <Grid container>
                                            {
                                                manageScopeIds?.module === "COGNITIVE" ?
                                                    rows.map((role) => <Grid item xs={12} sm={4} md={3} lg={2}><FormControlLabel control={<Checkbox sx={{color: new_theme.palette.newSupplementary.NSupText}} checked={currentUser.settings.availableRoleMasters.includes(role._id)}
                                                        onChange={handleChange} />} label={<Typography variant="body2" component="span" sx={{ fontWeight: '700', textTransform: 'capitalize !important' }}>{role.name}</Typography>} value={role._id} /></Grid>
                                                    )
                                                    :
                                                    rows.map((role) => <FormControlLabel control={<Checkbox sx={{color: new_theme.palette.newSupplementary.NSupText}} checked={currentUser.settings.availableRoles.includes(role.roleName)}
                                                        onChange={handleChange} />} label={<Typography variant="body2" component="span" sx={{ fontWeight: '700', textTransform: 'capitalize !important' }}>{role.roleName}</Typography>} value={role.roleName} />
                                                    )
                                            }
                                        </Grid>
                                    </FormGroup>
                                </Grid>

                                {currentUser.settings.availableRoleMasters.length > 1 && currentUser.settings.defaultRoleMaster &&
                                    <Grid item xs={12} sm={6} md={3} sx={{mt: 2}}>
                                        <ESelect
                                            sx={{ mb: 0}}
                                            variant="filled"
                                            size="medium"
                                            label={t("sentinel-MyUsers-Users:SELECT_DEFAULT_ROLES")}
                                            fullWidth={true}
                                            required={true}
                                            error={validators.defaultRoleMaster}
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={currentUser.settings.defaultRoleMaster}
                                            readOnly={editFormHelper.openType === 'PREVIEW'}
                                            disableUnderline={editFormHelper.openType === 'PREVIEW'}
                                            style={{ marginBottom: '10px' }}
                                            onChange={({ target: { value } }) => {
                                                setEditFormHelper(p => ({ ...p, isBlocking: true }))
                                                setCurrentUser(p => ({ ...p, settings: { ...p.settings, defaultRoleMaster: value, roleMaster: value } }));
                                            }}
                                        >
                                            {
                                                availableRoles.map((role) => <MenuItem key={"demo"} value={role._id}>{role.name}</MenuItem>)
                                            }
                                        </ESelect>
                                        {/* <FormControl margin="dense" fullWidth={true}
                                            variant={editFormHelper.openType === 'PREVIEW' ? 'standard' : "filled"}
                                        >
                                            <InputLabel id="demo-simple-select-label">
                                                {validators.defaultRoleMaster ? <p style={{ color: new_theme.palette.error.main }}>Select User's Default Role *</p> : t("Select User’s Default Role *")}
                                            </InputLabel>
                                            <Select
                                                required={true}
                                                error={validators.defaultRoleMaster}
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={currentUser.settings.defaultRoleMaster}
                                                readOnly={editFormHelper.openType === 'PREVIEW'}
                                                disableUnderline={editFormHelper.openType === 'PREVIEW'}
                                                style={{ marginBottom: '10px' }}
                                                onChange={({ target: { value } }) => {
                                                    setEditFormHelper(p => ({ ...p, isBlocking: true }))
                                                    setCurrentUser(p => ({ ...p, settings: { ...p.settings, defaultRoleMaster: value, roleMaster: value } }));
                                                }}
                                            >
                                                {

                                                    availableRoles.map((role) => <MenuItem key={"demo"} value={role._id}>{role.name}</MenuItem>)}
                                            </Select>
                                        </FormControl> */}
                                        <Typography className="acc_heading" variant="h6" component="h6" style={{ color: new_theme.palette.newSupplementary.NSupText, fontSize: '10px' }}>{t("Default role means the role which the user will be assigned whenever they login to the system.")}</Typography>
                                    </Grid>}
                            </>
                            }
                        </Grid>
                        <Grid container sx={{ mt: 3 }} spacing={2}>

                            <Grid item xs={12}>
                                <Typography variant="subtitle3" component="h6" >{t("common:ACCOUNT_INFORMATION")}</Typography>
                            </Grid>
                            {manageScopeIds.isTrainingCenter && (
                                <Grid item xs={12} sm={6} md={3}>
                                    <ESelect
                                        sx={{ mb: 0 }}
                                        variant="filled"
                                        size="medium"
                                        label={t("sentinel-MyUsers-Users:ASSIGN_COMPANY")}
                                        fullWidth={true}
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={currentUser.settings.assignedCompany}
                                        readOnly={editFormHelper.openType === 'PREVIEW'}
                                        disableUnderline={editFormHelper.openType === 'PREVIEW'}
                                        onChange={({ target: { value } }) => {
                                            setCurrentUser(p => ({ ...p, settings: { ...p.settings, assignedCompany: value } }));
                                        }}
                                    >
                                        <MenuItem key={"demo"} value={""}>{t('sentinel-MyUsers-Users:WITHOUT_COMPANY')}</MenuItem>
                                        {companiesList}
                                    </ESelect>
                                </Grid>
                            )}
                            <Grid item xs={12} sm={6} md={3}>
                                <ETextField label={t("common:USERNAME")}
                                    fullWidth={true}
                                    name='username'
                                    variant={((editFormHelper.openType === 'ADD') || (editFormHelper.openType === 'EDIT')) ? 'filled' : 'standard'}
                                    //variant='filled'
                                    InputProps={{
                                        readOnly: editFormHelper.openType === 'PREVIEW',
                                        disableUnderline: editFormHelper.openType === 'PREVIEW',
                                        endAdornment: <IconButton
                                            aria-label="check username availability"
                                            onClick={() => { checkUsername() }}
                                            edge="end"
                                        >
                                            {isUsernameAvailable ? <VerifiedIcon /> : <SyncProblemIcon />}
                                        </IconButton>,
                                    }}

                                    onBlur={() => { checkUsername() }}
                                    value={currentUser.username}
                                    required={true}
                                    helperText={validators.username ? t('common:INCORRECT_USERNAME') : validators.usernameAvailable ? t('sentinel-MyUsers-Users:USERNAME_NOT_AVAILABLE') : null}
                                    error={validators.username || validators.usernameAvailable}
                                    onInput={({ target }) => {
                                        setEditFormHelper(p => ({ ...p, isBlocking: true }))
                                        setCurrentUser(p => ({ ...p, [target.name]: target.value }))
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <ETextField label={t("common:NAME_OF_USER")}
                                    fullWidth={true}
                                    variant={editFormHelper.openType === 'PREVIEW' ? 'standard' : 'filled'}
                                    name='name'

                                    InputProps={{
                                        readOnly: editFormHelper.openType === 'PREVIEW',
                                        disableUnderline: editFormHelper.openType === 'PREVIEW',
                                    }}
                                    value={currentUser.name}
                                    required={true}
                                    helperText={validators.name ? t("common:INCORRECT_NAME") : null}
                                    error={validators.name}
                                    onInput={({ target }) => {
                                        setEditFormHelper(p => ({ ...p, isBlocking: true }))
                                        setCurrentUser(p => ({ ...p, [target.name]: target.value.replace(/[^A-Za-z-_ ]/ig, '') }))
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <ETextField label={t("common:SURNAME")}
                                    fullWidth={true}
                                    name='surname'
                                    variant={editFormHelper.openType === 'PREVIEW' ? 'standard' : 'filled'}

                                    InputProps={{
                                        readOnly: editFormHelper.openType === 'PREVIEW',
                                        disableUnderline: editFormHelper.openType === 'PREVIEW',
                                    }}
                                    value={currentUser.surname}
                                    required={true}
                                    helperText={validators.surname ? t("common:INCORRECT_SURNAME") : null}
                                    error={validators.surname}
                                    onInput={({ target }) => {
                                        setEditFormHelper(p => ({ ...p, isBlocking: true }))
                                        setCurrentUser(p => ({ ...p, [target.name]: target.value.replace(/[^A-Za-z-_ ]/ig, '') }))
                                    }}
                                />
                            </Grid>
                            {!manageScopeIds.isTrainingCenter && (
                                <Grid item xs={12} sm={6} md={3}>
                                    <ETextField label={t("common:E-MAIL")}
                                        fullWidth={true}
                                        variant={editFormHelper.openType === 'PREVIEW' ? 'standard' : 'filled'}
                                        name='email'
                                        required={true}


                                        InputProps={{
                                            readOnly: editFormHelper.openType === 'PREVIEW',
                                            disableUnderline: editFormHelper.openType === 'PREVIEW',
                                        }}
                                        value={currentUser.email}
                                        //helperText={validators.email ? "Incorrect email" : null}
                                        error={validators.email}
                                        onInput={({ target }) => {
                                            setEditFormHelper(p => ({ ...p, isBlocking: true }))
                                            setCurrentUser(p => ({ ...p, [target.name]: target.value }))
                                        }}
                                    />
                                </Grid>
                            )}
                            {editFormHelper.openType === 'ADD' && (
                                <Grid item xs={12} sm={6} md={3}>
                                    <ETextField label={t("common:PASSWORD")}
                                        className="txtPassField"
                                        type={visiblePassword ? 'text' : 'password'}
                                        fullWidth={true}
                                        autoComplete="new-password"
                                        name='password'
                                        required={true}
                                        variant="filled"
                                        value={currentUser.password ?? ""}
                                        error={validators.password}
                                        helperText={validators.password && t("common:PASSWORD_VALIDATION")}

                                        InputProps={{
                                            endAdornment:
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => { setVisiblePassword(p => !p) }}
                                                    edge="end"
                                                >
                                                    {visiblePassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>,
                                        }}
                                        onBlur={({ target }) => {
                                            if (currentUser?.password?.length >= 8 &&
                                                currentUser.password.match(/[a-z]/i) &&
                                                currentUser.password.match(/[A-Z]/i) &&
                                                currentUser.password.match(/[0-9]/) &&
                                                currentUser.password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)) {
                                                setValidators(p => ({ ...p, [target.name]: false }));
                                            } else {
                                                setValidators(p => ({ ...p, [target.name]: true }));
                                            }
                                        }}
                                        onInput={({ target }) => {
                                            setEditFormHelper(p => ({ ...p, isBlocking: true }))
                                            setCurrentUser(p => ({ ...p, [target.name]: target.value }))
                                        }}
                                    />
                                </Grid>
                            )}
                            {editFormHelper.openType === 'ADD' && (
                                <Grid item xs={12} sm={6} md={3}>
                                    <ETextField label={t("common:CONFIRM_PASSWORD")}
                                        className="txtConfirmPass"
                                        type={visiblePassword ? 'text' : 'password'}
                                        fullWidth={true}
                                        required={true}
                                        name='confirmPassword'
                                        variant="filled"
                                        value={currentUser.confirmPassword}
                                        error={validators.passwordConfirm}

                                        InputProps={{
                                            endAdornment:
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => { setVisiblePassword(p => !p) }}
                                                    edge="end"
                                                >
                                                    {visiblePassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>,
                                        }}
                                        helperText={validators.passwordConfirm && t("common:PASSWORD_NOT_MATCHED")}
                                        onInput={({ target }) => {
                                            setEditFormHelper(p => ({ ...p, isBlocking: true }));
                                            setCurrentUser(p => ({ ...p, [target.name]: target.value }))
                                        }}
                                        onBlur={({ target }) => {
                                            if (target.value === currentUser.password) {
                                                setValidators(p => ({ ...p, passwordConfirm: false }))
                                            }
                                            else {
                                                setValidators(p => ({ ...p, passwordConfirm: true }))
                                            }
                                        }}
                                    />
                                </Grid>
                            )}
                            {user.id !== editFormHelper.userId && editFormHelper.openType === 'EDIT' && (
                                <Grid item xs={12} sm={6} md={3}>
                                    <ETextField label={t("sentinel-MyUsers-Users:SET_PASSWORD")}
                                        type={visiblePassword ? 'text' : 'password'}
                                        fullWidth={true}
                                        autoComplete="new-password"
                                        placeholder="Optional password"
                                        name='password'
                                        variant="filled"
                                        value={currentUser.otherPassword?.password ?? ""}
                                        error={validators.otherPassword}
                                        helperText={validators.otherPassword && <Typography><small>{t("common:PASSWORD_VALIDATION")}`</small></Typography>}

                                        InputProps={{
                                            endAdornment:
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => { setVisiblePassword(p => !p) }}
                                                    edge="end"
                                                >
                                                    {visiblePassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>,
                                        }}
                                        onBlur={({ target }) => {
                                            if (currentUser?.otherPassword?.password?.length === 0 ||
                                                currentUser?.otherPassword?.password?.length >= 8 &&
                                                currentUser.otherPassword.password.match(/[a-z]/i) &&
                                                currentUser.otherPassword.password.match(/[A-Z]/i) &&
                                                currentUser.otherPassword.password.match(/[0-9]/) &&
                                                currentUser.otherPassword.password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)) {
                                                setValidators(p => ({ ...p, otherPassword: false }));
                                            } else {
                                                setValidators(p => ({ ...p, otherPassword: true }))
                                            }
                                        }}
                                        onInput={({ target }) => {
                                            setEditFormHelper(p => ({ ...p, isBlocking: true }));
                                            setCurrentUser(p => ({ ...p, otherPassword: { ...currentUser.otherPassword, password: target.value } }))
                                        }}
                                    />
                                </Grid>
                            )}
                            {manageScopeIds.isTrainingCenter && (
                                <Grid item xs={12} sm={6} md={3}>
                                    <ETextField label={t("common:E-MAIL")}
                                        fullWidth={true}
                                        variant={editFormHelper.openType === 'PREVIEW' ? 'standard' : 'filled'}
                                        name='email'
                                        InputProps={{
                                            readOnly: editFormHelper.openType === 'PREVIEW',
                                            disableUnderline: editFormHelper.openType === 'PREVIEW',
                                        }}
                                        value={currentUser.email}
                                        //helperText={validators.email ? "Incorrect email" : null}
                                        error={validators.email}
                                        onInput={({ target }) => {
                                            setEditFormHelper(p => ({ ...p, isBlocking: true }))
                                            setCurrentUser(p => ({ ...p, [target.name]: target.value }))
                                        }}
                                    />
                                </Grid>
                            )}
                            <Grid item xs={12} sm={6} md={3}>
                                <KeyboardDatePicker
                                    className="datePickerH"
                                    inputVariant={editFormHelper.openType === 'PREVIEW' ? 'standard' : "filled"}
                                    maxDate={new Date().setDate(new Date().getDate() - 365)}
                                    fullWidth={true}
                                    InputProps={{
                                        readOnly: editFormHelper.openType === 'PREVIEW',
                                        disableUnderline: editFormHelper.openType === 'PREVIEW',
                                    }}
                                    id="date-picker-dialog"
                                    label={t("Date of birth")}
                                    format="DD.MM.yyyy"
                                    disableFuture={true}

                                    value={currentUser.details?.dateOfBirth ? new Date(currentUser.details.dateOfBirth).toISOString() : null}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                        disabled: editFormHelper.openType === 'PREVIEW'
                                    }}
                                    onChange={(date) => {
                                        if (date && date._isValid) {
                                            setEditFormHelper(p => ({ ...p, isBlocking: true }));
                                            setCurrentUser(p => ({ ...p, details: { ...p.details, dateOfBirth: new Date(date).toISOString() } }))
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <ESelect
                                    variant="filled"
                                    size="medium"
                                    label={t("common:STATUS")}
                                    fullWidth={true}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    name={['settings', 'isActive']}
                                    readOnly={editFormHelper.openType === 'PREVIEW'}
                                    disableUnderline={editFormHelper.openType === 'PREVIEW'}
                                    value={currentUser.settings.isActive ? 1 : 0}
                                    onChange={({ target }) => {
                                        setEditFormHelper(p => ({ ...p, isBlocking: true }));
                                        setCurrentUser(p => ({ ...p, [target.name?.[0]]: { ...p[target.name[0]], [target.name?.[1]]: !!(target.value) } }));
                                    }}
                                >
                                    <MenuItem value={1}>{t("common:ACTIVE")}</MenuItem>
                                    <MenuItem value={0}>{t("common:INACTIVE")}</MenuItem>
                                </ESelect>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <ESelect
                                    variant="filled"
                                    size="medium"
                                    label={t("common:SELECT LANGUAGE")}
                                    fullWidth={true}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    name={['settings', 'language']}
                                    readOnly={editFormHelper.openType === 'PREVIEW'}
                                    disableUnderline={editFormHelper.openType === 'PREVIEW'}
                                    value={currentUser?.settings?.language}
                                    onChange={({ target }) => {
                                        setEditFormHelper(p => ({ ...p, isBlocking: true }));
                                        setCurrentUser(p => ({ ...p, [target.name?.[0]]: { ...p[target.name[0]], [target.name?.[1]]: target.value } }));
                                    }}
                                >
                                        <MenuItem value={"en"}>{t('common:ENGLISH')}</MenuItem>
                                        <MenuItem value={"fr"}>{t('common:FRANCE')}</MenuItem>
                                        <MenuItem value={"pl"}>{t('common:POLISH')}</MenuItem>
                                </ESelect>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                {(currentUser?.settings?.role === "Trainee" || currentUser?.settings?.availableRoles.includes("Trainee")) &&
                                    <FormControl style={{ maxWidth: '400px' }} fullWidth={true}
                                        variant={editFormHelper.openType === 'PREVIEW' ? 'standard' : "filled"}
                                    >
                                        <InputLabel id="select-student-label">{t("common:TRAINEE_LEVEL")}</InputLabel>
                                        <Select
                                            labelId="select-student-label"
                                            id="select-student"
                                            name={['settings', 'level']}
                                            value={currentUser.settings.level}
                                            readOnly={editFormHelper.openType === 'PREVIEW'}
                                            disableUnderline={editFormHelper.openType === 'PREVIEW'}
                                            onChange={({ target }) => {
                                                setEditFormHelper(p => ({ ...p, isBlocking: true }));
                                                setCurrentUser(p => ({ ...p, [target.name?.[0]]: { ...p[target.name[0]], [target.name?.[1]]: target.value } }));
                                            }}
                                        >
                                            {levelList}
                                        </Select>
                                    </FormControl>}
                            </Grid>
                            {((currentUser?.settings?.role === "Parent") || (currentUser?.settings?.availableRoles.includes("Parent"))) && (
                                <>
                                    <Grid item xs={12} sx={{ mt: 2 }}>
                                        <small style={{ color: new_theme.palette.secondary.DarkPurple }}>{t("common:ASSIGN_CHILDREN_TO_PARENT")}</small>
                                        <Divider variant="insert" />
                                    </Grid>
                                    <Grid item xs={6} sx={{ mt: 2, display: 'flex', flexDirection: 'column' }}>
                                        <div className="flex-fill">
                                            {(assignedStudentsList?.length > 0) ? assignedStudentsList : <p>{t("common:DONT_HAVE_CHEIDREN")}</p>}
                                        </div>
                                    </Grid>
                                    <Grid item xs={6} className="align-items-end" sx={{ pt: 3, pl: 1, display: 'flex', flexDirection: 'column' }}>
                                        {editFormHelper.openType !== 'PREVIEW' && (
                                            <StyledButton onClick={() => setAssignChildrenDrawer(true)} eVariant="primary" eSize="small">
                                                {t("common:ASSIGN_CHIDREN")}
                                            </StyledButton>
                                        )}
                                    </Grid>
                                </>
                            )}

                            <Grid item xs={12} sx={{ mt: 3 }}>
                                <Typography variant="subtitle3" component="h6">{t("sentinel-MyUsers-Users:CONTACT_DETAILS")}</Typography>
                            </Grid>
                            {/* <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Divider variant="insert" sx={{ mb: 4, my: 2 }} />
                            </Grid> */}

                            <Grid item xs={12} sm={6} md={3}>
                                <ETextField label={t("common:BUILD/FLAT")}
                                    fullWidth={true}
                                    variant={editFormHelper.openType === 'PREVIEW' ? 'standard' : 'filled'}
                                    name={['details', 'buildNr']}

                                    InputProps={{
                                        readOnly: editFormHelper.openType === 'PREVIEW',
                                        disableUnderline: editFormHelper.openType === 'PREVIEW',
                                    }}
                                    value={currentUser.details.buildNr}
                                    onInput={({ target }) => {
                                        setEditFormHelper(p => ({ ...p, isBlocking: true }));
                                        let args = target.name.split(',');
                                        setCurrentUser(p => ({ ...p, [args?.[0]]: { ...p[args[0]], [args?.[1]]: target.value } }));
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <ETextField label={t("common:STREET")}
                                    fullWidth={true}
                                    variant={editFormHelper.openType === 'PREVIEW' ? 'standard' : 'filled'}
                                    name={['details', 'street']}

                                    InputProps={{
                                        readOnly: editFormHelper.openType === 'PREVIEW',
                                        disableUnderline: editFormHelper.openType === 'PREVIEW',
                                    }}
                                    value={currentUser.details.street}
                                    onInput={({ target }) => {
                                        setEditFormHelper(p => ({ ...p, isBlocking: true }));
                                        let args = target.name.split(',');
                                        setCurrentUser(p => ({ ...p, [args?.[0]]: { ...p[args[0]], [args?.[1]]: target.value } }));
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <ETextField label={t("common:CITY")}
                                    fullWidth={true}
                                    variant={editFormHelper.openType === 'PREVIEW' ? 'standard' : 'filled'}
                                    name={['details', 'city']}

                                    InputProps={{
                                        readOnly: editFormHelper.openType === 'PREVIEW',
                                        disableUnderline: editFormHelper.openType === 'PREVIEW',
                                    }}
                                    value={currentUser.details.city}
                                    onInput={({ target }) => {
                                        setEditFormHelper(p => ({ ...p, isBlocking: true }));
                                        let args = target.name.split(',');
                                        setCurrentUser(p => ({ ...p, [args?.[0]]: { ...p[args[0]], [args?.[1]]: target.value } }));
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <ETextField label={t("common:POST CODE")}
                                    fullWidth={true}
                                    variant={editFormHelper.openType === 'PREVIEW' ? 'standard' : 'filled'}
                                    name={['details', 'postcode']}

                                    InputProps={{
                                        readOnly: editFormHelper.openType === 'PREVIEW',
                                        disableUnderline: editFormHelper.openType === 'PREVIEW',
                                    }}
                                    value={currentUser.details.postcode}
                                    onInput={({ target }) => {
                                        setEditFormHelper(p => ({ ...p, isBlocking: true }));
                                        let args = target.name.split(',');
                                        setCurrentUser(p => ({ ...p, [args?.[0]]: { ...p[args[0]], [args?.[1]]: target.value } }));
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <ETextField label={t("common:COUNTRY")}
                                    fullWidth={true}
                                    variant={editFormHelper.openType === 'PREVIEW' ? 'standard' : 'filled'}
                                    name={['details', 'country']}

                                    InputProps={{
                                        readOnly: editFormHelper.openType === 'PREVIEW',
                                        disableUnderline: editFormHelper.openType === 'PREVIEW',
                                    }}
                                    value={currentUser.details.country}
                                    onInput={({ target }) => {
                                        setEditFormHelper(p => ({ ...p, isBlocking: true }));
                                        let args = target.name.split(',');
                                        setCurrentUser(p => ({ ...p, [args?.[0]]: { ...p[args[0]], [args?.[1]]: target.value } }));
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <ETextField label={t("common:PHONE")}
                                    fullWidth={true}
                                    variant={editFormHelper.openType === 'PREVIEW' ? 'standard' : 'filled'}
                                    name={['details', 'phone']}

                                    InputProps={{
                                        readOnly: editFormHelper.openType === 'PREVIEW',
                                        disableUnderline: editFormHelper.openType === 'PREVIEW',
                                    }}
                                    value={currentUser.details.phone}
                                    onInput={({ target }) => {
                                        setEditFormHelper(p => ({ ...p, isBlocking: true }));
                                        let args = target.name.split(',');
                                        setCurrentUser(p => ({ ...p, [args?.[0]]: { ...p[args[0]], [args?.[1]]: target.value } }));
                                    }}
                                />
                            </Grid>

                            {getButtons()}


                        </Grid>

                        {activeTab === 'ROLES' && (
                            <AvailableRoles editFormHelper={editFormHelper}
                                setEditFormHelper={setEditFormHelper}
                                currentUser={currentUser}
                                setCurrentUser={setCurrentUser} />
                        )}
                        {activeTab === 'PERMISSIONS' && (
                            <PermissionList editFormHelper={editFormHelper}
                                setEditFormHelper={setEditFormHelper}
                                currentUser={currentUser}
                                setCurrentUser={setCurrentUser} />
                        )}
                        {activeTab === 'CERTIFICATION' && (
                            <CertificationList editFormHelper={editFormHelper}
                                setEditFormHelper={setEditFormHelper}
                                currentUser={currentUser}
                                setCurrentUser={setCurrentUser} />
                        )}
                    </Grid>

                    <SwipeableDrawer
                        PaperProps={{
                            style: {
                                backgroundColor: theme.palette.neutrals.white,
                                maxWidth: "450px"
                            }
                        }}
                        onOpen=''
                        anchor="right"
                        open={assignChildrenDrawer}
                        onClose={() => {
                            setAssignChildrenDrawer(false);
                            setSearchingText('');
                            //pushAssignedStudents();
                        }}
                    >
                        <List z
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                            subheader={
                                <ListSubheader disableSticky="true" component="div" id="nested-list-subheader">
                                    <Grid container sx={{ py: 2 }}>
                                        <Grid item xs={12}>
                                            <Typography variant="h3" component="h2" sx={{ mt: 2, mb: 2 }} style={{ fontSize: "32px", textAlign: 'center' }}>
                                                {t("Select students")}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sx={{ px: 3, mb: 2 }}>
                                            <SearchField
                                                className="text-primary"
                                                value={searchingText}
                                                onChange={({ target }) => { TableSearch(target.value, students, setSearchingText, setFilteredData) }}
                                                clearSearch={() => TableSearch('', students, setSearchingText, setFilteredData)}
                                            />
                                        </Grid>
                                    </Grid>
                                </ListSubheader>}
                        >
                            {filteredData?.length > 0 ? filteredData.map((item, index) => (
                                <ListItem key={item._id} sx={{ pl: 3 }}>
                                    <ListItemIcon >
                                        <Checkbox
                                            edge="start"
                                            checked={item.isSelected}
                                            tabIndex={index}
                                            size="small"
                                            color="primary"
                                            inputProps={{ 'aria-labelledby': index }}
                                            onChange={(e, isS) => {
                                                setStudents(p => {
                                                    let val = Object.assign([], p);
                                                    val[index].isSelected = isS;
                                                    return val;
                                                });
                                                if (isS) {
                                                    setCurrentUser(p => ({
                                                        ...p,
                                                        details: {
                                                            ...p.details,
                                                            children: [...p.details.children || [], { _id: item._id, name: item?.name, surname: item?.surname }]
                                                        }
                                                    }));
                                                } else {
                                                    setCurrentUser(p => {
                                                        let val = Object.assign({}, p);
                                                        val.details.children = val.details.children.filter(ch => ch._id !== item._id);
                                                        return val;
                                                    });
                                                }
                                            }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={`${item?.name} ${item?.surname}`}
                                        secondary={`${item?.username}`}
                                    />
                                </ListItem>
                            )) : <p >{t('No data')}</p>}
                        </List>
                    </SwipeableDrawer>
                    <CardActionArea>
                        <CardActions sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Grid container>
                            </Grid>
                        </CardActions>
                    </CardActionArea>
                    <ConfirmActionModal actionModal={actionModal}
                        setActionModal={setActionModal}
                        actionModalTitle={t("Removing user")}
                        actionModalMessage={t("Are you sure you want to remove user? The action is not reversible!")}
                    />
                </div>
            </Grid >
        </ThemeProvider >
    )
}

