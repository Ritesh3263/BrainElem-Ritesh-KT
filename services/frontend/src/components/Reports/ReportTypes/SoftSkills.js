import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {Paper} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Slider from '@material-ui/core/Slider';
import { makeStyles } from '@material-ui/core/styles';
import {useTranslation} from "react-i18next";
import Button from "@material-ui/core/Button";
import SoftSkillTemplateService from "services/soft_skills_template.service";
import ContentService from "services/content.service";

const useStyles = makeStyles({});

export default function SoftSkills({currentTrainee, currentReport, setCurrentReport, reportType, reportPreviewHelper}){
    const { t } = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();

    const [selectedSkillTemplate, setSelectedSkillTemplate] = useState(null);
    const [reportsTemplates, setReportsTemplates] = useState([]);
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
        {
            value: 6,
            label: '6',
        },
    ];

    useEffect(()=>{
        SoftSkillTemplateService.readAllReportsTemplates().then(res=>{
            if(res.status === 200 && res?.data?.length>0){
                setReportsTemplates(res.data);
            }
        }).catch(err=>console.log(err));
    },[]);


    useEffect(()=>{
        if(currentReport?.softSkillsTemplate?._id){
            setSelectedSkillTemplate(currentReport?.softSkillsTemplate);
        }
    },[currentReport]);

    const reportsTemplatesList = reportsTemplates.map((item, index)=><MenuItem key={item._id} value={item}>{item.name}</MenuItem>);


    const handleChangeTemplate=(template)=>{
        // SoftSkillsTemplateService.readTemplateById(template._id).then(res=>{
        //     if(res.status === 200 && res?.data){
        //         setSelectedSkillTemplate(res.data);
        //         setCurrentReport(p=>{
        //             let val = Object.assign({},p);
        //             val.softSkillsTemplate = {_id: res.data._id, name: res.data.name};
        //             val.softSkills = [...res.data.softSkills];
        //             return val;
        //         });
        //     }
        // }).catch(err=>console.log(err));
    }

    const skillsItemsList = currentReport?.softSkills?.map((item,index)=>(
        <Grid item className="mt-5" xs={12} md={6} lg={4} key={index}>
            <Paper elevation={10} className="p-2">
                <Typography id={`discrete-slider-${index}`} gutterBottom>                
                    {item._id.name}
                </Typography>
                <Slider
                    defaultValue={0}
                    value={item?.rate}
                    // getAriaValueText={"sd"}
                    aria-labelledby={`discrete-slider=${index}`}
                    valueLabelDisplay="auto"
                    step={1}
                    marks={marks}
                    min={0}
                    max={6}
                    disabled={reportType === "PREVIEW"}
                    onChange={(e,newVal)=>{
                        setCurrentReport(p=>{
                            let val = Object.assign({},p);
                            val.softSkills[index].rate = newVal;
                            return val;
                        })
                    }}
                />
            </Paper>
        </Grid>
    ))??[];

    return(
        <Grid container spacing={3} className="mt-3">
            <Grid item xs={12} lg={12}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Typography variant="h5" component="h6" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                {t("Soft skills")}
                            </Typography>
                            <hr className="my-1 mr-4"/>
                            {(reportType === 'ADD') ? (
                                <FormControl style={{minWidth:'200px', maxWidth:'400px'}} margin="dense" fullWidth={true}
                                             variant={(reportType === 'EDIT') ? 'standard' : 'filled'}
                                >
                                    <InputLabel id="demo-simple-select-label">{t("Select skills template")}</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={currentReport.softSkillsTemplate}
                                        //input={<Input/>}
                                        readOnly={(reportType === 'EDIT')}
                                        disableUnderline={(reportType === 'EDIT')}
                                        renderValue={p=> p.name}
                                        onChange={(e) => {
                                            // handleChangeTemplate(e.target.value);
                                            //setSelectedSkillTemplate(e.target.value);
                                            setCurrentReport(p=>{
                                                let val = Object.assign({},p);
                                                val.softSkillsTemplate = e.target.value;
                                                val.softSkills = e.target.value.softSkills.map(item=>({_id: item, rate: 0}));
                                                return val;
                                            });
                                        }}
                                    >
                                        {reportsTemplatesList}
                                    </Select>
                                </FormControl>
                            ) :(
                                <TextField
                                    style={{minWidth:'200px', maxWidth:'400px'}}
                                    variant="standard"
                                    fullWidth={true}
                                    label={t("Selected template")}
                                    margin="dense"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        readOnly: true,
                                        disableUnderline: true,
                                    }}
                                    value={currentReport.softSkillsTemplate?.name}
                                />
                            )}
                        </Grid>

                        {skillsItemsList?.length>0 ? skillsItemsList : t("Student don't have any skills yet")}

                        <Grid item xs={12} className="mt-3">
                            <TextField
                                variant={(reportType === "PREVIEW") ? 'standard' : 'filled'}
                                style={{minWidth:'200px', maxWidth:'400px'}}
                                fullWidth
                                label={t("Comment")}
                                margin="dense"
                                multiline={true}
                                maxRows={3}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    readOnly: reportType === "PREVIEW",
                                    disableUnderline: reportType === "PREVIEW"
                                }}
                                value={currentReport?.comment}
                                onInput={(e) => {
                                    setCurrentReport(p=>({...p, comment: e.target.value}))
                                }}
                            />
                        </Grid>
                    </Grid>
            </Grid>
        </Grid>
        )
}