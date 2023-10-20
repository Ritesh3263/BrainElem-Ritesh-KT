import React, {useEffect, useState} from "react";
import {Card, CardHeader } from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {useNavigate} from "react-router-dom";
import { makeStyles} from "@material-ui/core/styles";
import {now} from "moment";
import Chip from "@material-ui/core/Chip";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import ModuleCoreService from "../../../services/module-core.service"
import CertificationSessionService from "../../../services/certification_session.service"
import InternshipService from "../../../services/internship.service"
import CertificateService from "../../../services/certificate.service"
//Stepper
import GeneralInformations_1 from "./SessionFormSteps/GeneralInformations_1";
import AssignProgram_2 from "./SessionFormSteps/AssignProgram_2";
import AssignTrainees_3 from "./SessionFormSteps/AssignTrainees_3"
import {useTranslation} from "react-i18next";
import ConfirmActionModal from "../../common/ConfirmActionModal";
import Typography from "@material-ui/core/Typography";
import {useMainContext} from "../../_ContextProviders/MainDataContextProvider/MainDataProvider";


const useStyles = makeStyles(theme=>({}))

export default function SessionFrom({formIsOpen, setFormIsOpen}){
    const {F_showToastMessage, F_getHelper} = useMainContext();
    const {manageScopeIds} = F_getHelper();
    const { t, i18n, translationsLoaded } = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();

    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false});
    const [currentStep, setCurrentStep] = useState(0);
    const [allTrainees, setAllTrainees] = useState([]);
    const [allManagers, setAllManagers] = useState([]);
    const [internships, setInternships] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [curriculums, setCurriculums] = useState([]);
    const [session, setSession] = useState({
            name:"",
            unassignedTrainees:[],
            internships:"",
            certificate:"",
            examiners:[],
            trainingPath:"",
            level: "BEGINNER",
            startDate: new Date(now()).toISOString(),
            endDate: new Date(now()).toISOString(),
        });


    useEffect(()=>{
        if(actionModal.returnedValue){
            remove();
        }
    },[actionModal.returnedValue]);

    useEffect(()=>{
        ModuleCoreService.readAllTrainees(manageScopeIds.moduleId).then(res=>{
            setAllTrainees(res.data);
            if(formIsOpen.certificationSessionId !== ""){
                CertificationSessionService.read(formIsOpen.certificationSessionId).then(res2=>{
                    setSession(p=>
                        ({...p, ...res2.data,
                            examiners:res2.data.examiners.map(u=>{ u.old = true; return u }),
                            unassignedTrainees:res2.data.unassignedTrainees.map(u=>{ u.old = true; return u }),
                            startDate: res2.data.startDate ? new Date (res2.data.startDate).toISOString() : "",
                            endDate: res2.data.endDate ? new Date (res2.data.endDate).toISOString() : "",
                        })
                    );
                    res.data.map(trainee=>{
                        res2.data.unassignedTrainees.map(tr=>{
                            if(trainee._id === tr._id){
                                trainee.isSelected = true;
                                trainee.old = true;
                            }
                        })
                        return trainee;
                    })
                })
            } else{
                setSession({
                    name: "",
                    unassignedTrainees:[],
                    internships:[],
                    certificate:"",
                    examiners:[],
                    trainingPath:"",
                    level: "BEGINNER",
                    startDate: new Date(now()).toISOString(),
                    endDate: new Date(now()).toISOString(),
                });
            }

        }).catch((error)=>console.log(error));

        ModuleCoreService.readAllModuleTrainers(manageScopeIds.moduleId).then(res=>{
            setAllManagers(res.data);
            if(formIsOpen.certificationSessionId !== ""){
                CertificationSessionService.read(formIsOpen.certificationSessionId).then(res2=>{
                    res.data.map(examiner=>{
                        res2.data.examiners.map(tr=>{
                            if(examiner._id === tr._id){
                                examiner.isSelected = true;
                                examiner.old = true;
                            }
                        })
                        return examiner;
                    })
                })
            }

        }).catch((error)=>console.log(error));
        InternshipService.readAll().then(res=>{
            setInternships(res.data);
        });
        CertificateService.readAll().then(res=>{
            setCertificates(res.data);
        });
        //mocked selected year
        ModuleCoreService.readModuleCore(manageScopeIds.moduleId).then(res=>{
          setCurriculums(res.data.trainingPaths);
        })
    },[]);

    function save(){
        console.log("save", session);
        setFormIsOpen({isOpen: false, type: '', isNew: false, certificationSessionId: ""});
        // refresh list and table
        formIsOpen.certificationSessionId!==""?
        CertificationSessionService.update(session).then(res=>{
            F_showToastMessage(t("Data was updated"),"success");
        }).catch(error=>console.log(error))
        :
        CertificationSessionService.add(session).then(res=>{
            F_showToastMessage(t("Data was created"),"success");
        }).catch(error=>console.log(error))
    }

    function remove(){
        console.log("remove");
        setFormIsOpen({isOpen: false, type: '', isNew: false, certificationSessionId: ""});
        // refresh list and table
        // CertificateService.removeCompetenceBlock(certificateId).then(res=>{
        //
        // })
        F_showToastMessage(t("Data was removed"),"success");
    }


    const steps = [t("Basic setup"), t("Assign curriculum"), t("Assign trainees")]

    return(
        <Card className="p-0 d-flex flex-column m-0">
            {/*<CardHeader title={` ${formIsOpen.isNew ? "Create: " : "Edit: "} ${session.name}`}/>*/}
            {/* <CardHeader title={(
                <Typography variant="h5" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                    {` ${session?.name || t("Session name")}`}
                </Typography>
            )} avatar={<Chip label={formIsOpen.isNew ? t("Add"):t("Edit")} color="primary" />}
            />
            <Stepper alternativeLabel activeStep={currentStep}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <CardContent>
                <Grid container spacing={1}>
                    <Grid item xs={12} className='d-flex flex-column'>
                        {currentStep === 0 && (<GeneralInformations_1
                                                                        session={session}
                                                                        setSession={setSession}
                                                                        internships={internships}
                                                                        certificates={certificates}
                                                                        allManagers={allManagers}
                                                                        setAllManagers={setAllManagers}
                                                                        editable={true}
                        />)}
                        {currentStep === 1 && (<AssignProgram_2
                                                                        session={session}
                                                                        setSession={setSession}
                                                                        curriculums={curriculums}
                                                                        editable={true}
                        />)}
                        {currentStep === 2 && (<AssignTrainees_3
                                                                        allTrainees={allTrainees}
                                                                        setAllTrainees={setAllTrainees}
                                                                        session={session}
                                                                        setSession={setSession}
                                                                        editable={true}
                        />)}
                        {currentStep === 3 && (<span>{t("All ready done! You can save data now")}</span>)}
                    </Grid>
                </Grid>
            </CardContent>
            <CardActionArea>
                <CardActions className="d-flex justify-content-between align-items-center" >
                    <Grid container>
                        <Grid item xs={4}>
                            <Button classes={{root: classes.root}} variant="contained" size="small" color="secondary" onClick={() =>  {
                                F_showToastMessage(t("No change"),)
                                setFormIsOpen({isOpen: false, type: '', isNew: false, certificationSessionId: ""});
                            }}>
                                {t("Dismiss")}
                            </Button>
                        </Grid>
                        <Grid item xs={4} className="d-flex justify-content-between">
                            <Button size="small" variant="contained" color="primary"
                                    startIcon={<KeyboardArrowLeftIcon/>} onClick={()=>setCurrentStep(p=> (p>=1 ? p-1 : p))} disabled={currentStep === 0}>{t("prev")}</Button>
                            <Button size="small" variant="contained" color="primary"
                                    endIcon={<KeyboardArrowRightIcon/>} onClick={()=>setCurrentStep(p=> (p<=3 ? p+1 : p))} disabled={(currentStep >= 3)}>{t("next")}</Button>
                        </Grid>
                        <Grid item xs={4} className="p-0 d-flex justify-content-end">
                            {currentStep >= 3 && (
                                <>
                                    {/* {
                                        !formIsOpen.isNew && ( // hiding remove button for now
                                            <Button hidden={false} classes={{root: classes.root}} variant="contained" size="small" color="inherit"
                                                    onClick={()=>setActionModal({isOpen: true, returnedValue: false})}>
                                                {t("Remove")}
                                            </Button>
                                        )
                                    } 
                                    <Button classes={{root: classes.root}} size="small" variant="contained" color="primary"
                                            onClick={save} className="ml-5"
                                    >{t("Save")}</Button>
                                </>
                            )}
                        </Grid>
                    </Grid>
                </CardActions>
            </CardActionArea> */}
            <ConfirmActionModal actionModal={actionModal}
                                setActionModal={setActionModal}
                                actionModalTitle={t("Removing session")}
                                actionModalMessage={t("Are you sure you want to remove session? The action is not reversible!")}
            />
        </Card>
    )
}