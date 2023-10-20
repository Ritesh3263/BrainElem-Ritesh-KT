import React, {lazy, useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import {theme} from "MuiTheme";
import {useTranslation} from "react-i18next";
import {Card, CardHeader, Divider, FormHelperText, CardContent} from "@material-ui/core";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {ETab, ETabBar} from "styled_components";
import moduleCoreService from "services/module-core.service";
import FormControl from "@material-ui/core/FormControl";
import {useNavigate} from "react-router-dom";


const General = lazy(() => import("./General"));
const ClassProgram = lazy(() => import("./ClassProgram"));
const ClassStudents = lazy(() => import("./ClassStudents"));

const classInitialState={
    name: "New empty class",
    level: "",
    classManager: "",
    academicYear:"",
    program:[],
    trainees:[],
}

export default function ArchitectSetupClassForm(props){
    const{
        setEditFormHelper=({isOpen= false, openType= undefined, classId= undefined})=>{},
        editFormHelper={isOpen: false, openType: undefined, classId: undefined},
    }=props;
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {F_showToastMessage,F_getHelper} = useMainContext();
    const {manageScopeIds} = F_getHelper();
    const [activeTab, setActiveTab] = useState(0);
    const [currentClass, setCurrentClass]= useState(classInitialState);
    const [prevTrainingPaths, setPrevTrainingPaths] = useState([]);
    const [MSYears, setMSYears] = useState([]);
    const [MSLevelOfClass,setMSLevelOfClass]=useState([]);
    const [MSClassManagers, setMSClassManagers] = useState([]);
    const [errorValidator, setErrorValidator]=useState({test:{message:'required'}});

    useEffect(()=>{
        if(editFormHelper.isOpen && editFormHelper.classId){
            setActiveTab(0);
            moduleCoreService.readModuleCore(manageScopeIds.moduleId).then(res=>{
                if(res.data.groups && editFormHelper.classId !== 'NEW'){
                    let founded = res.data.groups.find(gr=> gr._id === editFormHelper.classId);
                    let previousTPs = [];
                    if(founded){
                        setCurrentClass(p=>({...p,...founded}));
                        founded.program.forEach(p=>{
                            if(p.duplicatedTrainingPath){
                                previousTPs.push(p.duplicatedTrainingPath._id)
                            }
                        });
                        setPrevTrainingPaths(previousTPs);
                    }
                }else{
                    setCurrentClass(classInitialState);
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
            }).catch(err=>{
                console.log(err)
            });

        }else{
            setCurrentClass(classInitialState);
        }
    },[editFormHelper.isOpen, editFormHelper.classId]);

    const save=()=>{
            setActiveTab(0);
            moduleCoreService.updateMSClass(currentClass).then(res=>{
               // console.log(res)
                F_showToastMessage(t("Data was updated"),"success");
                setEditFormHelper({isOpen: false, openType: undefined, classId: undefined});
                navigate('/architect-classes')
            }).catch(error=>console.error(error))

    };

    useEffect(() => {
        if(Object.keys(errorValidator).length === 0){
            save();
        }
    }, [errorValidator]);


    const preSave=()=>{
        setErrorValidator(p=> {
            let val = Object.assign({}, p);
            delete val.test;
            return val;
        });
        validateError();
    }

    const validateError=()=>{
        if(currentClass.name === 'New empty class' || currentClass.name === ''){
            setErrorValidator(p=>({...p,name:{message:"required"},}));
            setActiveTab(0);
        }else{
           setErrorValidator(p=> {
               let val = Object.assign({}, p);
               delete val.name;
               return val;
           });
        }

        if(currentClass.level === ''){
            setErrorValidator(p=>({...p,level:{message:"required"},}));
            setActiveTab(0);
        }else{
            setErrorValidator(p=> {
                let val = Object.assign({}, p);
                delete val.level;
                return val;
            });
        }

        if(currentClass.classManager === ''){
            setErrorValidator(p=>({...p,classManager:{message:"required"},}));
            setActiveTab(0);
        }else{
            setErrorValidator(p=> {
                let val = Object.assign({}, p);
                delete val.classManager;
                return val;
            });
        }

        if(currentClass.academicYear === ''){
            setErrorValidator(p=>({...p,academicYear:{message:"required"},}));
            setActiveTab(0);
        }
        else{
            setErrorValidator(p=> {
                let val = Object.assign({}, p);
                delete val.academicYear;
                return val;
            });
        }

        if(currentClass.program.some((p)=> Object.keys(p.trainingPath).length === 0)){
            setErrorValidator(p=>({...p,trainingPath:{message:"Assign curriculum for every period"},}));
            setActiveTab(1);
        }else{
            setErrorValidator(p=> {
                let val = Object.assign({}, p);
                delete val.trainingPath;
                return val;
            });
        }
    }

    const manageStudents=({type,payload})=>{
        switch(type){
            case 'REMOVE':{
                setCurrentClass(p=>{
                   let val = {...p};
                   val.trainees = val.trainees.filter(tr=> tr._id !== payload);
                   return val;
                });
                F_showToastMessage(t("Student was removed from class"));
                break;
            }
            case 'ADD':{
                setCurrentClass(p=>{
                    let val = {...p};
                    val.trainees = [...val.trainees, payload]
                    return val;
                });
                F_showToastMessage(t("Student was added to class"));
                break;
            }
            default: return;
        }
    }


    return(
        <Card className="p-0 d-flex flex-column m-0">
            <CardHeader className='pb-0' title={(
                <Typography variant="h3" component="h5" className="text-left" style={{fontSize:"32px", color:theme.palette.primary.lightViolet}}>
                    { currentClass.name || t("New class")}
                </Typography>
            )}
            />
            <CardContent>
                <ETabBar
                    value={activeTab}
                    onChange={(e,i)=>setActiveTab(i)}
                    eSize='small'
                >
                    <ETab label='General' eSize='small'  />
                    <ETab label='Class program' eSize='small' />
                    <ETab label='Students' eSize='small' />
                </ETabBar>
                <Grid container className='mt-3'>
                    {'trainingPath' in errorValidator && (
                        <Grid item xs={12}>
                            <FormControl error={'trainingPath' in errorValidator} fullWidth>
                                <FormHelperText>{errorValidator?.trainingPath?.message}</FormHelperText>
                            </FormControl>
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        {activeTab === 0 && <General
                            MSClass={currentClass} setMSClass={setCurrentClass}
                            MSYears={MSYears} MSClassManagers={MSClassManagers}
                            MSLevelOfClass={MSLevelOfClass} prevTrainingPaths={prevTrainingPaths}
                            errorValidator={errorValidator}
                        />}
                        {activeTab === 1 && <ClassProgram
                            MSClass={currentClass} setMSClass={setCurrentClass}
                            activeTab={activeTab}
                        />}
                        {activeTab === 2 && <ClassStudents
                            MSClass={currentClass} setMSClass={setCurrentClass}
                            manageStudents={manageStudents}
                            errorValidator={errorValidator}
                        />}
                    </Grid>
                </Grid>
            </CardContent>
            <CardActionArea>
                <CardActions className="d-flex justify-content-between align-items-center" >
                    <Grid container>
                        <Grid item xs={6}>
                            <Button variant="contained" size="small" color="secondary" onClick={() =>  {
                                F_showToastMessage("No change",)
                                setEditFormHelper({isOpen: false, openType: undefined, classId: undefined});
                                navigate('/architect-classes')
                            }}>
                                {t("Dismiss")}
                            </Button>
                        </Grid>
                        <Grid item xs={6} className="p-0 d-flex justify-content-end">
                            {editFormHelper.openType !== 'PREVIEW' &&(
                                <Button size="small" variant="contained" color="primary"
                                        onClick={preSave} className="ml-5"
                                >{t("Save")}</Button>
                            )}
                        </Grid>
                    </Grid>
                </CardActions>
            </CardActionArea>
        </Card>
    )
}