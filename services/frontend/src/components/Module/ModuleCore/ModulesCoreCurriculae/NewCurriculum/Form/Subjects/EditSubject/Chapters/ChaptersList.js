import React, {useEffect, useState} from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {useTranslation} from "react-i18next";
import Button from "@material-ui/core/Button";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import {makeStyles} from "@material-ui/core/styles";
import SettingsIcon from "@material-ui/icons/Settings";
import ChapterTable from "./ChapterTable"
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ContentsList from "./EditChapter/ContentsList";
import {useCurriculumContext} from "../../../../../../../../_ContextProviders/CurriculumProvider/CurriculumProvider";
import {useMainContext} from "../../../../../../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import AddChapter from "./AddChapter";

const useStyles = makeStyles(theme=>({}));

export default function ChaptersList(){
    const classes = useStyles();
    const { t } = useTranslation();
    const {F_showToastMessage} = useMainContext();
    const [isOpenSidebarAddChapter, setIsOpenSidebarAddChapter] = useState(false);

    /** CurriculumContext ------------------------------------------**/
    const {
        currentTrainingModule,
        curriculumDispatch,
        setChapters,
        curriculumReducerActionType,
        currentTrainingModuleIndex,
        isOpenEditChapterForm,
    } = useCurriculumContext();
    /**-------------------------------------------------------------**/

    useEffect(()=>{
        if(currentTrainingModule?.chosenChapters?.length>0){
            setChapters(currentTrainingModule.chosenChapters);
        }else{
            setChapters([]);
        }
    },[currentTrainingModule]);

    const removeChapterHandler=(chapterIndex)=>{
        curriculumDispatch({type:curriculumReducerActionType.REMOVE_CHAPTER, payload: {chapterIndex, currentTrainingModuleIndex}})
        //F_showToastMessage('Data was removed');
    }

    return(
        <Grid container>
            <Grid item lg={isOpenEditChapterForm.isOpen ? 6 : 12}>
                <Paper elevation={12}>
                    <Grid container>
                        <Grid item xs={12} className="d-flex justify-content-center align-items-center">
                            <Typography variant="h6" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                {t("Subject chapters")}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Button classes={{root: classes.root}} size="small" variant="contained" color="secondary"
                                    disabled={isOpenEditChapterForm.isOpen}
                                    startIcon={<AddCircleOutlineIcon/>}
                                    onClick={()=>setIsOpenSidebarAddChapter(true)}
                            >{t("Add chapter")}</Button>
                        </Grid>
                        <Grid item xs={12} className="mt-3">
                            <Grid container>
                                <Grid item xs={1} style={{borderRight:'1px solid rgba(255,255,255, 0.8)'}}>
                                    {t("")}
                                </Grid>
                                <Grid item xs={1} className="pl-1" style={{borderRight:'1px solid rgba(255,255,255, 0.8)'}}>
                                    {t("Id")}
                                </Grid>
                                <Grid item xs={4} className="pl-1" style={{borderRight:'1px solid rgba(255,255,255, 0.8)'}}>
                                    {t("Name")}
                                </Grid>
                                <Grid item xs={2} className="pl-1" style={{borderRight:'1px solid rgba(255,255,255, 0.8)'}}>
                                    {`${t("Time")} [h]`}
                                </Grid>
                                <Grid item xs={2} className="pl-1" style={{borderRight:'1px solid rgba(255,255,255, 0.8)', textOverflow: "ellipsis", overflow: 'hidden'}}>
                                    {t("Contents")}
                                </Grid>
                                <Grid item xs={1} className="d-flex justify-content-center" style={{borderRight:'1px solid rgba(255,255,255, 0.8)'}}>
                                    <RemoveCircleOutlineIcon/>
                                </Grid>
                                <Grid item xs={1} className="d-flex justify-content-center">
                                    <SettingsIcon/>
                                </Grid>
                                <Grid item xs={12} className="mt-1 p-0">
                                    <ChapterTable removeChapterHandler={removeChapterHandler} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item lg={isOpenEditChapterForm.isOpen ? 6 : 12} className="p-2" hidden={!isOpenEditChapterForm.isOpen}>
                <ContentsList />
            </Grid>
            <AddChapter isOpenSidebarAddChapter={isOpenSidebarAddChapter} setIsOpenSidebarAddChapter={setIsOpenSidebarAddChapter}/>
        </Grid>
    )
}