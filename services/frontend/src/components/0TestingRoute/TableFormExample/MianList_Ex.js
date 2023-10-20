import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import moduleCoreService from "../../../services/module-core.service"
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import {Paper} from "@material-ui/core";
import TableEx from "./Table/Table_Ex";
import {useTranslation} from "react-i18next";
import Typography from "@material-ui/core/Typography";
import {useMainContext} from "../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import FormEx from "./Form/Form_Ex";

const useStyles = makeStyles(theme=>({}))

export default function MainList_Ex(){
    const {t} = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();
    const [MSCurriculae, setMSCurriculae] = useState([]);
    const [editFormHelper, setEditFormHelper] = useState({isOpen: false, curriculumId: 'NEW'})

    // setCurrentRoute
    const {
        setMyCurrentRoute,
        F_getHelper,
        F_handleSetShowLoader,
        F_getErrorMessage,
        F_showToastMessage,
        F_hasPermissionTo
    } = useMainContext();
    const {manageScopeIds} = F_getHelper();

    
    useEffect(()=>{
        setMyCurrentRoute("Curriculum");
        F_handleSetShowLoader(true);
        moduleCoreService.readModuleCore(manageScopeIds.moduleId).then(res=>{
            if(res.status === 200){
                if(res.data.trainingPaths){
                    setMSCurriculae(res.data.trainingPaths)
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

    return(
        <Grid container spacing={1} className="d-flex flex-grow-1">
            <Grid item xs={12} lg={editFormHelper.isOpen ? 6 : 12}>
                <Paper elevation={10} className="p-0 h-100">
                    <div className="d-flex py-3 px-2 justify-content-between" style={{backgroundColor:`rgba(255, 255, 255, 0.4)`, borderTopLeftRadius: "4px", borderTopRightRadius: "4px"}}>
                        <Typography variant="h5" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                            {t("Curriculae")}
                        </Typography>
                        <Button classes={{root: classes.root}} size="small" variant="contained" color="primary"
                                disabled={editFormHelper.isOpen}
                                startIcon={<AddCircleOutlineIcon/>}
                                onClick={()=>{
                                    if (F_hasPermissionTo('create-training-path')) setEditFormHelper({isOpen: true, curriculumId: 'NEW'})
                                    else F_showToastMessage(t('You are not authorized to create a training path'), 'error')    
                                }}
                        >{t("Add curriculum")}</Button>
                    </div>
                    <TableEx MSCurriculae={MSCurriculae} setEditFormHelper={setEditFormHelper}/>
                </Paper>
            </Grid>
            {editFormHelper.isOpen && (
                <Grid item xs={12} lg={editFormHelper.isOpen ? 6 : 12}>
                    <FormEx editFormHelper={editFormHelper} setEditFormHelper={setEditFormHelper}/>
                </Grid>
            )}
        </Grid>
    )
}