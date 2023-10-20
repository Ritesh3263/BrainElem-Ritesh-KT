import React, {useEffect, useState} from "react";
import {Accordion, Col, ListGroup, Row, Form} from "react-bootstrap";
import { useNavigate} from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Checkbox from '@material-ui/core/Checkbox';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import {parse, unparse} from "papaparse"
import ModuleService from "../../../services/module.service"
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import Grid from "@material-ui/core/Grid";
import {Paper} from "@material-ui/core";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CompanyService from "../../../services/company.service"
import {useTranslation} from "react-i18next";
import {useMainContext} from "../../_ContextProviders/MainDataContextProvider/MainDataProvider";

const useStyles = makeStyles(theme=>({}))

export default function PartnerImportForm({setCurrentTab}){
    const { t, i18n, translationsLoaded } = useTranslation();
    const {F_showToastMessage, F_getHelper} = useMainContext();
    const {manageScopeIds} = F_getHelper();
    const classes = useStyles();
    const navigate = useNavigate();
    const [MSUsers, setMSUsers] = useState([])
    // const [preparedDataToSave,setPreparedDataToSave] =useState([])
    const [remainingUserLimit, setRemainingUserLimit] = useState(0);
    const [currentCount, setCurrentCount] = useState(0);
    const [MSExample,setMSExample] = useState([
        {
            name: "Adjani",
            surname: "Isabella",
            username: "isabella",
            password: "Testing123!",
            role: "Examiner",

            language: "FR", // to be taken from the inviting user settings
            phone: "+0123456789",
            street: "13",
            Building: "Tower A",
            city: "Paris",
            postCode: "43002",
            country: "Country 1",
            dateOfBirth: "11.01.1992",
            // gender: "F", // we should have this info, but not currently in the model
            email: "isabella@test.com",
            isSelected: "FALSE",
        },
        {
            name: "Pierre",
            surname: "Almond",
            username: "almond",
            password: "Testing123!",
            role: "Examiner",

            language: "PL", // to be taken from the inviting user settings
            phone: "+0123456789",
            street: "16/2",
            Building: "PMK building",
            city: "Paris",
            postCode: "32352",
            country: "Country 2",
            dateOfBirth: "11.12.1967",
            // gender: "M", // we should have this info, but not currently in the model
            email: "almond@test.com",
            isSelected: "TRUE",
        },
        {
            name: "Natalie",
            surname: "Portman",
            username: "portman",
            password: "Testing123!",
            role: "Examiner",

            language: "FR", // to be taken from the inviting user settings
            phone: "+0123456789",
            street: "11/A",
            Building: "Sunflower",
            city: "Paris",
            postCode: "3242",
            country: "Country 3",
            dateOfBirth: "09.06.1981",
            // gender: "F", // we should have this info, but not currently in the model
            email: "portman@test.com",
            isSelected: "TRUE",
        },
        {
            name: "James",
            surname: "Hook",
            username: "hook",
            password: "Testing123!",
            role: "Examiner",

            language: "FR", // to be taken from the inviting user settings
            phone: "+0123456789",
            street: "11/A",
            Building: "Sunflower",
            city: "Paris",
            postCode: "3242",
            country: "Country 3",
            dateOfBirth: "09.06.1981",
            // gender: "F", // we should have this info, but not currently in the model
            email: "hook@test.com",
            isSelected: "TRUE",
        },
        {
            name: "Alan",
            surname: "Wake",
            username: "wake",
            password: "Testing123!",
            role: "Examiner",
            language: "FR", // to be taken from the inviting user settings
            phone: "+0123456789",
            street: "11/A",
            Building: "Sunflower",
            city: "Paris",
            postCode: "3242",
            country: "Country 3",
            dateOfBirth: "09.06.1981",
            // gender: "F", // we should have this info, but not currently in the model
            email: "wake@test.com",
            isSelected: "TRUE",
        },
    ])

    useEffect(()=>{
        ModuleService.remainingUserCountInModule(manageScopeIds.moduleId).then(res=>{
            setRemainingUserLimit(res.data.count)
        }).catch(error=>console.error(error))
    },[])

    async function prepareDataToSave(){
        let data = MSUsers.filter(user=> user.isSelected === true);
        let newData = [];
        newData = data.map(user=> {
            // let year = user.dateOfBirth.slice(6, 10);
            // let month = user.dateOfBirth.slice(3, 5);
            // let day = user.dateOfBirth.slice(0, 2);
            // let newDate = new Date( year+0,month-1,day+0);
            delete user.dateOfBirth;
            return user;
        })
        // console.log("tutaj",newData);
        return newData;
    }


    function saveData(){
        prepareDataToSave().then(data=>{
            if(data){
                CompanyService.uploadPartnerExaminersFromCsv(data).then(
                    res=>{
                        F_showToastMessage(res.data.message, 'success');
                        setCurrentTab({openTab:0, type:""});
                    },
                    error=>{
                        F_showToastMessage(JSON.stringify(error.response.data.message.writeErrors.map(x=>x.errmsg)), 'error')
                    }
                );
            }
        })
    }

    const MSUsersList = MSUsers.map((user, index)=>
        (<ListGroup.Item className="pl-2 pr-2 d-flex justify-content-between align-items-center" key={index} style={{backgroundColor: user.isSelected ? `rgba(255,255,255,1)` :`rgba(255,255,255,0.35)`}}>
            <Col xs={1}><Avatar style={{width: "25px", height: "25px"}}>{index+1}</Avatar></Col>
            <Col >{user.name}</Col>
            <Col >{user.surname ? user.surname : "-"}</Col>
            <Col >{user.username ? user.username : "-"}</Col>
            <Col >{user.password ? user.password : "-"}</Col>
            <Col >{user.role ? user.role : "-"}</Col>
            {/* optional */}
            {/* <Col >{user.gender ? user.gender : "-"}</Col> */}
            {/* <Col >{user.language ? user.language : "-"}</Col>
            <Col >{user.phone ? user.phone : "-"}</Col>
            <Col >{user.street ? user.street : "-"}</Col>
            <Col >{user.Building ? user.Building : "-"}</Col>
            <Col >{user.city ? user.city : "-"}</Col>
            <Col >{user.postCode ? user.postCode : "-"}</Col>
            <Col >{user.country ? user.country : "-"}</Col>
            <Col >{user.dateOfBirth ? user.dateOfBirth : "-"}</Col>
            <Col >{user.email ? user.email : "-"}</Col> */}
            <Col className="text-center">
                <Checkbox
                    edge="end"
                    checked={user.isSelected}
                    disabled={!user.isSelected && currentCount>=remainingUserLimit}
                    onChange={()=>{
                        setMSUsers(p=>{
                            let val = Object.assign([],p);
                            val[index].isSelected = !val[index].isSelected;
                            setCurrentCount(currentCount+ (val[index].isSelected?1:-1))
                            return val;
                        })
                    }}
                />
            </Col>
            {/*<Col  md={1} className="text-right">*/}
            {/*    <IconButton size="small">*/}
            {/*        <button className="btn" onClick={()=>{navigate(`/modules-core/users/form/${user._id}`)}}><BsPencil/></button>*/}
            {/*    </IconButton>*/}
            {/*</Col>*/}
        </ListGroup.Item>));

    return(
        <>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper elevation={12} className="p-2 text-center">
                        <Grid container>
                            <Grid item xs={6} className="text-left">
                                <Button variant="contained" size="small" color="secondary" className="mr-4"
                                        onClick={()=> {setCurrentTab({openTab:0, type:""})}}>
                                    Back
                                </Button>
                                <input
                                    style={{display:"none"}}
                                    accept="text/csv"
                                    id="usersCsvInput"
                                    multiple
                                    type="file"
                                    onChange={async()=> {
                                        const element = document.getElementById('usersCsvInput').files[0];
                                        // Application should accept only text/csv excel problem is that in different countries the dot and comma decimal operators are used alternately,
                                        // if it is dot ok, if the comma is problem (because csv is comma separated values) and values, each comma separates the value, it causes errors.
                                        // But for now, we can leave it, it remains to be seen what will come of it.

                                        if(element && (element.type == "application/vnd.ms-excel" || element.type === "text/csv")){
                                            const importData = await element.text();
                                            const parsedData = parse(importData, {header: true});
                                            parsedData.data.map(item=> item.isSelected === "TRUE" ? item.isSelected = true : item.isSelected = false);
                                            let currentCount = parsedData.data.filter(x=>x.isSelected).length
                                            if((currentCount - remainingUserLimit)>0) parsedData.data.map(item=> {
                                                if ((currentCount - remainingUserLimit)>0 && item.isSelected) {
                                                    item.isSelected = false
                                                    currentCount--
                                                }
                                                return item
                                            });
                                            setCurrentCount(currentCount)
                                            setMSUsers(parsedData.data);
                                            //setTimeout(()=> loadCSVFile(),400);
                                        }else{
                                            // valid -> user csv file
                                        }
                                    }}
                                />
                                <label htmlFor="usersCsvInput">
                                    <Button size="small" variant="contained" color="primary" component="span" startIcon={<CloudUploadIcon />}>
                                        Upload csv file
                                    </Button>
                                </label>
                            </Grid>
                            <Grid item xs={6} className="d-flex justify-content-between">
                                <Button variant="contained" size="small" color="secondary"
                                        disabled={MSUsers.length <1}
                                        onClick={()=> {
                                            setMSUsers([]);
                                            setCurrentCount(0)
                                        }}>
                                    Clear
                                </Button>
                                <Button size="small" variant="contained" color="primary"
                                        startIcon={<SaveAltIcon/>}
                                        onClick={()=> {
                                            const csv = unparse(MSExample, {header: true});
                                            const blob = new Blob([csv]);
                                            const a = document.createElement('a');
                                            a.href = URL.createObjectURL(blob,{type:"text/csv"});
                                            a.download = "sample.csv"
                                            document.body.appendChild(a);
                                            a.click();
                                            document.body.removeChild(a);
                                        }}>
                                    Download example
                                </Button>
                            </Grid>
                        </Grid>

                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper elevation={12} className="p-2">
                        <Accordion defaultActiveKey="0" >
                            {MSUsers.length >0 ?
                                <Card className="p-0 d-flex flex-column" style={{borderRadius:"8px", backgroundColor:`rgba(255,255,255,0.35)`}}>
                                    <h4 className="text-center mt-2 mb-2">Import data preview (push save to upload data)</h4>
                                    <small className="text-center mt-2 mb-2">Selected users: {currentCount} (You can add {remainingUserLimit - currentCount} more new users)</small>
                                    <CardContent>
                                        <Row className="d-flex justify-content-between">
                                            <Col xs={1} className=""><small>No.</small></Col>
                                            <Col className=""><small>Name</small></Col>
                                            <Col className=""><small>Surname</small></Col>
                                            <Col className=""><small>Username</small></Col>
                                            <Col className=""><small>Password</small></Col>
                                            <Col className=""><small>Role</small></Col>
                                            {/* optional */}
                                            {/* <Col className="text-muted">Gender</Col> */}
                                            {/* <Col className="text-muted">Lang.</Col>
                                        <Col className="text-muted">phone</Col>
                                        <Col className="text-muted">street</Col>
                                        <Col className="text-muted">Building</Col>
                                        <Col className="text-muted">city</Col>
                                        <Col className="text-muted">postCode</Col>
                                        <Col className="text-muted">country</Col>
                                        <Col className="text-muted">Date of birth</Col>
                                        <Col className="text-muted">Email</Col> */}
                                            <Col className="text-center"><small>Selected</small></Col>
                                            {/*<Col xs={1} className="text-right"><SettingsIcon/></Col>*/}
                                        </Row>
                                    </CardContent>
                                    {MSUsersList ? MSUsersList : null}
                                    <CardActionArea>
                                        <CardActions>
                                            <Grid container>
                                                <Grid item xs={6}>
                                                    <Button className="mr-5" variant="contained" size="small" color="secondary" onClick={()=> {setCurrentTab({openTab:0, type:""})}}>Back</Button>
                                                </Grid>
                                                <Grid item xs={6} className="text-right">
                                                    <Button variant="contained" color="primary" disabled={MSUsers.length <1} onClick={saveData}>{t("Save")}</Button>
                                                </Grid>
                                            </Grid>
                                        </CardActions>

                                    </CardActionArea>
                                </Card> : <span className="text-center">Import data</span>}
                        </Accordion>
                    </Paper>
                </Grid>
            </Grid>
        </>
    )
}