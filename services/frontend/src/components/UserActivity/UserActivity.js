import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Accordion, Badge, Button, Col, ListGroup, Row} from "react-bootstrap";
import Avatar from '@material-ui/core/Avatar';
import Box from "@material-ui/core/Box";
import Card from '@material-ui/core/Card';
import LinearProgress from '@material-ui/core/LinearProgress';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import {now} from "moment";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloudDoneIcon from '@material-ui/icons/CloudDone';
import CloudOffIcon from '@material-ui/icons/CloudOff';
import HourglassFullIcon from '@material-ui/icons/HourglassFull';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import UsersActivityService from "../../services/usersActivity.service"
import MenuItem from "@material-ui/core/MenuItem";

export default function UserActivity(){
    const navigate = useNavigate();
    const [managers, setManagers] = useState([
        {
            _id:"07fh83",
            username: "Mgo 1"
        },
        {
            _id:"fe7r8fhe",
            username: "Mgo 2"
        },
        {
            _id:"8j9gtjgf",
            username: "Mgo 3"
        },
    ]);
    const [moduleManagers, setModuleManagers] = useState([
        {
            _id:"07fh83",
            username: "Mod-Mgo 1"
        },
        {
            _id:"fe7r8fhe",
            username: "Mod-Mgo 2"
        },
        {
            _id:"8j9gtjgf",
            username: "Mod-Mgo 3"
        },
    ]);
    const [activity, setActivity] = useState([])

    useEffect(()=>{
        UsersActivityService.getUsersActivity().then(res=>{
            setActivity(res.data);
        })
    },[]);


    const managersList = managers.map((item, index)=><MenuItem key={index} value={item.username}>{item.username}</MenuItem>);
    const moduleManagersList = moduleManagers.map((item, index)=><MenuItem key={index} value={item.username}>{item.username}</MenuItem>);


    const activityList = activity.map((item, index)=>
        (<CardContent key={index}>
            <Row className="d-flex justify-content-between align-items-center">
                <Col md={1}>
                    <Avatar style={{width: "25px", height: "25px"}}>{index+1}</Avatar>
                </Col>
                <Col md={2} className="text-center">
                    {item.date  ? new Date(item.date).toLocaleString() : "-"}
                </Col>
                <Col md={2} className="text-center">
                    {item.assigment ? item.assigment : "-"}
                </Col>
                <Col md={2} className="text-center">
                    {item.username ? item.username : "-"}
                </Col>
                <Col md={4} className="text-center">
                    {item.actionType ? item.actionType : "-"}
                </Col>
            </Row>
        </CardContent>));

    return(
        <div className="p-0 fluid m-0">
            <ListGroup>
                <Row className="d-flex justify-content-center">
                    <h3 className="text-muted pl-5 pr-5">
                        User Activity
                    </h3>
                </Row>
            </ListGroup>
            <ListGroup className="mt-3">
                <ListGroup.Item >
                    <Row className="d-flex flex-fill mt-3">
                        <Col md={6}>
                            <FormControl style={{width:"50%"}} margin="normal">
                                <InputLabel id="mgo-1">Select Manager</InputLabel>
                                <Select
                                    labelId="mgo-1"
                                    id="mgo-1"
                                    value={activity.username}
                                    // renderValue={p=> p.levelName}
                                    input={<Input />}
                                    // onChange={(e) => {
                                    //     setMSCurriculum(p=>{
                                    //         let val = Object.assign({},p);
                                    //         val.level = e.target.value;
                                    //         return val;
                                    //     })
                                    // }}
                                >
                                    {managersList}
                                </Select>
                            </FormControl>
                        </Col>
                        <Col xs={6} >
                            <FormControl style={{width:"50%"}} margin="normal">
                                <InputLabel id="mgo-2">Select Module Manager</InputLabel>
                                <Select
                                    labelId="mgo-2"
                                    id="mgo-2"
                                    // value={MSCurriculum.level}
                                    // renderValue={p=> p.levelName}
                                    input={<Input />}
                                    // onChange={(e) => {
                                    //     setMSCurriculum(p=>{
                                    //         let val = Object.assign({},p);
                                    //         val.level = e.target.value;
                                    //         return val;
                                    //     })
                                    // }}
                                >
                                    {moduleManagersList}
                                </Select>
                            </FormControl>
                        </Col>
                    </Row>
                </ListGroup.Item>
            </ListGroup>

            <Grid className="d-flex flex-row justify-content-between align-content-center">
                <Card className="p-0 mt-5 flex-fill mr-2">
                    <CardContent>
                        <Row className="d-flex justify-content-between pr-2 mt-4">
                            <Col md={1} className="text-muted text-left">
                                No.
                            </Col>
                            <Col md={2} className="text-muted text-center">
                                Date
                            </Col>
                            <Col md={2} className="text-muted text-center">
                                Assigment
                            </Col>
                            <Col md={2} className="text-muted text-center">
                                User name
                            </Col>
                            <Col md={4} className="text-muted text-center">
                                Action taken
                            </Col>
                        </Row>
                    </CardContent>
                    {activityList ? activityList : null}
                </Card>
            </Grid>
        </div>
    )
}