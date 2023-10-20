import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import ModuleService from "services/module.service"
import { makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import {Paper} from "@material-ui/core";
import ModulesTable from "./ModulesTable";
import {useTranslation} from "react-i18next";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {EButton} from "styled_components";
import ModuleFormat2 from "./ModuleFormat2";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

const useStyles = makeStyles(theme=>({}))

export default function ModulesList(){
    const {t} = useTranslation();
    const { F_showToastMessage, F_getErrorMessage, F_getHelper, F_handleSetShowLoader } = useMainContext();
    const {manageScopeIds} = F_getHelper();
    const classes = useStyles();
    const navigate = useNavigate();
    const [modules, setModules] = useState([]);
    const {setMyCurrentRoute} = useMainContext();
    const [editFormHelper, setEditFormHelper] = useState({isOpen: false, moduleId: undefined});

   useEffect(()=>{
        // const modules = manageScopeIds.subscriptionId;
        // Promise.all(modules.map(mod=>
        //     ModuleService.getManagersInModule(mod._id).then(res2=>{
        //         mod.assignedManagers=res2.data;
        //     })))
        // .then(()=>
        //     setModules(modules)
        // ) // in this way, changes reflect only after re-login

        // let modules = [] // agreget modules for all subscription when user have multiple subscriptions
       F_handleSetShowLoader(true)
        ModuleService.readAll(manageScopeIds.subscriptionId).then(res=>{
            setModules(res.data)
            F_handleSetShowLoader(false)
        }).catch(error=>console.error(error));
       setMyCurrentRoute("Module")
    },[editFormHelper, manageScopeIds])

    return(
            <Grid container spacing={1}>
                <Grid item xs={12} md={editFormHelper.isOpen ? 6 : 12}>
                        <div className="d-flex pt-2 px-2 mb-3 justify-content-between">
                        <EButton eSize="small" eVariant="primary"
                                startIcon={<AddCircleOutlineIcon/>}
                                disabled={editFormHelper.isOpen}
                                onClick={()=>{
                                    setEditFormHelper({isOpen: true, moduleId: 'NEW'});
                                    //navigate("/modules/form/new")
                                }}
                            >{t("Add module")}</EButton>
                        </div>
                        <ModulesTable modules={modules} setEditFormHelper={setEditFormHelper}/>
                </Grid>
                    <Grid item xs={12} md={6} hidden={!editFormHelper.isOpen}>
                            <ModuleFormat2 editFormHelper={editFormHelper} setEditFormHelper={setEditFormHelper}/>
                    </Grid>
            </Grid>
    )
}