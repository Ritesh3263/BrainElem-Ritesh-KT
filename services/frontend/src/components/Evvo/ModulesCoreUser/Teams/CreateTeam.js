import React, { useEffect, useState, useRef } from "react";
import {
    Card,
    Divider,
    FormControlLabel,
    ListSubheader,
    Typography,
    Grid,
    TextField
} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import ConfirmActionModal from "components/common/ConfirmActionModal";
import { useTranslation } from "react-i18next";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import { ETextField } from "new_styled_components";
import Checkbox from "@mui/material/Checkbox";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SearchField from "components/common/Search/SearchField";
import TableSearch from "components/common/Table/TableSearch";
import { new_theme } from "NewMuiTheme";
import Confirm from "components/common/Hooks/Confirm";
import { Box, minWidth } from "@mui/system";
import { ThemeProvider } from '@mui/material';
import StyledButton from "new_styled_components/Button/Button.styled";
import "./teams.scss"
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import StyledEIconButton from "new_styled_components/IconButton.js/IconButton.styled";
import { ETab, ETabBar } from "styled_components";
import Drawer from '@mui/material/Drawer';
import { ReactComponent as IconFilter } from "../../../../img/cognitive_space/icon_filter.svg";
import { ReactComponent as IconSearch } from "../../../../img/cognitive_space/icon_search.svg";
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import BrainCoreTest from "./BrainCoreTest";
import { NewEDataGrid } from 'new_styled_components';
import UserDetailsDialog from './UserDetailsDialog';
import UserService from "services/user.service";
import TeamService from "services/team.service"
import ModuleService from "services/module.service"
import moduleCoreService from "services/module-core.service";
import { Input } from "@mui/material";
import Dialog from '@mui/material/Dialog';

const initialTeamState = {
    name: "",
};

const levels = ['1', '2', '3', '4', '5', '6', '7', '8', '9A', '9B', '10A', '10B', '11A', '11B', '12', '13', '14'];
export default function CreateTeam({ editFormHelper, setEditFormHelper }) {
    const { t } = useTranslation(['sentinel-MyTeams-Teams', 'sentinel-MyUsers-BCTestRegistration', 'common','sentinel-MyTeams-Results']);
    const { isConfirmed } = Confirm();
    const { F_showToastMessage, F_hasPermissionTo, F_getHelper, F_handleSetShowLoader, F_t } = useMainContext();
    const { manageScopeIds } = F_getHelper();
    const [actionModal, setActionModal] = useState({ isOpen: false, returnedValue: false });
    const [currentUser, setCurrentUser] = useState(initialTeamState);
    const [students, setStudents] = useState([]);
    const [assignChildrenDrawer, setAssignChildrenDrawer] = useState(false);
    const [searchingText, setSearchingText] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [validators, setValidators] = useState({ email: false, username: false, usernameAvailable: false, name: false, surname: false, password: false, passwordConfirm: false });
    const [users, setUsers] = useState([]);
    const [border, setBorder] = useState(false)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isPreviewDrawerOpen, setIsPreviewDrawerOpen] = useState(false);
    const [selectionModel, setSelectionModel] = useState([]);
    const [preUsers, setPreUsers] = useState([])
    const [checked, setChecked] = useState([]);
    const [rows, setRows] = useState([]);
    const [choosenChecked, setChoosenCheked] = useState([]);
    const [searchForChoice, setSearchForChoice] = useState('');
    const [currentTab, setCurrentTab] = useState(0);
    const [userSearchEnable, setUserSearchEnable] = useState(false);
    const [userSearch, setUserSearch] = React.useState("");
    const [editTeam, setEditTeam] = useState();
    const [previewTeam, setPreviewTeam] = useState({})
    const [searchedUsers, setSearchedUsers] = useState([])
    const [newCheckedUsers, setNewCheckedUsers] = useState([])
    const isValid = useRef(false);
    const [openConfirmationDelete, setOpenConfirmationDelete] = useState(false);
    

    const columns = [
        // { field: '_id', headerName: 'ID', flex: 1 },
        { field: 'username', headerName: t('common:NAME'), flex: 1, minWidth:100, renderCell: (params) => params.row.name + " " + params.row.surname },
        { field: 'role', headerName: t('common:ROLE'), flex: 1, minWidth:100 },
        { field: 'addedon', headerName: t('sentinel-MyTeams-Teams:ADDED_ON'), flex: 1, minWidth:150, renderCell: (params) => '-' },
        { field: 'lastactiveon', headerName: t('sentinel-MyTeams-Teams:LAST_ACTIVE_ON'), flex: 1, minWidth:200, renderCell: (params) => '-' },
        { field: 'projects', headerName: t('sentinel-MyProjects-AutomatedProjects:PROJECTS'), flex: 1, minWidth:120, renderCell: (params) => '-' },
        { field: 'teams', headerName: F_t('sentinel-MyTeams-Results:TEAMS'), flex: 1, minWidth:100, renderCell: (params) => '-' },
        { field: 'actions', headerName: t('common:ACTIONS'), flex: 1, minWidth:100, renderCell: (params) => <UserDetailsDialog data={params.row} /> },
        
    ];

    function rowSelectedHandler(newSelectionModel) {
        setSelectionModel(newSelectionModel);
    }

    async function switchTabHandler(i) {
        if (editFormHelper.isBlocking) {
            let confirm = await isConfirmed(t("common:ARE_YOU_SURE_TO_LEAVE"));
            if (!confirm) return;
        }
        setEditFormHelper(prev => ({ ...prev, isBlocking: false }))
        setCurrentTab(i)
    }

    useEffect(() => {
        F_handleSetShowLoader(true)
        ModuleService.getModuleUsers().then(res => {
            setUsers(res.data.data)
            console.log('userssss', res.data.data)
            setPreUsers(res?.data?.data)
            console.log(res.data.data)

        }).catch(error => console.error(error))
    }, [])
    useEffect(() => {

        if (editFormHelper.isOpen && editFormHelper.openType === 'EDIT') {
            console.log('EDIT');
            TeamService.readTeam(editFormHelper.userId).then(res => {
                if (res.status === 200) {
                    console.log(res)
                    setCurrentUser(res.data.data);
                    var temprows = res.data.data.trainee.map((row) => {
                        return { ...row, 'role': (row?.settings?.roleMaster?.name || '-'), username:`${row?.name} ${row?.surname}` }
                    });
                    setChecked(res.data.data.trainee.map((row) => row._id));
                    setRows(temprows);
                    setEditTeam(temprows)
                    F_handleSetShowLoader(false)
                }
            }).catch(err => console.log(err));
        } else if (editFormHelper.isOpen && editFormHelper.openType === 'ADD') {
            setCurrentUser(initialTeamState);
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
            F_showToastMessage(t("common:USER_REMOVED"), "success")
            setEditFormHelper({ isOpen: false, openType: 'PREVIEW', userId: undefined, isBlocking: false })
        }
        ).catch(error => console.error(error))
    }

    const save = async () => {

        if (await validateFields()) {
            if (validators.name) {
                setBorder(false);
            }
            if (editFormHelper.userId === "NEW") {
                var user = { ...currentUser, "trainee": rows.map((item) => item._id) }
                TeamService.addTeam(user).then(res => {
                    F_showToastMessage(res.data.message, res.status === 200 ? t('common:SUCCESS') : t('common:WARNING'));
                    setEditFormHelper({ isOpen: false, openType: 'PREVIEW', userId: undefined, isBlocking: false })
                }).catch(error => {
                    const re1 = /username/i;
                    const re2 = /e-mail/i;
                    if (error?.response?.data?.message?.keyValue?.username || re1.test(error?.response?.data?.message)) {
                        F_showToastMessage(`${t('common:USERNAME_TAKEN')}`, "error");
                        setCurrentUser(p => ({ ...p, username: '' }));
                    }
                    if (error?.response?.data?.message?.keyValue?.email || re2.test(error?.response?.data?.message)) {
                        F_showToastMessage(`${t('common:EMAIL_TAKEN')}`, "error");
                        setCurrentUser(p => ({ ...p, email: '' }));
                    }
                })
            } else {
                var user = { ...currentUser, "trainee": rows.map((item) => item._id) }
                TeamService.editTeam(user, editFormHelper.userId).then(res => {
                    //display res.message in toast
                    F_showToastMessage(res.data.message, res.status === 200 ? t('common:SUCCESS') : t('common:WARNING'));
                    setEditFormHelper({ isOpen: false, openType: 'PREVIEW', userId: undefined, isBlocking: false })
                }).catch(error => {
                    if (error?.response?.data?.message?.keyValue?.email) {
                        F_showToastMessage(`${t('common:EMAIL_TAKEN')}`, "error");
                        setCurrentUser(p => ({ ...p, email: '' }));
                    }
                });
            }
        } else {
            if (!validators.name) {
                setBorder(true);
                if(isValid.current){
                    F_showToastMessage(t('sentinel-MyTeams-Teams:PROVIDE_TEAM'));
                }
                else{
                    F_showToastMessage(t('sentinel-MyTeams-Teams:MISSING_TEAM_NAME'));
                }
                
            } else {
                F_showToastMessage(t("common:CORRECT_FEILDS", "warning"));

            }
        }

    }

    async function validateFields() {
        let isValidate = true;

        if (currentUser.name.replace(/\s/g, "").length < 2 || currentUser.name.replace(/\s/g, "").length > 50) {
            setValidators(p => ({ ...p, name: true,  }));
            isValidate = false;
            if(currentUser.name.replace(/\s/g, "").length > 50){
                isValid.current = true;
            }
            else{
                isValid.current = false;
            } 
        } else {

        }



        return isValidate;
    };

    const handleChoiceChange = (event) => {
        if (event.target.checked) {
            setNewCheckedUsers([...newCheckedUsers, event.target.value])
            var selection = new Set([...checked, event.target.value])
            // convert set to array
            setChecked([...selection])
            // setChecked(selection)
        } else {
            var newSelection = newCheckedUsers.filter((check) => event.target.value != check);
            setNewCheckedUsers(newSelection)
            var selection = checked.filter((check) => event.target.value != check);
            setChecked(selection)
        }
    };

    const handleArrowUp = () => {
        var choose = [];
        console.log("In arrow up", choosenChecked);
        console.log(users);
        console.log(checked);
        users.forEach((user) => {
            if (checked.includes(user._id)) {

                choose = [...choose, user];
            }
        });
        
        let uids = rows.map((row) => row._id);
        choose = choose.filter((user) => !uids.includes(user._id));
        setRows([...rows, ...choose]);
        if (checked.length !== 0) {
            setEditFormHelper(p => ({ ...p, isBlocking: true }))
        }
        setIsDrawerOpen(false);
        if(rows?.length > 0){
            setChecked([])
            rows?.map((row) =>{
                setChecked([...checked, row?._id])
            })
        } 
    };

    const removeUserHandler = () => {
        const filterRows = rows.filter((row) => !selectionModel.includes(row._id));
        setChecked(filterRows.map((row) => row._id));
                setRows(filterRows);
        setSelectionModel([]);
        if (filterRows.length > 0) {
            setEditFormHelper(p => ({ ...p, isBlocking: true }))
        }
        setOpenConfirmationDelete(false)

    };

    const handlePreview = (user) =>{
        UserService.read(user?._id).then(res => {
            setIsPreviewDrawerOpen(true);
            setPreviewTeam(res?.data);
        }).catch(error => console.error(error))   
    }

    const children = (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {
                users.map((user) => <Box hidden={rows.map(_=>_._id).includes(user._id)} sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}><FormControlLabel
                    label={<><Typography variant="body4">{`${user?.name} ${user?.surname}`}</Typography><Typography variant="subtitle1" sx={{lineHeight: '16px', color: new_theme.palette.secondary.SGrey}}>{t('sentinel-MyTeams-Teams:ASSIGNED_TO')}{user?.teams?.length}{F_t('sentinel-MyTeams-Results:TEAM')}</Typography></>}
                    value={user._id}
                    className="groupChild"
                    control={<Checkbox checked={checked.includes(user._id)} disabled={rows.map(_=>_._id).includes(user._id)} onChange={handleChoiceChange} sx={{fontSize: '32px'}} />}
                /><StyledEIconButton color="primary" size="medium" onClick={() => handlePreview(user)}><VisibilityIcon /></StyledEIconButton></Box>)
            }

        </Box>
    );
    const searchChildren = (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {
                searchedUsers.map((user) => <Box hidden={rows.map(_ => _._id).includes(user._id)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><FormControlLabel
                    label={<><Typography variant="body4">{`${user?.name} ${user?.surname}`}</Typography><Typography variant="subtitle1" sx={{lineHeight: '16px', color: new_theme.palette.secondary.SGrey}}>{t('sentinel-MyTeams-Teams:ASSIGNED_TO')}{user?.teams?.length}{F_t('sentinel-MyTeams-Results:TEAM')}</Typography></>}
                    value={user._id}
                    className="groupChild"
                    control={<Checkbox checked={checked.includes(user._id)} disabled={rows.map(_ => _._id).includes(user._id)} onChange={handleChoiceChange} />}
                />
                    <StyledEIconButton color="primary" size="medium" onClick={() => handlePreview(user)}>
                        <VisibilityIcon />
                    </StyledEIconButton>
                </Box>)
            }

        </Box>
    );

    const handleUserSearch = (e) => {
        setUserSearch(e.target.value);
        if (e.target.value.length >= 3) {
            const results = users.filter((team) => team.name.toLowerCase().includes(e.target.value.toLowerCase()))
            // const allChecked = results.every(team => team.isChecked)
            // if(allChecked) setUsersCheckAll(true)
            // else setUsersCheckAll(false)
            setSearchedUsers(results)
            // setUsers(results);
        } else {
            preUsers.map((team) =>{
                searchedUsers.map((item) =>{
                    if(item?._id == team?._id){
                        team.isChecked = item.isChecked
                        return team
                    }
                    return team
                })
            })
            // const allChecked = userResult.every(team => team.isChecked)
            // if(allChecked) setUsersCheckAll(true)
            // else setUsersCheckAll(false)
            setUsers(preUsers)
        }

    }

    const deleteConfirmation = () => {
        setOpenConfirmationDelete(true)
    }

    const confirmationDeleteClose = () => {
        setOpenConfirmationDelete(false);
    };

    return (
        <ThemeProvider theme={new_theme}>
            <Card style={{ boxShadow: "none" }}>
                <CardContent sx={{ padding: '0' }}>
                    <Grid container className="admin_content">
                        <Grid item xs={12} className="admin_heading">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <StyledEIconButton size="medium" color="primary" sx={{ mr: 1.5 }}
                                    onClick={async () => {
                                        if (editFormHelper.isBlocking) {
                                            let confirm = await isConfirmed(F_t('sentinel-MyTeams-Teams:DISCARD_CREATE_TEAM'));
                                            if (!confirm) return;
                                        }
                                        F_showToastMessage(t("common:NO_CHANGE"),);
                                        setEditFormHelper({ isOpen: false, openType: 'PREVIEW', userId: 'NEW', isBlocking: false });
                                    }}>
                                    <ChevronLeftIcon />
                                </StyledEIconButton>
                                <div>
                                    <Typography variant="h1" component="h1">
                                        {editFormHelper.openType == 'ADDTEAM' ? F_t("sentinel-MyTeams-Teams:CREATE_TEAM") : F_t("sentinel-MyTeams-Teams:EDIT_TEAM")}
                                    </Typography>
                                    <Divider variant="insert" className='heading_divider' />
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={12} >
                            <div className="content_tabing">
                                <ETabBar
                                    style={{ minWidth: "280px" }}
                                    value={currentTab}
                                    textColor="primary"
                                    variant="fullWidth"
                                    onChange={(e, i) => { switchTabHandler(i) }}
                                    aria-label="tabs example"
                                    className="tab_style"
                                >
                                    <ETab label={t("sentinel-MyTeams-Teams:INFORMATION")} eSize='small' />
                                    <ETab label={t("sentinel-MyUsers-BCTestRegistration:BRAINCORE_TEST_REGISTRATION")} hidden={editFormHelper.openType === 'ADDTEAM'} eSize='small' />
                                </ETabBar>
                            </div>
                        </Grid>
                        {
                            currentTab == 0 &&
                            <>
                                <Grid item xs={12} sx={{ mb: 2 }}>
                                    <Typography variant="h2" component="h2" sx={{ paddingBottom: '0 px', textAlign: 'left', color: new_theme.palette.newSupplementary.NSupText }}>{F_t("sentinel-MyTeams-Teams:ABOUT_TEAM")}</Typography>
                                    <hr className="d-mb-none"/>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <ETextField fullWidth={true} error={border} label={F_t("sentinel-MyTeams-Teams:ENTER_TEAM_NAME")} variant="filled" margin="dense" name="name" onInput={({ target }) => {
                                        setEditFormHelper(p => ({ ...p, isBlocking: true }))
                                        setCurrentUser(p => ({ ...p, [target.name]: target.value }))
                                    }}
                                        value={currentUser.name} />
                                </Grid>
                                <Grid item xs={12} sx={{ mt: 4 }}>
                                    <Typography sx={{mb:{xs:2}}} variant="h2" component="h2" style={{ color: new_theme.palette.newSupplementary.NSupText }}>
                                        {F_t("sentinel-MyTeams-Teams:LIST_OF_USERS")}
                                    </Typography>
                                    <hr className="d-mb-none"></hr>
                                    <Box className="filter_list">
                                        <div>
                                            <StyledButton
                                                eVariant="secondary"
                                                eSize="xsmall"
                                                disabled={selectionModel.length < 1}
                                                onClick={deleteConfirmation} sx={{ mr: 2 }}>
                                                {t("common:REMOVE")}
                                            </StyledButton>
                                            <StyledButton
                                                eVariant="primary"
                                                eSize="xsmall"
                                                onClick={() => {setIsDrawerOpen(true); setUserSearch(''); setNewCheckedUsers([])}}
                                            >{F_t("sentinel-MyTeams-Teams:ADD_USERS")}
                                            </StyledButton>
                                        </div>

                                    </Box>
                                </Grid>
                                <Dialog
                                    open={openConfirmationDelete}
                                    onClose={confirmationDeleteClose}
                                    PaperProps={{
                                        sx: {
                                            textAlign: 'center',
                                            borderRadius: '12px',
                                            padding: '30px',
                                            overflow: 'hidden',
                                            minWidth: '400px',
                                        }
                                    }}

                                >
                                    <Typography variant="h3" component="h4" sx={{color: new_theme.palette.newSupplementary, mb: 3}}>{t("common:CONFIRMATION")}</Typography>
                                    <Typography variant="body4" component="p" sx={{mb: 5}}>{t("sentinel-MyTeams-Teams:ARE_YOU_SURE_TO_REMOVE_{{count}}_{{user}}", {count: selectionModel?.length, user: selectionModel?.length > 1 ? t('common:USERS') : t('common:USER') })}</Typography>
                                    <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                        <StyledButton eVariant="secondary" eSize="medium" onClick={()=> setOpenConfirmationDelete(false)}>{t("common:CANCEL")}</StyledButton>
                                        <StyledButton eVariant="primary" eSize="medium" onClick={removeUserHandler}>{t("common:CONFIRM")}</StyledButton>
                                    </Box>
                                </Dialog>
                                <Grid item xs={12}>
                                    <div className="User_list_table">   
                                        <NewEDataGrid
                                            className='tableRL'
                                            rows={rows}
                                            getRowId={(row) => row._id}
                                            columns={columns}
                                            setRows={setRows}
                                            // originalData={MSRoleList}
                                            checkboxSelection
                                            isVisibleToolbar={true}
                                            onSelectionModelChange={rowSelectedHandler}
                                            selectionModel={selectionModel}
                                            originalData={editTeam}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={12} className="btn-flex btn-grid-mb" sx={{ mt: 3, mb: 4 }}>
                                    <StyledButton eVariant="secondary" onClick={() => setEditFormHelper({ isOpen: false, openType: 'PREVIEW', userId: undefined, isBlocking: false })} eSize="medium">{t("common:CANCEL")}</StyledButton>
                                    {editFormHelper.openType == "EDIT" ?
                                        <StyledButton eVariant="primary" eSize="medium"
                                            onClick={save} disabled={!editFormHelper.isBlocking}
                                        >{t("common:SUBMIT")}</StyledButton>

                                        : <StyledButton eVariant="primary" eSize="medium"
                                            onClick={save} disabled={!editFormHelper.isBlocking}
                                        >{t("common:SUBMIT")}</StyledButton>

                                    }
                                </Grid>
                            </>
                        }
                        {
                            currentTab == 1 &&
                            <>
                                <BrainCoreTest teamId={editFormHelper.userId} />
                            </>
                        }

                        <Drawer
                            anchor="right"
                            open={isDrawerOpen}
                            onClose={() => setIsDrawerOpen(false)}>
                            <Box className="team_popup" role="presentation">
                                <div>
                                    <div className="top_header">
                                        <Typography variant="body2" component="h3" sx={{ fontWeight: '700' }} hidden={userSearchEnable}>{F_t("sentinel-MyTeams-Teams:ADD_USERS")}</Typography>
                                        <TextField className="small_fields" readonly fullWidth={true} label={t("common:SEARCH")} variant="filled" margin="dense" value={userSearch} name="search" onChange={handleUserSearch} hidden={!userSearchEnable}
                                        />
                                        <StyledEIconButton color="primary" size="large" hidden={!userSearchEnable} onClick={() => {setUserSearchEnable(!userSearchEnable); setUserSearch('')}}>
                                            <CloseIcon />
                                        </StyledEIconButton>
                                        <StyledEIconButton color="primary" size="large" hidden={userSearchEnable} onClick={() => setUserSearchEnable(!userSearchEnable)}>
                                            <SearchIcon />
                                        </StyledEIconButton>
                                    </div>
                                    <div className="teams_Group">
                                        {userSearch?.length >= 3 ? searchChildren : children}
                                    </div>
                                </div>
                                <div className="bottom_button">
                                    <StyledButton eVariant="secondary" eSize="small" onClick={()=> setIsDrawerOpen(false)}>{t("common:CANCEL")}</StyledButton>
                                    <StyledButton eVariant="primary" eSize="small" onClick={handleArrowUp} disabled={newCheckedUsers?.length === 0}>{t("common:CONFIRM")}</StyledButton>
                                </div>
                            </Box>
                        </Drawer>
                        <Drawer
                            anchor="right"
                            open={isPreviewDrawerOpen}
                            onClose={() => setIsPreviewDrawerOpen(false)}>
                            <Box className="team_popup" role="presentation" sx={{ width: '450px', height: '100vh', overflow: 'auto'}}>
                                <div className="top_header">
                                    <Typography variant="body2" component="h3" sx={{ fontWeight: '700' }}>{t("common:PREVIEW")}</Typography>
                                    <div className="icons" style={{ display: 'flex' }}>
                                        <StyledEIconButton color="primary" size="large" onClick={() => setIsPreviewDrawerOpen(false)}>
                                            <CloseIcon />
                                        </StyledEIconButton>
                                    </div>
                                </div>
                                <Box className="preview_details">
                                    <Box sx={{mb: 2}}>
                                        <Typography variant="subtitle1" component="h6" sx={{ fontWeight: '700', mb: 1 }}>{t("common:GENERAL")}</Typography>
                                        <TextField fullWidth={true} label={t("common:FIRST_NAME")} variant="filled" margin="dense" name="firstname" value={previewTeam?.surname}
                                            InputProps={{
                                                readOnly: true,
                                            }} sx={{mb: 1}} />
                                        <TextField fullWidth={true} label={t("common:LAST_NAME")} variant="filled" margin="dense" name="lastname" value={previewTeam?.name}
                                            InputProps={{
                                                readOnly: true,
                                            }} sx={{mb: 1}} />
                                    </Box>
                                    <Box sx={{mb: 2}}>
                                        <Typography variant="subtitle1" component="h6" sx={{ fontWeight: '700', mb: 1 }}>{F_t('sentinel-MyTeams-Results:TEAMS')} ({previewTeam?.teams?.length})</Typography>
                                        <ul style={{paddingLeft: '5px', listStylePosition: 'inside'}}>
                                            {previewTeam?.teams?.length > 0 && previewTeam?.teams.map((item, index) => (
                                                <li key={index}><Typography variant="body4">{item?.name}</Typography></li>
                                            ))}
                                        </ul>
                                    </Box>
                                    <Box sx={{mb: 2}}>
                                        <Typography variant="subtitle1" component="h6" sx={{ fontWeight: '700', mb: 1 }}>{t("common:PERSONAL INFORMATION")}</Typography>
                                        <TextField fullWidth={true} label={t("common:USERNAME")} variant="filled" margin="dense" name="username" value={previewTeam?.username}
                                            InputProps={{
                                                readOnly: true,
                                            }} sx={{mb: 1}} />
                                        <TextField fullWidth={true} label={t("common:E-MAIL")} variant="filled" margin="dense" name="email" value={previewTeam?.email}
                                            InputProps={{
                                                readOnly: true,
                                            }} sx={{mb: 1}} />
                                    </Box>
                                    <Box sx={{mb: 2}}>
                                        <Typography variant="subtitle1" component="h6" sx={{ fontWeight: '700', mb: 1 }}>{t("common:CONTACT_DETAILS")}</Typography>
                                        <TextField fullWidth={true} label={t("common:PHONE_NUMBER")} variant="filled" margin="dense" name="phone" value={previewTeam?.details?.phone}
                                            InputProps={{
                                                readOnly: true,
                                            }} sx={{mb: 1}} />
                                         <Grid container spacing={2} sx={{mb: 1}}>
                                            <Grid item xs={8}>
                                                <TextField fullWidth={true} label={t("common:STREET")} variant="filled" margin="dense" name="street" value={previewTeam?.details?.street}
                                                InputProps={{
                                                    readOnly: true,
                                                }} />
                                            </Grid>
                                            <Grid item xs={4}>
                                                <TextField fullWidth={true} label={t("common:BUILD/FLAT")} variant="filled" margin="dense" value={previewTeam?.details?.buildNr}
                                                InputProps={{
                                                    readOnly: true,
                                                }} />
                                            </Grid>
                                        </Grid>   
                                        <Grid container spacing={2} sx={{mb: 1}}>
                                            <Grid item xs={8}>
                                                <TextField fullWidth={true} label={t("common:CITY")} variant="filled" margin="dense" name="city" value={previewTeam?.details?.city}
                                                InputProps={{
                                                    readOnly: true,
                                                }} />
                                            </Grid>
                                            <Grid item xs={4}>
                                                <TextField fullWidth={true} label={t("common:POST CODE")} variant="filled" margin="dense" name="postcode" value={previewTeam?.details?.postcode}
                                                InputProps={{
                                                    readOnly: true,
                                                }} />
                                            </Grid>
                                        </Grid>
                                        <Grid container>
                                            <Grid item xs={12}>
                                                <TextField fullWidth={true} label={t("common:COUNTRY")} variant="filled" margin="dense" name="country" value={previewTeam?.details?.country}
                                                InputProps={{
                                                    readOnly: true,
                                                }} />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Box>
                            </Box>
                        </Drawer>
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
                                                {F_t("common:SELECT_USERS")}
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
                            )) : <p>{t('common:NO_DATA')}</p>}
                        </List>
                    </SwipeableDrawer>
                </CardContent>
                {/* <ConfirmActionModal actionModal={actionModal}
                    setActionModal={setActionModal}
                    actionModalTitle={t("Removing team")}
                    actionModalMessage={t("Are you sure you want to  remove team? The action is not reversible!")}
                /> */}
            </Card>
        </ThemeProvider>
    )
}