import React, {useEffect, useState} from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {useTranslation} from "react-i18next";
import SettingsIcon from "@material-ui/icons/Settings";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {useCourseContext} from "components/_ContextProviders/CourseProvider/CourseProvider";
import ChapterTable from "./ChapterTable";
import AddChapter from "./AddChapter";
import ContentsList from "./Contents/ContentsList";
import { new_theme } from "NewMuiTheme";
import { Divider } from "@mui/material";
import { ThemeProvider } from "@mui/material";
import StyledButton from "new_styled_components/Button/Button.styled";
import { ETab, ETabBar } from "styled_components";
import AddContent from "./Contents/AddContent";
import ContentsTable from "./Contents/ContentsTable";


export default function ChaptersList(){
    const { t } = useTranslation();
    const {F_showToastMessage} = useMainContext();
    const [isOpenSidebarAddChapter, setIsOpenSidebarAddChapter] = useState(false);
    const [isOpenSidebarAddContent, setIsOpenSidebarAddContent] = useState(false);

    /** CourseContext ------------------------------------------**/
    const {
        currentCourse,
        courseDispatch,
        isOpenEditChapterForm,
        setIsOpenEditChapterForm,
        chapters,
        courseReducerActionType,
        trainingModules,
        setTrainingModules,
        setChapters,
    } = useCourseContext();
    /**-------------------------------------------------------------**/

    useEffect(()=>{
        if(currentCourse?.chosenChapters?.length>0){
            setChapters(currentCourse.chosenChapters);
        }else{
            setChapters([]);
        }
    },[currentCourse]);

    const removeChapterHandler=(chapterId)=>{
        if(trainingModules) {
            let filteredData = trainingModules.map((tr) => {
                if (tr?.chapters) {
                    tr?.chapters.map(chapter => {
                        if (chapter._id === chapterId) {
                            chapter.isSelected = !chapter.isSelected;
                        }
                    });
                }
                return tr;
            });
            setTrainingModules(filteredData);
            courseDispatch({
                type: courseReducerActionType.CHAPTERS_UPDATE,
                payload: {type: 'REMOVE', chapterId}
            });
            F_showToastMessage('Data was removed');
        }
    }

    return(
        <Grid container>
            <Grid item xs={12}  >
                <Grid container>
                    
                    <Grid item xs={12} sx={{mt:2}} hidden={isOpenEditChapterForm.isOpen} lg={isOpenEditChapterForm.isOpen ? 12 : 12}>
                        <Typography variant="h2" component="h2" style={{ color: new_theme.palette.newSupplementary.NSupText }}>
                            {t("Manage Chapters")}
                        </Typography>
                        <hr></hr>
                        <StyledButton eVariant="primary" eSize="small" component="span" style={{display:'table', marginLeft:'auto'}}
                                disabled={isOpenEditChapterForm.isOpen}
                                
                                onClick={()=>setIsOpenSidebarAddChapter(true)}
                        >{t("Add chapter")}
                        </StyledButton>
                        <Grid item xs={12} className="mt-1 p-0 overflow-scroll">
                            
                            <ChapterTable removeChapterHandler={removeChapterHandler} />
                        </Grid>

                    </Grid>

                    <Grid item xs={12} lg={isOpenEditChapterForm.isOpen ? 12 : 12} className="p-2" hidden={!isOpenEditChapterForm.isOpen}>
                        <ContentsList />
                    </Grid>

                    <AddChapter isOpenSidebarAddChapter={isOpenSidebarAddChapter} setIsOpenSidebarAddChapter={setIsOpenSidebarAddChapter}/>
                    <AddContent isOpenSidebarAddContent={isOpenSidebarAddContent}
                        setIsOpenSidebarAddContent={setIsOpenSidebarAddContent}/>


                </Grid>
            </Grid>
        </Grid>
    )
}