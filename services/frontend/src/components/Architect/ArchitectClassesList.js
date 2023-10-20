import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import moduleCoreService from "services/module-core.service"
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";
import ArchitectClassesTable from "./ArchitectClassesTable";
import {useTranslation} from "react-i18next";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {Paper} from "@material-ui/core";
import ArchitectSetupClassForm from "./NewArchitectSetupClass/ArchitectSetupClassForm";

const useStyles = makeStyles(theme=>({}))

export default function ArchitectClassesList(){
    const { t } = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();
    const { classId } = useParams();
    const [currentModuleId, setCurrentModuleId] = useState("");
    const [MSClasses, setMSClasses] =useState([])
    const {setMyCurrentRoute, F_showToastMessage, F_getHelper} = useMainContext();
    const {manageScopeIds} = F_getHelper();
    const [editFormHelper, setEditFormHelper] = useState({isOpen: false, openType: undefined, classId: undefined});

    useEffect(()=>{
        setCurrentModuleId(manageScopeIds.moduleId)
        moduleCoreService.readModuleCore(manageScopeIds.moduleId).then(res=>{
            if(res.data.groups){
                setMSClasses(res.data.groups)
            }
        }).catch(error=>console.error(error))
        setMyCurrentRoute("Class")
    },[editFormHelper]);

    useEffect(()=>{
        if(classId){
            setEditFormHelper({isOpen: true, openType: 'EDIT', classId})
        }
    },[classId])

    return(
            <Grid container spacing={1} className='mt-3'>
                <Grid item xs={12} lg={editFormHelper.isOpen ? 5 : 12}>
                     <ArchitectClassesTable MSClasses={MSClasses} setEditFormHelper={setEditFormHelper} editFormHelper={editFormHelper}/>
                </Grid>
                <Grid item xs={12} lg={7} hidden={!editFormHelper.isOpen}>
                    <Paper elevation={10} className="p-0">
                        <ArchitectSetupClassForm editFormHelper={editFormHelper} setEditFormHelper={setEditFormHelper}/>
                    </Paper>
                </Grid>
            </Grid>
    )
}