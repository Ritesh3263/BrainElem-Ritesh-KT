import React from "react";
import {Col, Form, Row} from "react-bootstrap";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {FormHelperText} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import Grid from "@mui/material/Grid";

export default function ArchitectSetupBasic1({MSClass,setMSClass,MSYears,MSClassManagers,MSLevelOfClass, prevTrainingPaths, firstSetup, basicValidators}){
    const { t } = useTranslation();
    const yearsList = MSYears.map((year, index)=><MenuItem key={year._id} value={year}>{year.name}</MenuItem>)
    const classManagesList = MSClassManagers.map((mgo, index)=><MenuItem key={mgo._id} value={mgo}>{`${mgo?.name} ${mgo?.surname}`}</MenuItem>)
    const levelsList = MSLevelOfClass.map((level, index)=><MenuItem key={level._id} value={level.levelName}>{level.levelName}</MenuItem>);
    return(
        <>
        <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
                <TextField label={t("Class name")} style={{ maxWidth:"400px"}} margin="dense"
                           variant="filled"
                           fullWidth
                           name="name"
                           InputLabelProps={{
                               shrink: true,
                           }}
                           required={true}
                           error={basicValidators.className}
                           helperText={basicValidators.className ? t("required") : ""}
                           value={MSClass.name}
                           onInput={({target:{value, name}}) => {
                               setMSClass(p=>({...p, [name]: value}))
                           }}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <FormControl style={{maxWidth:"400px"}} margin="dense" fullWidth={true} required={true} error={basicValidators.levelClass} variant="filled">
                    <InputLabel id="demo-simple-select-label">{t("Level of class")}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name='level'
                        value={MSClass.level}
                        onChange={({target:{name,value}}) => {
                            setMSClass(p=>({...p,[name]:value}));
                        }}
                    >
                        {levelsList}
                    </Select>
                    {basicValidators.levelClass ? (<FormHelperText>{t("required")}</FormHelperText>) : null}
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
                <FormControl style={{maxWidth:"400px"}} margin="dense" fullWidth required={true} error={basicValidators.classManager} variant="filled">
                    <InputLabel id="demo-simple-select-label">{t("Assign class manager")}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name='classManager'
                        value={MSClass.classManager}
                        renderValue={({name='', surname=''})=> `${name} ${surname}`}
                        onChange={({target:{name,value}}) => {
                            setMSClass(p=>({...p,[name]:value}));
                        }}
                    >
                        {classManagesList}
                    </Select>
                    {basicValidators.classManager ? (<FormHelperText>{t("required")}</FormHelperText>) : null}
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
                <FormControl style={{maxWidth:"400px"}} margin="dense" fullWidth required={true} error={basicValidators.academicYear} variant="filled">
                    <InputLabel id="demo-simple-select-label">{t("Select year")}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name='academicYear'
                        value={MSClass.academicYear}
                        renderValue={p=> p.name}
                        onChange={(e) => {
                            let newProgram = [];
                            setMSClass(p=>{
                                let val = Object.assign({},p);
                                val.academicYear = e.target.value;
                                e.target.value.periods.forEach(p=>{
                                    newProgram.push({
                                        period: p._id,
                                        trainingPath: {},
                                        assignment: [],
                                        reprogram: true,
                                    })
                                })
                                val.program = newProgram;
                                val.trainees = [];
                                val.prevTrainingPaths = prevTrainingPaths;
                                return val;
                            })
                        }}
                    >
                        {yearsList}
                    </Select>
                    {basicValidators.academicYear ? (<FormHelperText>{t("required")}</FormHelperText>) : null}
                    {!firstSetup && (
                        <FormHelperText className="text-danger">{MSClass.academicYear ? t("Changing year will remove content assigned to this class") : ""}</FormHelperText>
                    )}
                </FormControl>
            </Grid>
        </Grid>
        </>
    )
}