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
import reportService from "services/soft_skills_template.service";

import TextField from "@material-ui/core/TextField";
import {now} from "moment";
import { theme } from "MuiTheme";


const initialTemplateState={
    name: 'New skill',
    label: 1,
    value: 1,
    createdAt: new Date(now()).toISOString(),
}

export default function SoftSkillForm({editFormHelperSoftSkills, setEditFormHelperSoftSkills, setSoftSkills}){
    const { t } = useTranslation();
    const { F_showToastMessage, F_handleSetShowLoader} = useMainContext();
    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false});
    const [currentSoftSkill, setCurrentSoftSkill] = useState({});

    useEffect(()=>{
        if(editFormHelperSoftSkills?.isOpen && editFormHelperSoftSkills.type==='EDIT' && editFormHelperSoftSkills?.softSkillId){
            reportService.readSoftSkillById(editFormHelperSoftSkills.softSkillId).then(res=>{
                if(res.status === 200 && res?.data){
                    setCurrentSoftSkill(res.data);
                }
            }).catch(err=>console.log(err));
        }else {
            setCurrentSoftSkill(initialTemplateState);
        }
    },[editFormHelperSoftSkills])

    useEffect(()=>{
        if(actionModal.returnedValue){
            removeReportTemplate();
        }
        F_handleSetShowLoader(false);
    },[actionModal.returnedValue]);

    const removeReportTemplate=()=>{
        if(editFormHelperSoftSkills.type === 'EDIT'){

            // mock on current model
            setSoftSkills(p=>{
                let val = Object.assign([],p);
                let foundedIndex = val.findIndex(rt=> rt._id === currentSoftSkill._id);
                if(foundedIndex>-1){
                    val.splice(foundedIndex,1);
                }
                return val;
            });
            // request
            // then
            reportService.removeSoftSkill(currentSoftSkill._id).then(res=>{
                setEditFormHelperSoftSkills({isOpen: false, type: 'EDIT', softSkillId: undefined});
                F_showToastMessage("Data was removed","success");
            }).catch(err=>console.log(err))
        }
    }

    const saveTemplate=()=>{
        if(editFormHelperSoftSkills.type === 'EDIT'){

            // mock on current model
            setSoftSkills(p=>{
                let val = Object.assign([],p);
                let foundedIndex = val.findIndex(rt=> rt._id === currentSoftSkill._id);
                if(foundedIndex>-1){
                    val[foundedIndex] = currentSoftSkill;
                }
                return val;
            });
            // request
            // then
            reportService.updateSoftSkill(currentSoftSkill).then(res=>{
                setEditFormHelperSoftSkills({isOpen: false, type: 'EDIT', softSkillId: undefined});
                F_showToastMessage("Data was updated","success");
            }).catch(err=>console.log(err))
        } else if(editFormHelperSoftSkills.type==='ADD'){
            // mock on current model
            setSoftSkills(p=>[...p,currentSoftSkill]);
            // request
            // then
            reportService.addSoftSkill(currentSoftSkill).then(res=>{
                setEditFormHelperSoftSkills({isOpen: false, type: 'EDIT', softSkillId: undefined});
                F_showToastMessage("Data was added","success");
            }).catch(err=>console.log(err))
        }
    }



    return(
        <Card className="p-0 m-0 d-flex flex-column">
            <CardHeader title={(
                <Typography variant="h3" component="h5" className="text-left" style={{fontSize:"32px", color:theme.palette.primary.lightViolet}}>
                {` ${currentSoftSkill?.name || t("Template name")}`}
                </Typography>
            )} 
            // avatar={<Chip label={editFormHelperSoftSkills.type==="ADD" ? t("Add"):t("Edit")} color="primary" />}
            />
            <CardContent>
                <Grid container>
                    <Grid item xs={12}>
                        <TextField label={t("Soft skill name")} margin="normal"
                                   InputProps={{
                                       readOnly: false,
                                       disableUnderline: false,
                                   }}
                                   name='name'
                                   fullWidth
                                   style={{maxWidth: "400px"}}
                                   variant='filled'
                                   required={true}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={currentSoftSkill?.name}
                                   onInput={(e) => setCurrentSoftSkill(p=>({...p, name: e.target.value}))}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {/*{(currentTemplate.type === 'SOFT_SKILLS') && (<SoftSkills currentTemplate={currentTemplate} setCurrentTemplate={setCurrentTemplate}/>)}*/}
                    </Grid>
                </Grid>
            </CardContent>
            <CardActionArea >
                <CardActions className="d-flex justify-content-between align-items-center" >
                    <Grid container>
                        <Grid item xs={6}>
                            <Button variant="contained" size="small" color="secondary" onClick={()=>setEditFormHelperSoftSkills({isOpen: false, type: 'EDIT', softSkillId: undefined})}>
                                {t("Dismiss")}
                            </Button>
                        </Grid>
                        <Grid item xs={6} className="p-0 d-flex justify-content-end">
                            {(editFormHelperSoftSkills.type==="EDIT") ?
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
                                actionModalTitle={t("Removing soft skill item")}
                                actionModalMessage={t("Are you sure you want to soft skill item? The action is not reversible!")}
            />
        </Card>
    )
}