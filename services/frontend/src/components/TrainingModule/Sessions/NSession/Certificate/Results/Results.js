import React, { useEffect, useState } from "react";
import { ThemeProvider, Typography, Grid, DialogContent, DialogActions, FormControl, Dialog, Box, TextField, Card, CardContent, CardHeader, Tooltip } from "@mui/material";
import { theme } from "../../../../../../MuiTheme";
import MenuItem from '@mui/material/MenuItem';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';

import { useTranslation } from "react-i18next";
import Visibility from "@material-ui/icons/Visibility";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { useSessionContext } from "../../../../../_ContextProviders/SessionProvider/SessionProvider";
import { useMainContext } from "../../../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import CertificatePreviewModal1 from "../../../../Certifications/CertificationPreview/CertificateTemplate1";
import CertificatePreviewModal2 from "../../../../Certifications/CertificationPreview/CertificateTemplate2";
import CertificatePreviewModal3 from "../../../../Certifications/CertificationPreview/CertificateTemplate3";
import CertificateService from "../../../../../../services/certificate.service"
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from '@mui/material/InputLabel';
import { withStyles } from '@material-ui/core/styles';
import VisibilityIcon from "@material-ui/icons/Visibility";
import Select from '@mui/material/Select';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import VisibilityTwoToneIcon from '@material-ui/icons/VisibilityTwoTone';
import { QRCodeSVG } from 'qrcode.react';
import { new_theme } from "NewMuiTheme";
import "../Certificate.scss";
import StyledButton from "new_styled_components/Button/Button.styled";

const useStyles = makeStyles(theme => ({

    topText: {
        color: 'white',
        fontSize: '16px',
        fontFamily: "Nunito"
    },
    CardContentBody: {
        overflowY: "hidden"
    },
    Card: {
        display: "flex",
        flexDirection: "column",
        background: theme.palette.shades.white70,
        justifyContent: "space-between",
        height: "100%",
        borderRadius: '8px',
        boxShadow: `0px 1px 24px -1px ${new_theme.palette.shades.black001}`,
        backdropFilter: 'blur(20px)',
        maxWidth: "350px"

    },
    CardActions: {
        flexDirection: "column"
    },
    CardActionsButton: {
        width: "100%"
    },
    GridContainer: {
        justifyContent: "center"
    },
}))

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
export default function Results({ currentCertificate, sessionId, userId }) {
    const classes = useStyles();
    const [directDownload, setDirectDownload] = useState(false);
    const { t } = useTranslation();
    const [isOpenPreviewModal, setIsOpenPreviewModal] = useState(false);
    const { currentSession } = useSessionContext();
    const { F_showToastMessage, F_getHelper } = useMainContext();
    const { user } = F_getHelper();
    const [certificate, setCertificate] = useState({});
    const [isCert1, setIsCert1] = useState([false]);
    const [isCert2, setIsCert2] = useState([false]);
    const [isCert3, setIsCert3] = useState([false]);
    const [isCertified, setIsCertified] = useState(false);
    // Data for blockchain ##############################################################
    const [isBlockchainCertified, setIsBlockchainCertified] = useState(false);
    const [userCertificationId, setUserCertificationId] = useState(undefined)
    // ###################################################################################
    const [idOfInnerTraineeCertificate, setIdOfInnerTraineeCertificate] = useState('');

    const [detail, setDetail] = useState({});
    const [examiners, setExaminers] = useState([]);
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);

    useEffect(() => {
        CertificateService.getIdOfInnerTraineeCertificate(currentSession._id, user.id).then(res => {
            setIdOfInnerTraineeCertificate(res.data);
            setDetail(res.data.details?.[0]);
            setIsCertified(res.data.status);
        })
        CertificateService.readTraineeCertifications(currentSession._id, user.id).then(res => {
            if (res.status === 200 && res.data) {
                setDetail(res.data.details?.[0]);
                setIsCertified(res.data.status);

                // Set blockchain certification ####################
                setIsBlockchainCertified(res.data.blockchainStatus)
                setUserCertificationId(res.data._id)
            }
        }).catch(error => console.log(error))
    }, [])

    // Prepare component with QR-code and details about Blockchain certification
    function getVerificationBlock() {
        let address = `${window.location.origin}/certifications/verify/${userCertificationId}`
        return (
            <a target="_blank" href={address} style={{ color: "inherit", textDecoration: "none" }}>
                <Grid container className="mt-5" style={{ justifyContent: "space-around", position: 'relative', top: -45 }}>
                    <Grid item style={{ background: "white", padding: 10 }}>
                        <QRCodeSVG size={100} value={address} />
                    </Grid>
                    <Grid item>
                        <small>{address}</small>
                    </Grid>
                </Grid>
            </a>)
    }
    function getQRAddress() {
        return `${window.location.origin}/certifications/verify/${userCertificationId}`
    }


    useEffect(() => {
        if (idOfInnerTraineeCertificate) {
            CertificateService.readUserCertification(idOfInnerTraineeCertificate).then(res => {
                let cert = res.data?.certificationSession.certificate.template;
                if (cert === "TEMPLATE_1") setIsCert1(true)
                else if (cert === "TEMPLATE_2") setIsCert2(true)
                else setIsCert3(true)

                setCertificate(p =>
                ({
                    ...p,
                    _id: res.data._id ? res.data._id : "",
                    name: res.data.certificationSession.certificate.name,
                    courseName: res.data.certificationSession?.name,
                    attendance: res.data.attendance,
                    points: res.data.points,
                    totalPoints: res.data.totalPoints,
                    grade: res.data.grade,
                    template: res.data?.certificationSession.certificate.template ?? 'TEMPLATE_1', // ned getData from certificate
                    verifiedDate: res.data.details.length > 1 ? (res.data.details.sort((a, b) => (new Date(b.verificationDate)) - new Date(a.verificationDate)))[0].verificationDate :
                        (res.data.details.length ? res.data.details[0].verificationDate : false),
                    status: res.data.status,
                    trainingCenterName: user.modules.find(x => x._id === user.moduleId)?.name ?? "Elia Training Center",
                    trainingManager: res.data.certificationSession.trainingManager.name + ' ' + res.data.certificationSession.trainingManager.surname,
                    customNumber: res.data.identificationCode,
                })
                );
            })
        }
    }, [idOfInnerTraineeCertificate]);

    useEffect(() => {
        CertificateService.loadExaminerList(userId, sessionId).then(res => {
            if (res.status === 200 && res.data) {
                // console.log(">>>loadExaminerList: ",res.data);
                setExaminers(res.data);
            }
        }).catch(error => console.log(error))
    }, [])
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const viewEvaluation = (trainerId) => {
        CertificateService.viewEvaluation(userId, trainerId, sessionId).then(res => {
            if (res.status === 200) {
                setDetail(res.data?._doc || {})
                setIsCertified(res.data?._doc.status || {});
                setOpen2(true);
            }
        }).catch(error => console.log(error))
    }

    const trainerList = (
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
            <DialogContent dividers>
                <List >
                    {examiners.map((ex) => {
                        return (
                            <ListItem key={ex._id} role={undefined} >
                                <ListItemText id={ex._id} primary={`${ex.name} ${ex.surname}`} />
                                <ListItemSecondaryAction>
                                    <Tooltip title={t('View Evaluation')}>
                                        <IconButton edge="end" aria-label="View Evaluation" onClick={() => { viewEvaluation(ex._id) }}>
                                            <VisibilityTwoToneIcon />
                                        </IconButton>
                                    </Tooltip>
                                </ListItemSecondaryAction>
                            </ListItem>
                        );
                    })}
                </List>
            </DialogContent>
        </Dialog>
    )

    const viewEvaluationModal = (
        <Dialog onClose={() => setOpen2(false)} aria-labelledby="customized-dialog-title" open={open2}>
            <DialogContent dividers>
                <Grid container spacing={1}>
                    <Grid item xs={12} className="d-flex flex-column">
                        {currentCertificate?.assignedCompetenceBlocks?.map((cb, index) => (
                            <Card
                                className={"p-3 d-flex flex-column" + (index ? " mt-3" : "")}
                            >
                                <Typography
                                    variant="h6"
                                    id={`discrete-slider-block-${index}`}
                                    gutterBottom
                                >
                                    {cb.title}
                                </Typography>
                                {cb.competences.map((c, i) => (
                                    <div className={i && "mt-3"} style={{ width: "100%" }}>
                                        <Box display="flex">
                                            <Box width="100%">
                                                <Typography
                                                    variant="caption"
                                                    id={`discrete-slider-${i}`}
                                                    gutterBottom
                                                >
                                                    {c.title}
                                                </Typography>
                                            </Box>
                                            <Box flexShrink={5}>
                                                <TextField
                                                    fullWidth
                                                    // hidden={!props.trainerMode && !result.comment.length}
                                                    // inputProps={{ readOnly: true }}
                                                    placeholder={t("1-6")}
                                                    label="Grade"
                                                    variant="filled"
                                                    defaultValue={
                                                        detail?.competenceBlocks
                                                            ?.find((x) => x.block._id === cb._id)
                                                            ?.competences?.find(
                                                                (x) => x.competence._id === c._id
                                                            )?.grade
                                                    }
                                                />
                                            </Box>
                                        </Box>
                                    </div>
                                ))}
                            </Card>
                        ))}
                        {currentCertificate?.externalCompetences?.length > 0 && (
                            <Card className={"p-3 d-flex flex-column mt-3"}>
                                <Typography
                                    variant="h6"
                                    color="primary"
                                    id={`discrete-slider-block-external`}
                                    gutterBottom
                                >
                                    {"External Competences"}
                                </Typography>
                                {currentCertificate.externalCompetences.map((ec, j) => (
                                    <div className={j && "mt-3"} style={{ width: "100%" }}>
                                        <Box display="flex">
                                            <Box width="100%">
                                                <Typography
                                                    variant="caption"
                                                    id={`discrete-slider-e${j}`}
                                                    gutterBottom
                                                >
                                                    {ec.title}
                                                    {/* name to be loaded after population */}
                                                </Typography>
                                            </Box>
                                            <Box flexShrink={5}>
                                                <TextField
                                                    fullWidth
                                                    // hidden={!props.trainerMode && !result.comment.length}
                                                    inputProps={{ readOnly: true }}
                                                    placeholder={t("1-6")}
                                                    label="Grade"
                                                    variant="filled"
                                                    defaultValue={
                                                        detail?.externalCompetences?.find(
                                                            (x) => x.competence._id === ec._id
                                                        )?.grade
                                                    }
                                                />
                                            </Box>
                                        </Box>
                                    </div>
                                ))}
                            </Card>
                        )}
                        <TextField
                            label="Comment"
                            style={{ width: "100%" }}
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            size="large"
                            value={detail?.comment}
                            disabled={true}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <StyledButton autoFocus onClick={() => setOpen2(false)} color="primary">
                    Close
                </StyledButton>
            </DialogActions>
        </Dialog>
    )

    return (
        <ThemeProvider theme={new_theme}>
            <Grid container spacing={3} className="mt-2">
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${new_theme.palette.primary.PBorderColor}`, pb: 1 }}>
                        <div>
                            <Typography variant="h3" component="h3" sx={{ textAlign: 'left', color: new_theme.palette.newSupplementary.NSupText }}>
                                {t("Status") + ": " + (isCertified ? t("Certified") : t("Not yet certified"))}
                            </Typography>
                            <Typography variant="subtitle2" component="p">
                                {t("Blockchain status") + ": " + (isBlockchainCertified ? t("Certified") : t("Not yet certified"))}
                            </Typography>
                        </div>
                        <Box sx={{ display: 'flex', gap: '12px' }}>
                            <StyledButton eVariant="secondary" eSize="small" disabled={isCertified ? false : true} onClick={() => { setIsOpenPreviewModal(true); setDirectDownload(false) }}>{t("View Certificate")}</StyledButton>
                            <StyledButton eVariant="primary" eSize="small" disabled={isCertified ? false : true} onClick={() => { setIsOpenPreviewModal(true); setDirectDownload(true) }}>{t("Print/Download Certificate")}</StyledButton>
                        </Box>
                    </Box>
                    <Grid container>
                        <Grid item xs={12} md={8} lg={5} sx={{ mt: 2 }}>
                            <FormControl
                                disabled={!isCertified}
                                fullWidth
                                margin="normal"
                                required={true}
                                error={false}
                                variant='filled'
                                style={{ marginBottom: '16px' }}
                            >
                                <InputLabel id="selectedGroup-select-label">{t("Select version")}</InputLabel>
                                <Select
                                    name='selectedGroup'
                                    labelId="selectedGroup-select-label"
                                    id="eventType-select"
                                >
                                    <MenuItem value={10}>{new Date().toISOString().substring(0, 10)}</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    {isCert1 === true && (
                        <CertificatePreviewModal1 isOpenPreviewModal={isOpenPreviewModal} setIsOpenPreviewModal={setIsOpenPreviewModal} certificate={certificate} getVerificationBlock={getVerificationBlock} directDownload={directDownload} setDirectDownload={setDirectDownload} />
                    )}
                    {isCert2 === true && (
                        <CertificatePreviewModal2 isOpenPreviewModal={isOpenPreviewModal} setIsOpenPreviewModal={setIsOpenPreviewModal} certificate={certificate} getVerificationBlock={getVerificationBlock} directDownload={directDownload} setDirectDownload={setDirectDownload} />
                    )}
                    {isCert3 === true && (
                        <CertificatePreviewModal3 isOpenPreviewModal={isOpenPreviewModal} setIsOpenPreviewModal={setIsOpenPreviewModal} certificate={certificate} getVerificationBlock={getVerificationBlock} getQRAddress={getQRAddress} directDownload={directDownload} setDirectDownload={setDirectDownload} />
                    )}
                    {/* <Card classes={{ root: classes.Card }} style={{ padding: '16px' }}>
                        <CardHeader
                            title={(
                                <>
                                    <Typography style={{ fontSize: "24px", marginBottom: '8px' }} variant="h5">
                                        {t("Status") + ": " + (isCertified ? t("Certified") : t("Not yet certified"))}
                                    </Typography>
                                    <Typography style={{ fontSize: "12px" }} variant="h5">
                                        {t("Blockchain status") + ": " + (isBlockchainCertified ? t("Certified") : t("Not yet certified"))}
                                    </Typography>
                                </>
                            )}
                        />
                        <CardContent classes={{ root: classes.CardContentBody }} style={{ padding: '2px 0' }}>
                            <FormControl
                                disabled={!isCertified}
                                fullWidth
                                margin="normal"
                                required={true}
                                error={false}
                                variant='filled'
                                style={{ marginBottom: '16px' }}
                            >
                                <InputLabel id="selectedGroup-select-label">{t("Select version")}</InputLabel>
                                <Select
                                    name='selectedGroup'
                                    labelId="selectedGroup-select-label"
                                    id="eventType-select"
                                >
                                    <MenuItem value={10}>{new Date().toISOString().substring(0, 10)}</MenuItem>
                                </Select>
                            </FormControl>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography style={{ display: 'inline-flex', marginLeft: "40px" }} variant="h4">

                                    <IconButton color="secondary" size="small" disabled={!isCertified} onClick={() => { setIsOpenPreviewModal(true); setDirectDownload(false) }}>
                                        <SmartDisplayIcon />
                                    </IconButton>
                                </Typography>
                                <Typography style={{ display: 'inline-flex', float: "right", marginRight: "40px" }} variant="h4" >
                                    <IconButton color="secondary" size="small" disabled={!isCertified} onClick={() => { setIsOpenPreviewModal(true); setDirectDownload(true) }}>
                                        <CloudDownloadOutlinedIcon />
                                    </IconButton>
                                </Typography>
                            </div>

                            <Typography style={{ fontSize: "12px", fontFamily: "Roboto" }}> Display Certification <span className="mr-2" style={{ float: "right" }}>Print/Download </span>  </Typography>
                        </CardContent>
                    </Card> */}
                </Grid>

            </Grid>
            {trainerList}
            {viewEvaluationModal}
        </ThemeProvider>
    );
}