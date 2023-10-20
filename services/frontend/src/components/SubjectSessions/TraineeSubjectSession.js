import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

// MUI v5
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';

// Styled compnents
import {ECardWithImage, EChip} from "styled_components";

import {useMainContext} from "../_ContextProviders/MainDataContextProvider/MainDataProvider";
import SubjectSessionService from "../../services/subject_session.service";
import CoursePathService from "../../services/course_path.service"

// MUI v4
import { theme } from 'MuiTheme'


export default function TrainingMyCoursesList(){
    const [progress, setProgress] = React.useState(40);
    const {t} = useTranslation();
    const {setMyCurrentRoute} = useMainContext();
    const [sessions, setSessions]=useState([]);

    useEffect(()=>{
            SubjectSessionService.readAll().then(res=>{// argument to be a session id
                if(res.status === 200 && res.data){
                    setSessions(res.data);
                    // setGroups(res.data.groups);
                }
            }).catch(err=>console.log(err));
    },[]);

    function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '50%', mr: 1 }}>
              <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
              <Typography variant="body2" color="text.secondary">{`${Math.round(
                props.value,
              )}%`}</Typography>
            </Box>
          </Box>
        );
      }

      useEffect(()=>{
        setMyCurrentRoute("My courses");
       
    });

      const StyledECardWithImage = styled(ECardWithImage)({
          
        '&:hover': {
            zoom: "101%",
            cursor:"pointer",
        }     
    })


    const sessionsList = sessions.map(item=>(
 
        <Grid container>
            <Grid item xs={12} md={11} sx={{mt:1}}>
                <StyledECardWithImage imageWidth={158} imageHeight={124} style={{ marginBottom: '17px' }}
                    imageUrl={CoursePathService.getImageUrl(item.coursePath)} > 
                        <Grid container alignContent="space-between">
                            <Grid item xs={12} md={5} sx={{}}>
                                    <Typography sx={{ textAlign: 'left', color: theme.palette.neutrals.almostBlack, fontSize:"24px"}} variant="h3" component="h3">
                                        {item?.trainingModule?.name}
                                </Typography>
                                <EChip label={item?.group?.name}
                                        sx={{ mr:1, mt:1 }}
                                        size="small"/>
                                <EChip label={"Program"}
                                        sx={{ mr:1, mt:1 }}
                                        size="small"/>
                                <EChip label={"Semester 1"}
                                        sx={{ mr:1, mt:1 }}
                                        size="small"/>
                                <Typography variant="body2" component="p" sx={{mt:1, color: theme.palette.neutrals.almostBlack}} >
                                    {`${t("Last time active")}: ${ item?.userLastTimeActive ? new Date(item.userLastTimeActive).toLocaleDateString() : '-'}`}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={7} container sx={{ margin: 'auto' }}>
                                <Box sx={{ width: '100%' }}>
                                    <LinearProgressWithLabel value={progress} />
                                </Box>
                            </Grid>
                        </Grid>
                </StyledECardWithImage>
            </Grid>
        </Grid>
    ))

    return(
        <Grid container>
            {sessionsList}
        </Grid>
    )
}