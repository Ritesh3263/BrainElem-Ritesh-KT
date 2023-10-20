import React, { useEffect, useState } from "react";
import {Card, CardHeader, FormHelperText, CardContent,CardActionArea,CardActions,Grid,Button,
  TextField, FormControl,InputLabel,Select,Typography,MenuItem} from "@mui/material";
import ConfirmActionModal from "components/common/ConfirmActionModal";
import CommonImageUpload from "components/common/Image";
import { useTranslation } from "react-i18next";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {useCourseContext} from "components/_ContextProviders/CourseProvider/CourseProvider";
import { ETab, ETabBar } from "styled_components";
import CourseService from "services/course.service";
import moduleCoreService from "services/module-core.service";
import ChaptersList from "./Chapters/ChaptersList";
import { new_theme } from "NewMuiTheme";
import { Divider } from "@mui/material";
import {useNavigate} from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import StyledButton from "new_styled_components/Button/Button.styled";



const levels =["BEGINNER", "INTERMEDIATE", "ADVANCED"];

export default function CourseForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { F_showToastMessage,
          F_handleSetShowLoader,
          F_getErrorMessage,
          F_getHelper} = useMainContext();
  const {manageScopeIds, user} = F_getHelper();
  const [activeTab, setActiveTab] = useState(0);
  const [categories, setCategories] = useState([]);
  const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false, removeId: undefined});
  const [errorValidator, setErrorValidator]= useState({});
  const {
    courseReducerActionType,
    editFormHelper,
    setEditFormHelper,
    currentCourse,
    courseDispatch,
    setTrainingModules,
    setIsOpenEditChapterForm,
  } = useCourseContext();

  useEffect(()=>{
    F_handleSetShowLoader(true);
    setErrorValidator({});
    moduleCoreService.readModuleCore(manageScopeIds.moduleId).then(res=>{
      if(res.status === 200){
        if(res.data.trainingPaths){
          setTrainingModules(res.data.trainingModules);
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
  },[]);


  useEffect(() => {
    CourseService.getCategoryRefsFromModule().then((res) => {
        setCategories(res.data);
        });
  }, []);

  useEffect(() => {
    if (editFormHelper.courseId !== "NEW") {
      CourseService.read(editFormHelper.courseId).then((res) => {
        if(res?.data && res.status ===200){
          // console.log("fff",res.data)
          courseDispatch({type: courseReducerActionType.INIT, payload: res.data});
        }
      })
    }else{
      courseDispatch({type: courseReducerActionType.NEW_COURSE, payload: {
        module: manageScopeIds.moduleId,
        creator: user.id,
      }});
    }
    setActiveTab(0);
  }, [editFormHelper.courseId, editFormHelper.isOpen]);

  useEffect(()=>{
    if(actionModal.returnedValue){
      remove(actionModal.removeId);
    }
  },[actionModal.returnedValue]);

  const setImageHandler=(data)=>{
    courseDispatch({type: courseReducerActionType.BASIC_UPDATE, payload: {
        field: 'image',
        value: data,
      }});
  }

  function save() {
    console.log("save");
    if(editFormHelper.courseId === 'NEW'){
      CourseService.create(currentCourse).then(res=>{
        if(res.status===200){
          setIsOpenEditChapterForm({isOpen: false, chapterId: undefined});
          setEditFormHelper({isOpen: false, openType: undefined, courseId: 'NEW'});
          console.log("add:",res.data);
          F_showToastMessage('Data was added','success');
          setErrorValidator({});
          navigate("/courses");
        }
      }).catch(err=>{
        setErrorValidator(err.response.data.message.errors);
      })
    } else {
      CourseService.update(currentCourse).then(res=>{
        if(res.status===200){
          setIsOpenEditChapterForm({isOpen: false, chapterId: undefined});
          setEditFormHelper({isOpen: false, openType: undefined, courseId: 'NEW'});
          console.log("update:",res.data);
          F_showToastMessage('Data was updated','success');
          setErrorValidator({});
          navigate("/courses");
        }
      }).catch(err=>{
        setErrorValidator(err.response.data.message.errors);
      })
    }
  }

  function remove(courseId) {
    CourseService.remove(courseId).then(res=>{
      console.log("remove:",res.data);
      F_showToastMessage('Data was removed','success')
    });
    setEditFormHelper({isOpen: false, openType: undefined, courseId: 'NEW'});
    setIsOpenEditChapterForm({isOpen: false, chapterId: undefined});
    navigate("/courses");
  }

  const categoriesList = categories.map((item, index) => (
    <MenuItem key={item._id} value={item}>
      {item.name}
    </MenuItem>
  ));


  return (
    <ThemeProvider theme={new_theme}>

    <Card sx={{boxShadow:'none'}}>

      <CardContent sx={{boxShadow:'none'}}>
        <Grid container>
          <Grid item xs={12} className='permisionForm-grid'>
            <Grid container className="permisionForm">
              <Grid item xs={12} sx={{ mb: 4 }}>
                <Typography variant="h1" component="h1">{t("Course Name")}</Typography>
                <Divider variant="insert" className='heading_divider' />
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
                      <ETab label={t("General Information")} eSize='small' />
                      <ETab label={t("Content Materials")} eSize='small' />
                  </ETabBar>

              </Grid>
              <Grid item xs={12}>
                    {activeTab === 0 && (
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <TextField
                              variant="filled"
                              error={'name' in errorValidator}
                              helperText={'name' in errorValidator && 'required'}
                              label="name"
                              name='name'
                              fullWidth={true}
                              style={{ minWidth: "200px" }}
                              margin="dense"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              value={currentCourse.name}
                              onChange={(e) =>{
                                courseDispatch({type: courseReducerActionType.BASIC_UPDATE, payload: {
                                    field: e.target.name, value: e.target.value
                                  }});
                              }}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <FormControl style={{ minWidth: "200px" }} margin="dense" variant="filled" fullWidth={true}>
                            <InputLabel id="demo-simple-select-label">{t('Category')}</InputLabel>
                            <Select
                                error={'category' in errorValidator}
                                helperText={"test"}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name='category'
                                value={currentCourse.category}
                                renderValue={p=> p.name}
                                //input={<Input />}
                                onChange={(e) =>{
                                  courseDispatch({type: courseReducerActionType.BASIC_UPDATE, payload: {
                                      field: e.target.name, value: e.target.value
                                    }});
                                }}
                            >
                              {categoriesList}
                            </Select>
                            {'category' in errorValidator ? (<FormHelperText className="text-danger">{t("required")}</FormHelperText>) : null}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                              variant="filled"
                              label="Short description"
                              name='description'
                              style={{ minWidth: "200px" }}
                              margin="dense"
                              fullWidth={true}
                              multiline={true}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              value={currentCourse.description}
                              onChange={(e) =>{
                                courseDispatch({type: courseReducerActionType.BASIC_UPDATE, payload: {
                                    field: e.target.name, value: e.target.value
                                  }});
                              }}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <FormControl style={{ minWidth: "200px" }} margin="dense" variant="filled" fullWidth={true}>
                            <InputLabel id="demo-simple-select-label">{t('Level')}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name='level'
                                value={currentCourse.level}
                                error={'level' in errorValidator}
                                // renderValue={p=> p.name}
                                //input={<Input />}
                                onChange={(e) =>{
                                  courseDispatch({type: courseReducerActionType.BASIC_UPDATE, payload: {
                                      field: e.target.name, value: e.target.value
                                    }});
                                }}
                            >
                              {levels.map((item, index) => (<MenuItem key={index+1} value={item}>{item}</MenuItem>))}
                            </Select>
                            {'level' in errorValidator ? (<FormHelperText className="text-danger">{t("required")}</FormHelperText>) : null}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <FormControl style={{ minWidth: "200px" }} margin="dense" variant="filled" fullWidth={true}>
                            <InputLabel id="demo-simple-select-label">{t('Course type')}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={currentCourse.type}
                                error={'type' in errorValidator}
                                name='type'
                                // renderValue={p=> p.name}
                                //input={<Input />}
                                onChange={(e) =>{
                                  courseDispatch({type: courseReducerActionType.BASIC_UPDATE, payload: {
                                      field: e.target.name, value: e.target.value
                                    }});
                                }}
                            >
                              <MenuItem value="ONLINE">{t("ONLINE")}</MenuItem>
                              <MenuItem value="BLENDED">{t("BLENDED")}</MenuItem>
                            </Select>
                            {'type' in errorValidator ? (<FormHelperText className="text-danger">{t("required")}</FormHelperText>) : null}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4} className="upload_btn">
                          <CommonImageUpload name={t("Upload image")}  description={t("Upload image for course")}
                              fullWidth={true}
                              value={currentCourse.image} setValue={setImageHandler}
                              uploadFunction={CourseService.uploadImage}/>
                              {currentCourse?.image && (
                              <img
                                  style={{maxHeight:'200px', width:'auto', objectFit: 'contain'}}
                                  src={CourseService.getImageUrl(currentCourse.image)}
                                  alt='Course image'
                                  loading="lazy"
                              />
                          )}
                        </Grid>
                        <Grid item xs={12} className="grid-width">
                            <div className="userbtn btn-flex btn-grid-mb">
                                <StyledButton eVariant="secondary" eSize="medium" 
                                  onClick={() => {
                                    F_showToastMessage("No change");
                                    setIsOpenEditChapterForm({isOpen: false, chapterId: undefined});
                                    setEditFormHelper({isOpen: false, openType: undefined, courseId: 'NEW'});
                                    setErrorValidator({});
                                    navigate("/courses");
                                  }}
                                
                                >{t("Back")}</StyledButton>
                                {editFormHelper.courseId !== 'NEW' && (
                                  <StyledButton eVariant="primary" eSize="medium" className="submitBtn"
                                    onClick={() => {
                                      setActionModal({isOpen: true, returnedValue: false, removeId: currentCourse._id})
                                    }}
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
                    )}
                    {activeTab === 1 && <ChaptersList/>}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>


      <ConfirmActionModal actionModal={actionModal}
                          setActionModal={setActionModal}
                          actionModalTitle={t("Removing course")}
                          actionModalMessage={t("Are you sure you want to remove this course? The action is not reversible!")}
      />
    </Card>
    </ThemeProvider>
  );
}
