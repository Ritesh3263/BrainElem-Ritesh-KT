import React, {useEffect, useState} from "react";
import {Col, ListGroup} from "react-bootstrap";
import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import Avatar from "@material-ui/core/Avatar";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import ModuleCoreService from "../../../../../services/module-core.service"
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import {useTranslation} from "react-i18next";

export default function MSCurriculaeSubjectList({subject, ind, removable, removeSub, setMSCurriculum}){
    const { t, i18n, translationsLoaded } = useTranslation();

    return(
        <ListGroup.Item className="pl-2 pr-2 py-0 mb-2 d-flex justify-content-between align-items-center" style={{backgroundColor:`rgba(255,255,255,0.35)`, borderRadius:"8px"}}>
            <Col xs={1}><Avatar style={{width: "25px", height: "25px", backgroundColor:`rgba(82, 57, 112, 1)`}}>{ind+1}</Avatar></Col>
            <Col xs={2}>
                <TextField label={t("Subject new name")}  margin="normal"
                           multiline
                           rowsMax={2}
                           InputLabelProps={{
                               shrink: true,
                               readOnly: true,
                           }}
                           value={subject.newName}
                           onChange={(e) => {
                               setMSCurriculum(p=>{ 
                                   let val = Object.assign({},p);
                                   val.trainingModules[ind].newName = e.target.value;
                                   return val;
                               })
                           }}
                />
            </Col>
            {/* <Col xs={2}>{subject.newName ? subject.newName : "-"}</Col> */}
            <Col xs={2}>{subject.originalTrainingModule ? subject.originalTrainingModule.name : "-"}</Col>
            <Col xs={2}>{subject.originalTrainingModule ? subject.originalTrainingModule.category.name : "-"}</Col>
            <Col xs={2}>
                <TextField label={`[${t("hours")}]`}
                           InputLabelProps={{
                               shrink: true,
                           }}
                           type="number"
                           value={subject.originalTrainingModule.estimatedTime}
                           onChange={(e) => {
                               setMSCurriculum(p=>{
                                   let val = Object.assign({},p);
                                   val.trainingModules[ind].originalTrainingModule.estimatedTime = e.target.value;
                                   return val;
                               })
                           }}
                />
            </Col>
            {/* <Col xs={2}>{subject.originalTrainingModule.estimatedTime ? subject.originalTrainingModule.estimatedTime : "-"}</Col> */}
            <Col xs={2}>
                <Box display="flex" alignItems="center">
                    <Box width="100%" mr={1}>
                        <LinearProgress variant="determinate"  value={subject.progress ? subject.progress : 0}
                                        style={{borderRadius: "5px", height: "10px"}}/>
                    </Box>
                    <Box minWidth={35}>
                        <small className="">{`${subject.progress ? subject.progress : 0}%`}</small>
                    </Box>
                </Box>
            </Col>
            <Col xs={1} className="d-flex justify-content-end p-0">
                {removable &&
                <IconButton size="small" className="text-danger">
                    <ClearIcon onClick={()=>removeSub(subject, ind)}/>
                </IconButton>}
            </Col>
        </ListGroup.Item>
    )
}