import {Col, ListGroup, Row} from "react-bootstrap";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from '@material-ui/core/CardHeader';
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import { Paper} from "@material-ui/core";
import HourglassFullIcon from "@material-ui/icons/HourglassFull";
import CloudDoneIcon from "@material-ui/icons/CloudDone";
import CloudOffIcon from "@material-ui/icons/CloudOff";
import CourseService from "services/course.service"
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
// import DisplayCourse from "components/Course/Display/DisplayCourse"; // TO DO
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import {useTranslation} from "react-i18next";
import {ETabBar, ETab, EButton} from "styled_components";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {Box} from "@mui/material";

// MUIv5
import SvgIcon from "@material-ui/core/SvgIcon";

//Icons
import { ReactComponent as DeleteIcon } from 'icons/icons_32/Delete_32.svg';

const useStyles = makeStyles(theme=>({}))

export default function AcceptingLibraryCourse(){
    const { t } = useTranslation();
    const {F_showToastMessage, F_getHelper} = useMainContext();
    const {userPermissions, manageScopeIds} = F_getHelper();
    const classes = useStyles();
    const navigate = useNavigate();
    const { courseId } = useParams();
    const [course, setCourse] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isAlreadyAccepted, setIsAlreadyAccepted] = useState();
    const [isAlreadyRejected, setIsAlreadyRejected] = useState();
    const [toBeArchived, setToBeArchived] = useState();
    const [currentTab, setCurrentTab] = useState(0);
    useEffect(()=>{
        
        CourseService.getCourse(courseId).then(res=>{
            if(res.data){
                setCourse(res.data);
                if(res.data.archiveCourseFromLibraryRequested === true){ // if removal requested
                    setIsAlreadyAccepted(true)
                    setIsAlreadyRejected(true)
                    setToBeArchived(true)                    
                }
                else{ // if NO removal requested
                    if(res.data.libraryStatus === "ACCEPTED"){
                        setIsAlreadyAccepted(true)
                    }
                    else if (res.data.libraryStatus === "REJECTED"){
                        setIsAlreadyRejected(true)
                    }
                    else{
                        setIsAlreadyAccepted(false)
                        setIsAlreadyRejected(false)
                    } 
                }
            }
        }).catch(err=>console.log(err))
        setTimeout(()=>{
            setIsOpen(true);
        },500);

        },[]);

    
    function switchStatus(libraryStatus){
        switch (libraryStatus) {
            case "AWAITING":{
                return (<span className="text-muted"><HourglassFullIcon /></span>);
            }
            // case "UPLOADED":{
            //     return (<span className="text-warning"><CloudUploadIcon/></span>);
            // }
            case "ACCEPTED":{
                return (<span className="text-success"><CloudDoneIcon/></span>);
            }
            case "REJECTED":{
                return (<span className="text-danger"><CloudOffIcon/></span>);
            }
            default :{
                return (<span>-</span>);
            }
        }
    };

    async function changeCourseStatus(type){
        if(type === "accept"){
            await setCourse(p=>{
                let val = Object.assign({},p);
                val.libraryStatus = "ACCEPTED"
                return val;
            })
        }else if(type === "reject"){
            await setCourse(p=>{
                let val = Object.assign({},p);
                val.libraryStatus = "REJECTED"
                return val;
            })
        } else if(type === "archive"){
            await setCourse(p=>{
                let val = Object.assign({},p);
                val.archivedByLibrarian = true;
                return val;
            })
        }
    }

    function editCourse(){
        window.localStorage.setItem(course.courseType, JSON.stringify(course));
        navigate(`/edit-${course.courseType.toLowerCase()}/${courseId}`)
    }

    async function actionType(type){
        await changeCourseStatus(type).then(()=>{
            switch (type){
                case "accept":{
                    let newCourse = {...course,libraryStatus: "ACCEPTED"}
                        CourseService.manageCourseStatus(newCourse).then(res=>{
                            F_showToastMessage(res.data.message,"success");
                            navigate("/accepting-library-course")
                        }).catch(err=>console.error(err))
                    break;
                }
                case "reject":{
                    let newCourse = {...course,libraryStatus: "REJECTED"}
                    CourseService.manageCourseStatus(newCourse).then(res=>{
                        F_showToastMessage(res.data.message,"success");
                        navigate("/accepting-library-course")
                    }).catch(err=>console.error(err))
                    break
                }
                case "archive":{
                    let newCourse = {...course,archivedByLibrarian: true}
                    CourseService.manageCourseStatus(newCourse).then(res=>{
                        F_showToastMessage(res.data.message,"success");
                        navigate("/accepting-library-course")
                    }).catch(err=>console.error(err))
                    break
                }
                default: break;
            }
        })
    }

return(
    <Box sx={{height: {xs: '65%', sm: "70%", md: "80%", "lg": '85%', 'xl': '88%'}}} className="p-0 fluid m-0">
        <ListGroup>
                <Card className="p-3 mb-2">
                    <Grid container>
                        <Grid item xs={12} sm={6} lg={4}>
                            <EButton eSize="small" eVariant="primary"
                                     startIcon={<KeyboardArrowLeftIcon/>}
                                     onClick={()=>{navigate("/accepting-library-course")}}
                            >{t("Back to list")}</EButton>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4}>
                            <Grid container>
                                <Grid item xs={12} md={6} className="d-flex justify-course-center p-2">
                                    <span>{t("Library status")}: {switchStatus(course.libraryStatus)} <strong>{t(course.libraryStatus)}</strong></span>
                                </Grid>
                                <Grid item xs={12} md={6} className="d-flex justify-course-center p-2">
                                    <span>{t("Author")}: <strong>{course.owner ? course.owner.name+" "+course.owner.surname : "-"}</strong></span>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} lg={4} className="d-flex justify-course-end align-items-center">
                            <div>
                                {!toBeArchived ? ( <>
                                <Button className="mr-5"
                                        startIcon={<ClearIcon/>}
                                        variant="contained" size="small" color="inherit"
                                        disabled = {(isAlreadyRejected || userPermissions.isInspector) ? true : false}
                                        onClick={()=>actionType("reject").then()}
                                >{t("Reject")}</Button>
                                <Button size="small" variant="contained" color="primary"
                                        startIcon={<CheckIcon/>}
                                        disabled = {(isAlreadyAccepted || userPermissions.isInspector) ? true : false}
                                        onClick={()=>actionType("accept")}
                                >{t("Accept")}</Button>
                                </>) : (
                                <Button size="small" variant="contained" color="primary"
                                        startIcon={<SvgIcon viewBox="0 0 32 32" component={DeleteIcon} title={t("Course to be archived")} />}
                                        disabled = {(toBeArchived) ? false : true}
                                        onClick={()=>actionType("archive")}
                                >{t("Archive")}</Button>
                                )}
                            </div>
                        </Grid>
                    </Grid>
                </Card>
        </ListGroup>
        {/* <DisplayCourse isPreview={true} show={isOpen} hideTopBar={true} showSettingsTab={true}></DisplayCourse> */}

    </Box>
)
}