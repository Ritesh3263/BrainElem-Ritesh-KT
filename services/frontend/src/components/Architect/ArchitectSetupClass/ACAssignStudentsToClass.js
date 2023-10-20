import React, {useEffect, useState} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import {Col, ListGroup} from "react-bootstrap";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import DialogActions from "@material-ui/core/DialogActions";
import Avatar from "@material-ui/core/Avatar";
import Checkbox from "@material-ui/core/Checkbox";
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(theme=>({}))

export default function ACAssignTraineesToClass({isOpen, setOpen, allTrainees, updateTraineesInClass, setAllTrainees}){
    const { t, i18n, translationsLoaded } = useTranslation();
    const classes = useStyles();
    const [allTraineesArray, setAllTraineesArray] = useState([]);

    async function setTrainees(){
        await allTrainees.map((trainee)=>{
            setAllTraineesArray(p=>{
                let val = Object.assign([],p);
                val.push({
                    _id : trainee._id,
                    username : trainee.username,
                    details:{
                        fullName : trainee.details.fullName ? trainee.details.fullName : "-",
                        gender : trainee.details.gender ? trainee.details.gender : "-",
                        lang : trainee.details.lang ? trainee.details.lang : "-",
                        city : trainee.details.city ? trainee.details.city : "-",
                        district: trainee.details.district ? trainee.details.district : "-",
                        dateOfBirth: trainee.details.dateOfBirth ? trainee.details.dateOfBirth : "-",
                        isSelected: false,
                    },
                });
                return val;
            });
        })
    }

    useEffect(()=>{
        setTrainees().then();
    },[allTrainees])

    const traineesList = allTraineesArray.map((trainee, index)=>(
        <ListGroup.Item className="pl-0 pr-0 d-flex justify-content-between align-items-center">
            <Col xs={1}><Avatar style={{width: "25px", height: "25px", backgroundColor: `rgba(82, 57, 112, 1)`}}>{index+1}</Avatar></Col>
            <Col xs={2}>{trainee.details ? trainee.details.fullName : "-"}</Col>
            <Col xs={1}>{trainee.details.username ? trainee.details.username : "-"}</Col>
            <Col xs={1}>{trainee.details.lang ? trainee.details.lang : "-"}</Col>
            <Col xs={1}>{trainee.details.city ? trainee.details.city : "-"}</Col>
            <Col xs={1}>{trainee.details.district ? trainee.details.district : "-"}</Col>
            <Col xs={2}>{trainee.details.dateOfBirth ? (new Date(trainee.details.dateOfBirth).toLocaleDateString()) : "-"}</Col>
            <Col xs={1}>
                <Checkbox
                    edge="end"
                    checked={allTrainees.isSelected}
                    onChange={()=>{
                        setAllTraineesArray(p=>{
                            let val = Object.assign([],p);
                            val[index].isSelected = !val[index].isSelected;
                            return val;
                        })
                    }}
                />
            </Col>
        </ListGroup.Item>
    ))

    return(
        <Dialog
            open={isOpen}
            onClose={()=>{
                setOpen(false)
                setAllTrainees([])
            }}
            maxWidth={'md'}
            fullWidth={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title" className="text-center"><h4 className="text-primary">{t("Manage assignments")}</h4></DialogTitle>
            <DialogContent>
                {/*<DialogContentText id="alert-dialog-description">*/}
                {/*    Let Google help apps determine location. This means sending anonymous location data to*/}
                {/*    Google, even when no apps are running.*/}
                {/*</DialogContentText>*/}
                <ListGroup>
                    <div className="pl-2 pr-2 pb-3 d-flex justify-content-between align-items-center">
                        <Col xs={1} className="text-muted">No.</Col>
                        <Col xs={2} className="text-muted">Name</Col>
                        <Col xs={1} className="text-muted">Gender</Col>
                        <Col xs={1} className="text-muted">Lang.</Col>
                        <Col xs={1} className="text-muted">City</Col>
                        <Col xs={1} className="text-muted">District</Col>
                        <Col xs={2} className="text-muted">Birth date</Col>
                        <Col xs={1} className="text-muted text-right pr-1">
                            <ArrowDropDownIcon/>
                        </Col>
                    </div>
                    {traineesList}
                </ListGroup>
            </DialogContent>
            <DialogActions className="d-flex justify-content-end ml-3 mr-3">
                <Button variant="outline-primary" onClick={()=>setOpen(false)}>
                    Back
                </Button>
                <Button variant="success"
                    onClick={()=>{
                        updateTraineesInClass({type:"add", data: allTraineesArray});
                        setOpen(false);
                    }}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )
}