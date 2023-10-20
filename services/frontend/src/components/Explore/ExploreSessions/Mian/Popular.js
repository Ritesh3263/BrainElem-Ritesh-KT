import React, {useEffect, useState} from "react";
import {Paper} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {ETab, ETabBar} from "../../../../styled_components";
import {useTranslation} from "react-i18next";
import List from "@mui/material/List";
import {ListItem, ListItemIcon, ListItemText} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import Chip from "@material-ui/core/Chip";
import {useMainContext} from "../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import Typography from "@material-ui/core/Typography";


export default function Popular({_popularTeachers=[], _trending=[]}){
    const {t} = useTranslation();
    const [currentTab, setCurrentTab] = useState(0)
    const [popularTeachers, setPopularTeachers] = useState([]);
    const [trending, setTrending] = useState([]);

    useEffect(()=>{
        if(_popularTeachers.length>0){
            setPopularTeachers(_popularTeachers.slice(0,6));
        }
        if(_trending.length>0){
            setTrending(_trending.slice(0,6));
        }
    },[_trending, _popularTeachers]);


    const popularTeachersList = popularTeachers?.length>0 ? popularTeachers.map((i,index)=>(
        <Grid item xs={6} key={index} style={{overflowX:'hidden'}}>
            <ListItem disablePadding>
                <ListItemIcon style={{minWidth:'5px', marginRight: '5px'}}>
                    <Chip label={index+1}
                          size="small" 
                          style={{color: `rgba(48, 56, 56, 1)`, backgroundColor:'rgba(255,255,255,0.9)', padding:'1px'}}
                    />
                </ListItemIcon>
                <ListItemText
                    style={{   
                        color: "rgba(82, 57, 112, 1)",
                        overflowX: "hidden",
                        whiteSpace: 'nowrap',
                        textOverflow:'ellipsis'
                    }}
                    primary={
                        <Typography variant="body2" component="span" className="text-left">{`${i?.name} ${i?.surname}`}</Typography>
                    }
                />
            </ListItem>
        </Grid>
    )):<p>{t("List is empty")}</p>;

    const trendingList = trending?.length>0 ? trending.map((i,index)=>(
        <Grid item xs={6} key={index} style={{overflowX:'hidden'}}>
            <ListItem disablePadding>
                    <ListItemIcon style={{minWidth:'5px', marginRight: '5px'}}>
                        <Chip label={index+1}
                              size="small"
                              style={{color: `rgba(48, 56, 56, 1)`, backgroundColor:'rgba(255,255,255,0.9)', padding:'1px'}}
                        />
                    </ListItemIcon>
                    <ListItemText
                        style={{
                            color: "rgba(82, 57, 112, 1)",
                            overflowX: "hidden",
                            whiteSpace: 'nowrap',
                            textOverflow:'ellipsis'
                        }}
                        primary={
                        <Typography variant="body2" component="span" className="text-left">{i?.name}</Typography>
                    }
                    />
            </ListItem>
        </Grid>
    )):<p>{t("List is empty")}</p>;

    return(
        <></>
        // <Paper elevation={10}  className="flex-row ml-3 mr-3" style={{height:'100%',borderRadius: '8px', backdropFilter: 'blur(20px)'}}>
        //     <Grid container>
        //         <Grid item xs={12} style={{overflow: 'hidden'}} className='d-flex pt-4 pb-3 pl-3'>
        //             <ETabBar
        //                 style={{minWidth:'250px'}} 
        //                 value={currentTab}
        //                 eSize='small'
        //                 onChange={(e,i)=>{setCurrentTab(i)}}
        //             >
        //                 <ETab label={t("Trending")} style={{minWidth:'100px'}}  eSize='small'/>
        //                 <ETab label={t("Popular teachers")} style={{minWidth:'150px'}}  eSize='small'/>
        //             </ETabBar>
        //         </Grid>
        //         <Grid item xs={12}>
        //             {currentTab===0&&(
        //                 <List dense={true} className='p-0'>
        //                     <Grid container>
        //                         {trendingList}
        //                     </Grid>
        //                 </List>
        //             )}
        //             {currentTab===1&&(
        //                 <List dense={true} className='p-0'>
        //                     <Grid container>
        //                         {popularTeachersList}
        //                     </Grid>
        //                 </List>
        //             )}
        //         </Grid>
        //     </Grid>
        // </Paper>
    )
}