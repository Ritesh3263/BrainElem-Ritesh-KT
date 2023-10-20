import React, {useState} from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import {useTranslation} from "react-i18next";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import {Divider, FormHelperText} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";

export default function General(props){
    const{
        MSClass={},
        setMSClass=()=>{},
        MSLevelOfClass=[],
        MSClassManagers=[],
        prevTrainingPaths=[],
        MSYears=[],
        errorValidator={},
    }=props;
    const {t} = useTranslation();

    const levelsList = MSLevelOfClass.length>0 ? MSLevelOfClass.map((level)=>(<MenuItem key={level._id} value={level.levelName}>{level.levelName}</MenuItem>)):[];
    const classManagesList = MSClassManagers.length>0 ? MSClassManagers.map((mgo)=>(<MenuItem key={mgo._id} value={mgo}>{`${mgo?.name} ${mgo?.surname}`}</MenuItem>)):[];
    const yearsList = MSYears.length>0 ? MSYears.map((year)=>(<MenuItem key={year._id} value={year}>{year.name}</MenuItem>)):[];

    return(
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <small style={{color: `rgba(82, 57, 112, 1)`}} className="mt-3">{t("General information")}</small>
                <Divider variant="insert" />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField label={t("Class name")} style={{ maxWidth:"400px"}} margin="dense"
                           variant="filled"
                           fullWidth
                           name="name"
                           InputLabelProps={{
                               shrink: true,
                           }}
                           required={true}
                           error={'name' in errorValidator}
                           helperText={'name' in errorValidator && t("required")}
                           value={MSClass.name}
                           onChange={({target:{value, name}}) => {
                               setMSClass(p=>({...p, [name]: value}))
                           }}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <FormControl style={{maxWidth:"400px"}} margin="dense" fullWidth={true} required={true} variant="filled"
                             error={'level' in errorValidator}
                >
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
                    {'level' in errorValidator && (<FormHelperText>{t("required")}</FormHelperText>)}
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
                <FormControl style={{maxWidth:"400px"}} margin="dense" fullWidth required={true} variant="filled"
                             error={'classManager' in errorValidator}
                >
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
                    {'classManager' in errorValidator && (<FormHelperText>{t("required")}</FormHelperText>)}
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
                <FormControl style={{maxWidth:"400px"}} margin="dense" fullWidth required={true} variant="filled"
                             error={'academicYear' in errorValidator}
                >
                    <InputLabel id="demo-simple-select-label">{t("Select year")}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name='academicYear'
                        value={MSClass.academicYear}
                        renderValue={p=> p.name}
                        onChange={({target:{value}}) => {
                            let newProgram = [];
                            setMSClass(p=>{
                                let val = Object.assign({},p);
                                val.academicYear = value;
                                value.periods.map(p=>{
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
                    {'academicYear' in errorValidator && (<FormHelperText>{t("required")}</FormHelperText>)}
                    {(MSClass.name !== 'New empty class') && (
                        <FormHelperText className="text-danger">{MSClass.academicYear ? t("Changing year will remove content assigned to this class") : ""}</FormHelperText>
                    )}
                </FormControl>
            </Grid>
        </Grid>
    )
}