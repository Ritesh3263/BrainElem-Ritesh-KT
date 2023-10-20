import React, {lazy, useEffect, useState} from 'react';
import {Card,CardHeader, CardContent, CardActionArea, CardActions} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {theme} from "MuiTheme";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {useTranslation} from "react-i18next";
import Chip from "@material-ui/core/Chip";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {makeStyles} from "@material-ui/core/styles";
import {myCourseActions} from "app/features/MyCourses/data";
import {useSelector, useDispatch} from "react-redux";
import Paper from "@material-ui/core/Paper";
import MenuIcon from '@mui/icons-material/Menu';
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import Box from "@material-ui/core/Box";
import {isWidthUp} from "@material-ui/core/withWidth";

const Program = lazy(() => import("./Tabs/Program"));
const Students = lazy(() => import("./Tabs/Students"));
const Gradebook = lazy(() => import("./Tabs/Gradebook"));
const Schedule = lazy(() => import("./Tabs/Schedule"));
const Examinate = lazy(() => import("./Tabs/Examinate"));
const Information = lazy(() => import("./Tabs/Information"));

const SidebarDrawer = lazy(() => import("./SidebarDrawer"));


export const useStyles = makeStyles({
    tabs:{
        borderRadius: '0px',
        backgroundColor:"transparent",
        "& .MuiButtonBase-root":{
            color: theme.palette.primary.darkViolet,
            padding:"15px 0",
            borderRight:"solid 1px white",
            fontSize: '12px',
        },
        '& .Mui-selected': {
            background: theme.palette.shades.white70,
            color: theme.palette.primary.lightViolet,
            outlined: "none",
        },
    },
    appBar:{
        background: theme.palette.glass.medium,
        boxShadow:"none",
        zIndex:0,
    },
    cardHeaderTypo:{
        fontSize:"32px",
        color:theme.palette.primary.lightViolet,
    },
    card:{
        background:"transparent",
        boxShadow:"none",
    }
});


const MyCourseForm=()=> {
    const { t } = useTranslation();
    const classes = useStyles();
    const {F_handleSidebarChange,sidebarState:{collapsed},F_handleSetShowLoader} = useMainContext();
    const dispatch = useDispatch();
    const {formHelper,isPending,data,item} = useSelector(_=>_.myCourses);
    const [tabItems, setTabItems] = useState([]);
    const [currentTab, setCurrentTab] = useState(1);
    const [sidebarHelper, setSidebarHelper] = useState({isOpen:false, itemId: null});
    const [itemObj, setItemObj] = useState({});
    const {
        currentScreenSize,
        F_getHelper,
    } = useMainContext();
    const {user} = F_getHelper();

    const _tabItems=[
        {
            id: 1,
            name:"Program",
            isHidden: false,
            isDisabled: false,
        },
        {
            id: 2,
            name:"Students",
            isHidden: (user.role === 'Trainee' || user.role === 'Parent'),
            isDisabled: (user.role === 'Trainee'),
        },
        {
            id: 3,
            name:"Gradebook",
            isHidden: (user.role !== 'TODO'),
            isDisabled: false,
        },
        {
            id: 4,
            name:"Schedule",
            isHidden: false,
            isDisabled: false,
        },
        {
            id: 5,
            name:"Exams and Assigments",
            isHidden: false,
            isDisabled: false,
        },
        {
            id: 6,
            name:"Information",
            isHidden: false,
            isDisabled: false,
        },
    ];

    const tabItemsList = tabItems?.length>0 ? tabItems.map(ti=>(
        <Tab key={ti.id} value={ti.id} disabled={ti.isDisabled} hidden={ti.isHidden} label={t(ti?.name)||'-'} />
    )) : [];

    useEffect(()=>{
        if(isPending){
            F_handleSetShowLoader(true);
        }else{
            F_handleSetShowLoader(false);
        }
    },[isPending]);

    useEffect(()=>{
        dispatch(myCourseActions.examAction({type:'CLOSE'}));
    },[currentTab]);

    useEffect(()=>{
        setTabItems(_tabItems);
        setCurrentTab(_tabItems?.[0].id);

        if(formHelper.isOpen && formHelper.itemId){
            dispatch(myCourseActions.fetchItem(formHelper.itemId));
        }
        setItemObj(data.find(i=>i._id===formHelper.itemId));
    },[]);


    const switchCurrentTab=()=>{
        switch (currentTab){
            case 1:{
                return (<Program />);
            }
            case 2:{
                return (<Students />);
            }
            case 3:{
                return (<Gradebook currentTab={currentTab}/>);
            }
            case 4:{
                return (<Schedule />);
            }
            case 5:{
                return (<Examinate />);
            }
            case 6:{
                return (<Information />);
            }
            default: break;
        }
    }

     return (
            <Box className='d-flex flex-grow-1' >
                    {(isWidthUp('md',currentScreenSize)) && (formHelper.openType !== 'PREVIEW') && (currentTab === 1) && (
                        <>
                        {!sidebarHelper.isOpen ? (
                                <Box className='mr-2'>
                                    <IconButton variant="contained" size="medium"
                                                style={{backgroundColor:'rgba(82, 57, 112, 1)'}}
                                                onClick={()=>{
                                                    if(!collapsed){
                                                        F_handleSidebarChange("COLLAPSE");
                                                    }
                                                    setSidebarHelper(p=>({...p,isOpen: true,}));
                                                }}>
                                        <MenuIcon style={{fill:'rgba(255,255,255,.95)'}}/>
                                    </IconButton>
                                </Box>
                        ) : (
                            <Paper elevation={11}  style={{width:'500px'}} className="mr-2">
                                <Grid container >
                                    <Grid item xs={12} className="d-flex justify-content-end pr-2 pt-2" style={{height:'40px'}}>
                                        <IconButton variant="contained" size="small"
                                                    style={{backgroundColor:'rgba(82, 57, 112, 1)'}}
                                                    onClick={()=>{setSidebarHelper(p=>({...p,isOpen: !p.isOpen}))}}
                                        >
                                            <MenuIcon style={{fill:'rgba(255,255,255,.95)'}} className='p-1'/>
                                        </IconButton>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <SidebarDrawer/>
                                    </Grid>
                                </Grid>
                            </Paper>
                        )}
                        </>
                    )}
                <Box className="d-flex flex-grow-1">
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Card classes={{root: classes.card}}>
                                <CardHeader className='py-0 px-0 pt-3'
                                            style={{background: theme.palette.glass.medium, borderRadius:"8px 8px 0 0 "}}
                                            title={(
                                                <Grid container>
                                                    <Grid item xs={12}>
                                                        <Grid container>
                                                            <Grid item xs={4} className='pl-4'>
                                                                <Typography variant="h5" component="h2" className="text-left"  classes={{root: classes.cardHeaderTypo}}>
                                                                    <IconButton className="mb-1 mr-2" style={{border:"1px solid #A85CFF"}}  variant="contained" size="small"
                                                                                onClick={() =>  {
                                                                                    dispatch(myCourseActions.setFormHelper({}))
                                                                                }}>
                                                                        <ChevronLeftIcon style={{fill:theme.palette.primary.lightViolet,color:"red"}}/>
                                                                    </IconButton> {itemObj.trainingModule?.name||item?.information?.name}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={8} className='d-flex justify-content-start align-items-center'>
                                                                <Chip color="primary" label={item?.group?.name||'Group'} className="mx-2"/>
                                                                <Chip color="primary" label={item?.information?.period||'Period'} className="mx-2"/>
                                                                <Chip color="primary" label={item?.group?.level||'Level'} className="mx-2"/>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={12} className='mt-3 flex-wrap'>
                                                        <AppBar position='static'
                                                                classes={{root: classes.appBar}} className='m-0'>
                                                            <Tabs
                                                                variant="scrollable"
                                                                scrollButtons="auto"
                                                                aria-label="scrollable auto tabs example"
                                                                classes={{root: classes.tabs}}
                                                                value={currentTab}
                                                                onChange={(v,i)=>setCurrentTab(i)}
                                                            >
                                                                {tabItemsList}
                                                            </Tabs>
                                                        </AppBar>
                                                    </Grid>
                                                </Grid>
                                            )}/>
                                <CardContent className='p-0 pt-2'>
                                    {switchCurrentTab()}
                                </CardContent>
                                {/*<CardActionArea>*/}
                                {/*    <CardActions>*/}
                                {/*        <EButton*/}
                                {/*            eSize='small'*/}
                                {/*            eVariant="primary"*/}
                                {/*            onClick={()=>{setSidebarHelper({isOpen: true})}}*/}
                                {/*        >{t("open")}</EButton>*/}
                                {/*    </CardActions>*/}
                                {/*</CardActionArea>*/}
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
     )
 }

export default MyCourseForm;