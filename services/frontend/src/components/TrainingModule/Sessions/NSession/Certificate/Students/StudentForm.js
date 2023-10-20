import React, { useEffect, useState } from 'react';
import { ThemeProvider, Typography, Grid, List, ListItem, ListItemText, Paper, Box } from "@mui/material";
import StyledButton from 'new_styled_components/Button/Button.styled';
import { useTranslation } from "react-i18next";
import { useSessionContext } from "../../../../../_ContextProviders/SessionProvider/SessionProvider";
import CertificateForm from "../CertificateForm";
import EvaluationForm from "./EvaluationForm";
import { useMainContext } from "../../../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import CertificateService from "../../../../../../services/certificate.service";
import ConfirmActionModal from "../../../../../../components/common/ConfirmActionCertifyModal";

import CertifyModal from "./CertifyModal";
import EvaluationGradeModal from "./EvaluationGradeModal";
import EvaluationSliderModal from "./EvaluationSliderModal";
import { new_theme } from "NewMuiTheme";
import "../Certificate.scss";

const marks = [
    {
        value: 0,
        label: '',
    },
    {
        value: 1,
        label: '1',
    },
    {
        value: 2,
        label: '2',
    },
    {
        value: 3,
        label: '3',
    },
    {
        value: 4,
        label: '4',
    },
    {
        value: 5,
        label: '5',
    },
    {
        value: 6,
        label: '6',
    },
];


export default function StudentForm({ studentFormHelper, setStudentFormHelper }) {
    const { t } = useTranslation();
    const [currentStudent, setCurrentStudent] = useState({});
    const { F_getHelper, F_showToastMessage } = useMainContext();
    const { currentSession } = useSessionContext();
    const [examiners, setExaminers] = useState([]);
    const [detail, setDetail] = useState({});
    const [traineeCertification, setTraineeCertification] = useState({});
    const [currentCertificate, setCurrentCertificate] = useState({});

    const { userPermissions, user } = F_getHelper();
    const [isCertified, setIsCertified] = useState(false);
    const [avgDetail, setAvgDetail] = useState({});

    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [actionModal, setActionModal] = useState({ isOpen: false, returnedValue: false });

    useEffect(() => {
        // if(userPermissions.isTrainee) {
        CertificateService.readTraineeCertifications(currentSession._id, studentFormHelper.studentId).then(res => {
            if (res.status === 200 && res.data) {
                // calculate average details
                let avg = res.data.certificationSession.certificate
                let length = res.data.details.length
                if (length > 0) {
                    avg.assignedCompetenceBlocks = res.data.certificationSession.certificate.assignedCompetenceBlocks.map((cb, i) => {
                        cb.competences.map((c, j) => {
                            let val = 0;
                            for (let k = 0; k < length; k++) {
                                val = val + parseInt(res.data.details[k].competenceBlocks?.[i]?.competences?.[j]?.grade || 0);
                            }
                            c.grade = val / length;
                            return c;
                        })
                        return cb
                    })
                    avg.externalCompetences = res.data.certificationSession.certificate.externalCompetences.map((ec, i) => {
                        let val = 0;
                        for (let k = 0; k < length; k++) {
                            val = val + parseInt(res.data.details[k].externalCompetences?.[i]?.grade || 0);
                        }
                        ec.grade = val / length;
                        return ec
                    })
                    setAvgDetail(avg);
                }
                setTraineeCertification(res.data);
                setCurrentCertificate(res.data.certificationSession.certificate);
            }
        }).catch(error => console.log(error))
        CertificateService.loadExaminerList(studentFormHelper.studentId, currentSession._id).then(res => {
            if (res.status === 200 && res.data) {
                // console.log(">>>loadExaminerList: ",res.data);
                setExaminers(res.data || {});
            }
        }).catch(error => console.log(error))
        // }
    }, []);

    useEffect(() => {
        let stud = currentSession?.groups[studentFormHelper?.groupIndex]?.trainees?.find(st => st._id === studentFormHelper.studentId);
        if (stud) {
            setCurrentStudent(stud);
        }
        CertificateService.loadExaminerList(studentFormHelper.studentId, currentSession._id).then(res => {
            if (res.status === 200 && res.data) {
                // console.log(">>>loadExaminerList: ",res.data);
                setExaminers(res.data);
            }
        }).catch(error => console.log(error))
        CertificateService.isCertified(studentFormHelper.studentId, currentSession._id).then(res => {
            if (res.status === 200) {
                setIsCertified(res.data);
            }
        }).catch(error => console.log(error))
        CertificateService.readTraineeCertifications(currentSession._id, studentFormHelper.studentId).then(res => {
            if (res.status === 200 && res.data) {
                // calculate average details
                let avg = res.data.certificationSession.certificate
                let length = res.data.details.length
                if (length > 0) {
                    avg.assignedCompetenceBlocks = res.data.certificationSession.certificate.assignedCompetenceBlocks.map((cb, i) => {
                        cb.competences.map((c, j) => {
                            let val = 0;
                            for (let k = 0; k < length; k++) {
                                val = val + parseInt(res.data.details[k].competenceBlocks?.[i]?.competences?.[j]?.grade || 0);
                            }
                            c.grade = val / length;
                            return c;
                        })
                        return cb
                    })
                    avg.externalCompetences = res.data.certificationSession.certificate.externalCompetences.map((ec, i) => {
                        let val = 0;
                        for (let k = 0; k < length; k++) {
                            val = val + parseInt(res.data.details[k].externalCompetences?.[i]?.grade || 0);
                        }
                        ec.grade = val / length;
                        return ec
                    })
                    setAvgDetail(avg);
                }
                setTraineeCertification(res.data);
                setCurrentCertificate(res.data.certificationSession.certificate);
            }
        }).catch(error => console.log(error))
    }, [studentFormHelper])

    const handleCert = async () => {
        setOpen(true);
    }

    useEffect(() => {
        if (actionModal.returnedValue) {
            certify();
        }
    }, [actionModal.returnedValue])

    const certify = () => {
        CertificateService.certify(currentStudent._id, currentSession._id).then(res => {
            if (res.status === 200 && res.data) {
                console.log("certify: ", res.data);
                setIsCertified(true);

            }
        }).catch(error => console.log(error))
        setOpen(false);
    }

    const updateDetail = (type, cbId, cId, val) => {
        switch (type) {
            case 'external':
                setDetail(p => {
                    let newDetail = { ...p };
                    newDetail.externalCompetences.map(ec => {
                        if (ec.competence._id === cId) {
                            ec.grade = val;
                        }
                        return ec;
                    })
                    return newDetail;
                })
                break;
            case 'block':
                setDetail(p => {
                    let newDetail = { ...p };
                    newDetail.competenceBlocks.map(cb => {
                        if (cb.block._id === cbId) {
                            cb.competences.map(c => {
                                if (c.competence._id === cId) {
                                    c.grade = val;
                                }
                                return c;
                            })
                        }
                        return cb;
                    })
                    return newDetail;
                })
                break;
            case 'status':
                // here cId is detail id
                setDetail(p => {
                    let newDetail = { ...p };
                    newDetail.status = val;
                    return newDetail;
                })
                CertificateService.updateEvaluationStatus(currentStudent._id, cId, val).then(res => {
                    if (res.status === 200) {
                        F_showToastMessage(t('Evaluation status updated successfully'), 'success');
                    }
                }).catch(error => console.log(error))
                setTraineeCertification(p => {
                    let newTraineeCertification = { ...p };
                    newTraineeCertification.details.map(d => {
                        if (d._id === cId) {
                            d.status = val;
                        }
                        return d;
                    })
                    return newTraineeCertification;
                })
                break;
            case 'additionalComment':
                setDetail(p => {
                    let newDetail = { ...p };
                    newDetail.additionalComment = val;
                    return newDetail;
                })
                CertificateService.updateEvaluationAdditionalComment(currentStudent._id, currentSession._id, val).then(res => {
                    if (res.status === 200) {
                        F_showToastMessage(t('Evaluation additional comment updated successfully'), 'success');
                    }
                }).catch(error => console.log(error))
                break;
            default:
                console.log("err>>>updateDetail: ", type, cbId, cId, val);
        }
    }

    return (
        <ThemeProvider theme={new_theme}>
            {/* <Paper elevation={10} className="p-3"> */}
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant="h3" component="h3" sx={{ color: new_theme.palette.newSupplementary.NSupText, textAlign: 'left' }}>{t("Session Group")}</Typography>
                    <hr style={{ marginTop: '8px' }} />
                </Grid>
                <Grid item xs={12} sx={{mb: 2}}>
                    {/* <Chip className="mr-3" label={reportsFormType(studentFormHelper.type)} color="primary" /> */}
                    <Typography variant="body4" component="span" sx={{color: new_theme.palette.newSupplementary.NSupText}}>
                        {`${currentStudent?.name} ${currentStudent?.surname}`}
                        {/* {isCertified ? <span style={{color: "green"}}> ({t("Certified")}) </span> : <span style={{color: "red"}}> ({t("Not certified")})</span>} */}
                    </Typography>
                </Grid>
                {/* { userPermissions.isTrainingManager && <CertificateDetails certificateId={currentSession?.certificate}/>} */}
                <Grid item xs={12} sx={{mb: 1}}>
                    <Typography variant="h3" component="h3" sx={{ color: new_theme.palette.newSupplementary.NSupText, textAlign: 'left', textTransform: 'capitalize' }}>{currentStudent?.name + " " + currentStudent?.surname}</Typography>
                    <hr style={{ marginTop: '8px', marginBottom: '0' }} />
                </Grid>
                {(userPermissions.bcTrainer.access ||
                    userPermissions.isArchitect ||
                    userPermissions.isPartner) &&
                    <CertificateForm currentCertificate={currentCertificate} />}
                {userPermissions.isTrainer && <EvaluationForm studentFormHelper={studentFormHelper} setStudentFormHelper={setStudentFormHelper} sessionId={currentSession?._id} detail={detail} setDetail={setDetail} />}
                <Grid item xs={12} className="p-1 pt-2">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <StyledButton eVariant="secondary" eSize="medium"
                            onClick={() => setStudentFormHelper({ isOpen: false, type: 'PREVIEW', groupId: undefined, studentId: undefined })}>
                            {t("Dismiss")}
                        </StyledButton>
                        {(userPermissions.bcTrainer.access ||
                            userPermissions.isArchitect ||
                            userPermissions.isPartner) &&
                            // how to see evalution after the certification if: "disabled={isCertified}"
                            <>
                                <StyledButton eVariant="primary" eSize="medium" onClick={handleCert}>
                                    {/* {userPermissions.bcTrainer.access? (isCertified? t("See evaluations"): t("Certify trainee")): (isCertified? t("See evaluations") : t("Not certified"))} */}
                                    {userPermissions.bcTrainer.access ? (isCertified ? t("User is certified") : t("Certify trainee")) : (isCertified ? t("User is certified") : t("Not certified"))}
                                </StyledButton>
                            </>
                        }
                    </Box>
                </Grid>
            </Grid>
            {/* </Paper> */}
            {<CertifyModal
                open={open}
                setOpen={setOpen}
                examiners={examiners}
                isCertified={isCertified}
                currentStudent={currentStudent}
                setActionModal={setActionModal}
                currentCertificate={currentCertificate}
                updateDetail={updateDetail}
                traineeCertification={traineeCertification}
                setTraineeCertification={setTraineeCertification}
                detail={detail}
                setDetail={setDetail}
                avgDetail={avgDetail}
            />}
            <ConfirmActionModal
                actionModal={actionModal}
                setActionModal={setActionModal}
                actionModalTitle={t("Certify this student!")}
                actionModalMessage={t(`Are you sure you want to certify '${currentStudent.name} ${currentStudent.surname}'?`)}
                btnText={"Yes"}
            />
            {/* {viewEvaluationSliderModal} */}
            {userPermissions.bcTrainer.access ?
                <EvaluationGradeModal
                    open2={open2}
                    setOpen2={setOpen2}
                    currentCertificate={currentCertificate}
                    detail={detail}
                    updateDetail={updateDetail}
                    trainee={currentStudent}
                /> :
                <EvaluationSliderModal
                    open2={open2}
                    setOpen2={setOpen2}
                    currentCertificate={currentCertificate}
                    detail={detail}
                    marks={marks}
                    studentFormHelper={studentFormHelper}
                    setStudentFormHelper={setStudentFormHelper}
                />}
        </ThemeProvider>
    )
}