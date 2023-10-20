import React, {useEffect, useState} from "react";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import {
    FormControlLabel, FormHelperText,
    ListSubheader,
    Paper, Radio,
    RadioGroup
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import SearchField from "../../../../../../../common/Search/SearchField";
import {useTranslation} from "react-i18next";
import TableSearch from "../../../../../../../common/Table/TableSearch";
import Button from "@material-ui/core/Button";
import {useCurriculumContext} from "../../../../../../../_ContextProviders/CurriculumProvider/CurriculumProvider";
import {theme} from "MuiTheme";
import { Typography } from '@mui/material';


export default function SidebarSelectSubject({isOpenSidebarAddSubjects, setIsOpenSidebarAddSubjects, handleAssignSubject}){
    const {t} = useTranslation();
    const [searchingText, setSearchingText] = useState('');
    const [trainingModules, setTrainingModules] = useState([]);
    const [filteredData,setFilteredData] = useState([]);

    /** CurriculumContext **/
    const {
        currentModuleCore,
    } = useCurriculumContext();
    /**-------------------------------------------------------------**/

    useEffect(()=>{
     if(currentModuleCore?.trainingModules?.length>0){
         setTrainingModules(currentModuleCore.trainingModules);
     }
    },[]);

    useEffect(()=>{
        setFilteredData(trainingModules);
    },[trainingModules, isOpenSidebarAddSubjects]);

    const allSubjectsList = filteredData.map((s)=>(
        <>
        <FormControlLabel value={s._id}
                          className="mb-0"
                          control={<Radio style={{color:`rgba(82, 57, 112, 1)`}}/>}
                          label={s.name} />
            <FormHelperText className="mt-0 mb-3">
                {`${t("Estimated time")}: ${s?.estimatedTime??"-"} [h] | 
                ${t("Chapters")}: ${s?.chapters?.length} | ${t("Category")}: ${s?.category?.name??"-"}`}
            </FormHelperText>
        </>
    ));

    return(
        <SwipeableDrawer
            PaperProps={{
                style:{
                    backgroundColor: theme.palette.neutrals.white,
                    maxWidth:"450px"
            }}}
            style={{width:"600px"}}
            anchor="right"
            onOpen=''
            open={isOpenSidebarAddSubjects}
            onClose={()=>{
                setIsOpenSidebarAddSubjects(false);
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
                                    <Typography variant="h3" component="h2" className="mt-2 text-center text-justify mb-2" style={{fontSize:"28px"}}>   
                                        {t("Select base subject")}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} className=' mb-2'>
                                        <SearchField
                                            className="text-primary"
                                            value={searchingText}
                                            onChange={(e)=>{TableSearch(e.target.value, trainingModules, setSearchingText, setFilteredData)}}
                                            clearSearch={()=>TableSearch('', trainingModules, setSearchingText, setFilteredData)}
                                        />
                                </Grid>
                                {/*<Grid item xs={12} className="p-0">*/}
                                {/*    <Button size="small" variant="contained" color="primary" fullWidth*/}
                                {/*            onClick={()=>{setIsOpenSidebarAddSubjects(false)}}*/}
                                {/*    >{t("Add")}</Button>*/}
                                {/*</Grid>*/}
                            </Grid>    
                        </ListSubheader>}
            >
                <RadioGroup
                    className="pl-4"
                    aria-label="exams-list"
                    defaultValue=""
                    name="radio-buttons-group"
                    onChange={(e)=>{
                        handleAssignSubject(e.target.value);
                        setIsOpenSidebarAddSubjects(false);
                    }}
                >
                    {allSubjectsList}
                </RadioGroup>
            </List>
        </SwipeableDrawer>
    )
}