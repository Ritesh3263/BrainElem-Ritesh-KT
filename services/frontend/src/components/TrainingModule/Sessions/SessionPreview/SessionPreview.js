import React, {useEffect, useState} from "react";
import {Col, Form, ListGroup, Row} from "react-bootstrap";
import { useNavigate} from "react-router-dom";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import EventService from "../../../../services/event.service"
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import SessionPreviewChapters from "./SessionPreviewChapters";
import { makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import CertificationSessionService from "../../../../services/certification_session.service"
import {useTranslation} from "react-i18next";
import {useMainContext} from "../../../_ContextProviders/MainDataContextProvider/MainDataProvider";

const useStyles = makeStyles(theme=>({}))

/* TODO [ModuleManager, Architect = Program Preview] */
/** FOR MODULE MANAGER AND ARCHITECT NEED TO ADD, **/

export default function SessionPreview({addEvent, allowCreateEvents, formIsOpen}){
    const { t, i18n, translationsLoaded } = useTranslation();
    const {setMyCurrentRoute, F_showToastMessage, F_getHelper} = useMainContext();
    const {manageScopeIds, userPermissions, user} = F_getHelper();
    const classes = useStyles();
    const navigate = useNavigate();
    /** Groups = Classes **/
    const [classes1, setClasses1] = useState([]);

    /** trainingPath => when i getTraining modules [res.data._id is TRainingPath id] -> [res.data.trainingModules - subjects] **/
    const [trainingPathId, setTrainingPathId] = useState(null);
    /** trainingModules = Subjects **/
    const [trainingModules, setTrainingModules]= useState([]);
    /** chapters List **/
    const [chapters, setChapters] = useState([]);
    /** ============ Tab component states ============= */
    const [value, setValue] = useState(0);
    /** ============ Trainees ============= */
    const [trainees, setTrainees] = useState([]);
    const [trackers, setTrackers] = useState(null);

    const [limitChapterIndex, setLimitChapterIndex] = useState(-1);

    // subjects tab
    const [newSubjects, setNewSubjects] = useState([]);

    /** Current state of selected items id's **/
    const [model, setModel]= useState({
        assignedClass: "",
        assignedSubject: "",
        selectedTrainee: "",
        tracker: { // here can save tracker for currently seleced subject 
            chapterId: "",
            contentId: ""
        }
    });

    /** Program Id for redirect from content to ContentCreatorBox **/
    const [programId,setProgramId] = useState(null);

    useEffect(()=>{
        /** getTraineesList **/
        if(!userPermissions.isTrainee){
            CertificationSessionService.read(formIsOpen.certificationSessionId).then(res=>{
                /*selected trainee firs item **/
                if(res.data && res.data.trainees.length>0){
                    setTrainees(res.data.trainees);
                    setModel(p=>({...p, selectedTrainee: res.data.trainees[0]._id}));
                    changeSelectedTrainee(res.data.trainees[0]._id)
                }
            }).catch(error=>console.log(error));
        }else{
            // FOR TRAINEE
            setModel(p=>({...p, selectedTrainee: user.id}));

            CertificationSessionService.readTraineeSessions(user.id).then(res=>{
                //find current session index
                let foundedIndex = res.data.findIndex(i=> i._id === formIsOpen.certificationSessionId);
                if(foundedIndex >=0){
                    //console.log(">>>>",res.data[foundedIndex]);
                    setTrainingPathId(res.data[foundedIndex].trainingPath._id);
                    setNewSubjects(res.data[foundedIndex].trainingPath.trainingModules);
                    getChapters(res.data[foundedIndex].trainingPath.trainingModules[0].originalTrainingModule._id, res.data[foundedIndex].trainingPath._id, user.id)
                }

            }).catch(error=>console.log("CertificationSessionService.readTraineeSessions(user.id) - error",error));
        }
    },[]);

    function changeSelectedTrainee(traineeId){
        CertificationSessionService.readTraineeSessions(traineeId).then(res=>{
            //find current session index
            let foundedIndex = res.data.findIndex(i=> i._id === formIsOpen.certificationSessionId);
            if(foundedIndex >=0){
                //console.log(">>>>",res.data[foundedIndex]);
                setTrainingPathId(res.data[foundedIndex].trainingPath._id);
                setNewSubjects(res.data[foundedIndex].trainingPath.trainingModules);
                getChapters(res.data[foundedIndex].trainingPath.trainingModules[0].originalTrainingModule._id, res.data[foundedIndex].trainingPath._id, traineeId)
            }

        }).catch(error=>console.log("CertificationSessionService.readTraineeSessions(user.id) - error",error));
    }

    function getChapters(originalTrainingModuleId, trainingPathIdFromInit, userId){
        /** using sending originalTrainingModuleId, and trainingPathId (was set when getTrainingModules [Subjects]) from state **/
        let trainingPathIdToGetChapters =trainingPathIdFromInit ?? trainingPathId;
        let trackers2 = null;
        CertificationSessionService.readUserTrackers(userId,formIsOpen.certificationSessionId).then(res=>{
            /** WHY ARRAY? **/
            setTrackers(res.data[0]);
            trackers2 = res.data[0];
            console.log("trackers", res.data[0]);
        }).catch(error=>console.log(error));

        EventService.readChapters(originalTrainingModuleId, trainingPathIdToGetChapters).then(res=>{
            let foundedIndex1 = res.data.findIndex(it=>it.chapter._id === trackers2?.latestChapterId);
            if(foundedIndex1 >=0){
                res.data[foundedIndex1].isCurrentChapter = true;
                res.data[foundedIndex1].latestContentId = trackers2.latestContentId;
                setLimitChapterIndex(foundedIndex1);
            }else{
                res.data[0].isCurrentChapter = true;
                res.data[0].latestContentId = 0;
                setLimitChapterIndex(0);
            }
            setChapters(res.data);

            // isCurrentChapter true/false _MOCKED 08.09.2021 setOpenChapter=true
            //res.data[1].isCurrentChapter = true;
            // let foundedIndex = res.data.findIndex(p=>p.isCurrentChapter);
            //     setLimitChapterIndex(foundedIndex);
            //------------------------------------------
        })
    }

    function changeSubjectHandler(originalTrainingModuleId){
        getChapters(originalTrainingModuleId, trainingPathId);
    };

    function updateTrackers(contentId, chapOriginId, certificationSessionId, nexContentIndex){
            console.log("UPDATE TRACKERS+>")
            console.log("contentId",contentId)
            console.log("chapterId",chapOriginId)
            console.log("certificationSessionId",certificationSessionId);
            console.log("nexContentIndex",nexContentIndex);
            console.log("-----------------------------")
        // unlock next content =>
        if(nexContentIndex !== -1){
            console.log("make up")
            CertificationSessionService.saveUserTracker(certificationSessionId,chapOriginId,nexContentIndex).then(res=>{
                console.log("success update !!!", res.data)
            }).catch(error=>console.log(error))
        }
    }


    const traineesList = trainees ? trainees.map((item, index)=><MenuItem key={item._id} value={item._id} >{`${item.name} ${item.surname}`}</MenuItem>): null;
    const subjectsListTabs = newSubjects.length >0 ? newSubjects.map((item,index)=>(<Tab key={item.index} label={item.newName} id={`simple-tab-${index}`} aria-controls={`simple-tabpanel-${index}`} onClick={()=>{changeSubjectHandler(item.originalTrainingModule._id)}} />)): [];

    /** render ReactComponent with chapter **/
    const chaptersListPreview = chapters ? chapters.map((item,index)=><SessionPreviewChapters
                                                                                    key={item._id}
                                                                                    limitChapterIndex={limitChapterIndex}
                                                                                    item={item}
                                                                                    index={index}
                                                                                    trainingPathId={trainingPathId}
                                                                                    programId={programId}
                                                                                    allowCreateEvents={allowCreateEvents}
                                                                                    originalTrainingModuleId={model.assignedSubject}
                                                                                    selectedSubject={model.assignedSubject}
                                                                                    currentGroupId={model.assignedClass}
                                                                                    addEvent={addEvent}
                                                                                    isHomework={0}
                                                                                    isStudent={userPermissions.isTrainee}
                                                                                    trackers={trackers}
                                                                                    updateTrackers={updateTrackers}
                                                                                    certificationSessionId={formIsOpen.certificationSessionId}
                                                                                    model={model}
                                                                                    />): null;


    const subjectTabContent = newSubjects.length >0 ? newSubjects.map((item,index)=>(
        <div      key={index}
                  role="tabpanel"
                  hidden={value !== index}
                  id={`full-width-tabpanel-${index}`}
                  aria-labelledby={`full-width-tab-${index}`}
        >
            {value === index && (
                <Box pl={1}>
                    <Form as={Row}>
                        <Col md={12} className="d-flex flex-column">
                            {/*<div>*/}
                            {/*    <p>Trackers:</p>*/}
                            {/*    <p>latestChapterId: {trackers?.latestChapterId}</p>*/}
                            {/*    <p>latestContentId: {trackers?.latestContentId}</p>*/}
                            {/*    <p>certificationSessionId: {trackers?.certificationSessionId}</p>*/}
                            {/*</div>*/}
                            <List
                                className="mt-1"
                                component="nav"
                                aria-labelledby="nested-list-subheader"
                                subheader={
                                    <ListSubheader component="div" id="nested-list-subheader" className="text-center">{t("Chapters")}</ListSubheader>
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
                    <Paper elevation={10} className="p-0 text-center">
                        {/*<Typography variant="h6" component="h2" className="text-center">*/}
                        {/*    {!allowCreateEvents ? (*/}
                        {/*        <span>{t("CoursesList preview")}</span>*/}
                        {/*    ):(*/}
                        {/*        <span>Your classes</span>*/}
                        {/*    )}*/}
                        {/*</Typography>*/}
                        <div className="d-flex pt-2 px-2 justify-content-between">
                            <Typography variant="h5" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                {!allowCreateEvents ? (
                                    <span>{t("CoursesList preview")}</span>
                                ):(
                                    <span>{t("Your classes")}</span>
                                )}
                            </Typography>
                        </div>
                        {userPermissions.isTrainer && (
                            <div className="text-left ml-3 mb-3">
                                <FormControl style={{width: (allowCreateEvents) ? "50%" :"20%"}} className="mr-5">
                                    <InputLabel id="demo-simple-select-label"  margin="normal" className="text-left"><small>{t("Select trainee")}</small></InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={model.selectedTrainee}
                                        input={<Input/>}
                                        onChange={(e) => {
                                            setModel(p=>({...p, selectedTrainee: e.target.value}));
                                            changeSelectedTrainee(e.target.value);
                                        }}
                                    >
                                        {traineesList}
                                    </Select>
                                </FormControl>
                            </div>
                        )}
                        <ListGroup>
                            <ListGroup.Item className="d-flex flex-column align-items-left p-0 mt-2" style={{border: "none", backgroundColor:"rgba(255,255,255,0.0)"}}>
                                {newSubjects.length>0 ? (
                                    <>
                                        <AppBar position="static" color="default" className="m-0" style={{border: "none", backgroundColor:"rgba(255,255,255,0.65)"}}>
                                            <Tabs
                                                value={value}
                                                onChange={(e,curr)=>setValue(curr)}
                                                indicatorColor="primary"
                                                textColor="primary"
                                                variant="scrollable"
                                                scrollButtons="auto"
                                                aria-label="scrollable auto tabs example"
                                            >
                                                {subjectsListTabs ? subjectsListTabs : null}
                                            </Tabs>
                                        </AppBar>
                                        {subjectTabContent}
                                    </>
                                ):(
                                    <span className="text-center">You don't have any assigned subjects</span>
                                )}
                            </ListGroup.Item>
                        </ListGroup>
                    </Paper>
                </Grid>
            </Grid>
        </>
    )
}