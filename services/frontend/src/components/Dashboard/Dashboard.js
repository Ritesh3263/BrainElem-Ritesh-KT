import React, {lazy, useEffect, useState} from "react";
import { Card, Col, Row} from "react-bootstrap";
import Avatar from "@material-ui/core/Avatar";
import { useNavigate} from "react-router-dom"
import Icon from '@material-ui/core/Icon';
import RevoCalendar from "../Calendar/Calendar";
import DescriptionIcon from '@material-ui/icons/Description';
import IconButton from "@material-ui/core/IconButton";
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import EventService from "services/event.service"
import ResultService from "services/result.service"
import LibraryService from "services/library.service";
import DashboardService from "services/dashboard.service";
import ProgramTrainerPreview from "../Program/ProgramTrainer/ProgramTrainerPreview/ProgramTrainerPreview";
import ContentService from "services/content.service";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { makeStyles} from "@material-ui/core/styles";
import UserService from "services/user.service";
import GridList from '@material-ui/core/GridList';
import Typography from "@material-ui/core/Typography";
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import Grid from '@material-ui/core/Grid';
import {FormControlLabel, Paper} from "@material-ui/core";
import Hidden from '@material-ui/core/Hidden';
import { useTranslation } from "react-i18next";
import { theme } from "MuiTheme";
import {EButton} from "styled_components";
import i18next from "i18next";

// items
import MyLastContentDashboard from "./DashboardWidgets/MyLastContentDashboard";
import ToExaminateDashboard from "./DashboardWidgets/ToExaminateDashboard";
import MyGradesDashboard from "./DashboardWidgets/MyGradesDashboard";
import HomeworksDashboard from "./DashboardWidgets/HomeworksDashboard";
import MyProfileDashboard from "./DashboardWidgets/MyProfileDashboard";
import AuthService from "../../services/auth.service";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import {useMainContext} from "../_ContextProviders/MainDataContextProvider/MainDataProvider";
import FormLabel from "@material-ui/core/FormLabel";
import {isWidthUp} from "@mui/material/Hidden/withWidth";

/** To remove MyClasses [I will remove - Karol]**/
// const MyClasses = lazy(() => import("./TrainerDashboard/MyClasses"));
const EventModal = lazy(() => import("../Calendar/helpers/EventModal"));


const useStyles = makeStyles(theme=>({
    icon: {
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.54)',
        }
    },
    logo: {
        display:"flex",
        marginLeft:"auto",
        marginRight:"auto",
        width: '50px',
        height: "60px",
        paddingTop:"10px"
    },
    backgroundtest: {
      background:theme.palette.gradients.pink
    },
    recommendationCard: {
        // backgroundColor: `rgba(255,255,255,0.3)`,
        // borderRadius: "8px",
        // cursor: 'pointer',
        transition: "all .25s linear",
        '&:hover': {
            padding: "5px !important",
            'box-shadow': "-1px 10px 29px 0px rgba(0,0,0,0.8)",

        },
    }
}));

export default function Dashboard(){
    const classes = useStyles();
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = useState(false);
    const [eventType,setEventType] = useState({type:"",date:""});
    const [fromContentDataForEvent, setFromContentDataForEvent]=useState(null);
    // Events
    const [customEvents, setCustomEvents] = useState([]);
    const [contentToFill, setContentToFill] = useState([]);
    const [lastContent, setLastContent] = useState([]);
    const [toExaminate, setToExaminate] = useState([]);
    const [examsGrades, setExamsGrades] = useState([]);
    const [homeworks, setHomeworks] = useState([]);
    const [recommendedCourses, setRecommendedCurses]=useState([]);
    const [bookmarkCourses, setBookmarkCourses] = useState([]);
    const { t, i18n, translationsLoaded } = useTranslation();
    const [studentPreview, setStudentPreview] = useState(false);

    const [classes1, setClasses1]= useState([]);
    const [calendarSelectedClass, setCalendarSelectedClass]= useState('ALL');

    // setCurrentRoute
    const {setMyCurrentRoute, F_showToastMessage, F_getHelper, currentScreenSize} = useMainContext();
    const {userPermissions, user} = F_getHelper();

    const [cognitiveTestId, setCognitiveTestId] =useState(null);
    const [isOpenCognitiveDrawer, setIsOpenCognitiveDrawer] = useState({isOpen: false, cognitiveTestId: undefined});

    const [classManager, setClassManager] = useState([
        {
            _id: "j89dej",
            trainee:{
                _id: "h780f7w8e",
                name: "Some Trainee"
            }
        },
        {
            _id: "34534",
            trainee:{
                _id: "tr34343",
                name: "Some Trainee 2"
            }
        }
    ]);

    // mock for now..
    const [revoCalendarLanguage, setRevoCalendarLanguage] = useState("en");

    useEffect(()=> {
        setTimeout(()=>{
            setMyCurrentRoute("sentinel/home")
        },100)
    },[])

    useEffect(()=>{
        let user = AuthService.getCurrentUser();
        UserService.getMyRoles().then(res=>{
            console.log("🚀 ~ file: Dashboard.js ~ line 129 ~ useEffect ~ user", res.data)
        })
        let user_language = i18next.language??"";
        if(user_language === "pl"){
            setRevoCalendarLanguage("pl");
        }else if(user_language === "fr"){
            setRevoCalendarLanguage("fr");
        }else{
            setRevoCalendarLanguage("en");
        }
    },[])

    useEffect(()=>{
        assignEvents();
        DashboardService.getBookmarkCourses(user?.id).then(res=>{
            setBookmarkCourses(res.data);
        });
        if(userPermissions.isTrainer){
            DashboardService.getContentToFill(user?.id).then(res=>{
                setContentToFill(res.data);
            });
            // DashboardService.getToExaminate().then(res=>{
            //     setToExaminate(res.data);
            // });
            EventService.getExamEventsforTeacher().then(res=>{
                if(res.data){
                    let items = res.data.sort((a,b)=> a.date - b.date);
                    if(items >=5){
                        let newData = items.splice(0,5);
                        setToExaminate(newData);
                    }else{
                        setToExaminate(items);
                    }
                }
            })

            EventService.getMyClasses().then(res=>{
                if(res.data){
                    setClasses1(res.data);
                }
            })
        }
        if(userPermissions.isParent){
            // DashboardService.getContentToFill(user.id).then(res=>{
            //     setContentToFill(res.data);
            // });
            // EventService.getParentClasses(user.id).then(res=>{
            //     if(res.data){
            //         setClasses1(res.data);
            //     }
            // })
        }
        if(userPermissions.isTrainee){
            // DashboardService.getMyGrades(user.id).then(res=> {
            //     setGrades(res.data);
            // });
        }

    },[]);

    useEffect(()=>{
        LibraryService.getUserPrivateContent().then(res=>{
            if(res.data.allContents.length >=5){
                setLastContent(res.data.allContents.splice(0,5));
            }else{
                setLastContent(res.data.allContents);
            }
        });

        ContentService.searchRecommended().then(res=>{
            let contents = res.data.hits.hits.map(hit => { return { '_id': hit._id, ...hit._source } });
            setRecommendedCurses(contents.splice(0,2));
        })
    },[]);

    function assignEvents(groupId){
        EventService.getEvents().then(res=>{
            if(groupId === undefined || groupId === 'ALL'){
                setCustomEvents(res.data.filter(event=>event.eventType !== 'Certification'));
                console.log(res.data)
            }else{
                //console.log("byGroupId",groupId)
                    let newData3 = [];
                    newData3 = res.data.filter(i=> i.assignedGroup?._id === groupId);
                    setCustomEvents(newData3.filter(event=>event.eventType !== 'Certification'));
            }
            if(res.data && (userPermissions.isTrainee || userPermissions.isParent)){
                let newData  =[];
                //let newData2  =[];
                newData = res.data.filter(ev=> ev.eventType === "Homework");
                //newData2 = res.data.filter(ev=> ev.eventType === "Exam");
                setHomeworks(newData);
                ResultService.getGrades().then(res=>{
                    setExamsGrades(res.data);
                }).catch(error=>console.log(error))
            }
        });
    }

    async function addEvent(selectedDate, eventType, fromContent, contentData){
        if(fromContent){
            setFromContentDataForEvent(contentData);
        }
            const setDate = async()=> {
                await setEventType({type: eventType.type, date: selectedDate.toISOString(), data: eventType.data});
            }
            setDate().then(() => setOpenDialog(true));

        // if(eventType.type === "update"){
        //     console.log("rres",eventType.data)
        // }
    };

    async function updateEvent({type, data}){
        switch (type){
            case "add":{
                EventService.add(data).then(res=>{
                    F_showToastMessage("Event was added success", "success");
                })
                assignEvents();
                break;
            }
            case "update":{
                EventService.update(data).then(res=>{
                    F_showToastMessage("Event was updated success", "success");
                });
                assignEvents();
                break;
            }
            case "remove":{
                EventService.remove(data).then(res=>{
                    F_showToastMessage("Event was updated removed", "success");
                });
                assignEvents();
                break
            }
            default: break;
        }
    }

    function limitDescriptionLength(description){
        if(description?.length > 100){
            return `${description.slice(0,100)}...`
        }else{
            return description;
        }
    }



    {/** Will be? **/}
    const contentToFillList = contentToFill.map((item,index)=>
        (
            <Row className="d-flex align-items-center pt-3">
                <Col xs={1}>
                    <DescriptionIcon/>
                </Col>
                <Col xs={3}>
                    {item.name}
                </Col>
                <Col xs={2}>
                    {item.subject}
                </Col>
                <Col xs={2}>
                    {item.className}
                </Col>
                <Col xs={2}>
                    {item.coCreator}
                </Col>
                <Col xs={2} className="text-right">
                    <Button variant="primary" size="sm"><small>View</small></Button>
                </Col>
            </Row>
        )
    );


{/**Will be? **/}
    const bookmarkCoursesList = bookmarkCourses.map((item,index)=>
        (
            <Row className="d-flex align-items-center pt-3">
                <Col xs={1}>
                    <Avatar style={{width: "25px", height: "25px"}}>{index+1}</Avatar>
                </Col>
                <Col xs={4}>
                    {item.name}
                </Col>
                <Col xs={2}>
                    {item.category}
                </Col>
                <Col xs={3}>
                    {item.subject}
                </Col>
                <Col xs={2} className="text-right">
                    <Button variant="primary" size="sm"><small>Action</small></Button>
                </Col>
            </Row>
        )
    );
    const recommendedCoursesList = recommendedCourses.map((item,index)=>
        (
            <GridListTile key={index} >
                <img src={ContentService.getImageUrl(item)} style={{opacity:"0.9", filter: `blur(0px)`}}/>
                <GridListTileBar
                    style={{backgroundColor:`rgba(0,0,0,0.5)`}}
                    title={item.title}
                    subtitle={<span>{t("Content type")}: <small>{item.contentType}</small></span>}
                    titlePosition="top"
                />
                <GridListTileBar
                    title={<span>{t("About")}: <small>{limitDescriptionLength(item?.description)}</small></span>}
                    subtitle={<span>{t("Duration time")}: <small>{item.durationTime ? item.durationTime : "-"}</small></span>}
                    titlePosition="bottom"
                    actionIcon={
                        <IconButton aria-label="icon label" size="medium"
                                    className={classes.icon}
                                    onClick={()=>{window.open(`/overview/${item._id}`, '_blank')}}
                        >
                            <PlayCircleOutlineIcon style={{color:"#2DCB48"}}/>
                        </IconButton>
                    }
                />
            </GridListTile>
        ));

    {/** Will be?**/}
    const classManagerItemsList = classManager.map((item,index)=>
        (
            <Row className="d-flex align-items-center pt-3">
                <Col xs={5}>
                    {item.trainee.name}
                </Col>
                <Col xs={3} >
                    <IconButton size="small">
                        <NoteAddIcon/>
                    </IconButton>
                </Col>
                <Col xs={4} className="text-center">
                    <Button variant="primary" size="sm"><small>Add report</small></Button>
                </Col>
            </Row>
    ));

    const groupsList = classes1.map((item, index)=><MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>);

    return(
        <>
            <Grid container spacing={1}>

                {/**if > md show 2 grid rows**/}
                <Hidden mdDown={true}>
                <Grid item xs={12} lg={6} className="mt-2">
                    {/* <Paper elevation={10}> */}
                        {/** CALENDAR **/}
                        {/* {user && (userPermissions.isTrainer || userPermissions.isClassManager) ? (
                            <>
                            <FormControl style={{width:"33%"}} className="ml-5 my-1">
                                <InputLabel id="demo-simple-select-label">{t("Select class")}</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={calendarSelectedClass}
                                    input={<Input/>}
                                    onChange={(e) => {
                                        setCalendarSelectedClass(e.target.value);
                                        assignEvents(e.target.value);
                                    }}
                                >
                                    {groupsList}
                                    <MenuItem key={'ALL'} value={'ALL'}>{t('ALL')}</MenuItem>
                                </Select>
                            </FormControl>
                            {classes1.find(x=>x._id===calendarSelectedClass)?.classManager===user.id &&(
                                    <FormControl component="fieldset" variant="standard" className="ml-5 mt-1">
                                        <FormLabel component="legend"><small>{t("Show my students events in other subjects")}</small></FormLabel>
                                        <FormControlLabel
                                            control={
                                                <Switch checked={studentPreview}
                                                        onChange={()=>setStudentPreview(p=>!p)}
                                                        name="Switch_show" size="small"
                                                        color="primary"
                                                        className="ml-2"/>}
                                            label={studentPreview ? t("On") : t("Off")}
                                        />
                                    </FormControl>
                                )}
                            </>
                        ): null}
                        <RevoCalendar events={customEvents} addEvent={addEvent} updateEvent={updateEvent} lang={revoCalendarLanguage}/>
                    </Paper> */}

                    {/** TO EXAMINATE **/}
                    {userPermissions.isTrainer &&(
                            <Paper elevation={10} className="text-center mt-2">
                                <div className="d-flex pt-2 px-2 justify-content-between">
                                    <Typography variant="h6" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                        {t("To Examinate")}
                                    </Typography>
                                </div>
                                <hr className="my-0"/>
                                <ToExaminateDashboard toExaminate={toExaminate}/>
                            </Paper>
                    )}

                    {/** MY GRADES **/}
                    {userPermissions.isTrainee &&(
                        <Paper elevation={11} className='p-3 mt-1'>
                          <div className="d-flex pt-2 px-2 justify-content-between">
                            <Typography variant="h6" component="h2" className="text-left font-weight-bold" style={{color: `rgba(82, 57, 112, 1)`}}>
                                {t("Grades")}
                            </Typography>
                            <EButton  className="mt-2"
                                    eVariant='secondary'
                                    eSize='small'
                                    onClick={()=>{}}>
                                    {t("View all")}
                            </EButton>
                          </div>         
                            <MyGradesDashboard myGrades={examsGrades}/>
                        </Paper>
                    )}
                    {userPermissions.isParent &&(
                        <Paper elevation={11} className='mt-2 p-3'>
                        <div className="d-flex pt-2 px-2 justify-content-between">
                            <Typography variant="h6" component="h2" className="text-left font-weight-bold" style={{color: `rgba(82, 57, 112, 1)`}}>
                                {t("My children grades")}
                            </Typography>
                                </div>
                                <MyGradesDashboard myGrades={examsGrades}/>
                            </Paper>
                    )}
                    {/** PROGRAM PREVIEW **/}
                    {userPermissions.isTrainer &&(
                        <div className="mt-2">
                            {/*<Paper elevation={10} className="text-center">*/}
                            {/*    <Typography variant="h6" component="h2" className="text-center">*/}
                            {/*        Your classes*/}
                            {/*    </Typography>*/}
                            <ProgramTrainerPreview addEvent={addEvent} allowCreateEvents={true} fromDashboard={true}/>
                            {/*</Paper>*/}
                        </div>
                    )}
                    {/** HOMEWORKS **/}
                    {userPermissions.isTrainee &&(
                            <Paper elevation={10} className="text-center mt-2">
                                {/*<Typography variant="h6" component="h2" className="text-center">*/}
                                {/*    {t("Homeworks")}*/}
                                {/*</Typography>*/}
                                <div className="d-flex pt-2 px-2 justify-content-between">
                                    <Typography variant="h6" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                        {t("Homeworks")}
                                    </Typography>
                                </div>
                                <hr className="my-0"/>
                                <HomeworksDashboard homeworks={homeworks}/>
                            </Paper>
                    )}
                    {userPermissions.isParent &&(
                            <Paper elevation={10} className="text-center mt-2">
                                {/*<Typography variant="h6" component="h2" className="text-center">*/}
                                {/*    {t("My Children Homeworks")}*/}
                                {/*</Typography>*/}
                                <div className="d-flex pt-2 px-2 justify-content-between">
                                    <Typography variant="h6" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                        {t("My children homeworks")}
                                    </Typography>
                                </div>
                                <hr className="my-0"/>
                                <HomeworksDashboard homeworks={homeworks}/>
                            </Paper>
                    )}
                </Grid>
                <Grid item xs={12} lg={6} className="mt-2" >
                    {/** MY PROFILE AND ON BOTTOM TAKE BRAINCORE TEST **/}
                    
                    <MyProfileDashboard fromDashboard={true}/>
                   
                    <Paper elevation={10} className="text-center mt-2">
                    {/** RECOMMENDED COURSES **/}
                            <Card className="m-0 py-0 px-0" style={{backgroundColor:`rgba(255,255,255,0`}}>
                                <div className="d-flex pt-2 px-2 justify-content-between">
                                    <Typography variant="h6" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                        {t("Recommended courses")}
                                    </Typography>
                                </div>
                                <Row className="d-flex mt-0 p-3">
                                    <GridList cellHeight={180} spacing={1} cols={2} className="d-flex flex-fill">
                                        {recommendedCoursesList}
                                    </GridList>
                                </Row>
                            </Card>
                    </Paper>
                    {/** MY LAST CONTENT **/}
                        <Paper elevation={10} className="text-center mt-2">
                            <div className="d-flex pt-2 px-2 justify-content-between">
                                <Typography variant="h6" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                    {t("My last content")}
                                </Typography>
                            </div>
                            <hr className="my-0"/>
                            <MyLastContentDashboard lastContent={lastContent}/>
                            <Button size="small" variant="contained" color="primary"
                                    className="mb-2"
                                    startIcon={<VisibilityIcon/>}
                                    onClick={()=>{
                                        navigate("/my-library")
                                    }
                                    }><small>{t("See all Your contents")}</small>
                            </Button>
                        </Paper>
                </Grid>
                </Hidden>


                {/**if < lg show 1 grid row**/}
                <Hidden lgUp={true}>
                    <Grid item xs={12} lg={6} >
                        <Paper elevation={10} className="text-center" hidden={!isWidthUp('sm',currentScreenSize)}>
                            {/** CALENDAR **/}
                            <RevoCalendar events={customEvents} addEvent={addEvent} updateEvent={updateEvent}  lang={revoCalendarLanguage}/>
                        </Paper>
                        {/** MY PROFILE AND ON BOTTOM TAKE BRAINCORE TEST **/}
                        <div className="text-center mt-2">
                            <MyProfileDashboard/>
                        </div>
                        <Paper elevation={10} className="text-center mt-2">
                            {/** RECOMMENDED COURSES **/}
                            <Card className="m-0 py-0 px-0" style={{backgroundColor:`rgba(255,255,255,0`}}>
                                <div className="d-flex pt-1 px-2 justify-content-between">
                                    <Typography variant="h6" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                        {t("Recommended courses")}
                                    </Typography>
                                </div>
                                <hr className="my-0"/>
                                <Row className="d-flex mt-0 p-3">
                                    <GridList cellHeight={150} spacing={isWidthUp('sm',currentScreenSize) ? 1 : 4} cols={isWidthUp('sm',currentScreenSize) ? 2 : 1} className="d-flex flex-fill">
                                        {recommendedCoursesList}
                                    </GridList>
                                </Row>
                            </Card>
                        </Paper>
                        {/** TO EXAMINATE **/}
                        {userPermissions.isTrainer &&(
                            <Paper elevation={10} className="text-center mt-2">
                                <div className="d-flex pt-1 px-2 justify-content-between">
                                    <Typography variant="h6" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                        {t("To Examinate")}
                                    </Typography>
                                </div>
                                <hr className="my-0"/>
                                <ToExaminateDashboard toExaminate={toExaminate}/>
                            </Paper>
                        )}

                        {/** MY GRADES **/}
                    {userPermissions.isTrainee &&(
                        <Paper elevation={11} className='p-3 mt-2'>
                          <div className="d-flex pt-2 px-2 justify-content-between">
                            <Typography variant="h6" component="h2" className="text-left font-weight-bold" style={{color: `rgba(82, 57, 112, 1)`}}>
                                {t("Grades")}
                            </Typography>
                            <EButton  className="mt-2"
                                    eVariant='secondary'
                                    eSize='small'
                                    onClick={()=>{}}>
                                    {t("View all")}
                            </EButton>
                          </div>         
                            <MyGradesDashboard myGrades={examsGrades}/>
                        </Paper>
                    )}
                    {userPermissions.isParent &&(
                        <Paper elevation={11} className='mt-2 p-3'>
                        <div className="d-flex pt-2 px-2 justify-content-between">
                            <Typography variant="h6" component="h2" className="text-left font-weight-bold" style={{color: `rgba(82, 57, 112, 1)`}}>
                                {t("My Children grades")}
                            </Typography>
                                </div>
                                <MyGradesDashboard myGrades={examsGrades}/>
                            </Paper>
                    )}
                        {/** PROGRAM PREVIEW **/}
                        {userPermissions.isTrainer &&(
                            <div className="mt-2">
                                {/*<Paper elevation={10} className="text-center">*/}
                                {/*    <Typography variant="h6" component="h2" className="text-center">*/}
                                {/*        Your classes*/}
                                {/*    </Typography>*/}
                                <ProgramTrainerPreview addEvent={addEvent} allowCreateEvents={true} fromDashboard={true}/>
                                {/*</Paper>*/}
                            </div>
                        )}
                        {/** HOMEWORKS **/}
                        {userPermissions.isTrainee &&(
                            <Paper elevation={10} className="text-center mt-2">
                                <div className="d-flex pt-1 px-2 justify-content-between">
                                    <Typography variant="h6" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                        {t("Homeworks")}
                                    </Typography>
                                </div>
                                <hr className="my-0"/>
                                <HomeworksDashboard homeworks={homeworks}/>
                            </Paper>
                        )}
                        {userPermissions.isParent &&(
                            <Paper elevation={10} className="text-center mt-2">
                                <div className="d-flex pt-1 px-2 justify-content-between">
                                    <Typography variant="h6" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                        {t("My children homeworks")}
                                    </Typography>
                                </div>
                                <hr className="my-0"/>
                                <HomeworksDashboard homeworks={homeworks} />
                            </Paper>
                        )}
                        {/** MY LAST CONTENT **/}
                        <Paper elevation={10} className="text-center mt-2">
                            <div className="d-flex pt-1 px-2 justify-content-between">
                                <Typography variant="h6" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                    {t("My last content")}
                                </Typography>
                            </div>
                            <hr className="my-0"/>
                            <MyLastContentDashboard lastContent={lastContent}/>
                            <Button classes={{root: classes.root}} size="small" variant="contained" color="primary"
                                    className="mb-2"
                                    startIcon={<VisibilityIcon/>}
                                    onClick={()=>{
                                        navigate("/my-library")
                                    }
                                    }><small>{t("See all Your content")}</small></Button>
                        </Paper>
                    </Grid>
                </Hidden>

            </Grid>
            <EventModal isOpen={openDialog} setOpen={setOpenDialog} eventAction={updateEvent} eventInfo={eventType} fromContentDataForEvent={fromContentDataForEvent} setFromContentDataForEvent={setFromContentDataForEvent}/>
        </>
    )
}