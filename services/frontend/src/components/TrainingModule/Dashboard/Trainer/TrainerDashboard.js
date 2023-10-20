import React, {useEffect, useState} from "react";
import {useMainContext} from "../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import Grid from "@material-ui/core/Grid";
import {Paper} from "@material-ui/core";
import MyProfileDashboard from "../../../Dashboard/DashboardWidgets/MyProfileDashboard";
import Typography from "@material-ui/core/Typography";
import {useTranslation} from "react-i18next";
import MyLastContentDashboard from "../../../Dashboard/DashboardWidgets/MyLastContentDashboard";
import Button from "@material-ui/core/Button";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {useNavigate} from "react-router-dom";
import LibraryService from "../../../../services/library.service";
import {Card, Col, Row} from "react-bootstrap";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ContentService from "services/content.service";
import Icon from "@material-ui/core/Icon";
import UserService from "services/user.service";
import IconButton from "@material-ui/core/IconButton";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import {makeStyles} from "@material-ui/core/styles";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EventService from "services/event.service";
import {now} from "moment";
import Chip from "@material-ui/core/Chip";
import Divider from "@material-ui/core/Divider";
import MyGroups from "./MyGroups";
import {fullMinutes} from "components/common/TimeMinutes";
import { theme } from "MuiTheme";
import {isWidthUp} from "@mui/material/Hidden/withWidth";

const useStyles = makeStyles(theme=>({
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
    paper:{
        [theme.breakpoints.down('sm')]:{
            padding: 0,
        }
    }
}));

export default function TrainerDashboard(){
    const classes = useStyles();
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {setMyCurrentRoute, F_getHelper, F_showToastMessage, F_handleSetShowLoader, currentScreenSize} = useMainContext();
    const {user, manageScopeIds} = F_getHelper();
    const [lastContent, setLastContent] = useState([]);
    const [recommendedCourses, setRecommendedCurses]=useState([]);
    const [customEvents, setCustomEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [isOpenCognitiveDrawer, setIsOpenCognitiveDrawer] = useState({isOpen: false, cognitiveTestId: undefined});


    useEffect(()=>{
        F_handleSetShowLoader(true);
        setMyCurrentRoute("sentinel/home");

        LibraryService.getUserPrivateContent().then(res=>{
            if(res.status === 200 && res.data){
                if(res.data.allContents.length >=5){
                    setLastContent(res.data.allContents.splice(0,5));
                }else{
                    setLastContent(res.data.allContents);
                }
            }
        }).catch(err=>console.log(err));

        ContentService.searchRecommended().then(res=>{
            if(res.status === 200 && res.data){
                let contents = res.data.hits.hits.map(hit => { return { '_id': hit._id, ...hit._source } });
                setRecommendedCurses(contents.splice(0,2));
            }
        }).catch(err=>console.log(err));

        manageScopeIds.isTrainingCenter?
            EventService.readEventsFromAllSessions().then(res=>{
                if(res.status === 200 && res.data){
                    setCustomEvents(res.data);
                    setUpcomingEvents(res.data.filter(event=>{
                        return new Date(event.date) > now()
                    }));
                }
            }).catch(err=>console.log(err)):
            EventService.getEvents().then(res=>{
                if(res.status === 200 && res.data){
                    setCustomEvents(res.data);
                }
            }).catch(err=>console.log(err));
        F_handleSetShowLoader(false);
    },[]);

    function limitDescriptionLength(description){
        if(description.length > 100){
            return `${description.slice(0,100)}...`
        }else{
            return description;
        }
    }

    const recommendedCoursesList = recommendedCourses.map((item,index)=> (
        <div className='p-1' key={index}>
            <Paper elevation={11} className='p-2'>
                <ImageListItem>
                    <img src={ContentService.getImageUrl(item)} style={{opacity:"0.9", filter: `blur(0px)`, borderRadius:'5px'}}/>
                    <ImageListItemBar
                        style={{backgroundColor:`rgba(0,0,0,0.0)`}}
                        // title={item.title}
                        // subtitle={<span>{t("Content type")}: <small>{item.contentType}</small></span>}
                        position="top"
                        actionIcon={
                            <IconButton aria-label="icon label" size="medium"
                                        className='mt-1 mr-1'
                                        style={{backgroundColor: 'rgba(255,255,255,0.7)'}}
                                        onClick={()=>{window.open(`/overview/${item._id}`, '_blank')}}
                            >
                                <MoreHorizIcon style={{color: `rgba(82, 57, 112, 1)`, width:"15px", height:'15px'}}/>
                            </IconButton>
                        }
                    />
                </ImageListItem>
                <Grid container className='p-1'>
                    <Grid item xs={10} className="mt-2">
                        <Typography variant="h5" component="h5" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                            {item?.title}
                        </Typography>
                        <Typography variant="body1" component="h6" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                            {/*{`${t("Content type")}: ${item?.description}`}*/}
                            {item?.description ? limitDescriptionLength(item.description) : '-'}
                        </Typography>
                        <Typography variant="body2" component="h6" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                            {/*{`${t("Duration time")}: ${item?.durationTime||'-'} h`}*/}
                            {`${item?.durationTime||'-'} h`}
                        </Typography>
                    </Grid>
                    <Grid item xs={2} className="d-flex justify-content-center align-items-center">
                        <IconButton aria-label="icon label" size="medium"
                                    style={{backgroundColor: 'rgba(255,255,255,0.7)'}}
                                    onClick={()=>{window.open(`/overview/${item._id}`, '_blank')}}
                        >
                            <PlayCircleOutlineIcon style={{color:`rgba(82, 57, 112, 1)`}}/>
                        </IconButton>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    ));

    const upcomingEventsList = upcomingEvents?.length>0 ? upcomingEvents.map(upe=>(
        <Paper elevation={12} className='mb-1 mt-0' >
            <Typography variant="body1" component="span" className="text-left ml-1" style={{color: `rgba(82, 57, 112, 1)`}}>
                {upe.date ? (new Date(upe.date).toLocaleDateString()) : '-'}
                {upe.date ? ( (new Date(upe.date).toLocaleDateString() === (new Date(now()).toLocaleDateString())) && ` (${t('Today')})` ) : null}
            </Typography>
            <Paper elevation={16}>
                <Paper elevation={11} className='p-1 d-flex justify-content-between align-items-center'>
                    <Typography variant="body1" component="span" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                        <small>{upe.date ? (`${new Date(upe.date).getHours()}:${fullMinutes(new Date(upe.date).getMinutes())}`) : '-'}</small>
                        <small>{` , `}</small>
                        <small>{upe.durationTime ? `${t('duration')}: ${upe.durationTime} min` :'-'}</small>
                    </Typography>
                    <div>
                        <Chip label={`${upe?.assignedSubject?.name ? upe?.assignedSubject?.name : '-'}`} size='small' className="mr-2" style={{color: 'black', backgroundColor:'rgba(238, 235, 241, 1)'}}/>
                        <Chip color="primary" label={`${upe?.eventType ? upe?.eventType?.toLowerCase() : '-'}`} size='small' style={{color: 'black', backgroundColor:'rgba(255, 255, 255, 0.8)', border: '2px solid #B372FF'}}/>
                    </div>
                </Paper>
                <Grid container className='p-1 my-1'>
                    <Grid item xs={10} className="d-flex flex-column">
                    <span>
                        {upe.content ? (<>
                            <Typography variant="body2" component="span" className="text-left" style={{color: `rgba(0, 0, 0, 1)`}}>
                                {`${t('Content')}: `}
                            </Typography>
                            <Typography variant="body2" component="span" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                {upe?.assignedContent?.title}
                            </Typography>
                        </>) : (<>
                            <Typography variant="body2" component="span" className="text-left" style={{color: `rgba(0, 0, 0, 1)`}}>
                                {`${t('Course')}: `}
                            </Typography>
                            <Typography variant="body2" component="span" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                {upe?.assignedCourse?.name}
                            </Typography>
                        </>)}
                    </span>
                        <span>
                        <Typography variant="body2" component="span" className="text-left" style={{color: `rgba(0, 0, 0, 1)`}}>
                                 {`${t('URL')}: `}
                        </Typography>
                        <Typography variant="body2" component="span" className="text-left" style={{color: `#B372FF`, cursor: 'pointer'}}
                                    onClick={()=>{window.open(upe?.eventURL, '_blank')}}
                        >
                            <strong>{upe?.eventURL}</strong>
                        </Typography>
                    </span>
                    </Grid>
                    <Grid item xs={2} className="d-flex justify-content-center align-items-center">
                        <IconButton aria-label="icon label" size="medium"
                                    style={{backgroundColor: 'rgba(255,255,255,0.7)', height: '30px', width: '30px'}}
                                    onClick={()=>{}}
                        >
                            <PlayCircleOutlineIcon style={{color:`rgba(82, 57, 112, 1)`}}/>
                        </IconButton>
                    </Grid>
                </Grid>
            </Paper>
        </Paper>
    )):[];


    return(
        <Grid container>

            <Grid item xs={12} lg={6}>
                <Grid container>
                    <Grid item xs={12}  className='p-1'>
                        <MyGroups/>
                    </Grid>
                    <Grid item xs={12}  className='p-1'>
                        <Paper elevation={10} className='p-2'>
                            <div className="d-flex pt-2 px-2 justify-content-between">
                                <Typography variant="h6" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                    {t("My last content")}
                                </Typography>
                                <Button size="small" variant="contained" color="secondary"
                                        className="mb-1"
                                        startIcon={<VisibilityIcon/>}
                                        onClick={()=>{navigate("/my-library")}}>
                                    <small>{t("See all")}</small>
                                </Button>
                            </div>
                            <hr className="my-0"/>
                            <MyLastContentDashboard lastContent={lastContent}/>

                        </Paper>
                    </Grid>
                    <Grid item xs={12}  className='p-1'>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12} lg={6} className="d-flex align-items-start" >
                <Grid container >
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={12} lg={6} className='p-1'>
                                <Paper elevation={10} className='p-2 ' style={{height: '100%'}}>
                                    <Typography variant="h6" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                        {t("Upcoming events")}
                                    </Typography>
                                    <Divider className="mb-2"/>
                                    {upcomingEventsList}
                                </Paper>
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <Grid container>
                                    <Grid item xs={12} className='p-1' >
                                            <MyProfileDashboard/>
                                    </Grid>
                                    {/*<Grid item xs={12} className='p-1'>*/}
                                    {/*    <Paper elevation={10} className='p-2'>*/}
                                    {/*        <Typography variant="h6" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>*/}
                                    {/*            {t("Bookmark courses")}*/}
                                    {/*        </Typography>*/}
                                    {/*        <Divider/>*/}
                                    {/*        <BookmarkCourses lastContent={lastContent}/>*/}
                                    {/*    </Paper>*/}
                                    {/*</Grid>*/}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}  className='p-1'>
                        <Paper elevation={10}>
                            <Card className="m-0 py-0 px-0" style={{backgroundColor:`rgba(255,255,255,0`}}>
                                <div className="d-flex pt-2 px-2 justify-content-between">
                                    <Typography variant="h6" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                        {t("Recommended courses")}
                                    </Typography>
                                </div>
                                <ImageList cols={isWidthUp('md',currentScreenSize) ? 2 : 1}>
                                    {recommendedCoursesList}
                                </ImageList>
                            </Card>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}