import React, {useEffect, useState} from "react";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import {
    Checkbox,
    Radio,
    FormControlLabel, FormGroup,
    ListSubheader,
    Paper
} from "@mui/material";
import Grid from "@mui/material/Grid";
import SearchField from "../../../../common/Search/SearchField";
import {useTranslation} from "react-i18next";
import TableSearch from "../../../../common/Table/TableSearch";
import chapterService from "../../../../../services/chapter.service";
import {useCourseContext} from "../../../../_ContextProviders/CourseProvider/CourseProvider";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";
import { new_theme } from "NewMuiTheme";

export default function AddContent({isOpenSidebarAddContent, setIsOpenSidebarAddContent}){
    const {t} = useTranslation();
    const [searchingText, setSearchingText] = useState('');
    const [availableContents, setAvailableContents] = useState([]);
    const [filteredData,setFilteredData] = useState([]);

    /** CurriculumContext **/
    const {
        currentModuleCore,
        currentTrainingModule,
        currentTrainingModuleIndex,
        currentChapter,
        currentChapterIndex,
        contents,
        currentCourse,
        courseReducerActionType,
        courseDispatch,
    } = useCourseContext();
    /**-------------------------------------------------------------**/

    useEffect(()=>{
        setFilteredData(availableContents);
    },[availableContents]);

    useEffect(()=>{
        if(currentChapter?.chapter?._id){
            chapterService.getContents(currentChapter.chapter._id).then(res=>{
                if(res.status === 200 && res.data.length>0){
                    let selected = res.data.map(c=>{
                        if(currentChapter?.chosenContents){
                            currentChapter.chosenContents.map(con=>{
                                if(con?.content?._id === c._id){
                                    c.isSelected = true;
                                }
                            })
                        }
                        return c;
                    });
                    setAvailableContents(selected);
                }
            }).catch(error=> {
                setAvailableContents([]);
                console.log(error);
            })
        }
    },[currentChapter, currentCourse]);

    const updateSelect=(content)=>{
        if(availableContents?.length>0){
            let filteredDat = availableContents.map(c=>{
                if(c._id === content._id){
                    c.isSelected = !c.isSelected;
                }
                return c;
            });
            setFilteredData(filteredDat);

            if(content?.isSelected){
                courseDispatch({type: courseReducerActionType.CONTENTS_UPDATE,
                    payload: {type: 'ADD',
                        currentChapterIndex,
                        content,
                        chapterId: currentChapter?.chapter?._id}});
            }else{
                courseDispatch({type: courseReducerActionType.CONTENTS_UPDATE,
                    payload: {type: 'REMOVE',
                        currentChapterIndex,
                        contentId: content._id,
                        chapterId: currentChapter?.chapter?._id}});
            }
        }
    }

    const allChaptersList = filteredData ? filteredData.map((c, index)=>(
        <FormControlLabel label={<><span style={{color:new_theme.palette.newSupplementary.NSupText}}>{c?.title}</span> </>}
                          control={
                              <Checkbox style={{color:new_theme.palette.newSupplementary.NSupText}}
                                        checked={!!c?.isSelected}
                                        name={c?.title}
                                        value={index}
                                        onChange={(e)=>{
                                            updateSelect(c);
                                        }}
                              />
                          }
        />
    )): [];

    return(
        <SwipeableDrawer
            PaperProps={{
                style:{
                    backgroundColor: new_theme.palette.neutrals.white,
                    maxWidth:"450px"
            }}}
            anchor="right"
            onOpen=''
            open={isOpenSidebarAddContent}
            onClose={()=>{
                setIsOpenSidebarAddContent(false);
                setSearchingText('');
            }}
        >
            <List

                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader disableSticky= "true" component="div" id="nested-list-subheader">
                        <Grid container className="py-2">
                            <Grid item xs={12}>
                            <Typography variant="h3" component="h2" className="text-left text-justify mt-2" style={{fontSize:"34px", color:new_theme.palette.primary.MedPurple}}>   
                                {t("Select contents")}
                            </Typography>
                            <Divider variant="insert" className='heading_divider' />

                            </Grid>
                            <Grid item xs={12} style={{marginTop:20}}>
                                    <SearchField
                                        className="text-primary"
                                        value={searchingText}
                                        onChange={(e)=>{TableSearch(e.target.value, availableContents, setSearchingText, setFilteredData)}}
                                        clearSearch={()=>TableSearch('', availableContents, setSearchingText, setFilteredData)}
                                    />
                            </Grid>
                        </Grid>
                    </ListSubheader>}
            >
                <FormGroup className="pl-3">
                    {allChaptersList?.length>0 ? allChaptersList: <span>{t("No data")}</span>}
                </FormGroup>
            </List>
        </SwipeableDrawer>
    )
}