import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import {useTranslation} from "react-i18next";
import {makeStyles} from "@material-ui/core/styles";
import SubjectsTable from "./SubjectsTable";
import AddSubject from "./AddSubject/AddSubject";
import {useMainContext} from "../../../../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import EditSubject from "./EditSubject/EditSubject";
import {useCurriculumContext} from "../../../../../../_ContextProviders/CurriculumProvider/CurriculumProvider";

const useStyles = makeStyles(theme=>({}));

export default function SubjectsList(){
    const { t } = useTranslation();
    const classes = useStyles();
    const {F_showToastMessage, F_hasPermissionTo} = useMainContext();

    /** CurriculumContext ------------------------------------------**/
    const {
        curriculumReducerActionType,
        currentCurriculum,
        curriculumDispatch,
        subjectDisplayMode,
        setSubjectDisplayMode,
        initialStateSubjectDisplayMode,
        setTrainingModules,
    } = useCurriculumContext();
    /**-------------------------------------------------------------**/


    useEffect(()=>{
        // parent update children state
        if(currentCurriculum?.trainingModules?.length>0){
            setTrainingModules(currentCurriculum.trainingModules)
        }else{
            setTrainingModules([]);
        }
    },[currentCurriculum]);

    const handleAddSubject=(newSubject)=>{
        curriculumDispatch({type: curriculumReducerActionType.ADD_SUBJECT, payload: newSubject})
        setSubjectDisplayMode(initialStateSubjectDisplayMode);
        F_showToastMessage('Data was added')
    };

    const handleRemoveSubject=(index)=>{
        curriculumDispatch({
            type: curriculumReducerActionType.REMOVE_SUBJECT,
            payload: index,
        })
    }

    return(
        <Grid container className="mt-2" >
            {subjectDisplayMode.mode === 'TABLE' && (
                <>
                    <Grid item xs={12}>
                        <Button classes={{root: classes.root}} size="small" variant="contained" color="primary"
                                startIcon={<AddCircleOutlineIcon/>}
                                onClick={()=>F_hasPermissionTo('create-subjects')? setSubjectDisplayMode({mode:'FORM-ADD', subjectId: undefined}):F_showToastMessage('You do not have permission to create subjects')}
                        >{t("Add subject")}</Button>
                    </Grid>
                    <Grid item xs={12} className="mt-2">
                        <SubjectsTable handleRemoveSubject={handleRemoveSubject} />
                    </Grid>
                </>
            )}
            {subjectDisplayMode.mode === 'FORM-ADD' && (<AddSubject handleAddSubject={handleAddSubject} />)}
            {subjectDisplayMode.mode === 'FORM-EDIT' && (<EditSubject />)}
        </Grid>
    )
}