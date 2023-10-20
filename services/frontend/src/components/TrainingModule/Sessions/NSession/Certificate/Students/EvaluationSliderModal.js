import React, { useEffect } from 'react'
import { Button, Card, Dialog, DialogActions, DialogContent, Grid, Slider, TextField, Typography } from '@material-ui/core'
import { useTranslation } from 'react-i18next';

export default function EvaluationSliderModal({open2, setOpen2, currentCertificate, detail, marks,studentFormHelper,setStudentFormHelper}) {
    useEffect(() => {
        if (Object.keys(detail).length === 0) {
            setStudentFormHelper(prevState => ({
                ...prevState,
                studentId: studentFormHelper.studentId,
            }))
        }
    }, [])

    const { t } = useTranslation();
    return (
        <Dialog onClose={()=>setOpen2(false)} aria-labelledby="customized-dialog-title" open={open2}>
            <DialogContent dividers>
                <Grid container spacing={1}>
                    <Grid item xs={12} className='d-flex flex-column'>
                        {currentCertificate?.assignedCompetenceBlocks?.map((cb, index)=>(
                            <Card className={"p-3 d-flex flex-column"+(index?" mt-3":"")} >
                                <Typography variant="h6" id={`discrete-slider-block-${index}`} gutterBottom>
                                    {cb.title}
                                </Typography>
                                {cb.competences.map((c,i)=>(
                                    <div className={i&&"mt-3"} >
                                        <Typography variant="caption" id={`discrete-slider-${i}`} gutterBottom>
                                            {c.title}
                                        </Typography>
                                        <Slider
                                            disabled={true}
                                            defaultValue={0}
                                            value={((detail?.competenceBlocks?.find(x=>x.block._id==cb._id))?.competences?.find(x=>x.competence._id==c._id))?.grade}
                                            aria-labelledby={`discrete-slider-${i}`}
                                            valueLabelDisplay="auto"
                                            step={1}
                                            marks={marks}
                                            min={0}
                                            max={6}
                                        />
                                    </div>
                                ))}
                            </Card>
                        ))}
                        {currentCertificate?.externalCompetences?.length>0 &&
                            <Card className={"p-3 d-flex flex-column mt-3"} >
                                <Typography variant="h6" color="primary" id={`discrete-slider-block-external`} gutterBottom>
                                    {"External Competences"}
                                </Typography>
                                {currentCertificate.externalCompetences.map((ec,j)=>(
                                    <div className={j&&"mt-3"} >
                                        <Typography variant="caption" id={`discrete-slider-e${j}`} gutterBottom>
                                            {ec.title}
                                            {/* name to be loaded after population */}
                                        </Typography>
                                        <Slider
                                            disabled={true}
                                            defaultValue={0}
                                            value={detail?.externalCompetences?.find(x=>x.competence._id === ec._id)?.grade}
                                            aria-labelledby={`discrete-slider-e${j}`}
                                            valueLabelDisplay="auto"
                                            step={1}
                                            marks={marks}
                                            min={0}
                                            max={6}
                                        />
                                    </div>
                                ))}
                            </Card>
                        }
                        <TextField label="Comment" style={{ width:"100%"}} margin="normal"
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
            <Button autoFocus onClick={()=>setOpen2(false)} color="primary">
                Close
            </Button>
        </DialogActions>
        </Dialog>
    )
}