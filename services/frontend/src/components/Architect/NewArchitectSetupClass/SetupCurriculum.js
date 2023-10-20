import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ModuleCoreService from "services/module-core.service";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import FormLabel from "@material-ui/core/FormLabel";
import Button from '@material-ui/core/Button';
import {Divider, FormGroup} from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import SyncIcon from "@mui/icons-material/Sync";
import {EButton} from "styled_components";
import Typography from "@material-ui/core/Typography";
import ManageSubjectTrainers from "./ManageSubjectTrainers";
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

const useStyles = makeStyles(theme => ({
    darkViolet: {
        color: theme.palette.primary.darkViolet
    },
}));

export default function SetupCurriculum(props){
    const{
        selectedPeriod={_id:undefined},
        MSClass={academicYear:{_id: undefined}},
        currentProgram={},
        setMSClass=()=>{},
    }=props;
    const {t} = useTranslation();
    const classes = useStyles();
    const {F_getHelper} = useMainContext();
    const {manageScopeIds} = F_getHelper();
    const [MSCurriculums,setMSCurriculums] = useState([]);
    const [selectedCurriculum, setSelectedCurriculum] = useState({});
    const [trainers, setTrainers] = useState([]);
    const [lockCurriculumChange,setLockCurriculumChange] = useState(false);


    useEffect(()=>{
        if(manageScopeIds.moduleId){
            ModuleCoreService.readAllModuleTrainers(manageScopeIds.moduleId).then(res=>{
                if(res.status === 200 && res.data.length>0){
                    setTrainers(res.data);
                }
            })
        }
    },[manageScopeIds.moduleId]);

    // useEffect(()=>{
    //     if(MSClass?.academicYear?._id && manageScopeIds.moduleId && selectedPeriod?._id){
    //         ModuleCoreService.readCurriculumsByYear(MSClass?.academicYear?._id, manageScopeIds.moduleId).then(res=>{
    //             if(res.status === 200 && res?.data?.length>0){
    //                 setMSCurriculums(res.data.filter(cur=> cur.assignedPeriod === selectedPeriod?._id) || []);
    //             }
    //         }).catch(err=>{
    //             console.log(err);
    //         })
    //     }
    // },[MSClass, selectedPeriod]);

    useEffect(()=>{
        if(MSClass?.academicYear?._id && manageScopeIds.moduleId && selectedPeriod?._id){
            ModuleCoreService.readCurriculumsByModule().then(res=>{
                if(res.status === 200 && res?.data?.length>0){
                    setMSCurriculums(res.data);
                }
            }).catch(err=>{
                console.log(err);
            })
        }
    },[MSClass, selectedPeriod]);

    useEffect(()=>{
        if(currentProgram?.trainingPath?._id && MSCurriculums.length>0){
            setSelectedCurriculum(MSCurriculums.find(c=> c._id === currentProgram?.trainingPath?._id) || null);
        }else{
            setSelectedCurriculum({});
        }
    },[currentProgram, MSCurriculums, MSClass]);

    useEffect(() => {
        // selected curriculum and assigned teachers?
        if(!selectedCurriculum?._id){
            setLockCurriculumChange(false)
        }else{
            setLockCurriculumChange(true)
        }
    }, [selectedCurriculum]);

    const handleCurriculumChange=(value)=>{
        setMSClass(p=>{
            let val = Object.assign({},p);

            let foundProgramIndex =  val.program.findIndex(pr=> pr.period === selectedPeriod?._id);
            let newProgram = null;
            if(foundProgramIndex !== -1){
                newProgram = {
                    assignment: [],
                    period: val.program[foundProgramIndex].period,
                    trainingPath:{
                        _id: value._id,
                        name: value.name
                    },
                    reprogram: true,
                    onGoing: !!MSClass.academicYear.periods.find(p => (new Date(p.startDate) <= new Date() && new Date(p.endDate) >= new Date()))
                }

                if(val.program[foundProgramIndex]._id){
                    newProgram = {...newProgram, ...{_id: val.program[foundProgramIndex]._id}}
                }

                if(value.trainingModules.length > 0){
                    value.trainingModules.map(tr=>{
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
                    period: selectedPeriod?._id,
                    trainingPath:{
                        _id: value._id,
                        name: value.name
                    },
                }
                val.program.push(newProgram)
            }
            return val;
        });
    }

    const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
        <Tooltip {...props} classes={{ popper: className }} />
      ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
          backgroundColor: theme.palette.common.white,
          color: 'rgba(0, 0, 0, 0.87)',
          boxShadow: theme.shadows[1],
          fontSize: 11,
        },
      }));


    const curriculumsList = MSCurriculums.map((curriculum, index)=>(
        <MenuItem key={curriculum._id} value={curriculum}
                  disabled={MSClass?.program?.some(p=> p?.trainingPath?._id === curriculum?._id)}
        >{curriculum.name}</MenuItem>
    ));

    return(
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <small style={{color: `rgba(82, 57, 112, 1)`}} className="mt-3">{t("Curriculum manage")}</small>
                <Divider variant="insert" />
            </Grid>
            <Grid item xs={12} md={6} lg={5}>
                <FormControl style={{maxWidth:"400px"}} variant="filled" fullWidth={true} margin='dense' required={true}>
                    <InputLabel id="demo-simple-select-label">{t("Select curriculum")}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        disabled={lockCurriculumChange}
                        value={selectedCurriculum}
                        renderValue={p=> p.name}
                        onChange={({target:{value}})=>handleCurriculumChange(value)}
                    >
                        {curriculumsList}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={4} className="d-flex flex-column align-items-center">
                
                {lockCurriculumChange ? (
                    <>
                        <LightTooltip   title="Editing curriculum will remove current progress in class" >
                            <Button variant="contained" size="small" color="secondary"
                                    style={{maxWidth:'200px'}}
                                    startIcon={<LockOpenIcon/>} onClick={()=>setLockCurriculumChange(false)}
                            >
                                {t("Unlock curriculum")}
                            </Button>
                        </LightTooltip>
                    </>
                ) : (
                    <>
                        {/*<EButton eSize="small" eVariant="secondary" startIcon={<SyncIcon/>}*/}
                        {/*        onClick={()=>{*/}
                        {/*            let e = {*/}
                        {/*                target : {*/}
                        {/*                    value: {*/}
                        {/*                        _id: selectedCurriculum?._id,*/}
                        {/*                        name: selectedCurriculum?.name,*/}
                        {/*                        trainingModules: selectedCurriculum?.trainingModules,*/}
                        {/*                    }*/}
                        {/*                }*/}
                        {/*            }*/}
                        {/*        }}>{t("Refresh subjects list")}</EButton>*/}
                        {/*<small className="text-danger">{t("Selecting this option will update the subjects list")}</small>*/}
                        </>
                )}
            </Grid>
            <Grid item xs={12}>
                <small style={{color: `rgba(82, 57, 112, 1)`}} className="mt-3">{t("Assign trainers to subjects")}</small>
                <Divider variant="insert" />
            </Grid>
            <Grid item xs={12}>
                <ManageSubjectTrainers
                    MSClass={MSClass}
                    setMSClass={setMSClass}
                    currentProgram={currentProgram}
                />
            </Grid>
        </Grid>
    )
}