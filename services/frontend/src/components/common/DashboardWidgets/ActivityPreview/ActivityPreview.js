import React, {useEffect, useState} from 'react';
import Grid from "@mui/material/Grid";
import {Card, CardContent, CardHeader} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {useTranslation} from "react-i18next";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import newDashboardService from "services/new_dashboard.service";
import {theme} from "MuiTheme";
import Pagination from "../Helpers/Pagination";

function ActivityPreview(props) {
    const {
        sizeType='1/3'
    } = props;
    const { t } = useTranslation();
    const {F_handleSetShowLoader,F_showToastMessage,F_getErrorMessage, F_getHelper} = useMainContext();
    const {user} = F_getHelper();
    const [activity, setActivity]=useState([]);
    const [showData, setShowData] = useState([]);

    useEffect(()=>{
        newDashboardService.readLastActivity('query?').then(res=>{
            if(res.status === 200 && res.data.length>0){
                setActivity(res.data);
                F_handleSetShowLoader(false);
            }
        }).catch(err=>{
            console.log(err);
            F_handleSetShowLoader(false);
            F_showToastMessage(F_getErrorMessage(err), 'error');
        });
    },[]);


    const lastActivityList = showData.length>0 ? showData.map(ac=>(
        <ListItem style={{backgroundColor:'rgba(255,255,255,0.6)',borderRadius:'8px'}} key={ac._id} className='my-2'>
            <ListItemText
                primary={
                    <Typography variant="body2" component="h6" className="text-left"
                                style={{color: `rgba(96, 103, 104, 1)`}}>
                        {ac?.createdAt ? (new Date(ac.createdAt).toLocaleDateString()) :'-'}
                    </Typography>
                }
                secondary={
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography display="inline" variant="body1" component="h6" className="text-left"
                                        style={{color: `rgba(168, 92, 255, 1)`,fontWeight:'bold'}}>
                                {ac?.action.toUpperCase()||'-'}
                            </Typography>
                            <Typography display="inline" variant="body1" component="h6" className="text-left"
                                        style={{color: `rgba(96, 103, 104, 0.8)`}}>
                                            {ac?` (${(ac.details.totalTime/60).toFixed(1)} min)`:``}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1" component="h6" className="text-left"
                                        style={{color: `rgba(82, 57, 112, 1)`, overflowWrap:'anywhere'}}>
                                {ac?.accessedURLs?.[0]?.name||'-'}{ac?.accessedURLs?.length>1?`, and ${ac.accessedURLs.length} more`:''}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body2" component="h6" className="text-left"
                                        style={{color: `rgba(96, 103, 104, 1)`}}>
                                {`by @${ac.user?.name || '-'} ${ac.user?.surname || ''}`}
                            </Typography>
                        </Grid>
                    </Grid>
                }
            />
        </ListItem>
    )): [];
    return (
        <Grid item xs={12} md={sizeType==='2/3' ? 8 : 4} className='d-flex flex-row flex-grow-1' sx={{maxHeight: '450px'}}>
            <Card style={{borderRadius:"8px", background: theme.palette.glass.opaque}}  className='d-flex flex-column flex-grow-1'>
                <CardHeader className='p-2' title={(
                    <Grid container>
                        <Grid item xs={12} className='d-flex justify-content-start align-items-center'>
                            <Typography variant="body1" component="h6" className="text-left"
                                        style={{color: `rgba(82, 57, 112, 1)`,fontSize:20, fontWeight:600}}>
                                {user.role === 'Parent' ? t('Activity preview of my child') : t('Activity preview') }
                            </Typography>
                        </Grid>
                    </Grid>
                )}
                />
                <CardContent className='py-0 px-3' style={{display:'flex', flexGrow: 1}}>
                    <Grid container>
                        <Grid item xs={12}>
                            <List dense={true} disablePadding={false}>
                                {lastActivityList?.length>0 ? lastActivityList : <span>{t('No data yet')}</span>}
                            </List>
                        </Grid>
                    </Grid>
                </CardContent>
                <Pagination
                    //disableViewAll
                    viewAllRoute={'activities'}
                    originalData={activity}
                    setShowData={setShowData}
                />
            </Card>
        </Grid>
    );
}

export default ActivityPreview;