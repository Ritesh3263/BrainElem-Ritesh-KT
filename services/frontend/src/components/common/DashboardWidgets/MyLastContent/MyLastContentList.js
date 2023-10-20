import React, {lazy, useEffect, useState} from 'react';
import Grid from "@mui/material/Grid";
import Typography from "@material-ui/core/Typography";
import {useTranslation} from "react-i18next";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import newDashboardService from "services/new_dashboard.service";
import {makeStyles} from "@material-ui/core/styles";
import OptionsButton from "components/common/OptionsButton";

const PreviewConteStatus = lazy(() => import("./PreviewContentStatus"));

const useStyles = makeStyles(theme => ({
    darkViolet: {
        color: theme.palette.primary.darkViolet
    },
}))

function MyLastContentList(props) {
    const {
        type='PRIVATE',
        setContentItems=(s)=>{},
        contentItems=[],
    } = props;
    const { t } = useTranslation();
    const classes = useStyles();
    const {F_handleSetShowLoader,F_showToastMessage,F_getErrorMessage, F_getHelper} = useMainContext();
    const {user} = F_getHelper();
    const [dialogHelper, setDialogHelper]=useState({isOpen:false,contentId:undefined})

    useEffect(()=>{
        newDashboardService.myLatestContent().then(res=>{
            if(res.status === 200 && res.data.length>0){
                setContentItems(res.data)
                F_handleSetShowLoader(false);
            }
        }).catch(err=>{
            console.log(err);
            F_handleSetShowLoader(false);
            F_showToastMessage(F_getErrorMessage(err), 'error');
        });
    },[]);

    const buttons= [
        {id: 2, name: t("Display"), type:'DISPLAY', action: (v)=>{actionHandler(v)}},
        {id: 3, name: t("Detailed info"), type:'DETAIL', action: (v)=>{actionHandler(v)}},
    ];

    const actionHandler=({currentItemId=undefined,type=undefined})=>{
        if(currentItemId && type){
            switch (type){
                case 'DISPLAY':{// I removed SHARE and EDIT actions as they were not properly implemented/
                    window.open(`/content/display/${currentItemId}`, '_blank');
                    break;
                }
                case 'DETAIL':{
                    setDialogHelper({isOpen: true,contentId: currentItemId});
                    break;
                }
                default: break;
            }
        }
    }


    const lastActivityList = contentItems.length>0 ? contentItems
        .filter(item=>{
            if (type==='PRIVATE') {
                return item.libraryStatus !== 'ACCEPTED' && item.cloudStatus !== 'ACCEPTED'
            } else if (type==='PUBLIC') {
                return item.libraryStatus === 'ACCEPTED' || item.cloudStatus === 'ACCEPTED'
            } else if (type==='CO_CREATED') {
                return item.cocreators.includes(user.id)
            } else return true;
        })
        .map(item=>(
        <ListItem style={{backgroundColor:'rgba(255,255,255,0.6)',borderRadius:'8px'}} key={item._id} className='my-2'
                  secondaryAction={
                      <OptionsButton iconButton={true} btns={buttons} currentItemId={item._id}/>
                  }
        >
            <ListItemText
                primary={
                    <Typography variant="body2" component="h6" className="text-left"
                                style={{color: `rgba(96, 103, 104, 1)`}}>
                        {`${type.toLowerCase()} ${t('library')}`}
                    </Typography>
                }
                secondary={
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography variant="body1" component="h6" className="text-left"
                                        style={{color: `rgba(168, 92, 255, 1)`,fontWeight:'bold'}}>
                                {item?.contentType||'-'}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1" component="h6" className="text-left"
                                        style={{color: `rgba(82, 57, 112, 1)`}}>
                                {item.title||'-'}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body2" component="h6" className="text-left"
                                        style={{color: `rgba(96, 103, 104, 1)`}}>
                                {`Added: ${new Date (item.createdAt).toLocaleDateString()}`}
                            </Typography>
                        </Grid>
                        {new Date (item.createdAt).toLocaleDateString() !== new Date (item.updatedAt).toLocaleDateString() && 
                        <Grid item xs={12}>
                            <Typography variant="body2" component="h6" className="text-left"
                                        style={{color: `rgba(96, 103, 104, 1)`}}>
                                {`Edited: ${new Date (item.updatedAt).toLocaleDateString()}`}
                            </Typography>
                        </Grid>}
                    </Grid>
                }
            />
        </ListItem>
    )): [];
    return (
        <>
             <List dense={true} disablePadding={false} className='d-flex flex-column flex-grow-1'>
                 {lastActivityList?.length>0 ? lastActivityList : <span>{t('No data yet')}</span>}
             </List>
            <PreviewConteStatus dialogHelper={dialogHelper} setDialogHelper={setDialogHelper}/>
        </>
    );
}

export default MyLastContentList;