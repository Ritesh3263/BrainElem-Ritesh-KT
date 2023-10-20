import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import IconButton from "@material-ui/core/IconButton";
import {useTranslation} from "react-i18next";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ConfirmActionModal from "../../../../common/ConfirmActionModal";
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import VisibilityIcon from "@material-ui/icons/Visibility";
import {useCourseContext} from "../../../../_ContextProviders/CourseProvider/CourseProvider";
import { AiFillEye, AiFillDelete } from "react-icons/ai";
import { new_theme } from "NewMuiTheme";
import {EDataGrid} from "styled_components";


export default function ContentsTable(){
    const { t } = useTranslation();
    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false, removeIndex: undefined});

    //TODO =>
    // check behavior for different actions, sizing!
    // add picture add feature
    // connect to backend
    // test

    /** CourseContext ------------------------------------------**/
    const {
        courseReducerActionType,
        courseDispatch,
        currentChapterIndex,
        currentCourse,
        contents,
        setContents,
        currentChapter,
    } = useCourseContext();
    /**-------------------------------------------------------------**/

    useEffect(()=>{
        if(actionModal.returnedValue){
            handleContentRemove(actionModal.removeId);
        }
    },[actionModal.returnedValue]);


    useEffect(()=>{
        if(currentChapter?.chosenContents?.length>0){
            setContents(currentChapter.chosenContents);
        }else{
            setContents([]);
        }
    },[currentChapter,currentCourse]);


    function handleOnDragEnd(result){
        if(result.destination !== null){
            const items = Array.from(contents);
            const [reorderedItem] = items.splice(result.source.index,1);
            items.splice(result.destination.index, 0, reorderedItem);
            courseDispatch({type: courseReducerActionType.UPDATE_CONTENTS_DND,
                payload: {items, currentChapterIndex, chapterId: currentChapter?.chapter?._id}})
        }
    };

    const handleContentRemove=(contentId)=>{
        courseDispatch({type: courseReducerActionType.CONTENTS_UPDATE,
            payload: {type: 'REMOVE',
                currentChapterIndex,
                contentId,
                chapterId: currentChapter?.chapter?._id}});
    }


    const [rows, setRows] = useState([]);

    useEffect(()=>{
        setRows(contentsList);
    },[contents]);



    const columns = [
        { field: 'id', headerName: 'ID', width: 80, hide: false, disableColumnMenu: true, sortable: false},
        { field: 'type', headerName: 'TYPE', width: 120, flex: 1 },
        { field: 'name', headerName: 'NAME', width: 120, flex: 1 },
        { field: 'time', headerName: 'TIME', width: 120, flex: 1 },
        { field: 'action',
            width: 120,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            //flex: 1,
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            headerName: t('ACTIONS'),
            renderCell: (params) =>(
                <>
                    <IconButton size="medium" onClick={()=>{window.open(`/content/display/${contents?._id}`, '_blank')}}>
                        <AiFillEye style={{color: new_theme.palette.newSupplementary.NSupText}}/>
                    </IconButton>
                    <IconButton size="medium" onClick={()=>{setActionModal({isOpen: true, returnedValue: false, removeId: contents?._id})}}>
                        <AiFillDelete style={{color: new_theme.palette.newSupplementary.NSupText}}/>
                    </IconButton>
                </>
            )
        }
    ];


    const contentsList = contents.length>0 ? contents.map((c, index)=>
        ({  id: index+1,
            type: c?.content?.contentType[0],
            name: c?.content?.title,
            time: c?.content?.durationTime??'-',
        })) 
        : 
        (
            <Paper sx={{height:'50px'}} elevation={10}
                   className="d-flex flex-grow-1 align-items-center justify-content-center">
                {t("No data")}
            </Paper>
        );



    // const contentsList = contents?.length>0 ? contents.map((c, index)=>(
    //     <Draggable draggableId={c?.content?._id} index={index} key={c?.content?._id} >
    //         {(provided)=>(
    //             <div
    //                 {...provided.draggableProps}
    //                 {...provided.dragHandleProps}
    //                 ref={provided.innerRef}
    //             >
    //                 <Paper elevation={10} className="my-2 py-1" style={{cursor:'pointer'}}>
    //                     <Grid container>
    //                         <Grid item xs={1} className='d-flex justify-content-start align-items-center p-1' style={{borderRight:`1px solid ${new_theme.palette.shades.white00}`}}>
    //                             <SettingsEthernetIcon sx={{ transform: "rotate(90deg)"}} style={{color: new_theme.palette.secondary.DarkPurple}}/>
    //                         </Grid>
    //                         <Grid item xs={1} className='p-1 d-flex justify-content-start align-items-center' style={{borderRight: `1px solid ${new_theme.palette.shades.white00}`}}>
    //                             {index+1}
    //                         </Grid>
    //                         <Grid item xs={1} className='p-1 d-flex justify-content-start align-items-center' style={{borderRight:`1px solid ${new_theme.palette.shades.white00}`}}>
    //                             {c?.content?.contentType[0]}
    //                         </Grid>
    //                         <Grid item xs={5} className='p-1 d-flex justify-content-start align-items-center' style={{borderRight:`1px solid ${new_theme.palette.shades.white00}`}}>
    //                             {c?.content?.title}
    //                         </Grid>
    //                         <Grid item xs={2} className='p-1 d-flex justify-content-start align-items-center' style={{borderRight:`1px solid ${new_theme.palette.shades.white00}`}}>
    //                             {c?.content?.durationTime??'-'}
    //                         </Grid>
    //                         <Grid item xs={1} className="d-flex justify-content-center align-items-center p-1">
    //                             <IconButton size="medium"
    //                                         style={{height: "40px", width: "40px"}}
    //                                         onClick={()=>{setActionModal({isOpen: true, returnedValue: false, removeId: c?.content?._id})}}>
    //                                 <DeleteForeverIcon />
    //                             </IconButton>
    //                         </Grid>
    //                         <Grid item xs={1} className="d-flex justify-content-center p-1 align-items-center">
    //                             <IconButton size="medium"
    //                                         style={{height: "40px", width: "40px"}}
    //                                         onClick={()=>{window.open(`/content/display/${c?.content?._id}`, '_blank')}}>
    //                                 <VisibilityIcon style={{color: new_theme.palette.secondary.DarkPurple />
    //                             </IconButton>
    //                         </Grid>
    //                     </Grid>
    //                 </Paper>
    //             </div>)}
    //     </Draggable>



    // )) : (
    //     <Paper elevation={10}
    //            className="d-flex flex-grow-1 align-items-center justify-content-center">
    //         {t("No data")}
    //     </Paper>);

    return(


        

        <>
            {/* <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId={`droppableContent-1`}>
                    {(provided)=>(
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {contentsList}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
 */}
            <div style={{width: 'auto', height: 'auto'}}>
                <EDataGrid
                        autoHeight={true}
                        columns={columns}
                        rows={rows}
                        isVisibleToolbar={false}
                        setRows={setRows}
                        originalData={contentsList}
                />
            </div>
            <ConfirmActionModal actionModal={actionModal}
                                setActionModal={setActionModal}
                                actionModalTitle={t("Removing content from chapter")}
                                actionModalMessage={t("Are you sure you want to remove content from chapter? The action is not reversible!")}
            />
        </>
    )
}