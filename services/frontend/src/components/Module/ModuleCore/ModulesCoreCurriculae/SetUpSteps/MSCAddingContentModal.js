import React, {useEffect, useState} from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Card, Col, ListGroup, Row} from "react-bootstrap";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import TextField from "@material-ui/core/TextField";
import AlgorithmsService from "../../../../../services/algorithms.service"
import Icon from "@material-ui/core/Icon";
import chapterService from "../../../../../services/chapter.service";
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import PanToolIcon from '@material-ui/icons/PanTool';
import BarChartIcon from '@material-ui/icons/BarChart';
import {useTranslation} from "react-i18next";
import SearchField from "../../../../common/Search/SearchField";
import TableSearch from "../../../../common/Table/TableSearch";
import {Paper} from "@material-ui/core";
import {useMainContext} from "../../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import i18next from "i18next";

const useStyles = makeStyles(theme=>({}))

export default function MSCAddingContentModal({isOpen, setOpen, selectedChapter, currentSubjectName, curriculumLevel, trainingModuleSubjectChaptersToGetContent}){
    const { t, i18n, translationsLoaded } = useTranslation();
    const {F_showToastMessage, F_getHelper} = useMainContext();
    const {user} = F_getHelper();
    const classes = useStyles();
    const [chapter, setChapter] = useState({});
    const [suggestionFromAI, setSuggestionFromAI] = useState(false);
    const [searchingText, setSearchingText] = useState('');
    const [contentToAssign, setContentToAssign] = useState([]);
    const [staticData, setStaticData] = useState([]);

    useEffect(()=>{
        setChapter(selectedChapter);
    },[selectedChapter, isOpen]);

    useEffect(()=>{
        if(isOpen){
            console.log("GetContent trigger");
            setTimeout(()=>{getContent("FROM_CHAPTER").then(setSuggestionFromAI(false))},200)
        }
    },[isOpen])

    async function getContent(type){
        if(type === "FROM_AI"){
            let level = "INTERMEDIATE";
            if(curriculumLevel === "Basic"){
                level = "BEGINNER"
            }else if(curriculumLevel === "Intermediate"){
                level = "INTERMEDIATE"
            }else if(curriculumLevel === "Advanced"){
                level = "ADVANCED"
            }

            let data ={
                training_module: {
                    name: currentSubjectName ? currentSubjectName : "-"
                },
                chapter: {
                    name: chapter.chapter ? chapter.chapter.name : "-"
                },
                language: {
                    code: i18next.language ?? "en"
                },
                level: level,
            }
            /** Mock For test AI, with fr names **/
            // let data ={
            //     training_module: {
            //         name: "Physique"
            //     },
            //     chapter: {
            //         name: "mecanique"
            //     },
            //     language: {
            //         code: user?.language ?? "en"
            //     },
            //     level: "ADVANCED",
            // }
            AlgorithmsService.getSuggestedCapsules(data).then(
                (response) => {
                    setStaticData(response.data.capsules);
                    setContentToAssign(response.data.capsules)
                },
                (error) => {
                    let errorMessage = "Error while running detection algorithm."
                    F_showToastMessage(errorMessage, 'error')
                }
            )
        }else if(type === "FROM_CHAPTER"){
            chapterService.getContents(selectedChapter.chapter._id).then(res=>{
                setStaticData(res.data);
                setContentToAssign(res.data);
            })

            // if(selectedChapter !== undefined){
            //     console.log("selected-chapter",selectedChapter.chapter._id);
            //     console.log("chaptersTo getContent",trainingModuleSubjectChaptersToGetContent);
            //     let chapterIndex = trainingModuleSubjectChaptersToGetContent.findIndex(ch=> ch._id === selectedChapter.chapter._id);
            //     console.log("index",chapterIndex)
            //     if(chapterIndex < 0 ){
            //         chapterIndex = 0
            //     }
            //     let currentContentId = trainingModuleSubjectChaptersToGetContent[chapterIndex].assignedContent.length >0 ? trainingModuleSubjectChaptersToGetContent[chapterIndex].assignedContent : [];
            //     console.log("contentsFromCHapter",trainingModuleSubjectChaptersToGetContent[chapterIndex].assignedContent.length >0 ? trainingModuleSubjectChaptersToGetContent[chapterIndex].assignedContent : []);
            //     if(currentContentId.length >0){
            //         currentContentId.map(id=>{
            //              // ... no make sens ... to deep every time get one content item nad push to list...
            //         })
            //     }
            // }
        }
    }

    function handleOnDragEnd(result){
        if(result.destination !== null){
            let dropId = new String(result.source.droppableId).slice(17,result.length);
            const items = Array.from(chapter.chosenContents);
            const [reorderedItem] = items.splice(result.source.index,1);
            items.splice(result.destination.index, 0, reorderedItem);
            setChapter(p=>{
                let val = Object.assign({},p);
                val.chapter.chosenContents = items;
                return val;
            })
        }
    }

    const contentToAssignList = contentToAssign.map((content, index) =>(
        <ListGroup.Item className="pl-2 pr-2 d-flex justify-content-between align-items-center" style={content.isSelected ? {backgroundColor: "lightblue"} : null}>
            <Col xs={1}><Avatar style={{width: "25px", height: "25px", backgroundColor: `rgba(82, 57, 112, 1)`}}>{index+1}</Avatar></Col>
            <Col xs={3}>{content.title ? content.title : "-"}</Col>
            <Col xs={2}>{content.durationTime ? (`0${(content.durationTime/60) / 60 ^ 0}`.slice(-2) + ':' + ('0' + (content.durationTime/60) % 60).slice(-2)) : "-"}</Col>
            {/* <Col xs={2}>{content.cocreators ? content.cocreators : "-"}</Col> */}
            <Col xs={1}>
                {suggestionFromAI ? (
                    <small>{content.level ? t(content.level) : "-"}</small>
                ) : (
                    <IconButton size="small" className="text-primary text-center" disabled={suggestionFromAI}>
                        <a href={`/content/display/${content._id}`} target="_blank"><VisibilityIcon/></a>
                    </IconButton>
                )}
            </Col>
            <Col xs={1} className="d-flex justify-content-end p-0">
                <IconButton size="small" className="text-success">
                    <ControlPointIcon onClick={()=>{
                        setChapter(p=>{
                            let val = Object.assign({},p);
                            val.chosenContents.push({content:content}); 
                            return val;
                        })
                    }}/>
                </IconButton>
            </Col>
        </ListGroup.Item>
    ));

    return(
        <Dialog
            open={isOpen}
            onClose={()=>{
                setSearchingText('');
                setOpen(false);
                setContentToAssign([]);
                setStaticData([]);
            }}
            maxWidth={'xl'}
            fullWidth={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title" className="text-center"><h4 className="text-primary">{`${t("Add content to")}: ${chapter.chapter ? chapter.chapter.name : "-"} (chapter)`}</h4></DialogTitle>
            <DialogContent>
                <Row className="d-flex flex-row mb-5 mt-4">
                    <Col className=" d-flex justify-content-end align-items-center" xs={6} >
                        <Button size="large" variant="contained" color="primary"
                                startIcon={<BarChartIcon/>}
                            onClick={()=>{
                                getContent("FROM_AI").then(setSuggestionFromAI(true))
                            }}
                        >{t("Get suggestion from AI")}</Button>
                    </Col>
                    <Col className=" d-flex justify-content-start align-items-center" xs={6} >
                        <Button size="large" variant="contained" color="primary"
                                startIcon={<PanToolIcon/>}
                                onClick={()=>{
                                    getContent("FROM_CHAPTER").then(setSuggestionFromAI(false))
                                }}
                        >{t("Get chapter content")}</Button>
                    </Col>
                </Row>
                <Row className="d-flex flex-row mb-5 mt-4">
                    <Col xs={6} className="pt-1 pb-1">
                        <DialogContentText id="alert-dialog-description" className="text-center">
                            {t("This is list of current assigned content to chapter")}
                        </DialogContentText>
                        <ListGroup>
                            <div className="pl-5 ml-5 pr-2 pb-3 d-flex justify-content-between align-items-center">
                                <Col xs={1} className="text-muted">No.</Col>
                                <Col xs={3} className="text-muted">{t("Content name")}</Col>
                                <Col xs={2} className="text-muted">{t("Duration time [hh-mm]")}</Col>
                                {/* <Col xs={2} className="text-muted">Co creator</Col> */}
                                {/*<Col xs={1} className="text-muted">Preview</Col>*/}
                                <Col xs={1} className="text-muted">{t("Level")}</Col>
                                <Col xs={1} className="text-muted text-right pr-1">
                                    <ArrowDropDownIcon/>
                                </Col>
                            </div>
                            <DragDropContext onDragEnd={handleOnDragEnd}>
                                <Droppable droppableId={`droppableChapter-1`}>
                                    {(provided)=>(
                                        <div {...provided.droppableProps} ref={provided.innerRef}>
                                            {
                                                chapter.chosenContents ? chapter.chosenContents.map((content, index) =>(
                                                        <Draggable draggableId={content.content._id} index={index} key={content.content._id}>
                                                            {(provided)=>(
                                                                <div
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    ref={provided.innerRef}
                                                                >
                                                                    <ListGroup.Item className="pl-2 pr-2 d-flex justify-content-between align-items-center" style={content.isSelected ? {backgroundColor: "lightblue"} : null}>
                                                                        <DragIndicatorIcon/>
                                                                        <Col xs={1} className="text-left"><Avatar style={{width: "25px", height: "25px", backgroundColor: `rgba(82, 57, 112, 1)`}}>{index+1}</Avatar></Col>
                                                                        <Col xs={3}>{content.content.title}</Col>
                                                                        <Col xs={2}>
                                                                            {/*<TextField label="[hours]"*/}
                                                                            {/*           InputLabelProps={{*/}
                                                                            {/*               shrink: true,*/}
                                                                            {/*           }}*/}
                                                                            {/*           type="number"*/}
                                                                            {/*           value={content.content.durationTime}*/}
                                                                            {/*           onChange={(e) => {*/}
                                                                            {/*               setChapter(p=>{*/}
                                                                            {/*                   let val = Object.assign({},p);*/}
                                                                            {/*                   chapter.assignedContent[index].content.durationTime = e.target.value;*/}
                                                                            {/*                   return val;*/}
                                                                            {/*               })*/}
                                                                            {/*           }}*/}
                                                                            {/*/>*/}
                                                                            <TextField
                                                                                id="time"
                                                                                label={t("hh-mm")}
                                                                                type="time"
                                                                                margin="normal"
                                                                                defaultValue="00:45"
                                                                                value={content.content.durationTime ? (`0${(content.content.durationTime/60) / 60 ^ 0}`.slice(-2) + ':' + ('0' + (content.content.durationTime/60) % 60).slice(-2)) : "-"}
                                                                                InputLabelProps={{
                                                                                    shrink: true,
                                                                                }}
                                                                                inputProps={{
                                                                                    step: 300, // 5 min
                                                                                }}
                                                                                onChange={(e)=>{
                                                                                    setChapter(p=>{
                                                                                        let val = Object.assign({},p);
                                                                                        chapter.chosenContents[index].content.durationTime = (((e.target.value.slice(0,2)*60)*60) + (e.target.value.slice(3,5)*60));
                                                                                        return val;
                                                                                    })
                                                                                }}

                                                                            />
                                                                        </Col>
                                                                        {/* <Col xs={2}>{content.content.cocreators ? content.content.cocreators : "-"}</Col> */}
                                                                        <Col xs={1}><small>{content.content.level ? t(content.content.level) : "-"}</small></Col>
                                                                        <Col xs={1} className="d-flex justify-content-end p-0">
                                                                            <IconButton size="small" className="text-danger">
                                                                                <ClearIcon onClick={()=>{
                                                                                    setChapter(p=>{
                                                                                        let val = Object.assign({},p);
                                                                                        val.chosenContents.splice(index,1);
                                                                                        return val;
                                                                                    })
                                                                                }}/>
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
                            {/*{assignedContentList ? assignedContentList : null}*/}
                        </ListGroup>
                    </Col>
                    <Col xs={6} style={suggestionFromAI ? {backgroundColor:"#9EEFAC"} : {backgroundColor:"lightblue"}} className="pt-1 pb-1">
                        <DialogContentText id="alert-dialog-description" className="text-center pt-2">
                            {suggestionFromAI ? (
                                <Icon style={{textAlign:"center", height: "100%", width: "100%"}}>
                                    <img src="/img/welcome_screen/robot.png" style={{height:"40px"}}/>
                                </Icon>
                            ) : null}
                            {t("Push")} <ControlPointIcon/> {t("too add")}
                            <Paper elevation={12} className="d-flex justify-content-end">
                                <SearchField
                                    className="text-primary"
                                    value={searchingText}
                                    onChange={(e)=>{TableSearch(e.target.value, staticData, setSearchingText, setContentToAssign)}}
                                    clearSearch={()=>TableSearch('', staticData, setSearchingText, setContentToAssign)}
                                />
                            </Paper>
                        </DialogContentText>
                        <ListGroup>
                            <div className="pl-2 pr-2 pb-3 d-flex justify-content-between align-items-center">
                                <Col xs={1} className="text-muted">No.</Col>
                                <Col xs={3} className="text-muted">{t("Content name")}</Col>
                                <Col xs={2} className="text-muted">{t("Duration time [hh-mm]")}</Col>
                                {/* <Col xs={2} className="text-muted">Co creator</Col> */}
                                <Col xs={1} className="text-muted">{`${suggestionFromAI ? t("Level") : t("Preview")}`}</Col>
                                <Col xs={1} className="text-muted text-right pr-1">
                                    {t("add")} <ArrowDropDownIcon/>
                                </Col>
                            </div>
                            {contentToAssignList.length>0 ? contentToAssignList : t("Not Found")}
                        </ListGroup>
                    </Col>
                </Row>
            </DialogContent>
            <DialogActions className="d-flex justify-content-between ml-3 mr-3">
                <Button variant="contained" size="small" color="secondary"  onClick={()=>{
                    setOpen(false);
                    setContentToAssign([]);
                }}>
                    {t("Back")}
                </Button>
                <Button classes={{root: classes.root}} size="small" variant="contained" color="primary"
                        onClick={()=>{
                            setSuggestionFromAI(false);
                            setContentToAssign([]);
                            setOpen(false);
                        }}
                >
                    {t("Save")}
                </Button>
            </DialogActions>
        </Dialog>
    )
}