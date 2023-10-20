import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import IconButton from "@material-ui/core/IconButton";
import {useTranslation} from "react-i18next";
import {makeStyles} from "@material-ui/core/styles";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ConfirmActionModal from "../../../../../../../../../common/ConfirmActionModal";
import {useMainContext} from "../../../../../../../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {useCurriculumContext} from "../../../../../../../../../_ContextProviders/CurriculumProvider/CurriculumProvider";
import VisibilityIcon from "@material-ui/icons/Visibility";

const useStyles = makeStyles(theme=>({}));

export default function ContentsTable({removeChapterHandler}){
    const { t } = useTranslation();
    const classes = useStyles();
    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false, removeIndex: undefined});

    /** CurriculumContext ------------------------------------------**/
    const {
        currentCurriculum,
        curriculumDispatch,
        curriculumReducerActionType,
        currentTrainingModuleIndex,
        currentChapterIndex,
        contents,
        setContents,
        currentChapter,
    } = useCurriculumContext();
    /**-------------------------------------------------------------**/

    useEffect(()=>{
        if(actionModal.returnedValue){
            handleContentRemove(actionModal.removeIndex);
        }
    },[actionModal.returnedValue]);


    useEffect(()=>{
        if(currentChapter?.chosenContents?.length>0){
          setContents(currentChapter.chosenContents);
        }else{
            setContents([]);
        }
    },[currentChapter, currentCurriculum]);


    function handleOnDragEnd(result){
        if(result.destination !== null){
            const items = Array.from(contents);
            const [reorderedItem] = items.splice(result.source.index,1);
            items.splice(result.destination.index, 0, reorderedItem);
            curriculumDispatch({type:curriculumReducerActionType.UPDATE_CONTENTS_DND, payload: {currentTrainingModuleIndex,currentChapterIndex , contentsOrder: items}})
        }
    };

    const handleContentRemove=(contentIndex)=>{
        curriculumDispatch({type:curriculumReducerActionType.REMOVE_CONTENT, payload: {currentTrainingModuleIndex,currentChapterIndex , contentIndex}})
    }


    const contentsList = contents?.length>0 ? contents.map((c, index)=>(
        <Draggable draggableId={c?.content?._id} index={index} key={c?.content?._id} >
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
                            <Grid item xs={1} className='p-1 d-flex justify-content-start align-items-center' style={{borderRight:'1px solid rgba(255,255,255, 0.0)'}}>
                                {c?.content?.contentType[0]}
                            </Grid>
                            <Grid item xs={5} className='p-1 d-flex justify-content-start align-items-center' style={{borderRight:'1px solid rgba(255,255,255, 0.0)'}}>
                                {c?.content?.title}
                            </Grid>
                            <Grid item xs={2} className='p-1 d-flex justify-content-start align-items-center' style={{borderRight:'1px solid rgba(255,255,255, 0.0)'}}>
                                {c?.content?.durationTime??'-'}
                            </Grid>
                            <Grid item xs={1} className="d-flex justify-content-center align-items-center p-1">
                                <IconButton size="medium"
                                            style={{height: "40px", width: "40px"}}
                                            onClick={()=>{setActionModal({isOpen: true, returnedValue: false, removeIndex: index})}}>
                                    <DeleteForeverIcon style={{color: `rgba(82, 57, 112, 1)`}}/>
                                </IconButton>
                            </Grid>
                            <Grid item xs={1} className="d-flex justify-content-center p-1 align-items-center">
                                <IconButton size="medium"
                                            style={{height: "40px", width: "40px"}}
                                            onClick={()=>{window.open(`/content/display/${c?.content?._id}`, '_blank')}}>
                                    <VisibilityIcon style={{color: `rgba(82, 57, 112, 1)`}}/>
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
                <Droppable droppableId={`droppableContent-1`}>
                    {(provided)=>(
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {contentsList}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <ConfirmActionModal actionModal={actionModal}
                                setActionModal={setActionModal}
                                actionModalTitle={t("Removing content from chapter")}
                                actionModalMessage={t("Are you sure you want to remove content from chapter? The action is not reversible!")}
            />
        </>
    )
}