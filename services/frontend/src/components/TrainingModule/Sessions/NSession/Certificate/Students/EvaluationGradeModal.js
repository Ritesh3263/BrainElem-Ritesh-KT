import { Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from "@material-ui/core";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import React from "react";
import { useTranslation } from 'react-i18next';

export default function EvaluationGradeModal({open2, setOpen2, currentCertificate, detail, updateDetail, trainee}) {
    const { t } = useTranslation();
    return (
        <Dialog
        onClose={() => setOpen2(false)}
        aria-labelledby="customized-dialog-title"
        open={open2}
        >
            <DialogTitle id="customized-dialog-title" >
                {t('Evaluation')}
                <Typography variant="subtitle2" >
                    {`${trainee.name} ${trainee.surname}`}
                </Typography>
                <Typography variant="caption" display="block" >
                    {"Verified on: " + new Date(currentCertificate.createdAt).toLocaleString()}
                </Typography>
            </DialogTitle>
            <FormControl className="mx-4">
                <FormLabel id="demo-radio-buttons-group-label">Student's evaluation status</FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    defaultValue={false}
                    name="row-radio-buttons-group"
                    value={detail.status}
                    onChange={(e)=>updateDetail('status',false,false,e.target.value)}
                >
                    <FormControlLabel value={true} control={<Radio />} label="Passed" />
                    <FormControlLabel value={false} control={<Radio />} label="Reject" />
                </RadioGroup>
            </FormControl>
            <DialogContent>
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
                                inputProps={{ readOnly: true }}
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
                                    event.target.value
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
                                onBlur={(event) => {
                                    let oldVal = detail?.externalCompetences?.find(
                                    (x) => x.competence._id === ec._id
                                    )?.grade;
                                    if (oldVal === event.target.value) return;
                                    updateDetail(
                                    'external',
                                    false,
                                    ec._id,
                                    event.target.value
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
                <Button autoFocus onClick={() => setOpen2(false)} color="primary">
                Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}
