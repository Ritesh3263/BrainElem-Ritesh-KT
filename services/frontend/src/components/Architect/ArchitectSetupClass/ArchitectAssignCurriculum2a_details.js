import React, {lazy, useEffect, useState} from "react";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import {Col, Row} from "react-bootstrap";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Avatar from "@material-ui/core/Avatar";
import ModuleCoreService from "../../../services/module-core.service";
import FormLabel from "@material-ui/core/FormLabel";
import {FormGroup} from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import LockOpenIcon from '@material-ui/icons/LockOpen';
import Chip from "@material-ui/core/Chip";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import {useTranslation} from "react-i18next";
import {useMainContext} from "../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import SyncIcon from '@mui/icons-material/Sync';
const AssignedTrainers = lazy(() => import("./AssignedTrainers"));

const useStyles = makeStyles(theme=>({}))


export default function ArchitectAssignCurriculum2a_details({MSClass, setMSClass, selectedPathId, selectedPeriodId, currentIndex, firstSetup}){
    const { t, i18n, translationsLoaded } = useTranslation();
    const [currentModuleId, setCurrentModuleId] = useState("");
    const {F_getHelper, F_showToastMessage, F_hasPermissionTo} = useMainContext();
    const {manageScopeIds} = F_getHelper();
    const classes = useStyles();
    const [MSCurriculums, setMSCurriculums] = useState([]);
    const [allTrainers, setAllTrainers] = useState([]);

    const [selectedPathIdState, setSelectedPathIdState] = useState(null);
    const [selectedPeriodIdState, setSelectedPeriodIdState] = useState(null);
    const [selectedCurriculum, setSelectedCurriculum] = useState({});
    const [periodIndex, setPeriodIndex] = useState(0);
    const [lockCurriculumChange,setLockCurriculumChange] = useState(false);
    const [isOpenSidebarDrawer, setIsOpenSidebarDrawer] = useState(
        {isOpen: false,
                    assignedTrainers: [],
                    currentIndex: null,
                    ind: null,}
    );

    useEffect(()=>{
        setSelectedPathIdState(selectedPathId);
    },[selectedPathId]);

    useEffect(()=>{
        setSelectedPeriodIdState(selectedPeriodId);
    },[selectedPeriodId]);

    useEffect(()=>{
        setPeriodIndex(currentIndex)
    },[currentIndex])

    useEffect(()=>{
        // getAllCurriculums
        ModuleCoreService.readCurriculumsByYear(MSClass.academicYear._id, manageScopeIds.moduleId).then(res=>{
            /** Selected by assigned Period to curriculum 12.07.21 **/
            if(res.data){
                let newData = res.data.filter(cur=> cur.assignedPeriod === selectedPeriodId);
                //setMSCurriculums(res.data)
                setMSCurriculums(newData);
            }
            getTrainers();
        })
    },[]);

    const getTrainers=()=>{
        // Get trainers
        ModuleCoreService.readAllModuleTrainers(manageScopeIds.moduleId).then(res=>{
            setAllTrainers(res.data);
        })
    }


    useEffect(()=>{
        let selCurr= MSCurriculums.filter(c=> c._id === selectedPathIdState);
        setSelectedCurriculum(selCurr[0]);
    });

    useEffect(()=>{
        if(selectedPathId !== undefined){
            if(firstSetup){
                setLockCurriculumChange(false);
                setMSClass(p=>{
                    let val = Object.assign({},p);
                    val.program[0].onGoing = true;
                    console.log(val);
                    return val;
                })
            }else{
                setLockCurriculumChange(true);
            }
        }
    },[]);


    const handleCurriculumChange=(e)=>{
        setMSClass(p=>{
            let val = Object.assign({},p);
            // console.log("aktualny program",val.program);
            // console.log("curriculum do przypisania",e.target.value);
            let newProgram = null;
            if((val.program.length >0) && (val.program.findIndex(pr=> pr.period.toString() === selectedPeriodIdState.toString()) >= 0)){
                let foundProgramIndex =  val.program.findIndex(pr=> pr.period.toString() === selectedPeriodIdState.toString());
                let period = val.academicYear.periods.find(p => p._id.toString() === selectedPeriodIdState.toString());
                newProgram = {
                    // _id: val.program[foundProgramIndex]._id ? val.program[foundProgramIndex]._id : "",
                    assignment: [],
                    period: val.program[foundProgramIndex].period,
                    trainingPath:{
                        _id: e.target.value._id,
                        name: e.target.value.name
                    },
                    reprogram: true,
                    onGoing: new Date(period.startDate) <= new Date() && new Date() <= new Date(period.endDate),
                }
                if(val.program[foundProgramIndex]._id) newProgram = {...newProgram, ...{_id: val.program[foundProgramIndex]._id}}

                if(e.target.value.trainingModules.length > 0){
                    e.target.value.trainingModules.map(tr=>{
                        tr._id = tr.originalTrainingModule
                        newProgram.assignment.push(
                            {
                                trainingModule: tr,
                                trainer: "",
                            }
                        )
                    })
                }

                val.program[foundProgramIndex] = newProgram;
            }else{
                newProgram = {
                    _id: "",
                    assignment: [],
                    period: selectedPeriodIdState,
                    trainingPath:{
                        _id: e.target.value._id,
                        name: e.target.value.name
                    },
                }
                val.program.push(newProgram)
            }
            //console.log("val", val)
            return val;
        })
    }

    const handleUpdateCurriculum=(e)=>{
        setIsOpenSidebarDrawer(p=>({...p, assignedTrainers: []}));
        getTrainers();
        setMSClass(p=>{
            let val = Object.assign({},p);
            // console.log("aktualny program",val.program);
            // console.log("curriculum do przypisania",e.target.value);
            let newProgram = null;
            if((val.program.length >0) && (val.program.findIndex(pr=> pr.period.toString() === selectedPeriodIdState.toString()) >= 0)){
                let foundProgramIndex =  val.program.findIndex(pr=> pr.period.toString() === selectedPeriodIdState.toString());
                let period = val.academicYear.periods.find(p => p._id.toString() === selectedPeriodIdState.toString());
                newProgram = {
                    // _id: val.program[foundProgramIndex]._id ? val.program[foundProgramIndex]._id : "",
                    assignment: [],
                    period: val.program[foundProgramIndex].period,
                    trainingPath:{
                        _id: e.target.value._id,
                        name: e.target.value.name
                    },
                    reprogram: true,
                    onGoing: new Date(period.startDate) <= new Date() && new Date() <= new Date(period.endDate),
                }
                if(val.program[foundProgramIndex]._id) newProgram = {...newProgram, ...{_id: val.program[foundProgramIndex]._id}}

                if(e.target.value.trainingModules.length > 0){
                    e.target.value.trainingModules.map(tr=>{
                        tr._id = tr.originalTrainingModule
                        newProgram.assignment.push(
                            {
                                trainingModule: tr,
                                trainer: "",
                            }
                        )
                    })
                }

                val.program[foundProgramIndex] = newProgram;
            }else{
                newProgram = {
                    _id: "",
                    assignment: [],
                    period: selectedPeriodIdState,
                    trainingPath:{
                        _id: e.target.value._id,
                        name: e.target.value.name
                    },
                }
                val.program.push(newProgram)
            }
            console.log("val", val)
            return val;
        })
    }

    const curriculumsList = MSCurriculums.map((curriculum, index)=><MenuItem key={curriculum._id} value={curriculum}>{curriculum.name}</MenuItem>);
    const trainersList = allTrainers.map((trainer, index)=><MenuItem key={trainer._id} value={trainer}>{`${trainer.name} ${trainer.surname}`}</MenuItem>);


    const subjectsList = MSClass.program.length >0 ? MSClass.program[periodIndex].assignment.map((data,index)=>(
        <Row className="d-flex mt-3 mx-5">
            <Col xs={1} className='p-0 m-0'><Avatar style={{width: "25px", height: "25px", backgroundColor: `rgba(82, 57, 112, 1)`}}><small>{index+1}</small></Avatar></Col>
            <Col xs={3}>{data.trainingModule ? (data.trainingModule.hasOwnProperty('newName')? data.trainingModule.newName : data.trainingModule.name) : "-"}</Col>
            <Col xs={8} className="d-flex align-items-center">
                <Button classes={{root: classes.root}} size="small" variant="contained" color="secondary"
                        className="my-0"
                        style={{width:"33%"}}
                        startIcon={<AddCircleOutlineIcon/>}
                        onClick={()=>{setIsOpenSidebarDrawer(
                            {isOpen: true,
                                assignedTrainers: data.trainers,
                                currInd: currentIndex,
                                ind: index,})}}
                >{t("Assign trainers")}</Button>
                <div className="">
                {data.trainers && data.trainers.length>0 ? data.trainers.map((trainer, ind)=><Chip className="mx-1 my-1" label={`${trainer.name} ${trainer.surname}`} onDelete={()=>{
                    setMSClass(p=>{
                        let val = Object.assign({},p);
                        val.program[currentIndex].assignment[index].trainers.splice(ind,1);
                        return val;
                    })}}/>) : <span>{t("You don't have any assigned trainers yet")}</span>}
                </div>
            </Col>

        </Row>
    )): null;

    return(
        <AccordionDetails className="d-flex flex-column mt-5 px-5">
            <Row className="d-flex mx-5 py-3">
                <Col className="text-muted p-0 m-0">
                    <FormControl style={{width:"25%"}} variant="filled">
                        <InputLabel id="demo-simple-select-label">{t("Select curriculum")}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            disabled={lockCurriculumChange}
                            value={selectedCurriculum}
                            renderValue={p=> p.name}
                            //input={<Input/>}
                            onChange={handleCurriculumChange}
                        >
                            {curriculumsList}
                        </Select>
                    </FormControl>
                    {lockCurriculumChange ? (
                        <span>
                        <Button classes={{root: classes.root}} size="small" variant="contained" color="primary" className="ml-5 mr-3" startIcon={<LockOpenIcon/>} onClick={()=>setLockCurriculumChange(false)}>{t("Unlock curriculum")}</Button>
                        <p><small className="text-danger">{t("If you are editing an existing curriculum, changing the curriculum will update the curriculum to the original version (this means overwriting changes to the existing program)")}</small></p>
                        </span>
                    ) : (
                        <span>
                        <Button classes={{root: classes.root}} size="small" variant="contained" color="primary" className="ml-5 mr-3" startIcon={<SyncIcon/>}
                                onClick={()=>{
                                    let e = {
                                        target : {
                                            value: {
                                                _id: selectedCurriculum?._id,
                                                name: selectedCurriculum?.name,
                                                trainingModules: selectedCurriculum?.trainingModules,
                                            }
                                        }
                                    }
                                    handleUpdateCurriculum(e);
                                }}>{t("Refresh subjects list")}</Button>
                        <small className="text-danger">{t("Selecting this option will update the subjects list")}</small>
                        </span>
                    )}

                </Col>
            </Row>
            <Row className="d-flex mx-5 py-3">
                <Col xs={1} className="text-muted p-0 m-0">No.</Col>
                <Col xs={3} className="text-muted" >{t("Subject name")}</Col>
                <Col xs={3} className="text-muted">{t("Assigned trainer")}</Col>
            </Row>
            {subjectsList}
            <AssignedTrainers
                isOpenSidebarDrawer={isOpenSidebarDrawer}
                setIsOpenSidebarDrawer={setIsOpenSidebarDrawer}
                allTrainers={allTrainers}
                setMSClass={setMSClass}
            />
        </AccordionDetails>
    )
}