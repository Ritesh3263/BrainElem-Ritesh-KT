import React, {useEffect, useState} from 'react';
import Grid from "@mui/material/Grid";
import {Card, CardContent, CardHeader, Paper} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import FilterIconButton from "components/common/FilterIconButton";
import {useTranslation} from "react-i18next";
import {now} from "moment";
import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import ClearIcon from '@mui/icons-material/Clear';
import {theme} from "MuiTheme";
import newDashboardService from "services/new_dashboard.service";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import Pagination from "../Helpers/Pagination";
import EventService from "services/event.service";


function UpcomingEvents() {

    const { t } = useTranslation();
    const {F_handleSetShowLoader,F_showToastMessage,F_getErrorMessage, F_getHelper} = useMainContext();
    const {user, userPermissions} = F_getHelper();
    const [filters,setFilters]=useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);

    // viewOnPage
    const [showData, setShowData] = useState([]);

    const isTrainingCenter = F_getHelper().manageScopeIds.isTrainingCenter;

    useEffect(() => {
        newDashboardService.readUpcomingEvents().then(res=>{
            if(res.status === 200 && res.data?.length>0){
                setUpcomingEvents(res.data);
                F_handleSetShowLoader(false);
            }
        }).catch(err=>{
            console.log(err);
            F_handleSetShowLoader(false);
            F_showToastMessage(F_getErrorMessage(err), 'error');
        });
        EventService.getMyClasses().then(res=>{
            if(res.status === 200 && res?.data.length>0){
                res.data.map((c,index)=>{
                    btns_initial_state[btns_initial_state.findIndex(f=> f.id === 'GROUPS')].items.push({
                        id: c._id,
                        name: c.name,
                        isSelected: false,
                    })
                })
            }
        })
    }, []);


    useEffect(()=>{
        let _filtered =[];
        if(filters.length>0){
            if(filters.some(f => (f.groupId === 'FILTERS'))){
                _filtered = upcomingEvents.filter(fd =>{
                    if(filters.some(f => (f.groupId === 'FILTERS') && (f.name === fd?.eventType))){
                        return fd;
                    }
                });
            }else if(filters.some(f => (f.groupId === 'GROUPS'))){
                _filtered = upcomingEvents.filter(fd =>{
                    if(filters.some(f => f.id === fd.assignedGroup)){
                        return fd;
                    }
                })
            }
            if(_filtered.length>=0){
                setShowData(_filtered);
            }
        }else {
            setShowData(upcomingEvents);
        }

    },[filters]);

    const selectFilterHandler=({type,payload})=>{
        switch (type){
            case 'CLEAR':{
                _setBtns(btns_initial_state);
                selectFilterHandler({type:'SAVE',payload:true});
                break;
            }
            case 'SAVE':{
                _btns.map(btns=>{
                    btns.items.map(i=>{
                        if(i.isSelected && !filters.some(f=> f.id === i.id)){
                            setFilters(p=>([...p,{...i,groupId:btns.id}]));
                        }else if(!i.isSelected && filters.some(f=> f.id === i.id)){
                            setFilters(p=> p.filter(f=> f.id !== i.id));
                        }
                    })
                });
                break;
            }
            case 'CHECK':{
                _setBtns(p=>{
                   let val = Object.assign([],p);
                   val = val.map(btn=>{
                       if(btn.id === payload.groupId){
                           btn.items.map(i=>{
                               if(i.id === payload.itemId){
                                   i.isSelected = payload.state;
                               }
                               return i;
                           })
                       }
                       return btn;
                   });
                   return val;
                });
                break;
            }
            case 'CHECK_SAVE':{
                _setBtns(p=>{
                    let val = Object.assign([],p);
                    val = val.map(btn=>{
                        if(btn.id === payload.groupId){
                            btn.items.map(i=>{
                                if(i.id === payload.itemId){
                                    i.isSelected = payload.state;
                                }
                                return i;
                            })
                        }
                        selectFilterHandler({type:'SAVE',payload:true});
                        return btn;
                    });
                    return val;
                });
                break;
            }
            default: break;
        }
    };

    const btns_initial_state=[{
        id: 'FILTERS',
        type: 'FILTERS',
        name: 'Filter',
        action:(prop)=>{selectFilterHandler(prop)},
        items:[{
            id:1,
            name: 'Exam',
            isSelected: false,
        },{
            id:2,
            name: 'Homework',
            isSelected: false,
        },{
            id:3,
            name: 'Online Class',
            isSelected: false,
        }]
    },
    //     {
    //     id: 'SORT',
    //     type: 'SORT',
    //     name: 'Sort by',
    //     action:(prop)=>{selectFilterHandler(prop)},
    //     items: [{
    //         id:4,
    //         name: 'Date asc',
    //         isSelected: false,
    //     },{
    //         id:5,
    //         name: 'Date desc',
    //         isSelected: false,
    //     }]
    // },
        {
        id: 'GROUPS',
        type: 'GROUPS',
        name: 'Groups',
        action:(prop)=>{selectFilterHandler(prop)},
        items: []
    }];
    const [_btns,_setBtns] = useState(btns_initial_state);

    const filtersList = filters?.length>0 ? filters.map(f=>(
        <Chip label={f?.name||'-'}
              className="mr-1 mt-1"
              deleteIcon={<ClearIcon style={{color: `rgba(82, 57, 112, 1)`, fontSize:15}}/>}
              size="small" variant="outlined"
              onDelete={()=>selectFilterHandler({type:'CHECK_SAVE',payload:{groupId:f.groupId,itemId:f.id,state:false}})}
              style={{color: `rgba(82, 57, 112, 1)`, backgroundColor:'rgba(255,255,255,0.45)',borderRadius:'6px', borderColor:'rgba(82, 57, 112, 1)'}}
        />
    )):[];

    const upcomingEventsList = showData?.length>0 ? showData.map(upe=>(
        <Paper elevation={12} className='mb-3' key={upe._id}>
            <Typography variant="body1" component="span" className="text-left ml-1 mb-5" style={{color: `rgba(82, 57, 112, 1)`}}>
                {upe.date ? (new Date(upe.date).toLocaleDateString()) : '-'}
                {upe.date ? ( (new Date(upe.date).toLocaleDateString() === (new Date(now()).toLocaleDateString())) && ` (${t('Today')})` ) : null}
            </Typography>
            <Paper elevation={10}>
                <Paper elevation={11} className='p-1 d-flex justify-content-between align-items-center mt-2'>
                    <Typography variant="body1" component="span" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                        <small>{`${t('Time')}: `}</small>
                        <small>{upe.date ? ( String(`${new Date(upe.date).getHours()}`).padStart(2, '0')+":"+String(`${new Date(upe.date).getMinutes()}`).padStart(2, '0')) : '-'}</small>
                        <small style={{ fontWeight: "bold", color: `rgba(168, 92, 255, 1)` }}>{`  [Duration: ${upe?.durationTime??'-'} min]`}</small>
                    </Typography>
                    <div>
                        <Chip label={upe?.assignedSubject?.name} size='small' className="mr-2" style={{color: 'black', backgroundColor:'rgba(238, 235, 241, 1)'}}/>
                        <Chip color="primary" label={upe?.eventType?.toLowerCase()} size='small' style={{color: 'black', backgroundColor:'rgba(255, 255, 255, 0.8)', border: '2px solid #B372FF'}}/>
                    </div>
                </Paper>
                <Grid container className='p-1 my-1'>
                    <Grid item xs={10} className="d-flex flex-column">
                    <span>
                        {upe.assignedCourse ? (<>
                            <Typography variant="body2" component="span" className="text-left" style={{color: `rgba(0, 0, 0, 1)`}}>
                                {`${t('Course')}: `}
                            </Typography>
                            <Typography variant="body2" component="span" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                {upe?.assignedCourse?.name}
                            </Typography>
                        </>) : (<>
                            <Typography variant="body2" component="span" className="text-left" style={{color: `rgba(0, 0, 0, 1)`}}>
                                {`${t('Content')}: `}
                            </Typography>
                            <Typography variant="body2" component="span" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                {upe?.assignedContent?.title}
                            </Typography>
                        </>)}
                    </span>
                    <span>
                        <Typography variant="body2" component="p" className="text-left" style={{color: `rgba(0, 0, 0, 1)`}}>
                                 {`${t('Name')}:`} {upe?.name}
                        </Typography>
                        <Typography variant="body2" component="p" className="text-left" style={{color: `#B372FF`, cursor: 'pointer'}}
                                    onClick={()=>{window.open(`/event/${upe._id}/content/display`, '_blank')}}
                        >
                            <strong>{upe?.eventURL}</strong>
                        </Typography>
                    </span>
                    </Grid>
                    {userPermissions.isTrainee &&(
                    <Grid item xs={2} className="d-flex justify-content-center align-items-center">
                        <IconButton aria-label="icon label" size="medium"
                                    style={{backgroundColor: 'rgba(255,255,255,0.7)', height: '30px', width: '30px'}}
                                    onClick={()=>{window.open(`/event/${upe._id}/content/display`, '_blank')}}
                        >
                            <PlayCircleOutlineIcon style={{color:`rgba(82, 57, 112, 1)`}}/>
                        </IconButton>
                    </Grid>
                    )}
                </Grid>
            </Paper>
        </Paper>
    )):[];

    return (
        <Grid item xs={12} md={4} >
            <Card style={{background: theme.palette.glass.opaque, borderRadius:'8px'}} >
                <CardHeader title={(
                    <Grid container>
                        <Grid item xs={10} className='d-flex justify-content-start align-items-center'>
                            <Typography variant="body1" component="h6" className="text-left"
                                        style={{color: `rgba(82, 57, 112, 1)`,fontSize:20, fontWeight:600}}>
                                        {user.role === 'Parent' ? t('Upcoming events of my child') : t('Upcoming events') }
                            </Typography>
                        </Grid>
                        <Grid item xs={2} className='d-flex justify-content-end align-items-center'>
                            <FilterIconButton iconButton={true} btns={_btns} selectFilterHandler={selectFilterHandler}/>
                        </Grid>
                        {filters?.length>0 && (
                            <Grid item xs={12} className="d-flex justify-content-start pt-1 flex-wrap">
                                {filtersList}
                            </Grid>
                        )}
                    </Grid>
                )}
                />
                <CardContent className='py-0 pl-3 pr-3' style={{maxHeight:'450px',overflowY: 'scroll'}}>
                    {upcomingEventsList?.length>0 ? upcomingEventsList : (
                        <Typography variant="body1" component="h6" className="text-center"
                                    style={{color: `rgba(82, 57, 112, 1)`}}>
                            {t('No data yet')}
                        </Typography>
                    )}
                </CardContent>
                <Pagination
                    viewAllRoute={isTrainingCenter ? '' : 'schedule'}
                    originalData={upcomingEvents}
                    setShowData={setShowData}
                />
            </Card>
        </Grid>
    );
}

export default UpcomingEvents;