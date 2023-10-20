import React, {useEffect, useState} from "react";
import Grid from "@mui/material/Grid";
import { Paper } from "@mui/material";
import CourseService from "services/course.service"
import CoursesTable from "./CoursesTable";
import CourseForm from "./CourseForm";
import {useTranslation} from "react-i18next";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {useCourseContext} from "components/_ContextProviders/CourseProvider/CourseProvider";
import StyledButton from "new_styled_components/Button/Button.styled";
import {useParams} from "react-router-dom";
import Container from '@mui/material/Container';
import { Divider } from "@mui/material";
import { Typography, ThemeProvider } from "@mui/material";
import { new_theme } from "NewMuiTheme";
import './Courses.scss'

export default function CoursesList(){
    const {t} = useTranslation();
    const { courseId } = useParams()
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
    } = useCourseContext();

    const [courses, setCourses] = useState([]);

    useEffect(()=>{
        setMyCurrentRoute("Course");
        F_handleSetShowLoader(true);
        CourseService.readAll().then(res=>{
            if(res.status === 200){
                if(res.data){
                    setCourses(res.data)
                    F_handleSetShowLoader(false);
                }
            }else{
                F_showToastMessage(F_getErrorMessage({response:res}));
            }
        }).catch(error=>{
            console.error(error);
            F_showToastMessage(F_getErrorMessage({response:{status: 500}}),"error");
            F_handleSetShowLoader(false);
        })
    },[editFormHelper.isOpen]);

    useEffect(()=>{
        if(courseId){
            setEditFormHelper({isOpen: true, openType:'GENERAL' , courseId})
        }
    },[courseId]);

    return(
        <ThemeProvider theme={new_theme}>
            <Container maxWidth="xl" className="mainContainerDiv Course_Module">
                <div className="admin_content">




                    <Grid container spacing={2} >
                        {editFormHelper.isOpen ? 
                            
                            <>
                                <Grid item xs={12} >
                                    <CourseForm />
                                </Grid>
                            </>
                            
                            :

                            <>
                                <Grid item xs={12} md={12} >
                                    <div className="admin_heading">
                                        <Grid>
                                            <Typography variant="h1" className="typo_h5">{t("Courses")}</Typography>
                                            <Divider variant="insert" className='heading_divider' />
                                        </Grid>
                                        <div className="heading_buttons">
                                            <div className="pri-btn-wrap">
                                                <StyledButton eVariant="primary" eSize="large" component="span"
                                                    // disabled={editFormHelper.isOpen}
                                                    onClick={()=>{
                                                        if (F_hasPermissionTo('create-course')) setEditFormHelper({isOpen: true, openType:'GENERAL' , courseId: 'NEW'})
                                                        else F_showToastMessage(t('You do not have permission to create new course'))
                                                    }}
                                                    >{t("New Course")}
                                                </StyledButton>
                                            </div>
                                        </div>
                                    </div>
                                    <CoursesTable courses={courses}/>
                                </Grid>
                                    
                                

                            </>

                        }
                        
                        
                    </Grid>






                </div>
            </Container>
        </ThemeProvider>
    )
}