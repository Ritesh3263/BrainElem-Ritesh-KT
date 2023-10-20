import React, {lazy, useEffect} from 'react';
import Grid from "@material-ui/core/Grid";
import {useDispatch, useSelector} from "react-redux";
import {courseManageActions} from "app/features/CourseManage/data";
import {EAccordion} from "styled_components";
import Typography from "@material-ui/core/Typography";
import {theme} from "MuiTheme";
import Checkbox from "@material-ui/core/Checkbox";

const ContentsList = lazy(() => import("./ContentsList"));

const SidebarDrawer=()=> {
    const dispatch = useDispatch();
    const {data, openItemHelper} = useSelector(_=>_.courseManage);


    const assignedChaptersList = data?.length>0 ? data.map((item,index)=>(
                    <EAccordion
                        expanded={openItemHelper.isOpenChapter && (index === openItemHelper.chapterIndex)}
                        onChange={({target:{name}},s)=>{
                            if(name !== 'check'){
                                if(s){
                                    dispatch(courseManageActions.openItemHelper({type:'CHAPTER',
                                        payload: {isOpenChapter: true, chapterId: item._id, chapterIndex: index}}));
                                }else{
                                    dispatch(courseManageActions.openItemHelper({type:'CHAPTER',
                                        payload: {isOpenChapter: false}}));
                                }
                            }
                        }}
                        key={item._id}
                        style={{backgroundColor:'rgba(255,255,255,0.25)'}}
                        className='mt-3 py-2'
                        headerName={(
                            <Grid container style={{minWidth:'335px'}}>
                                <Grid item xs={1} className="d-flex justify-content-center align-items-center">
                                    <Checkbox checked={!!item?.isDone} size="small" style={{padding:'3px'}} name="check"
                                              onChange={()=>{
                                                  dispatch(courseManageActions.doneItem({type:'CHAPTER', isDone: !item?.isDone, chapterId: item._id, trainingModule: item?.trainingModule}));
                                                  dispatch(courseManageActions.openItemHelper({type:'CHECK_CHAPTER',
                                                      payload: {chapterIndex: index}}));
                                              }}
                                    />
                                </Grid>
                                <Grid item xs={11} wrap='nowrap' >
                                    <Typography variant="body2" component="h5" className="text-left" style={{fontSize:"20px", color:theme.palette.primary.lightViolet, textOverflow: "ellipsis", overflow: "hidden"}}>
                                            {`${index+1}. ${item?.name ||'-'}`}
                                    </Typography>
                                </Grid>
                            </Grid>
                        )}
                    >
                        <ContentsList/>
                    </EAccordion>
    )):[];

     return (
        <Grid container style={{maxHeight:'800px', overflowY:"scroll"}}>
            <Grid item xs={12} className="px-2">
                {assignedChaptersList}
            </Grid>
        </Grid>
     )
 }

export default SidebarDrawer;