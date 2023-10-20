import React, {useEffect, useState} from 'react';
import Grid from "@mui/material/Grid";
import {Card, CardContent, CardHeader} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {useTranslation} from "react-i18next";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import {theme} from "MuiTheme";
import newDashboardService from "services/new_dashboard.service";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import Pagination from "../Helpers/Pagination";

function MyAccomplishments(props) {
    const {} = props;
    const { t } = useTranslation();
    const {F_handleSetShowLoader,F_showToastMessage,F_getErrorMessage, F_getHelper} = useMainContext();
    const {user} = F_getHelper();
    const [accomplishments, setAccomplishments] = useState([]);
    const {manageScopeIds} = F_getHelper();
    const [showData, setShowData] = useState([]);

    useEffect(()=>{
        newDashboardService.readAccomplishments('query?').then(res=>{
            if(res.status === 200 && res.data.length>0){
                setAccomplishments(res.data);
                F_handleSetShowLoader(false);
            }
        }).catch(err=>{
            console.log(err);
            F_handleSetShowLoader(false);
            F_showToastMessage(F_getErrorMessage(err), 'error');
        });
    },[]);

    const accomplishmentsList = showData.length>0 ? showData.map(ac=>(
        <ListItem style={{backgroundColor:'rgba(255,255,255,0.6)',borderRadius:'8px'}} key={ac._id} className='my-2'>
            <ListItemAvatar>
                <StarOutlineIcon style={{fill:'rgba(239, 209, 53, 1)',border:"double 4px #EFD135", borderRadius:"50%", borderStyle:"double"}} fontSize='large'/>
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Typography variant="body1" component="h6" className="text-left"
                                style={{color: `rgba(96, 103, 104, 1)`}}>
                        {manageScopeIds.isTrainingCenter? ac.certificationSession.certificate.name||'-' : ac.event?.assignedSubject?.name+" >> "+ ac.event?.name||'-'}
                    </Typography>
                }
                secondary={
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography variant="body1" component="h6" className="text-left"
                                        style={{color: `rgba(168, 92, 255, 1)`,fontWeight:'bold'}}>
                                {manageScopeIds.isTrainingCenter? ac.certificationSession.name||'-': ac.grade||'-'}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body2" component="h6" className="text-left"
                                        style={{color: `rgba(96, 103, 104, 1)`}}>
                                {`Date: ${new Date(manageScopeIds.isTrainingCenter? ac.verificationDate: ac.updatedAt).toLocaleDateString()}`}
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
                                {user.role === 'Parent' ? t('My Child Accomplishments') : t('My Accomplishments') }
                            </Typography>
                        </Grid>
                    </Grid>
                )}
                />
                <CardContent className='py-0 px-3' style={{display: 'flex', flexGrow: 1}}>
                    <Grid container className='pt-0'>
                        <Grid item xs={12}>
                            <List dense={true} disablePadding={false}>
                                {accomplishmentsList?.length>0 ? accomplishmentsList : <span>{t('No data yet')}</span>}
                            </List>
                        </Grid>
                    </Grid>
                </CardContent>
                <Pagination
                    viewAllRoute={'gradebooks-main'}
                    originalData={accomplishments}
                    setShowData={setShowData}
                />
            </Card>
        </Grid>
    );
}

export default MyAccomplishments;