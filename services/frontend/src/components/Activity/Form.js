import React, {useEffect} from 'react';
import Typography from "@material-ui/core/Typography";
import {theme} from "MuiTheme";
import {useTranslation} from "react-i18next";
import {Card, CardHeader, CardContent} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import {activityActions} from "../../app/features/Activity/data";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme=>({
    CardContentRoot: {
        overflow: "hidden"
    }
}));

const Form=()=> {
    const {t} = useTranslation();
    const classes = useStyles();
    const {editFormHelper, item} = useSelector(s=>s.activity);
    const dispatch = useDispatch();

    useEffect(()=>{
        if(editFormHelper.isOpen && editFormHelper.activityId){
            dispatch(activityActions.fetchActivity(editFormHelper.activityId));
        }
    },[editFormHelper.isOpen, editFormHelper.activityId]);

     return (
         <Card  className="pt-2 pl-2 d-flex flex-column m-0 ">
             <CardHeader className='pb-0' title={(
                 <Typography variant="h3" component="h5" className="text-left" style={{fontSize:"32px", color:theme.palette.primary.lightViolet}}>
                     {`${t('Activity of')}: ${item?.user?.name} ${item?.user?.surname}` }
                 </Typography>
             )}
             />
             <CardContent  classes={{ root: classes.CardContentRoot }} >
                 <Grid container spacing={1}>
                     <Grid item xs={6}>
                         <span>{t('Last time activity')}:  {item?.updatedAt && (new Date(item?.updatedAt).toLocaleString())} </span>
                     </Grid>
                     <Grid item xs={6}>
                         <span>{t('Total time')}:  {item?.details?.totalTime && (item?.details?.totalTime/60).toFixed(1)} min</span>
                     </Grid>
                     <Grid item xs={6}>
                         <span>{t('Last activity URL')}:  {item?.accessedURLs?.length>0 && (item?.accessedURLs[item?.accessedURLs.length-1]?.name)}</span>
                     </Grid>
                     <Grid item xs={6}>
                         <span>{t('Away time')}:  {item?.details?.awayTime && (item?.details?.awayTime/60).toFixed(1)} min</span>
                     </Grid>
                     <Grid item xs={6}>
                         <span>-</span>
                     </Grid>
                     <Grid item xs={6}>
                         <span>{t('In time')}:  {item?.details?.inTime && (item?.details?.inTime/60).toFixed(1)} min</span>
                     </Grid>
                 </Grid>
             </CardContent>
             <CardActionArea>
                 <CardActions className="d-flex justify-content-between align-items-center" >
                     <Grid container>
                         <Grid item xs={6}>
                             <Button  variant="contained" size="small" color="secondary" onClick={() =>  {
                                 dispatch(activityActions.editFormActions({isOpen: false, openType: 'PREVIEW', activityId: null}))
                             }}>
                                 {t("Back")}
                             </Button>
                         </Grid>
                     </Grid>
                 </CardActions>
             </CardActionArea>
         </Card>
     )
 }

export default Form;