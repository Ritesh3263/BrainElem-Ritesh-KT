import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import IconButton from "@material-ui/core/IconButton";
import {BsPencil} from "react-icons/bs";
import {useTranslation} from "react-i18next";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ConfirmActionModal from "../../../common/ConfirmActionModal";
import {useMainContext} from "../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {useCoursePathContext} from "../../../_ContextProviders/CoursePathProvider/CoursePathProvider";
import { AiFillDelete } from "react-icons/ai";
import { new_theme } from "NewMuiTheme";


export default function CoursesTable({removeCourseHandler}){
    const { t } = useTranslation();
    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false, removeId: undefined});

    /** coursePathContext ------------------------------------------**/
    const {
        currentCoursePath,
        editFormHelper,
        coursePathDispatch,
        coursePathActionType,
    } = useCoursePathContext();
    /**-------------------------------------------------------------**/


    useEffect(()=>{
        if(actionModal.returnedValue){
            removeCourseHandler(actionModal.removeId);
        }
    },[actionModal.returnedValue]);


    function handleOnDragEnd(result){
        if(result.destination !== null){
            const items = Array.from(currentCoursePath?.courses?.length>0 ? currentCoursePath?.courses : []);
            const [reorderedItem] = items.splice(result.source.index,1);
            items.splice(result.destination.index, 0, reorderedItem);
            coursePathDispatch({type: coursePathActionType.UPDATE_CONTENTS_DND, payload: items})
        }
    }


    const chaptersList = currentCoursePath?.courses?.length>0 ? currentCoursePath?.courses.map((cou, index)=>(
        <Draggable draggableId={cou?._id} index={index} key={cou?._id} isDragDisabled={!editFormHelper.isOpen}>
            {(provided)=>(
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    <Paper elevation={10} className="my-2 py-1" style={{cursor:'pointer'}}>
                        <Grid container>
                            {/* <Grid item xs={1} className='d-flex justify-content-start align-items-center p-1'>
                                <SettingsEthernetIcon sx={{ transform: "rotate(90deg)"}} />
                            </Grid> */}
                            <Grid item xs={1} className='p-1 d-flex justify-content-start align-items-center' style={{borderRight:`1px solid ${new_theme.palette.shades.white00}`}}>
                                {index+1}
                            </Grid>
                            <Grid item xs={4} className='p-1 d-flex justify-content-start align-items-center' style={{borderRight:`1px solid ${new_theme.palette.shades.white00}`}}>
                                <span style={{overflowX:'hidden', textOverflow:'ellipsis'}}> {cou?.name??'-'}</span>
                            </Grid>
                            <Grid item xs={2} className='p-1 d-flex justify-content-start align-items-center' style={{borderRight:`1px solid ${new_theme.palette.shades.white00}`}}>
                                <span style={{overflowX:'hidden', textOverflow:'ellipsis'}}>{cou?.level??'-'}</span>
                            </Grid>
                            <Grid item xs={2} className='p-1 d-flex justify-content-start align-items-center' style={{borderRight:`1px solid ${new_theme.palette.shades.white00}`}}>
                                <span style={{overflowX:'hidden', textOverflow:'ellipsis'}}>{cou?.type??'-'}</span>
                            </Grid>
                            <Grid item xs={1} className="d-flex justify-content-center align-items-center p-1">
                                <IconButton size="medium"
                                            
                                            onClick={()=>{setActionModal({isOpen: true, returnedValue: false, removeId: cou?._id})}}>
                                    <AiFillDelete style={{color: editFormHelper.isOpen ? new_theme.palette.newSupplementary.NSupText : new_theme.palette.neutrals.purplepink}}/>
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
                            {chaptersList}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <ConfirmActionModal actionModal={actionModal}
                                setActionModal={setActionModal}
                                actionModalTitle={t("Removing course from training path")}
                                actionModalMessage={t("Are you sure you want to remove course from training path? The action is not reversible!")}
            />
        </>
    )
}