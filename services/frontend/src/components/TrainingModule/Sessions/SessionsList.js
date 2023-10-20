import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {Paper} from "@material-ui/core";
import { makeStyles} from "@material-ui/core/styles";
import {useNavigate, useParams} from "react-router-dom";
import CertificationSessionService from "services/certification_session.service"
import SessionsTable from "./SessionsTable";
import {useTranslation} from "react-i18next";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";


import SessionForm from "./NSession/SessionForm";
import {useSessionContext} from "components/_ContextProviders/SessionProvider/SessionProvider";
import {ETab, ETabBar} from "styled_components";
const useStyles = makeStyles(theme=>({
    paper:{
        [theme.breakpoints.down('sm')]:{
            padding: 0,
        }
    }
}))

export default function SessionsList({inCertificate}){
    const {t} = useTranslation();
    const classes = useStyles();
    const { sessionId } = useParams();
    // setCurrentRoute
    const {setMyCurrentRoute, F_showToastMessage, F_getHelper} = useMainContext();
    const {userPermissions} = F_getHelper();
    const {isOpenSessionForm, setIsOpenSessionForm} = useSessionContext();
    const [currentTab, setCurrentTab]= useState(0);

    const [sessions, setSessions] = useState([]);

    useEffect(()=>{
        setMyCurrentRoute (userPermissions.isTrainee ? ("Session") : ("Session Business Client")) ;
        if(sessionId){
            setIsOpenSessionForm({isOpen: true, type: 'PREVIEW', sessionId, active: 'active'});
        }else{
            setIsOpenSessionForm({isOpen: false, type: 'PREVIEW', sessionId: undefined, active: 'active'});
        }
    },[]);

    useEffect(()=>{
        // check if we are inside cerificate or not, if yes we don't care about other sessions
        if(inCertificate){
            CertificationSessionService.readAllUserSessionsInCertificate(inCertificate).then(res=>{
                setSessions(res.data);
            }).catch(error=>console.log(error))
        }
        else{
            CertificationSessionService.readAllUserSessions().then(res=>{
                setSessions(res.data);
            }).catch(error=>console.log(error))
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
                CertificationSessionService.readAllUserSessions().then(res=>{
                    if(res.status === 200 && res.data){
                        setSessions(res.data.filter(s=> !s.archived))
                    }
                }).catch(error=>console.log(error))
            }
        }else if(currentTab === 1){
            CertificationSessionService.readAllArchivedSessions().then(res=>{
                if(res.status === 200 && res.data){
                   setSessions(res.data)
                }
            }).catch(err=>console.log(err));
        }
    },[currentTab]);

    return(
            <Grid container spacing={1}>
            {((!isOpenSessionForm.isOpen) && (
                    <Grid item xs={12} className="d-flex justify-content-center my-0 mt-3">
                        <ETabBar
                            value={currentTab}
                            onChange={(e,i)=>setCurrentTab(i)}
                            eSize='small'
                        >
                            <ETab label={t("Active")} eSize='small'/>
                            <ETab label={t("Archive")} eSize='small'/>
                        </ETabBar>
                    </Grid>
            ))}
                {(!isOpenSessionForm.isOpen) ? (
                    <Grid item xs={12}>
                    
                        <div className="d-flex pt-2 px-2 mb-3 justify-content-between">
                            {/* {userPermissions.isArchitect && (
                                    <Button classes={{root: classes.root}} size="small" variant="contained" color="primary"
                                            onClick={()=>{
                                                setIsOpenSessionForm({isOpen: true, type: 'ADD', sessionId: 'NEW'})
                                            }}
                                    >{t("Add new session")}</Button>
                            )} */}
                            {/* {userPermissions.isTrainingManager && (
                                <Button classes={{root: classes.root}} size="small" variant="contained" color="primary"
                                    onClick={()=>{
                                        // TODO: open session for training manager
                                    }}
                                >{t("Open session")}</Button>
                            )} */}
                        </div>
                    <SessionsTable sessions={sessions} active={currentTab===0?"active":"archived"}/>

                    </Grid>
                ) : (
                    <Grid item xs={12}>
                        <SessionForm />
                    </Grid>
                )}
            </Grid>
    )
}