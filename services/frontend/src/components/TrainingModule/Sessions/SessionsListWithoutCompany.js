import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {Paper} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { ThemeProvider, makeStyles} from "@material-ui/core/styles";
import {useNavigate, useParams} from "react-router-dom";
import CertificationSessionService from "services/certification_session.service"
import SessionsTableWithoutCompany from "./SessionsTableWithoutCompany";
import {useTranslation} from "react-i18next";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import SessionForm from "./NSession/SessionForm";
import {useSessionContext} from "components/_ContextProviders/SessionProvider/SessionProvider";
import {ETab, ETabBar} from "styled_components";
import { Container, Divider, Typography } from "@mui/material";
import StyledButton from "new_styled_components/Button/Button.styled";
import { new_theme } from "NewMuiTheme";
import { NewETabBar } from "new_styled_components";
const useStyles = makeStyles(theme=>({
    paper:{
        [theme.breakpoints.down('sm')]:{
            padding: 0,
        }
    }
}))

export default function SessionsListWithoutCompany({inCertificate}){
    const {t} = useTranslation();
    const classes = useStyles();
    const { sessionId } = useParams();
    // setCurrentRoute
    const {setMyCurrentRoute, F_showToastMessage, F_getHelper, F_hasPermissionTo, F_t} = useMainContext();
    const {userPermissions, user} = F_getHelper();
    const {isOpenSessionForm, setIsOpenSessionForm} = useSessionContext();
    const [currentTab, setCurrentTab]= useState(0);

    const [sessions, setSessions] = useState([]);
    const {
        currentSession,
    } = useSessionContext();

    useEffect(()=>{
        setMyCurrentRoute("Session");
        if(sessionId){
            setIsOpenSessionForm({isOpen: true, type: 'PREVIEW', sessionId, active: 'active'});
        }else{
            setIsOpenSessionForm({isOpen: false, type: 'PREVIEW', sessionId: undefined, active: undefined});
        }
    },[sessionId]);

    useEffect(()=>{
        // check if we are inside cerificate or not, if yes we don't care about other sessions
        if(inCertificate){
            CertificationSessionService.readAllUserSessionsInCertificate(inCertificate).then(res=>{
                setSessions(res.data);
            }).catch(error=>console.log(error))
        }
        else{
            if(userPermissions.bcTrainer.access){
                CertificationSessionService.readAllUserSessionsWithoutCompany().then(res=>{
                    setSessions(res.data);
                }).catch(error=>console.log(error))
            }
            else{
                CertificationSessionService.readAllUserSessions().then(res=>{
                    setSessions(res.data);
                }).catch(error=>console.log(error))
            }
        }
    },[isOpenSessionForm.isOpen]);

    useEffect(()=>{
        if(currentTab === 0){
            if(inCertificate){
                CertificationSessionService.readAllUserSessionsInCertificate(inCertificate).then(res=>{
                    if(res.status === 200 && res.data){
                        setSessions(res.data.filter(s=> !s.archived))
                    }
                }).catch(error=>console.log(error))
            }
            else{
                if(userPermissions.bcTrainer.access){
                    CertificationSessionService.readAllUserSessionsWithoutCompany().then(res=>{
                        if(res.status === 200 && res.data){
                            setSessions(res.data.filter(s=> !s.archived))
                        }
                    }).catch(error=>console.log(error))
                    }
                    else{
                        CertificationSessionService.readAllUserSessions().then(res=>{
                            if(res.status === 200 && res.data){
                                setSessions(res.data.filter(s=> !s.archived))
                            }
                        }).catch(error=>console.log(error))
                }
            }
        }else if(currentTab === 1){
            CertificationSessionService.readAllArchivedSessionsWithoutCompany().then(res=>{
                if(res.status === 200 && res.data){
                   setSessions(res.data)
                }
            }).catch(err=>console.log(err));
        }
    },[currentTab]);

    return(


        <ThemeProvider theme={new_theme}>
            <Container maxWidth="xl" className="mainContainerDiv">
                <Grid item xs={12} >
                {(!isOpenSessionForm.isOpen) ? (
                    <div className="admin_content">
                        <div className="admin_heading">

                            <Grid>
                                <Typography variant="h1" component="h1">{F_t("My Trainings")}</Typography>
                                <Divider variant="insert" className='heading_divider' />
                            </Grid>

                            <div className="heading_buttons">
                                {userPermissions.bcTrainer.access && <StyledButton eVariant="primary" eSize="large" onClick={()=>{
                                                if (F_hasPermissionTo('manage-session')) setIsOpenSessionForm({isOpen: true, type: 'ADD', sessionId: 'NEW', active: undefined})
                                                else F_showToastMessage(t('You do not have permission to create a session'), 'error')
                                            }}
                                    >{t("Create session")}
                                </StyledButton>}

                                {/* <StyledButton eVariant="secondary" eSize="large" onClick={() => {
                                        setOpenModuleList(true);
                                    }}>
                                    {t("Import Users")}
                                    </StyledButton> */}

                            </div>
                        </div>
                        {/* <div className="content_tabing">
                            <NewETabBar
                                style={{ minWidth: "280px" }}
                                value={currentTab}
                                textColor="primary"
                                variant="fullWidth"
                                onChange={(e, i) => {
                                    setCurrentTab(i);
                                }}
                                aria-label="tabs example"
                                eSize="small"
                                className="tab_style"
                            >
                                <ETab
                                    label={t("Active")}
                                    eSize="small"
                                    classes="tab_style"
                                />
                                <ETab
                                    label={t("Archive")}
                                    eSize="small"
                                    classes="tab_style"
                                />
                                
                            </NewETabBar>
                        </div> */}
     
                        <SessionsTableWithoutCompany sessions={sessions} active={currentTab===0?'active':'archived'}/>

                    </div>
                    ) : (
                        <SessionForm />
                    )}
                </Grid>
                
            </Container>
        </ThemeProvider>

    )
}