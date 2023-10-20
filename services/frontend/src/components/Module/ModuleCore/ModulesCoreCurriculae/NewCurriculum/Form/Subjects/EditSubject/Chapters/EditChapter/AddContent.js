import React, {useEffect, useState} from "react";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import {
    Checkbox,
    FormControlLabel, FormGroup,
    ListSubheader,
    Paper
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import SearchField from "../../../../../../../../../common/Search/SearchField";
import {useTranslation} from "react-i18next";
import TableSearch from "../../../../../../../../../common/Table/TableSearch";
import {useCurriculumContext} from "../../../../../../../../../_ContextProviders/CurriculumProvider/CurriculumProvider";
import chapterService from "../../../../../../../../../../services/chapter.service";
import Typography from '@material-ui/core/Typography';
import { theme } from "../../../../../../../../../../MuiTheme";


export default function AddContent({isOpenSidebarAddContent, setIsOpenSidebarAddContent}){
    const {t} = useTranslation();
    const [searchingText, setSearchingText] = useState('');
    const [availableContents, setAvailableContents] = useState([]);
    const [filteredData,setFilteredData] = useState([]);

    /** CurriculumContext **/
    const {
        currentModuleCore,
        currentTrainingModule,
        curriculumReducerActionType,
        curriculumDispatch,
        currentTrainingModuleIndex,
        currentChapter,
        currentChapterIndex,
        contents,
    } = useCurriculumContext();
    /**-------------------------------------------------------------**/

    useEffect(()=>{
        setFilteredData(availableContents);
    },[availableContents]);

    useEffect(()=>{
        updateSelect();
        setAvailableContents([]);
    },[isOpenSidebarAddContent, currentTrainingModule, contents]);

    const updateSelect=()=>{
        if(currentModuleCore && currentModuleCore.trainingModules?.length>-1){
            let filteredTrainingModule = undefined;
            if(currentTrainingModule){
                filteredTrainingModule = currentModuleCore.trainingModules.filter(tr=> tr._id === currentTrainingModule?.originalTrainingModule?._id)?.[0];
                if(filteredTrainingModule?.chapters && currentChapter?.chapter){
                    let filteredChapter = filteredTrainingModule.chapters.filter(ch=> ch._id === currentChapter?.chapter?._id)?.[0];
                    if(filteredChapter){
                        let newArr =[];
                        chapterService.getContents(filteredChapter._id).then(res=>{
                              if(res.status === 200 && res.data.length>0){
                                  newArr = res.data.map(c=>{
                                      c.isSelected = false;
                                      return c;
                                  });
                                  newArr.map(c=>{
                                      contents.map(i=>{
                                          if(c._id === i?.content?._id){
                                              c.isSelected = true;
                                          }
                                      });
                                      return c;
                                  });
                                  setAvailableContents(newArr);
                              }
                        }).catch(error=>console.log(error))

                        // setUserPermissions(p=>Object.keys(p).reduce((acc,key)=>{acc[key] = true; return acc},{}));
                    }else{
                        setAvailableContents([]);
                    }
                }else{
                    setAvailableContents([]);
                }
            }
        }
    }

    const allChaptersList = filteredData ? filteredData.map((c, index)=>(
        <FormControlLabel label={<><span>{c?.title}</span> </>}
                          control={
                              <Checkbox style={{color:`rgba(82, 57, 112, 1)`}}
                                        checked={!!c?.isSelected}
                                        name={c?.title}
                                        value={index}
                                        newChapterItem={c}
                                        onChange={(e,isS)=>{
                                            if(isS){
                                                curriculumDispatch({type: curriculumReducerActionType.ADD_CONTENT,
                                                    payload: {currentTrainingModuleIndex, currentChapterIndex, baseContentIndex: index,  newContent: c, subActionType: 'ADD'}});
                                            }else{
                                                curriculumDispatch({type: curriculumReducerActionType.ADD_CONTENT,
                                                    payload: {currentTrainingModuleIndex, currentChapterIndex, baseContentIndex: index,  newContent: c, subActionType: 'REMOVE'}});
                                            }
                                            updateSelect();
                                        }}
                              />
                          }
        />
    )): <p>{t('No data')}</p>;

    return(
        <SwipeableDrawer
            PaperProps={{
                style:{
                    backgroundColor: theme.palette.neutrals.white,
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
                            <Typography variant="h3" component="h2" className="mt-2 text-center text-justify mb-2" style={{fontSize:"32px"}}>   
                                {t("Select contents")}
                            </Typography>    
                            </Grid>
                            <Grid item xs={12} className='px-3 mb-2'>                                    <SearchField
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