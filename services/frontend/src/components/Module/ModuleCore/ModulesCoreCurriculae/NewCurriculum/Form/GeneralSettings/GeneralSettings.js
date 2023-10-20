import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import {useTranslation} from "react-i18next";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import {FormHelperText} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import {useCurriculumContext} from "../../../../../../_ContextProviders/CurriculumProvider/CurriculumProvider";

export default function GeneralSettings(){
    const {t} = useTranslation();
    const [MSCurriculumLevel, setMSCurriculumLevel] = useState([]);
    const [MSAcademicYears, setMSAcademicYears] = useState([]);
    const [MSPeriods, setMSPeriods] = useState([]);
    const [MSGradingScales,setMSGradingScales] = useState([]);

    /** CurriculumContext **/
    const {
        currentModuleCore,
        basicValidators,
        curriculumReducerActionType,
        currentCurriculum,
        curriculumDispatch,
    } = useCurriculumContext();
    /**-------------------------------------------------------------**/

    useEffect(()=>{
        if(currentModuleCore.levels){
            setMSCurriculumLevel(currentModuleCore.levels.map(level=>({levelName: level.levelName})));
        }
        if(currentModuleCore.academicYears){
            setMSAcademicYears(currentModuleCore.academicYears)
            setMSPeriods(currentModuleCore.academicYears[0]?.periods);
        }
        if(currentModuleCore.gradingScales){
            setMSGradingScales(currentModuleCore.gradingScales)
        }
        if(currentCurriculum.assignedYear && currentCurriculum.assignedYear?.periods){
            setMSPeriods(currentCurriculum.assignedYear?.periods);
        }
    },[currentModuleCore]);


    const updatePeriods=async(data)=>{
        if(data.periods){
            await setMSPeriods(data.periods)
        }else{
            setMSPeriods([]);
        }
        // alternative find periods in curriculum core,
        // but if it is in the model uses because I don't have to look for...
    }

    const levelsList = MSCurriculumLevel ? MSCurriculumLevel.map((lvl, index)=><MenuItem key={`level-${index}`} value={lvl}>{lvl.levelName}</MenuItem>):[];
    const academicYearsList = MSAcademicYears ? MSAcademicYears.map((year, index)=><MenuItem key={year._id} value={year}>{year.name}</MenuItem>):[];
    const periodsList = MSPeriods ? MSPeriods.map((per, index)=><MenuItem key={per._id} value={per._id}>{per.name}</MenuItem>):[];
    const gradingScalesList = MSGradingScales ? MSGradingScales.map((scale, index)=><MenuItem key={scale._id} value={scale}>{scale.name}</MenuItem>):[];


    const updateHandler=(field, value)=>{
        curriculumDispatch({
            type: curriculumReducerActionType.UPDATE_BASIC_DATA,
            payload: {field, value}
        })
    };

    return(
        <Grid container className="mt-2">
            <Grid item md={6} className='px-2'>
                <TextField label={t("Curriculum name")} margin="normal"
                           name='name'
                           fullWidth
                           style={{maxWidth: "400px"}}
                           variant="filled"
                           required={true}
                           error={basicValidators.curriculumName}
                           helperText={basicValidators.curriculumName ? t("required") : ""}
                           InputLabelProps={{
                               shrink: true,
                           }}
                           value={currentCurriculum.name}
                           onInput={(e) => {updateHandler(e.target.name, e.target.value)}}
                />
                <FormControl fullWidth margin="normal" required={true} style={{maxWidth: "400px"}}
                             error={basicValidators.levelOfCurriculum} variant="filled">
                    <InputLabel id="level-select-label">{t("Level of the curriculum")}</InputLabel>
                    <Select
                        name='level'
                        labelId="level-select-label"
                        id="level-select"
                        value={currentCurriculum.level}
                        onChange={(e) => {updateHandler(e.target.name, e.target.value)}}
                        renderValue={(value) => value.levelName}
                    >
                        {levelsList}
                    </Select>
                    {basicValidators.levelOfCurriculum ? (<FormHelperText>{t("required")}</FormHelperText>) : null}
                </FormControl>
            </Grid>
            <Grid item md={6} className='px-2 d-flex flex-column align-items-center'>
                <FormControl component="fieldset" margin="normal" style={{maxWidth: "400px"}}>
                    <FormLabel component="legend" className="mb-3">{t("Select curriculum type")}</FormLabel>
                    <RadioGroup aria-label="type" name="type" value={currentCurriculum.type}
                                onChange={(e)=>{updateHandler(e.target.name, e.target.value)}}>
                    <FormControlLabel value={"BLENDED"}
                        control={<Radio style={{color:`rgba(82, 57, 112, 1)`, width: '20px', height: '20px', marginRight: '5px'}}/>}
                        label='Blended' />
                    <FormControlLabel value={"ONLINE"}
                        control={<Radio style={{color:`rgba(82, 57, 112, 1)`, width: '20px', height: '20px', marginRight: '5px'}}/>}
                        label='100% Online' />
                    </RadioGroup>
                </FormControl>
                {basicValidators.trainingModules ? (<FormHelperText error={true}>{t("Assign subject is required")}</FormHelperText>) : null}
                {/* <FormControl component="fieldset" className="mt-5" style={{maxWidth: "400px"}}>
                    <FormLabel component="legend" className="mb-3">{t("Visible for everyone?")}</FormLabel>
                    <RadioGroup aria-label="public-visible" name="isPublic" value={currentCurriculum.isPublic}
                                onChange={(e)=>{updateHandler(e.target.name, e.target.value==='true')
                                }}>
                    <FormControlLabel value={true} 
                        control={<Radio style={{color:`rgba(82, 57, 112, 1)`, width: '20px', height: '20px', marginRight: '5px'}}/>}
                        label='Public' />
                    <FormControlLabel value={false} 
                        control={<Radio style={{color:`rgba(82, 57, 112, 1)`, width: '20px', height: '20px', marginRight: '5px'}}/>}
                        label='Private' />                                    
                    </RadioGroup>
                </FormControl> */}
            </Grid>
        </Grid>
    )
}