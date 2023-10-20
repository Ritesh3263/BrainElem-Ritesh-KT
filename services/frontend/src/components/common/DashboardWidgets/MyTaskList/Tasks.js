import React, {useState,useEffect} from 'react';
import IconButton from "@material-ui/core/IconButton";
import {BsPencil} from "react-icons/bs";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@material-ui/core/Typography";
import Grid from "@mui/material/Grid";
import {useTranslation} from "react-i18next";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import newDashboardService from "services/new_dashboard.service";
import {makeStyles} from "@material-ui/core/styles";
import {Paper} from "@material-ui/core";
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import OptionsButton from "components/common/OptionsButton";
import {useNavigate} from "react-router-dom";

const useStyles = makeStyles(theme => ({
    darkViolet: {
        color: theme.palette.primary.darkViolet
    },
}))

function Tasks(props) {
    const {
        type='',
        setTasks=(s)=>{},
        showData=[],
    } = props;
    const { t } = useTranslation();
    const navigate = useNavigate();

    const classes = useStyles();
    const {F_handleSetShowLoader,F_showToastMessage,F_getErrorMessage} = useMainContext();

    useEffect(() => {
        // fetch data
        newDashboardService.readTasks(type).then(res=>{
            if(res.status === 200 && res.data.length>0){
               setTasks(res.data)
                F_handleSetShowLoader(false);
            }
        }).catch(err=>{
            console.log(err);
            F_handleSetShowLoader(false);
            F_showToastMessage(F_getErrorMessage(err), 'error');
        });
    }, [type]);



    const tasksList = showData.length>0 ? showData.map((item,index)=>(
        <ListItem style={{backgroundColor:'rgba(255,255,255,0.6)',borderRadius:'8px'}} key={item._id} className='my-2'
                  secondaryAction={
                      <IconButton edge="end" aria-label="action" color='secondary' size="small" className={`${classes.darkViolet}`}
                                  style={{backgroundColor:'rgba(255,255,252,0.8)'}}
                                  onClick={()=>{
                                      if(type === 'EXAMS'){
                                        navigate(`examinate/${item._id}`,);
                                      } else if(type === 'HOMEWORKS'){
                                          navigate(`overview/${item.assignedContent._id}`,);
                                      }
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
                        {item?.assignedGroup?.name||'-'}
                    </Typography>
                }
                secondary={
                    <Grid container>
                        {item?.assignedSubject && (
                            <Grid item xs={12}>
                                <Typography variant="body1" component="h6" className="text-left"
                                            style={{color: `rgba(21, 163, 165, 1)`,fontWeight:'bold'}}>
                                    {item?.assignedSubject?.name||'-'}
                                </Typography>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <Typography variant="body1" component="h6" className="text-left"
                                        style={{color: `rgba(168, 92, 255, 1)`,fontWeight:'bold'}}>
                                {item?.name||'-'}
                            </Typography>
                        </Grid>
                        {item?.assignedContent && <Grid item xs={12}>
                            <Typography variant="body2" component="h6" className="text-left"
                                        style={{color: `rgba(68, 192, 255, 1)`}}>
                                {item?.assignedContent?.title||'-'}
                            </Typography>
                        </Grid>}
                        <Grid item xs={12}>
                            <Typography variant="body2" component="h6" className="text-left"
                                        style={{color: `rgba(96, 103, 104, 1)`}}>
                                {`${t('Due date')}: ${item.date ?  (new Date(item.date).toLocaleDateString()) : '-'}`}
                            </Typography>
                        </Grid>
                    </Grid>
                }
            />
        </ListItem>
    )): [];

    return (
        <List dense={true} disablePadding={false} className="d-flex flex-column flex-grow-1">
            {tasksList?.length>0 ? tasksList : <span>{t('No data yet')}</span>}
        </List>
    );
}

export default Tasks;