import React, {useEffect, useState} from 'react';
import Grid from "@mui/material/Grid";
import {Card, CardContent, CardHeader} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {useTranslation} from "react-i18next";
import {makeStyles} from "@material-ui/core/styles";
import {ETab, ETabBar} from "styled_components";
import ClassesList from "./ClassesList";
import OptionsButton from "components/common/OptionsButton";
import Pagination from "../Helpers/Pagination";
import Chip from "@material-ui/core/Chip";
import ClearIcon from "@mui/icons-material/Clear";
import FilterIconButton from "../../FilterIconButton";

const useStyles = makeStyles(theme => ({
    darkViolet: {
        color: theme.palette.primary.darkViolet
    },
}))

function MyClasses(props) {
    const {} = props;
    const { t } = useTranslation();
    const classes = useStyles();
    const [currentTab,setCurrentTab]=useState(0);
    const [_classes,_setClasses] = useState([])
    const [showData, setShowData] = useState([]);
    const [filters,setFilters]=useState([]);


    useEffect(()=>{
        let _filtered =[];
        if(filters.length>0){
            if(filters.some(f => (f.groupId === 'FILTERS'))){
                _filtered = showData.filter(fd =>{
                    if(filters.some(f => (f.groupId === 'FILTERS') && (f.name === fd?.level))){
                        return fd;
                    }
                });
            }
            if(_filtered.length>=0){
                setShowData(_filtered);
            }
        }else {
            setShowData(_classes);
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
            name: 'Basic',
            isSelected: false,
        },{
            id:2,
            name: 'Intermediate',
            isSelected: false,
        },{
            id:3,
            name: 'Advanced',
            isSelected: false,
        }]
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
        <Grid item xs={12} md={4} className='d-flex flex-row flex-grow-1' sx={{maxHeight: '450px'}}>
            <Card className='d-flex flex-column flex-grow-1' >
                <CardHeader className='p-2' title={(
                    <Grid container>
                        <Grid item xs={10} className='d-flex justify-content-start align-items-center'>
                            <Typography variant="body1" component="h6" className="text-left"
                                        style={{color: `rgba(82, 57, 112, 1)`,fontSize:20, fontWeight:600}}>
                                {t('Classes')}
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
                <CardContent className='py-0 px-1' style={{overflowX:'hidden', display: "flex", flexGrow: 1}}>
                    <Grid container className='mx-1' >
                        <Grid item xs={12}  sx={{height: '30px'}}>
                            <ETabBar className="mb-1" style={{maxWidth:'230px'}}
                                     value={currentTab}
                                     onChange={(e,i)=>{
                                         setFilters([]);
                                         _setBtns(btns_initial_state);
                                         setCurrentTab(i)
                                     }}
                                     eSize='xsmall'
                            >
                                <ETab  label={t('New')} style={{minWidth:'115px'}} eSize='xsmall'/>
                                <ETab  label={t('All')} style={{minWidth:'115px'}} eSize='xsmall'/>
                            </ETabBar>
                        </Grid>
                        <Grid item xs={12} className='mt-0 mr-2' sx={{ height:'100%'}} >
                            {currentTab === 0 && (<ClassesList type='NEW' _setClasses={_setClasses} _classes={showData}/>)}
                            {currentTab === 1 && (<ClassesList type='ALL' _setClasses={_setClasses} _classes={showData}/>)}
                        </Grid>
                    </Grid>
                </CardContent>
                <Pagination
                    viewAllRoute={'architect-classes'}
                    originalData={_classes}
                    setShowData={setShowData}
                />
            </Card>
        </Grid>
    );
}

export default MyClasses;