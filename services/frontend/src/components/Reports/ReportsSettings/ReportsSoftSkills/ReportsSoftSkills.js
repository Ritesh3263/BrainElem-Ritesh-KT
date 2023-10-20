import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {Paper} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import {useTranslation} from "react-i18next";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import reportService from "services/soft_skills_template.service";
import SoftSkillTable from "./SoftSkillTable";
import SoftSkillForm from "./SoftSkillForm";

export default function ReportsSoftSkills(){
    const { t } = useTranslation();
    const {setMyCurrentRoute, F_showToastMessage, F_hasPermissionTo} = useMainContext();
    const [editFormHelperSoftSkills, setEditFormHelperSoftSkills]= useState({isOpen: false, type: 'EDIT', softSkillId: undefined});
    const [softSkills, setSoftSkills] = useState([]);

    useEffect(()=>{
        reportService.readAllSoftSkills().then(res=>{
            if(res.status === 200 && res?.data?.length>0){
                setSoftSkills(res.data)
            }
        }).catch(err=>console.log(err));
    },[]);
    return(
        <Grid container spacing={2}>
            <Grid item xs={12} md={editFormHelperSoftSkills.isOpen ? 6: 12}>
                    <div className="d-flex pt-2 px-2 mb-3 justify-content-between">
                        <Button size="small" variant="contained" color="primary"
                                disabled={editFormHelperSoftSkills.isOpen}
                                onClick={()=>{
                                    if (F_hasPermissionTo('create-competences')) setEditFormHelperSoftSkills({isOpen: true, type: 'ADD', softSkillId: undefined})
                                    else F_showToastMessage(t('You do not have permission to create new soft skill'))
                                }}
                        >{t('Add soft skill')}</Button>
                    </div>
                    <SoftSkillTable softSkills={softSkills} setEditFormHelperSoftSkills={setEditFormHelperSoftSkills}/>
            </Grid>
            {editFormHelperSoftSkills.isOpen && (
                <Grid item xs={12} md={6}>
                    <Paper elevation={10} >
                        <SoftSkillForm editFormHelperSoftSkills={editFormHelperSoftSkills}
                                       setEditFormHelperSoftSkills={setEditFormHelperSoftSkills}
                                       setSoftSkills={setSoftSkills}/>
                    </Paper>
                </Grid>
            )}
        </Grid>
    )
}