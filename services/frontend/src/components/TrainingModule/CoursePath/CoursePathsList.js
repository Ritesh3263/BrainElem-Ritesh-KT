import React, {useEffect, useState} from "react";
import Grid from "@mui/material/Grid";
import {Paper} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {useCoursePathContext} from "components/_ContextProviders/CoursePathProvider/CoursePathProvider";
import CoursePathService from "services/course_path.service";
import CoursePathTable from "./CoursePathTable";
import CoursePathForm from "./CoursePathForm";
import { Divider } from "@mui/material";
import { Typography, ThemeProvider } from "@mui/material";
import { new_theme } from "NewMuiTheme";
import StyledButton from "new_styled_components/Button/Button.styled";
import Container from '@mui/material/Container';
import "./CoursePath.scss"



export default function CoursePathsList(){
    const {t} = useTranslation();
    const {
        setMyCurrentRoute,
        F_handleSetShowLoader,
        F_getErrorMessage,
        F_showToastMessage,
        F_hasPermissionTo,
    } = useMainContext();
    const {
        editFormHelper,
        setEditFormHelper,
    } = useCoursePathContext();
    const [coursePaths,setCoursePaths]=useState([]);

    useEffect(()=>{
        setMyCurrentRoute("Course path");
        F_handleSetShowLoader(true);
        CoursePathService.readAll().then(res=>{
            if(res.status === 200){
                if(res.data){
                    setCoursePaths(res.data);
                    F_handleSetShowLoader(false);
                }
            }else{
                F_showToastMessage(F_getErrorMessage({response:res}));
            }
        }).catch(error=>{
            console.error(error);
            F_showToastMessage(F_getErrorMessage({response:{status: 500}}),"error");
            F_handleSetShowLoader(false);
        });
    },[editFormHelper.coursePathId, editFormHelper.isOpen]);

    return(
        <ThemeProvider theme={new_theme}>
            <Container maxWidth="xl" className="mainContainerDiv CoursePath_Module">
                <div className="admin_content">
                    <Grid container spacing={2} >

                        {editFormHelper.isOpen ? 
                            
                            <>
                                <Grid item xs={12} >
                                    <CoursePathForm />
                                </Grid>
                            </>
                            
                            :

                            <>
                                <Grid item xs={12} md={12}>
                                    <div className="admin_heading">
                                        <Grid>
                                            <Typography variant="h1" className="typo_h5">{t("Course-Path")}</Typography>
                                            <Divider variant="insert" className='heading_divider' />
                                        </Grid>
                                        <div className="heading_buttons">
                                            <div className="pri-btn-wrap">
                                                <StyledButton className="w-100-mb" eVariant="primary" eSize="large" component="span"
                                                    disabled={editFormHelper.isOpen}
                                                    onClick={()=>{
                                                        if (F_hasPermissionTo('create-course-path')) setEditFormHelper({isOpen: true, openType:'GENERAL' , coursePathId: 'NEW'})
                                                        else F_showToastMessage("You don't have permission to create new course path", "error")
                                                    }}>
                                                    {t("New Course Path")}
                                                </StyledButton>
                                            </div>
                                        </div>
                                    </div>
                                    <CoursePathTable coursePaths={coursePaths}/>
                                </Grid>
                            </>
                        }
                    </Grid>










                    {/* <Grid item xs={12}>
                            <Grid item xs={12} lg={editFormHelper.isOpen ? 6 : 12}>
                                        <div className="d-flex pt-2 px-2 mb-3 justify-content-between">
                                            <StyledButton size="small" variant="contained" color="primary"
                                                    disabled={editFormHelper.isOpen}
                                                    onClick={()=>{
                                                        if (F_hasPermissionTo('create-course-path')) setEditFormHelper({isOpen: true, openType:'GENERAL' , coursePathId: 'NEW'})
                                                        else F_showToastMessage("You don't have permission to create new course path", "error")
                                                    }}
                                            >{t("Add new course path")}</StyledButton>
                                        </div>
                                        <CoursePathTable coursePaths={coursePaths}/>
                            </Grid>

                        <Grid item xs={12} lg={(editFormHelper.openType !== 'PTAH?') ? 6 : 12} hidden={!editFormHelper.isOpen}>
                            <Paper elevation={10} className="p-0">
                                <CoursePathForm />
                            </Paper>
                        </Grid>
                    </Grid> */}
                </div>
            </Container>
        </ThemeProvider>
    )
}