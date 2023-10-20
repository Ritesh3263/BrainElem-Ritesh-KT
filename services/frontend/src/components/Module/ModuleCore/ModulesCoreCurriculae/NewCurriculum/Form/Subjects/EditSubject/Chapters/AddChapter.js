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
import SearchField from "../../../../../../../../common/Search/SearchField";
import {useTranslation} from "react-i18next";
import TableSearch from "../../../../../../../../common/Table/TableSearch";
import {useCurriculumContext} from "../../../../../../../../_ContextProviders/CurriculumProvider/CurriculumProvider";
import Typography from "@material-ui/core/Typography";
import { theme } from "../../../../../../../../../MuiTheme";

export default function AddChapter({isOpenSidebarAddChapter, setIsOpenSidebarAddChapter}){
    const {t} = useTranslation();
    const [searchingText, setSearchingText] = useState('');
    const [availableChapters, setAvailableChapters] = useState([]);
    const [filteredData,setFilteredData] = useState([]);

    /** CurriculumContext **/
    const {
        currentCurriculum,
        currentModuleCore,
        currentTrainingModule,
        curriculumReducerActionType,
        curriculumDispatch,
        currentTrainingModuleIndex,
    } = useCurriculumContext();
    /**-------------------------------------------------------------**/

    useEffect(()=>{
        setFilteredData(availableChapters);
    },[availableChapters]);

    useEffect(()=>{
        updateSelect();
    },[currentTrainingModule, isOpenSidebarAddChapter, currentCurriculum]);

    const updateSelect=()=>{
        if(currentModuleCore && currentModuleCore.trainingModules?.length>-1){
            let filteredTrainingModule = undefined;
            if(currentTrainingModule){
                filteredTrainingModule = currentModuleCore.trainingModules.filter(tr=> tr._id === currentTrainingModule?.originalTrainingModule?._id)?.[0];
                if(filteredTrainingModule?.chapters){
                    filteredTrainingModule.chapters.map(fch=>{
                        fch.isSelected = false;
                        return fch;
                    });
                    setAvailableChapters(filteredTrainingModule.chapters);
                    filteredTrainingModule.chapters.map(fch=>{
                        currentTrainingModule?.chosenChapters.map(chc=>{
                            if(fch._id === chc?.chapter?._id){
                                fch.isSelected = true;
                            }
                        })
                        return fch;
                    });

                }else{
                    setAvailableChapters([]);
                }
            }
        }
    }


    const allChaptersList = filteredData.length>0 ? filteredData.map((c, index)=>(
        <FormControlLabel label={<><span>{c?.name}</span> <span className="text-muted ml-4">{t("Time")} {`:  ${c?.durationTime??"-"} [h]`}</span></>}
                          control={
                              <Checkbox style={{color:`rgba(82, 57, 112, 1)`}}
                                        checked={!!c?.isSelected}
                                        name={c?.name}
                                        value={index}
                                        newChapterItem={c}
                                        onChange={(e,isS)=>{
                                            if(isS){
                                                curriculumDispatch({type: curriculumReducerActionType.ADD_CHAPTER,
                                                    payload: {currentTrainingModuleIndex, baseChapterIndex: index,  newChapter: c, subActionType: 'ADD'}});
                                            }else{
                                                curriculumDispatch({type: curriculumReducerActionType.ADD_CHAPTER,
                                                    payload: {currentTrainingModuleIndex, baseChapterIndex: index,  newChapter: c, subActionType: 'REMOVE'}});
                                            }
                                            updateSelect();
                                        }}
                              />
                          }
        />
    )):<p>{t('No data')}</p>;

    return(
        <SwipeableDrawer
            PaperProps={{
                style:{
                    backgroundColor: theme.palette.neutrals.white,
                    maxWidth:"450px"
            }}}
            anchor="right"
            onOpen=""
            open={isOpenSidebarAddChapter}
            onClose={()=>{
                setIsOpenSidebarAddChapter(false);
                setSearchingText('');
            }}
        >
            <List

                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader disableSticky= "true" component="div" id="nested-list-subheader">
                        <Grid container  className="py-2">
                            <Grid item xs={12}>
                            <Typography variant="h3" component="h2" className="mt-2 text-center text-justify" style={{fontSize:"32px"}}>
                                {t("Select chapters")}
                            </Typography>    
                            </Grid>
                            <Grid item xs={12} className='px-3 mb-2'>
                                    <SearchField
                                        className="text-primary"
                                        value={searchingText}
                                        onChange={(e)=>{TableSearch(e.target.value, availableChapters, setSearchingText, setFilteredData)}}
                                        clearSearch={()=>TableSearch('', availableChapters, setSearchingText, setFilteredData)}
                                    />
                            </Grid>
                        </Grid>
                    </ListSubheader>}
            >
                <FormGroup className="pl-3">
                    {allChaptersList}
                </FormGroup>
            </List>
        </SwipeableDrawer>
    )
}