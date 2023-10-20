import React, {lazy, useEffect, useState} from 'react';
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {useTranslation} from "react-i18next";
import InputBase from "@material-ui/core/InputBase";
import {makeStyles} from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import IconButton from "@material-ui/core/IconButton";
import { styled } from '@mui/material/styles';
import {isWidthUp} from "@material-ui/core/withWidth";
import {useDispatch, useSelector} from "react-redux";
import {myCourseActions} from "app/features/MyCourses/data";
import FilterIconButton2 from "components/common/FilterIconButton2";
import { ECard } from "styled_components";
import {theme} from "MuiTheme";
import { ReactComponent as Frame } from '../../../../icons/icons_32/Frame.svg';
import { ReactComponent as Frame2 } from '../../../../icons/icons_32/Frame2.svg';

const TableList = lazy(() => import("./List1"));
const BlockList = lazy(() => import("./List2"));

const useStyles = makeStyles((theme) => ({
    inputRoot: {
        color: 'inherit',
    },

    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        color: theme.palette.neutrals.white,
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
    search: {
        position: 'relative',
        borderRadius: '6px',
        background: theme.palette.glass.light,
        border:`1px solid ${theme.palette.neutrals.white}`,
        opacity:'0.8',
        '&:hover': {
            opacity: '1',
        },
        marginLeft: 8,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: '480px',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));


const EIconButton = styled(IconButton)`
    height:28px !important;
    width:28px !important;
    font-size:52px !important;
`

const Lists=()=> {
    const {t} = useTranslation();
    const classes = useStyles();
    const {setMyCurrentRoute} = useMainContext();
    const {
        F_getHelper,
        currentScreenSize,
    } = useMainContext();
    const {user:{role}} = F_getHelper();
    const [searchQuery, setSearchQuery]= useState(null);
    const [viewType, setViewType] = useState('LIST');
    const dispatch = useDispatch();
    const {data} = useSelector(_=>_.myCourses);
    const [filters,setFilters]=useState([]);

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
                            setFilters(p=>([...p,{...i,groupId:btns.id, type: btns.type}]));
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
                                }else{
                                    i.isSelected = false;
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
        id: 'TYPE_1',
        type: 'FILTER',
        name: 'Filters',
        action:(prop)=>{selectFilterHandler(prop)},
        items:[{
            id:1,
            name: 'In progress',
            field: 'status',
            value:'inProgress',
            isSelected: false,
        },
        {
            id:2,
            name: 'Past',
            field: 'status',
            value:'past',
            isSelected: false,
        },
        {
            id:3,
            field: 'future',
            name: 'Future',
            isSelected: false,
        },
        // {
        //     id:4,
        //     name: 'Archive',
        //     field: 'status',
        //     value:'archive',
        //     isSelected: false,
        // },
        ]
    }
    // ,{
    //     id: 'TYPE_2',
    //     type: 'SORT',
    //     name: 'Sort by',
    //     action:(prop)=>{selectFilterHandler(prop)},
    //     items: [{
    //         id:5,
    //         field: 'isFavorite',
    //         name: 'Favorite',
    //         isSelected: false,
    //     },{
    //         id:6,
    //         field: 'name',
    //         name: 'Course name',
    //         isSelected: false,
    //     },{
    //         id:7,
    //         field: 'lastActivity',
    //         name: 'Last activity',
    //         isSelected: false,
    //     }]
    // }
    ];

    const [_btns,_setBtns] = useState(btns_initial_state);

    useEffect(()=>{
        if(searchQuery !== null){
            dispatch(myCourseActions.filterAction({type:'SEARCH', query: searchQuery, data}));
        }
    },[searchQuery])

    useEffect(()=>{
        dispatch(myCourseActions.filterAction({type:'FILTERS', filters, data}));
    },[filters]);

    useEffect(()=>{
        setMyCurrentRoute("My courses");
    },[]);
    
     return (
        <>
            <Grid container xs={12} style={{margin:"auto", display:"block", width:"100%", overflowY:'auto', overflowX: "hidden"}} >
                <ECard style={{display:"block", width:"100%", overflowY:'auto', overflowX: "hidden"}} >
                <Grid item xs={12}>
                        <Grid container className='p-4'>
                            <Grid item xs={12} md={3} >
                                <Typography variant="h6" component="h2" className= {`${isWidthUp('md',currentScreenSize) ? 'text-left' : 'text-center'}`}  style={{color: theme.palette.primary.darkViolet, fontSize:'18px'}}>
                                    {t('List of the courses')}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6} className='d-flex justify-content-center align-items-center px-2'>
                                <div className={classes.search} style={{borderRadius:"32px"}}>
                                    <div className={classes.searchIcon}>
                                        <SearchIcon style={{color: theme.palette.neutrals.white}} />
                                    </div>
                                    <InputBase style={{width:"100%"}}
                                               placeholder={`${t("Search")}...`}
                                               classes={{
                                                   root: classes.inputRoot,
                                                   input: classes.inputInput,
                                               }}
                                               value={searchQuery}
                                               onChange={event=>{
                                                   setSearchQuery(event.target.value)
                                               }}
                                               inputProps={{ 'aria-label': 'search' }}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={12} md={3} className='d-flex justify-content-center align-items-center'>
                                <Grid container className={`${isWidthUp('md',currentScreenSize) ? '' : 'mt-2'}`}>
                                    <Grid item xs={6} className={`${isWidthUp('md',currentScreenSize) ? 'd-flex align-items-center justify-content-end' : 'd-flex align-items-center pl-3'}`} >
                                        <FilterIconButton2 iconButton={true} btns={_btns} selectFilterHandler={selectFilterHandler}/>
                                    </Grid>
                                    <Grid item xs={6} className={`${isWidthUp('md',currentScreenSize) ? 'justify-content-center' : 'pr-2 justify-content-end'} d-flex align-items-center`}>
                                        <ButtonGroup  color= "secondary"  style={{border:"2px solid rgba(255, 255, 255, 0.5)", borderRadius: '32px'}} > 

                                            <EIconButton   size="small" 
                                                        style={{borderRadius: '32px 0 0 32px  '}}
                                                        onClick={()=>{setViewType('LIST')}}
                                            ><Frame />
                                            </EIconButton>
                                            <EIconButton  size="small" 
                                                        style={{borderRadius: '0 32px 32px 0 '}}
                                                        onClick={()=>{setViewType('BLOCKS')}}
                                            ><Frame2/>
                                            </EIconButton>
                                        </ButtonGroup>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                </Grid>
                <Grid item xs={12} className='mt-2, p-4'>
                    {viewType === 'LIST' ? (
                        <TableList />
                    ) : (
                        <BlockList />
                    )}
                </Grid>
              </ECard>
            </Grid>
        </>
     )
 }

export default Lists;