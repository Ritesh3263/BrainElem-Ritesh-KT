import React, {useEffect, useState} from 'react';
import Grid from "@mui/material/Grid";
import {Card, CardContent, CardHeader} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {useTranslation} from "react-i18next";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from "@mui/material/IconButton";
import {makeStyles} from "@material-ui/core/styles";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import newDashboardService from "services/new_dashboard.service";
import {BsPencil} from "react-icons/bs";
import OptionsButton from "components/common/OptionsButton";
import Pagination from "../Helpers/Pagination";
import Chip from "@material-ui/core/Chip";
import ClearIcon from "@mui/icons-material/Clear";
import FilterIconButton from "../../FilterIconButton";
import {useNavigate} from "react-router-dom";


const useStyles = makeStyles(theme => ({
    darkViolet: {
        color: theme.palette.primary.darkViolet
    },
}));

const levels = ['1','2','3','4','5','6','7','8','9A','9B','10A','10B','11A','11B','12','13','14'];

function MyCurriculums(props) {
    const {
    } = props;
    const { t } = useTranslation();
    const classes = useStyles();
    const {F_handleSetShowLoader,F_showToastMessage,F_getErrorMessage} = useMainContext();
    const [curriculums, setCurriculums]=useState([]);
    const [core, setCore]=useState({});
    const [showData, setShowData] = useState([]);
    const [filters,setFilters]=useState([]);
    const navigate = useNavigate();

    useEffect(()=>{
        newDashboardService.readCurriculums('query?').then(res=>{
            if(res.status === 200 && res.data.trainingPaths?.length>0){
                setCore(res.data);
                setCurriculums(res.data.trainingPaths);
                F_handleSetShowLoader(false);
            }
        }).catch(err=>{
            console.log(err);
            F_handleSetShowLoader(false);
            F_showToastMessage(F_getErrorMessage(err), 'error');
        });
    },[]);


    useEffect(()=>{
        let _filtered =[];
        if(filters.length>0){
            if(filters.some(f => (f.groupId === 'FILTERS'))){
                _filtered = curriculums.filter(fd =>{
                    if(filters.some(f => (f.groupId === 'FILTERS') && (f.id === fd?.level))){
                        return fd;
                    }
                });
            }
            if(_filtered.length>=0){
                setShowData(_filtered);
            }
        }else {
            setShowData(curriculums);
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

    const getItems=()=>{
        return  levels.map(l=>{
            return(
                {
                    id:l,
                    name: `Level ${l}`,
                    isSelected: false,
                }
            )
        });
    }

    const btns_initial_state=[{
        id: 'FILTERS',
        type: 'FILTERS',
        name: 'Filter',
        action:(prop)=>{selectFilterHandler(prop)},
        items: getItems(),
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


    const curriculumsList = showData.length>0 ? showData.map((item,index)=>(
        <ListItem style={{backgroundColor:'rgba(255,255,255,0.6)',borderRadius:'8px'}} key={item._id} className='my-2'
                  secondaryAction={
                      <IconButton edge="end" aria-label="action" color='secondary' size="small" className={`${classes.darkViolet}`}
                                  style={{backgroundColor:'rgba(255,255,252,0.8)'}}
                                  onClick={()=>{
                                    navigate(`/modules-core/curriculae/${item._id}`)
                                  }}
                      >
                          <BsPencil style={{color: `rgba(82, 57, 112, 1)`}}/>
                      </IconButton>
                  }
        >
            <ListItemText
                primary={
                    <Typography variant="body2" component="h6" className="text-left"
                                style={{color: `rgba(96, 103, 104, 1)`}}>
                        {`${item.isPublic?'Public':'Private'||'-'} >> ${item.type||'-'} >> Level: ${item.level||'-'}`}
                    </Typography>
                }
                secondary={
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography variant="body1" component="h6" className="text-left"
                                        style={{color: `rgba(168, 92, 255, 1)`,fontWeight:'bold'}}>
                                {/* {`${core?.groups?.map(g=>" "+g.name)||'-'}`} Why displaying all gropus in CORE? */}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1" component="h6" className="text-left"
                                        style={{color: `rgba(82, 57, 112, 1)`}}>
                                {`${item.name||'-'}`}
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
        <Grid item xs={12} md={4} className='d-flex flex-row flex-grow-1' sx={{maxHeight:'450px'}}>
            <Card className='d-flex flex-column flex-grow-1'>
                <CardHeader className='p-2' title={(
                    <Grid container >
                        <Grid item xs={10} className='d-flex justify-content-start align-items-center'>
                            <Typography variant="body1" component="h6" className="text-left"
                                        style={{color: `rgba(82, 57, 112, 1)`,fontSize:20, fontWeight:600}}>
                                {t('Curriculums')}
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
                <CardContent className='py-0 px-3' style={{display:'flex', flexGrow: 1}}>
                    <Grid container className='pt-1'>
                        <Grid item xs={12}>
                            <List dense={true} disablePadding={false}>
                                {curriculumsList?.length>0 ? curriculumsList : <span>{t('No data yet')}</span>}
                            </List>
                        </Grid>
                    </Grid>
                </CardContent>
                <Pagination
                    viewAllRoute={'modules-core/curriculae'}
                    originalData={curriculums}
                    setShowData={setShowData}
                />
            </Card>
        </Grid>
    );
}

export default MyCurriculums;