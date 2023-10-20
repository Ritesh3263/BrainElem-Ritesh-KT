import React, {useEffect, useState} from 'react';
import Grid from "@mui/material/Grid";
import {Card, CardContent, CardHeader} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {useTranslation} from "react-i18next";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from "@material-ui/core/Box";
import {Badge} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {makeStyles} from "@material-ui/core/styles";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import newDashboardService from "services/new_dashboard.service";
import {theme} from "MuiTheme";
import Pagination from "../Helpers/Pagination";

const useStyles = makeStyles(theme => ({
    darkViolet: {
        color: theme.palette.primary.darkViolet
    },
}))

function MyLastEnquiries(props) {
    const {
        role=''
    } = props;
    const { t } = useTranslation();
    const classes = useStyles();
    const {F_handleSetShowLoader,F_showToastMessage,F_getErrorMessage} = useMainContext();
    const [lastEnquiries, setLastEnquiries]=useState([]);
    const [showData, setShowData] = useState([]);

    useEffect(()=>{
        newDashboardService.readMyLastEnquiries('query?').then(res=>{
            if(res.status === 200 && res.data.length>0){
                setLastEnquiries(res.data);
                F_handleSetShowLoader(false);
            }
        }).catch(err=>{
            console.log(err);
            F_handleSetShowLoader(false);
            F_showToastMessage(F_getErrorMessage(err), 'error');
        });
    },[]);

    const statusHelper=(status)=>{
        switch(status){
            case 'NEW_ENQUIRY':{
                return(
                    <Box>
                        <Typography variant="body1" component="h6" className="text-left"
                                    style={{color: `rgba(82, 57, 112, 1)`,fontWeight:'bold'}}>
                            <Badge color="warning" variant="dot" className='mr-3'/>
                            {t('new enquiry')||'-'}
                        </Typography>
                    </Box>
                );
            }
            case 'PENDING':{
                return (
                    <Box>
                        <Typography variant="body1" component="h6" className="text-left"
                                    style={{color: `rgba(82, 57, 112, 1)`,fontWeight:'bold'}}>
                            <Badge color="info" variant="dot" className='mr-3'/>
                            {t('pending')||'-'}
                        </Typography>
                    </Box>
                )
            }
            case 'IN_DEVELOPMENT':{
                return(
                    <Box>
                        <Typography variant="body1" component="h6" className="text-left"
                                    style={{color: `rgba(82, 57, 112, 1)`,fontWeight:'bold'}}>
                            <Badge color="primary" variant="dot" className='mr-3'/>
                            {t('in development')||'-'}
                        </Typography>
                    </Box>
                )
            }
            case 'ACTIVE':{
                return(
                    <Box>
                        <Typography variant="body1" component="h6" className="text-left"
                                    style={{color: `rgba(82, 57, 112, 1)`,fontWeight:'bold'}}>
                            <Badge color="success" variant="dot" className='mr-3'/>
                            {t('active')||'-'}
                        </Typography>
                    </Box>
                )
            }
            case 'CLOSED':{
                return(
                    <Box>
                        <Typography variant="body1" component="h6" className="text-left"
                                    style={{color: `rgba(82, 57, 112, 1)`,fontWeight:'bold'}}>
                            <Badge color="primary" variant="dot" className='mr-3' />
                            {t('closed')||'-'}
                        </Typography>
                    </Box>
                )
            }
            default:{
                return (
                    <Box>
                        <Typography variant="body1" component="h6" className="text-left"
                                    style={{color: `rgba(82, 57, 112, 1)`,fontWeight:'bold'}}>
                            <Badge color="default" variant="dot" className='mr-3'/>
                            {t('undefined')}
                        </Typography>
                    </Box>
                )
            }
        }
    }

    const lastEnquiriesList = showData.length>0 ? showData.map((item,index)=>(
        <ListItem style={{backgroundColor:'rgba(255,255,255,0.6)',borderRadius:'8px'}} key={item._id} className='my-2'
                  secondaryAction={
                      <IconButton edge="end" aria-label="action" color='secondary' size="small" className={`${classes.darkViolet}`}
                                  style={{backgroundColor:'rgba(255,255,252,0.8)'}}
                                  onClick={()=>{}}
                      >
                          <ChevronRightIcon />
                      </IconButton>
                  }
        >
            <ListItemText
                primary={
                    <Typography variant="body2" component="h6" className="text-left"
                                style={{color: `rgba(96, 103, 104, 1)`}}>
                        {`${t('No')}: ${index+1}`}
                    </Typography>
                }
                secondary={
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography variant="body1" component="h6" className="text-left"
                                        style={{color: `rgba(168, 92, 255, 1)`,fontWeight:'bold'}}>
                                {item?.assignedItem?.name||'-'}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1" component="h6" className="text-left"
                                        style={{color: `rgba(82, 57, 112, 1)`}}>
                                <Box className='d-flex'>
                                    <span className='mr-3'>{`${t('Status')}: `}</span>
                                    <span>{statusHelper(item.status)}</span>
                                </Box>
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body2" component="h6" className="text-left"
                                        style={{color: `rgba(96, 103, 104, 1)`}}>
                                {`Last update: ${item.updatedAt ?  (new Date(item.updatedAt).toLocaleDateString()) : '-'}`}
                            </Typography>
                        </Grid>
                    </Grid>
                }
            />
        </ListItem>
    )): [];
    return (
        <Grid item xs={12} md={4} className='d-flex flex-row flex-grow-1' style={{maxHeight:'450px'}}>
            <Card style={{background: theme.palette.glass.opaque, borderRadius:'8px'}} className='d-flex flex-column flex-grow-1'>
                <CardHeader className='p-2' title={(
                    <Grid container>
                        <Grid item xs={12} className='d-flex justify-content-start align-items-center'>
                            <Typography variant="body1" component="h6" className="text-left"
                                        style={{color: `rgba(82, 57, 112, 1)`,fontSize:20, fontWeight:600}}>
                                {role === 'ARCHITECT' ? t('Enquiries') : t('My last enquiries')}
                            </Typography>
                        </Grid>
                    </Grid>
                )}
                />
                <CardContent className='py-0 px-3' style={{display:'flex', flexGrow: 1}}>
                    <Grid container className='pt-1'>
                        <Grid item xs={12}>
                            <List dense={true} disablePadding={false}>
                                {lastEnquiriesList?.length>0 ? lastEnquiriesList : <span>{t('No data yet')}</span>}
                            </List>
                        </Grid>
                    </Grid>
                </CardContent>
                <Pagination
                    viewAllRoute={'enquires'}
                    originalData={lastEnquiries}
                    setShowData={setShowData}
                />
            </Card>
        </Grid>
    );
}

export default MyLastEnquiries;