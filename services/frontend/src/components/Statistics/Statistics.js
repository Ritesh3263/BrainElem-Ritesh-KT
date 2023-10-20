import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Button, Col, ListGroup, Row} from "react-bootstrap";
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
import TextField from "@material-ui/core/TextField";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";

export default function Statistics(){
    const navigate = useNavigate();
    const [statistics, setStatistics] = useState([
        {
            _id:"07fh83",
            type: "Users"
        },
        {
            _id:"fe7r8fhe",
            type: "Else 1"
        },
        {
            _id:"8j9gtjgf",
            type: "Else 2"
        },
    ]);
    const [modules, setModules] = useState([
        {
            _id:"07fh83",
            name: "School Module 1"
        },
        {
            _id:"fe7r8fhe",
            name: "School Module 2"
        },
        {
            _id:"8j9gtjgf",
            name: "School Module 2"
        },
    ]);

    useEffect(()=>{
    },[]);


    const statisticsTypesList = statistics.map((item, index)=><MenuItem key={index} value={item.type}>{item.type}</MenuItem>);
    const modulesList = modules.map((item, index)=><MenuItem key={index} value={item.name}>{item.name}</MenuItem>);



    return(
        <div className="p-0 fluid m-0">
            <ListGroup>
                <Row className="d-flex justify-content-center">
                    <h3 className="text-muted pl-5 pr-5">
                        Statistics
                    </h3>
                </Row>
            </ListGroup>

            <Grid className="d-flex flex-row justify-content-center align-items-center">
                <Card className="p-0 mt-2 flex-fill mr-2">
                    <CardContent>
                        <Row className="d-flex justify-content-center">
                            <Col md={4} className="d-flex align-items-center">
                                <FormControl style={{width:"80%"}}>
                                    <InputLabel id="demo-simple-select-label">Statistic to display</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={"Users"}
                                        // renderValue={p=> p.name}
                                        input={<Input/>}
                                        // onChange={(e) => {
                                        //     setMSClass(p=>{
                                        //         let val = Object.assign({},p);
                                        //         val.level = e.target.value;
                                        //         return val;
                                        //     })
                                        // }}
                                    >
                                        {statisticsTypesList}
                                    </Select>
                                </FormControl>
                            </Col>
                            <Col md={8} className="d-flex align-items-center justify-content-end">
                                <Button className="mr-3"
                                        disabled={true}
                                    onClick={()=>{}}
                                >Export to jpg</Button>
                                <Button
                                    disabled={true}
                                    onClick={()=>{}}
                                >Export to pdf</Button>
                            </Col>
                        </Row>
                        <Row className="d-flex justify-content-center mt-5">
                            <Col md={4} className="d-flex flex-column align-items-start">

                                <TextField label="Start date" style={{width:"80%"}} margin="normal"
                                           type="date"
                                           InputLabelProps={{
                                               shrink: true,
                                           }}
                                           // value={subscriptionUser.dateOfBirth}
                                           // onChange={(e) => {
                                           //     setSubscriptionUser(p=>{
                                           //         let val = Object.assign({},p);
                                           //         val.dateOfBirth = e.target.value;
                                           //         return val;
                                           //     })
                                           // }}
                                />

                                <TextField label="End date" style={{width:"80%"}} margin="normal"
                                           type="date"
                                           InputLabelProps={{
                                               shrink: true,
                                           }}
                                    // value={subscriptionUser.dateOfBirth}
                                    // onChange={(e) => {
                                    //     setSubscriptionUser(p=>{
                                    //         let val = Object.assign({},p);
                                    //         val.dateOfBirth = e.target.value;
                                    //         return val;
                                    //     })
                                    // }}
                                />

                                <FormControl component="fieldset" className="mt-3">
                                    <FormLabel component="legend" className="mb-0">Select the group</FormLabel>
                                    <RadioGroup aria-label="public-visible" name="public-visible"
                                        value={"Modules"}
                                        // onChange={e=>setMSCurriculum(p=>{
                                        // let val = Object.assign({},p);
                                        // val.isPublic = (e.target.value === "true") ? true : false;
                                        // return val;
                                        // })}
                                    >
                                        <FormControlLabel className="mt-0 mb-0" value={"Entity ecosystem"} control={<Radio />} label="Entity ecosystem" />
                                        <FormControlLabel className="mt-0 mb-0" value={"Subscriptions"} control={<Radio />} label="NetworksList" />
                                        <FormControlLabel className="mt-0 mb-0" value={"Modules"} control={<Radio />} label="Modules" />
                                    </RadioGroup>
                                </FormControl>

                                <FormControl style={{width:"80%"}}>
                                    <InputLabel id="demo-simple-select-label">Select sub / module</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={"School Module 1"}
                                        // renderValue={p=> p.name}
                                        input={<Input/>}
                                        // onChange={(e) => {
                                        //     setMSClass(p=>{
                                        //         let val = Object.assign({},p);
                                        //         val.level = e.target.value;
                                        //         return val;
                                        //     })
                                        // }}
                                    >
                                        {modulesList}
                                    </Select>
                                </FormControl>
                            </Col>
                            <Col md={8} className="d-flex align-items-center justify-content-center">
                                <p>Chart</p>
                            </Col>
                        </Row>
                    </CardContent>
                </Card>
            </Grid>
        </div>
    )
}