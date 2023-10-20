import React, {useEffect, useState} from "react";
import {Card, CardHeader} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import ConfirmActionModal from "components/common/ConfirmActionModal";
import {useTranslation} from "react-i18next";
import {makeStyles} from "@material-ui/core/styles";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import GeneralSettings from "./GeneralSettings/GeneralSettings";
import moduleCoreService from "services/module-core.service";
import SubjectsList from "./Subjects/SubjectsList";
import {useNavigate} from "react-router-dom";
import {useCurriculumContext} from "components/_ContextProviders/CurriculumProvider/CurriculumProvider"
import {ETab, ETabBar} from "styled_components";
import { theme } from "MuiTheme";

const useStyles = makeStyles(theme=>({}));

export default function NCurriculumForm({MSCurriculae}){
    const navigate = useNavigate();
    const classes = useStyles();
    const { t } = useTranslation();
    const [currentTab, setCurrentTab] = useState(0);


    const [activeTab, setActiveTab] = useState(0);
    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false});

    /** MainContext ------------------------------------------------**/
    const {F_showToastMessage, F_getHelper} = useMainContext();
    const {manageScopeIds} = F_getHelper();

    /**-------------------------------------------------------------**/

    /** CurriculumContext ------------------------------------------**/
    const {
        editFormHelper,
        setEditFormHelper,
        setCurrentModuleCore,
        curriculumReducerActionType,
        currentCurriculum,
        curriculumDispatch,
        setSubjectDisplayMode,
        setIsOpenEditChapterForm,
        currentModuleCore,
        setCurrentTrainingModule,
        setTrainingModules,
        setCurrentTrainingModuleIndex,
        initialStateSubjectDisplayMode,
        basicValidators,
        initialValidatorState,
        setBasicValidators,
    } = useCurriculumContext();
    /**-------------------------------------------------------------**/

    useEffect(()=>{
        setBasicValidators(initialValidatorState);
        setSubjectDisplayMode(initialStateSubjectDisplayMode);
        moduleCoreService.readModuleCore(manageScopeIds.moduleId).then(res=>{
            if(res.status === 200){
                setCurrentModuleCore(res.data)
            }
        }).catch(error=>console.error(error))
    },[])


    useEffect(()=>{
        if((editFormHelper.curriculumId !== null ) && (editFormHelper.curriculumId !== 'NEW') ){
            filterCorrectCurriculum(MSCurriculae).then(res=>{
               if(res !== undefined){
                    curriculumDispatch({type: curriculumReducerActionType.INIT, payload: res})
               }
            })
        }else{
            curriculumDispatch({type: curriculumReducerActionType.NEW_CURR, payload: undefined})
        }
    },[editFormHelper.curriculumId])


    // remove handler
    useEffect(()=>{
        if(actionModal.returnedValue){
            remove();
        }
    },[actionModal.returnedValue]);


    async function filterCorrectCurriculum(currList){
        return await currList.filter(c => c._id === editFormHelper.curriculumId)[0];
    }

    const remove=()=>{
        moduleCoreService.removeMSCurriculum(currentCurriculum).then(res=>{
            F_showToastMessage(t("Data was removed"),"success");
            setEditFormHelper({isOpen: false, curriculumId: null});
            setCurrentTrainingModule(undefined);
            setCurrentTrainingModuleIndex(undefined);
            setTrainingModules([]);
            setSubjectDisplayMode(initialStateSubjectDisplayMode);
        }).catch(error=>{
            console.log(error.message);
            F_showToastMessage(t(error.message),"error");
            navigate("/curriculae")
        });
    }

    const save=()=>{

        if(validateData() === 'ERR'){
            console.log("error")
                    setCurrentTrainingModule(undefined);
                    setTrainingModules([]);
                    setCurrentTrainingModuleIndex(undefined);
                    setSubjectDisplayMode(initialStateSubjectDisplayMode);
                    setIsOpenEditChapterForm({isOpen: false, chapterId: undefined});
                    setEditFormHelper(p=>({...p,openType: 'GENERAL'}));
                    setActiveTab(0);
        }else{
            if(editFormHelper.curriculumId === 'NEW'){
                moduleCoreService.addMSCurriculum(currentModuleCore._id,currentCurriculum).then(res=>{
                    F_showToastMessage(t(res.data.message),"success");
                    setEditFormHelper({isOpen: false, curriculumId: null});
                    setCurrentTrainingModule(undefined);
                    setCurrentTrainingModuleIndex(undefined);
                    setTrainingModules([]);
                    setSubjectDisplayMode(initialStateSubjectDisplayMode);
                    navigate("/modules-core/curriculae")
                }).catch(error=>console.error(error));
            }else{
                moduleCoreService.updateMSCurriculum(currentCurriculum).then(res=>{
                    F_showToastMessage(t(res.data.message),"success");
                    setEditFormHelper({isOpen: false, curriculumId: null});
                    setCurrentTrainingModule(undefined);
                    setTrainingModules([]);
                    setCurrentTrainingModuleIndex(undefined);
                    setSubjectDisplayMode(initialStateSubjectDisplayMode);
                    navigate("/modules-core/curriculae")
                }).catch(error=>console.error(error));
            }
            setIsOpenEditChapterForm({isOpen: false, chapterId: undefined});
        }
    }

    function validateData(){
            if((currentCurriculum.name.length <2) || currentCurriculum.level.length <1 || currentCurriculum.trainingModules.length <1){
                if(currentCurriculum.name.length <2) {
                    setBasicValidators(p => ({...p,curriculumName: true}));
                }else{
                    setBasicValidators(p => ({...p,curriculumName: false}));
                }
                if(currentCurriculum.level.length <1){
                    setBasicValidators(p => ({...p,levelOfCurriculum: true}));
                }else{
                    setBasicValidators(p => ({...p,levelOfCurriculum: false}));
                }
                if(currentCurriculum.trainingModules.length <1){
                    setBasicValidators(p => ({...p,trainingModules: true}));
                }else{
                    setBasicValidators(p => ({...p,trainingModules: false}));
                }
                return 'ERR'
            } else{
                setBasicValidators({
                    curriculumName: false,
                    levelOfCurriculum: false,
                    trainingModules: false,
                })
                return "OK"
        }}

    return(
        <Card className="p-0 d-flex flex-column m-0 h-100">
            <CardHeader title={(
                <Typography variant="h3" component="h5" className="text-left" style={{fontSize:"32px", color:theme.palette.primary.lightViolet}}>
                {` ${currentCurriculum.name || t("Fill curriculum name")}`}
                </Typography>
            )} 
            // avatar={<Chip label={(editFormHelper.curriculumId === 'NEW') ? t("Add"):t("Edit")} color="primary" />}
            />

            <CardContent className="d-flex flex-column flex-grow-1">
                <Grid container className="d-flex justify-content-center">

                    <ETabBar className="mb-4"
                        value={currentTab}
                        onChange={(e,i)=>setCurrentTab(i)}
                        eSize='small'>
                            <ETab  style={{minWidth:'100px'}}  label='General' eSize='small'
                                    onClick={()=>{
                                        setEditFormHelper(p=>({...p,openType: 'GENERAL'}));
                                        setSubjectDisplayMode({mode:'TABLE', subjectId: undefined});
                                        setIsOpenEditChapterForm({isOpen: false, chapterId: undefined});
                                        setActiveTab(0);
                                        }}/>
                            <ETab   style={{minWidth:'100px'}}  label='Subjects' eSize='small'                          
                                      onClick={()=>{
                                            setEditFormHelper(p=>({...p,openType: 'GENERAL'}));
                                            setActiveTab(1);
                                            }}/>
                    </ETabBar>
                </Grid>
                <Grid container spacing={1}>
                    <Grid item xs={12} className='d-flex flex-column'>
                        {activeTab === 0 ? (<GeneralSettings/>) : (<SubjectsList/>)}
                    </Grid>
                </Grid>
            </CardContent>
            {(currentTab === 0)  && (
            <CardActionArea >
                <CardActions className="mb-2 d-flex justify-content-between " >
                    <Grid container className=" justify-content-between">
                            <Button  variant="contained" size="small" color="secondary" onClick={() =>  {
                                    F_showToastMessage(t("No change"),)
                                    setEditFormHelper({isOpen: false, openType: undefined, curriculumId: null});
                                navigate("/modules-core/curriculae");
                                }}>
                                    {t("Back")}
                            </Button>
                                {
                                    editFormHelper.curriculumId !== 'NEW' && (
                                        <Button  variant="contained" size="small" color="inherit"
                                                onClick={()=>setActionModal({isOpen: true, returnedValue: false})}>
                                            {t("Remove")}
                                        </Button>
                                    )
                                }
                            <Button  size="small" variant="contained" color="primary"
                                    onClick={save}
                            >{t("Save")}</Button>
                    </Grid>
                </CardActions>
            </CardActionArea>
            )}
            <ConfirmActionModal
                actionModal={actionModal}
                setActionModal={setActionModal}
                actionModalTitle={t("Removing curriculum")}
                actionModalMessage={t("Are you sure you want to remove competence curriculum? The action is not reversible!")}
            />
        </Card>
    )
}