import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ETab, ETabBar } from "../../../../../../styled_components";
import { makeStyles } from "@material-ui/core/styles";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import { ThemeProvider, Box, Card, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import StyledButton from 'new_styled_components/Button/Button.styled';
import { new_theme } from "NewMuiTheme";
import "../Certificate.scss";

const useStyles = makeStyles(theme => ({
    Label:
    {
        color: `${new_theme.palette.secondary.DarkPurple} !important`,
        width: '20px',
        height: '20px',
        marginRight: '5px'
    },
    textField: {
        '& input': {
            color: 'black',
            textAlign: 'center',
            fontWeight: '900',
            backgroundColor: 'ghostwhite',
        },
        '& input:disabled': {
            color: 'black',
            textAlign: 'center',
            fontWeight: '900',
            backgroundColor: 'ghostwhite',
        },
    },
}))

export default function CertifyModal({ open, setOpen, examiners, isCertified, currentStudent, setActionModal, currentCertificate, updateDetail, traineeCertification, setTraineeCertification, detail, setDetail, avgDetail }) {
    const { t } = useTranslation();
    const [currentTab, setCurrentTab] = useState(0);
    const classes = useStyles();
    const [status, setStatus] = useState(examiners.map(x => 0));
    const { F_getHelper } = useMainContext();
    const { userPermissions } = F_getHelper();

    useEffect(() => {
        if (currentTab) {
            let det = traineeCertification.details.find(d => d.examiner === examiners[currentTab - 1]._id)
            setDetail(det)
            setStatus(k => {
                let newStatus = [...k];
                newStatus[currentTab - 1] = typeof det.status === 'string' ? det.status === 'true' : det.status;
                return newStatus;
            })

        }
    }, []);

    useEffect(() => {
        setCurrentTab(0)
    }, [currentStudent._id]);

    useEffect(() => {
        if (currentTab) {
            let det = traineeCertification.details.find(d => d.examiner === examiners[currentTab - 1]._id)
            setDetail(det)
            setStatus(k => {
                let newStatus = [...k];
                newStatus[currentTab - 1] = typeof det.status === 'string' ? det.status === 'true' : det.status;
                return newStatus;
            })
        }
        else setDetail({});
    }, [currentTab])

    const trainerContents = examiners.map((examiner, index) => {
        return Object.keys(detail).length ? (
            <Grid container spacing={1}>
                <Grid item xs={12} className="d-flex flex-column">
                    <FormControl className="mx-4">
                        <FormLabel id="demo-radio-buttons-group-label">Student's evaluation status</FormLabel>
                        <RadioGroup className='mt-2'
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            defaultValue={false}
                            name="row-radio-buttons-group"
                            value={status[index]}
                            onChange={(e) => {
                                let val = typeof e.target.value === 'string' ? e.target.value === 'true' : e.target.value;
                                setStatus(p => {
                                    let newStatus = [...p];
                                    newStatus[index] = val;
                                    return newStatus;
                                })
                                setDetail({ ...detail, status: val })
                                updateDetail('status', false, detail._id, val)
                            }}
                        >
                            <FormControlLabel value={true} control={<Radio className={classes.Label} />} label="Passed" />
                            <FormControlLabel value={false} control={<Radio className={classes.Label} />} label="Reject" />
                        </RadioGroup>
                    </FormControl>
                    <Typography variant="caption" display="block" align="right">
                        {"Evaluated on:" + new Date(detail.verificationDate).toLocaleString()}
                    </Typography>
                    {currentCertificate?.assignedCompetenceBlocks?.map((cb, index2) => (
                        <Card
                            className={"p-3 d-flex flex-column" + (index2 ? " mt-3" : "")}
                        >
                            <Typography
                                variant="h6"
                                id={`discrete-slider-block-${index2}`}
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
                                                placeholder={t("1-6")}
                                                className={classes.textField}
                                                disabled={true}
                                                label="Grade"
                                                variant="filled"
                                                value={
                                                    detail?.competenceBlocks
                                                        ?.find((x) => x.block._id === cb._id)
                                                        ?.competences?.find(
                                                            (x) => x.competence._id === c._id
                                                        )?.grade || ''
                                                }
                                                onBlur={(event) => {
                                                    let oldVal = detail?.competenceBlocks
                                                        ?.find((x) => x.block._id === cb._id)
                                                        ?.competences?.find(
                                                            (x) => x.competence._id === c._id
                                                        )?.grade;
                                                    if (oldVal === event.target.value) return;
                                                    updateDetail(
                                                        'block',
                                                        cb._id,
                                                        c._id,
                                                        event.target.value || ''
                                                    );
                                                }}
                                                onKeyUp={(event) => {
                                                    if (event.key === "Enter") event.target.blur();
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                </div>
                            ))}
                        </Card>
                    ))}
                    {currentCertificate?.externalCompetences?.length > 0 && (
                        <Card className={"d-flex flex-column mt-3"}>
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
                                            </Typography>
                                        </Box>
                                        <Box flexShrink={5}>
                                            <TextField
                                                fullWidth
                                                placeholder={t("1-6")}
                                                label="Grade"
                                                variant="filled"
                                                className={classes.textField}
                                                disabled={true}
                                                value={
                                                    detail?.externalCompetences?.find(
                                                        (x) => x.competence._id === ec._id
                                                    )?.grade || ''
                                                }
                                                onBlur={(event) => {
                                                    let oldVal = detail?.externalCompetences?.find(
                                                        (x) => x.competence._id === ec._id
                                                    )?.grade;
                                                    if (oldVal === event.target.value) return;
                                                    updateDetail(
                                                        'external',
                                                        false,
                                                        ec._id,
                                                        event.target.value || ''
                                                    );
                                                }}
                                                onKeyUp={(event) => {
                                                    if (event.key === "Enter") event.target.blur();
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                </div>
                            ))}
                        </Card>
                    )}
                    <TextField label={t("Comment")} margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        fullWidth
                        variant="filled"
                        value={detail?.comment}
                    />
                </Grid>
            </Grid>
        ) : (<div>No detail</div>)
    })
    const avgContent = (
        <Grid container spacing={1}>
            <Grid item xs={12} className="d-flex flex-column">
                {avgDetail?.assignedCompetenceBlocks?.map((cb, index) => (
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
                                            placeholder={t("1-6")}
                                            className={classes.textField}
                                            disabled={true}
                                            label="Grade"
                                            variant="filled"
                                            value={c.grade || ''}
                                        />
                                    </Box>
                                </Box>
                            </div>
                        ))}
                    </Card>
                ))}
                {avgDetail?.externalCompetences?.length > 0 && (
                    <Card className={"p-3 d-flex flex-column mt-3"}>
                        <Typography
                            variant="h6"
                            color="primary"
                            id={`discrete-slider-block-external`}
                            gutterBottom
                        >
                            {"External Competences"}
                        </Typography>
                        {avgDetail.externalCompetences.map((ec, j) => (
                            <div className={j && "mt-3"} style={{ width: "100%" }}>
                                <Box display="flex">
                                    <Box width="100%">
                                        <Typography
                                            variant="caption"
                                            id={`discrete-slider-e${j}`}
                                            gutterBottom
                                        >
                                            {ec.title}
                                        </Typography>
                                    </Box>
                                    <Box flexShrink={5}>
                                        <TextField
                                            fullWidth
                                            placeholder={t("1-6")}
                                            label="Grade"
                                            variant="filled"
                                            className={classes.textField}
                                            disabled={true}
                                            value={ec.grade || ''}
                                        />
                                    </Box>
                                </Box>
                            </div>
                        ))}
                    </Card>
                )}
                <TextField label={t("Comment")} margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    variant="filled"
                    value={traineeCertification?.additionalComment}
                    disabled={isCertified}
                    onChange={(event) => {
                        setTraineeCertification({
                            ...traineeCertification,
                            additionalComment: event.target.value,
                        });
                    }}
                    onBlur={(event) => {
                        updateDetail(
                            'additionalComment',
                            false, false,
                            event.target.value
                        );
                    }}
                />
            </Grid>
        </Grid>
    )
    const tabContents = [avgContent, ...trainerContents]


    return (

        <Dialog onClose={() => setOpen(false)} aria-labelledby="customized-dialog-title" open={open} PaperProps={{
            sx: {
                minWidth: { xs: '90%', sm: '400px', md: '400px', lg: '500px', xl: '500px' },
                borderRadius: '12px',
                padding: '26px',
                overflow: 'hidden'
            }
        }}>

            <Typography variant="result_title" component="h3" sx={{ color: new_theme.palette.primary.MedPurple, mb: 1 }}>{t("Certified Trainee")}</Typography>
            <Typography variant="subtitle0" component="p" sx={{ mb: 0, color: new_theme.palette.newSupplementary.NSupText }}>
                {t("Evaluation - ")}{`${currentStudent.name} ${currentStudent.surname}`}
            </Typography>
            {traineeCertification.verificationDate ? (
                <Typography variant="caption" display="block">
                    {t("Certified on ")}:  {new Date(traineeCertification.verificationDate).toLocaleString()}
                </Typography>
            ) : <></>}

            <Grid item xs={12}>
                {tabContents[currentTab + 0] || <div>{t("No data")}</div>}
            </Grid>
            <Grid item xs={12} >
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <StyledButton eVariant="secondary" eSize="small" onClick={() => setOpen(false)}>{t("Cancel")}</StyledButton>
                    {!isCertified && userPermissions.bcTrainer.access && <>
                        <StyledButton eVariant="primary" eSize="small" onClick={() => {
                            setActionModal({ isOpen: true, returnedValue: false })
                            updateDetail('additionalComment', false, false, traineeCertification?.additionalComment)
                        }}>{t("Certify")} {currentStudent?.name} {currentStudent?.surname}</StyledButton>
                    </>
                    }
                </Box>
            </Grid>
            {/* {!isCertified && userPermissions.bcTrainer.access &&
                <DialogActions>
                    <Button onClick={() => {
                        setActionModal({ isOpen: true, returnedValue: false })
                        updateDetail('additionalComment', false, false, traineeCertification?.additionalComment)
                    }} color="primary">
                        Certify {currentStudent?.name} {currentStudent?.surname}
                    </Button>
                </DialogActions>
             } */}
        </Dialog>
    )
}