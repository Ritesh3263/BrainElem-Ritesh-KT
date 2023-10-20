import React, {lazy, useEffect, useState} from "react";
import Paper from '@material-ui/core/Paper';
import {Badge, Col, Form, ListGroup, Row} from "react-bootstrap";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField"
import ClearIcon from "@material-ui/icons/Clear";
import VisibilityIcon from '@material-ui/icons/Visibility';
import ChapterService from "../../../../../services/chapter.service"
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import EditLocationIcon from "@material-ui/icons/EditLocation";
import Grid from '@material-ui/core/Grid';
import {useTranslation} from "react-i18next";

// import MSCAddingChapterModal from "./MSCAddingChapterModal";
//import MSCAddingContentModal from "./MSCAddingContentModal";
const MSCAddingChapterModal = lazy(()=>import("./MSCAddingChapterModal"));
const MSCAddingContentModal = lazy(()=>import("./MSCAddingContentModal"));

const useStyles = makeStyles(theme=>({}))

export default function MSCSetupSubject({currentModuleCore, MSCurriculum, setMSCurriculum}){
    const { t, i18n, translationsLoaded } = useTranslation();
    const classes = useStyles();
    const [trainingModules, setAssignedSubjects] = useState([]);
    const [currentSubject, setCurrentSubject] = useState(0);
    const [selectedChapter, setSelectedChapter] = useState({});
    const [isOpenChapterDialog, setIsOpenSubjectDialog] = useState(false);
    const [isOpenContentDialog, setIsOpenContentDialog] = useState(false);
    const [chapters, setChapters] = useState([]);

    useEffect(()=>{
        setAssignedSubjects(MSCurriculum.trainingModules);
    },[MSCurriculum]);

    useEffect(()=>{
        // Get chapters from training modules for one subject
        let subjectIndex = currentModuleCore.trainingModules.findIndex(s=>s._id === MSCurriculum.trainingModules[currentSubject].originalTrainingModule._id);
        if(subjectIndex <0){
            subjectIndex=0
        }
        setChapters(currentModuleCore.trainingModules[subjectIndex].chapters);
    });


    async function removeChapter(chapterIndex){
        await setMSCurriculum(p=>{
            let val = Object.assign({},p);
            val.trainingModules[currentSubject].chosenChapters.splice(chapterIndex,1);
            return val;
        })
    }

    async function pushChapters(newChapters){
        await setMSCurriculum(p=>{
            let val = Object.assign({},p);
            let existingChapterIds = val.trainingModules[currentSubject].chosenChapters.map(c=>c.chapter._id)
            newChapters.forEach(chapter=>{
                if(chapter.isSelected && !existingChapterIds.includes(chapter._id)){
                    val.trainingModules[currentSubject].chosenChapters.push(
                        {
                            chapter: chapter,
                            chosenContents: [],
                        }
                    );
                }
            })
            return val;
        })
    }

    function handleOnDragEnd(result){
        if(result.destination !== null){
            let dropId = new String(result.source.droppableId).slice(17,result.length);
            const items = Array.from(MSCurriculum.trainingModules[dropId].chosenChapters);
            const [reorderedItem] = items.splice(result.source.index,1);
            items.splice(result.destination.index, 0, reorderedItem);
            setMSCurriculum(p=>{
                let val = Object.assign({},p);
                val.trainingModules[dropId].chosenChapters = items;
                return val;
            })
        }
    }

    return(
        <>
            <Paper elevation={10} className="d-flex flex-row pt-3 pb-3">
                <Grid container spacing={3}>
                    <Grid item xs={4} className="p-4 d-flex justify-content-start align-items-center">
                        <IconButton color="primary" style={{backgroundColor: `rgba(255,255,255,0.65)`}}
                                    size="large"
                                    onClick={()=> {
                                        setCurrentSubject(p=>(p>0 ? p-1 : p))
                                    }}
                        >
                            <ArrowBackIosIcon/>
                        </IconButton>
                        <span className="text-muted ml-3">{t("Previous subject")}</span>
                    </Grid>
                    <Grid item xs={4} className="p-4 d-flex flex-column justify-content-start align-items-center">
                        <p>
                            <small>{`${t("Subject")} ${currentSubject+1} ${t("of")} ${trainingModules.length}`}</small>
                            {currentSubject+1 < trainingModules.length ? (
                                <Badge className="ml-1" variant="warning">{`${t("left")}: ${trainingModules.length - (currentSubject+1)}`}</Badge>
                            ):null}

                        </p>
                        <strong>{MSCurriculum.trainingModules[currentSubject].newName ? MSCurriculum.trainingModules[currentSubject].newName : "-"}</strong>
                    </Grid>
                    <Grid item xs={4} className="p-4 d-flex justify-content-end align-items-center">
                        <span className="text-muted mr-3">{t("Next subject")}</span>
                        <IconButton color="primary" style={{backgroundColor: `rgba(255,255,255,0.65)`}}
                                    size="large"
                                    onClick={()=> {
                                        setCurrentSubject(p=>(p<trainingModules.length-1 ? p+1 : p))
                                    }}
                        >
                            <ArrowForwardIosIcon/>
                        </IconButton>
                    </Grid>
                </Grid>
            </Paper>
            <>
                <Row className="align-items-center justify-content-end mt-4 mr-2" xs={12}>
                    <Button size="small" variant="contained" color="primary"
                            startIcon={<EditLocationIcon/>}
                            onClick={()=>setIsOpenSubjectDialog(true)}
                    >{t("Assign chapters")}</Button>
                </Row>
                <hr/>
                <ListGroup>
                    <div className="pl-2 pr-2 pb-1 d-flex justify-content-between align-items-center">
                        <Col xs={1} className=" pl-5"><small>No.</small></Col>
                        <Col xs={4} className=""><small>{t("Chapter name")}</small></Col>
                        <Col xs={3} className=""><small>{t("Duration time")}</small></Col>
                        <Col xs={2} className=""><small>{t("Assigned content")}</small></Col>
                        <Col xs={1} className=""><small>{t("Preview/Edit")}</small></Col>
                        <Col xs={1} className=" text-right pr-4">
                            <ArrowDropDownIcon/>
                        </Col>
                    </div>
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId={`droppableChapter-${currentSubject}`}>
                            {(provided)=>(
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {
                                        MSCurriculum.trainingModules[currentSubject].chosenChapters ? MSCurriculum.trainingModules[currentSubject].chosenChapters.map((chapter, index)=>(
                                                <Draggable draggableId={chapter.chapter._id} index={index} key={chapter.chapter._id}>
                                                    {(provided)=>(
                                                        <div
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            ref={provided.innerRef}
                                                        >
                                                            <ListGroup.Item className="pl-2 pr-2 py-0 mb-2 d-flex justify-content-between align-items-center" style={{backgroundColor:`rgba(255,255,255,0.35)`, borderRadius:"8px"}}>
                                                                <DragIndicatorIcon/>
                                                                <Col xs={1}><Avatar style={{width: "25px", height: "25px", backgroundColor:`rgba(82, 57, 112, 1)`}}>{index+1}</Avatar></Col>
                                                                <Col xs={4}>{chapter.chapter.name ? chapter.chapter.name : "-"}</Col>
                                                                <Col xs={3}>
                                                                    <TextField label={`[${t("hours")}]`}
                                                                               InputLabelProps={{
                                                                                   shrink: true,
                                                                               }}
                                                                               type="number"
                                                                               value={chapter.chapter.durationTime}
                                                                               onChange={(e) => {
                                                                                   setMSCurriculum(p=>{
                                                                                       let val = Object.assign([],p);
                                                                                       val.trainingModules[currentSubject].chapters[index].durationTime = e.target.value;
                                                                                       return val;
                                                                                   })
                                                                               }}
                                                                    />
                                                                </Col>
                                                                <Col xs={2} className="d-flex flex-column">{chapter.chosenContents ? chapter.chosenContents.length : "-"}</Col>
                                                                <Col xs={1}><IconButton size="small" className="text-primary text-center"
                                                                                        onClick={()=>{
                                                                                            const selectChapter = async ()=>{
                                                                                                await setSelectedChapter(chapter);
                                                                                            }
                                                                                            selectChapter().then(()=>{
                                                                                                setIsOpenContentDialog(true);
                                                                                            })
                                                                                        }}
                                                                >
                                                                    <VisibilityIcon/>
                                                                </IconButton>
                                                                </Col>
                                                                <Col xs={1} className="d-flex justify-content-center p-0">
                                                                    <IconButton size="small" className="text-danger">
                                                                        <ClearIcon onClick={()=>removeChapter(index)}/>
                                                                    </IconButton>
                                                                </Col>
                                                            </ListGroup.Item>
                                                        </div>
                                                    )}
                                                </Draggable>
                                        )): <></>
                                    }
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </ListGroup>
                <MSCAddingChapterModal isOpen={isOpenChapterDialog} setOpen={setIsOpenSubjectDialog} subjectChapters={chapters} pushChapterToSubject={pushChapters}/>
                <MSCAddingContentModal isOpen={isOpenContentDialog} setOpen={setIsOpenContentDialog} selectedChapter={selectedChapter}
                                       currentSubjectName={MSCurriculum.trainingModules ? MSCurriculum.trainingModules[currentSubject].newName : "-"}
                                       trainingModuleSubjectChaptersToGetContent={chapters}
                                       curriculumLevel={MSCurriculum.level}/>
            </>
        </>
    )
}