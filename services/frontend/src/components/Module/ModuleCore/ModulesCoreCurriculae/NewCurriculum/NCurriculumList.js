import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import moduleCoreService from "services/module-core.service"
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import {Paper} from "@material-ui/core";
import NCurriculumTable from "./Table/NCurriculumTable";
import {useTranslation} from "react-i18next";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import NCurriculumForm from "./Form/NCurriculumForm";
import {useCurriculumContext} from "components/_ContextProviders/CurriculumProvider/CurriculumProvider";

const useStyles = makeStyles(theme=>({}))

export default function NCurriculumList(){
    const {t} = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();
    const { curriculumId } = useParams();
    const [MSCurriculae, setMSCurriculae] = useState([]);

    /** CurriculumContext ------------------------------------------**/
    const {
        editFormHelper,
        setEditFormHelper,
    } = useCurriculumContext();
    /**-------------------------------------------------------------**/

    // setCurrentRoute
    const {
        setMyCurrentRoute,
        F_getHelper,
        F_handleSetShowLoader,
        F_getErrorMessage,
        F_showToastMessage,
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
    },[editFormHelper?.isOpen]);

    useEffect(()=>{
        if(curriculumId){
            setEditFormHelper({isOpen: true, openType:'GENERAL' , curriculumId})
        }
    },[curriculumId]);

    return(
        <Grid container spacing={1} className="d-flex flex-grow-1">
            {(!(editFormHelper.isOpen && editFormHelper.openType === 'SUBJECT')) &&(
                <Grid item xs={12} lg={editFormHelper.isOpen ? 6 : 12}>
                        <div className="d-flex py-3 px-2 justify-content-between" >
                            <Button classes={{root: classes.root}} size="small" variant="contained" color="primary"
                                    disabled={editFormHelper.isOpen}
                                    onClick={()=>{setEditFormHelper({isOpen: true, openType:'GENERAL' , curriculumId: 'NEW'})}}
                            >{t("Add curriculum")}</Button>
                        </div>
                        <NCurriculumTable MSCurriculae={MSCurriculae}/>
                </Grid>
            )}
            {editFormHelper.isOpen && (
                <Grid item xs={12} lg={editFormHelper.isOpen && editFormHelper.openType === 'SUBJECT' ? 12 : 6}>
                       <Paper elevation={10} >
                        <NCurriculumForm
                            editFormHelper={editFormHelper}
                            setEditFormHelper={setEditFormHelper}
                            MSCurriculae={MSCurriculae}
                        />
                        </Paper>
                </Grid>
            )}
        </Grid>
    )
}