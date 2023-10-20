import React, { lazy, useEffect, useState } from 'react'
// import Card from "@material-ui/core/Card";
import { Card, CardHeader, Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import Chip from "@material-ui/core/Chip";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import ConfirmActionModal from "components/common/ConfirmActionModal";
import { useTranslation } from "react-i18next";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useSessionContext } from "components/_ContextProviders/SessionProvider/SessionProvider";
import CertificationSessionService from "services/certification_session.service"
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { theme } from "MuiTheme";
import { EButton } from "styled_components";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from '@material-ui/core/styles';
import Examiners from "./Certificate/Examiners/Examiners";
import StyledButton from "new_styled_components/Button/Button.styled";
import { ThemeProvider, Divider } from '@mui/material';
import { new_theme } from 'NewMuiTheme';

import "./SessionForm.scss";
import { ETabBar } from 'new_styled_components';
import ETab from 'new_styled_components/Tab/Tab.styled';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import StyledEIconButton from 'new_styled_components/IconButton.js/IconButton.styled';


import UsersTableWithDrawer  from 'components/common/UsersTableWithDrawer'

// const useStyles = makeStyles({
//     root: {
//         "& .MuiButtonBase-root": {
//             color: theme.palette.primary.darkViolet,
//             padding: "15px 0",
//             borderRight: "solid 1px white"
//         },
//         '& .Mui-selected': {
//             background: theme.palette.shades.white70,
//             color: theme.palette.primary.lightViolet,
//             outlined: "none",
//         },
//     }
// })
const General = lazy(() => import("../NSession/General/General"));
const EnrolledStudents = lazy(() => import("../NSession/EnrolledStudents/EnrolledStudents"));
const Schedule = lazy(() => import("../NSession/Schedule/Schedule"));
const Program = lazy(() => import("../NSession/Program/Program"));
const Gradebook = lazy(() => import("../NSession/Gradebook/Gradebook"));
const Internships = lazy(() => import("../NSession/Internships/Internships"));
const Reports = lazy(() => import("../NSession/Reports/Reports"));
const Certificate = lazy(() => import("../NSession/Certificate/Certificate"));
const WelcomeExaminationView = lazy(() => import("components/Trainer/Examinate/Welcome/WelcomeExaminationView"));
let tabs = [
    { id: 0, hide: false, disabled: false, name: "General" },
    { id: 1, hide: false, disabled: false, name: "Enrolled students" },
    { id: 2, hide: true, disabled: false, name: "Trainers" },
    { id: 3, hide: false, disabled: false, name: "Schedule" },
    { id: 4, hide: false, disabled: false, name: "Program" },
    { id: 5, hide: true, disabled: false, name: "Gradebook" },
    { id: 6, hide: true, disabled: false, name: "Internships" },
    { id: 7, hide: true, disabled: false, name: "Reports" },
    { id: 8, hide: false, disabled: false, name: "Certificate" },
    { id: 9, hide: false, disabled: false, name: "Exams and Assigments" },
]

export default function SessionForm() {
    const {F_getErrorMessage}  = useMainContext();
    const { t } = useTranslation();
    // const classes = useStyles();
    const navigate = useNavigate();
    const { F_showToastMessage, F_getHelper } = useMainContext();
    const { userPermissions, user } = F_getHelper();
    const {
        isOpenSessionForm,
        setIsOpenSessionForm,
        currentSession,
        sessionDispatch,
        sessionReducerActionsType,
    } = useSessionContext();

    const [actionModal, setActionModal] = useState({ isOpen: false, returnedValue: false });
    const [closeSessionModal, setCloseSessionModal] = useState({ isOpen: false, returnedValue: false });
    const [currentTab, setCurrentTab] = useState(0);
    const [isEnrolled, setIsEnrolled] = useState(true);
    const [assignedGroup, setAssignedGroup] = useState();
    const [anchorEl, setAnchorEl] = useState(null);
    const [openConfirmationDelete, setOpenConfirmationDelete] = useState(false);
    const open = Boolean(anchorEl);

    useEffect(() => {
        if (currentSession.unassignedTrainees.some(e => e._id === user.id)) {
            setIsEnrolled(false)
        };
        currentSession.groups.map(x => {
            if (x.trainees.some(e => e._id === user.id)) {
                setAssignedGroup(x.name)
            }
        })
    }, [currentSession]);

    useEffect(() => {
        tabs = tabs.map(t => ({ ...t, hide: false }))
        if (isOpenSessionForm.sessionId === 'NEW') tabs = tabs.map((t, i) => ({ ...t, disabled: i % 7 !== 0 }))
        else tabs = tabs.map(t => ({ ...t, disabled: false }))

        if (userPermissions.isTrainee) {
            // tabs[0].hide = true; // student can see general tab
            tabs[1].hide = true;
            tabs[2].hide = true;

            setCurrentTab(3)
        }
        else if (userPermissions.isCoordinator) {
            tabs[0].hide = true;
            tabs[1].hide = true;
            tabs[2].hide = true;
            tabs[3].hide = true;
            tabs[4].hide = true;
            tabs[6].hide = true;
            tabs[7].hide = true;
            tabs[8].hide = true;
            setCurrentTab(5)
        }
        else setCurrentTab(0);
        if (isOpenSessionForm.isOpen && isOpenSessionForm?.type !== 'ADD' && isOpenSessionForm.sessionId) {
            CertificationSessionService.newRead(isOpenSessionForm.sessionId).then(res => {
                if (res?.status === 200 && res?.data) {
                    sessionDispatch({ type: sessionReducerActionsType.INIT, payload: res.data })
                }
            }).catch(err => {
                let message = err.response?.data?.message
                if (!message) message = "Could not laod session"
                F_showToastMessage(t(message), "error");
                navigate('/training-my-courses')
            });
        } else {
            sessionDispatch({ type: sessionReducerActionsType.INIT, payload: 'EMPTY' })
        }
        tabs[1].disabled = false;
        tabs[2].hide = true;
        tabs[5].hide = true;
        tabs[6].hide = true;
        tabs[7].hide = true;
        tabs[8].disabled = false;
    }, []);

    useEffect(() => {
        if (actionModal.returnedValue) {
            removeSession();
        }
    }, [actionModal.returnedValue]);

    useEffect(() => {
        if (closeSessionModal.returnedValue) {
            closeSession();
        }
    }, [closeSessionModal.returnedValue])

    const removeSession = () => {
        if (isOpenSessionForm.type === 'EDIT' && isOpenSessionForm.sessionId) {
            CertificationSessionService.newRemove(currentSession._id).then(res => {
                F_showToastMessage(t("Data was removed"), "success");
            }).catch(err => console.log(err))
        }
        setIsOpenSessionForm({ isOpen: false, type: 'PREVIEW', sessionId: undefined, active: undefined });
    }


    const handleCreateSession = () => {
        const data = []
    }
    const saveSession = (event) => {
        event.preventDefault();
        console.log("save", currentSession);
        if (currentSession.coursePath) {
            if (isOpenSessionForm.type === 'ADD' && isOpenSessionForm.sessionId) {
                CertificationSessionService.newAdd(currentSession).then(res => {
                    setIsOpenSessionForm({ isOpen: false, type: 'PREVIEW', sessionId: undefined, active: undefined });
                    F_showToastMessage(t("Data was created"), "success");
                }).catch(err => console.log(err))
            } else if (isOpenSessionForm.type === 'EDIT' && isOpenSessionForm.sessionId) {
                CertificationSessionService.newUpdate(currentSession).then(res => {
                    F_showToastMessage(t("Data was updated"), "success");
                    setIsOpenSessionForm({ isOpen: false, type: 'PREVIEW', sessionId: undefined, active: undefined });
            }).catch(err => console.log(err))
            }
        } else {
            F_showToastMessage(t("Please select a course path before saving!"), "error");
        }
    }

    const sessionFormType = (type) => {
        if (type === 'ADD') {
            return t('Add');
        } else if (type === 'EDIT') {
            return t('Edit');
        } else {
            return t('Preview');
        }
    };

    const closeSession = () => {
        if (isOpenSessionForm.active === 'active') {
            CertificationSessionService.archive(currentSession._id).then(res => {
                console.log(res)
                if (res.status === 200) {
                    setIsOpenSessionForm({ isOpen: false, type: 'PREVIEW', sessionId: undefined, active: undefined });
                    F_showToastMessage(t(res.data.message), "success");
                }
            }).catch(err => console.log(err));
        } else {
            CertificationSessionService.restore(currentSession._id).then(res => {
                console.log(res)
                if (res.status === 200) {
                    setIsOpenSessionForm({ isOpen: false, type: 'PREVIEW', sessionId: undefined, active: undefined });
                    F_showToastMessage(t(res.data.message), "success");
                }
            }).catch(err => console.log(err));
        }
        setCurrentTab(0)
    }

    const handleTabChange = (event, newValue) => {
        // if(userPermissions.isTrainee) newValue += 2;
        setCurrentTab(newValue);
    };

    const classesListTabs = tabs.filter(x => !x.hide).map((item, index) => (
        <ETab eSize='small' key={item.id} value={item.id} disabled={item.disabled} label={t(`${item.name}`)} id={`simple-tab-${index}`} aria-controls={`simple-tabpanel-${index}`}
            onClick={() => { }} />));

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const deleteConfirmation = () => {
        setOpenConfirmationDelete(true)
    }

    const confirmationDeleteClose = () => {
        setOpenConfirmationDelete(false);
    };

    const deleteSession = () =>{
        CertificationSessionService.archive(currentSession._id).then(res => {
            setOpenConfirmationDelete(false);
            F_showToastMessage(res?.data?.message, "success");
            setIsOpenSessionForm({isOpen: false})
        }).catch(error => {
            let eventDisplayErrorMessage = F_getErrorMessage(error)
            F_showToastMessage(eventDisplayErrorMessage, 'error')
        })
    }

    return (
        <ThemeProvider theme={new_theme}>
            {isOpenSessionForm.sessionId === 'NEW' ? <>
                <form onSubmit={saveSession} className='sessionform_grid'>
                    {/* <Card style={{ background: "transparent", boxShadow: "none" }}> */}
                    <Grid container className="admin_content">
                        <Grid item xs={12} className="admin_heading">
                            <div className='session_form_header'>
                                <Typography variant="h1" component="h1">
                                    {t("Create session new")}
                                </Typography>
                                <Divider variant="insert" className='heading_divider' />
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <div className='general_tab'>
                                <General />
                            </div>
                            {/* <div className='certificate_tab'>
                                <Certificate />
                            </div> */}
                            <div className='training_group'>

                                <UsersTableWithDrawer onSelectedUsers={(users)=>{
                                    sessionDispatch({
                                        type: sessionReducerActionsType.TRAINEES_IN_TEAM_ACTION,
                                        payload: { type: 'ADD', trainees: users, groupId: 0, groupIndex: 0 }
                                    });
                                }} />
                            </div>
                        </Grid>
                    </Grid>
                    <CardHeader className='p-2' style={{ background: theme.palette.glass.medium, borderRadius: "8px 8px 0 0 " }} title={(
                        <div className='d-flex align-items-center justify-content-between p-3'>
                            {/* <div>
                                <Typography variant="h5" component="h2" className="text-left" style={{ fontSize: "32px", color: theme.palette.primary.lightViolet }} >
                                    <IconButton className="mb-1 mr-2" style={{ border: "1px solid #A85CFF" }} variant="contained" size="small" onClick={() => {
                                        F_showToastMessage(t("No change"),)
                                        if (userPermissions.isTrainee) {
                                            navigate('/training-my-courses')
                                        } else navigate('/sessions-free')
                                        setIsOpenSessionForm({isOpen: false, type: 'PREVIEW', sessionId: undefined, active: undefined});
                                    }}>
                                        <ChevronLeftIcon style={{ fill: theme.palette.primary.lightViolet }} />
                                    </IconButton> {` ${currentSession?.name || t("New session name")}`}
                                </Typography>
                            </div> */}
                            {/* {userPermissions.isTrainee && (
                                <div className=' px-4 align-items-center justify-content-start'>
                                    <TextField margin="dense"
                                        className='mx-3 pt-1'
                                        style={{ maxWidth: '300px', width: 'auto' }}
                                        fullWidth={true}
                                        variant="standard"
                                        label={`${t("Status of enrollment")}`}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            readOnly: false,
                                            disableUnderline: true
                                        }}
                                        value={isEnrolled ? `${t('Enrolled')}` : `${t('Not Enrolled')}`}
                                    />
                                    <TextField margin="dense"
                                        className='mx-3 pt-1'
                                        multiline={true}
                                        maxRows={2}
                                        style={{ maxWidth: '300px', width: 'auto' }}
                                        fullWidth={true}
                                        variant="standard"
                                        label={`${t("Assigned team")}`}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            readOnly: false,
                                            disableUnderline: true
                                        }}
                                        value={assignedGroup || '-'}
                                    />
                                    <TextField margin="dense"
                                        className='mx-3 pt-1'
                                        style={{ maxWidth: '300px', width: 'auto' }}
                                        fullWidth={true}
                                        variant="standard"
                                        label={`${t("Training manager")}`}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            readOnly: false,
                                            disableUnderline: true
                                        }}
                                        value={currentSession?.trainingManager ? `${currentSession?.trainingManager?.name ?? '-'} ${currentSession?.trainingManager?.surname ?? '-'}` : '-'}
                                    />
                                </div>
                            )} */}
                            {isOpenSessionForm.type === 'EDIT' && currentSession.status && userPermissions.isTrainingManager && (
                                <div>
                                    <EButton
                                        eSize='small'
                                        eVariant='secondary'
                                        onClick={() => { setCloseSessionModal(p => ({ ...p, isOpen: true })) }}
                                    >{isOpenSessionForm.active === 'active' ? t("Close session") : t("Restore session")}</EButton>
                                </div>
                            )}

                        </div>
                    )}
                    // avatar={<Chip label={sessionFormType(isOpenSessionForm.type)} color="primary" />}
                    />

                    {/* <AppBar position="static" style={{ background: theme.palette.glass.medium, boxShadow: "none", zIndex: 0 }} >
                        <Tabs style={{ borderRadius: "0px", backgroundColor: "transparent" }}
                            value={currentTab}
                            onChange={handleTabChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            aria-label="scrollable auto tabs example"
                        >
                            {classesListTabs ? classesListTabs : null}
                        </Tabs>
                    </AppBar> */}
                    {/* <CardContent style={{background:"transparent !important",overflow:"hidden"}}>
                            {currentTab === 0 && (<General />)}
                            {currentTab === 1 && (<EnrolledStudents />)}
                            {currentTab === 2 && (<Examiners />)}
                            {currentTab === 3 && (<Schedule />)}
                            {currentTab === 4 && (<Program />)}
                            {currentTab === 5 && (<Gradebook />)}
                            {currentTab === 6 && (<Internships />)}
                            {currentTab === 7 && (<Reports />)}
                            {currentTab === 8 && (<Certificate />)}
                            {currentTab === 9 && (<WelcomeExaminationView currentSessionId={currentSession._id}/>)}
                        </CardContent> */}
                    {/* <CardActionArea >
                        <CardActions className="d-flex justify-content-between align-items-center" > */}
                    <Grid container>
                        <Grid item xs={6} className="d-flex align-items-center">
                            <StyledButton type="button" eSize="small" eVariant="secondary" onClick={() => {setIsOpenSessionForm({ isOpen: false, type: 'PREVIEW', sessionId: undefined, active: undefined });}}>
                                {t("Cancel")}
                            </StyledButton>
                        </Grid>
                        <Grid item xs={6} className="p-0 d-flex justify-content-end align-items-center">
                            {/* {isOpenSessionForm.type === 'EDIT' &&
                               <Button variant="contained" size="small" color="inherit"
                                       onClick={()=>setActionModal({isOpen: true, returnedValue: false})}>
                                       {t("Remove")}
                               </Button>
                           } */}

                            {(isOpenSessionForm.type !== 'PREVIEW') && <>
                                {/*Program has own save method*/}
                                {currentTab !== 3 && (
                                    <StyledButton type="submit" eSize="small" onClick={handleCreateSession} eVariant="primary">
                                        {t("Create session")}
                                    </StyledButton>
                                )}
                            </>}
                        </Grid>
                    </Grid>
                    {/* </CardActions>
                    </CardActionArea> */}
                    <ConfirmActionModal actionModal={actionModal}
                        setActionModal={setActionModal}
                        actionModalTitle={t("Removing session")}
                        actionModalMessage={t("Are you sure you want to remove session? The action is not reversible!")}
                    />
                    <ConfirmActionModal actionModal={closeSessionModal}
                        setActionModal={setCloseSessionModal}
                        actionModalTitle={isOpenSessionForm.active === 'active' ? t("Closing session") : t("Restoring session")}
                        btnText={t('Confirm')}
                        actionModalMessage={isOpenSessionForm.active === 'active' ? t("Are you sure you want to close session?") : t("Are you sure you want to restore session?")}
                    />
                    {/* </Card> */}
                </form>
            </> : <>
                <form onSubmit={saveSession} className='sessionform_grid'>
                    {/* <Card style={{ background: "transparent", boxShadow: "none" }}> */}
                    {/* <Grid container>
                            <Grid item xs={12} sx={{ mb: { xs: 0, md: 4 } }}>
                                <div className='session_form_header'>
                                    <Typography variant="h1" component="h1">
                                        {t("Create session old")}
                                    </Typography>
                                    <Divider variant="insert" className='heading_divider' />
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <div className='general_tab'>
                                    <General />
                                </div>
                                <div className='certificate_tab'>
                                    <Certificate />
                                </div>
                                <div className='training_group'>
                                    <EnrolledStudents />
                                </div>
                            </Grid>
                        </Grid> */}
                    <div className='mb-xs-2 tb-max-colum tb-max-align-left' style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
                            <Typography variant="h2" component="h2" className="text-left" style={{ color: new_theme.palette.primary.MedPurple }} >
                                <StyledEIconButton sx={{mb:1, mr:1, p:0}} color="primary" size="medium" onClick={() => {
                                    F_showToastMessage(t("No change"),)
                                    if (userPermissions?.isTrainee) {
                                        navigate('/coaches')
                                    }else if(userPermissions?.bcTrainer){
                                        navigate('/sessions-free') 
                                    }
                                    setIsOpenSessionForm({ isOpen: false, type: 'PREVIEW', sessionId: undefined, active: undefined });
                                }}>
                                     <ChevronLeftIcon /> 
                                </StyledEIconButton> {` ${currentSession?.name || t("New session name")}`}
                            </Typography>
                            
                            <>
                            {/* {userPermissions?.bcTrainer?.access && */}
                                <>
                                    <div className='displayFlex tb-max-flex-wrap tb-ml-55' style={{gap:'20px', marginLeft:'auto'}}>
                                        <div className='w-100-tb-max'>
                                            <Typography variant='body4' component='span'>Start date - End Date</Typography>
                                        </div>
                                        
                                        <div className='displayFlex' style={{gap:'8px'}}>
                                            <img src='/img/training_module_statuses/kite-blue.svg'></img>
                                            <Typography variant='body4' component='span'>Online</Typography>
                                        </div>
                                        <div className='displayFlex' style={{gap:'8px'}}>
                                            <img src='/img/training_module_statuses/kite-yellow.svg'></img>
                                            <Typography variant='body4' component='span'>Certification</Typography>
                                        </div>
                                        <div className='displayFlex' style={{gap:'8px'}}>
                                            <img src='/img/training_module_statuses/kite-green.svg'></img>
                                            <Typography variant='body4' component='span'>Status-name</Typography>
                                        </div>
                                    </div>
                                    {userPermissions.bcTrainer.access && (currentSession?.examiners?.find(e=>e._id===user?.id)) &&
                                     <>
                                        <StyledEIconButton className='d-tb-abs' color="primary" size="medium" sx={{ml: 1}}>
                                        <MoreVertIcon  id="demo-positioned-button"
                                        aria-controls={open ? 'demo-positioned-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                        onClick={handleClick} />
                                        </StyledEIconButton>
                                        <Menu
                                            id="demo-positioned-menu"
                                            aria-labelledby="demo-positioned-button"
                                            anchorEl={anchorEl}
                                            open={open}
                                            onClose={handleClose}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left',
                                            }}
                                            PaperProps={{
                                                style: {
                                                    width: '140px',
                                                },
                                            }}
                                            className='training_update_del'
                                        >
                                            <MenuItem onClick={deleteConfirmation}>{t("Delete")}</MenuItem>
                                        </Menu>
                                    </>
                                    }  
                                </>    
                            {/* } */}
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
                                <Typography variant="h3" component="h4" sx={{color: new_theme.palette.newSupplementary, mb: 3}}>{t("Confirmation")}</Typography>
                                <Typography variant="body4" component="p" sx={{mb: 5}}>{t("Do you want to delete this session?")}</Typography>
                                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                    <StyledButton eVariant="secondary" eSize="medium" onClick={()=> setOpenConfirmationDelete(false)}>{t("Cancel")}</StyledButton>
                                    <StyledButton eVariant="primary" eSize="medium" onClick={deleteSession}>{t("Confirm")}</StyledButton>
                                </Box>
                            </Dialog>
                            
                            </>
                            
                        

                    </div>
                    {/* <CardHeader className='p-2' style={{ background: theme.palette.glass.medium, borderRadius: "8px 8px 0 0 " }} title={(
                            
                        )}
                            // avatar={<Chip label={sessionFormType(isOpenSessionForm.type)} color="primary" />}
                        /> */}
                    <Grid item xs={12} className="content_tabing">
                        <ETabBar
                            style={{ minWidth: "280px" }}
                            textColor="primary"
                            variant="fullWidth"
                            className="tab_style"
                            value={currentTab}
                            onChange={handleTabChange}
                            aria-label="scrollable auto tabs example"
                        >

                            {classesListTabs ? classesListTabs : null}

                        </ETabBar>
                    </Grid>
                    <Box style={{ background: "transparent !important", overflow: "hidden" }}>
                        {currentTab === 0 && (<General />)}
                        {currentTab === 1 && (<EnrolledStudents showEnrolledStudents={true} />)}
                        {currentTab === 2 && (<Examiners />)}
                        {currentTab === 3 && (<Schedule />)}
                        {currentTab === 4 && (<Program />)}
                        {currentTab === 5 && (<Gradebook />)}
                        {currentTab === 6 && (<Internships />)}
                        {currentTab === 7 && (<Reports />)}
                        {currentTab === 8 && (<Certificate />)}
                        {currentTab === 9 && (<WelcomeExaminationView currentSessionId={currentSession._id}/>)}
                    </Box>
                    {/* <CardActionArea>
                            <CardActions className="d-flex justify-content-between align-items-center" >
                                <Grid container>
                                    <Grid item xs={6} className="d-flex align-items-center">
                                        <StyledButton type="submit" eSize="small" eVariant="secondary">
                                            {t("Cancel")}
                                        </StyledButton>
                                    </Grid>
                                    <Grid item xs={6} className="p-0 d-flex justify-content-end align-items-center">
                                        {isOpenSessionForm.type === 'EDIT' &&
                                            <StyledButton eVariant="primary" eSize="small"
                                                onClick={() => setActionModal({ isOpen: true, returnedValue: false })}>
                                                {t("Remove")}
                                            </StyledButton>
                                        }

                                        {(isOpenSessionForm.type !== 'PREVIEW') && <>
                                            {currentTab !== 3 && (
                                                <StyledButton type="submit" eSize="small" eVariant="primary">
                                                    {t("Create session")}
                                                </StyledButton>
                                            )}
                                        </>}
                                    </Grid>
                                </Grid>
                            </CardActions>
                        </CardActionArea> */}
                    <ConfirmActionModal actionModal={actionModal}
                        setActionModal={setActionModal}
                        actionModalTitle={t("Removing session")}
                        actionModalMessage={t("Are you sure you want to remove session? The action is not reversible!")}
                    />
                    <ConfirmActionModal actionModal={closeSessionModal}
                        setActionModal={setCloseSessionModal}
                        actionModalTitle={isOpenSessionForm.active === 'active' ? t("Closing session") : t("Restoring session")}
                        btnText={t('Confirm')}
                        actionModalMessage={isOpenSessionForm.active === 'active' ? t("Are you sure you want to close session?") : t("Are you sure you want to restore session?")}
                    />
                    {/* </Card> */}
                </form>
            </>}
            {/* <FullTrainee /> */}
        </ThemeProvider>
    )
}