import React, {useEffect, useState} from "react";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import {List} from "@mui/material";
import {Checkbox, FormControlLabel, FormGroup, ListSubheader, Paper} from "@mui/material";
import Grid from '@mui/material/Grid';
import SearchField from "../../../common/Search/SearchField";
import {useTranslation} from "react-i18next";
import TableSearch from "../../../common/Table/TableSearch";
import {useCoursePathContext} from "../../../_ContextProviders/CoursePathProvider/CoursePathProvider";
import CourseService from "../../../../services/course.service";
import {useMainContext} from "../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import Typography from "@mui/material/Typography";
import { theme } from "../../../../MuiTheme";
import { Divider } from "@mui/material";
import { new_theme } from "NewMuiTheme";


export default function AddCourse({isOpenSidebarAddContent, setIsOpenSidebarAddContent}){
    const {t} = useTranslation();
    const [searchingText, setSearchingText] = useState('');
    const [filteredData,setFilteredData] = useState([]);
    const [openIndex, setOpenIndex] = useState(undefined);

    const [courses, setCourses]=useState([]);


    const {F_showToastMessage, F_handleSetShowLoader,F_getErrorMessage} = useMainContext();
    /** coursePathContext **/
    const {
        currentCoursePath,
        coursePathActionType,
        coursePathDispatch,
    } = useCoursePathContext();
    /**-------------------------------------------------------------**/

    useEffect(()=>{
        CourseService.readAll().then(res=>{
            if(res.status === 200 && res.data){
                    updateSelected(res.data);
                    F_handleSetShowLoader(false);
            }else{
                F_showToastMessage(F_getErrorMessage({response:res}));
            }
        }).catch(error=>{
            console.error(error);
            F_showToastMessage(F_getErrorMessage({response:{status: 500}}),"error");
            F_handleSetShowLoader(false);
        })
    },[currentCoursePath]);

    useEffect(()=>{
        setFilteredData(courses);
    },[courses]);


    const updateSelected=(couItems=[])=>{
        let selectedList = couItems?.map(co=>{
            currentCoursePath?.courses?.map(chC=>{
                if(co._id === chC._id){
                    co.isSelected = true;
                }
            })
            return co;
        });
        setCourses(selectedList);
    };

    const allCoursesList = filteredData.map((course,index)=>(
        <FormControlLabel
            label={<div><span>{course?.name}</span><span className="text-muted ml-4">{t("Level")} {`:  ${course?.level??"-"}`}</span></div>}
            control={
                <Checkbox style={{color: new_theme.palette.newSupplementary.NSupText}}
                    checked={!!course?.isSelected}
                    name={course?.name}
                    value={index}
                    onChange={(e,isS)=>{
                        if(isS){
                            coursePathDispatch({
                                type: coursePathActionType.UPDATE_CONTENTS,
                                payload: {type: 'ADD', course}
                            });
                        }else{
                            coursePathDispatch({
                                type: coursePathActionType.UPDATE_CONTENTS,
                                payload: {type: 'REMOVE', courseId: course._id}
                            });
                        }
                    }}
                />
            }
        />
    ));

    return(
        <SwipeableDrawer
            PaperProps={{
                style:{
                    backgroundColor: theme.palette.neutrals.white,
                    maxWidth:"450px"
            }}}
            anchor="right"
            // onOpen=""
            onOpen={()=>{
                // setIsOpenSidebarAddContent(true);
                // setOpenIndex(undefined);
                // setSearchingText('');
            }}
            
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
                        <Grid container style={{backgroundColor: new_theme.palette.primary.PWhite}} className="py-2">
                        <Grid item xs={12}>
                            <Typography variant="h3" component="h2" className="text-left text-justify mt-2" style={{fontSize:"34px", color:new_theme.palette.primary.MedPurple}}>
                                {t("Select courses")}
                            </Typography>
                            <Divider variant="insert" className='heading_divider' />

                        </Grid>
                            <Grid item xs={12} style={{marginTop:20}}>
                                <SearchField
                                    className="text-primary"
                                    value={searchingText}
                                    onChange={(e)=>{TableSearch(e.target.value, courses, setSearchingText, setFilteredData)}}
                                    clearSearch={()=>TableSearch('', courses, setSearchingText, setFilteredData)}
                                />
                            </Grid>
                        </Grid>
                    </ListSubheader>}
            >
                <FormGroup className="pl-3">
                        {(allCoursesList?.length>0) ? allCoursesList : <span>{t("No data")}</span>}
                </FormGroup>
            </List>
        </SwipeableDrawer>
    )
}