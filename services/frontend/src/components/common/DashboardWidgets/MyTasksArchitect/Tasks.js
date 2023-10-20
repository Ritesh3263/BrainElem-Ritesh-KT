import React, {useState,useEffect} from 'react';
import List from "@mui/material/List";
import {useTranslation} from "react-i18next";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@material-ui/core/Typography";
import Grid from "@mui/material/Grid";
import {makeStyles} from "@material-ui/core/styles";
import {BsPencil} from "react-icons/bs";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import newDashboardService from "services/new_dashboard.service";

const useStyles = makeStyles(theme => ({
    darkViolet: {
        color: theme.palette.primary.darkViolet
    },
}));

function Tasks(props) {
    const {
        type='NEW',
        currentTasks=[],
        setCurrentTasks=(s)=>{},
    } = props;
    const { t } = useTranslation();
    const classes = useStyles();
    const {F_handleSetShowLoader,F_showToastMessage,F_getErrorMessage} = useMainContext();

    useEffect(() => {
            newDashboardService.readArchitectTasks(type).then(res=>{
                if(res.status === 200 && res.data.length>0){
                    setCurrentTasks(res.data);
                    F_handleSetShowLoader(false);
                }
            }).catch(err=>{
                console.log(err);
                F_handleSetShowLoader(false);
                F_showToastMessage(F_getErrorMessage(err), 'error');
            });
    }, [type]);


    const lastEnquiriesList = currentTasks.length>0 ? currentTasks.map((item,index)=>(
        <ListItem style={{backgroundColor:'rgba(255,255,255,0.6)',borderRadius:'8px'}} key={item._id} className='my-2'
                  secondaryAction={
                      <IconButton edge="end" aria-label="action" color='secondary' size="small" className={`${classes.darkViolet}`}
                                  style={{backgroundColor:'rgba(255,255,252,0.8)'}}
                                  onClick={()=>{
                                      window.open(`courses/${item._id}`, '_blank');
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
                        {item?.location||'-'}
                    </Typography>
                }
                secondary={
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography variant="body1" component="h6" className="text-left"
                                        style={{color: `rgba(168, 92, 255, 1)`,fontWeight:'bold'}}>
                                {item?.course?.name||'-'}
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
        <List dense={true} disablePadding={false}>
            {lastEnquiriesList?.length>0 ? lastEnquiriesList : <span>{t('No data yet')}</span>}
        </List>
    );
}

export default Tasks;