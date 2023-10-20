import React, {useEffect, useState} from 'react';
import List from "@mui/material/List";
import {useTranslation} from "react-i18next";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import {BsPencil} from "react-icons/bs";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@material-ui/core/Typography";
import Grid from "@mui/material/Grid";
import Box from "@material-ui/core/Box";
import {Badge} from "@mui/material";
import {makeStyles} from "@material-ui/core/styles";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import newDashboardService from "services/new_dashboard.service";
import {useNavigate} from "react-router-dom";

const useStyles = makeStyles(theme => ({
    darkViolet: {
        color: theme.palette.primary.darkViolet
    },
}))

const ClassesList=(props)=> {
    const{
        type='',
        _setClasses=(s)=>{},
        _classes=[],
    }=props;
    const { t } = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();

    const {F_handleSetShowLoader,F_showToastMessage,F_getErrorMessage} = useMainContext();

    useEffect(()=>{
        newDashboardService.readClasses(type).then(res=>{
            if(res.status === 200 && res.data.length>0){
                _setClasses(res.data);
                F_handleSetShowLoader(false);
            }
        }).catch(err=>{
            console.log(err);
            F_handleSetShowLoader(false);
            F_showToastMessage(F_getErrorMessage(err), 'error');
        });
    },[]);


    const statusHelper=(status)=>{
        switch(status){
            case 'NEW':{
                return(
                    <Box>
                        <Typography variant="body1" component="h6" className="text-left"
                                    style={{color: `rgba(82, 57, 112, 1)`,fontWeight:'bold'}}>
                            <Badge color="warning" variant="dot" className='mr-3'/>
                            {t('New class')||'-'}
                        </Typography>
                    </Box>
                );
            }
            default:{
                return (
                    <Box>
                        <Typography variant="body1" component="h6" className="text-left"
                                    style={{color: `rgba(82, 57, 112, 1)`,fontWeight:'bold'}}>
                            <Badge color="default" variant="dot" className='mr-3'/>
                            {t('undefined')}
                        </Typography>
                    </Box>
                )
            }
        }
    }

    const classesList = _classes.length>0 ? _classes.map((item,index)=>(
        <ListItem style={{backgroundColor:'rgba(255,255,255,0.6)',borderRadius:'8px'}} key={item._id} className='my-2'
                  secondaryAction={
                      <IconButton edge="end" aria-label="action" color='secondary' size="small" className={`${classes.darkViolet}`}
                                  style={{backgroundColor:'rgba(255,255,252,0.8)'}}
                                  onClick={()=>{
                                    navigate(`architect-classes/${item._id}`);
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
                        {`${item.type||'-'} >> ${item.level||'-'} >> ${item.subType||'-'}`}
                    </Typography>
                }
                secondary={
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography variant="body1" component="h6" className="text-left"
                                        style={{color: `rgba(168, 92, 255, 1)`,fontWeight:'bold'}}>
                                {item.name||'-'}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body2" component="h6" className="text-left"
                                        style={{color: `rgba(96, 103, 104, 1)`}}>
                                {`Last update: ${item.updatedAt ?  (new Date(item.updatedAt).toLocaleDateString()) : '-'}`}
                            </Typography>
                        </Grid>
                        {item.status === 'NEW' && (
                            <Grid item xs={12}>
                                <Typography variant="body1" component="h6" className="text-left"
                                            style={{color: `rgba(82, 57, 112, 1)`}}>
                                    <Box className='d-flex'>
                                        <span>{statusHelper(item.status)}</span>
                                    </Box>
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                }
            />
        </ListItem>
    )): [];

     return (
         <List dense={true} disablePadding={false} style={{display:'flex', flexDirection: 'column', alignItems:'end'}}>
             {classesList?.length>0 ? classesList : <span>{t('No data yet')}</span>}
         </List>
     )
 }

export default ClassesList;