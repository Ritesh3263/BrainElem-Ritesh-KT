import React, {useEffect, useState} from "react";
import {Col, Form, ListGroup, Row} from "react-bootstrap";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import EventService from "../../../services/event.service";
import ChaptersList from "./ChaptersList";
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';

export default function MyClasses({classes,addEvent}){
    const [value, setValue] = useState(0);
    const [currentGroupId, setCurrentGroupId] =useState(null);
    const [subjects, setSubjects]= useState([]);
    const [trainingPath, setTrainingPath] = useState("");
    const [originalTrainingModuleId, setOriginalTrainingModuleId] = useState("");
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [chapters, setChapters] = useState([]);

    // When will be more classes -> do test if changing deps. data
    // selectedCLass => (to add) onClick class tab, change selected class? for check
    // Selected class => name is currentGroupId

    useEffect(()=>{
        if(classes.length > 0){
            setCurrentGroupId(classes[0]._id);
            // missing periodId // this file is not in use
            EventService.readTrainingModules(classes[0]._id).then(res=>{
                // for select list
                setSubjects(res.data.trainingModules);
                // set current subject
                if(res.data.trainingModules){
                    setSelectedSubject(res.data.trainingModules[0].originalTrainingModule);
                    // set original training module id:
                    setOriginalTrainingModuleId(res.data.trainingModules[0].originalTrainingModule);
                    // training path id;
                    setTrainingPath(res.data._id);
                    EventService.readChapters(res.data.trainingModules[0].originalTrainingModule, res.data._id).then(res=>{
                        setChapters(res.data);
                    })
                }
            })
        }
    },[classes]);

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    function getSubjects(group){
        console.log("clicked class",group)
        // clicked subject id: group._id
        setCurrentGroupId(group._id);
        // missing periodId // this file is not in use
        EventService.readTrainingModules(group._id).then(res=>{
            // for current selected class
            setSubjects(res.data.trainingModules);
            setTrainingPath(res.data._id)
        });
    };

    function getChapters(trainingModuleId){
        // original training module id
        EventService.readChapters(trainingModuleId, trainingPath).then(res=>{
            setChapters(res.data);
        })
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    function TabPanel({ children, value, index, ...other }) {
        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`full-width-tabpanel-${index}`}
                aria-labelledby={`full-width-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box pl={1} pt={2}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    };

    const classesList = classes.length >0 ? classes.map((item,index)=>(<Tab key={item._id} label={item.name} {...a11yProps(index)} onClick={()=>getSubjects(item)}/>)): [];
    const subjectsList = subjects ? subjects.map((item,index)=><MenuItem key={item.originalTrainingModule} value={item.originalTrainingModule} orgTrId={item.originalTrainingModule}>{item.newName}</MenuItem>): null;
    const chaptersListPreview = chapters ? chapters.map((item,index)=><ChaptersList key={item._id} value={item._id} item={item} index={index} trainingPathId={trainingPath} addEvent={addEvent} selectedSubject={selectedSubject} currentGroupId={currentGroupId} originalTrainingModuleId={originalTrainingModuleId}/>): null;

    const classesListContent = classes.length >0 ? classes.map((item,index)=>(
        <TabPanel value={value} index={index} key={index}>
            <Form as={Row}>
                <Col md={12} className="d-flex flex-column">
                    <InputLabel id="demo-simple-select-label"  margin="normal"><small>Select subject</small></InputLabel>
                    <Select
                        style={{width:"50%"}}
                        margin="normal"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        // disabled={!currentEvent.assignedClass}
                        value={selectedSubject}
                        input={<Input/>}
                        // renderValue={p=> p.newName}
                        onChange={(e,objData) => {
                            getChapters(objData.props.orgTrId);
                            setOriginalTrainingModuleId(objData.props.orgTrId);
                            setSelectedSubject(e.target.value);
                        }}
                    >
                        {subjectsList}
                    </Select>

                    <List
                        className="mt-4"
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                        subheader={
                            <ListSubheader component="div" id="nested-list-subheader" className="text-center">Chapters</ListSubheader>
                        }
                    >
                        {chaptersListPreview}
                    </List>
                </Col>
            </Form>
        </TabPanel>
    )):null;


    return(
        <ListGroup.Item className="d-flex flex-column align-items-left mt-2" style={{border: "1px solid lightgrey"}}>
            <h6 className="text-center"><strong>Your classes</strong></h6>
            {classes.length>0 ? (
                <>
                <AppBar position="static" color="default" className="m-0">
                <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
                >
            {classesList ? classesList : null}
                </Tabs>
                </AppBar>
            {classesListContent}
            </>
            ):(
             <span className="text-center">You don't have any assigned class</span>
             )}
        </ListGroup.Item>
    )
}