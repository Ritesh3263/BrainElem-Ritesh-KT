import React, {useEffect, useState} from "react";
import {Col, ListGroup, Row} from "react-bootstrap";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import MSCurriculaeSubjectList from "./MSCurriculaeSubjectList";
import MSCAddingSubjectModal from "./MSCAddingSubjectModal";
import ModuleCoreService from "../../../../../services/module-core.service"
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import {Paper} from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import EditLocationIcon from '@material-ui/icons/EditLocation';
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(theme=>({}))

export default function MSCAddingSubjects({currentModule, MSCurriculum, setMSCurriculum, BasicValidators}){
    const { t, i18n, translationsLoaded } = useTranslation();
    const classes = useStyles();
    const [MSAllSubjects, setMSAllSubjects] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(()=>{
            setMSAllSubjects(currentModule.trainingModules);
    },[]);


    async function removeSubjectFromCurriculum(subject, index){
        await setMSCurriculum(p=>{
            let val = Object.assign({},p);
            // val.trainingModules = val.trainingModules.filter(subj => subj._id !== subject._id);
            val.trainingModules.splice(index,1);
            return val;
        })
    };

    async function pushSubjectToCurriculum(newSubjects){
        await setMSCurriculum(p=>{
            let val = Object.assign({},p);
            let existingSubjectIds = val.trainingModules.map(s=>s.originalTrainingModule._id)
            newSubjects.forEach(subject=>{
                if(subject.isSelected && !existingSubjectIds.includes(subject._id)){
                    val.trainingModules.push({
                        newName: subject.name  ? subject.name : "",
                        chosenChapters:[],
                        originalTrainingModule:subject,
                    });
                }
            })
            return val;
        })
    }

    return(
                <>
                    <Paper elevation={12} className="text-right">
                        <Button size="small" variant="contained" color="primary"
                                startIcon={<EditLocationIcon/>}
                                onClick={()=>setOpenDialog(true)}
                        >{t("Assign subjects")}</Button><br/>
                        {BasicValidators.assignedSubjects ? (<span className="mt-4 text-danger">{t("Assign subject is required, to get the next step")}</span>) : null}
                    </Paper>
                    <hr/>
                    <ListGroup>
                        <div className="pl-2 pr-2 pb-1 d-flex justify-content-between align-items-center">
                            <Col xs={1} className=""><small>No.</small></Col>
                            <Col xs={2} className=""><small>{t("Custom name")}</small></Col>
                            <Col xs={2} className=""><small>{t("Subject name")}</small></Col>
                            <Col xs={2} className=""><small>{t("Category name")}</small></Col>
                            <Col xs={2} className=""><small>{t("Estimated time")}</small></Col>
                            <Col xs={2} className=""><small>{t("Subject fill time")}</small></Col>
                            <Col xs={1} className="text-right pr-1">
                                <ArrowDropDownIcon/>
                            </Col>
                        </div>
                        {
                            MSCurriculum.trainingModules ? MSCurriculum.trainingModules.map((subj, index)=>
                                <MSCurriculaeSubjectList subject={subj} ind={index} key={index} removable={true} removeSub={removeSubjectFromCurriculum} setMSCurriculum={setMSCurriculum}/>) : null
                        }
                    </ListGroup>
                    <MSCAddingSubjectModal isOpen={openDialog} setOpen={setOpenDialog} allSubjects={MSAllSubjects} pushSubjectToCurriculum={pushSubjectToCurriculum}/>
                </>
    )
}