import React, { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    Divider,
    FormHelperText,
    Typography,
    Grid
} from "@mui/material";
import Chip from "@mui/material/Chip";
import CardContent from "@mui/material/CardContent";
import ConfirmActionModal from "components/common/ConfirmActionModal";
import { useTranslation } from "react-i18next";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import moduleCoreService from "services/module-core.service";
import FormControl from "@mui/material/FormControl";
import { ETextField, ESelect } from "new_styled_components";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { new_theme } from "NewMuiTheme";
import Confirm from "components/common/Hooks/Confirm";
import { usePrompt } from "components/common/Hooks/usePrompt";
import TextField from '@mui/material/TextField';
import { ThemeProvider } from "@mui/material";
import StyledButton from "new_styled_components/Button/Button.styled";
import './authorizations.scss'

const initialUserState = {
    name: "",
    description: "",
    module: "",
    access: false,
    edit: false,
    moduleName: "",
    selectAccess: "",
};

const levels = ['1', '2', '3', '4', '5', '6', '7', '8', '9A', '9B', '10A', '10B', '11A', '11B', '12', '13', '14'];

export default function NewPermissionForm({ editFormHelper, setEditFormHelper, setCurrentTab }) {
    const { t } = useTranslation(['common', 'sentinel-Admin-Auth']);
    const { isConfirmed } = Confirm();
    const { F_showToastMessage, F_hasPermissionTo, F_getHelper, F_handleSetShowLoader } = useMainContext();
    const { manageScopeIds } = F_getHelper();
    const [actionModal, setActionModal] = useState({ isOpen: false, returnedValue: false });
    const [activeTab, setActiveTab] = useState('INFORMATION');
    const { userPermissions, user } = F_getHelper();
    const [currentPermission, setCurrentPermission] = useState(initialUserState);
    const [students, setStudents] = useState([]);
    const [selectedPermissions, setSelectedPermission] = useState([]);
    const [visiblePassword, setVisiblePassword] = useState(false);
    const [assignChildrenDrawer, setAssignChildrenDrawer] = useState(false);
    const [searchingText, setSearchingText] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [validators, setValidators] = useState({ email: false, username: false, usernameAvailable: false, name: false, surname: false, password: false, passwordConfirm: false });
    const [errorValidator, setErrorValidator]= useState({});
    const permissions = [
        "Home",
        "Admin - Authorization",
        "My Teams - Teams",
        "My Teams - BC Test Registrations",
        "My Teams - Results",
        "My Teams - Statistics",
        "My Users - Users",
        "My Users - BC Test Registrations",
        "My Projects",
        "My Diary",
        "My Trainings - BrainCore Coach",
        "My Trainings - BrainCore Trainer",
        "My Space - My Results",
        "My Space - Virtual Coach",
        "My Space - My Resources"
        // "Interactive CS - authomatized projects - potential group",
        // "Interactive CS - authomatized projects - suggested solution",
        // "Interactive CS - authomatized projects - group solution selection",
        // "Interactive CS - authomatized projects - follow up project creation",
        // "Interactive CS - recruting",
        // "Interactive CS - custom projects",
        // "Interactive CS - employee management",
        // "Neuro Functions - dysfunctioning groups matrix",
        // "Neuro Functions - team creation",
        // "Neuro Functions - career project",
        // "Neuro Functions - psy risks (quiet quitter/opportunist)",
        // "Neuro Functions - behaviourist matrix",
        // "Neuro Functions - management style advices",
        // "Neuro Functions - gamification/contests"
    ];



    useEffect(() => {
        // to avoid the empty tab when changing users from assistant to non-assistant
        setActiveTab('INFORMATION');
        setCurrentTab(0);


        if (editFormHelper.isOpen && editFormHelper.openType === 'EditPermission') {
            moduleCoreService.readPermision(editFormHelper.userId).then(res => {
                if (res.status === 200 && res.data) {
                    let permissionObj = res.data.data;
                    if (permissionObj.access) {
                        let selectPer = [...selectedPermissions, 'View'];
                        setSelectedPermission(selectPer);
                    }
                    if (permissionObj.edit) {
                        let select = [...selectedPermissions, 'Edit'];
                        setSelectedPermission(select)
                    }
                    setCurrentPermission(res.data.data);

                    F_handleSetShowLoader(false)
                }
            }).catch(err => console.log(err));
        } else if (editFormHelper.isOpen && editFormHelper.openType === 'CreatePermission') {
            setCurrentPermission(initialUserState);
        }
    }, [editFormHelper.isOpen, editFormHelper.userId]);






    const save = async () => {
        let reqBody = { ...currentPermission, 'module': manageScopeIds.moduleId }
        let error = await validateFields()
        if (Object.keys(error).length===0) {

            if (editFormHelper.openType === "CreatePermission") {
                moduleCoreService.addPermission(reqBody).then(res => {
                    F_showToastMessage(res.data.message, res.status === 200 ? t('common:SUCCESS') : t('common:WARNING'));
                    setEditFormHelper({ isOpen: false, openType: 'PREVIEW', userId: undefined, isBlocking: false });
                    setCurrentTab(1);
                }).catch(error => {
                    const re1 = /username/i;
                    const re2 = /e-mail/i;
                    if (error?.response?.data?.message || re1.test(error?.response?.data?.message)) {
                        F_showToastMessage(`${t('common:USERNAME_TAKEN')}`, "error");
                        setCurrentPermission(p => ({ ...p, username: '' }));
                    }
                    if (error?.response?.data?.message?.keyValue?.email || re2.test(error?.response?.data?.message)) {
                        F_showToastMessage(`${t('common:EMAIL_TAKEN')}`, "error");
                        setCurrentPermission(p => ({ ...p, email: '' }));
                    }
                    // if(error?.response?.data?.message){
                    //     F_showToastMessage(error?.response?.data?.message, "error");
                    // }
                })
            } 
            else {
                moduleCoreService.editPermission(currentPermission).then(res => {
                    //display res.message in toast
                    F_showToastMessage(res.data.message, res.status === 200 ? t('common:SUCCESS') : t('common:WARNING'));
                    setEditFormHelper({ isOpen: false, openType: 'PREVIEW', userId: undefined, isBlocking: false })
                    setCurrentTab(1);
                }).catch(error => {
                    if (error?.response?.data?.message?.keyValue?.email) {
                        F_showToastMessage(`${t('common:EMAIL_TAKEN')}`, "error");
                        setCurrentPermission(p => ({ ...p, email: '' }));
                    }
                });
            }
        } else {
            // F_showToastMessage(t("Correct wrong fields then save", "warning"));
        }

    }

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setCurrentPermission(p => ({ ...p, 'moduleName': value }))
    };
    const handleChangeAccess = (event) => {
        const {
            target: { value },
        } = event;
        var val = typeof value === 'string' ? value.split(',') : value;
        setCurrentPermission(p => ({ ...p, 'edit': val.includes('Edit') }))
        setCurrentPermission(p => ({ ...p, 'access': val.includes('View') }))


        setSelectedPermission(val)
    };
    async function validateFields() {
        let isValidate = {};
        if(!currentPermission?.name){
            isValidate.name = t('common:NAME_REQUIRED');
        } 
        else if(currentPermission?.name?.length < 3){
            isValidate.name = t('common:NAME_LENGTH');
        }

        if(currentPermission?.moduleName?.length == 0){
            isValidate.moduleName = t('sentinel-Admin-Auth:PERMISSION_REQUIRED');
        }

        if(!currentPermission?.access && !currentPermission?.edit){
            isValidate.selectAccess = t('sentinel-Admin-Auth:ACCESS_REQUIRED');
        }
        setErrorValidator(isValidate);
        return isValidate;
    };
    const back = () => {
        setEditFormHelper({ isOpen: false, openType: 'PREVIEW', userId: undefined, isBlocking: false })
        setCurrentTab(1)
    }
    const levelList = levels?.length > 0 ? levels.map((level, index) => <MenuItem key={index} value={level}>{level}</MenuItem>) : [];
    const companiesList = companies.length > 0 ? companies.map((item) => (<MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>)) : [];

    const assignedStudentsList = currentPermission?.details?.children?.map((item, index) =>
        <Chip
            className="m-1"
            key={item._id}
            label={`${item.name} ${item.surname}`}
        />
    );

    const renderUserAvatar = () => {
        switch (currentPermission?.settings?.role) {
            case "Root": return "Root";
            case "EcoManager": return "EcoMan";
            case "NetworkManager": return "NetworkMan";
            case "ModuleManager": return "ModuleMan";
            case "Assistant": return "ModuleMan";
            case "Architect": return "Architect";
            case "Librarian": return "Librarian";
            case "Trainee": return "Student";
            case "Parent": return "Parent";
            case "Trainer": {
                if (userPermissions.isClassManager) {
                    return "ClassMan";
                } else {
                    return "Teacher"
                }
            }
            default: return "Student";
        }
    }
    useEffect(() => {
        if('moduleName' in errorValidator){
            validateFields();
        }
        if('selectAccess' in errorValidator){
            validateFields();
        }
    }, [currentPermission?.moduleName, currentPermission?.access, currentPermission?.edit]);
    return (
        <ThemeProvider theme={new_theme}>
            <Card className="permission-card">
                <CardContent sx={{padding: '0'}}>
                    <Grid container>
                        <Grid item xs={12} className='permisionForm-grid'>
                            <Grid container className="permisionForm" spacing={2}>
                                <Grid item xs={12} sx={{ mb: 3 }}>
                                    <Typography variant="h1" component="h1">{t("sentinel-Admin-Auth:CREATE_PERMISSION")}</Typography>
                                    <Divider variant="insert" className='heading_divider' />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <ETextField
                                    label={t("sentinel-Admin-Auth:ENTER_NAME")} 
                                    variant="filled"
                                    size="medium"
                                    name="name"
                                    sx={{mb: 0, width: '100%'}} 
                                    onInput={({ target }) => {
                                        setEditFormHelper(p => ({ ...p, isBlocking: true }))
                                        setCurrentPermission(p => ({ ...p, [target.name]: target.value }))
                                        if('name' in errorValidator){
                                            validateFields();
                                        }
                                    }} value={currentPermission.name}
                                    error={'name' in errorValidator}
                                    helperText={'name' in errorValidator && errorValidator?.name} />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <ESelect
                                        type="round"
                                        size="medium"
                                        label={t("sentinel-Admin-Auth:SELECT_MODULE")}
                                        value={currentPermission.moduleName}
                                        onChange={handleChange}
                                        error={'moduleName' in errorValidator}
                                        helperText={'moduleName' in errorValidator && errorValidator?.moduleName}
                                    >
                                        {
                                            permissions.map((p) => <MenuItem value={p}>{p}</MenuItem>)
                                        }
                                    </ESelect>
                                    { 'moduleName' in errorValidator && <FormHelperText sx={{color: new_theme.palette.error.main}}>{errorValidator?.moduleName}</FormHelperText>}
                                </Grid>

                                <Grid item xs={12} sm={6} md={4}>
                                    <ESelect
                                        type="round"
                                        size="medium"
                                        labelId="AccessLabel"
                                        label={t("sentinel-Admin-Auth:SELECT_ACCESS")}
                                        id="demo-simple-select"
                                        multiple
                                        onChange={handleChangeAccess}
                                        value={selectedPermissions}
                                        error={'selectAccess' in errorValidator}
                                        helperText={'selectAccess' in errorValidator && errorValidator?.selectAccess}
                                    >
                                        <MenuItem value={t("common:VIEW")} >
                                            <div className="inline-center">
                                                <Checkbox checked={currentPermission.access} />
                                                <ListItemText primary={t("common:VIEW")} />
                                            </div>
                                        </MenuItem>
                                        <MenuItem value={t("common:EDIT")}>
                                            <div className="inline-center">
                                                <Checkbox checked={currentPermission.edit} />
                                                <ListItemText primary={t("common:EDIT")} />
                                            </div>
                                        </MenuItem>
                                    </ESelect>
                                    { 'selectAccess' in errorValidator && <FormHelperText sx={{color: new_theme.palette.error.main}}>{errorValidator?.selectAccess}</FormHelperText>}
                                </Grid>

                                <Grid item xs={12} sm={12} md={12}>
                                    <ETextField
                                        label={t("sentinel-Admin-Auth:ADD_DESCRIPTION")}
                                        variant="filled"
                                        size="medium"
                                        name="description"
                                        value={currentPermission.description}
                                        onInput={({ target }) => {
                                            setEditFormHelper(p => ({ ...p, isBlocking: true }))
                                            setCurrentPermission(p => ({ ...p, [target.name]: target.value }))
                                        }}
                                    />
                                </Grid>

                            </Grid>
                            <Grid item xs={12}>
                                <div className="userbtn btn-flex btn-grid-mb">
                                    <StyledButton eVariant="secondary" eSize="small" onClick={back}>{t("common:BACK")}</StyledButton>
                                    <StyledButton eVariant="primary" eSize="small" className="submitBtn" onClick={save}>{t("common:SUBMIT")}</StyledButton>
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>

                </CardContent>

                <ConfirmActionModal actionModal={actionModal}
                    setActionModal={setActionModal}
                    actionModalTitle={t("common:REMOVE_USER")}
                    actionModalMessage={t("sentinel-Admin-Auth:CONFIRM_REMOVE_PERMISSION")}
                />
            </Card>
        </ThemeProvider>
    )
}