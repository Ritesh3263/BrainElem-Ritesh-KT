import React, {lazy, useEffect, useMemo, useState} from 'react';
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import {useTranslation} from "react-i18next";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import {useDispatch, useSelector} from "react-redux";
import {courseManageActions} from "app/features/CourseManage/data";
import {useLocation} from "react-router-dom";
import {theme} from "../../../../MuiTheme";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@material-ui/core/Typography";
import {EButton} from "../../../../styled_components";
import {makeStyles} from "@material-ui/core/styles";

const SidebarDrawer = lazy(()=>import("./SidebarDrawer"));
const ContentPreview = lazy(()=>import("./ContentPreview"));

function useQuery() {
    const { search } = useLocation();

    return useMemo(() => new URLSearchParams(search), [search]);
}

const useStyles = makeStyles((theme) => ({
    title: {
        fontSize: 24,
        fontWeight: "400",
        fontFamily:"Nunito",
        color: theme.palette.primary.darkViolet,
    },
}));

const Preview=(props)=> {
    const{}=props;
    const { t } = useTranslation();
    const classes = useStyles();
    let query = useQuery();
    const {F_handleSidebarChange,sidebarState:{collapsed},F_handleSetShowLoader, F_getHelper} = useMainContext();
    const {userPermissions} = F_getHelper();
    const {openItemHelper,sidebarHelper, data, progress} = useSelector(_=>_.courseManage);
    const dispatch = useDispatch();

    useEffect(()=>{
        if(query.get("chId")){
            F_handleSidebarChange("COLLAPSE");
            dispatch(courseManageActions.fromOutsideOpen({
                isOpenChapter: true,
                chapterIndex: Number(query.get("chInd")),
                chapterId: query.get("chId"),
                contentIndex: Number(query.get("cInd")),
                contentId: query.get("cId"),
            }));
        }
    },[]);

    return (
        <Box className='d-flex flex-grow-1' >
            {/* {!sidebarHelper.isOpen ? (
                <Box className="mr-2" >
                    <IconButton variant="contained" size="medium"
                                style={{backgroundColor:'rgba(82, 57, 112, 1)'}}
                                onClick={()=>{
                                    if(!collapsed){
                                        F_handleSidebarChange("COLLAPSE");
                                    }
                                    dispatch(courseManageActions.sidebarHelper({isOpen: true}));
                                }}>
                        <MenuIcon style={{fill:'rgba(255,255,255,.95)'}}/>
                    </IconButton>
                </Box>
            ) : (
                <Paper elevation={11}  style={{width:'500px', display:'flex', flexDirection: 'column', justifyContent:"space-between"}} className="mr-2">
                    <Grid container>
                        <Grid item xs={6} className='pl-2 pt-2'>
                            <EButton eSize='xsmall' eVariant='secondary'
                                     style={{maxWidth: '150px'}}
                                     disabled={(progress < 90) || data[0]?.courseIdDone}
                                     onClick={()=>{
                                         if(data.length>0){
                                             dispatch(courseManageActions.endCourse(data[0].trainingModule))
                                         }
                                     }}
                            >{t('End course')}</EButton>
                        </Grid>
                        <Grid item xs={6} className="d-flex justify-content-end pr-2 pt-2" style={{height:'40px'}}>
                            <IconButton variant="contained" size="small"
                                        style={{backgroundColor:'rgba(82, 57, 112, 1)'}}
                                        onClick={()=>{
                                            dispatch(courseManageActions.sidebarHelper({isOpen: false}));
                                        }}
                            >
                                <MenuIcon style={{fill:'rgba(255,255,255,.95)'}} className='p-1'/>
                            </IconButton>
                        </Grid>
                        <Grid item xs={12} >
                            <SidebarDrawer/>
                        </Grid>
                    </Grid>
                    <Grid container >
                        <Grid item xs={12} style={{padding: '10px'}}>
                            <Box style={{display:'flex', flexDirection: 'column', justifyContent:'center', alignItems: "center"}}>
                                <Box minWidth={35} style={{display:'flex', justifyContent:'center'}}>
                                    <Typography variant="body2" style={{color: `rgba(82, 57, 112, 1)`,fontSize:12}}>
                                        {`${progress} %`}
                                    </Typography>
                                </Box>
                                <Box width="100%" >
                                    <LinearProgress
                                        sx={{
                                            background: theme.palette.secondary.violetSelect,
                                            '& .MuiLinearProgress-bar1Determinate': {
                                                background: theme.palette.gradients.green
                                            }, width: '100%', marginTop: "auto", marginBottom: "auto", borderRadius: "40px", height: "10px"
                                        }}
                                        variant="determinate"  value={progress}/>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            )} */}
            <Box className="d-flex flex-grow-1" style={{width: '100%'}}>
                <ContentPreview/>
            </Box>

        </Box>
    )
}

export default Preview;