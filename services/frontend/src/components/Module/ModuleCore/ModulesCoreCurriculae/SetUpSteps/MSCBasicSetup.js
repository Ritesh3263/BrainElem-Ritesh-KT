import React, {useEffect, useState} from "react";
import {Col, Form, ListGroup, Row} from "react-bootstrap";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import MenuItem from "@material-ui/core/MenuItem";
import {FormHelperText} from "@material-ui/core";
import {useTranslation} from "react-i18next";

export default function MSCBasicSetup({MSCurriculum, setMSCurriculum, currentModule, BasicValidators}){
    const { t } = useTranslation();

    const [MSCurriculumLevel, setMSCurriculumLevel] = useState([]);
    const [MSAcademicYears, setMSAcademicYears] = useState([]);
    const [MSPeriods, setMSPeriods] = useState([]);
    const [MSGradingScales,setMSGradingScales] = useState([]);

    useEffect(()=>{
            if(currentModule.levels){
                setMSCurriculumLevel(currentModule.levels);
            }
            if(currentModule.academicYears){
                setMSAcademicYears(currentModule.academicYears)
                setMSPeriods(currentModule.academicYears[0]?.periods);
            }
            if(currentModule.gradingScales){
                setMSGradingScales(currentModule.gradingScales)
            }
    },[currentModule])

    const levelsList = MSCurriculumLevel.map((lvl, index)=><MenuItem key={`level-${index}`} value={lvl}>{lvl.levelName}</MenuItem>);
    const academicYearsList = MSAcademicYears.map((year, index)=><MenuItem key={year._id} value={year}>{year.name}</MenuItem>);
    const periodsList = MSCurriculum.assignedYear ? MSCurriculum.assignedYear.periods.map((per, index)=><MenuItem key={per._id} value={per._id}>{per.name}</MenuItem>): [];
    const gradingScalesList = MSGradingScales.map((scale, index)=><MenuItem key={scale._id} value={scale}>{scale.name}</MenuItem>);


    return(
        <Form as={Row} className="mb-5">
            <Col xs={6} className="d-flex flex-column">
                <TextField label={t("Curriculum name")} style={{ width:"80%"}} margin="normal"
                           variant="filled"
                           required={true}
                           error={BasicValidators.curriculumName}
                           helperText={BasicValidators.curriculumName ? t("required") : ""}
                           InputLabelProps={{
                               shrink: true,
                           }}
                           value={MSCurriculum.name}
                           onInput={(e) => {
                               setMSCurriculum(p=>{
                                   let val = Object.assign({},p);
                                   val.name = e.target.value;
                                   return val;
                               })
                           }}
                />
                <FormControl style={{width:"80%"}} margin="normal" required={true} error={BasicValidators.levelOfCurriculum} variant="filled">
                    <InputLabel id="demo-simple-select-label">{t("Level of the curriculum")}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={MSCurriculum.level}
                        renderValue={p=> p.levelName}
                        //input={<Input />}
                        onChange={(e) => {
                            setMSCurriculum(p=>{
                                let val = Object.assign({},p);
                                val.level = e.target.value;
                                return val;
                            })
                        }}
                    >
                        {levelsList}
                    </Select>
                    {BasicValidators.levelOfCurriculum ? (<FormHelperText>{t("required")}</FormHelperText>) : null}
                </FormControl>
                <FormControl style={{width:"80%"}} margin="normal" required={true} error={BasicValidators.assignedYear} variant="filled">
                    <InputLabel id="demo-simple-select-label">{t("Assign year")}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={MSCurriculum.assignedYear}
                        renderValue={p=> p.name}
                        //input={<Input/>}
                        onChange={(e) => {
                            setMSCurriculum(p=>{
                                let val = Object.assign({},p);
                                val.assignedPeriod = "";
                                val.assignedYear = e.target.value;
                                return val;
                            })
                        }}
                    >
                        {academicYearsList}
                    </Select>
                    {BasicValidators.assignedYear ? (<FormHelperText>{t("required")}</FormHelperText>) : null}
                </FormControl>
                <FormControl style={{width:"80%"}} margin="normal" required={true} error={BasicValidators.assignedPeriod} variant="filled">
                    <InputLabel id="demo-simple-select-label">{t("Assign period")}</InputLabel>
                    <Select
                        disabled={MSCurriculum.assignedYear === ""}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={MSCurriculum.assignedPeriod}
                        // renderValue={p=> p.name}
                        //input={<Input/>}
                        onChange={(e) => {
                            setMSCurriculum(p=>{
                                let val = Object.assign({},p);
                                val.assignedPeriod = e.target.value;
                                console.log(e.target.value);
                                return val;
                            })
                        }}
                    >
                        {periodsList}
                    </Select>
                    {BasicValidators.assignedPeriod ? (<FormHelperText>{t("required")}</FormHelperText>) : null}
                </FormControl>
            </Col>
            <Col xs={6} className="d-flex flex-column mt-5">
                <FormControl component="fieldset">
                    <FormLabel component="legend" className="mb-3">{t("Select curriculum type")}</FormLabel>
                    <RadioGroup aria-label="type" name="type" value={MSCurriculum.type} onChange={e=>setMSCurriculum(p=>{
                        let val = Object.assign({},p);
                        val.type = e.target.value;
                        return val;
                    })}>
                                    <FormControlLabel value={"BLENDED"}
                                                          control={<Radio style={{color:`rgba(82, 57, 112, 1)`, width: '20px', height: '20px', marginRight: '5px'}}/>}
                                                          label='Blended' />

                                    <FormControlLabel value={"ONLINE"}
                                                          control={<Radio style={{color:`rgba(82, 57, 112, 1)`, width: '20px', height: '20px', marginRight: '5px'}}/>}
                                                          label='100% Online' />
                    </RadioGroup>
                </FormControl>
                <FormControl component="fieldset" className="mt-5">
                    <FormLabel component="legend" className="mb-3">{t("Visible for everyone?")}</FormLabel>
                    <RadioGroup aria-label="public-visible" name="public-visible" value={MSCurriculum.isPublic} onChange={e=>setMSCurriculum(p=>{
                        let val = Object.assign({},p);
                        val.isPublic = (e.target.value === "true") ? true : false;
                        return val;
                    })}>
                                    <FormControlLabel value={true} 
                                                          control={<Radio style={{color:`rgba(82, 57, 112, 1)`, width: '20px', height: '20px', marginRight: '5px'}}/>}
                                                          label='Public' />

                                    <FormControlLabel value={false} 
                                                          control={<Radio style={{color:`rgba(82, 57, 112, 1)`, width: '20px', height: '20px', marginRight: '5px'}}/>}
                                                          label='Private' />
                    </RadioGroup>
                </FormControl>

            </Col>
        </Form>
    )
}