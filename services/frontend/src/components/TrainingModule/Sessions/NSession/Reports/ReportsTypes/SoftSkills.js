import React from "react";
import {useTranslation} from "react-i18next";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {Paper} from "@material-ui/core";
import Slider from "@material-ui/core/Slider";
import TextField from "@material-ui/core/TextField";

const marks = [
    {
        value: 0,
        label: '0',
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
];

export default function SoftSkills({reportPreviewHelper, currentReport={}, setCurrentTraineeReports}){
    const { t } = useTranslation();

    const updateReport=(upType, fieldValue, skillIndex)=>{
        setCurrentTraineeReports(p=>{
            let val = Object.assign([],p);
            let reportIndex = val.findIndex(r=> r._id === currentReport?._id);
            if(reportIndex>-1){
                if(upType === 'COMMENT'){
                    val[reportIndex].comment = fieldValue;
                }else if('SKILL'){
                    val[reportIndex].softSkills[skillIndex].rate = fieldValue;
                }
            }
            return val;
        })
    }

    const skillsItemsList = currentReport?.softSkills?.length>0 ? currentReport.softSkills.map((item,index)=>(
        <Grid item className="mt-1 p-2" xs={12} md={6} lg={4} key={index}>
            <Paper elevation={10} className="px-3 pt-3 pb-1">
                <Typography id={`discrete-slider-${index}`} gutterBottom>
                    {item?.softSkill}
                </Typography>
                <Slider
                    style={{color: `rgba(82, 57, 112, 1)`}}
                    value={item?.rate}
                    defaultValue={0}
                    // getAriaValueText={"sd"}
                    aria-labelledby={`discrete-slider=${index}`}
                    valueLabelDisplay="auto"
                    step={1}
                    marks={marks}
                    min={0}
                    max={5}
                    disabled={reportPreviewHelper.type === "PREVIEW"}
                    onChange={(e,newVal)=>{
                        updateReport('SKILL',newVal, index);
                    }}
                />
            </Paper>
        </Grid>
    )):[];
    return(
            <Grid container>
                <Grid item xs={12} className="mt-3">
                    <Typography variant="body1"
                                component="h6" className="text-left"
                                style={{color: `rgba(82, 57, 112, 1)`}}>
                        {t("Soft skills")}
                    </Typography>
                    <hr className="my-1 mr-4"/>
                </Grid>
                <Grid item xs={12} className='mt-2'>
                    <Grid container>
                        {skillsItemsList}
                    </Grid>
                </Grid>
                <Grid item xs={12} className='mt-2'>
                    <TextField label={t("Comment")} margin="normal"
                               InputProps={{
                                   readOnly: (reportPreviewHelper.type === 'PREVIEW'),
                                   disableUnderline: (reportPreviewHelper.type === 'PREVIEW'),
                               }}
                               name='comment'
                               fullWidth
                               style={{maxWidth: "400px"}}
                               variant={(reportPreviewHelper.type === 'PREVIEW') ? 'standard' : 'filled'}
                               required={false}
                               multiline={true}
                               InputLabelProps={{
                                   shrink: true,
                               }}
                               value={currentReport?.comment}
                               onInput={(e) => {
                                   updateReport('COMMENT', e.target.value)
                               }}
                    />
                </Grid>
            </Grid>
    )
}