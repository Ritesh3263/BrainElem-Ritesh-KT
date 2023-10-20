import React, {useEffect, useState} from "react";
import { Col, Form, ListGroup, Row} from "react-bootstrap";
import { useNavigate} from "react-router-dom";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import EventService from "../../../services/event.service"
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import ProgramTrainerPreviewChapters from "../../Program/ProgramTrainer/ProgramTrainerPreview/ProgramTrainerPreviewChapters"
import { makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {useTranslation} from "react-i18next";
import FormControl from "@material-ui/core/FormControl";
import {ETab, ETabBar} from "styled_components";

const useStyles = makeStyles(theme=>({}))

/* TODO [ModuleManager, Architect = Program Preview] */
/** FOR MODULE MANAGER AND ARCHITECT NEED TO ADD, **/

export default function TraineeMyCourses({addEvent, allowCreateEvents}){
    const { t } = useTranslation();
    const {setMyCurrentRoute, F_showToastMessage, F_getHelper, currentScreenSize} = useMainContext();
    const {user} = F_getHelper();
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

    useEffect(()=>{
        EventService.getMyClasses().then(res=>{
            /** As init setUp first item (class) **/
            if(res.data.length >0){
                let period = res.data[0].academicYear.periods.find(p => new Date(p.startDate) <= new Date() && new Date(p.endDate) >= new Date());
                setClasses1(res.data);
                setPeriods(res.data[0].academicYear.periods);
                setModel(p=>({assignedClass:res.data[0]._id, assignedPeriod: user.selectedPeriod||period?._id||res.data[0].program[0].period, assignedSubject: ""}));

                /** Get Subject List, and select first element as selected**/
                getTrainingModule(res.data[0]._id, user.selectedPeriod||period?._id||res.data[0].program[0].period);

                /** Program Id for redirect from content to ContentCreatorBox **/
                setProgramId(res.data[0].program._id);
            }
        });
        setMyCurrentRoute("My program")
    },[]);


    const getPeriod = (classId)=>{
        let class1 = classes1.find(c=>c._id === classId);
        setModel(p=>({assignedPeriod:user.selectedPeriod||class1.academicYear.periods.find(p=>new Date(p.startDate) <= new Date() && new Date(p.endDate) >= new Date())._id||class1.academicYear.periods[0]._id, assignedSubject: "",}));
        setPeriods(class1.academicYear.periods);
    }
    /** need => currentClassId [GroupId] **/
    function getTrainingModule(currentClassId, currentPeriod){
        EventService.readTrainingModules(currentClassId,currentPeriod).then(res=>{
            if(res.data.trainingModules){
                /** Set TrainingPathId **/
                setTrainingPathId(res.data._id);
                /** Set TrainingModules [Subjects] List **/
                    //old without trainer filter setTrainingModules(res.data.trainingModules);
                //let newData = res.data.trainingModules.filter(tr=> tr.trainers.includes(user.id));
                let newData = res.data.trainingModules;
                setTrainingModules(newData);

                /** select first item as selected - trainingModule (Subject) **/
                if(newData.length >0){
                    setModel(p=>({...p,assignedSubject:newData[0].originalTrainingModule}));

                    /** get Chapters **/
                    getChapters(newData[0].originalTrainingModule, res.data._id)
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
    };

    function changeClassHandler(groupId){
        setModel(p=>({...p,assignedClass:groupId, assignedPeriod:class1.academicYear.periods.find(p=>new Date(p.startDate) <= new Date() && new Date(p.endDate) >= new Date())._id||class1.academicYear.periods[0]._id, assignedSubject: ""}));
        setTrainingPathId(null);
        setTrainingModules([]);
        setChapters([]);

        
        /** onChange Class update programId **/
        let class1 = null;
        class1 = classes1.find(cl=> cl._id === groupId);
        if(class1){
            setProgramId(class1.program[0]._id);
            setPeriods(class1.academicYear.periods);
        }
        // for tests
        setTimeout(()=>{
            getTrainingModule(groupId, user.selectedPeriod|| class1.academicYear.periods.find(p=>new Date(p.startDate) <= new Date() && new Date(p.endDate) >= new Date())._id||class1.academicYear.periods[0]._id)
        },300);
    }


    const trainingModulesList = trainingModules ? trainingModules.map((item, index)=><MenuItem key={item.originalTrainingModule} value={item.originalTrainingModule} originalTrainingModuleId={item.originalTrainingModule}>{item.newName}</MenuItem>): null;
    
    /** Tabs => Class list **/
    //const classesListTabs = classes.length >0 ? classes.map((item,index)=>(<Tab key={item._id} label={item.name} id={`simple-tab-${index}`} aria-controls={`simple-tabpanel-${index}`} onClick={()=>{getTrainingModule(item._id)}} />)): [];
    const classesListTabs = classes1.length >0 ? classes1.map((item,index)=>(<ETab style={{maxWidth: "400px"}} eSize="small" key={item._id} label={<small>{item.name}</small>} id={`simple-tab-${index}`} aria-controls={`simple-tabpanel-${index}`} onClick={()=>{changeClassHandler(item._id)}} />)): [];
    const periodsList = periods.length >0 ? periods.map((item,index)=><MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>): [];

    /** render ReactComponent with chapter **/
    const chaptersListPreview = chapters ? chapters.map((item,index)=><ProgramTrainerPreviewChapters key={item._id} item={item} index={index} trainingPathId={trainingPathId} programId={programId} allowCreateEvents={allowCreateEvents}
                                                                                                     originalTrainingModuleId={model.assignedSubject} selectedSubject={model.assignedSubject} currentGroupId={model.assignedClass} addEvent={addEvent} isHomework={0} isStudent={true}/>): null;

    const classTabContent = classes1.length >0 ? classes1.map((item,index)=>(
        <div      key={index}
                  role="tabpanel"
                  hidden={value !== index}
                  id={`full-width-tabpanel-${index}`}
                  aria-labelledby={`full-width-tab-${index}`}
        >
            {value === index && (
                <Box pl={1} pt={2}>
                    <Form as={Row}>
                        <Col md={12} className="d-flex flex-column">
                        <FormControl variant="filled">
                            <InputLabel id="demo-simple-select-label"  margin="normal" className="text-left"><small>{t("Select period")}</small></InputLabel>
                            <Select
                                //style={{width: (allowCreateEvents) ? "50%" :"20%"}}
                                style={{maxWidth: '320px',width: "100%"}}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                disabled={model.assignedClass === ""}
                                value={model.assignedPeriod}
                                //input={<Input/>}
                                onChange={(e,objData) => {
                                    /** need originalTrainingModuleId to getChapters **/
                                    // getChapters(objData.props.originalTrainingModuleId);
                                    getTrainingModule(model.assignedClass, e.target.value);
                                    /** setSelectedPeriodId [trainingModule] as Current **/
                                    setModel(p=>({...p,assignedPeriod:e.target.value}));
                                    /** getChapters [Chapters] **/

                                }}
                            >
                                {periodsList}
                            </Select>
                            </FormControl>
                            <FormControl variant="filled">
                            <InputLabel id="demo-simple-select-label"  margin="normal" className="text-left"><small>{t("Select subject")}</small></InputLabel>
                            <Select
                                //style={{width: (allowCreateEvents) ? "50%" :"20%"}}
                                style={{maxWidth: '320px',width: "100%"}}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                disabled={model.assignedClass === ""||model.assignedPeriod === ""}
                                value={model.assignedSubject}
                                //input={<Input/>}
                                onChange={(e,objData) => {
                                    /** need originalTrainingModuleId to getChapters **/
                                    getChapters(objData.props.originalTrainingModuleId);
                                    /** setSelectedSubjectId [trainingModule] as Current **/
                                    setModel(p=>({...p,assignedSubject:e.target.value}));
                                    /** getChapters [Chapters] **/

                                }}
                            >
                                {trainingModulesList}
                            </Select>
                            </FormControl>
                            <List
                                className="mt-4"
                                component="nav"
                                aria-labelledby="nested-list-subheader"
                                subheader={
                                    <ListSubheader component="div" id="nested-list-subheader" className="text-center">Chapters</ListSubheader>
                                }
                            >
                                {chaptersListPreview}
                            </List>
                        </Col>
                    </Form>
                </Box>
            )}
        </div>
    )):null;
    /** ============================================== */



    return(
        <>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                        {/*<Typography variant="h6" component="h2" className="text-center">*/}
                        {/*    {!allowCreateEvents ? (*/}
                        {/*        <span>CoursesList preview</span>*/}
                        {/*    ):(*/}
                        {/*        <span>Your classes</span>*/}
                        {/*    )}*/}
                        {/*</Typography>*/}
                        <div className="d-flex pt-2 px-2 justify-content-between">
                            <Typography variant="h5" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>

                                {!allowCreateEvents ? (
                                    <>{t("CoursesList preview")}</>
                                ):(
                                    <>{t("Your classes")}</>
                                )}
                            </Typography>
                        </div>
                        <ListGroup>
                            <ListGroup.Item className="d-flex flex-column align-items-left p-0 mt-2 px-1" style={{border: "none", backgroundColor:"rgba(255,255,255,0.0)"}}>
                                {classes1.length>0 ? (
                                    <>
                                        {/*<AppBar position="static" color="default" className="m-0" style={{border: "none", backgroundColor:"rgba(255,255,255,0.65)"}}>*/}
                                        {/*    <Tabs*/}
                                        {/*        value={value}*/}
                                        {/*        onChange={handleChange}*/}
                                        {/*        indicatorColor="primary"*/}
                                        {/*        textColor="primary"*/}
                                        {/*        variant="scrollable"*/}
                                        {/*        scrollButtons="auto"*/}
                                        {/*        aria-label="scrollable auto tabs example"*/}
                                        {/*    >*/}
                                        {/*        {classesListTabs ? classesListTabs : null}*/}
                                        {/*    </Tabs>*/}
                                        {/*</AppBar>*/}
                                        {/*{classTabContent}*/}
                                        <>
                                            <ETabBar
                                                className='mt-2'
                                                onChange={handleChange}
                                                value={value}
                                                textColor='primary'
                                                variant='fullWidth'
                                                eSize='small'
                                            >
                                                {classesListTabs ? classesListTabs : null}
                                            </ETabBar>
                                            {classTabContent}
                                        </>
                                    </>
                                ):(
                                    <span className="text-center">You don't have any assigned class</span>
                                )}
                            </ListGroup.Item>
                        </ListGroup>
                </Grid>
            </Grid>

        {/*<div className="p-0 fluid m-0">*/}
        {/*    {!allowCreateEvents && (*/}
        {/*        <ListGroup>*/}
        {/*            <Row className="d-flex justify-content-center mb-2">*/}
        {/*                /!*<h4 className="text-muted">CoursesList [<small>Preview</small>]</h4>*!/*/}
        {/*                <Button classes={{root: classes.root}} size="large" variant="contained" color="primary"*/}
        {/*                >CoursesList preview</Button>*/}
        {/*            </Row>*/}
        {/*        </ListGroup>*/}
        {/*    )}*/}
        {/*    <ListGroup>*/}
        {/*        /!*<ListGroup.Item className="d-flex align-items-center justify-content-center">*!/*/}

        {/*        /!*    <FormControl component="fieldset" className="mr-5" >*!/*/}
        {/*        /!*        <FormLabel component="legend" className="" ><small>Status</small></FormLabel>*!/*/}
        {/*        /!*        <span>in use</span>*!/*/}
        {/*        /!*    </FormControl>*!/*/}
        {/*        /!*    <Button variant="warning" size="sm" onClick={()=>{console.log(model)}}>Test</Button>*!/*/}
        {/*        /!*</ListGroup.Item>*!/*/}

        {/*        <ListGroup.Item className="d-flex flex-column align-items-left mt-2" style={{border: "1px solid lightgrey"}}>*/}
        {/*            <h6 className="text-center"><strong>Your classes</strong></h6>*/}
        {/*            {classes1.length>0 ? (*/}
        {/*                <>*/}
        {/*                    <AppBar position="static" color="default" className="m-0">*/}
        {/*                        <Tabs*/}
        {/*                            value={value}*/}
        {/*                            onChange={handleChange}*/}
        {/*                            indicatorColor="primary"*/}
        {/*                            textColor="primary"*/}
        {/*                            variant="scrollable"*/}
        {/*                            scrollButtons="auto"*/}
        {/*                            aria-label="scrollable auto tabs example"*/}
        {/*                        >*/}
        {/*                            {classesListTabs ? classesListTabs : null}*/}
        {/*                        </Tabs>*/}
        {/*                    </AppBar>*/}
        {/*                    {classTabContent}*/}
        {/*                </>*/}
        {/*            ):(*/}
        {/*                <span className="text-center">You don't have any assigned class</span>*/}
        {/*            )}*/}
        {/*        </ListGroup.Item>*/}
        {/*    </ListGroup>*/}
        {/*</div>*/}
        </>
    )
}