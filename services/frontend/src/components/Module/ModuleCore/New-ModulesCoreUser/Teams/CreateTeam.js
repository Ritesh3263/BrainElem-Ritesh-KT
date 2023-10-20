import React, { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    Divider,
    FormControlLabel,
    IconButton, ListSubheader,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import ConfirmActionModal from "components/common/ConfirmActionModal";
import { useTranslation } from "react-i18next";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import userService from "../../../../../services/user.service";
import moduleCoreService from "../../../../../services/module-core.service";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
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
import { Box } from "@mui/system";
import { spacing } from '@mui/system';
import { ThemeProvider } from '@mui/material';
import StyledButton from "new_styled_components/Button/Button.styled";
import "./teams.scss"

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

export default function CreateTeam({ editFormHelper, setEditFormHelper }) {
    const { t } = useTranslation();
    const { isConfirmed } = Confirm();
    const { F_showToastMessage, F_hasPermissionTo, F_getHelper, F_handleSetShowLoader, F_t } = useMainContext();
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
        <ThemeProvider theme={new_theme}>
        <Card>
            <CardHeader />
            <CardContent >

                <Grid container>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12} sx={{ mb: 4 }}>
                                <Typography variant="h1" component="h1">
                                       {F_t("Create Teams")}
                                  </Typography>
                                <Divider variant="insert" className='heading_divider' />
                            </Grid>

                            <div style={{ width: "100%" }}></div>
                            <Grid item xs={12}>
                                <TextField className="w-500" id="outlined-basic" label={F_t("Enter Team Name")} variant="outlined" />
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 4 }}>
                               <Typography variant="h2" component="h2" style={{color: new_theme.palette.newSupplementary.NSupText}}>
                                       {t("List of Users")}
                                </Typography>
                                {/* <Typography className="subHeadingTeams" variant="h5" component="h5" style={{ textAlign: "left" }}>{t("List of Users")}</Typography> */}
                                <hr></hr>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <div className="selectWrap">
                                    <div className="selectGroup">
                                        <FormControlLabel
                                            label="Choices"
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
                                            label="Chosen"
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

                            </Grid>
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
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Typography variant="h3" component="h2" style={{ fontSize: "32px" }}>
                                            {t("Select students")}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
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
                            <ListItem key={item._id}>
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
                        )) : <p>{t('No data')}</p>}
                    </List>
                </SwipeableDrawer>
            </CardContent>
            <CardActionArea>
                <CardActions>
                    <Grid container>
                    <Grid item xs={12} md={8} className="btn-flex btn-grid-mb" sx={{ mt: 3 }}>
                        <StyledButton className="btnBack" variant="contained"
                            onClick={async () => {
                                if (editFormHelper.isBlocking) {
                                    let confirm = await isConfirmed(t("Are you sure you want to discard changes?"));
                                    if (!confirm) return;
                                }
                                F_showToastMessage("No change",);
                                setEditFormHelper({ isOpen: false, openType: 'PREVIEW', userId: 'NEW', isBlocking: false });
                            }}>{t("Back")}</StyledButton>
                        {
                            editFormHelper.openType === 'EDIT' && !['ModuleManager', 'Assistant'].includes(currentUser?.settings?.role) && (
                                <StyledButton className="btnBack" variant="contained"
                                    onClick={() => setActionModal({ isOpen: true, returnedValue: false })}>
                                    {t("Remove user")}
                                </StyledButton>
                            )
                        }
                        {/* {editFormHelper.openType !== 'PREVIEW' && currentUser?.settings?.role?.length > 0 && ( */}
                        <StyledButton className="btnSave" variant="contained"
                            onClick={save} disabled={!editFormHelper.isBlocking || validators.otherPassword}
                        >{t("Submit")}</StyledButton>
                        {/* )} */}
                        </Grid>
                    </Grid>
                </CardActions>
            </CardActionArea>
            <ConfirmActionModal actionModal={actionModal}
                setActionModal={setActionModal}
                actionModalTitle={t("Removing user")}
                actionModalMessage={t("Are you sure you want to remove user? The action is not reversible!")}
            />
        </Card>
        </ThemeProvider>
    )
}