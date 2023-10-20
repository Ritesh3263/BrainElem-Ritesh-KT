import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import IconButton from "@material-ui/core/IconButton";
import {BsPlusLg} from "react-icons/bs";
import {useTranslation} from "react-i18next";
import {makeStyles} from "@material-ui/core/styles";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ConfirmActionModal from "../../../common/ConfirmActionModal";
import {useMainContext} from "../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {useCourseContext} from "../../../_ContextProviders/CourseProvider/CourseProvider";
import { new_theme } from "NewMuiTheme";
import Chip from "@material-ui/core/Chip";
import { ThemeProvider, Typography } from "@mui/material";
import { AiFillDelete } from 'react-icons/ai';


const useStyles = makeStyles(theme=>({}));

export default function ChapterTable({removeChapterHandler}){
    const { t } = useTranslation();
    const classes = useStyles();
    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false, removeIndex: undefined});

    /** CourseContext ------------------------------------------**/
    const {
        currentCourse,
        chapters,
        setChapters,
        currentChapter,
        setCurrentChapter,
        isOpenEditChapterForm,
        setIsOpenEditChapterForm,
        currentChapterIndex,
        setCurrentChapterIndex,
        courseDispatch,
        courseReducerActionType,
        setEditFormHelper,
    } = useCourseContext();
    /**-------------------------------------------------------------**/

    useEffect(()=>{
        if(currentCourse?.chosenChapters?.length>0){
            setChapters(currentCourse.chosenChapters);
        }else{
            setChapters([]);
        }
    },[currentCourse]);

    useEffect(()=>{
        if(actionModal.returnedValue){
           removeChapterHandler(actionModal.removeId);
        }
    },[actionModal.returnedValue]);

    const setCurrentChapterHelper=(chapterId)=>{
        let filtered = chapters.find(ch=> ch?.chapter?._id === chapterId);
        if(filtered){
            setCurrentChapter(filtered);
        }
    }


    function handleOnDragEnd(result){
        if(result.destination !== null){
            const items = Array.from(chapters);
            const [reorderedItem] = items.splice(result.source.index,1);
            items.splice(result.destination.index, 0, reorderedItem);
            courseDispatch({type: courseReducerActionType.UPDATE_CHAPTERS_DND, payload: items})
        }
    }


    const chaptersList = chapters?.length>0 ? chapters.map((ch, index)=>(
        // <Chip label={ch?.chapter?.name} className='m-1'
        //     key={ch.chapter?._id}
        //     style={{ backgroundColor: new_theme.palette.newSupplementary.SupCloudy, color: new_theme.palette.newSupplementary.NSupText, borderRadius: '5px' }}
        //     onDelete={()=>{setActionModal({isOpen: true, returnedValue: false, removeId: ch?.chapter?._id})}}
        // />
         <Draggable draggableId={ch.chapter?._id} index={index} key={ch.chapter?._id} isDragDisabled={isOpenEditChapterForm.isOpen}>
             {(provided)=>(
               
                 <div
                     {...provided.draggableProps}
                     {...provided.dragHandleProps}
                     ref={provided.innerRef}
                 > 
                     <Paper elevation={10} className="my-2 py-1 tbl-chapter-row" style={{cursor:'pointer'}}>
                         <Grid container>
                             {/* <Grid item xs={1} className='d-flex justify-content-start align-items-center p-1' style={{borderRight:`1px solid ${new_theme.palette.shades.white00}`}}>
                                 <SettingsEthernetIcon sx={{ transform: "rotate(90deg)"}} style={{color: new_theme.palette.neutrals.purplepink}}/>
                             </Grid> */}
                             {/* <Grid item xs={1} className='p-1 d-flex justify-content-start align-items-center' style={{borderRight:`1px solid ${new_theme.palette.shades.white00}`}}>
                                 {index+1}
                             </Grid> */}
                             <Grid item xs={4} className='p-1 d-flex justify-content-start align-items-center' style={{borderRight: `1px solid ${new_theme.palette.shades.white00}`, fontWeight:'600'}}>
                                 {ch?.chapter?.name}
                             </Grid>
                             {/* <Grid item xs={2} className='p-1 d-flex justify-content-start align-items-center' style={{borderRight:`1px solid ${new_theme.palette.shades.white00}`}}>
                                 {ch?.chapter?.durationTime??'-'}
                             </Grid> */}
                             {/* <Grid item xs={2} className='p-1 d-flex justify-content-start align-items-center' style={{borderRight:`1px solid ${new_theme.palette.shades.white00}`}}>
                                 {ch?.chosenContents?.length??0}
                             </Grid> */}
                             <Grid item xs={4} className="d-flex justify-content-center align-items-center p-1">
                                 <IconButton size="medium"
                                             style={{height: "40px", width: "40px", backgroundColor:new_theme.palette.newSupplementary.SupCloudy}}
                                             disabled={isOpenEditChapterForm.isOpen}
                                             onClick={()=>{setActionModal({isOpen: true, returnedValue: false, removeId: ch?.chapter?._id})}}>
                                     <AiFillDelete style={{color: isOpenEditChapterForm.isOpen ? new_theme.palette.newSupplementary.NSupText : new_theme.palette.newSupplementary.NSupText}}/>
                                 </IconButton>
                             </Grid>
                             <Grid item xs={4} className="d-flex justify-content-end p-1 align-items-center">
                                 <IconButton size="medium"
                                             style={{height: "40px", width: "40px", backgroundColor:new_theme.palette.newSupplementary.SupCloudy}}
                                             onClick={()=>{
                                                 setCurrentChapterIndex(index);
                                                 setEditFormHelper(p=>({...p, openType: 'CONTENT_SET'}))
                                                 setIsOpenEditChapterForm({isOpen: true, chapterId: ch.chapter._id});
                                                 setCurrentChapterHelper(ch.chapter._id);
                                             }}>
                                     <BsPlusLg style={{color: new_theme.palette.newSupplementary.NSupText}}/>
                                 </IconButton>
                             </Grid>
                         </Grid>
                     </Paper>
                 </div>)}
         </Draggable>
    )) : <p style={{textAlign:'center'}}>{t("List is empty")}</p>;

    return(

        <ThemeProvider theme={new_theme}>
            
            <DragDropContext onDragEnd={handleOnDragEnd}>
                
                <Droppable droppableId={`droppableChapter-1`}>
                    {(provided)=>(
                        <div className="tbl-chapter-selected" {...provided.droppableProps} ref={provided.innerRef}>
                            <div style={{display:'flex', justifyContent:'space-between', padding:'5px'}}>
                                <Typography variant="body2" component="h2">{t("Name")}</Typography>
                                <Typography variant="body2" component="h2">{t("Add Content")}</Typography>
                            </div>
                            {chaptersList}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <ConfirmActionModal actionModal={actionModal}
                                setActionModal={setActionModal}
                                actionModalTitle={t("Removing chapter from course")}
                                actionModalMessage={t("Are you sure you want to remove chapter from course? The action is not reversible!")}
            />
        </ThemeProvider>
    )
}