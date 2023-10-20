import React, {lazy, useEffect, useState} from 'react';
import Grid from "@mui/material/Grid";
import {Card, CardContent, CardHeader, MenuItem} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {useTranslation} from "react-i18next";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import newDashboardService from "services/new_dashboard.service";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

const NetworkDetailsPieChart = lazy(() => import("./NetworkDetailsPieChart"));

const NetworkDetails=(props)=> {
    const{}=props;
    const { t } = useTranslation();
    const {F_handleSetShowLoader,F_showToastMessage,F_getErrorMessage} = useMainContext();
    const [networks, setNetworks]=useState(null);
    const [averageGrade,setAverageGrade]=useState(null);
    const [averageStudentFrequency,setAverageStudentFrequency]=useState(null);
    const [selectedModel, setSelectedModel]=useState({
        selectedNetwork: [],
        selectedAverageGrade:[],
        selectedAverageStudentFrequency: [],
    });

    useEffect(()=>{
        // get netowrks
        newDashboardService.readNetworks('query?').then(res=>{
            if(res.status === 200 && res.data.length>0){
                setNetworks(res.data);
                F_handleSetShowLoader(false);
                setSelectedModel(p=>({...p, selectedNetwork: res.data[0]}))
            }
        }).catch(err=>{
            console.log(err);
            F_handleSetShowLoader(false);
            F_showToastMessage(F_getErrorMessage(err), 'error');
        });

        // get average grade
        newDashboardService.readNetworkDetails('AVERAGE_GRADE').then(res=>{
            if(res.status === 200 && res.data.length>0){
                setAverageGrade(res.data);
                F_handleSetShowLoader(false);
                setSelectedModel(p=>({...p, selectedAverageGrade: res.data[0]}))
            }
        }).catch(err=>{
            console.log(err);
            F_handleSetShowLoader(false);
            F_showToastMessage(F_getErrorMessage(err), 'error');
        });

        // get average student frequency
        newDashboardService.readNetworkDetails('STUDENT_FREQUENCY').then(res=>{
            if(res.status === 200 && res.data.length>0){
                setAverageStudentFrequency(res.data);
                F_handleSetShowLoader(false);
                setSelectedModel(p=>({...p, selectedAverageStudentFrequency: res.data[0]}))
            }
        }).catch(err=>{
            console.log(err);
            F_handleSetShowLoader(false);
            F_showToastMessage(F_getErrorMessage(err), 'error');
        });

    },[]);

    const networksList = networks?.length>0 ? networks.map((item)=><MenuItem key={item._id} value={item}>{item.name}</MenuItem>):[];
    const averageGradeList = averageGrade?.length>0 ? averageGrade.map((item)=><MenuItem key={item._id} value={item}>{item.name}</MenuItem>):[];
    const averageStudentFrequencyList = averageStudentFrequency?.length>0 ? averageStudentFrequency.map((item)=><MenuItem key={item._id} value={item}>{item.name}</MenuItem>):[];

     return (
         <Grid item xs={12} md={4} className='d-flex flex-row flex-grow-1'>
             <Card className='d-flex flex-column flex-grow-1'>
                 <CardHeader className='p-2' title={(
                     <Grid container>
                         <Grid item xs={12} className='d-flex justify-content-start align-items-center'>
                             <Typography variant="body1" component="h6" className="text-left"
                                         style={{color: `rgba(82, 57, 112, 1)`,fontSize:20, fontWeight:600}}>
                                 {t('Network details')}
                             </Typography>
                         </Grid>
                     </Grid>
                 )}
                 />
                 <CardContent className='py-0 px-3'>
                     <Grid container className='pt-1'>
                         <Grid item xs={12}>
                           <Grid container spacing={1}>
                               <Grid item xs={6} className='d-flex flex-column justify-content-center'>
                                   <Typography variant="body1" component="h6" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                       {t("Storage space")}
                                   </Typography>
                                   <FormControl fullWidth margin="dense" variant='filled' style={{maxWidth: "300px"}} error={false} >
                                       <InputLabel id="s-select-label">{t("Select network")}</InputLabel>
                                       <Select
                                           name='selectedNetwork'
                                           labelId="s-select-label"
                                           id="eventType-select"
                                           value={selectedModel.selectedNetwork}
                                           renderValue={p=>p.name}
                                           onChange={({target:{value,name}}) =>setSelectedModel(p=>({...p,[name]:value}))}
                                       >
                                           {networksList}
                                       </Select>
                                   </FormControl>
                               </Grid>
                               <Grid item xs={6} style={{minHeight:'170px'}}>
                                   {selectedModel?.selectedNetwork && (
                                       <NetworkDetailsPieChart data={selectedModel?.selectedNetwork} type='STORAGE'/>
                                   )}
                               </Grid>
                           </Grid>
                         </Grid>
                         <Grid item xs={12} className='mt-4'>
                             <Grid container>
                                 <Grid item xs={6} className='d-flex flex-column justify-content-center'>
                                     <Typography variant="body1" component="h6" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                         {t("Average grade")}
                                     </Typography>
                                     <FormControl fullWidth margin="dense" variant='filled' style={{maxWidth: "300px"}} error={false} >
                                         <InputLabel id="s-select-label">{t("Select item")}</InputLabel>
                                         <Select
                                             name='selectedAverageGrade'
                                             labelId="s-select-label"
                                             id="eventType-select"
                                             value={selectedModel.selectedAverageGrade}
                                             renderValue={p=>p.name}
                                             onChange={({target:{value,name}}) =>setSelectedModel(p=>({...p,[name]:value}))}
                                         >
                                             {averageGradeList}
                                         </Select>
                                     </FormControl>
                                 </Grid>
                                 <Grid item xs={6} style={{minHeight:'170px'}}>
                                     {selectedModel?.selectedAverageGrade && (
                                         <NetworkDetailsPieChart data={selectedModel?.selectedAverageGrade} type='GRADE'/>
                                     )}
                                 </Grid>
                             </Grid>
                         </Grid>
                         <Grid item xs={12} className='mt-4'>
                             <Grid container>
                                 <Grid item xs={6} className='d-flex flex-column justify-content-center'>
                                     <Typography variant="body1" component="h6" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                         {t("Average student frequency")}
                                     </Typography>
                                     <FormControl fullWidth margin="dense" variant='filled' style={{maxWidth: "300px"}} error={false} >
                                         <InputLabel id="s-select-label">{t("Select item")}</InputLabel>
                                         <Select
                                             name='selectedAverageStudentFrequency'
                                             labelId="s-select-label"
                                             id="eventType-select"
                                             value={selectedModel.selectedAverageStudentFrequency}
                                             renderValue={p=>p.name}
                                             onChange={({target:{value,name}}) =>setSelectedModel(p=>({...p,[name]:value}))}
                                         >
                                             {averageStudentFrequencyList}
                                         </Select>
                                     </FormControl>
                                 </Grid>
                                 <Grid item xs={6} style={{minHeight:'170px'}} className='mb-2'>
                                     {selectedModel?.selectedAverageStudentFrequency && (
                                         <NetworkDetailsPieChart data={selectedModel?.selectedAverageStudentFrequency} type='STUDENT'/>
                                     )}
                                 </Grid>
                             </Grid>
                         </Grid>
                     </Grid>
                 </CardContent>
             </Card>
         </Grid>
     )
 }

export default NetworkDetails;