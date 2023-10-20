import React, {useEffect, useState} from 'react';
import Grid from "@mui/material/Grid";
import {useTranslation} from "react-i18next";
import {Card, CardHeader, CardContent} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import OptionsButton from "components/common/OptionsButton";
import {ETab, ETabBar} from "styled_components";
import Tasks from "./Tasks";
import {theme} from "MuiTheme";
import Pagination from "../Helpers/Pagination";
import Chip from "@material-ui/core/Chip";
import ClearIcon from "@mui/icons-material/Clear";
import FilterIconButton from "../../FilterIconButton";
import EventService from "../../../../services/event.service";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

function MyTaskList(props) {
    const {
        role='TRAINEE',
    } = props;
    const { t } = useTranslation();
    const [currentTab,setCurrentTab]=useState(0);
    const [query, setQuery] = useState({filter:undefined, sort:undefined, itemsLength:3});


    const [tasks, setTasks] = useState([]);
    const [showData, setShowData] = useState([]);
    const [filters,setFilters]=useState([]);

    const { F_getHelper } = useMainContext();
    const isTrainingCenter = F_getHelper().manageScopeIds.isTrainingCenter;

    useEffect(()=>{
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
    })

    useEffect(()=>{
        let _filtered =[];
        if(filters.length>0){
            if(filters.some(f => (f.groupId === 'FILTERS'))){
                _filtered = tasks.filter(fd =>{
                    if(filters.some(f => (f.groupId === 'FILTERS') && (f.name === fd?.eventType))){
                        return fd;
                    }
                });
            }else if(filters.some(f => (f.groupId === 'GROUPS'))){
                _filtered = tasks.filter(fd =>{
                    console.log("gg",fd)
                    if(filters.some(f => f.id === fd.assignedGroup?._id)){
                        return fd;
                    }
                })
            }
            if(_filtered.length>=0){
                setShowData(_filtered);
            }
        }else {
            setShowData(tasks);
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

    return (
        <Grid item xs={12} md={4} className='d-flex flex-row flex-grow-1' sx={{maxHeight:'450px'}}>
                <Card style={{background: theme.palette.glass.opaque, borderRadius:'8px'}} className='d-flex flex-column flex-grow-1'>
                    <CardHeader className='p-2' title={(
                        <Grid container>
                            <Grid item xs={10} className='d-flex justify-content-start align-items-center'>
                                <Typography variant="body1" component="h6" className="text-left"
                                            style={{color: `rgba(82, 57, 112, 1)`,fontSize:20, fontWeight:600}}>
                                    {t('My tasks list')}
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
                    <CardContent className='py-0 px-1' style={{overflowX:'hidden', display: 'flex', flexGrow: 1}}>
                        <Grid container className='mx-1'>
                            <Grid item xs={12} >
                                <ETabBar className="mb-1" style={{maxWidth:'230px'}}
                                         value={currentTab}
                                         onChange={(e,i)=>setCurrentTab(i)}
                                         eSize='xsmall'
                                >
                                    <ETab  label={role==='TRAINER' ? t('Exams') : t('Homework')} style={{minWidth:'115px'}} eSize='xsmall'/>
                                    <ETab  label={t('Cognitive tasks')} style={{minWidth:'115px'}} disabled  eSize='xsmall' />
                                </ETabBar>
                            </Grid>
                            <Grid item xs={12} className='mt-2 mr-2 d-flex flex-wrap' sx={{height: '100%'}}>
                                {currentTab === 0 && (<Tasks setTasks={setTasks} showData={showData} type={role === 'TRAINEE' ? 'HOMEWORKS' : 'EXAMS'} />)}
                                {currentTab === 1 && (<Tasks setTasks={setTasks} showData={showData} type='COGNITIVE' query={query}/>)}
                            </Grid>
                        </Grid>
                    </CardContent>
                    <Pagination
                        viewAllRoute={isTrainingCenter ? '' : 'schedule'}
                        originalData={tasks}
                        setShowData={setShowData}
                    />
                </Card>
        </Grid>
    );
}

export default MyTaskList;