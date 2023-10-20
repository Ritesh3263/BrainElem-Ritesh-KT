import React, {useEffect, useState} from "react";
import {Col, Form, ListGroup, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import EventService from "services/event.service"
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import Box from "@material-ui/core/Box";
import ProgramTrainerPreviewChapters from "../ProgramTrainerPreview/ProgramTrainerPreviewChapters"
import { makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import {useTranslation} from "react-i18next";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {isWidthUp} from "@material-ui/core/withWidth";
import FormControl from "@material-ui/core/FormControl";
import {ETab, ETabBar} from "../../../../styled_components";
const useStyles = makeStyles(theme=>({}))

/* TODO [ModuleManager, Architect = Program Preview] */
/** FOR MODULE MANAGER AND ARCHITECT NEED TO ADD, **/

export default function ProgramTrainerPreview(props){
    const{
        addEvent,
        allowCreateEvents,
        fromDashboard
    }=props;
    const { t } = useTranslation();
    const {setMyCurrentRoute, F_showToastMessage, F_getHelper, currentScreenSize} = useMainContext();
    const {userPermissions, manageScopeIds, user} = F_getHelper();
    const classes = useStyles();
    const navigate = useNavigate();
    /** Groups = Classes **/
    const [classes1, setClasses1] = useState([]);
    const [periods, setPeriods] = useState([]);

    /** trainingPath => when i getTraining modules [res.data._id is TRainingPath id] -> [res.data.trainingModules - subjects] **/
    const [trainingPathId, setTrainingPathId] = useState(null);
    /** trainingModules = Subjects **/
    const [trainingModules, setTrainingModules]= useState([]);
    /** chapters List **/
    const [chapters, setChapters] = useState([]);
    /** ============ Tab component states ============= */
    const [value, setValue] = useState(0);

    /** Current state of selected items id's **/
    const [model, setModel]= useState({
        assignedClass: "",
        assignedPeriod: "",
        assignedSubject: "",
    });

    /** Program Id for redirect from content to ContentCreatorBox **/
    const [programId,setProgramId] = useState(null);
    let {selectedPeriod} = JSON.parse(localStorage.getItem("user"))
    const [currentPeriod, setCurrentPeriod] = useState("");
    const [onGoing, setOnGoing] = useState(true);
    const [currentOpenChapter,setCurrentOpenChapter] = useState(null);
    const [expanded, setExpanded] = useState(false);

    useEffect(()=>{
        /** getClasses - first get, users groups (Classes list) **/
        if(!manageScopeIds.isTrainingCenter)
        EventService.getMyClasses().then(res=>{
            /** As init setUp first item (class) **/
            if(userPermissions.isParent){
                if(res.data?.groups?.length>0){
                    setClasses1(res.data.groups)
                    setModel({...model, assignedClass: res.data.groups[0]._id})
                }
            }else{
                if(res.data?.length>0){
                    setClasses1(res.data)
                    setModel({...model, assignedClass: res.data[0]._id})
                }
            }
        });

        if(fromDashboard === undefined || !fromDashboard){
            setMyCurrentRoute("Program preview")
        }
    },[]);



    useEffect(()=>{
        if(model.assignedClass){
            let cls = classes1.find(c=>c._id===model.assignedClass)
            setPeriods(cls.academicYear.periods);
            let period = getCurrentPeriod(cls.academicYear);
            setProgramId(cls.program.find(p=>p.period.toString()===period?._id)?._id);
            setModel(p=>({...p,assignedPeriod:period._id}));
            getTrainingModule(model.assignedClass, period._id);
        }
    } ,[model.assignedClass]);

    /** Get period **/
    const getCurrentPeriod = (academicYear)=>{
        // let class1 = classes1.find(c=>c._id === classId);
        let period = academicYear.periods.find(p=>new Date(p.startDate)<=new Date() && new Date(p.endDate)>=new Date());
        if (user.selectedPeriod) period = academicYear.periods.find(p=>p._id===user.selectedPeriod);
        if(!period) period = academicYear.periods[0]; 
        return period;
        // setModel(p=>({...p,assignedPeriod:class1.program.find(el=>el.onGoing)?.period||class1.academicYear.periods[0]._id}));
        // setPeriods(class1.academicYear.periods);
    }

    const getPeriod = (classId,classes2=classes1)=>{
        let class1 = classes2.find(c=>c._id === classId);
        let CurrentPeriod = selectedPeriod || class1.academicYear.periods.find(p=>new Date(p.startDate) <= new Date() && new Date(p.endDate) >= new Date())?._id
        setCurrentPeriod(()=>CurrentPeriod);
        setOnGoing(()=>!!CurrentPeriod);
        let firstPeriod = class1.program[0].period;
        let periodId = CurrentPeriod || firstPeriod;
        setPeriods(()=>class1.academicYear.periods);
        let program = class1.program.find(p=>p.period === periodId);
        if (program){
            setProgramId(()=>program._id);
            setTrainingPathId(()=>program.duplicatedTrainingPath);
            setModel(p=>({...p,trainingPathId:program.duplicatedTrainingPath,assignedClass:classId,assignedPeriod:periodId||class1.academicYear.periods[0]._id, assignedSubject: "",}));

        }
        getTrainingModule(classId, periodId);
    }
    /** need => currentClassId [GroupId] **/
    function getTrainingModule(currentClassId,periodId){
        EventService.readTrainingModules(currentClassId,periodId).then(res=>{
            if(res.data.trainingModules){
                /** Set TrainingPathId **/
                setTrainingPathId(res.data._id);
                /** Set TrainingModules [Subjects] List **/
                //old without trainer filter setTrainingModules(res.data.trainingModules);
                
                // let newData = userPermissions.isInspector ? res.data.trainingModules : userPermissions.isParent ? res.data.trainingModules: res.data.trainingModules.filter(tr=> [...tr.trainers, res.data.classManager].includes(user.id) );
                let newData = (userPermissions.isParent || userPermissions.isInspector)  ? res.data.trainingModules: res.data.trainingModules.filter(tr=> [...tr.trainers, res.data.classManager].some(tr1=>tr1.toString()===user.id));
                setTrainingModules(newData);
                /** select first item as selected - trainingModule (Subject) **/
                setModel(p=>({...p,assignedSubject:newData?.[0]?.originalTrainingModule||''}));

                /** get Chapters **/
                if(newData?.[0]?.originalTrainingModule){
                    getChapters(newData[0]?.originalTrainingModule, res.data._id)
                }
                
            }
        });
    }

    function getChapters(originalTrainingModuleId, trainingPathIdFromInit){
        /** using sending originalTrainingModuleId, and trainingPathId (was set when getTrainingModules [Subjects]) from state **/
        let trainingPathIdToGetChapters =trainingPathIdFromInit ? trainingPathIdFromInit : trainingPathId;

        EventService.readChapters(originalTrainingModuleId, trainingPathIdToGetChapters).then(res=>{
            setChapters(res.data);
        })
    }

    /** Change tab index **/
    const handleChange = (event, newValue) => {
        setValue(newValue);
        setModel(p=>({...p,assignedClass:classes1[newValue]._id}));
    };

    function changeClassHandler(groupId){
        setModel(p=>({...p,assignedClass:groupId}));
    }

    const getButtonSize=()=>{
        if(!isWidthUp('sm',currentScreenSize)){
            return "100%"
        }else{
            if(allowCreateEvents) return "50%"
            else return "30%"
        }
    }
    
    const classesList = classes1.length >0 ? classes1.map((item,index)=><MenuItem hidden={item.name === "New empty class"} key={item._id} value={item._id}>{item.name}</MenuItem>): [];
    const periodsList = periods.length >0 ? periods.map((item,index)=><MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>): [];
    const trainingModulesList = trainingModules ? trainingModules.map((item, index)=><MenuItem key={item.originalTrainingModule} value={item.originalTrainingModule} originalTrainingModuleId={item.originalTrainingModule}>{item.newName}</MenuItem>): null;

    /** Tabs => Class list **/
    const classesListTabs = classes1.length >0 ? classes1.map((item,index)=>
            (<ETab eSize='small'  key={item._id} label={<small>{item.name}</small>} id={`simple-tab-${index}`} aria-controls={`simple-tabpanel-${index}`}
                  onClick={()=>{changeClassHandler(item._id)}} />)): [];

    /** render ReactComponent with chapter **/
    const chaptersListPreview = chapters ? chapters.map((item,index)=><ProgramTrainerPreviewChapters key={item._id} item={item} index={index} trainingPathId={trainingPathId} programId={programId} allowCreateEvents={allowCreateEvents}
                                                                                                     originalTrainingModuleId={model.assignedSubject} selectedSubject={model.assignedSubject} currentGroupId={model.assignedClass} addEvent={addEvent}/>): null;

    const classTabContent = classes1.length >0 ? classes1.map((item,index)=>(
        <div      key={index}
                  role="tabpanel"
                  hidden={value !== index}
                  id={`full-width-tabpanel-${index}`}
                  aria-labelledby={`full-width-tab-${index}`}
        >
            {value === index && (
                <Box pl={1} pr={1} pt={2}>
                    <Form as={Row}>
                        <Grid container xs={12} style={{margin:"auto"}} >
                        <Grid container xs={11} md={10} className="justify-content-between align-items-center " style={{margin:"auto"}}>
                            <Grid item xs={12} md={3} >
                                    <FormControl fullWidth={true} style={{maxWidth:'400px', minWidth:'150px'}} margin="dense" variant="filled">
                                    <InputLabel id="demo-simple-select-label">{t("Select class")}</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={model.assignedClass}
                                        onChange={(e) => {
                                            getPeriod(e.target.value);
                                            setCurrentOpenChapter(null);
                                            setExpanded(false);
                                        }}
                                    >
                                        {classesList}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={3}  >
                                <FormControl variant="filled" fullWidth={true}  className="mt-2 " >
                                    <InputLabel id="demo-simple-select2-label" className="text-left"  margin="dense"><small>{t("Select period")}</small></InputLabel>
                                <Select
                                    labelId="demo-simple-select2-label"
                                    id="demo-simple-select2"
                                    disabled={model.assignedClass === ""}
                                    value={model.assignedPeriod}
                                    //input={<Input/>}
                                    onChange={(e,objData) => {
                                        getTrainingModule(model.assignedClass,e.target.value);
                                        setModel(p=>({...p,assignedPeriod:e.target.value, assignedSubject: "", assignedChapter: ""}));
                                        // setChapters([]);

                                    }}
                                >
                                    {periodsList}
                                </Select>
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={3}>        
                                <FormControl variant="filled" fullWidth={true}  className="mt-2" >
                                    <InputLabel id="demo-simple-select-label" className="text-left"  margin="dense"><small>{t("Select subject")}</small></InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    disabled={model.assignedClass === ""||model.assignedPeriod === ""}
                                    value={model.assignedSubject}
                                    //input={<Input/>}
                                    onChange={(e,objData) => {
                                        /** need originalTrainingModuleId to getChapters **/
                                        getChapters(objData.props.originalTrainingModuleId);
                                        /** setSelectedSubjectId [trainingModule] as Current **/
                                        setModel(p=>({...p,assignedSubject:e.target.value, assignedChapter: ""}));
                                        /** getChapters [Chapters] **/

                                    }}
                                >
                                    {trainingModulesList}
                                </Select>
                                </FormControl>
                            </Grid>
                            </Grid>
                            <Grid xs={12} >
                                <List
                                    className="mt-4"
                                    component="nav"
                                    aria-labelledby="nested-list-subheader"
                                    subheader={
                                        <ListSubheader component="div" id="nested-list-subheader" className="text-center">{t("Chapters")}</ListSubheader>
                                    }
                                >
                                    {chaptersListPreview}
                                </List>
                            </Grid>
                        </Grid>
                    </Form>
                </Box>
            )}
        </div>
    )):null;
    /** ============================================== */



    return(
            <Grid container spacing={0}>
                <Grid item xs={12}>
                        <ListGroup>
                            <ListGroup.Item className="d-flex flex-column align-items-left p-0 mt-0" style={{border: "none", backgroundColor:"rgba(255,255,255,0.0)"}}>
                                        {classTabContent}
                            </ListGroup.Item>
                        </ListGroup>
                    
                </Grid>
            </Grid>
    )
}