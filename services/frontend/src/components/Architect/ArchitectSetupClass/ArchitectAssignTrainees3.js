import React, {useEffect, useState} from "react";
import {Col, ListGroup} from "react-bootstrap";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import moduleCoreService from "../../../services/module-core.service";
import ACAssignTraineesToClass from "./ACAssignTraineesToClass";
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import AssignmentIcon from '@material-ui/icons/Assignment';
import {useTranslation} from "react-i18next";
import {useMainContext} from "../../_ContextProviders/MainDataContextProvider/MainDataProvider";

const useStyles = makeStyles(theme=>({}))

export default function ArchitectAssignTrainees3({MSClass,setMSClass, basicValidators}){
    const { t, i18n, translationsLoaded } = useTranslation();
    const {F_getHelper} = useMainContext();
    const {manageScopeIds} = F_getHelper();
    const classes = useStyles();
    const [allTrainees,setAllTrainees]=useState([]);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);

    useEffect(()=>{
        moduleCoreService.readAllTrainees(manageScopeIds.moduleId).then(res=>{
           setAllTrainees(res.data.map(i=>({...i,isSelected: false})));
        });
    },[]);


    async function updateTraineesInClass({type,data}){
        switch (type){
            case "add":{
                let newTraineesInClass = data.filter((trainee,index)=>trainee.isSelected);
                setMSClass(p=>{
                    let val = Object.assign({},p);
                    newTraineesInClass.forEach((trainee,index)=>{
                        val.trainees.push({
                            _id : trainee._id,
                            username : trainee.username,
                            name : trainee.name,
                            surname : trainee.surname,
                            details:{
                                fullName : trainee.details.fullName ? trainee.details.fullName : "-",
                                gender : trainee.details.gender ? trainee.details.gender : "-",
                                lang : trainee.details.lang ? trainee.details.lang : "-",
                                city : trainee.details.city ? trainee.details.city : "-",
                                district: trainee.details.district ? trainee.details.district : "-",
                                dateOfBirth: trainee.details.dateOfBirth ? trainee.details.dateOfBirth : "-",
                            },
                        });
                    });
                    return val;
                })
                break;
            }
            case "remove":{
                setMSClass(p=>{
                    let val = Object.assign({},p);
                        val.trainees.splice(data,1);
                    return val;
                })
                break;
            }
            default : break;
        }
    }


    const traineesList = MSClass.trainees ? MSClass.trainees.map((trainee, index)=>(
        <ListGroup.Item className="pl-0 pr-0 mb-2 d-flex justify-content-between align-items-center" style={{backgroundColor:`rgba(255,255,255,0.35)`, borderRadius:"8px"}}>
            <Col xs={1}><Avatar style={{width: "25px", height: "25px", backgroundColor: `rgba(82, 57, 112, 1)`}}>{index+1}</Avatar></Col>
            <Col xs={2}><>{trainee.name} {trainee.surname}</></Col>
            <Col xs={1}>{trainee.details.gender ? trainee.details.gender : "-"}</Col>
            <Col xs={1}>{trainee.details.lang ? trainee.details.lang : "-"}</Col>
            <Col xs={1}>{trainee.details.city ? trainee.details.city : "-"}</Col>
            <Col xs={1}>{trainee.details.district ? trainee.details.district : "-"}</Col>
            <Col xs={2}>{ trainee.details.dateOfBirth ? (new Date(trainee.details.dateOfBirth).toLocaleDateString()) : "-"}</Col>
            <Col xs={1} className="text-right">
                <IconButton size="small" className="text-danger">
                    <ClearIcon onClick={()=>{
                        updateTraineesInClass({type: "remove",data: index});
                    }}/>
                </IconButton>
            </Col>
        </ListGroup.Item>
    )):null

    return(
        <>
            <h5 className="text-right my-4">
                <Button classes={{root: classes.root}} size="small" variant="contained" color="primary" startIcon={<AssignmentIcon/>} onClick={()=>setIsUserModalOpen(true)}>{t("Assign trainees")}</Button>
            </h5>
            {basicValidators.assignedTrainees&&(
                <h6 className="text-center text-danger">{t("You haven't assigned any trainee to class")}</h6>
            )}
        <hr/>
            <ListGroup>
                <div className="pl-2 pr-2 pb-1 d-flex justify-content-between align-items-center">
                    <Col xs={1} className=""><small>No.</small></Col>
                    <Col xs={2} className=""><small>{t("Trainee name")}</small></Col>
                    <Col xs={1} className=""><small>{t("Gender")}</small></Col>
                    <Col xs={1} className=""><small>{t("Lang")}</small></Col>
                    <Col xs={1} className=""><small>{t("City")}</small></Col>
                    <Col xs={1} className=""><small>{t("District")}</small></Col>
                    <Col xs={2} className=""><small>{t("Birth date")}</small></Col>
                    <Col xs={1} className=" text-right pr-1">
                        <ArrowDropDownIcon/>
                    </Col>
                </div>
                {traineesList}
            </ListGroup>
            <ACAssignTraineesToClass isOpen={isUserModalOpen} setOpen={setIsUserModalOpen} allTrainees={allTrainees} updateTraineesInClass={updateTraineesInClass}
                                     setAllTrainees={setAllTrainees}/>
        </>
    )
}