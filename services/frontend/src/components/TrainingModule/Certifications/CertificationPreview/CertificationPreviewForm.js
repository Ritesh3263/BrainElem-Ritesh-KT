import React, {useEffect, useRef, useState} from "react";
import { Card,CardHeader,Divider} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {useNavigate} from "react-router-dom";
import { makeStyles} from "@material-ui/core/styles";
import CertificateService from "../../../../services/certificate.service"
import TextField from "@material-ui/core/TextField";
import VisibilityIcon from "@material-ui/icons/Visibility";
import CertificatePreviewModal1 from "./CertificateTemplate1";
import CertificatePreviewModal2 from "./CertificateTemplate2";
import CertificatePreviewModal3 from "./CertificateTemplate3";
import {useTranslation} from "react-i18next";
import {useMainContext} from "../../../_ContextProviders/MainDataContextProvider/MainDataProvider";

const useStyles = makeStyles(theme=>({}))

export default function CertificationPreviewForm({formIsOpen, setFormIsOpen}){
    const { t, i18n, translationsLoaded } = useTranslation();
    const {F_showToastMessage, F_getHelper} = useMainContext();
    const {user} = F_getHelper();
    const componentRef = useRef({test:"aaa"});
    const classes = useStyles();
    const navigate = useNavigate();
    const [isCert1, setIsCert1] = useState([false]);
    const [isCert2, setIsCert2] = useState([false]);
    const [isCert3, setIsCert3] = useState([false]);

    const [isOpenPreviewModal,setIsOpenPreviewModal] = useState(false);

    const [certificate, setCertificate] = useState({
        name: "",
        courseName: "",
        attendance: "",
        points: "",
        totalPoints: "",
        grade: "",
        verifiedDate: "",
        status: "",
    });

    useEffect(()=>{

        if(formIsOpen.userCertificateId !== ""){
            CertificateService.readUserCertification(formIsOpen.userCertificateId).then(res=>{
                let cert = res.data?.certificationSession.certificate.template;
                if(cert === "TEMPLATE_1") setIsCert1(true)
                else if(cert === "TEMPLATE_2") setIsCert2(true)
                else setIsCert3(true)

                setCertificate(p=>
                    ({...p,
                        _id: res.data._id ? res.data._id : "",
                        name: res.data.certificationSession.certificate.name,
                        courseName: res.data.certificationSession?.name,
                        attendance: res.data.attendance,
                        points: res.data.points,
                        totalPoints: res.data.totalPoints,
                        grade: res.data.grade,
                        template: res.data?.certificationSession.certificate.template??'TEMPLATE_1', // ned getData from certificate
                        verifiedDate: res.data.details.length>1? (res.data.details.sort((a,b)=>(new Date(b.verificationDate)) - new Date(a.verificationDate)))[0].verificationDate:
                                    (res.data.details.length? res.data.details[0].verificationDate: false), 
                        status: res.data.status,
                        trainingCenterName: user.modules.find(x => x._id === user.moduleId)?.name ?? "Elia Training Center",
                        trainingManager: res.data.certificationSession.trainingManager.name +' '+ res.data.certificationSession.trainingManager.surname,
                        customNumber: res.data.identificationCode,
                    })
                );
            })
        } else{
            setCertificate({
                name: "",
                courseName: "",
                attendance: "",
                points: "",
                totalPoints: "",
                grade: "",
                verifiedDate: "",
            });
        }
    },[formIsOpen]);


    return(
        <Card className="p-0 d-flex flex-column m-0">
            <CardHeader title={` ${certificate.name}`}/>
            <CardContent>
                <Grid container spacing={1}>
                    <Grid item xs={12} className='d-flex flex-column'>
                        {/* <small>Your details</small>
                        <Divider variant="insert" />
                        <div className="d-flex flex-fill justify-content-between">
                            <TextField label="Grade" style={{ width:"30%"}} margin="normal"
                                       InputLabelProps={{
                                           shrink: true,
                                       }}
                                       InputProps={{
                                           disableUnderline: true,
                                           readOnly: true,
                                       }}
                                       value={certificate.grade}
                            />
                            <TextField label="Points" style={{ width:"30%"}} margin="normal"
                                       InputLabelProps={{
                                           shrink: true,
                                       }}
                                       InputProps={{
                                           disableUnderline: true,
                                           readOnly: true,
                                       }}
                                       value={`${certificate.points ? certificate.points : "-"} / ${certificate.totalPoints ? certificate.totalPoints : "-"}`}
                            />
                            <TextField label="Attendance" style={{ width:"30%"}} margin="normal"
                                       InputLabelProps={{
                                           shrink: true,
                                       }}
                                       InputProps={{
                                           disableUnderline: true,
                                           readOnly: true,
                                       }}
                                       value={`${certificate.attendance}%`}
                            />
                        </div>
                        <hr/> */}
                        <small>{t("Certificate informations")}</small>
                        <Divider variant="insert" />
                        <div className="d-flex flex-fill justify-content-between">
                                <TextField label={t("Certification name")} style={{ width:"45%"}} margin="normal"
                                           InputLabelProps={{
                                               shrink: true,
                                           }}
                                           InputProps={{
                                               disableUnderline: true,
                                               readOnly: true,
                                           }}
                                           value={certificate.name}
                                />
                            <TextField label={t("Course name")} style={{ width:"45%"}} margin="normal"
                                       InputLabelProps={{
                                           shrink: true,
                                       }}
                                       InputProps={{
                                           disableUnderline: true,
                                           readOnly: true,
                                       }}
                                       value={certificate.courseName}
                            />
                        </div>
                        <div className="d-flex flex-fill justify-content-between">
                            <Button classes={{root: classes.root}} size="small" variant="contained" color="secondary"
                                    className="my-2"
                                    disabled={true}
                                    style={{width:"33%"}}
                                    //onClick={()=>{}}
                            >{t("Evaluation result")}</Button>
                            <Button classes={{root: classes.root}} size="small" variant="contained" color="secondary"
                                    className="my-2"
                                    disabled={true}
                                    style={{width:"33%"}}
                                    //onClick={()=>{}}
                            >{t("Exam's results")}</Button>
                        </div>
                        <hr/>
                        <small>{t("Certificate actions")}</small>
                        <Divider variant="insert" />
                        <div className="d-flex flex-fill justify-content-between">
                            <Button classes={{root: classes.root}} size="small" variant="contained" color="secondary"
                                    className="my-2"
                                    disabled={!certificate?.status}
                                    style={{width:"33%"}}
                                    startIcon={<VisibilityIcon/>}
                                    onClick={()=>{setIsOpenPreviewModal(true)}}
                            >{t("Preview certificate")}</Button>
                            {/*<Button classes={{root: classes.root}} size="small" variant="contained" color="secondary"*/}
                            {/*        className="my-2"*/}
                            {/*        style={{width:"33%"}}*/}
                            {/*        startIcon={<SaveAltIcon/>}*/}
                            {/*        onClick={()=>{}}*/}
                            {/*>Download certificate PDF</Button>*/}
                        </div>
                    </Grid>
                </Grid>
            </CardContent>
            <CardActionArea>
                <CardActions className="d-flex justify-content-between align-items-center" >
                    <Grid container>
                        <Grid item xs={6}>
                            <Button classes={{root: classes.root}} variant="contained" size="small" color="secondary" onClick={() =>  {
                                F_showToastMessage("No change",)
                                setFormIsOpen({isOpen: false, isNew: false, userCertificateId: ""});
                            }}>
                                {t("Dismiss")}
                            </Button>
                        </Grid>
                    </Grid>
                </CardActions>
            </CardActionArea>
            {isCert1 === true && (
            <CertificatePreviewModal1 isOpenPreviewModal={isOpenPreviewModal} setIsOpenPreviewModal={setIsOpenPreviewModal} certificate={certificate}/>
            )}
            {isCert2 === true && (
            <CertificatePreviewModal2 isOpenPreviewModal={isOpenPreviewModal} setIsOpenPreviewModal={setIsOpenPreviewModal} certificate={certificate}/>
            )}
            {isCert3 === true && (
            <CertificatePreviewModal3 isOpenPreviewModal={isOpenPreviewModal} setIsOpenPreviewModal={setIsOpenPreviewModal} certificate={certificate}/>
            )}
        </Card>
    )
}