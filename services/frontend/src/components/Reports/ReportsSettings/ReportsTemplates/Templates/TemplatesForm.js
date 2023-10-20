import React, {useEffect, useState} from "react";
import Card from "@material-ui/core/Card";
import {CardHeader} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {useTranslation} from "react-i18next";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import ConfirmActionModal from "components/common/ConfirmActionModal";
import SoftSkillsTemplateService from "services/soft_skills_template.service";
import TextField from "@material-ui/core/TextField";
import { theme } from "MuiTheme";
import SoftSkills from "./Types/SoftSkills";

const initialTemplateState={
    type: 'SOFT_SKILLS',
    name: 'New template',
    softSkills:[]
}

export default function TemplatesForm({editFormHelper, setEditFormHelper, setReportsTemplates}){
    const { t } = useTranslation();
    const { F_showToastMessage, F_handleSetShowLoader} = useMainContext();
    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false});
    const [currentTemplate, setCurrentTemplate] = useState({});

    useEffect(()=>{
        if(editFormHelper?.isOpen && editFormHelper.type==='EDIT' && editFormHelper?.templateId){
            SoftSkillsTemplateService.readTemplateById(editFormHelper.templateId).then(res=>{
                if(res.status === 200 && res?.data){
                    setCurrentTemplate(res.data);
                }
            }).catch(err=>console.log(err));
        }else {
            setCurrentTemplate(initialTemplateState);
        }
    },[editFormHelper])

    useEffect(()=>{
        if(actionModal.returnedValue){
            removeReportTemplate();
        }
        F_handleSetShowLoader(false);
    },[actionModal.returnedValue]);

    const removeReportTemplate=()=>{
        if(editFormHelper.type === 'EDIT'){

            // mock on current model
            // setReportsTemplates(p=>{
            //     let val = Object.assign([],p);
            //     let foundedIndex = val.findIndex(rt=> rt._id === currentTemplate._id);
            //     if(foundedIndex>-1){
            //         val.splice(foundedIndex,1);
            //     }
            //     return val;
            // });
            // request
            // then
            SoftSkillsTemplateService.remove(currentTemplate._id).then(res=>{
                setEditFormHelper({isOpen: false, type: 'EDIT', itemType: 'REPORTS_TEMPLATES', templateId: undefined});
                F_showToastMessage("Data was removed","success");
            }).catch(err=>console.log(err))
        }
    }

    const saveTemplate=()=>{
        if(editFormHelper.type === 'EDIT'){

            // mock on current model
            // setReportsTemplates(p=>{
            //     let val = Object.assign([],p);
            //     let foundedIndex = val.findIndex(rt=> rt._id === currentTemplate._id);
            //     if(foundedIndex>-1){
            //         val[foundedIndex] = currentTemplate;
            //     }
            //     return val;
            // });
            // request
            // then
            SoftSkillsTemplateService.update(currentTemplate).then(res=>{
                setEditFormHelper({isOpen: false, type: 'EDIT', itemType: 'REPORTS_TEMPLATES', templateId: undefined});
                F_showToastMessage("Data was updated","success");
            }).catch(err=>console.log(err))
        } else if(editFormHelper.type==='ADD'){
            // mock on current model
            // setReportsTemplates(p=>[...p,currentTemplate]);
            // request
            // then
            SoftSkillsTemplateService.add(currentTemplate).then(res=>{
                setEditFormHelper({isOpen: false, type: 'EDIT', itemType: 'REPORTS_TEMPLATES', templateId: undefined});
                F_showToastMessage("Data was added","success");
            }).catch(err=>console.log(err))
        }
    }



    return(
        <Card className="p-0 m-0 d-flex flex-column">
            <CardHeader title={(
                <Typography variant="h3" component="h5" className="text-left" style={{fontSize:"32px", color:theme.palette.primary.lightViolet}}>
                {` ${currentTemplate?.name || t("Template name")}`}
                </Typography>
            )} 
            // avatar={<Chip label={editFormHelper.type==="ADD" ? t("Add"):t("Edit")} color="primary" />}
            />
            <CardContent>
                <Grid container>
                    <Grid item xs={12}>
                        {/* <FormControl style={{width:"50%", maxWidth: '300px'}} margin="normal" required={true} variant="filled"
                                     className="mr-5"
                        >
                            <InputLabel id="reportType-select-label">{t("Select report type")}</InputLabel>
                            <Select
                                labelId="reportType-select-label"
                                id="reportType-select"
                                value={`${currentTemplate?.type}`}
                                disabled={true}
                                //renderValue={p=> p}
                                //input={<Input/>}
                                onChange={(e) => {}}
                            >
                                <MenuItem value={'SOFT_SKILLS'}>SOFT_SKILLS</MenuItem>
                            </Select>
                        </FormControl> */}
                        <TextField label={t("Template name")} margin="normal"
                                   InputProps={{
                                       readOnly: false,
                                       disableUnderline: false,
                                   }}
                                   name='name'
                                   fullWidth={true}
                                   style={{maxWidth: "400px"}}
                                   variant='filled'
                                   required={true}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={currentTemplate?.name}
                                   onInput={(e) => setCurrentTemplate(p=>({...p, name: e.target.value}))}
                        />
                    </Grid>
                    <Grid item xs={12} className='p-0'>
                        {(<SoftSkills currentTemplate={currentTemplate} setCurrentTemplate={setCurrentTemplate}/>)}
                    </Grid>
                </Grid>
            </CardContent>
            <CardActionArea >
                <CardActions className="d-flex justify-content-between align-items-center" >
                    <Grid container>
                        <Grid item xs={6}>
                            <Button variant="contained" size="small" color="secondary" onClick={()=>setEditFormHelper({isOpen: false, type: 'PREVIEW', itemType: 'REPORTS_TEMPLATES', templateId: undefined})}>
                            {t("Dismiss")}
                            </Button>
                        </Grid>
                        <Grid item xs={6} className="p-0 d-flex justify-content-end">
                                    {(editFormHelper.type==="EDIT") ?
                                        <Button variant="contained" size="small" color="inherit"
                                                onClick={()=>setActionModal({isOpen: true, returnedValue: false})}>
                                            {t("Remove")}
                                        </Button> : null}

                                    <Button onClick={saveTemplate} size="small" variant="contained" color="primary" className="ml-5">
                                        {t("Save")}
                                    </Button>
                        </Grid>
                    </Grid>
                </CardActions>
            </CardActionArea>
            <ConfirmActionModal actionModal={actionModal}
                                setActionModal={setActionModal}
                                actionModalTitle={t("Removing report template")}
                                actionModalMessage={t("Are you sure you want to report template? The action is not reversible!")}
            />
        </Card>
    )
}