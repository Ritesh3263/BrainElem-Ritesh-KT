import React, {useEffect, useState} from "react";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import {Tooltip} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import ChaptersList from "./Chapters/ChaptersList";
import ContentsList from "./Chapters/EditChapter/ContentsList";
import {useCurriculumContext} from "../../../../../../../_ContextProviders/CurriculumProvider/CurriculumProvider";
import Hidden from "@material-ui/core/Hidden";
import {EButton} from "styled_components";
import CommonImageUpload from "../../../../../../../common/Image";
import CourseService from "../../../../../../../../services/course.service";
import CoursePathService from "../../../../../../../../services/course_path.service";
import ContentService from "../../../../../../../../services/content.service";


const useStyles = makeStyles(theme=>({}));

export default function EditSubject(){
    const classes = useStyles();
    const { t } = useTranslation();
    const [isEnableEditSubject, setIsEnableEditSubject] = useState(false);
    const [image, setImage] = useState(null);

    /** CurriculumContext ------------------------------------------**/
    const {
        subjectDisplayMode,
        setSubjectDisplayMode,
        setEditFormHelper,
        currentCurriculum,
        currentTrainingModule,
        setCurrentTrainingModule,
        currentTrainingModuleIndex,
        setCurrentTrainingModuleIndex,
        setIsOpenEditChapterForm,
        isOpenEditChapterForm,
        curriculumDispatch,
        curriculumReducerActionType,
    } = useCurriculumContext();
    /**-------------------------------------------------------------**/

    useEffect(()=>{
        if(currentCurriculum.trainingModules.length>0){
            let moduleIndex = currentCurriculum.trainingModules.findIndex(tr=> tr?.originalTrainingModule?._id === subjectDisplayMode.subjectId);
            if(moduleIndex>-1){
                selectCurrentTrainingModule(moduleIndex);
            }
        }
    },[currentCurriculum]);

    const selectCurrentTrainingModule=(currentIndex)=>{
        setSubjectDisplayMode(p=>({...p, subjectId: currentCurriculum.trainingModules[currentIndex].originalTrainingModule._id}))
        setCurrentTrainingModule(currentCurriculum.trainingModules[currentIndex]);
        setCurrentTrainingModuleIndex(currentIndex);
    }

    useEffect(()=>{
        if(currentTrainingModule?.image){
            setImage(currentTrainingModule?.image);
        }
    },[currentTrainingModule]);

    useEffect(()=>{
        curriculumDispatch({type: curriculumReducerActionType.UPDATE_SUBJECT,
            payload: {currentTrainingModuleIndex, field: 'image', value: image}})
    },[image]);

    return(
        <>
            <Grid container>
                <Grid item xs={12} className="mt-2 mb-4">
                    <Paper elevation={10} className="p-3">
                        <Hidden xlUp={true}>
                        <Grid container >
                            <Grid item xs={6} className="d-flex align-content-center justify-content-center">
                                {!currentTrainingModuleIndex <= 0 && (
                                    <EButton hidden={true} startIcon={<NavigateBeforeIcon style={{fill:((currentTrainingModuleIndex <= 0) ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)')}}/>}
                                            style={{fill:'rgba(255, 255, 255, 0.9)', backgroundColor:`rgba(82, 57, 112, 1)`}}
                                            disabled={currentTrainingModuleIndex <= 0}
                                            onClick={()=>{
                                                setIsOpenEditChapterForm({isOpen: false, chapterId: undefined});
                                                setEditFormHelper(p=>({...p,openType: 'GENERAL'}));
                                                selectCurrentTrainingModule(currentTrainingModuleIndex-1)
                                            }}
                                    >
                                        <small style={{color: ((currentTrainingModuleIndex <= 0)  ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)')}}>{t("Previous")}</small>
                                    </EButton>
                                )}    
                            </Grid>
                            {currentTrainingModuleIndex < currentCurriculum?.trainingModules?.length-1 &&(
                            <Grid item xs={6} className="d-flex align-content-center justify-content-center">
                                <EButton hidden={true} endIcon={<NavigateNextIcon
                                    style={{fill: ((currentTrainingModuleIndex >= currentCurriculum?.trainingModules?.length-1) ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)')}}/>}
                                        disabled={currentTrainingModuleIndex >= currentCurriculum?.trainingModules?.length-1}
                                        style={{fill:'rgba(255, 255, 255, 0.9)', backgroundColor:`rgba(82, 57, 112, 1)`}}
                                        onClick={()=>{
                                            setIsOpenEditChapterForm({isOpen: false, chapterId: undefined});
                                            setEditFormHelper(p=>({...p,openType: 'GENERAL'}));
                                            selectCurrentTrainingModule(currentTrainingModuleIndex+1)
                                        }}
                                >
                                    <small style={{color:((currentTrainingModuleIndex >= currentCurriculum?.trainingModules?.length-1) ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)')}}>{t("Next")}</small>
                                </EButton>
                            </Grid> )}
                        </Grid>
                        </Hidden>
                        <Grid container>
                            <Grid item xs={1} className="d-flex align-items-center justify-content-start">
                                <Tooltip title={t("Back to subjects list")}>
                                <IconButton style={{fill:'rgba(255, 255, 255, 0.9)', backgroundColor:'rgba(255, 255, 255, 0.9)'}} size="small"
                                            onClick={()=>{
                                                setEditFormHelper(p=>({...p,openType: 'GENERAL'}));
                                                setSubjectDisplayMode({mode:'TABLE', subjectId: undefined});
                                                setIsOpenEditChapterForm({isOpen: false, chapterId: undefined});
                                            }}
                                >
                                    <NavigateBeforeIcon style={{fill:'rgba(82, 57, 112, 1)'}}/>
                                </IconButton>
                                </Tooltip>
                            </Grid>
                            <Grid item xs={10} className="d-flex flex-column align-items-center justify-content-center">
                                <Grid container className="d-flex justify-content-center">
                                    <Hidden lgDown={true}>
                                    <Grid item xs={2} className="d-flex align-items-center justify-content-end">
                                        <Button startIcon={<NavigateBeforeIcon style={{fill:((currentTrainingModuleIndex <= 0) ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)')}}/>}
                                                style={{fill:'rgba(255, 255, 255, 0.9)', backgroundColor:`rgba(82, 57, 112, 1)`}}
                                                disabled={currentTrainingModuleIndex <= 0}
                                                onClick={()=>{
                                                    setIsOpenEditChapterForm({isOpen: false, chapterId: undefined});
                                                    setEditFormHelper(p=>({...p,openType: 'GENERAL'}));
                                                    selectCurrentTrainingModule(currentTrainingModuleIndex-1)
                                                }}
                                        >
                                            <small style={{color: ((currentTrainingModuleIndex <= 0)  ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)')}}>{t("Previous")}</small>
                                        </Button>
                                    </Grid>
                                    </Hidden>
                                    <Grid item xs={8} className="d-flex flex-column align-items-center justify-content-center">
                                        <div className="my-2">
                                            <Typography variant="h5" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                                {currentTrainingModule?.newName}
                                            </Typography>
                                        </div>
                                        <div>
                                            <Chip label={`${currentTrainingModule?.originalTrainingModule?.estimatedTime??'-'} h`} size="small"  className="mx-1"/>
                                            <Chip label={`${currentTrainingModule?.originalTrainingModule?.category?.name??'-'}`} size="small" className="mx-1"/>
                                        </div>
                                    </Grid>
                                    <Hidden lgDown={true}>
                                    <Grid item xs={2} className="d-flex align-items-center justify-content-start">
                                        <Button endIcon={<NavigateNextIcon
                                            style={{fill: ((currentTrainingModuleIndex >= currentCurriculum?.trainingModules?.length-1) ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)')}}/>}
                                                disabled={currentTrainingModuleIndex >= currentCurriculum?.trainingModules?.length-1}
                                                style={{fill:'rgba(255, 255, 255, 0.9)', backgroundColor:`rgba(82, 57, 112, 1)`}}
                                                onClick={()=>{
                                                    setIsOpenEditChapterForm({isOpen: false, chapterId: undefined});
                                                    setEditFormHelper(p=>({...p,openType: 'GENERAL'}));
                                                    selectCurrentTrainingModule(currentTrainingModuleIndex+1)
                                                }}
                                        >
                                            <small style={{color:((currentTrainingModuleIndex >= currentCurriculum?.trainingModules?.length-1) ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)')}}>{t("Next")}</small>
                                        </Button>
                                    </Grid>
                                    </Hidden>
                                </Grid>
                            </Grid>
                            <Grid item xs={1} className="d-flex align-items-center justify-content-end">
                                <Tooltip title={t("Subject actions")}>
                                <IconButton style={{fill:'rgba(255, 255, 255, 0.9)', backgroundColor:`rgba(255, 255, 255, 0.9)`}} size="small"
                                            disabled={isOpenEditChapterForm.isOpen}
                                            onClick={()=>{setIsEnableEditSubject(p=>!p)}}
                                >
                                    <MoreHorizIcon style={{fill:'rgba(82, 57, 112, 1)'}}/>
                                </IconButton>
                                </Tooltip>
                            </Grid>
                            <Grid item xs={12} className="mt-2 p-0" hidden={!isEnableEditSubject}>
                                <Paper elevation={12} className="p-2">
                                    <Grid container className="d-flex align-items-start justify-content-center">
                                        <Grid item xs={4} className="d-flex align-items-center justify-content-center px-1">
                                            <TextField label={t("Subject name")} margin="normal"
                                                //error={newSubject.newName === ''}
                                                       fullWidth
                                                       style={{maxWidth: "400px"}}
                                                       variant="filled"
                                                       required={true}
                                                       name="newName"
                                                //helperText={newSubject.newName === '' ? t("required") : ""}
                                                       InputLabelProps={{
                                                           shrink: true,
                                                       }}
                                                       value={currentTrainingModule?.newName}
                                                       onInput={(e) => {
                                                           curriculumDispatch({type: curriculumReducerActionType.UPDATE_SUBJECT,
                                                               payload: {currentTrainingModuleIndex, field: e.target.name, value: e.target.value}})
                                                       }}
                                            />
                                        </Grid>
                                        <Grid item xs={4} className="d-flex align-items-center justify-content-center px-1">
                                            <TextField label={t("Estimated duration [h]")} margin="normal"
                                                       disabled={false}
                                                       type="number"
                                                       fullWidth
                                                       style={{maxWidth: "400px"}}
                                                       variant="filled"
                                                       required={true}
                                                       name='estimatedTime'
                                                       InputLabelProps={{
                                                           shrink: true,
                                                       }}
                                                       value={currentTrainingModule?.estimatedTime || currentTrainingModule?.originalTrainingModule?.estimatedTime}
                                                onChange={({target:{name,value}})=>{
                                                    if(value !== ""){
                                                        if(Number(value)>0 && Number(value)<1000){
                                                            curriculumDispatch({type: curriculumReducerActionType.UPDATE_SUBJECT,
                                                                payload: {currentTrainingModuleIndex, field: name, value:Number(value)}})
                                                        }
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={4} className="d-flex align-items-center  px-1">
                                            <TextField label={t("Description")} margin="normal"
                                                       multiline
                                                       rowsMax={4}
                                                       fullWidth
                                                       style={{maxWidth: "400px"}}
                                                       variant="filled"
                                                       name='description'
                                                       InputLabelProps={{
                                                           shrink: true,
                                                       }}
                                                       value={currentTrainingModule?.description || currentTrainingModule?.originalTrainingModule?.description}
                                                onInput={({target:{name,value}}) => {
                                                    curriculumDispatch({type: curriculumReducerActionType.UPDATE_SUBJECT,
                                                        payload: {currentTrainingModuleIndex, field: name, value}})
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6} className="px-1" >
                                            <CommonImageUpload name={t("Upload image")}
                                                               value={image} setValue={setImage}
                                                               uploadFunction={CourseService.uploadImage}
                                                               getFileDetailsFunction={CourseService.getFileDetails}/>
                                        </Grid>
                                        <Grid item xs={12} md={6} className="d-flex align-items-center justify-content-center  px-1">
                                            {image && (
                                                <img
                                                    style={{maxHeight:'200px', width:'auto', objectFit: 'contain'}}
                                                    src={CourseService.getImageUrl(image)}
                                                    alt='Course image'
                                                    loading="lazy"
                                                />
                                            )}
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <ChaptersList />
                </Grid>
            </Grid>
        </>
    )}
