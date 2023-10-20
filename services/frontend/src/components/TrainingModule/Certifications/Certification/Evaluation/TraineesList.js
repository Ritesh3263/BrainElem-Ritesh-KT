import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import { makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import {Paper} from "@material-ui/core";
import CertificateService from "../../../../../services/certificate.service";
import TraineesForm from "./TraineesForm";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import GroupsList from "../../../Sessions/NSession/EnrolledStudents/GroupsList";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(theme=>({}))

export default function TraineesList({ formIsOpen, setFormIsOpen}){
    const { t } = useTranslation();
    const classes = useStyles();
    const [remainingUserLimit, setRemainingUserLimit] = useState(0);

    const [groups, setGroups]=useState([]);
    const [studentFormHelper, setStudentFormHelper] = useState({isOpen: false, type: 'PREVIEW', groupIndex: undefined, studentId: undefined});

    useEffect(()=>{
        CertificateService.readAllTraineesInSession(formIsOpen?.certificationSessionId).then(res=>{
            if(res.status === 200 && res?.data?.groups){
                setGroups(res.data.groups);
            }

        }).catch(error=>console.log(error))
    },[formIsOpen]);


    const groupsList = groups?.length>0 ? groups.map((item, index)=>(
        <GroupsList item={item} index={index} formCertificate setStudentFormHelper={setStudentFormHelper}/>)) : [];

    return(
        <>
            <Grid container spacing={1}>
                {/*<Grid item xs={12}>*/}
                {/*    <Paper elevation={12} className="p-2 text-center">*/}
                {/*        <Button classes={{root: classes.root}} size="small" variant="contained" color="secondary"*/}
                {/*                className="my-2"*/}
                {/*                style={{width:"33%"}}*/}
                {/*                startIcon={<AddCircleOutlineIcon/>}*/}
                {/*                onClick={()=>{}}*/}
                {/*        >Assign a competence</Button>*/}
                {/*    </Paper>*/}
                {/*</Grid>*/}

                {/*<Grid item xs={12} lg={currentTab.openTab ? 6 : 12}>*/}
                {/*    <Paper elevation={10} className="p-2">*/}
                {/*        <TraineesTable MSUsers={MSUsers} setCurrentTab={setCurrentTab}/>*/}
                {/*    </Paper>*/}
                {/*</Grid>*/}
                <Grid item xs={12} >
                    <Paper elevation={10} className="p-2">
                        <List
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                            subheader={
                                <ListSubheader component="div" id="nested-list-subheader" className="text-center" style={{color: `rgba(82, 57, 112, 1)`}}>{t("Groups")}</ListSubheader>
                            }
                        >
                            {groupsList}
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={12} lg={6} hidden={!studentFormHelper.isOpen}>
                    <TraineesForm studentFormHelper={studentFormHelper} setStudentFormHelper={setStudentFormHelper} sessionId={formIsOpen?.certificationSessionId}/>
                </Grid>
            </Grid>
        </>
    )
}