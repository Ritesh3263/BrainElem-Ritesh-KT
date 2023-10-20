import React, {lazy, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Box from "@material-ui/core/Box";
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Typography from "@material-ui/core/Typography";
import LibraryService from "services/library.service"
import { makeStyles} from "@material-ui/core/styles";
import {Paper} from "@material-ui/core";
import LastItemsTable from "./LastItemsTable";
import {useTranslation} from "react-i18next";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import { theme } from "MuiTheme";
import {EButton, ETab, ETabBar} from "styled_components";
import CloudService from "services/cloud.service";
import EVerticalProperty from "styled_components/VerticalProperty";

const LibraryChart = lazy(() => import("./LibraryChart"));

const useStyles = makeStyles(theme=>({}))

export default function ModuleLibrary(){
    const { t } = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();

    const [awaiting, setAwaiting] = useState([]);
    const [lastActivity, setLastActivity] = useState([]);
    const [allContent, setAllContent] = useState([]);
    const [libraryData, setLibraryData] = useState([]);
    const [allAcceptedContent, setAllAcceptedContent] = useState([]);
    const [allRejectedContent, setAllRejectedContent] = useState([]);
    const [storageInfo, setStorageInfo] = useState({});
    const {setMyCurrentRoute, F_getHelper} = useMainContext();
    const {user} = F_getHelper();
    const [activeTab, setActiveTab]=useState(0);


    useEffect(()=>{
        // get Last activity
        // Librarian or CloudManager
        if(user.role === 'Librarian'){
            LibraryService.getAwaitingContent().then(res=>{
                if(res.data.length > 4){
                    setAwaiting(res.data.slice(0,3))
                }else{
                    setAwaiting(res.data);
                }
            }).catch(err=>console.log(err))
            // get awaiting
            LibraryService.getAllContent().then(res=>{
                setAllContent(res.data)
                if(res.data.length > 4){
                    setLastActivity(res.data.slice(0,3))
                }else{
                    setLastActivity(res.data);
                }
            }).catch(err=>console.log(err))

            // LibraryService.getAcceptedContent().then(res=>{
            //     setAllAcceptedContent(res.data)
            // }).catch(err=>console.log(err))

            // LibraryService.getRejectedContent().then(res=>{
            //     setAllRejectedContent(res.data)
            // }).catch(err=>console.log(err))

            LibraryService.getLibraryData().then(res=>{
                setLibraryData(res.data)
            }).catch(err=>console.log(err))

            // get storage info
            LibraryService.getStorageInfo().then(res=>{
                setStorageInfo(res.data);
            })
            setMyCurrentRoute("Module library overview")
        }else{
            CloudService.getAwaitingContent().then(res=>{
                if(res.data.length > 4){
                    setAwaiting(res.data.slice(0,3))
                }else{
                    setAwaiting(res.data);
                }
            }).catch(err=>console.log(err))

            // get Last activity
            CloudService.getAllContent().then(res=>{
                if(res.data.length > 4){
                    setLastActivity(res.data.slice(0,3))
                }else{
                    setLastActivity(res.data);
                }
            }).catch(err=>console.log(err))

            // get storage info
            CloudService.getStorageInfo().then(res=>{
                setStorageInfo(res.data);
            });

            setMyCurrentRoute("Storage")
        }

    },[]);


    return(
            <Grid container spacing={3}>
                <Grid item xs={12} lg={6}>
                    <Paper elevation={16} className="p-0">
                        <Grid container>
                            <Grid item xs={12} className='p-2'>
                                <Box display="flex" alignItems="center">
                                    <Box width="100%" mr={1}>
                                        <div className="mb-2 d-flex justify-content-between" style={{fontSize:"24px"}}>
                                            <Typography variant="h6" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                                {t("Storage information")}
                                            </Typography>
                                            <EButton eSize="small" eVariant="primary"
                                                    onClick={()=>{
                                                        if(user.role === 'Librarian'){
                                                                navigate("/accepting-library-content")
                                                        }else{
                                                            navigate("/accepting-cloud-content")
                                                        }
                                                    }}
                                            >{user.role === 'Librarian' ? t("Manage library") : t("Manage cloud")}</EButton>
                                        </div>
                                        <LinearProgress variant="determinate"  value={Math.floor((storageInfo.used * 100)/storageInfo.size)}
                                                        style={{borderRadius: "30px", height: "40px"}}/>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container className='p-2 px-2' spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" component="p" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                            {t("Taken space")}: {`${Math.floor((storageInfo.used)*100)/100} ${storageInfo.unit}`}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" component="p" className="text-right" style={{color: `rgba(82, 57, 112, 1)`}}>
                                            {t("Available storage")}: {`${Math.floor((storageInfo.size-storageInfo.used)*100)/100} ${storageInfo.unit}`}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                    </Paper>
                    <Paper elevation={16}  className='p-4 mt-3'>                
                            <Typography variant="h5" component="h5" className="text-left mt-3 " >
                                {t("General ")}
                            </Typography>
                                        <Box  sx={{p: '8px', px: '5px'}}>
                                            <EVerticalProperty  name={t(`Total accepeted contents in ${user.role === 'Librarian'? 'library': 'cloud'}`)}
                                                value={libraryData.reduce((acc, curr)=>{return acc + curr.accepted}, 0)} fontSize='16px'>
                                            </EVerticalProperty>
                                        </Box>

                                        <Box  sx={{p: '8px', px: '5px'}}>
                                            <EVerticalProperty  name={t("Total rejected contents")}
                                                value={libraryData.reduce((acc, curr)=>{return acc + curr.rejected}, 0)} fontSize='16px'>
                                            </EVerticalProperty>
                                        </Box>
                                        
                                        <Box  sx={{p: '8px', px: '5px'}}>
                                            <EVerticalProperty  name={t("Total awaiting contents")}
                                                value={libraryData.reduce((acc, curr)=>{return acc + curr.awaiting}, 0)} fontSize='16px'>
                                            </EVerticalProperty>
                                        </Box>

                                        <Box  sx={{p: '8px', px: '5px'}}>
                                            <EVerticalProperty  name={t("Total other contents (private)")}
                                                value={libraryData.reduce((acc, curr)=>{return acc + curr.total - curr.accepted - curr.rejected - curr.awaiting}, 0)} fontSize='16px'>
                                            </EVerticalProperty>
                                        </Box>

                                        <Box  sx={{p: '8px', px: '5px', mb:2}}>
                                            <EVerticalProperty  name={t("Total contents")}
                                                value={libraryData.reduce((acc, curr)=>{return acc + curr.total}, 0)} fontSize='16px'>
                                            </EVerticalProperty>
                                        </Box>
                                <Paper elevation={10}  className='p-0' style={{height:'400px'}}>
                                    <Typography variant="body1" component="p" className="text-left p-2" style={{color: `rgba(82, 57, 112, 1)`,fontSize:20, fontWeight:'bold'}}>
                                        {t("Contents created")}
                                    </Typography>
                                    <LibraryChart data={libraryData}/>
                                </Paper>
                        </Paper> 
                </Grid>

                <Grid item xs={12} lg={6}>
                    <Paper elevation={16} className='p-3'>
                        <ETabBar
                            value={activeTab}
                            onChange={(e,i)=>setActiveTab(i)}
                            eSize='small'
                            style={{maxWidth:'350px'}}
                            className="mb-3"
                        >
                            <ETab label='Awaiting list' eSize='small'/>
                            <ETab label='My recent activity' eSize='small'/>
                        </ETabBar>
                        {activeTab===0 &&(
                            <LastItemsTable awaiting={awaiting} lastActivity={[]} type={"AWAITING"}/>
                        )}
                        {activeTab===1 &&(
                            <LastItemsTable awaiting={[]} lastActivity={lastActivity} type={"LAST_ACTIVITY"}/>
                        )}
                    </Paper>
                </Grid>
            </Grid>
    )
}