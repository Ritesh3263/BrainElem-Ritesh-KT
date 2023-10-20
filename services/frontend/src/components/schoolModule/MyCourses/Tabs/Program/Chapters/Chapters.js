import React, {lazy, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {myCourseActions} from "app/features/MyCourses/data";
import {EAccordion} from "styled_components";
import {theme} from "MuiTheme";
import { EChip } from "styled_components";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import SettingsEthernetIcon from "@mui/icons-material/SettingsEthernet";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Checkbox from "@material-ui/core/Checkbox";
import {courseManageActions} from "../../../../../../app/features/CourseManage/data";
import Tooltip from "@mui/material/Tooltip";
import CommonDataService from "services/commonData.service";
import ChapterService from "services/chapter.service";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider"
import { Input, TextField, Typography} from '@mui/material';
import { styled } from '@mui/material/styles';

const Contents = lazy(() => import("./Contents"));


const StyledEAccordion = styled(EAccordion)({

    '& h3.MuiTypography-root': {width: '100%'},
    '.MuiAccordionSummary-root': {
        backgroundColor:'rgba(255,255,255,0.75)',
        borderRadius:"8px"
    },

})


const Chapters=(props)=> {
    const{
        isBase=false,
    }=props;
    const {
        F_showToastMessage,
        F_getHelper,
    } = useMainContext();
    const {user} = F_getHelper();

    const {item, itemDetails, dndHelper, formHelper, programHelper} = useSelector(s=>s.myCourses);
    const events = item?.schedule?.events;
    const dispatch = useDispatch();
    const {t} = useTranslation();

    useEffect(()=>{
        if(item?._id ){
            dispatch(myCourseActions.fetchItemDetails({itemId: item._id, type: 'PROGRAM'}));
            if(formHelper.openType === 'EDIT'){
                dispatch(myCourseActions.dndAction({type:'DND_CH_SWITCH', payload: {isActiveChapter: true, isActiveContent: false}}));

                // else if is not necessary
            }else if(formHelper.openType === 'PREVIEW'){
                dispatch(myCourseActions.dndAction({type:'DND_CH_SWITCH', payload: {isActiveChapter: false, isActiveContent: false}}));
            }
        }
    },[item?._id]);


    function handleOnDragEnd(result){
        if(result.destination !== null){
            const items = Array.from(itemDetails.assignedChapters);
            const [reorderedItem] = items.splice(result.source.index,1);
            items.splice(result.destination.index, 0, reorderedItem);
            dispatch(myCourseActions.dndAction({type:'DND_CH_UP', payload: items}));
        }
    }

    const assignedChaptersList = itemDetails?.assignedChapters?.length>0 ? itemDetails.assignedChapters.map((item,index)=>(
        <Draggable draggableId={item._id} index={index} key={item._id} isDragDisabled={(programHelper.mode !== 'EDIT') || !dndHelper.dndChapter.isActiveDnd} >
            {(provided)=>(
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    <StyledEAccordion 
                        expanded={(index === dndHelper.dndChapter.chapterIndex) && dndHelper.dndChapter.isOpenChapter}
                        style={{borderRadius:"8px"}}
                        onChange={({target:{name}},s)=>{
                            if(name !== 'check'){
                                if(s){
                                    dispatch(myCourseActions.dndAction({type:'DND_CH_SWITCH',
                                        payload: {isActiveChapter: false, isActiveContent: true, isOpenChapter: true,chapterId: item._id, chapterIndex: index}}));
                                }else{
                                    dispatch(myCourseActions.dndAction({type:'DND_CH_SWITCH',
                                        payload: {isActiveChapter: true, isActiveContent: false, isOpenChapter: false}}));
                                }
                            }
                        }}
                        className='mt-3'
                        headerName={(
                            <div className='d-flex justify-content-between align-items-center' style={{width:"100%"}}>
                                {(programHelper.mode === 'EDIT') && (
                                    <>
                                        {dndHelper.dndChapter.isActiveDnd && (
                                            <SettingsEthernetIcon sx={{ transform: "rotate(90deg)"}} style={{color: `rgba(82, 57, 112, 1)`,backgroundColor:'rgba(255,255,255,0)'}} className='mr-3'/>
                                        )}
                                    </>
                                )}
                                 <Tooltip title= { user.role === 'Parent'  ? "" : t("Mark as done")  }>
                                    <div>
                                    {/* <Checkbox checked={!!item.isDone} size="small" style={{marginTop:'0.45rem'}} name="check"
                                            className="mr-1"
                                            disabled= {  (isBase && programHelper.mode !== 'EDIT') || user.role === 'Parent' }
                                            onClick={async (e,v)=>{
                                                let {data:{message}} = await CommonDataService.markCompleted('chapters', item._id, !item.isDone)
                                                if (message==='success') {
                                                    dispatch(myCourseActions.dndAction({type:'DONE_CHAPTER',
                                                        payload: {chapterId: item._id, chapterIndex: index}}));
                                                    F_showToastMessage(t(message), 'success')
                                                } else F_showToastMessage(t(message), 'error')
                                              }}
                                    /> */}
                                    </div>
                                </Tooltip>
                                {/* <Typography variant="body2" component="h5" className="text-left" style={{fontSize:"20px", color:theme.palette.primary.lightViolet}}>
                                    {item.name }
                                </Typography> */}
                                <Typography  style={{...theme.typography.p18, width: '100%'}}>
                                <TextField 
                                    id="outlined-basic"
                                    className='text-left m-auto '
                                     
                                    defaultValue={item.name}
                                    value={item.name}
                                    // style={{fontSize:"20px", color:theme.palette.primary.lightViolet}} 
                                    disabled={user.role !== 'Trainer' || programHelper.mode !== 'EDIT'} 
                                    onChange={(e)=>{
                                        if(user.role==='Trainer'){
                                            dispatch(myCourseActions.dndAction({type:'CHANGE_CHAPTER_NAME', payload: {name: e.target.value, chapterIndex: index}}));
                                        }
                                    }}
                                    onClick={(e)=>{
                                        if (programHelper.mode == 'EDIT') e.stopPropagation()
                                    }}
                        
                                    variant="standard"
                                    InputProps={{
                                        disableUnderline: true,
                                    
                                    }}
                                    sx={{
                                        width: '100%',
                                        "& .MuiInputBase-input.Mui-disabled": {
                                          cursor: 'pointer',
                                          WebkitTextFillColor: theme.palette.primary.lightViolet,
                                          whiteSpace: 'nowrap',
                                          textOverflow: 'ellipsis',
                                          overflow: 'hidden'
                                        },
                                      }}
                                />
                                </Typography>
                            </div>
                        )}
                    >
                        <Contents contents={item.assignedContents} isBase={isBase} isDone={!!item.isDone} events={events?.filter(ch=>ch.assignedChapter?._id==item._id)}/>
                    </StyledEAccordion>
                </div>)}
        </Draggable>
    )):[];



     return (
         <DragDropContext onDragEnd={handleOnDragEnd}>
             <Droppable droppableId={`droppableChapter-1`}>
                 {(provided)=>(
                     <div {...provided.droppableProps} ref={provided.innerRef}>
                         {assignedChaptersList}
                         {provided.placeholder}
                     </div>
                 )}
             </Droppable>
         </DragDropContext>
     )
 }

export default Chapters;