import React, { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    Divider,
    FormHelperText,
    IconButton, 
    ListSubheader,
    Typography,
    Grid
} from "@mui/material";
import Chip from "@mui/material/Chip";
import CardContent from "@mui/material/CardContent";
import ConfirmActionModal from "../../../common/ConfirmActionModal";
import { useTranslation } from "react-i18next";
import { useMainContext } from "../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import userService from "services/user.service";
import moduleCoreService from "services/module-core.service";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import { ETextField, ESelect } from "new_styled_components";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SearchField from "../../../common/Search/SearchField";
import TableSearch from "../../../common/Table/TableSearch";
import InternshipService from "services/internship.service";
import AuthService from "services/auth.service";
import Confirm from "components/common/Hooks/Confirm";
import { usePrompt } from "components/common/Hooks/usePrompt";
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import ModuleCoreService from "services/module-core.service"
import { ThemeProvider } from "@mui/material";
import { new_theme } from "NewMuiTheme";
import StyledButton from "new_styled_components/Button/Button.styled";


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const initialRoleState = {
    name: "",
    description: "",
    permissions: [],
};

const levels = ['1', '2', '3', '4', '5', '6', '7', '8', '9A', '9B', '10A', '10B', '11A', '11B', '12', '13', '14'];

export default function NewUserForm({ editFormHelper, setEditFormHelper }) {
    const { t } = useTranslation(['common', 'sentinel-Admin-Auth']);
    const { isConfirmed } = Confirm();
    const { F_showToastMessage, F_hasPermissionTo, F_getHelper, F_handleSetShowLoader } = useMainContext();
    const { manageScopeIds } = F_getHelper();
    const [actionModal, setActionModal] = useState({ isOpen: false, returnedValue: false });
    const [activeTab, setActiveTab] = useState('INFORMATION');
    const { userPermissions, user } = F_getHelper();
    const [currentUser, setCurrentUser] = useState();
    const [currentRole, setCurrentRole] = useState(initialRoleState)
    const [students, setStudents] = useState([]);
    const [permissions, setPermission] = useState([]);
    const [visiblePassword, setVisiblePassword] = useState(false);
    const [assignChildrenDrawer, setAssignChildrenDrawer] = useState(false);
    const [searchingText, setSearchingText] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [validators, setValidators] = useState({ email: false, username: false, usernameAvailable: false, name: false, surname: false, password: false, passwordConfirm: false });
    const { currentScreenSize } = useMainContext();
    const [currentTab, setCurrentTab] = useState(0);
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
    const [errorValidator, setErrorValidator]= useState({});

    useEffect(() => {
        F_handleSetShowLoader(true)
        if (permissions.length == 0) {
            ModuleCoreService.readAllPermision().then(res => {
                console.log(res.data);
                setPermission(res.data.data)
                F_handleSetShowLoader(false);
            }).catch(error => console.error(error))
        }
    }, [])


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
            console.log("In Edit");
            moduleCoreService.readRole(editFormHelper.userId).then(res => {
                if (res.status === 200 && res.data) {
                    let permissions=res.data.data.permissions==null?[]:res.data.data.permissions.map((perm)=>perm._id);
                    let role={...currentRole,'name':res.data.data.roleMaster.name,'description':res.data.data.roleMaster.description,'permissions':permissions,'_id':res.data.data.roleMaster._id}
                    setCurrentRole(role);
                 
                    F_handleSetShowLoader(false)
                }
            }).catch(err => console.log(err));
        } else if (editFormHelper.isOpen && editFormHelper.openType === 'ADD') {
            setCurrentUser(initialRoleState);
        }
    }, [editFormHelper.isOpen, editFormHelper.userId]);

    useEffect(() => {
        if (actionModal.returnedValue) {
            remove();
        }
    }, [actionModal.returnedValue]);

    useEffect(() => {
        setFilteredData(students);
    }, [students]);

    const remove = () => {
        moduleCoreService.deleteRole(editFormHelper.userId).then(res => {
            F_showToastMessage(t("sentinel-Admin-Auth:ROLE_REMOVED", "success"))
            setEditFormHelper({ isOpen: false, openType: 'PREVIEW', userId: undefined, isBlocking: false })
        }
        ).catch(error => console.error(error))
    }

    const save = async () => {
        let reqBody = { ...currentRole, 'module': manageScopeIds.moduleId }
        let error = await validateFields()
        if (Object.keys(error).length===0) {
            if (editFormHelper.userId === "NEW") {
                moduleCoreService.addRole(reqBody).then(res => {
                    F_showToastMessage(res.data.message, res.status === 200 ? "success" : "warning");
                    setEditFormHelper({ isOpen: false, openType: 'PREVIEW', userId: undefined, isBlocking: false })
                }).catch(error => {
                    const re1 = /username/i;
                    const re2 = /e-mail/i;
                    if (error?.response?.data?.message || re1.test(error?.response?.data?.message)) {
                        F_showToastMessage(`${t("sentinel-Admin-Auth:ROLE_NAME_TAKEN")}`, "error");
                        setCurrentUser(p => ({ ...p, username: '' }));
                    }
                    if (error?.response?.data?.message?.keyValue?.email || re2.test(error?.response?.data?.message)) {
                        F_showToastMessage(`${t('common:EMAIL_TAKEN')}`, "error");
                        setCurrentUser(p => ({ ...p, email: '' }));
                    }
                })
            } else {
                let body={"roleMaster":{
                    "name":reqBody.name,
                    "description":reqBody.description,
                    "module":reqBody.module
                },"permissions":reqBody.permissions}
                moduleCoreService.editRole(body,editFormHelper.userId).then(res => {
                   
                    //display res.message in toast
                    F_showToastMessage(res.data.message, res.status === 200 ? t('common:SUCCESS') : t('common:WARNING'));
                    setEditFormHelper({ isOpen: false, openType: 'PREVIEW', userId: undefined, isBlocking: false })
                }).catch(error => {
                    if (error?.response?.data?.message?.keyValue?.email) {
                        F_showToastMessage(`${t('common:EMAIL_TAKEN')}`, "error");
                        setCurrentUser(p => ({ ...p, email: '' }));
                    }else{
                        F_showToastMessage(error?.response?.data?.message,"error")
                    }
                });
            }
        } else {
            // F_showToastMessage(t("Correct wrong fields then save", "warning"));
        }

    }

    async function checkUsername() {
        let { data: { exists } } = await AuthService.isUsernameTaken(currentUser.username, currentUser._id);
        setIsUsernameAvailable(() => !exists)
        setValidators(p => ({ ...p, usernameAvailable: exists }))
        return !exists;
    }

    async function validateFields() {
        let isValidate = {};


        // if (currentRole.name.length < 3 ) {
        //     setValidators(p => ({ ...p, username: true }));
        //     isValidate = false;
        // }
        if(!currentRole?.name){
            isValidate.name = t('common:NAME_REQUIRED');
        } else if(currentRole?.name?.length < 3){
            isValidate.name = t('common:NAME_LENGTH');
        }
        if(currentRole?.permissions?.length == 0){
            isValidate.permissions = t('sentinel-Admin-Auth:PERMISSION_REQUIRED');
        }

        setErrorValidator(isValidate);
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

    const renderUserAvatar = () => {
        switch (currentUser?.settings?.role) {
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

    const [value, setValue] = React.useState([]);
    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        var val = typeof value === 'string' ? value.split(',') : value;
        setCurrentRole(p => ({ ...p, 'permissions': val }))
    };

    useEffect(() => {
        if('permissions' in errorValidator){
            validateFields();
        }
    }, [currentRole?.permissions]);

    const [checked, setChecked] = React.useState([true, false]);

    const handleChange1 = (event) => {
        setChecked([event.target.checked, event.target.checked]);
    };

    const handleChange2 = (event) => {
        setChecked([event.target.checked, checked[1]]);
    };

    const handleChange3 = (event) => {
        setChecked([checked[0], event.target.checked]);
    };
    const back = () => {
        setEditFormHelper({ isOpen: false, openType: 'PREVIEW', userId: undefined, isBlocking: false })

    }

    const children = (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormControlLabel
                label="Child 1"
                className="groupChild"
                control={<Checkbox checked={checked[0]} onChange={handleChange2} />}
            />
            <FormControlLabel
                label="Child 2"
                className="groupChild"
                control={<Checkbox checked={checked[1]} onChange={handleChange3} />}
            />
        </Box>
    );

    return (
        <ThemeProvider theme={new_theme}>
            <Card style={{ boxShadow: 'none' }}>
                <CardHeader sx={{p:0}}/>
                <form>
                    <CardContent className="cardContent" sx={{padding: '0'}}>

                    <Grid container className="admin_content">
                        <Grid item xs={12}>
                            <div className="admin_heading">
                                <Grid>
                                    <Typography variant="h1" component="h1" >{editFormHelper.openType=="ADD"?t("sentinel-Admin-Auth:CREATE_NEW_ROLE"):t("sentinel-Admin-Auth:EDIT_ROLE")}</Typography>
                                    <Divider variant="insert" className='heading_divider' />
                                </Grid>
                            </div>
                            <Box sx={{ gap: 20 }}>
                                <Grid container>
                                    <Grid item xs={12} sm={12} md={5}>
                                        <ETextField id="outlined-basic" 
                                        size="medium"
                                        label={t("sentinel-Admin-Auth:ENTER_ROLE_NAME")}
                                        name="name" 
                                        variant="filled"
                                        margin="dense"
                                        onInput={({ target }) => {
                                                        setEditFormHelper(p => ({ ...p, isBlocking: true }))
                                                        setCurrentRole(p => ({ ...p, [target.name]: target.value }))
                                                        if('name' in errorValidator){
                                                            validateFields();
                                                        }
                                                    }}
                                                    value={currentRole.name}
                                                    error={'name' in errorValidator}
                                                    helperText={'name' in errorValidator && errorValidator?.name}
                                                    />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ETextField 
                                        id="outlined-basic" 
                                        label={t("sentinel-Admin-Auth:ADD_DESCRIPTION")} 
                                        size="medium" 
                                        margin="dense" 
                                        variant="filled" 
                                        name="description" fullWidth  onInput={({ target }) => {
                                                        setEditFormHelper(p => ({ ...p, isBlocking: true }))
                                                        setCurrentRole(p => ({ ...p, [target.name]: target.value }))
                                                    }}
                                                value={currentRole.description}
                                                />
                                    </Grid>
                                </Grid>
                            </Box>
                            <Grid container className="mt-3">
                                <Grid item xs={12}>
                                    <Typography className="txtManagePermission" variant="body2" component="h4" sx={{ textAlign: "left", mt: 1 }}>{t("Manage Permission")}</Typography>
                                </Grid>
                                <Grid item xs={12} md={6} lg={3}>
                                        <Box sx={{ width: '100%', mt: 2 }}>
                                            <ESelect
                                                type="round"
                                                size="medium"
                                                id="demo-simple-select"
                                                multiple
                                                value={currentRole.permissions}
                                                onChange={handleChange}
                                                error={'permissions' in errorValidator}
                                                helperText={'permissions' in errorValidator && errorValidator?.permissions}
                                                label={t("sentinel-Admin-Auth:SELECT_PERMISSION")}
                                            >
                                                {
                                                    permissions.map((permission) => <MenuItem value={permission._id}>{permission.name}</MenuItem>)
                                                }
                                            </ESelect>
                                            {'permissions' in errorValidator && <FormHelperText sx={{ color: new_theme.palette.error.main }}>{errorValidator?.permissions}</FormHelperText>}
                                        </Box>
                                    </Grid>
                                </Grid>

                                {/* <Grid container className="mt-3">
                                <Avatar src={`/img/user_icons_by_roles/${renderUserAvatar()}.png`} style={{ width: '90px', height: '90px', margin: isWidthUp('md', currentScreenSize) ? "" : "auto" }} alt="user-icon-avatar" />
                                <div className="ml-3">
                                    <Typography style={{ textAlign: isWidthUp('sm', currentScreenSize) ? "" : "auto" }} className={currentUser.settings?.isActive ? 'text-success' : 'text-danger'}>{currentUser.settings?.isActive ? ' Active ' : 'InActive'} </Typography>
                                    <Typography className="mt-2" variant="h5" component="h5"
                                        style={{ maxWidth: "380px", fontSize: isWidthUp('sm', currentScreenSize) ? "26px" : "18px" }}>
                                        t("Enter role name")
                                    </Typography>
                                </div>
                                <div style={{ width: "100%" }}></div>

                                <Grid item xs={12} className='mt-3'>
                                    <Typography variant="h5" component="h5" style={{ textAlign: "left" }}>Account information</Typography>
                                </Grid>

                                <Grid item xs={12} md={6} className="d-flex flex-column px-1">
                                    <TextField label={t("Name of user")} style={{ maxWidth: '400px' }} margin="dense"
                                        fullWidth={true}
                                        variant={editFormHelper.openType === 'PREVIEW' ? 'standard' : 'filled'}
                                        name='name'
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            readOnly: editFormHelper.openType === 'PREVIEW',
                                            disableUnderline: editFormHelper.openType === 'PREVIEW',
                                        }}
                                        value={currentUser.name}
                                        required={true}
                                        helperText={validators.name ? "Incorrect name [3-20 characters]" : null}
                                        error={validators.name}
                                        onInput={({ target }) => {
                                            setEditFormHelper(p => ({ ...p, isBlocking: true }))
                                            setCurrentUser(p => ({ ...p, [target.name]: target.value }))
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6} className="d-flex flex-column px-1">
                                    <TextField label={t("Surname")} style={{ maxWidth: '400px' }} margin="dense"
                                        fullWidth={true}
                                        name='surname'
                                        variant={editFormHelper.openType === 'PREVIEW' ? 'standard' : 'filled'}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            readOnly: editFormHelper.openType === 'PREVIEW',
                                            disableUnderline: editFormHelper.openType === 'PREVIEW',
                                        }}
                                        value={currentUser.surname}
                                        required={true}
                                        helperText={validators.surname ? "Incorrect surname [3-20 characters]" : null}
                                        error={validators.surname}
                                        onInput={({ target }) => {
                                            setEditFormHelper(p => ({ ...p, isBlocking: true }))
                                            setCurrentUser(p => ({ ...p, [target.name]: target.value }))
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6} className="d-flex flex-column px-1">
                                    {(currentUser?.settings?.role === "Trainee" || currentUser?.settings?.availableRoles.includes("Trainee")) &&
                                        <FormControl style={{ maxWidth: '400px' }} fullWidth={true} margin="dense"
                                            variant={editFormHelper.openType === 'PREVIEW' ? 'standard' : "filled"}
                                        >
                                            <InputLabel id="select-student-label">{t("Trainee level")}</InputLabel>
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
                                
                            </Grid> */}


                            </Grid>
                        </Grid>
                        <SwipeableDrawer
                            PaperProps={{
                                style: {
                                    backgroundColor: new_theme.palette.neutrals.white,
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
                            <List
                                component="nav"
                                aria-labelledby="nested-list-subheader"
                                subheader={
                                    <ListSubheader disableSticky="true" component="div" id="nested-list-subheader">
                                        <Grid container>
                                            <Grid item xs={12}>
                                                <Typography variant="h3" component="h2" sx={{mt:2, mb:2}} style={{ fontSize: "32px" }}>
                                                    {t("common:SELECT_USERS")}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sx={{mb:2, px:3}}>
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
                                    <ListItem key={item._id} sx={{pl:3}}>
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
                                )) : <p>{t('common:NO_DATA')}</p>}
                            </List>
                        </SwipeableDrawer>
                    </CardContent>
                    <Grid container className="gap-20 ">
                        <Grid item className="btn-flex btn-grid-mb" style={{textAlign: 'right', width: '100%'}}>
                            <StyledButton eVariant="secondary" eSize="small" onClick={back} style={{marginRight: "10px"}}>
                                {t("common:BACK")}
                            </StyledButton>
                            {
                                editFormHelper.openType === "ADD" &&
                                <StyledButton eVariant="primary" eSize="small" onClick={save}>
                                    {t("common:SUBMIT")}
                                </StyledButton>
                            }
                            {
                                editFormHelper.openType === "EDIT" &&
                                <StyledButton eVariant="primary" eSize="small" onClick={save}>
                                    {t("common:SAVE")}
                                </StyledButton>
                            }
                        </Grid>
                    

                    </Grid>
                </form>
                
            </Card>
        </ThemeProvider>
    )
}