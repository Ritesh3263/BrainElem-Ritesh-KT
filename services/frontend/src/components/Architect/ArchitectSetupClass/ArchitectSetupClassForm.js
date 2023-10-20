import React, {lazy, useEffect, useReducer, useState} from "react";
import moduleCoreService from "services/module-core.service";
import {useNavigate, useParams} from "react-router-dom";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import { CardHeader } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import {useTranslation} from "react-i18next";
import ConfirmActionModal from "components/common/ConfirmActionModal";
import Typography from "@material-ui/core/Typography";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";


const ArchitectSetupBasic1 = lazy(()=>import("./ArchitectSetupBasic1"));
const ArchitectAssignCurriculum2 = lazy(()=>import("./ArchitectAssignCurriculum2"));
const ArchitectAssignTrainees3 = lazy(()=>import("./ArchitectAssignTrainees3"));

const useStyles = makeStyles(theme=>({}))

export default function ArchitectSetupClassForm(){
    const { t } = useTranslation();
    const {F_showToastMessage, F_getHelper} = useMainContext();
    const {manageScopeIds} = F_getHelper();
    const classes = useStyles();
    const navigate = useNavigate();
    const { classId } = useParams();

    const [currentStep, setCurrentStep] = useState(0);
    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false});
    const [MSYears, setMSYears] = useState([]);
    const [MSClassManagers, setMSClassManagers] = useState([]);
    const [prevTrainingPaths, setPrevTrainingPaths] = useState([]);
    const [MSLevelOfClass,setMSLevelOfClass]=useState([]);
    const [MSClass, setMSClass] = useState({
        name: "",
        level: "",
        classManager: "",
        academicYear:"",
        program:[],
        trainees:[],
    });

    const [basicValidators, setBasicValidators] = useState({
        className: false,
        levelClass: false,
        classManager: false,
        academicYear: false,
        allPeriodHasCurriculum: false,
        allClassHasManager: false,
        assignedTrainees: false,
    })

    const [firstSetup, setFirstSetup]= useState(false);
    const [currentCurriculum, setCurrentCurriculum]=useState(0);
    const [currentModuleId, setCurrentModuleId] = useState("");
    const [classIndex, setClassIndex] = useState(0);
    const [currentModule, setCurrentModule] = useState({});

    useEffect(()=>{
        if(actionModal.returnedValue){
            removeClass();
        }
    },[actionModal.returnedValue]);


    useEffect(()=>{
        setCurrentCurriculum(0);
        setCurrentModuleId(manageScopeIds.moduleId)
        moduleCoreService.readModuleCore(manageScopeIds.moduleId).then(res=>{
             setCurrentModule(res.data)
            if(res.data.groups && classId !== "new"){
                setClassIndex(res.data.groups.findIndex(sy=> sy._id === classId));
                let editedClass = res.data.groups.filter(sy=> sy._id === classId);
                setMSClass(editedClass[0]);
                if(editedClass[0].name === "New empty class"){
                    setFirstSetup(true);
                }
                let previousTPs = []
                editedClass[0].program.forEach(p=>{
                    if(p.duplicatedTrainingPath) previousTPs.push(p.duplicatedTrainingPath._id)
                })
                setPrevTrainingPaths(previousTPs)
                // using dispatch
                //  MSClassDispatch({type:"INIT", payload: editedClass[0]});
            }
            if(res.data.academicYears){
                setMSYears(res.data.academicYears)
            }
            if(res.data.levels){
                setMSLevelOfClass(res.data.levels);
            }

            moduleCoreService.readAllModuleTrainers(manageScopeIds.moduleId).then(res=>{
                if(res.data){
                    setMSClassManagers(res.data)
                }
            });

        }).catch(error=>console.error(error))
    },[]);


    function saveChanges(){
        if(classId !== "new"){
            moduleCoreService.updateMSClass(MSClass).then(res=>{
                console.log(res)
                F_showToastMessage(t("Data was updated"),"success");
                navigate("/architect-classes")
            }).catch(error=>console.error(error))
        }
    }

    function removeClass(){
        moduleCoreService.removeMSClass(MSClass).then(res=>{
            //display res.message in toast
            console.log(res)
            F_showToastMessage(t("Data was created"),"success");
            navigate("/architect-classes")
        }).catch(error=>console.error(error));
    }

    function validateSteps(){
        // console.log("MSYears",MSYears);
        if(currentStep === 0){
            if(MSClass.className === "" || MSClass.className === null || MSClass.className === undefined){
                setMSClass(p=>{
                    let val = Object.assign({},p);
                    val.className = "example_name"
                    return val;
                })
            }
            if(MSClass.level === "" || MSClass.level === null || MSClass.level === undefined){
                setMSClass(p=>{
                    let val = Object.assign({},p);
                    val.level = "Basic"
                    return val;
                })
            }
            if(MSClass.classManager === "" || MSClass.classManager === null || MSClass.classManager === undefined){
                setMSClass(p=>{
                    let val = Object.assign({},p);
                    val.classManager = MSClassManagers.length > 0 ? MSClassManagers[0].username : "empty";
                    return val;
                })
            }
            if(MSClass.academicYear === "" || MSClass.academicYear === null || MSClass.academicYear === undefined){
                setMSClass(p=>{
                    let val = Object.assign({},p);
                    val.academicYear = MSYears[0]._id;
                    return val;
                })
            }
        }
        setCurrentStep(p=> (p<=2 ? p+1 : p))
    }

    function validateData(fromSave){
        // step 1 [0] - validators
        if(currentStep === 0){
            if( (MSClass.name.length <3 || MSClass.name === "New empty class") ||
                (MSClass.level === undefined || MSClass.level.length <2) ||
                (MSClass.classManager === undefined || MSClass.classManager.length <2) ||
                (MSClass.academicYear === undefined || MSClass.academicYear.length <2)){

                if(MSClass.name.length <3 || MSClass.name === "New empty class"){
                    setBasicValidators(p=>({...p,className: true}))
                }else {
                    setBasicValidators(p=>({...p,className: false}))
                }
                if(MSClass.level === undefined || MSClass.level.length <2){
                    setBasicValidators(p=>({...p,levelClass: true}))
                }else{
                    setBasicValidators(p=>({...p,levelClass: false}))
                }
                if(MSClass.classManager === undefined || MSClass.classManager.length <2){
                    setBasicValidators(p=>({...p,classManager: true}))
                }else{
                    setBasicValidators(p=>({...p,classManager: false}))
                }
                if(MSClass.academicYear === undefined || MSClass.academicYear.length <2){
                    setBasicValidators(p=>({...p,academicYear: true}))
                }else{
                    setBasicValidators(p=>({...p,academicYear: false}))
                }
            }else {
                // change step +1
                setCurrentStep(p=> (p<=2 ? p+1 : p))
                setBasicValidators({
                    className: false,
                    levelClass: false,
                    classManager: false,
                    academicYear: false,
                })
            }
        }

        // step 2 [1] - validators
        if(currentStep === 1){
            let invalid = false;
            MSClass.program.map(p=>{
                if(!p.trainingPath._id){
                    invalid = true;
                    setBasicValidators(p=>({...p,allPeriodHasCurriculum: true}))
                }
                p.assignment.map(a=>{
                    if(a.trainers ===undefined || a.trainers.length<1){
                        invalid = true;
                        setBasicValidators(p=>({...p,allClassHasManager: true}))
                    }
                })
            })
            if(!invalid){
                setBasicValidators(p=>({...p,allPeriodHasCurriculum: false}))
                setBasicValidators(p=>({...p,allClassHasManager: false}))
                setCurrentStep(p=> (p<=2 ? p+1 : p))
            }
        }

        // step 3 [2] -validators
        if(currentStep === 2){
            if(MSClass.trainees && MSClass.trainees.length<1){
                setBasicValidators(p=>({...p,assignedTrainees: true}))
            }else{
                setBasicValidators(p=>({...p,assignedTrainees: false}))
                if(fromSave === "SAVE"){
                    saveChanges();
                }
            }
        }
    }

    const steps = [t("General"), t("Assign curriculums to periods"), t("Assign trainees to class")]

    return(
    <Card  className="pt-2 pl-2 d-flex flex-column m-0 ">
            {/*<CardHeader title={` ${MSClass.name ? MSClass.name : "Class name"}`}/>*/}
            <CardHeader className="pl-0 mb-3" title={(
                <Typography variant="h5" component="h3" className="text-left" style={{  color: `rgba(82, 57, 112, 1)`, fontSize:"24px"}}>
                    {` ${MSClass.name || t("Class name")}`}
                </Typography>
            )} 
            />
            <Stepper alternativeLabel activeStep={currentStep}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <CardContent className="pl-0">
                {currentStep === 0 ? <ArchitectSetupBasic1 MSClass={MSClass} setMSClass={setMSClass} MSYears={MSYears}
                                                           MSClassManagers={MSClassManagers} MSLevelOfClass={MSLevelOfClass}
                                                           prevTrainingPaths={prevTrainingPaths} firstSetup={firstSetup} basicValidators={basicValidators}/>: null}
                {currentStep === 1 ? <ArchitectAssignCurriculum2 MSClass={MSClass} setMSClass={setMSClass} firstSetup={firstSetup} basicValidators={basicValidators}/> : null}
                {currentStep === 2 ? <ArchitectAssignTrainees3 MSClass={MSClass} setMSClass={setMSClass} basicValidators={basicValidators}/> : null}
                {currentStep === 3 ? <p>{t("summary")}</p> : null}
            </CardContent>
            <CardActionArea>
            <CardActions className="d-flex justify-content-between align-items-center" >
                <Grid container>
                    <Grid item xs={3}>
                        <Button classes={{root: classes.root}} variant="contained" size="small" color="secondary"  onClick={() =>  {
                            F_showToastMessage(t("No change"),)
                            navigate("/architect-classes")
                        }}>
                            {t("Back")}
                        </Button>
                    </Grid>
                    <Grid item xs={(currentStep < 2) ? 9 : 5} className="d-flex justify-content-between">
                        <Button size="small" variant="contained" color="primary"
                                startIcon={<KeyboardArrowLeftIcon/>} onClick={()=>setCurrentStep(p=> (p>=1 ? p-1 : p))} disabled={currentStep === 0}>{t("prev")}</Button>
                        <Button size="small" variant="contained" color="primary" 
                                endIcon={<KeyboardArrowRightIcon/>} onClick={()=>validateData()} disabled={(currentStep >= 2)}>{t("next")}</Button>
                    </Grid>
                    <Grid item xs={4} className="p-0 d-flex justify-content-end">
                        {currentStep === 2 ?
                            <>
                                {classId !== "new" ?
                                <Button  classes={{root: classes.root}} variant="contained" size="small" color="inherit" hidden={true} disabled={false}
                                        onClick={()=>setActionModal({isOpen: true, returnedValue: false})}>
                                    {t("Remove")}
                                </Button> : null}
                                <Button onClick={()=>validateData("SAVE")} classes={{root: classes.root}} size="small" variant="contained" color="primary" className="ml-5">
                                    {t("Save")}
                                </Button>
                            </>
                            :null}
                    </Grid>
                </Grid>
            </CardActions>
            </CardActionArea>
            <ConfirmActionModal actionModal={actionModal}
                                setActionModal={setActionModal}
                                actionModalTitle={t("Removing class program")}
                                actionModalMessage={t("Are you sure you want to remove class program? The action is not reversible!")}
            />
    </Card>
    )
}