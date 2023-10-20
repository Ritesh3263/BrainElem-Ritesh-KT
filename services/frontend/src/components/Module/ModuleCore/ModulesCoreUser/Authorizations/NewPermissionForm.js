import React, { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    Divider,
    IconButton, ListSubheader,
} from "@material-ui/core";
import Typography from '@mui/material/Typography'
import Chip from "@mui/material/Chip";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import ConfirmActionModal from "components/common/ConfirmActionModal";
import { useTranslation } from "react-i18next";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import userService from "../../../../../services/user.service";
import moduleCoreService from "../../../../../services/module-core.service";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SearchField from "components/common/Search/SearchField";
import TableSearch from "components/common/Table/TableSearch";
import InternshipService from "../../../../../services/internship.service";
import { new_theme } from "NewMuiTheme";
import AuthService from "services/auth.service";
import Confirm from "components/common/Hooks/Confirm";
import { usePrompt } from "components/common/Hooks/usePrompt";
import TextField from '@mui/material/TextField';
import './authorizations.scss'
// const useStyles = makeStyles(theme => ({
//     CardContentRoot: {
//         overflow: "hidden"
//     }
// }));

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

export default function NewPermissionForm({ editFormHelper, setEditFormHelper }) {
    const { t } = useTranslation();
    const { isConfirmed } = Confirm();
    const { F_showToastMessage, F_hasPermissionTo, F_getHelper, F_handleSetShowLoader } = useMainContext();
    const { manageScopeIds } = F_getHelper();
    const [actionModal, setActionModal] = useState({ isOpen: false, returnedValue: false });
    const [activeTab, setActiveTab] = useState('INFORMATION');
    const { userPermissions, user } = F_getHelper();
    const [currentUser, setCurrentUser] = useState(initialUserState);
    const [students, setStudents] = useState([]);
    const [visiblePassword, setVisiblePassword] = useState(false);
    const [assignChildrenDrawer, setAssignChildrenDrawer] = useState(false);
    const [searchingText, setSearchingText] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [validators, setValidators] = useState({ email: false, username: false, usernameAvailable: false, name: false, surname: false, password: false, passwordConfirm: false });
    const { currentScreenSize } = useMainContext();
    const [currentTab, setCurrentTab] = useState(0);
    // const classes = useStyles();
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);

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
            setCurrentUser(initialUserState);
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
        if (manageScopeIds.isTrainingCenter) {
            setCurrentUser(p => ({ ...p, settings: { ...p.settings, selfRegistered: true, emailConfirmed: true } }))
        }
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

    return (
        <Card className="permission-card">
            <CardHeader className='pb-0'/>
            <CardContent >

                <Grid container>
                <Grid item xs={12} className='permisionForm-grid'>
                        <Grid container className="permisionForm" sx={{mt: 3}}>
                            <Grid item xs={12} sx={{mb: 4}}>
                                <Typography className="permission-heading" variant="h1" component="h1">Create Permission</Typography>
                                <Divider variant="insert" className='heading-divider' />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} className="grid-width">
                                <TextField label={t("Enter Name")} variant="filled" />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3} className="grid-width">
                                <FormControl margin="dense" fullWidth={true}
                                    variant={editFormHelper.openType === 'PREVIEW' ? 'standard' : "filled"}
                                >
                                    <InputLabel id="demo-simple-select-label">{t("Select Module")}</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                    >
                                        <MenuItem>user-1</MenuItem>
                                        <MenuItem>user-2</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3} className="grid-width">
                                <FormControl margin="dense" fullWidth={true}
                                    variant={editFormHelper.openType === 'PREVIEW' ? 'standard' : "filled"}
                                >
                                    <InputLabel id="demo-simple-select-label">{t("Select Access")}</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                    >
                                        <MenuItem>user-1</MenuItem>
                                        <MenuItem>user-2</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={12} md={12} className="grid-width">
                            <TextField
                                label={t("Add Description")+"..."}
                                multiline
                                rows={4}
                                variant="filled"
                            />
                            </Grid>

                        </Grid>
                        <Grid item xs={12} className="grid-width">
                            <div className="userbtn btn-flex btn-grid-mb">
                                <Button variant="outlined">Back</Button>
                                <Button className="submitBtn" variant="contained">Submit</Button>
                            </div>
                        </Grid>
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

            <ConfirmActionModal actionModal={actionModal}
                setActionModal={setActionModal}
                actionModalTitle={t("Removing user")}
                actionModalMessage={t("Are you sure you want to remove user? The action is not reversible!")}
            />
        </Card>
    )
}