import React, { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    Divider,
    IconButton, ListSubheader,
} from "@material-ui/core";
import { Typography, Grid, TextField } from "@mui/material";
import { ETextField } from "new_styled_components";
import Chip from "@mui/material/Chip";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import ConfirmActionModal from "../../../../common/ConfirmActionModal";
import { useTranslation } from "react-i18next";
import { useMainContext } from "../../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import userService from "../../../../../services/user.service";
import moduleCoreService from "../../../../../services/module-core.service";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SearchField from "../../../../common/Search/SearchField";
import TableSearch from "../../../../common/Table/TableSearch";
import AvailableRoles from "../AvailableRoles/AvailableRoles";
import PermissionList from "../PermissionList";
import InternshipService from "../../../../../services/internship.service";
import { EUserRoleChip } from "../../../../../styled_components";
import Avatar from "@mui/material/Avatar";
import { isWidthUp } from "@mui/material/Hidden/withWidth";
import { ETabBar, ETab } from "../../../../../styled_components";
import { makeStyles } from "@material-ui/core/styles";
import { theme } from "../../../../../MuiTheme";
import SyncProblemIcon from '@mui/icons-material/SyncProblem';
import VerifiedIcon from '@mui/icons-material/Verified';
import AuthService from "services/auth.service";
import Confirm from "components/common/Hooks/Confirm";
import { usePrompt } from "components/common/Hooks/usePrompt";
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import FormControl  from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import NativeSelect from "@mui/material/NativeSelect";
import Select from "@mui/material/Select";
import ModuleCoreService from "services/module-core.service"
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


const useStyles = makeStyles(theme => ({
    CardContentRoot: {
        overflow: "hidden"
    }
}));

const initialRoleState = {
    name: "",
    description:"",
    permissions:[]   
};

const levels = ['1', '2', '3', '4', '5', '6', '7', '8', '9A', '9B', '10A', '10B', '11A', '11B', '12', '13', '14'];

export default function NewUserForm({ editFormHelper, setEditFormHelper }) {
    const { t } = useTranslation();
    const { isConfirmed } = Confirm();
    const { F_showToastMessage, F_hasPermissionTo, F_getHelper, F_handleSetShowLoader } = useMainContext();
    const { manageScopeIds } = F_getHelper();
    const [actionModal, setActionModal] = useState({ isOpen: false, returnedValue: false });
    const [activeTab, setActiveTab] = useState('INFORMATION');
    const { userPermissions, user } = F_getHelper();
    const [currentUser, setCurrentUser] = useState();
    const [currentRole,setCurrentRole]=useState(initialRoleState)
    const [students, setStudents] = useState([]);
    const [permissions,setPermission]=useState([]);
    const [visiblePassword, setVisiblePassword] = useState(false);
    const [assignChildrenDrawer, setAssignChildrenDrawer] = useState(false);
    const [searchingText, setSearchingText] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [validators, setValidators] = useState({ email: false, username: false, usernameAvailable: false, name: false, surname: false, password: false, passwordConfirm: false });
    const { currentScreenSize } = useMainContext();
    const [currentTab, setCurrentTab] = useState(0);
    const classes = useStyles();
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
    
    useEffect(() => {
        F_handleSetShowLoader(true)
        if(permissions.length==0){
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
            userService.read(editFormHelper.userId).then(res => {
                if (res.status === 200 && res.data) {
                    setCurrentUser(res.data);
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
            setCurrentUser(initialRoleState);
            moduleCoreService.readAllTrainees(manageScopeIds.moduleId).then(res2 => {
                if (res2.data.length > 0) {
                    setStudents(res2.data);
                }
            });
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
        moduleCoreService.removeModuleUser(manageScopeIds.moduleId, editFormHelper.userId).then(res => {
            F_showToastMessage("User was removed", "success")
            setEditFormHelper({ isOpen: false, openType: 'PREVIEW', userId: undefined, isBlocking: false })
        }
        ).catch(error => console.error(error))
    }

    const save = async () => {
       
        if (await validateFields()) {

            if (editFormHelper.userId === "NEW") {
                moduleCoreService.addModuleUser(manageScopeIds.moduleId, currentUser).then(res => {
                    F_showToastMessage(res.data.message, res.status === 200 ? "success" : "warning");
                    setEditFormHelper({ isOpen: false, openType: 'PREVIEW', userId: undefined, isBlocking: false })
                }).catch(error => {
                    const re1 = /username/i;
                    const re2 = /e-mail/i;
                    if (error?.response?.data?.message?.keyValue?.username || re1.test(error?.response?.data?.message)) {
                        F_showToastMessage(`${t('Username is already taken, please choose another one or write correct characters')}`, "error");
                        setCurrentUser(p => ({ ...p, username: '' }));
                    }
                    if (error?.response?.data?.message?.keyValue?.email || re2.test(error?.response?.data?.message)) {
                        F_showToastMessage(`${t('E-mail is already taken, please choose another one')}`, "error");
                        setCurrentUser(p => ({ ...p, email: '' }));
                    }
                })
            } else {
                moduleCoreService.updateModuleUser(currentUser).then(res => {
                    //display res.message in toast
                    F_showToastMessage(res.data.message, res.status === 200 ? "success" : "warning");
                    setEditFormHelper({ isOpen: false, openType: 'PREVIEW', userId: undefined, isBlocking: false })
                }).catch(error => {
                    if (error?.response?.data?.message?.keyValue?.email) {
                        F_showToastMessage(`${t('E-mail is already taken, please choose another one')}`, "error");
                        setCurrentUser(p => ({ ...p, email: '' }));
                    }
                });
            }
        } else {
            F_showToastMessage("Correct wrong fields then save", "warning");
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
        // if(MSUser.email.length < 3 || MSUser.email.length > 20){
        //     setValidators(p=>({...p,email: true}));
        //     isValidate = false;
        // }else{
        //     setValidators(p=>({...p,email: false}));
        // }

        if (currentUser.username.length < 3 || currentUser.username.length > 20) {
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
        var val= typeof value === 'string' ? value.split(',') : value;
        setCurrentRole(p => ({ ...p, 'permissions': val }))
      };

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
        <Card className="p-2 d-flex flex-column m-0" style={{ boxShadow: 'none' }}>
            <CardHeader className='pb-0'
            // avatar={<Chip label={getFormType(editFormHelper.openType)} color="primary" />}
            />
            <CardContent className="cardContent" classes={{ root: classes.CardContentRoot }} >

                <Grid container>
                    <Grid item xs={12} className='mt-1'>
                        <div className="heading">
                        <Typography variant="h4" component="h4" style={{ textAlign: "left" }}>Create New Roles</Typography>
                        </div>
                        <box className="d-grid" style={{ gap: 20 }}>
                            <ETextField className="w-500" id="outlined-basic" label="Enter Role Name" name="name" variant="filled"  onInput={({ target }) => {
                                            setEditFormHelper(p => ({ ...p, isBlocking: true }))
                                            setCurrentRole(p => ({ ...p, [target.name]: target.value }))
                                        }}/>
                            <ETextField id="outlined-basic" multiline rows={4} label={t("Add Description")+"..."} variant="filled" name="description" fullWidth  onInput={({ target }) => {
                                            setEditFormHelper(p => ({ ...p, isBlocking: true }))
                                            setCurrentRole(p => ({ ...p, [target.name]: target.value }))
                                        }}/>
                        </box>
                        <Grid container className="mt-3">
                            <Typography className="txtManagePermission" variant="h4" component="h4" style={{ textAlign: "left" }}>Manage Permission</Typography>
                            <Grid item xs={12} className="d-flex mt-2 content_tabing">
                                <Box sx={{ width: '100%' }}>
                                    <box className="d-grid" style={{ gap: 20 }}>
                                        <FormControl className="w-500">
                                            <InputLabel id="demo-simple-select-label">Select User Permisions</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                multiple
                                                value={currentRole.permissions}
                                                label={t("Select Permissions")}
                                                onChange={handleChange}
                                            >
                                                {
                                                    permissions.map((permission)=><MenuItem value={permission._id}>{permission.name}</MenuItem>)
                                                }
                                                
                                            </Select>
                                        </FormControl>
                                    </box>

                                    {/* <ETabBar
                                    value={value} onChange={handleChange}
                                    style={{ minWidth: "280px" }}
                                    // value={currentTab}
                                    textColor="primary"
                                    variant="fullWidth"
                                    // onChange={(e, i) => { switchTabHandler(i) }}
                                    aria-label="tabs example"
                                    className="tab_style"
                                >
                                    <ETab className="createRoleTab" icon={<Checkbox edge="end" checked={user.isSelected}/>} label={t("Admin")} eSize='small' classes={{ root: classes.buttonRoot }} {...a11yProps(0)}/>
                                    
                                    <ETab className="createRoleTab" icon={<Checkbox edge="end" checked={user.isSelected}/>} label={t("Cognitive Space")} eSize='small' classes={{ root: classes.buttonRoot }} {...a11yProps(1)}/>
                                </ETabBar> */}

                                    {/* <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                        <Tab label="Item One" {...a11yProps(0)} />
                                        <Tab label="Item Two" {...a11yProps(1)} />
                                        <Tab label="Item Three" {...a11yProps(2)} />
                                        </Tabs>
                                    </Box> */}
                                    {/* <TabPanel value={value} index={0}>
                                    <div className="d-flex selectWrap">
                                        <div className="selectGroup">
                                            <FormControlLabel
                                                label="Parent"
                                                className="groupHead"
                                                control={
                                                <Checkbox
                                                    checked={checked[0] && checked[1]}
                                                    indeterminate={checked[0] !== checked[1]}
                                                    onChange={handleChange1}
                                                />
                                                }
                                            />
                                            {children}
                                        </div>
                                        <div className="selectGroup">
                                            <FormControlLabel
                                                label="Parent"
                                                className="groupHead"
                                                control={
                                                <Checkbox
                                                    checked={checked[0] && checked[1]}
                                                    indeterminate={checked[0] !== checked[1]}
                                                    onChange={handleChange1}
                                                />
                                                }
                                            />
                                            {children}
                                        </div>
                                        <div className="selectGroup">
                                            <FormControlLabel
                                                label="Parent"
                                                className="groupHead"
                                                control={
                                                <Checkbox
                                                    checked={checked[0] && checked[1]}
                                                    indeterminate={checked[0] !== checked[1]}
                                                    onChange={handleChange1}
                                                />
                                                }
                                            />
                                            {children}
                                        </div>
                                    </div>
                                    </TabPanel>
                                    <TabPanel value={value} index={1}>
                                        Item Two
                                    </TabPanel> */}
                                </Box>
                            </Grid>

                        </Grid>

                        {/* <Grid container className="mt-3">
                            <Avatar src={`/img/user_icons_by_roles/${renderUserAvatar()}.png`} style={{ width: '90px', height: '90px', margin: isWidthUp('md', currentScreenSize) ? "" : "auto" }} alt="user-icon-avatar" />
                            <div className="ml-3">
                                <Typography style={{ textAlign: isWidthUp('sm', currentScreenSize) ? "" : "auto" }} className={currentUser.settings?.isActive ? 'text-success' : 'text-danger'}>{currentUser.settings?.isActive ? ' Active ' : 'InActive'} </Typography>
                                <Typography className="mt-2" variant="h5" component="h5"
                                    style={{ maxWidth: "380px", color: `rgba(82, 57, 112, 1)`, fontSize: isWidthUp('sm', currentScreenSize) ? "26px" : "18px" }}>
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
                    <List
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                        subheader={
                            <ListSubheader disableSticky="true" component="div" id="nested-list-subheader">
                                <Grid container className="py-2">
                                    <Grid item xs={12}>
                                        <Typography variant="h3" component="h2" className="mt-2 text-center text-justify mb-2" style={{ fontSize: "32px" }}>
                                            {t("Select students")}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} className='px-3 mb-2'>
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
                            <ListItem className="pl-3" key={item._id}>
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
                        )) : <p className="pl-3" >{t('No data')}</p>}
                    </List>
                </SwipeableDrawer>
            </CardContent>
            <CardActionArea>
                <CardActions className="d-flex justify-content-between align-items-center" >

                    <Grid container className="userbtn">
                        <Grid item className="text-right">
                            <StyledButton className="btnBackCSV" eVariant="secondary" eSize="medium" onClick={() => setActionModal({ isOpen: true, returnedValue: false })}>
                                {t("Back")}</StyledButton>
                        </Grid>


                        <Grid item >
                            <StyledButton className="submitBtn" eVariant="primary" eSize="medium" onClick={save} disabled={!editFormHelper.isBlocking || validators.otherPassword}>{t("Submit")}</StyledButton>
                        </Grid>

                    </Grid>

                    {/* <Grid item xs={4}>
                            <Button variant="contained" size="small" color="secondary"
                                onClick={async () => {
                                    if (editFormHelper.isBlocking) {
                                        let confirm = await isConfirmed(t("Are you sure you want to discard changes?"));
                                        if (!confirm) return;
                                    }
                                    F_showToastMessage("No change",);
                                    setEditFormHelper({ isOpen: false, openType: 'PREVIEW', userId: 'NEW', isBlocking: false });
                                }}>{t("Dismiss")}</Button>
                        </Grid> */}
                    {/* <Grid item xs={8} className="p-0 d-flex justify-content-between align-items-center">
                            {
                                editFormHelper.openType === 'EDIT' && !['ModuleManager', 'Assistant'].includes(currentUser?.settings?.role) && (
                                    <Button variant="contained" size="small" color="inherit"
                                        onClick={() => setActionModal({ isOpen: true, returnedValue: false })}>
                                        {t("Remove user")}
                                    </Button>
                                )
                            }
                            {
                                <Button size="small" variant="contained" color="primary" style={{ marginLeft: "auto" }}
                                    onClick={save} disabled={!editFormHelper.isBlocking || validators.otherPassword}
                                >{t("Save")}</Button>
                            { )} 
                        </Grid> */}

                </CardActions>
            </CardActionArea>
            <ConfirmActionModal actionModal={actionModal}
                setActionModal={setActionModal}
                actionModalTitle={t("Removing user")}
                actionModalMessage={t("Are you sure you want to remove user? The action is not reversible!")}
            />
        </Card>
    )
}