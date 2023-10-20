import React, {useEffect, useState} from "react";
import CertificationSessionService from "services/certification_session.service";
import Grid from "@material-ui/core/Grid";
import {Paper} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {useTranslation} from "react-i18next";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import Chip from "@material-ui/core/Chip";

export default function MyGroups(){
    const {t} = useTranslation();
    const [model, setModel] = useState({
        selectedSession: undefined,
        selectedGroup: undefined, //?
        selectedCourse: undefined,
    });

    const [userSessions, setUserSessions] = useState([]);
    const [userGroups, setUserGroups] = useState([]); //?
    const [userCourses, setUserCourses] = useState([]);
    const [courseChapters, setCourseChapters] = useState([]);
    const [isItemOpen, setIsItemOpen] = useState(false);


    useEffect(()=>{
        CertificationSessionService.readAllUserSessions().then(res=>{
            if(res?.status === 200 && res?.data?.length>0){
                setUserSessions(res.data);
            }
        }).catch(err=>console.log(err));
    },[]);

    const readCurrentSession=(sessionId)=>{
        if(sessionId){
            CertificationSessionService.read(sessionId).then(res=>{
                if(res?.status === 200 && res?.data){
                    if(res.data.groups){
                        setUserGroups(res.data.groups);
                    }
                }
            }).catch(err=>console.log(err));
        }
    };

    const readCurrentGroup=(groupId)=>{
        if(groupId){
            let group = userGroups.find(group=>group._id===groupId);
            setUserCourses(group.duplicatedCoursePath?.courses);
        }
    };

    const readCurrentCourse=(courseId)=>{
        if(courseId){
            let selectedCourse = userCourses.find(i=> i._id === courseId);
           if(selectedCourse && selectedCourse?.chosenChapters?.length>0){
                setCourseChapters(selectedCourse?.chosenChapters);
           }
        }
    };

    const sessionsList = userSessions?.length>0 ? userSessions.map((item, index)=><MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>) : [];
    const groupsList = userGroups?.length>0 ? userGroups.map((item, index)=><MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>) : [];
    const coursesList = userCourses?.length>0 ? userCourses.map((item, index)=><MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>) : [];

    const currentChaptersList = courseChapters?.length>0 ? courseChapters.map(({chapter,chosenContents},index)=>(
        <>
            <ListItem button onClick={()=>setIsItemOpen(p=>!p)}
                      className={!isItemOpen && "mb-3"}
                      style={{backgroundColor:'rgba(255,255,255,0.45)',
                          borderRadius: '8px'
                      }}>
                <ListItemIcon>
                    <Avatar style={{width: "25px", height: "25px", backgroundColor: "rgba(82, 57, 112, 1)"}}>{index+1}</Avatar>
                </ListItemIcon>
                <ListItemText primary={chapter?.name || "-"}/>
                {isItemOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
        <Collapse in={isItemOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding className='ml-3 pl-3'
                  subheader={
                      <Typography variant="body2" component="h2" className="text-left mb-1 mt-2" style={{color: `rgba(82, 57, 112, 1)`}}>
                          {t("Contents")}
                      </Typography>
                  }
            >
                {chosenContents?.length>0 ? (
                    chosenContents.map(({content}, ind)=>(
                        <ListItem
                                className='my-3'
                                  style={{backgroundColor:'rgba(255,255,255,0.45)',
                                      borderRadius: '8px'
                                  }}>
                            <ListItemIcon>
                                <Avatar style={{width: "25px", height: "25px", backgroundColor: "rgba(82, 57, 112, 1)"}}><small>{`${index+1}.${ind+1}`}</small></Avatar>
                            </ListItemIcon>
                            <ListItemText primary={content?.title || "-"}/>
                            <ListItemText primary={
                                <Chip label={content?.contentType||'-'}
                                      size='small'
                                      style={{
                                          backgroundColor: `rgba(82, 57, 112, 1)`,
                                          color: `rgba(255,255,255,0.95`,
                                      }}/>
                            }/>
                        </ListItem>
                    ))
                ) : <p>{t('No data')}</p>}
            </List>
        </Collapse>
        </>
    )) : <p>{t('No data')}</p>;

    return(
            <Paper elevation={10} className='p-1'>
                <div className="d-flex pt-2 px-2 justify-content-between">
                    <Typography variant="h6" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                        {t("My groups")}
                    </Typography>
                </div>
                <hr className="my-0"/>
                <FormControl style={{maxWidth: '400px'}} margin="dense" variant="filled" fullWidth={true} className='px-1'>
                    <InputLabel id="demo-simple-select-label">{t("Select session")}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={model.selectedSession}
                        //renderValue={}
                        onChange={({target:{value}}) => {
                            setModel(p=>({...p,
                                selectedSession: value,
                                selectedGroup: undefined,
                                selectedCourse: undefined,
                            }));
                            setUserCourses([]);
                            setCourseChapters([]);
                            readCurrentSession(value);
                        }}
                    >
                        {sessionsList}
                    </Select>
                </FormControl>
                <FormControl style={{maxWidth: '400px'}} margin="dense" variant="filled" fullWidth={true} className='px-1'>
                    <InputLabel id="demo-simple-select-label">{t("Select group")}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={model.selectedGroup}
                        disabled={!model.selectedSession}
                        //renderValue={}
                        onChange={({target:{value}}) => {
                            setModel(p=>({...p,
                                // selectedSession: undefined
                                selectedGroup: value,
                                selectedCourse: undefined,
                            }));
                            // setUserCourses([]);
                            setCourseChapters([]);
                            readCurrentGroup(value);
                        }}
                    >
                        {groupsList}
                    </Select>
                </FormControl>
                <FormControl style={{maxWidth: '400px'}} margin="dense" variant="filled" fullWidth={true} className='px-1'>
                    <InputLabel id="demo-simple-select-label">{t("Select course")}</InputLabel>
                    <Select
                        disabled={!model.selectedSession||!model.selectedGroup}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={model.selectedCourse}
                        //renderValue={}
                        onChange={({target:{value}}) => {
                            setModel(p=>({...p, 
                                selectedCourse: value
                            }));
                            readCurrentCourse(value);
                        }}
                    >
                        {coursesList}
                    </Select>
                </FormControl>
                <Grid container>
                    <Grid item xs={12}>
                        {model.selectedCourse ? (
                            <List className='px-1'
                                  subheader={
                                      <Typography variant="body2" component="h2" className="text-left mb-2" style={{color: `rgba(82, 57, 112, 1)`}}>
                                          {t("Chapters")}
                                      </Typography>
                                  }
                            >
                                {currentChaptersList}
                            </List>
                        ):(
                            <p>{t("Select session, then select group, then select course")}</p>
                        )}
                    </Grid>
                </Grid>
            </Paper>
    )
}