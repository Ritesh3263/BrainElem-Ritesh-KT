import React, {useEffect, useState} from "react";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import {Checkbox, FormControlLabel, FormGroup, ListSubheader, Paper} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import SearchField from "../../../common/Search/SearchField";
import {useTranslation} from "react-i18next";
import TableSearch from "../../../common/Table/TableSearch";
import {useCourseContext} from "../../../_ContextProviders/CourseProvider/CourseProvider";
import ListItemButton from "@mui/material/ListItemButton";
import {Collapse, ListItemIcon, ListItemText} from "@mui/material";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { Divider } from "@mui/material";
import { new_theme } from "NewMuiTheme";
import Typography from "@mui/material/Typography";


export default function AddChapter({isOpenSidebarAddChapter, setIsOpenSidebarAddChapter}){
    const {t} = useTranslation();
    const [searchingText, setSearchingText] = useState('');
    const [filteredData,setFilteredData] = useState([]);
    const [openIndex, setOpenIndex] = useState(undefined);
    

    /** CourseContext **/
    const {
        trainingModules,
        currentCourse,
        courseReducerActionType,
        courseDispatch,
    } = useCourseContext();
    /**-------------------------------------------------------------**/

    useEffect(()=>{
        setOpenIndex(undefined);
        setFilteredData(trainingModules);
    },[trainingModules]);

    useEffect(()=>{
        if(trainingModules){
            trainingModules.map(({chapters})=>{
                if(chapters){
                    chapters.map(chapter=>{
                        if(currentCourse?.chosenChapters){
                            currentCourse?.chosenChapters.map(assignedChapter=>{
                                if(assignedChapter?.chapter?._id === chapter._id){
                                    chapter.isSelected = true;
                                }
                            })
                        }
                    });
                }
            })
        };
    },[]);

    const updateSelect=(ch)=>{
        if(trainingModules){
            let filteredData = trainingModules.map((tr)=>{
                if(tr?.chapters){
                    tr?.chapters.map(chapter=>{
                        if(chapter._id === ch?._id){
                            chapter.isSelected = !chapter.isSelected;
                        }
                    });
                }
                return tr;
            });
            setFilteredData(filteredData);

            if(ch?.isSelected){
                courseDispatch({type: courseReducerActionType.CHAPTERS_UPDATE,
                    payload: {type: 'ADD', newChap: ch}});
            }else{
                courseDispatch({type: courseReducerActionType.CHAPTERS_UPDATE,
                    payload: {type: 'REMOVE', chapterId: ch._id}});
            }

        };
    }

    const allTrainingModulesList = filteredData.map((tr,index)=>(
        <div key={index}>
            <ListItemButton onClick={()=>{setOpenIndex(p=> (p !== index) ? index : undefined)}}>
                <ListItemText primary={
                    <Typography variant="body1" component="span" sx={{ fontWeight: "bold"}}>
                        {tr?.name}
                    </Typography>
                    }
                    className="text-center"/>
                {(openIndex === index) ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            {(tr?.chapters?.length>0) ? tr.chapters.map((ch,ind)=>(
                <Collapse in={openIndex === index} timeout="auto" unmountOnExit key={ind}>
                    <List component="div" disablePadding>
                        <FormControlLabel label={<><span style={{color:new_theme.palette.newSupplementary.NSupText}}>{ch?.name}</span> <span className="text-muted ml-4">{t("Time")} {`:  ${ch?.durationTime??"-"} [h]`}</span></>}
                                          control={
                                              <Checkbox style={{color:new_theme.palette.newSupplementary.NSupText}}
                                                        checked={!!ch?.isSelected}
                                                        name={ch?.name}
                                                        value={index}
                                                        onChange={(e,isS)=>{
                                                            updateSelect(ch);
                                                        }}
                                              />
                                          }
                        />
                    </List>
                </Collapse>
            )):[]}
        </div>
    ));

    return(
        <SwipeableDrawer
            PaperProps={{
                style:{
                    backgroundColor: new_theme.palette.neutrals.white,
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
                        <Grid container className="py-2">
                            <Grid item xs={12}>
                            <Typography variant="h3" component="h2" className="text-left text-justify mt-2" style={{fontSize:"34px", color:new_theme.palette.primary.MedPurple}}>   
                                {t("Select chapters")}
                            </Typography>    
                            <Divider variant="insert" className='heading_divider' />

                            </Grid>
                            <Grid item xs={12} style={{marginTop:20}}>
                                    <SearchField
                                        className="text-primary"
                                        value={searchingText}
                                        onChange={(e)=>{TableSearch(e.target.value, trainingModules, setSearchingText, setFilteredData)}}
                                        clearSearch={()=>TableSearch('', trainingModules, setSearchingText, setFilteredData)}
                                    />
                            </Grid>
                        </Grid>
                    </ListSubheader>}
            >
                <FormGroup className="pl-3">
                    {(allTrainingModulesList?.length>0) ? allTrainingModulesList : <span>{t("No data")}</span>}
                </FormGroup>
            </List>
        </SwipeableDrawer>
    )
}