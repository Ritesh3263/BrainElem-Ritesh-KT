import React, {useEffect, useState} from "react";
import {useMainContext} from "../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import Grid from "@material-ui/core/Grid";
import {Paper} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Chip from "@material-ui/core/Chip";
import Box from "@material-ui/core/Box";
import LinearProgress from "@material-ui/core/LinearProgress";
import CertificationSessionService from "../../../services/certification_session.service"
import CoursePathService from "../../../services/course_path.service"
import {useNavigate} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import {theme} from "../../../MuiTheme";
import {isWidthUp} from "@material-ui/core/withWidth";
import OptionsButton from "../.../../../../components/common/OptionsButton";
import {EButton} from "../../../styled_components";
//Context
import { useShoppingCartContext } from "components/_ContextProviders/ShoppingCartProvider/ShoppingCartProvider";
import {useSessionContext} from "../../_ContextProviders/SessionProvider/SessionProvider";

import Button from "@material-ui/core/Button";
import BillingInformation from "components/ShoppingCart/BillingInformation";

const useStyles = makeStyles(theme=>({
    Container:{
        borderRadius:"16px",
        backdropFilter:"`blur(20px)",
        cursor:"pointer",
        '&:hover': {
            transform: "scale(1.01, 1.01)"
         }
    },
    Mediaobject:{
        height:'145px', 
        borderRadius:"16px 0 0 16px",
        float:"left",
        }
    }))
export default function TrainingMyCoursesList(){
    const {t} = useTranslation();
    const navigate = useNavigate();
    const classes = useStyles();
    const {setMyCurrentRoute, F_showToastMessage, F_getHelper, currentScreenSize} = useMainContext();
    const {user} = F_getHelper();
    const [sessions, setSessions]=useState([]);
    const [groups, setGroups]=useState([]);

    const [currentCertificationSessionId, setCurrentCertificationSessionId] = useState();
    const [openBillingInformation, setOpenBillingInformation] = useState(false);
    // const [sessionsSelect, setSessionsSelect]=useState([]);
    const [selectedSession, setSelectedSession] = useState('All');
    const [selectedGroup, setSelectedGroup] = useState(undefined);
    const {
        currentSession,
    } = useSessionContext();

    const {
        shoppingCartDispatch,
        shoppingCartReducerActionsType,
    } = useShoppingCartContext();


    function readAllUserSessions(){
        CertificationSessionService.readAllUserSessions().then(res=>{
            if(res.status === 200 && res.data){
                // setSessionsSelect(res.data);
                setSessions(res.data);
            }
        }).catch(err=>console.log(err));
    }

    function clickHandler(session){
        console.log(session)
        if (session.paymentRequired){
            shoppingCartDispatch({ type: shoppingCartReducerActionsType.ADD, payload: {...session, productType: 'session'} })
            navigate("/shopping-cart");
        } else navigate(`/sessions/${session?._id}`)
    }

    useEffect(()=>{
        setMyCurrentRoute("My courses");
        readAllUserSessions()
    },[]);


    useEffect(()=>{
        if(selectedSession === 'All'){
            readAllUserSessions()
        }else{
            CertificationSessionService.read(currentSession._id).then(res=>{// argument to be a session id
                if(res.status === 200 && res.data){
                    setSessions([res.data]);
                    setGroups(res.data.groups);
                }
            }).catch(err=>console.log(err));
        }
    },[selectedSession]);


    const sessionsList = sessions?.length>0 ? sessions.map(item=>(
        
        <Grid item xs={12} md={9}  className="pb-3 flex-column" key={item?._id}>
            <Paper elevation={17} className={`p-0  ${classes.Container} `}>
                <img onClick={()=>{clickHandler(item)}}
                    style={{width:isWidthUp('sm',currentScreenSize) ? "250px" : "100%"}} className={`mr-2 ${classes.Mediaobject}`}            
                    src={CoursePathService.getImageUrl(item.coursePath?.image)}
                    alt='Course'
                    loading="lazy"
                /> 
                    <div className="p-3" style={{float:"right"}}>
                        <OptionsButton  iconButton={true} btns={[
                            {id: 1, name: t("Share"), disabled: true},
                            {id: 2, name: t("Billing information"), disabled: !item.paymentEnabled, action: (e)=>{setCurrentCertificationSessionId(item._id); setOpenBillingInformation(true)}},
                            {id: 3, name: t("Unenroll"), action: ()=>{

                                CertificationSessionService.unenroll(item._id).then(res=>{
                                    readAllUserSessions()
                                    F_showToastMessage(t("You have unenrolled sucessfully"), "success");
                                }).catch(err=>{
                                    let message = t("Error while unenrolling from session.")
                                    if (err.response.data.message) message = t(err.response.data.message)
                                    F_showToastMessage(message, "error");
                                });

                            }}]}
                    />
                    </div>
                    <div onClick={()=>{clickHandler(item)}}   className="p-2 pt-4 ml-2 ">  
                        <Typography variant="h6" component="h6" style={{color: theme.palette.neutrals.almostBlack, fontSize:"24px"}}>
                            {item?.name}
                        </Typography>
                        
                        <Chip label={item?.category?.name}
                            //   label={item?.duplicatedCoursePath?.category?.name}
                            className="mr-1"
                            size="small" variant="outlined"
                            style={{color: `rgba(82, 57, 112, 1)`, backgroundColor:'rgba(255,255,255,0.9)'}}
                        />
                        {item?.hasCertificate && (
                            <Chip label={"Certificated"}
                                size="small" variant="outlined"
                                style={{color: `rgba(82, 57, 112, 1)`, backgroundColor:'rgba(239, 209, 53, 1)'}}
                            />
                        )}
                        {/* 
                        <Typography variant="body2" component="p" className="mt-2" style={{color: `rgba(82, 57, 112, 1)`}}>
                            {`${t("My progress")}: ${item?.userProgress||0}%`}
                        </Typography>
                            <Box alignItems="center" style={{width:'100%'}} className="mt-1 px-3">
                                <LinearProgress variant="determinate" value={item?.userProgress || 0}
                                                style={{backgroundColor:'rgba(220, 163, 255, 1)'}}/>
                            </Box> */}
                        <Typography variant="body2" component="p" className="mt-3 mb-3" style={{color: `rgba(82, 57, 112, 1)`}}>
                            {`${t("Last time active")}: ${ item?.userLastTimeActive ? new Date(item.userLastTimeActive).toLocaleDateString() : '-'}`}
                            <Button className="mr-2" style={{float:"right"}} size='small' variant="contained" color="primary">{item.paymentRequired ? t("Pay") : t('View')}</Button>
                        </Typography>
                    </div>
            </Paper>    
        </Grid>)): <Paper elevation={12}><p>{t("You don't have any courses yet")}</p></Paper>;

    // const sessionsSelectList = sessionsSelect?.length>0 ? sessionsSelect.map((item,)=><MenuItem key={item._id} value={item._id}>{item?.name}</MenuItem>):[];

    return(
        <Grid container>
            {/* <Grid item xs={12} className="mb-2 px-2">
                
                    <Typography variant="h6" component="h6" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                   {`${t("List of my courses")}`}
                    </Typography>
                    <FormControl style={{maxWidth:'300px'}} margin="normal" fullWidth={true} variant="filled" >
                        <InputLabel id="demo-simple-select-label">{t("Select session")}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            name={'select session'}
                            readOnly={false}
                            disableUnderline={false}
                            value={selectedSession}
                            onChange={({target:{value}}) => {
                                setSelectedSession(value);
                            }}
                        >
                            <MenuItem value='All' onClick={()=>setSelectedSession('All')}>{t("All")}</MenuItem>
                            {sessionsSelectList}
                            { sessions?.length>0 && sessions.map(item=>(
                                <MenuItem key={item?._id} value={item?._id}>{item?.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl style={{maxWidth:'300px'}} margin="normal" fullWidth={true} variant="filled" >
                        <InputLabel id="demo-simple-select-label">{t("Select group")}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            name={'select group'}
                            readOnly={false}
                            disableUnderline={false}
                            value={selectedGroup}
                            onChange={({target:{value}}) => {
                                setSelectedGroup(value);
                            }}
                        >
                            {groups?.length>0 && groups.map(item=>(
                                <MenuItem key={item?._id} value={item?._id}>{item?.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                
            </Grid> */}
            {sessionsList}
            <BillingInformation certificationSessionId={currentCertificationSessionId} open={openBillingInformation} setOpen={setOpenBillingInformation}></BillingInformation>
        </Grid>
    )
}