import React, {lazy, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import {useTranslation} from "react-i18next";
import OptionsButton from "components/common/OptionsButton";
import {EButton} from "styled_components";
import {myCourseActions} from "app/features/MyCourses/data";
import ModuleCoreService from "services/module-core.service";
import ContentService from "services/content.service";
import ChapterService from "services/chapter.service";
import SubjectSessionService from "services/subject_session.service";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {isWidthUp} from "@material-ui/core/withWidth";
import {theme} from "MuiTheme";
import EIconButton from "styled_components/EIconButton";
import ESvgIcon from "styled_components/SvgIcon";


import { ReactComponent as EditIcon } from 'icons/icons_32/Edit_32.svg';
import { ReactComponent as EditAcceptIcon } from 'icons/icons_32/Accept_32.svg';
import { ReactComponent as EditCloseIcon } from 'icons/icons_32/Close_32.svg';

const ConfirmActionModal = lazy(() => import("components/common/ConfirmActionModal"));
const ManageChaptersModal = lazy(() => import("./Chapters/ManageChaptersModal"));
const ManageContentModal = lazy(() => import("./Chapters/Contents/ManageCoursesModal"));
const Chapters = lazy(() => import("./Chapters"));

const Program=()=> {
    const {item, programHelper, formHelper, itemDetails, dndHelper, chapterModalHelper} = useSelector(s=>s.myCourses);
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const [isBase, setIsBase] = useState(false);
    const [showProgram, setShowProgram] = useState(false);
    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false, otm: undefined});
    const [programs, setPrograms] = useState([]);
    const [group, setGroup] = useState({});
    const {
        F_getHelper,
        currentScreenSize,
        F_showToastMessage,
    } = useMainContext();

    useEffect(()=>{
        if(item?._id ){
            dispatch(myCourseActions.fetchItemDetails({itemId: item._id, type: 'PROGRAM'}));
            ModuleCoreService.getTrainingModuleFromOtherPrograms(item._id).then(res=>{
                setPrograms(res.data);
            })
        }

        // Cleanup
        return ()=>{
            if (programHelper.mode == 'EDIT') dispatch(myCourseActions.programAction({type:'TOGGLE_EDIT', payload: programHelper.mode}));
        }

    },[item]);

    useEffect(()=>{
        if(actionModal.returnedValue){
            SubjectSessionService.mirrorTrainingModule(actionModal.otm, item._id).then(res=>{
                dispatch(myCourseActions.fetchItemDetails({itemId: item._id, type: 'PROGRAM'}));
                F_showToastMessage('Mirroring program is done', 'success');
                setShowProgram(false);
            }).catch(err=>{
                F_showToastMessage(err.message, 'error');
            })
        }
    },[actionModal.returnedValue]);

    useEffect(()=>{

        SubjectSessionService.read(formHelper.itemId).then(res=>{
            setGroup(res.data.group._id)
        })    
    },[]);

    const programList = programs.length>0 ? programs.map((tm,index)=>(
        <Paper elevation={3} key={tm._id}>
            <Grid container spacing={3}>
                <Grid item xs={12} style={{display: 'flex', justifyContent: 'space-between', margin: '10px'}}>
                    <Typography variant="h6">{tm.name}</Typography>
                    <Button variant="contained" color="primary" onClick={()=>{
                        if(item?._id){
                            setActionModal({isOpen: true, returnedValue: false, otm: tm.chosenChapters[0].chapter._id});
                        } else {
                            F_showToastMessage('Please wait until the program is loaded', 'error');
                        }
                    }}>
                        {t('Assign this program')}
                    </Button>
                </Grid>
                <Grid item xs={12} style={{margin: '10px'}}>
                    <Typography variant="body1">
                        {t(`This program is based on ${tm.curriculum} curriculum.`)}
                    </Typography>
                    <Typography variant="body1">
                        {tm.chosenChapters?.length>0 && tm.chosenChapters.map((ch,i)=>(
                            <Typography variant="body1" key={i}>
                                {(i+1)+'. '+ch.chapter?.name}
                                {ch.chosenContents?.length>0 && ch.chosenContents.map((co,j)=>(
                                    <Typography variant="body2" key={j}>
                                        {'- '+(j+1)+'. '+co.content?.title}
                                    </Typography>
                                ))}
                            </Typography>
                        ))}
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    )) : [];



    const buttons= [[
        {id: 1, name: t("Preview the base curriculum"), action: ()=>{actionHandler({type: 'SWITCH_PROGRAM', payload: 'BASE_PROGRAM'})}},
        {id: 2, name: t("Assign a program"), action: ()=>{actionHandler({type: 'MIRROR_PROGRAM', payload: 'xxx'})}},
        {id: 3, name: t("Show all elements"), action: ()=>{actionHandler({type: 'SHOW_HIDE_ELEMENTS', payload: true})}},
        {id: 4, name: t("Hide all elements"), action: ()=>{actionHandler({type: 'SHOW_HIDE_ELEMENTS', payload: false})}},
        {id: 5, disabled:true, name: t("Restart the program to base curriculum"), action: ()=>{actionHandler({type: 'RESTART_PROGRAM', payload: 'xxx'})}},
        {id: 6, name: 'divider', action: ()=>{}},
        {id: 7, name: t("Manage chapters"),
            primary: t('Available in edit mode'), disabled: (programHelper.mode !== 'EDIT'),
            action: ()=>{dispatch(myCourseActions.chapterModalHelper('OPEN'))}},
        {id: 8, name: t("Assign from library"), primary: t('You need to expand chapter and be in edit mode'), disabled: ((programHelper.mode !== 'EDIT') || !dndHelper.dndChapter.isOpenChapter),
            action: ()=>{dispatch(myCourseActions.contentModalHelper('OPEN'))}},
        {id: 9, name: t("Create new content"), action: ()=>{window.open(`/create-content`, '_blank')}},
    ],[
        {id: 1, name: t("Return to your curriculum"), action: ()=>{actionHandler({type: 'SWITCH_PROGRAM', payload: 'PROGRAM'})}},
    ]]

    const actionHandler=({type,payload})=>{
        switch (type){
            case 'SWITCH_PROGRAM':{
                dispatch(myCourseActions.fetchItemDetails({itemId: item._id, type: payload}));
                setIsBase(()=>payload==='BASE_PROGRAM');
                break;
            }
            case 'MIRROR_PROGRAM':{
                setShowProgram(()=>true);
                break;
            }
            case 'SHOW_HIDE_ELEMENTS':{
                if (itemDetails?.assignedChapters?.length>0){
                    let contentIds = itemDetails.assignedChapters.flatMap(ch=>ch.assignedContents.map(co=>co._id));
                    ContentService.changeVisibility(contentIds, group, payload).then((res)=>{  
                        F_showToastMessage(t(res.data.message),"success");
                        dispatch(myCourseActions.dndAction({type:'SHOW_OTHERS_ALL', payload }));
                    })
                }
                break;
            }
            case 'RESTART_PROGRAM':{
                //setQuery(p=>({...p, itemsLength: payload}));
                if (item?._id){
                    window.alert(`are you sure you want to restart the program?`)
                    ModuleCoreService.resetCurriculum(item.program.duplicatedTrainingPath,item._id).then(res=>{
                        dispatch(myCourseActions.fetchItemDetails({itemId: item._id, type: 'PROGRAM'}));
                    })
                }
                break;
            }
            default: break;
        }
    };


     return (<>
        <Grid container item xs={12} md={10}>
            <Grid item xs={12}>
                <Paper elevation={10} style={{borderRadius:'8px', background: theme.palette.glass.opaque}} className='p-3'>
                    <Grid container spacing={2}>
                        <Grid item xs={12} style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Grid item xs={8}>
                                <Typography sx={theme.typography.p18}>
                                    {t("List of assigned content")}
                                </Typography>
                            </Grid>
                            {formHelper.openType === 'EDIT' && (
                                <Grid item xs={4} className='d-flex justify-content-end align-items-end'>
                                    {!isBase && programHelper.mode !== 'EDIT' && <>

                                        <EIconButton size="small" sx={{mr: 1}} onClick={()=>{
                                            dispatch(myCourseActions.programAction({type:'TOGGLE_EDIT', payload: programHelper.mode}));
                                        }} variant="contained" color="secondary">
                                        <ESvgIcon viewBox="0 0 32 32" component={EditIcon} />
                                        </EIconButton>
                                    </>}

                                    {!isBase && programHelper.mode === 'EDIT' && (
                                         <>
                                             <EIconButton
                                                 onClick={() => { 
                                                    dispatch(myCourseActions.fetchItemDetails({ itemId: item._id, type: 'PROGRAM' }));
                                                    dispatch(myCourseActions.programAction({ type: 'TOGGLE_EDIT', payload: programHelper.mode })); 
                                                }}
                                                 size="small" color="secondary">
                                                 <ESvgIcon viewBox="0 0 32 32" component={EditCloseIcon} />
                                             </EIconButton>
                                             <EIconButton sx={{ mx: 1 }} size="small" color="primary"
                                                 onClick={async () => {
                                                     if (itemDetails?.assignedChapters?.length > 0) {
                                                         let data = {}
                                                         Object.assign(data, JSON.parse(JSON.stringify(itemDetails)));

                                                         // Save updated chapters names
                                                         // I moved this action from input in Chapters.js
                                                         // I don't know why it's not all done with redux actions
                                                         for (let chapter of itemDetails?.assignedChapters){
                                                            await ChapterService.renameChapterName(chapter._id, {name: chapter.name})
                                                         }
                                                         data.assignedChapters = itemDetails.assignedChapters.map(ch => ({ ...ch, isSelected: true }));
                                                         ModuleCoreService.saveContentOrder(data).then(res => {
                                                             dispatch(myCourseActions.fetchItemDetails({ itemId: item._id, type: 'PROGRAM' }));
                                                             dispatch(myCourseActions.programAction({ type: 'TOGGLE_EDIT', payload: 'EDIT' }));
                                                         }).catch(err => {
                                                             window.alert(err.message);
                                                         })
                                                     } else {
                                                         window.alert('Please wait until the program is loaded');
                                                     }
                                                 }}
                                             > <ESvgIcon color="white" viewBox="0 0 32 32" component={EditAcceptIcon} />
                                             </EIconButton>
                                         </>
                                    )}
                                    <OptionsButton btns={buttons[+isBase]} iconButton={true} eSize="small" />
                                </Grid>
                            )}
                        </Grid>
                        <Grid item xs={12} md={12} className={`${isWidthUp('md',currentScreenSize) ? 'pl-5 pb-5': ''}`}>
                            <Chapters isBase={isBase}/>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
        <Dialog open={showProgram} onClose={()=>{setShowProgram(()=>false)}}>
            <DialogTitle>{t("Assign a program")}</DialogTitle>
                <Box p={2} sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', p: 1, m: 1, bgcolor: 'background.paper', borderRadius: 1, }}>
                    {programList}
                </Box>
            <DialogActions>
                <Button onClick={()=>{setShowProgram(()=>false)}} color="primary">
                    {t("Cancel")}
                </Button>
            </DialogActions>
        </Dialog>
        <ManageChaptersModal />
        <ManageContentModal />
        <ConfirmActionModal actionModal={actionModal}
                                setActionModal={setActionModal}
                                actionModalTitle={t("Mirroring a curriculum")}
                                actionModalMessage={t("Are you sure you want to mirror this program? This will create a new program with the same name and the same structure as the selected program. And your current program will be replaced with the new program.")}
                                btnText={t("Copy")}
            />
        </>
    )
}

export default Program;