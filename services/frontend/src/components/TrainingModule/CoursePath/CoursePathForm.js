import React, { useEffect, useState } from "react";
import {Card, CardHeader} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import Typography from "@mui/material/Typography";
import CoursePathService from "services/course_path.service";
import ConfirmActionModal from "components/common/ConfirmActionModal";
import {useCoursePathContext} from "components/_ContextProviders/CoursePathProvider/CoursePathProvider";
import General from "./General/General";
import CoursesList from "./Courses/CoursesList";
import { ETabBar, ETab } from "new_styled_components";
import { new_theme } from "NewMuiTheme";
import { Divider } from "@mui/material";
import { ThemeProvider } from "@mui/material";
import StyledButton from "new_styled_components/Button/Button.styled";




export default function CoursePathForm() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState(0)
    const { F_showToastMessage,
            F_handleSetShowLoader,
            F_getErrorMessage,
            F_getHelper} = useMainContext();
    const {manageScopeIds, user} = F_getHelper();
    const [errorValidator, setErrorValidator]= useState({});
    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false, removeId: undefined});
    const {
        coursePathActionType,
        currentCoursePath,
        coursePathDispatch,
        editFormHelper,
        setEditFormHelper,
    } = useCoursePathContext();

    useEffect(() => {
        setActiveTab(0);
    }, [currentCoursePath?._id]);

    useEffect(() => {
        setErrorValidator({});
        F_handleSetShowLoader(true);
        if (editFormHelper.coursePathId !== "NEW") {
            CoursePathService.read(editFormHelper.coursePathId).then((res) => {
                if(res?.data && res?.status ===200){
                    coursePathDispatch({type: coursePathActionType.INIT, payload: res.data});
                    F_handleSetShowLoader(false);
                }
            }).catch(err=>console.log(err));
        }else{
            coursePathDispatch({type: coursePathActionType.NEW_TRAINING_PATH, payload: {
                    module: manageScopeIds.moduleId,
                    creator: user.id,
                }});
            F_handleSetShowLoader(false);
        }
    }, [editFormHelper.coursePathId, editFormHelper.isOpen]);



    useEffect(()=>{
        if(actionModal.returnedValue){
            remove(actionModal.removeId);
        }
    },[actionModal.returnedValue]);


    function save() {
        if(editFormHelper.coursePathId === 'NEW'){
            CoursePathService.create(currentCoursePath).then(res=>{
                if(res.status===200){
                    console.log("add:",res.data);
                    F_showToastMessage('Data was added','success');
                    setEditFormHelper({isOpen: false, openType: undefined, coursePathId: 'NEW'});
                    setErrorValidator({});
                }
            }).catch(err=>{
                if(activeTab !==0){setActiveTab(0)}
                setEditFormHelper(p=>({...p, openType: 'GENERAL'}))
                setErrorValidator(err.response.data.message.errors);
            })
        } else {
            CoursePathService.update(currentCoursePath).then(res=>{
                if(res.status===200){
                    console.log("update:",res.data);
                    F_showToastMessage('Data was updated','success');
                    setEditFormHelper({isOpen: false, openType: undefined, coursePathId: 'NEW'});
                    setErrorValidator({});
                }

            }).catch(err=>{
                if(activeTab !==0){setActiveTab(0)}
                setEditFormHelper(p=>({...p, openType: 'GENERAL'}))
                setErrorValidator(err.response.data.message.errors);
            })
        }
    }

    function remove(courseId) {
        console.log("remove",courseId)
        CoursePathService.remove(courseId).then(res=>{
            console.log("remove:",res.data);
            F_showToastMessage('Data was removed','success')
        });
        setEditFormHelper({isOpen: false, openType: undefined, coursePathId: 'NEW'});
    }

    return (
        <ThemeProvider theme={new_theme}>
            <Card sx={{boxShadow:'none'}}>
                
                <CardContent>
                    <Grid container>
                        <Grid item xs={12} >
                            <Grid item xs={12} className="admin_heading">
                                <Grid>
                                <Typography variant="h1" component="h1">{t("Course Path Name")}</Typography>
                                <Divider variant="insert" className='heading_divider' />
                                </Grid>
                            </Grid>
                            <Grid item xs={12} className="displayFlex content_tabing">
                                <ETabBar
                                    style={{ minWidth: "280px" }}
                                    value={activeTab}
                                    onChange={(e,i)=>setActiveTab(i)}
                                    textColor="primary"
                                    variant="fullWidth"
                                    aria-label="tabs example"
                                    className="tab_style"
                                >
                                    <ETab label={t("General Information")} eSize='small' onClick={() => {setEditFormHelper(p=>({...p, openType: 'GENERAL'}))}}/>
                                    <ETab label={t("Path Content")} eSize='small' onClick={() => {setEditFormHelper(p=>({...p, openType: 'PATH'}))}}/>
                                </ETabBar>
                            </Grid>
                            <Grid item xs={12} className="d-flex flex-column">
                                {editFormHelper.openType === 'GENERAL' && (<General errorValidator={errorValidator}/>)}
                                {editFormHelper.openType === 'PATH' && (<CoursesList/>)}
                            </Grid>
                            <Grid item xs={12} className="grid-width">
                                <div className="userbtn btn-flex btn-grid-mb">
                                    <StyledButton eVariant="secondary" eSize="medium" 
                                    onClick={() => {
                                        F_showToastMessage("No change");
                                        setEditFormHelper({isOpen: false, openType: undefined, coursePathId: 'NEW'});
                                        setErrorValidator({});
                                    }}
                                    
                                    >{t("Back")}</StyledButton>
                                    {editFormHelper.coursePathId !== 'NEW' && (
                                    <StyledButton eVariant="primary" eSize="medium" className="submitBtn"
                                        onClick={() => setActionModal({isOpen: true, returnedValue: false, removeId: currentCoursePath._id})}
                                    >
                                        {t("Remove")}
                                    </StyledButton>
                                    )}

                                    <StyledButton eVariant="primary" eSize="medium" className="submitBtn" 
                                    onClick={save}
                                    >{t("Submit")}</StyledButton>
                                </div>
                            </Grid>
                        </Grid>



                        
                    
                    </Grid> 

                </CardContent>

                {/* <ETabBar className="d-flex flex-fill justify-content-center mb-3"
                        style={{maxWidth:'400px'}}
                        eSize='small'
                        value={activeTab}
                        onChange={(e,i)=>setActiveTab(i)}
                    >
                        <ETab label='General information' style={{minWidth:'50px'}} eSize='small' onClick={() => {setEditFormHelper(p=>({...p, openType: 'GENERAL'}))}}/>
                        <ETab label='Path content' style={{minWidth:'50px'}} eSize='small' onClick={() => {setEditFormHelper(p=>({...p, openType: 'PATH'}))}}/>
                </ETabBar>
                    <Grid container spacing={1}>
                        <Grid item xs={12} className="d-flex flex-column">
                            {editFormHelper.openType === 'GENERAL' && (<General errorValidator={errorValidator}/>)}
                            {editFormHelper.openType === 'PATH' && (<CoursesList/>)}
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActionArea>
                    <CardActions className="d-flex justify-content-between align-items-center mb-2">
                        <Grid container>
                            <Grid item xs={6}>
                                <Button variant="contained" size="small" color="secondary"
                                    onClick={() => {
                                        F_showToastMessage("No change");
                                        setEditFormHelper({isOpen: false, openType: undefined, coursePathId: 'NEW'});
                                        setErrorValidator({});
                                    }}
                                >{t("Dismiss")}</Button>
                            </Grid>
                            <Grid item xs={6} className="p-0 d-flex justify-content-end">
                                {editFormHelper.coursePathId !== 'NEW' && (
                                    <Button variant="contained" size="small" color="inherit"
                                        onClick={() => setActionModal({isOpen: true, returnedValue: false, removeId: currentCoursePath._id})}
                                    >{t("Remove")}</Button>
                                )}
                                <Button size="small" variant="contained" color="primary"
                                        className="ml-5" onClick={save}
                                >{t("Save")}</Button>
                            </Grid>
                        </Grid>
                    </CardActions>
                </CardActionArea> */}
                <ConfirmActionModal actionModal={actionModal}
                                    setActionModal={setActionModal}
                                    actionModalTitle={t("Removing training path")}
                                    actionModalMessage={t("Are you sure you want to remove this training path? The action is not reversible!")}
                />
            </Card>
        </ThemeProvider>
    );
}
