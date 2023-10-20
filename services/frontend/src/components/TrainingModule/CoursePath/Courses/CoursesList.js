import React, {lazy, useEffect, useState} from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {useTranslation} from "react-i18next";
import Button from "@mui/material/Button";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {useCoursePathContext} from "components/_ContextProviders/CoursePathProvider/CoursePathProvider";
import CourseTable from "./CoursesTable";
import {EButton} from "../../../../styled_components";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import StyledButton from "new_styled_components/Button/Button.styled";
import { new_theme } from "NewMuiTheme";
import { ThemeProvider } from "@mui/material";
import {Divider} from "@mui/material";



const AddCourse = lazy(()=>import("./AddCourse"));
const AddCertificate = lazy(()=>import("./AddCertificate"));
const AddInternship = lazy(()=>import("./AddInternship"));


export default function CoursesList(){
    const { t } = useTranslation();
    const {F_showToastMessage} = useMainContext();
    const [isOpenSidebarAddContent, setIsOpenSidebarAddContent] = useState(false);
    const [isOpenSidebarAddCertificate, setIsOpenSidebarAddCertificate] = useState(false);
    const [isOpenSidebarAddInternship, setIsOpenSidebarAddInternship] = useState(false);
    const [filteredData,setFilteredData] = useState([]);

    /** coursePathContext ------------------------------------------**/
    const {
        currentCoursePath,
        coursePathDispatch,
        coursePathActionType,
    } = useCoursePathContext();
    /**-------------------------------------------------------------**/


    const removeCourseHandler=(courseId)=>{
        if(courseId){
            let filtered = currentCoursePath?.courses?.filter(cou=> cou._id !== courseId);
            if(filtered){
                coursePathDispatch({type: coursePathActionType.UPDATE_CONTENTS_DND, payload: filtered});
            }
        }
    }

    const allCoursesList = filteredData.map((course,index)=>(
        <FormControlLabel
            label={<div><span>{course?.name}</span><span className="text-muted ml-4">{t("Level")} {`:  ${course?.level??"-"}`}</span></div>}
            control={
                <Checkbox style={{color: new_theme.palette.secondary.DarkPurple}}
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
        <ThemeProvider theme={new_theme}>
            <Grid item xs={12}>
                <div className="admin_content" style={{ paddingTop: "0" }}>
                
                    <Grid item xs={12} sx={{ mt: 1 }}>

                        <Grid container className="account-grid" >

                            <Grid item xs={12} sx={{ mt: 3 }} >
                                <Grid item xs={12} >
                                    <Typography variant="h2" component="h2" style={{ color: new_theme.palette.newSupplementary.NSupText }}>{t("Add Courses")}</Typography>
                                </Grid>
                                <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Divider variant="insert" sx={{ mb: 4, my: 2 }} />
                                </Grid>

                                <StyledButton   eVariant="primary" eSize="small" component="span" style={{display:'table', marginLeft:'auto'}}
                                    onClick={()=>setIsOpenSidebarAddContent(true)}
                                >{t("Add Course")}
                                </StyledButton>
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 3 }} >
                                <Grid item xs={12} >
                                    <Typography variant="h2" component="h2" style={{ color: new_theme.palette.newSupplementary.NSupText }}>{t("Add Certificate")}</Typography>
                                </Grid>
                                <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Divider variant="insert" sx={{ mb: 4, my: 2 }} />
                                </Grid>

                                <StyledButton   eVariant="primary" eSize="small" component="span" style={{display:'table', marginLeft:'auto'}}
                                    onClick={()=>setIsOpenSidebarAddCertificate(true)}
                                >{t("Add Certificate")}
                                </StyledButton>
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 3 }} >
                                <Grid item xs={12} >
                                    <Typography variant="h2" component="h2" style={{ color: new_theme.palette.newSupplementary.NSupText }}>{t("Add Internship")}</Typography>
                                </Grid>
                                <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Divider variant="insert" sx={{ mb: 4, my: 2 }} />
                                </Grid>

                                <StyledButton   eVariant="primary" eSize="small" component="span" style={{display:'table', marginLeft:'auto'}}
                                    onClick={()=>setIsOpenSidebarAddInternship(true)}
                                >{t("Add Internship")}
                                </StyledButton>
                            </Grid>
                            



                            <Grid className="table-overflow" item xs={12} sx={{mt:5}}>
                                <Grid container className="tbl-width-200">
                                    <Grid item xs={1} className="table-header" >
                                        {t("ID")}
                                    </Grid>
                                    <Grid item xs={4} className="table-header" >
                                        {t("NAME")}
                                    </Grid>
                                    <Grid item xs={2} className="table-header" >
                                        {`${t("LEVEL")}`}
                                    </Grid>
                                    <Grid item xs={2} className="table-header">
                                        {t("TYPE")}
                                    </Grid>
                                    <Grid item xs={1} className="table-header-last" >
                                        {t("ACTIONS")}
                                    </Grid>
                                    <Grid item xs={12} className="mt-1 p-0">
                                        <CourseTable removeCourseHandler={removeCourseHandler} />
                                    </Grid>
                                </Grid>
                            </Grid>





                        </Grid>
                    </Grid>
                </div>




                {<AddCourse isOpenSidebarAddContent={isOpenSidebarAddContent} setIsOpenSidebarAddContent={setIsOpenSidebarAddContent}/>}
                {<AddCertificate isOpenSidebarAddCertificate={isOpenSidebarAddCertificate} setIsOpenSidebarAddCertificate={setIsOpenSidebarAddCertificate}/>}
                {<AddInternship isOpenSidebarAddInternship={isOpenSidebarAddInternship} setIsOpenSidebarAddInternship={setIsOpenSidebarAddInternship}/>}

            </Grid>



                {/* <Grid item xs={12}>
                    <Paper elevation={12}>
                        <Grid container spacing={1}>
                            <Grid item xs={12} className="d-flex justify-content-center align-items-center mt-2">
                                <Typography variant="h6" component="h2" className="text-left" >
                                    {t("Manage courses")}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6} lg={4}>
                                <EButton style={{minWidth:"100px"}}
                                        eSize="small" eVariant="secondary"
                                        fullWidth={true}
                                        startIcon={<AddCircleOutlineIcon/>}
                                        onClick={()=>setIsOpenSidebarAddContent(true)}
                                >{t("Add course")}</EButton>
                            </Grid>
                            <Grid item xs={12} md={6} lg={4}>
                                <EButton style={{minWidth:"100px"}}
                                        eSize="small" eVariant="secondary"
                                        fullWidth={true}
                                        startIcon={<AddCircleOutlineIcon/>}
                                        onClick={()=>setIsOpenSidebarAddCertificate(true)}
                                >{t("Add certificate")}</EButton>
                            </Grid>
                            <Grid item xs={12} md={6} lg={4}>
                                <EButton  style={{minWidth:"100px"}}
                                        eSize="small" eVariant="secondary"
                                        fullWidth={true}
                                        startIcon={<AddCircleOutlineIcon/>}
                                        onClick={()=>setIsOpenSidebarAddInternship(true)}
                                >{t("Add internship")}</EButton>
                            </Grid>
                            <Grid item xs={12} className="mt-3">
                                <Grid container>
                                    <Grid item xs={1} >
                                        {t("")}
                                    </Grid>
                                    <Grid item xs={1} className="pl-1" >
                                        {t("Id")}
                                    </Grid>
                                    <Grid item xs={5} className="pl-1" >
                                        {t("Name")}
                                    </Grid>
                                    <Grid item xs={2} className="pl-1" >
                                        {`${t("Level")}`}
                                    </Grid>
                                    <Grid item xs={2} className="pl-1" style={{textOverflow: "ellipsis", overflow: 'hidden'}}>
                                        {t("Type")}
                                    </Grid>
                                    <Grid item xs={1} className="d-flex justify-content-center">
                                        <RemoveCircleOutlineIcon/>
                                    </Grid>
                                    <Grid item xs={12} className="mt-1 p-0">
                                        <CourseTable removeCourseHandler={removeCourseHandler} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid> */}
        </ThemeProvider>
    )
}