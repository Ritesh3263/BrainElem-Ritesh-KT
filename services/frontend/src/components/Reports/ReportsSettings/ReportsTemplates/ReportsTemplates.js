import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {Paper} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import Button from "@material-ui/core/Button";
import ReportsTable from "./Templates/TemplatesTable";
import TemplatesForm from "./Templates/TemplatesForm";
import SoftSkillTemplateService from "services/soft_skills_template.service";

export default function ReportsTemplates(){
    const { t } = useTranslation();
    const [editFormHelper, setEditFormHelper]= useState({isOpen: false, type: 'EDIT', itemType: 'REPORTS_TEMPLATES', templateId: undefined});
    const [reportsTemplates, setReportsTemplates] = useState([]);

    useEffect(()=>{
        SoftSkillTemplateService.readAllReportsTemplates().then(res=>{
            if(res.status === 200 && res?.data?.length>0){
                setReportsTemplates(res.data)
            }
        }).catch(err=>console.log(err));
    },[editFormHelper.isOpen]);

    return(
        <Grid container spacing={2}>
            <Grid item xs={12} md={editFormHelper.isOpen ? 4: 12}>
                    <div className="d-flex pt-2 px-2 mb-3 justify-content-between">
                            <Button size="small" variant="contained" color="primary"
                                    disabled={editFormHelper.isOpen}
                                    onClick={()=>setEditFormHelper({isOpen: true, type: 'ADD', itemType: 'REPORTS_TEMPLATES', templateId: undefined})}
                            >{t('Add template')}</Button>
                    </div>
                        <ReportsTable reportsTemplates={reportsTemplates} setEditFormHelper={setEditFormHelper}/>
            </Grid>
            {editFormHelper.isOpen && (
                <Grid item xs={12} md={8}>
                    <Paper elevation={10} >
                        <TemplatesForm editFormHelper={editFormHelper} setEditFormHelper={setEditFormHelper} setReportsTemplates={setReportsTemplates}/>
                    </Paper>
                </Grid>
            )}
        </Grid>
    )
}