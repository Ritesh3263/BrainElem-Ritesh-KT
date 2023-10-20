import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import IconButton from "@material-ui/core/IconButton";
import {BsPencil} from "react-icons/bs";
import {useTranslation} from "react-i18next";
import {makeStyles} from "@material-ui/core/styles";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ConfirmActionModal from "../../../../../../../../common/ConfirmActionModal";
import {useMainContext} from "../../../../../../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {useCurriculumContext} from "../../../../../../../../_ContextProviders/CurriculumProvider/CurriculumProvider";

const useStyles = makeStyles(theme=>({}));

export default function ChapterTable({removeChapterHandler}){
    const { t } = useTranslation();
    const classes = useStyles();
    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false, removeIndex: undefined});

    /** CurriculumContext ------------------------------------------**/
    const {
        currentTrainingModule,
        setEditFormHelper,
        chapters,
        setChapters,
        setCurrentChapter,
        currentCurriculum,
        curriculumDispatch,
        curriculumReducerActionType,
        currentTrainingModuleIndex,
        isOpenEditChapterForm,
        setIsOpenEditChapterForm,
        setCurrentChapterIndex,
    } = useCurriculumContext();
    /**-------------------------------------------------------------**/

    useEffect(()=>{
        if(currentTrainingModule?.chosenChapters?.length>0){
            setChapters(currentTrainingModule.chosenChapters);
        }else{
            setChapters([]);
        }
    },[currentTrainingModule, currentCurriculum]);

    useEffect(()=>{
        if(actionModal.returnedValue){
            removeChapterHandler(actionModal.removeIndex);
        }
    },[actionModal.returnedValue]);

    const setCurrentChapterHelper=(chapterId)=>{
        let filtered = chapters.filter(ch=> ch?.chapter?._id === chapterId)?.[0];
        if(filtered){
            setCurrentChapter(filtered);
        }
    }


    function handleOnDragEnd(result){
        if(result.destination !== null){
            const items = Array.from(chapters);
            const [reorderedItem] = items.splice(result.source.index,1);
            items.splice(result.destination.index, 0, reorderedItem);
            curriculumDispatch({type:curriculumReducerActionType.UPDATE_CHAPTERS_DND, payload: {currentTrainingModuleIndex, chaptersOrder: items}})
        }
    }


    const chaptersList = chapters?.length>0 ? chapters.map((ch, index)=>(
        <Draggable draggableId={ch.chapter._id} index={index} key={ch.chapter._id} isDragDisabled={isOpenEditChapterForm.isOpen}>
            {(provided)=>(
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    <Paper elevation={10} className="my-2 py-1" style={{cursor:'pointer'}}>
                        <Grid container>
                            <Grid item xs={1} className='d-flex justify-content-start align-items-center p-1' style={{borderRight:'1px solid rgba(255,255,255, 0.0)'}}>
                                <SettingsEthernetIcon sx={{ transform: "rotate(90deg)"}} style={{color: `rgba(82, 57, 112, 1)`}}/>
                            </Grid>
                            <Grid item xs={1} className='p-1 d-flex justify-content-start align-items-center' style={{borderRight:'1px solid rgba(255,255,255, 0.0)'}}>
                                {index+1}
                            </Grid>
                            <Grid item xs={4} className='p-1 d-flex justify-content-start align-items-center' style={{borderRight:'1px solid rgba(255,255,255, 0.0)'}}>
                                {ch?.chapter?.name}
                            </Grid>
                            <Grid item xs={2} className='p-1 d-flex justify-content-start align-items-center' style={{borderRight:'1px solid rgba(255,255,255, 0.0)'}}>
                                {ch?.chapter?.durationTime??'-'}
                            </Grid>
                            <Grid item xs={2} className='p-1 d-flex justify-content-start align-items-center' style={{borderRight:'1px solid rgba(255,255,255, 0.0)'}}>
                                {ch?.chosenContents?.length??0}
                            </Grid>
                            <Grid item xs={1} className="d-flex justify-content-center align-items-center p-1">
                                <IconButton size="medium"
                                            style={{height: "40px", width: "40px"}}
                                            disabled={isOpenEditChapterForm.isOpen}
                                            onClick={()=>{setActionModal({isOpen: true, returnedValue: false, removeIndex: index})}}>
                                    <DeleteForeverIcon style={{color: isOpenEditChapterForm.isOpen ? `rgba(82, 57, 112, 0.4)` : `rgba(82, 57, 112, 1)`}}/>
                                </IconButton>
                            </Grid>
                            <Grid item xs={1} className="d-flex justify-content-center p-1 align-items-center">
                                <IconButton size="medium"
                                            style={{height: "40px", width: "40px"}}
                                            onClick={()=>{
                                                setCurrentChapterIndex(index);
                                                setEditFormHelper(p=>({...p,openType: 'SUBJECT'}));
                                                setIsOpenEditChapterForm({isOpen: true, chapterId: ch.chapter._id});
                                                setCurrentChapterHelper(ch.chapter._id);
                                            }}>
                                    <BsPencil style={{color: `rgba(82, 57, 112, 1)`}}/>
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Paper>
                </div>)}
        </Draggable>
    )) : (
        <Paper elevation={10}
               className="d-flex flex-grow-1 align-items-center justify-content-center">
            {t("No data")}
        </Paper>);

    return(
        <>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId={`droppableChapter-1`}>
                    {(provided)=>(
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {chaptersList}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <ConfirmActionModal actionModal={actionModal}
                                setActionModal={setActionModal}
                                actionModalTitle={t("Removing chapter from subject")}
                                actionModalMessage={t("Are you sure you want to remove chapter from subject? The action is not reversible!")}
            />
        </>
    )
}