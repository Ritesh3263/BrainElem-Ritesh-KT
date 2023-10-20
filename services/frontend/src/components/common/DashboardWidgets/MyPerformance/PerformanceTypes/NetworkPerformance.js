import React, {lazy, useEffect, useState} from 'react';
import Grid from "@mui/material/Grid";
import {Card, CardContent, CardHeader, MenuItem} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {useTranslation} from "react-i18next";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import List from '@mui/material/List';
import {ListItem, ListItemText} from "@mui/material";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import newDashboardService from "services/new_dashboard.service";
import {theme} from "MuiTheme";

const PerformanceLineChart = lazy(()=>import("../PerformanceLineChart"));


function NetworkPerformance(props) {
    const {
        type=''
    } = props;
    const { t } = useTranslation();
    const {F_handleSetShowLoader,F_showToastMessage,F_getErrorMessage} = useMainContext();
    const [selected, setSelected] = useState({});
    const [networks, setNetworks] = useState([]);

    useEffect(()=>{
        newDashboardService.readNetworkPerformance(type).then(res=>{
            if(res.status === 200 && res.data.length>0){
                setNetworks(res.data);
                F_handleSetShowLoader(false);
                setSelected(res.data[0])
            }
        }).catch(err=>{
            console.log(err);
            F_handleSetShowLoader(false);
            F_showToastMessage(F_getErrorMessage(err), 'error');
        });
    },[]);

    const selectList = networks?.length>0 ? networks.map((item)=><MenuItem key={item._id} value={item}>{item.name}</MenuItem>):[];

    return (
        <Grid item xs={12} sm={12} md={8} className='d-flex flex-row flex-grow-1'>
            <Card style={{borderRadius:"16px", background: theme.palette.glass.opaque}} className='d-flex flex-column flex-grow-1 pl-1'>
                <CardHeader className='p-2' title={(
                    <Typography variant="h3" component="h6" className="text-left"
                            style={{fontSize:"24px"}}>
                        {t('Network statistic')}
                    </Typography>
                )}
                />
                <CardContent className='py-0 px-1' style={{overflowX:'hidden'}}>
                    <Grid container className='mt-1 mx-1'>
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <FormControl className='ml-2' fullWidth margin="dense" variant='filled' style={{maxWidth: "300px"}} error={false} >
                                        <InputLabel id="s-select-label">{t("Select network")}</InputLabel>
                                        <Select  style={{borderRadius:"16px", border:"1px solid black"}}
                                            name='select'
                                            labelId="s-select-label"
                                            id="eventType-select"
                                            value={selected}
                                            renderValue={p=>p.name}
                                            onChange={({target:{value}}) =>setSelected(value)}
                                        >
                                            {selectList}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <List className='px-3' dense={true}>
                                        {selected && (
                                            <>
                                                <ListItem>
                                                    <ListItemText primary={t('User base')} style={{color: `rgba(168, 92, 255, 1)`,fontWeight:'bold',fontSize:20}} disableTypography={true}/>
                                                </ListItem>
                                                <ListItem
                                                    secondaryAction={
                                                        <Typography variant="body2" component="h2" className="text-center" >
                                                            {selected?.info?.usersTotal||'-'}
                                                        </Typography>
                                                    }
                                                >
                                                    <ListItemText primary={t('Users total')} style={{color: `rgba(82, 57, 112, 1)`}}/>
                                                </ListItem>
                                                <ListItem
                                                    secondaryAction={
                                                        <Typography variant="body2" component="h2" className="text-center" >
                                                            {selected?.info?.students||'-'}
                                                        </Typography>
                                                    }
                                                >
                                                    <ListItemText primary={t('Students')} style={{color: `rgba(82, 57, 112, 1)`}}/>
                                                </ListItem>
                                                <ListItem
                                                    secondaryAction={
                                                        <Typography variant="body2" component="h2" className="text-center" >
                                                            {selected?.info?.teachers||'-'}
                                                        </Typography>
                                                    }
                                                >
                                                    <ListItemText primary={t('Teachers')} style={{color: `rgba(82, 57, 112, 1)`}}/>
                                                </ListItem>
                                                <ListItem
                                                    secondaryAction={
                                                        <Typography variant="body2" component="h2" className="text-center" >
                                                            {selected?.info?.others||'-'}
                                                        </Typography>
                                                    }
                                                >
                                                    <ListItemText primary={t('Others')} style={{color: `rgba(82, 57, 112, 1)`}}/>
                                                </ListItem>
                                            </>
                                        )}
                                    </List>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <List className='px-3' dense={true}>
                                        {selected && (
                                            <>
                                                <ListItem>
                                                    <ListItemText primary={t('Factory content')} style={{color: `rgba(168, 92, 255, 1)`,fontWeight:'bold',fontSize:20}} disableTypography={true}/>
                                                </ListItem>
                                                <ListItem
                                                    secondaryAction={
                                                        <Typography variant="body2" component="h2" className="text-center" >
                                                            {selected?.info?.c1||'-'}
                                                        </Typography>
                                                    }
                                                >
                                                    <ListItemText primary={t('Content 1')} style={{color: `rgba(82, 57, 112, 1)`}}/>
                                                </ListItem>
                                                <ListItem
                                                    secondaryAction={
                                                        <Typography variant="body2" component="h2" className="text-center" >
                                                            {selected?.info?.c2||'-'}
                                                        </Typography>
                                                    }
                                                >
                                                    <ListItemText primary={t('Content 2')} style={{color: `rgba(82, 57, 112, 1)`}}/>
                                                </ListItem>
                                                <ListItem
                                                    secondaryAction={
                                                        <Typography variant="body2" component="h2" className="text-center" >
                                                            {selected?.info?.c3||'-'}
                                                        </Typography>
                                                    }
                                                >
                                                    <ListItemText primary={t('Content 1')} style={{color: `rgba(82, 57, 112, 1)`}}/>
                                                </ListItem>
                                                <ListItem
                                                    secondaryAction={
                                                        <Typography variant="body2" component="h2" className="text-center" >
                                                            {selected?.info?.c4||'-'}
                                                        </Typography>
                                                    }
                                                >
                                                    <ListItemText primary={t('Content 4')} style={{color: `rgba(82, 57, 112, 1)`}}/>
                                                </ListItem>
                                            </>
                                        )}
                                    </List>
                                </Grid>
                                {!!selected && (
                                    <>
                                        <Grid item xs={12} className='my-3 pl-4' >
                                            <Typography variant="h6" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                                {t('Activity per user')}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} style={{height:'350px'}}>
                                            {selected.chartData && (
                                                <PerformanceLineChart data={selected.chartData}/>
                                            )}
                                        </Grid>
                                    </>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Grid>
    );
}

export default NetworkPerformance;