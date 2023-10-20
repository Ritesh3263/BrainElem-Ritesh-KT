import React, {useState, useEffect} from "react";
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import {Checkbox, FormControlLabel, FormGroup, Paper} from "@material-ui/core";
import {EAccordion, EButton, ESwipeableDrawer} from "styled_components";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Chip from "@material-ui/core/Chip";
import IconButton from "@mui/material/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import ModuleCoreService from "services/module-core.service";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import TraineeDetailsModal from "components/TrainingModule/Enquires/Trainees/TraineeDetailsModal/TraineeDetailsModal";

const useStyles = makeStyles(theme => ({
    darkViolet: {
        color: theme.palette.primary.darkViolet
    },
}));

export default function ManageSubjectTrainers(props){
    const{
        MSClass= {program:[{assignment:[]}]},
        setMSClass=(p)=>{},
        currentProgram={assignment:[]},
    }=props;
    const {t} = useTranslation();
    const classes = useStyles();
    const {F_getHelper, F_showToastMessage, F_hasPermissionTo} = useMainContext();
    const {manageScopeIds} = F_getHelper();
    const [tabExpanded, setTabExpanded] = useState(false);
    const [swipeableDrawerHelper,setSwipeableDrawerHelper] = useState({isOpen: false});
    const [data,setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isOpenTraineeModal,setIsOpenTraineeModal]=useState({isOpen: false, traineeId: undefined});

    const handleExpand=(panel,isEx)=>{
        setTabExpanded(isEx ? panel : false);
    };

    useEffect(() => {
        setTabExpanded(false);
    }, [currentProgram]);

    useEffect(()=>{
            getAllTrainers();
    },[swipeableDrawerHelper]);

    const getAllTrainers=()=>{
        if(swipeableDrawerHelper.isOpen){
            ModuleCoreService.readAllModuleTrainers(manageScopeIds.moduleId).then(res=>{
               if(tabExpanded && currentProgram?.assignment?.some(a=> a?.trainingModule?._id === tabExpanded)){
                   let foundIndex = currentProgram.assignment.findIndex(a=> a?.trainingModule?._id === tabExpanded);
                   if(foundIndex !== -1){
                       let selected = res.data.map(tr=>{
                           if(currentProgram.assignment?.[foundIndex]?.trainers?.some(({_id})=> _id === tr._id)){
                               tr.isSelected = true;
                           }
                           return tr;
                       });
                       setData(selected);
                       setFilteredData(selected);
                   }else{
                       setData(res.data.map(i=>({...i,isSelected: false})));
                       setFilteredData(res.data.map(i=>({...i,isSelected: false})));
                   }
               }
                setData(res.data);
                setFilteredData(res.data)
            }).catch(err=>console.log(err))
        }else{
            setData(p=>p.map(i=>({...i,isSelected: false})));
            setFilteredData(p=>p.map(i=>({...i,isSelected: false})));
        }
    };

    const managerTrainersAction=(action)=>{
        switch (action.type){
            case 'DELETE':{
                setMSClass(p=>{
                    let val = Object.assign({},p);
                    let currentProgramIndex = currentProgram?._id ? val.program.findIndex(p=> p?._id === currentProgram?._id) : -1;
                    if(currentProgramIndex !== -1){
                        let trainingPathIndex = val.program[currentProgramIndex]?.assignment.findIndex(p=> p?.trainingModule?._id === tabExpanded);
                        if(trainingPathIndex !== -1){
                            let trainers = val.program[currentProgramIndex]?.assignment?.[trainingPathIndex]?.trainers?.filter(tr => tr._id !== action.payload?._id);
                            let programs = val.program.map((pr,index)=>{
                                if(pr?.period === currentProgram?.period){
                                    pr?.assignment.map(a =>{
                                        if(a?.trainingModule?._id === tabExpanded){
                                            a.trainers = trainers;
                                        }
                                        return a;
                                    })
                                }
                                return pr;
                            })
                            val = {...val, program : programs}
                            // val = {...val, program:[...val.program, val.program[currentProgramIndex]
                            //         ={...val.program[currentProgramIndex], assignment:
                            //             [...val.program[currentProgramIndex].assignment, val.program[currentProgramIndex].assignment[trainingPathIndex]
                            //                 ={...val.program[currentProgramIndex].assignment[trainingPathIndex],trainers}]}]}
                        }
                    }else if(currentProgram?.period){
                        let currentProgramIndex = val.program.findIndex(p=> p?.period === currentProgram?.period);
                        if(currentProgramIndex !== -1){
                            let trainingPathIndex = val.program[currentProgramIndex]?.assignment.findIndex(p=> p?.trainingModule?._id === tabExpanded);
                            if(trainingPathIndex !== -1){
                                let trainers = val.program[currentProgramIndex]?.assignment?.[trainingPathIndex]?.trainers?.filter(tr => tr._id !== action.payload?._id);
                                let programs = val.program.map((pr,index)=>{
                                    if(pr?.period === currentProgram?.period){
                                        pr?.assignment.map(a =>{
                                            if(a?.trainingModule?._id === tabExpanded){
                                                a.trainers = trainers;
                                            }
                                            return a;
                                        })
                                    }
                                    return pr;
                                })
                                val = {...val, program : programs}
                                // val = {...val, program:[...val.program, val.program[currentProgramIndex]
                                //         ={...val.program[currentProgramIndex], assignment:
                                //             [...val.program[currentProgramIndex].assignment, val.program[currentProgramIndex].assignment[trainingPathIndex]
                                //                 ={...val.program[currentProgramIndex].assignment[trainingPathIndex],trainers}]}]}
                            }
                        }
                    }
                    getAllTrainers();
                    //console.log(val);
                    return val;
                });
                break;
            }
            case 'ADD':{
                setMSClass(p=>{
                    let val = Object.assign({},p);
                    let currentProgramIndex = currentProgram?._id ? val.program.findIndex(p=> p?._id === currentProgram?._id) : -1;
                    if(currentProgramIndex !== -1){
                        let trainingPathIndex = val.program[currentProgramIndex]?.assignment.findIndex(p=> p?.trainingModule?._id === tabExpanded);
                        if(trainingPathIndex !== -1){
                            let trainers = val.program[currentProgramIndex]?.assignment?.[trainingPathIndex]?.trainers || [];
                            trainers.push(action.payload);
                            let programs = val.program.map((pr,index)=>{
                                if(pr?.period === currentProgram?.period){
                                    pr?.assignment.map(a =>{
                                        if(a?.trainingModule?._id === tabExpanded){
                                            a.trainers = trainers;
                                        }
                                        return a;
                                    })
                                }
                                return pr;
                            })
                            val = {...val, program : programs}
                            // val = {...val, program:[...val.program, val.program[currentProgramIndex]
                            //         ={...val.program[currentProgramIndex], assignment:
                            //             [...val.program[currentProgramIndex].assignment, val.program[currentProgramIndex].assignment[trainingPathIndex]
                            //                 ={...val.program[currentProgramIndex].assignment[trainingPathIndex],trainers}]}]}
                        }
                    }else if(currentProgram?.period){
                        let currentProgramIndex = val.program.findIndex(p=> p?.period === currentProgram?.period);
                        if(currentProgramIndex !== -1){
                            let trainingPathIndex = val.program[currentProgramIndex]?.assignment.findIndex(p=> p?.trainingModule?._id === tabExpanded);
                            if(trainingPathIndex !== -1){
                                let trainers = val.program[currentProgramIndex]?.assignment?.[trainingPathIndex]?.trainers || [];
                                trainers.push(action.payload);
                                let programs = val.program.map((pr,index)=>{
                                    if(pr?.period === currentProgram?.period){
                                        pr?.assignment.map(a =>{
                                            if(a?.trainingModule?._id === tabExpanded){
                                                a.trainers = trainers;
                                            }
                                             return a;
                                        })
                                    }
                                    return pr;
                                })
                                val = {...val, program : programs}
                                // val = {...val, program:[...val.program, val.program[currentProgramIndex]
                                //         ={...val.program[currentProgramIndex], assignment:
                                //             [...val.program[currentProgramIndex].assignment, val.program[currentProgramIndex].assignment[trainingPathIndex]
                                //                 ={...val.program[currentProgramIndex].assignment[trainingPathIndex],trainers}]}]}
                            }
                        }
                    }
                    getAllTrainers();
                    //console.log(val);
                    return val;
                });
                break;
            }
            default: break;
        }
    }

    const subjectList= currentProgram.assignment?.length >0 ? currentProgram.assignment.map(sub=> (
        <EAccordion
            headerName={`${sub?.trainingModule?.name || sub?.trainingModule?.newName || '-'}`}
            headerBackground
            expanded={tabExpanded === sub?.trainingModule?._id}
            onChange={(e,isEx)=>handleExpand(sub?.trainingModule?._id,isEx)}
            //disabled
            defaultExpanded={false}
            className='my-2'
        >
            <Paper elevation={10} className="p-2" style={{borderRadius:'8px'}}>
                <Grid container spacing={1} className="flex-wrap">
                        {sub?.trainers && sub.trainers.length>0 ? sub.trainers.map((trainer, ind)=>(
                            <Grid key={trainer._id} item xs={12} md={6} lg={4}>
                                <Chip className="mx-1 my-1"
                                label={`${trainer?.name??'-'} ${trainer?.surname??'-'}`}
                                onDelete={()=>{
                                    managerTrainersAction({type:'DELETE',payload: trainer})
                                }}/>
                            </Grid>
                                )) : (
                            <Grid item xs={12} md={6}>
                                <span>{t("You don't have any assigned trainers yet")}</span>
                            </Grid>
                        )}
                </Grid>
            </Paper>
        </EAccordion>
        )):[];


    const itemsList = filteredData.length>0 ? filteredData.map((item)=>
        (
            <FormControlLabel
                label={
                    <div style={{display: 'flex'}}>
                        <div>{`${item.name||'-'} ${item.surname||'-'}`}</div>
                        <IconButton color="secondary" size="small"
                                    className={`${classes.darkViolet}`}
                                    style={{marginLeft: '25px'}}
                                    onClick={()=>{
                                        setIsOpenTraineeModal({isOpen: true, traineeId:item._id})
                                    }}><Visibility/>
                        </IconButton>
                    </div>
                }
                control={
                    <Checkbox style={{color:`rgba(82, 57, 112, 1)`}}
                              checked={!!item.isSelected}
                              name={item.name}
                              value={item._id}
                              onChange={(e,isS)=>{
                                  if(isS){
                                      managerTrainersAction({type:'ADD',payload: item})
                                  }else{
                                      managerTrainersAction({type:'DELETE',payload: item})
                                  }
                              }}
                    />
                }
            />
        )): <p>{t("No data")}</p>;


    return(
        <Grid container>
            <Grid item xs={12}>
                <EButton eSize="small" eVariant="secondary"
                         fullWidth={true}
                         style={{maxWidth:"250px"}}
                         startIcon={<AddCircleOutlineIcon/>}
                         disabled={!tabExpanded}
                         onClick={()=>{
                            setSwipeableDrawerHelper(p=>({...p,isOpen: true}));
                         }}
                        // onClick={()=>{setIsOpenSidebarDrawer(
                        //     {isOpen: true,
                        //         assignedTrainers: data.trainers,
                        //         currInd: currentIndex,
                        //         ind: index,})}}
                >
                    {t("Assign trainers")}
                </EButton>
            </Grid>
            <Grid item xs={12}>
                {subjectList}
            </Grid>
            <ESwipeableDrawer
                header={t("Assign trainers")}
                swipeableDrawerHelper={swipeableDrawerHelper}
                setSwipeableDrawerHelper={setSwipeableDrawerHelper}
                originalData={data}
                setFilteredData={setFilteredData}
            >
                <FormGroup className="pl-2">
                    {itemsList}
                </FormGroup>
            </ESwipeableDrawer>
            <TraineeDetailsModal isOpenTraineeModal={isOpenTraineeModal}
                                 setIsOpenTraineeModal={setIsOpenTraineeModal}
            />
        </Grid>
    )
}