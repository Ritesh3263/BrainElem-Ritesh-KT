import React, {lazy, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import EventService from "services/event.service"
import ModuleService from "services/module.service"
import ModuleCoreService from "services/module-core.service"
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import ProgramTrainerEditChapters from "./ProgramTrainerEditChapters";
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import List from '@material-ui/core/List';
import {useTranslation} from "react-i18next";
import ProgramAddingChapterModal from "./ProgramAddingChapterModal";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {CardHeader} from "@material-ui/core";
import Confirm from "components/common/Hooks/Confirm";
import { usePrompt } from 'components/common/Hooks/usePrompt';

const ProgramAddingContentModal = lazy(() => import("./ProgramAddingContentModal"));

const useStyles = makeStyles(theme=>({}))

export default function ProgramTrainerEdit(){
    const { t } = useTranslation();
    const { isConfirmed } = Confirm();
    const {setMyCurrentRoute, F_showToastMessage, F_getHelper, currentScreenSize} = useMainContext();
    const {userPermissions, manageScopeIds, user} = F_getHelper();
    const isInTrainingCenter = F_getHelper().manageScopeIds.isTrainingCenter;
    const classes = useStyles();
    const navigate = useNavigate();

    /** Groups = Classes **/
    const [classes1, setClasses1] = useState([]);
    const [periods, setPeriods] = useState([]);
    const [currentPeriod, setCurrentPeriod] = useState("");
    const [onGoing, setOnGoing] = useState(true);
    const [isChanged, setIsChanged] = useState(false);
    /** trainingPath => when i getTraining modules [res.data._id is TRainingPath id] -> [res.data.trainingModules - subjects] **/
    const [trainingPathId, setTrainingPathId] = useState(null);
    /** trainingModules = Subjects **/
    const [trainingModules, setTrainingModules]= useState([]);
    /** chapters List **/
    const [chapters, setChapters] = useState([]);
    const [initialContents, setInitialContents] = useState([]);
    /** modal to assign content **/
    const [isOpenContentModal, setIsOpenContentModal] = useState(false);
    const [isOpenChapterModal, setIsOpenChapterModal] = useState(false);

    /** Current state of selected items id's **/
    const [model, setModel] = useState({
        trainingPathId: "",
        assignedClass: "",
        assignedPeriod: "",
        assignedSubject: "",
        assignedChapter: "",
    });

    /** Program Id for redirect from content to ContentCreatorBox **/
    const [programId,setProgramId] = useState(null);

    /** Block chapters dnd when chapter is open **/
    const [blockChapterDnd,setBlockChapterDnd] = useState(false);

    /** toggle (expand) chapter state **/
    const [expanded, setExpanded] = useState(false);

    /** Current open chapter **/
    const [currentOpenChapter,setCurrentOpenChapter] = useState(null);

    /** New content to push **/
    const [contentToAdd, setContentToAdd] = useState(null);
    const [chapterToAdd, setChapterToAdd] = useState(null);

    /** getContent from library or private **/
    const [contentFrom, setContentFrom] = useState("LIBRARY")
    let {selectedPeriod} = JSON.parse(localStorage.getItem("user"))
    
    usePrompt(isChanged);
    useEffect(()=>{
        setChapters([]);
        setCurrentOpenChapter(null);
        setExpanded(false);

        if(userPermissions.isArchitect){
            ModuleService.getAllGroupsForArchitect().then(res=>{
                if(res.data.length >0){
                    setClasses1(()=>res.data);
                    getPeriod(res.data[0]._id,res.data);
                }
            });
        }
        else{
            if(isInTrainingCenter){
                EventService.getTrainerClassesFromSessions(user.id).then(res=>{
                    if(res.data.length >0){
                        setClasses1(()=>res.data);
                        getPeriod(res.data[0]._id,res.data);
                    }
                });
            } else {
                EventService.getMyClasses().then(res=>{
                    if(res.data.length >0){
                        setClasses1(()=>res.data);
                        getPeriod(res.data[0]._id,res.data);
                    }
                });
            }
        }
        setMyCurrentRoute("Program edit")
    },[]);


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

    function getTrainingModule(classId,periodId){
        setModel(p=>({...p,assignedPeriod:periodId,assignedSubject: "",assignedChapter: ""}));
        EventService.readTrainingModules(classId, periodId).then(res=>{
            /** Set TrainingPathId **/
            setTrainingPathId(()=>res.data._id);
            /** Set TrainingModules [Subjects] List **/
            if(userPermissions.isArchitect){
                let newData = res.data.trainingModules;
                setTrainingModules(()=>newData);
                getChapters (newData[0].originalTrainingModule,res.data._id);
            } else{
                
                // other place like this: 
                // services/frontend/src/components/Calendar/helpers/EventModal.js ~248
                // trainers have acceess to their subjects , class manager has access to all subjcects in class
                let newData = res.data.trainingModules.filter(tr=> [...tr.trainers,res.data.classManager].some(tr1=>tr1===user.id)); // includes classmanager
                
                // trainers have acceess to their subjects , class manager has  access only to his class
                // let newData = res.data.trainingModules.filter(tr=> tr.trainers.some(tr1=>tr1===user.id));
                setTrainingModules(()=>newData);
                if (newData.length >0) getChapters (newData[0].originalTrainingModule,res.data._id);
                else setChapters([]);
            }
        });
    }

    function getChapters (originalTrainingModuleId, tpId){
        setModel(p=>({...p,assignedSubject:originalTrainingModuleId,assignedChapter:""}));
        /** using sending originalTrainingModuleId, and trainingPathId (was set when getTrainingModules [Subjects]) from state **/
        // let trainingPathIdToGetChapters = trainingPathId;
        EventService.readChapters(originalTrainingModuleId, tpId).then(res=>{
            setChapters(()=>res.data?.map(x=>{
                x.isSelected = true
                x.old = true
                return x
            }));
            setInitialContents(()=>res.data?.map(ch=>ch.chosenContents.map(c=>c.content)).flat())
        })
    }

    function handleOnDragEnd(result){
        if(result.destination !== null){
            if(chapters.length >1){
                //let dropId = new String(result.source.droppableId).slice(17,result.length);
                const items = Array.from(chapters);
                const [reorderedItem] = items.splice(result.source.index,1);
                items.splice(result.destination.index, 0, reorderedItem);
                setChapters(()=>items);
            }
        }
    }

    /** Current expanded chapter **/
    const handleChange = (panel, currentChapter) => (event, isExpanded) => {
        setBlockChapterDnd(()=>isExpanded);
        setExpanded(()=>isExpanded ? panel : false);
        if(isExpanded){
            setCurrentOpenChapter(()=>currentChapter.chapter);
            setModel(p=>({...p,assignedChapter:currentChapter.chapter._id}));
        }else{
            setCurrentOpenChapter(()=>null);
            setModel(p=>({...p,assignedChapter:""}));
        }
    };

    /** push newContent **/
    function addNewContentToChapter(chapter, content){
        setContentToAdd(()=>({chapter, content}));
        setIsChanged(()=>true);

        let selectedContentsIds = content.filter(c=> c.isSelected && ({c}));

        setChapters(p=>{
            let val = Object.assign([],p);
            val.map(ch=>{
                if(ch.chapter._id === chapter._id){
                    selectedContentsIds.map(sc=>{
                        ch.chosenContents.push({content: sc, new: true});
                    })
                }
                return ch;
            });
            return val;
        })
    }

    function removeContentFromChapter(chapterIndex, contentIndex){
        setChapters(p=>{
            let val = Object.assign([],p);
            val[chapterIndex].chosenContents.splice(contentIndex,1);
            return val;
        })
        setIsChanged(()=>true);
    }

    function openModalHandler(contentFrom){
        setContentFrom(()=>contentFrom);
        setIsOpenContentModal(()=>true)
    }

    function addNewChapterToSubject(subject, chapter){
        setIsChanged(()=>true);
        setChapterToAdd(()=>({subject, chapter}));

        let selectedChapters = chapter.filter(c=> c.isSelected);
        let currentChapIds = chapters.map(x=>(x.chapter.origin||x.chapter._id))
        let newChapters = selectedChapters.filter(x => !currentChapIds.includes(x._id))

        setChapters(p=>{
            let val = Object.assign([],p);
            val = [...val, ...newChapters.map(x=>({chapter:x, chosenContents:[], isSelected: true}))]
            val = val.map(ch=>{
                ch.isSelected = !!selectedChapters.find(x=>[ch.chapter._id,ch.chapter.origin].includes(x._id))
                return ch
            });
            return val;
        })
    }
    
    function save(){
        let data = {
            classId: model.assignedClass,
            periodId: model.assignedPeriod,
            trainingPathId: trainingPathId,
            trainingModuleId: model.assignedSubject,
            assignedChapters: chapters,
            initialContents: initialContents,
        }

        ModuleCoreService.editChaptersInProgram(data).then(res=>{
            setIsChanged(()=>false);
            F_showToastMessage(t("Data was updated"),"success");
        }).catch(error=>console.log(error))
    }
    
    const classesList = classes1.length >0 ? classes1.map((item,index)=><MenuItem hidden={item.name === "New empty class"} key={item._id} value={item._id}>{item.name}</MenuItem>): [];
    const periodsList = periods.length >0 ? periods.map((item,index)=><MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>): [];
    const trainingModulesList = trainingModules.map((item, index)=><MenuItem key={item.originalTrainingModule} value={item.originalTrainingModule} originalTrainingModuleId={item.originalTrainingModule}>{item.newName}</MenuItem>);
    // const chaptersListPreview = chapters ? chapters.map((item,index)=><ProgramTrainerEditChapters key={item._id} item={item} index={index} trainingPathId={trainingPathId} programId={programId}/>): null;

    return(
            <Grid container spacing={3} className="flex-grow-1">
                <Grid item xs={12} md={10}>
                   <Grid container xs={12} className="justify-content-between align-items-center" >
                       <Grid item xs={12} md={3} >
                            <FormControl fullWidth={true} style={{maxWidth:'400px', minWidth:'150px'}} margin="dense" variant="filled">
                               <InputLabel id="demo-simple-select-label">{t("Select class")}</InputLabel>
                               <Select
                                   labelId="demo-simple-select-label"
                                   id="demo-simple-select"
                                   value={model.assignedClass}
                                   onChange={async (e) => {
                                        if(isChanged) {
                                            let confirm = await isConfirmed(t("Are you sure you want to change class? All unsaved changes will be lost."));
                                            if(!confirm) return;
                                        }
                                       getPeriod(e.target.value);
                                       setCurrentOpenChapter(null);
                                       setExpanded(false);
                                   }}
                               >
                                   {classesList}
                               </Select>
                           </FormControl>
                       </Grid>
                       <Grid item xs={12} md={3}>
                               <FormControl fullWidth={true} style={{maxWidth:'400px', minWidth:'150px'}} margin="dense" variant="filled">
                               <InputLabel id="demo-simple-select-label">{t("Select period")}</InputLabel>
                               <Select
                                   labelId="demo-simple-select-label"
                                   id="demo-simple-select"
                                   disabled={model.assignedClass === ""}
                                   value={model.assignedPeriod}
                                   onChange={async (e) => {
                                    if(isChanged) {
                                        let confirm = await isConfirmed(t("Are you sure you want to change period? All unsaved changes will be lost."));
                                        if(!confirm) return;
                                    }
                                       getTrainingModule(model.assignedClass,e.target.value);
                                       setOnGoing(()=>currentPeriod===e.target.value)
                                       setCurrentOpenChapter(null);
                                       setExpanded(false);
                                   }}
                               >
                                   {periodsList}
                               </Select>
                           </FormControl>
                       </Grid>
                       <Grid item xs={12} md={3}>
                            <FormControl fullWidth={true} style={{maxWidth:'400px', minWidth:'150px'}} margin="dense" variant="filled">
                               <InputLabel id="demo-simple-select-label">{t("Select subject")}</InputLabel>
                               <Select
                                   labelId="demo-simple-select-label"
                                   id="demo-simple-select"
                                   disabled={model.assignedClass === ""||model.assignedPeriod === ""}
                                   value={model.assignedSubject}
                                   onChange={async (e,objData) => {
                                        if(isChanged) {
                                            let confirm = await isConfirmed(t("Are you sure you want to change subject? All unsaved changes will be lost."));
                                            if(!confirm) return;
                                        }
                                       /** need originalTrainingModuleId to getChapters **/
                                       getChapters (objData.props.originalTrainingModuleId, model.trainingPathId);
                                       setCurrentOpenChapter(null);
                                       setExpanded(false);
                                   }}
                               >
                                   {trainingModulesList}
                               </Select>
                           </FormControl>
                       </Grid>
                   </Grid>
                        <Typography variant="h6" component="h6"  style={{fontSize:"14px"}} className="text-center">
                           <span>{t(`This period is ${onGoing?'':'not'} active`)}</span>
                        </Typography>
                        <List className="mt-0 p-0 pb-2">
                            <CardHeader title={(
                                <Typography variant="h5" component="h2" className="text-left mt-5" style={{color: `rgba(82, 57, 112, 1)`}}>
                                    {chapters.length >0 ? t("Chapters") : t("Please select a class then select a period then select a subject")}
                                </Typography>
                            )}
                            />
                                <DragDropContext onDragEnd={handleOnDragEnd}>
                                    <Droppable droppableId={`droppableChapter-99`}>
                                        {(provided)=>(
                                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                                {
                                                    chapters?.map((item,index)=>{
                                                        return  item.isSelected? <Draggable draggableId={item.chapter._id} index={index} key={item.chapter._id} isDragDisabled={blockChapterDnd}>
                                                                {(provided)=>(
                                                                    <div
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        ref={provided.innerRef}
                                                                        className="mx-2"
                                                                    >
                                                                        <ProgramTrainerEditChapters key={item.chapter._id} item={item} index={index} trainingPathId={trainingPathId} programId={programId}
                                                                                                    blockChapterDnd={blockChapterDnd} setCurrentOpenChapter={setCurrentOpenChapter}
                                                                                                    expanded={expanded} handleChange={handleChange} contentToAdd={contentToAdd}
                                                                                                    removeContentFromChapter={removeContentFromChapter}/>
                                                                    </div>
                                                                )}
                                                            </Draggable>: provided.placeholder
                                                                }
                                                    ) ?? <></>
                                                }
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                        </List>
                </Grid>
                <Grid item xs={12} md={2} className="flex-grow-1">
                        <List className="pt-0 d-flex flex-column justify-content-between" style={{height:"100%"}} >
                            <div className="d-flex flex-fill flex-column">
                                <Button classes={{root: classes.root}} size="small" variant="contained" color="primary" onClick={()=>{
                                    blockChapterDnd ? openModalHandler("LIBRARY") : F_showToastMessage(t("To assign, click and expand the chapter"),"warning")}
                                    }>{t("Assign from library")}</Button>
                                <Button disabled={true} classes={{root: classes.root}} size="small" variant="contained" color="primary" className="mt-4" onClick={()=>{
                                    blockChapterDnd ? openModalHandler("LIBRARYCHAPTER") : F_showToastMessage(t("To assign, click and expand the chapter"),"warning")}
                                }>{t("Assign from library (selected chapters)")}</Button>
                                <Button classes={{root: classes.root}} size="small" variant="contained" color="primary" className="mt-4" onClick={()=>{blockChapterDnd ? openModalHandler("PRIVATE") : F_showToastMessage(t("To assign, click and expand the chapter"),"warning")}}>{t("Assign from private")}</Button>
                                <Button classes={{root: classes.root}} size="small" variant="contained" color="primary" className="mt-4" onClick={()=>{window.open('/create-content', '_blank')}}>{t("Create new in factory")}</Button>
                                {/* <Button classes={{root: classes.root}} size="small" variant="contained" color="primary" disabled={true} className="mt-4 mb-5" onClick={()=>{}}>{t("Add notes")}</Button> */}
                                {userPermissions.isArchitect &&<Button classes={{root: classes.root}} size="small" variant="contained" color="primary" disabled={false} className="mt-4 mb-5" onClick={()=>{(model.assignedSubject !== undefined) ? setIsOpenChapterModal(true) : F_showToastMessage(t("To assign, click and expand the chapter"),"warning")}}>{t("Manage chapters")}</Button>}
                            </div>
                            <div className="d-flex flex-fill flex-column justify-content-end" >
                                {/* <Button classes={{root: classes.root}} size="small" variant="contained" color="primary" disabled={true} disabled={true} className="mt-5" onClick={()=>{}}>{t("Copy program")}</Button> */}
                                {/* <Button classes={{root: classes.root}} size="small" variant="contained" color="primary" disabled={true} className="mt-4" onClick={()=>{}}>{t("Remove")}</Button> */}
                                <Button classes={{root: classes.root}} size="small" variant="contained" color="primary" disabled={!isChanged||model.assignedSubject === undefined} className="mt-4" onClick={save}>{t("Save")}</Button>
                            </div>
                        </List>
                </Grid>
                <ProgramAddingContentModal isOpen={isOpenContentModal} setOpen={setIsOpenContentModal} selectedChapter={currentOpenChapter}
                                           addNewContentToChapter={addNewContentToChapter} contentFrom={contentFrom}/>
                <ProgramAddingChapterModal isOpen={isOpenChapterModal} setOpen={setIsOpenChapterModal} selectedSubject={model.assignedSubject}
                                           addNewChapterToSubject={addNewChapterToSubject} selectedChapters={chapters?.filter(x=>x.isSelected)}/>
            </Grid>
    )
}