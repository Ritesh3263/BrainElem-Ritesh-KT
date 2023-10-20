import React, {lazy, useEffect, useState} from 'react';
import Grid from "@mui/material/Grid";
import {Card, CardContent, CardHeader, MenuItem, Paper} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {useTranslation} from "react-i18next";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import List from '@mui/material/List';
import {ListItem, ListItemText} from "@mui/material";
import newDashboardService from "services/new_dashboard.service";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {theme} from "MuiTheme";

const PerformanceBarChart = lazy(()=>import("../PerformanceBarChart"));
const PerformancePieChart = lazy(()=>import("../PerformancePieChart"));
const PerformanceLineChart = lazy(()=>import("../PerformanceLineChart"));

function Parent(props) {
    const {
        type=''
    } = props;
    const { t } = useTranslation();
    const {F_handleSetShowLoader,F_showToastMessage,F_getErrorMessage,F_getHelper} = useMainContext();
    const {user} = F_getHelper();
    const [selected, setSelected] = useState({});
    const [performance, setPerformance]=useState([]);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    useEffect(()=>{
        newDashboardService.readPerformance(user.id, user.role, type).then(res=>{
            if(res.status === 200 && res.data){
                setSelected(res.data.selectItems[0])
                setPerformance(res.data);
                F_handleSetShowLoader(false);
            }
        }).catch(err=>{
            console.log(err);
            F_handleSetShowLoader(false);
            F_showToastMessage(F_getErrorMessage(err), 'error');
        });
    },[]);

    const selectList = performance?.selectItems?.length>0 ? performance?.selectItems.map((item,i)=><MenuItem key={`selects_${i+1}`} value={item}>{item.name}</MenuItem>):[];
    const statisticalInfosList = selected && selected?.statisticalInfos?.length>0 ? selected?.statisticalInfos.map((e,i)=>(
        <ListItem
            key={`event_list_${i+1}`}
            secondaryAction={
                <Typography variant="body2" component="h2" className="text-center" >
                    {`${e?.info||'-'}`}
                </Typography>
            }
        >
            <ListItemText primary={e?.name||'-'} style={{color: `rgba(82, 57, 112, 1)`}}/>
        </ListItem>
    )):[];

    return (
        <Grid item xs={12} sm={12} md={8} className='d-flex flex-row flex-grow-1'>
            <Card style={{borderRadius:"16px", background: theme.palette.glass.opaque}} className='d-flex flex-column flex-grow-1 pl-1'>
                <CardHeader className='p-2' title={(
                    <Typography variant="h3" component="h6" className="text-left"
                            style={{fontSize:"24px"}}>
                        {t('My performance')}
                    </Typography>
                )}
                />
                <CardContent className='py-0 px-1' style={{overflowX:'hidden'}}>
                    <Grid container className='mt-1 mx-1'>
                        <Grid item xs={12} lg={6}> 
                        {/* md={selected?.chartType==='bar'?4:12}> */}
                            <Grid item align="center" xs={12} lg={10} style={{margin:"auto"}}>
                                <FormControl className='ml-2' fullWidth margin="dense" variant='filled' style={{maxWidth: "300px"}} error={false} >
                                    <InputLabel id="s-select-label">{t("Select a category")}</InputLabel>
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
                            { selected?.chartType==='bar'? (<>
                                    <Grid item xs={12} className='mt-3'>
                                        <Typography variant="h6" component="h2" className="text-center" style={{color: `rgba(82, 57, 112, 1)`}}>
                                            {t("Visit time")}
                                        </Typography>
                                        <Typography variant="h6" component="h2" className="text-center" style={{color: `rgba(168, 92, 255, 1)`,fontWeight: 'bold'}}>
                                            {`${selected?.totalVisitTime||'0'} min`}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} style={{height:'200px'}}>
                                        <PerformanceBarChart data={selected.lastWeekActivity}/>
                                    </Grid>
                                </>)
                                : selected?.chartType==='pie'? (<>
                                    <Grid item xs={12} className='mt-3'>
                                        <Typography variant="h6" component="h2" className="text-center" style={{color: `rgba(82, 57, 112, 1)`}}>
                                            {t("Number of created events")}
                                        </Typography>
                                        <Typography variant="h6" component="h2" className="text-center" style={{color: `rgba(168, 92, 255, 1)`,fontWeight: 'bold'}}>
                                            {`${selected.countAllEvents||'-'} `}
                                        </Typography>
                                    </Grid>
                                    {selected?.pieChartData?.length>0 ? selected?.pieChartData.map(d=>(
                                        <Grid key={d.id} item xs={12} style={{height:'200px'}}>
                                        <PerformancePieChart data={d.subItems}/>
                                        </Grid>
                                    )) : null}
                                </>)
                                : selected?.chartType==='line'? (<>
                                    <Grid item xs={12} className='mt-3'>
                                        <Typography variant="h6" component="h2" className="text-center" style={{color: `rgba(82, 57, 112, 1)`}}>
                                            {t("Activity (minutes)")}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} style={{height:'300px'}}>
                                        <PerformanceLineChart data={selected.screenTime}/>
                                    </Grid>
                                </>)
                                : (<>
                         
                                </>)
                            }
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <List className='px-3' dense={true}>
                                {selected?.chartType==='bar'? (
                                    <>
                                        {statisticalInfosList}
                                        <ListItem
                                            secondaryAction={
                                                <Typography variant="body2" component="h2" className="text-center" >
                                                    {`${selected?.moreInfo||'-'}`}
                                                </Typography>
                                            }
                                        >
                                            <ListItemText primary={t('More info..')} style={{color: `rgba(82, 57, 112, 1)`}}/>
                                        </ListItem>
                                    </>
                                ):
                                selected?.chartType==='pie'? (
                                    <>
                                        {statisticalInfosList}
                                        <ListItem
                                            secondaryAction={
                                                <Typography variant="body2" component="h2" className="text-center" >
                                                    {`${selected?.moreInfo||'-'}`}
                                                </Typography>
                                            }
                                        >
                                            <ListItemText primary={t('More info..')} style={{color: `rgba(82, 57, 112, 1)`}}/>
                                        </ListItem>
                                    </>
                                ): 
                                selected?.chartType==='line'? (
                                    <>
                                        {statisticalInfosList}
                                        <ListItem
                                            secondaryAction={
                                                <Typography variant="body2" component="h2" className="text-center" >
                                                    {`${selected?.moreInfo||'-'}`}
                                                </Typography>
                                            }
                                        >
                                            <ListItemText primary={t('More info..')} style={{color: `rgba(82, 57, 112, 1)`}}/>
                                        </ListItem>
                                    </>
                                ): " "
                            }
                            </List>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Grid>
    );
}

export default Parent;