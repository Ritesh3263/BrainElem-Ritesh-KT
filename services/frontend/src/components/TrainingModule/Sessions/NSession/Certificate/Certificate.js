import React, { useEffect, useState } from "react";
import { ThemeProvider, Typography, Grid, Paper } from "@mui/material";
import { useTranslation } from "react-i18next";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { useSessionContext } from "../../../../_ContextProviders/SessionProvider/SessionProvider";
import { useMainContext } from "../../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import CertificateService from "../../../../../services/certificate.service";
import MenuItem from "@material-ui/core/MenuItem";
import CertificateForm from "./CertificateForm";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import Examiners from "./Examiners/Examiners";
import Students from "./Students/Students";
import Results from "./Results/Results";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CertifyEventModal from "./CertifiyEventModal/CertifyEventModal";
import { ETab, ETabBar } from "../../../../../styled_components";
import CertifyEvent from "./CertifyEvent/CertifyEvent";
import { new_theme } from "NewMuiTheme";
import "./Certificate.scss";


export default function Certificate() {
    const { t } = useTranslation();
    const {
        isOpenSessionForm,
        currentSession,
        sessionReducerActionsType,
        sessionDispatch,
    } = useSessionContext();

    const { F_showToastMessage, F_getHelper } = useMainContext();
    const { userPermissions, user } = F_getHelper();

    const [currentCertificate, setCurrentCertificate] = useState({});
    const [certificates, setCertificates] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [tabs, setTabs] = useState([0, 0, 1, 0]);
    const [isOpenCertifyEventModal, setIsOpenCertifyEventModal] = useState({ isOpen: false, openType: 'PREVIEW' });

    useEffect(() => {
        if (userPermissions.isTrainee) {
            setTabs([0, 0, 0, 1]);
            CertificateService.readAllUserCertifications(isOpenSessionForm.sessionId).then(res => {
                if (res.status === 200 && res.data) {
                    setCertificates(res.data);
                    // to do: assuming trainee has only one certificate per session
                    if (res.data.length > 0) {
                        setCurrentCertificate(res.data[0].certificationSession?.certificate);
                    }
                    sessionDispatch({ type: sessionReducerActionsType.CHANGE_CERTIFICATE, payload: res.data[0].certificationSession?.certificate._id });
                }
            }).catch(error => console.log(error))
        } else if (userPermissions.isPartner) {
            setTabs([1, 0, 1]);
        }
        else {
            if ((userPermissions.isArchitect || userPermissions.isAssistant || userPermissions.isModuleManager)) {
                if (isOpenSessionForm.sessionId === 'NEW') setTabs([1, 0, 0, 0]);
                CertificateService.readAll().then(res => {
                    if (res.status === 200 && res.data) {
                        setCertificates(res.data);
                    }
                }).catch(error => console.log(error));
            }
        }
    }, []);

    // useEffect(()=>{
    //     if (certificates.length){
    //         setCurrentCertificate(certificates.find(x=>x.certificationSession?.certificate?._id===currentSession.certificate)?.certificationSession?.certificate);
    //         // setCurrentCertificate(certificates.find(x=>x._id===currentSession.certificate));
    //     } 
    //     else setCurrentCertificate({});
    // },[certificates]);

    useEffect(() => {
        if (currentSession?.certificate?._id) {
            CertificateService.read(currentSession?.certificate._id).then(res => {
                if (res.status === 200 && res.data) {
                    setCurrentCertificate(res.data);
                }
            }).catch(err => console.log(err))
        }
    }, [currentSession]);


    const changeCertificateHandler = (certId) => {
        sessionDispatch({
            type: sessionReducerActionsType.CHANGE_CERTIFICATE,
            payload: certId
        });
    }


    const certificatesList = certificates?.length > 0 ? certificates.map(c => <MenuItem key={c._id} value={c._id}>{c?.name}</MenuItem>) : [];

    return (
        <ThemeProvider theme={new_theme}>
            <Grid container>
                <Grid item xs={12} className="mt-1">
                    {/* <ETabBar style={{ minWidth: '600px' }} className="mt-1 inner_tab"
                        value={activeTab}
                        onChange={(e, i) => setActiveTab(i)}
                        eSize='small'
                    >
                        {tabs[0] && <ETab style={{ minWidth: '100px' }} label={<Typography variant="body2" component="span">{t('General')}</Typography>} eSize='small' />}
                        {tabs[1] && <ETab style={{ minWidth: '100px' }} label={<Typography variant="body2" component="span">{t('Examiners')}</Typography>} eSize='small' />}
                        {tabs[2] && <ETab style={{ minWidth: '100px' }} label={<Typography variant="body2" component="span">{t('Trainees')}</Typography>} eSize='small' />}
                        {tabs[3] && <ETab style={{ minWidth: '100px' }} label={<Typography variant="body2" component="span">{t('Results')}</Typography>} eSize='small' />}
                    </ETabBar> */}
                    <ButtonGroup className="tabing_btns">
                        {tabs[0] && <Button size="small" variant="contained" color={activeTab === 0 ? "primary" : "secondary"}
                            style={{ width: "33%" }}
                            onClick={() => {
                                setActiveTab(0);
                            }}
                        ><Typography variant="body2" component="span">{t('General')}</Typography></Button>}
                        {tabs[1] && <Button size="small" variant="contained" color={activeTab === 1 ? "primary" : "secondary"}
                            style={{ width: "33%" }}
                            onClick={() => {
                                setActiveTab(1);
                            }}
                        >
                            <Typography variant="body2" component="span">{t('Examiners')}</Typography></Button>}
                        {tabs[2] && <Button size="small" variant="contained" color={activeTab === 0 ? "primary" : "secondary"}
                            style={{ width: "33%" }}
                            onClick={() => {
                                setActiveTab(0);
                            }}
                        ><Typography variant="body2" component="span">{t('Trainees')}</Typography></Button>}

                        {tabs[3] && <Button size="small" variant="contained" color={activeTab === 0 ? "primary" : "secondary"}
                            style={{ width: "33%" }}
                            onClick={() => {
                                setActiveTab(0);
                            }}
                        ><Typography variant="body2" component="span">{t('Results')}</Typography></Button>}
                    </ButtonGroup>
                </Grid>
                {activeTab === 0 && (userPermissions.isArchitect || userPermissions.isAssistant || userPermissions.isModuleManager) && (
                    <Grid item xs={12} className="mt-4" >
                        <Paper elevation={10} className="p-2">
                            <FormControl fullWidth margin="normal" required={false} style={{ maxWidth: "400px" }}
                                error={false}
                                variant={(isOpenSessionForm.type === 'PREVIEW') ? 'standard' : 'filled'}>
                                <InputLabel id="assignedCertificate-select-label">{t("Assigned certificate")}</InputLabel>
                                <Select
                                    name='assignedCertificate'
                                    labelId="assignedCertificate-select-label"
                                    id="assignedCertificate-select"
                                    value={currentSession.certificate?._id || currentSession.certificate}
                                    readOnly={(isOpenSessionForm.type === 'PREVIEW')}
                                    disableUnderline={(isOpenSessionForm.type === 'PREVIEW')}
                                    onChange={(e) => changeCertificateHandler(e.target.value)}
                                >
                                    {certificatesList}
                                </Select>
                            </FormControl>
                        </Paper>
                    </Grid>
                )}
                {activeTab === 0 && userPermissions.isTrainingManager && currentCertificate && (
                    <Grid item xs={12} className="mt-4" >
                        <Paper elevation={10} className="p-2">
                            <Button size="small" variant="contained" color="secondary"
                                startIcon={!currentSession?.event ? <AddCircleOutlineIcon /> : null}
                                onClick={() => {
                                    if (currentSession?.event) {
                                        setIsOpenCertifyEventModal(p => ({ ...p, isOpen: true, openType: 'PREVIEW' }))
                                    } else {
                                        setIsOpenCertifyEventModal(p => ({ ...p, isOpen: true, openType: 'ADD' }))
                                    }
                                }}
                            >{`${currentSession.event ? t("Preview certify event") : t("Create certify event")}`}</Button>
                        </Paper>
                    </Grid>
                )}
                {(activeTab === 0) && currentCertificate && !userPermissions.isTrainee   && (
                    <Students />
                    // <Grid item xs={12} className="mt-4" >
                    //     <Grid container>
                    //         <Grid item xs={isOpenCertifyEventModal.isOpen ? 7 : 12}>
                    //             <CertificateForm currentCertificate={currentCertificate} />
                    //         </Grid>
                    //         {isOpenCertifyEventModal.isOpen && (
                    //             <Grid item xs={5} className='pl-2'>
                    //                 <CertifyEvent isOpenCertifyEventModal={isOpenCertifyEventModal}
                    //                     setIsOpenCertifyEventModal={setIsOpenCertifyEventModal}
                    //                     currentSession={currentSession}
                    //                     sessionReducerActionsType={sessionReducerActionsType}
                    //                     sessionDispatch={sessionDispatch}
                    //                 />
                    //             </Grid>
                    //         )}
                    //     </Grid>

                    // </Grid>
                )}
                {(activeTab === 0) && userPermissions.isTrainee && (
                    <Results currentCertificate={currentCertificate} sessionId={isOpenSessionForm.sessionId} userId={user.id} />
                )}
                {(activeTab === 1 && (
                    <Examiners />
                ))}
                {(activeTab === 2 && (
                    <Students />
                ))}
                {(activeTab === 3 && (
                    <Results currentCertificate={currentCertificate} sessionId={isOpenSessionForm.sessionId} userId={user.id} />
                ))}
            </Grid>
            {/* <Grid container> */}
            {/*<CertifyEventModal isOpenCertifyEventModal={isOpenCertifyEventModal}*/}
            {/*                   setIsOpenCertifyEventModal={setIsOpenCertifyEventModal}*/}
            {/*                   currentSession={currentSession}*/}
            {/*                   sessionReducerActionsType={sessionReducerActionsType}*/}
            {/*                   sessionDispatch={sessionDispatch}*/}
            {/*/>*/}
            {/* </Grid> */}
        </ThemeProvider>
    )
}