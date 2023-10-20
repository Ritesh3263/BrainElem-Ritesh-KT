import React, {useEffect, useState} from 'react';
import {theme} from "MuiTheme";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {isWidthUp} from "@material-ui/core/withWidth";
import {Container, Grid, Paper} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import {courseManageActions} from "app/features/CourseManage/data";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import {useTranslation} from "react-i18next";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import {EButton} from "styled_components";

const useStyles = makeStyles(theme => ({}));

const TipsDrawer=(props)=> {
    const{
        setTipsDrawerHelper=(s)=>{},
        tipsDrawerHelper={isOpen: false}
    }=props;
    const classes = useStyles();
    const { t } = useTranslation();
    const { currentScreenSize} = useMainContext();
    const [selectedTrainee, setSelectedTrainee] = useState(null);
    const [currentTraineeTips, setCurrentTraineeTips] = useState([]);

    useEffect(()=>{
        //=> fetch tips
    },[selectedTrainee]);

    const trainees =[
        {
            _id: '7485t4yt745',
            name: 'Name 1',
            surname: 'Surname 1'
        },
        {
            _id: 'p8gyw75gh',
            name: 'Name 2',
            surname: 'Surname 2'
        },
        {
            _id: 'ru8g9fpyeg',
            name: 'Name 3',
            surname: 'Surname 3'
        }
    ];

    const tips =[
        {
            _id: '7485t4yt745',
            content: 'Tip 1 for student',
            description: 'Description 1 Description 1 Description 1 Description 1'
        },
        {
            _id: 'p8gyw75gh',
            content: 'Tip 2 for student',
            description: 'Description 2 Description 2 Description 2 Description 2'
        },
        {
            _id: 'ru8g9fpyeg',
            content: 'Tip 3 for student',
            description: 'Description 3 Description 3 Description 3 Description 3'
        }
    ];

    const traineesList = trainees?.length>0 ? trainees.map(c=><MenuItem key={c._id} value={c._id}>{`${c?.name||'-'} ${c?.surname||'-'}`}</MenuItem>) : [];

    const tipsList = tips?.length>0 && tips.map(tr=>(
        <Grid item xs={12} key={tr._id} className='my-2'>
            <Paper style={{display:'flex', flexGrow: 1}} className='p-2'>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant="body1" component="h2" className="text-center" style={{color: `rgba(82, 57, 112, 1)`}}>
                            {`# ${tr.content}`}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body2" component="h2" className="text-left" >
                            {`${tr.description}`}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} className='mt-2'>
                        <Typography variant="body2" component="h2" className="text-center" style={{color:'rgba(168, 92, 255, 1)'}}>
                            {t('Was it helpful')}?
                        </Typography>
                    </Grid>
                    <Grid item xs={12} style={{display:'flex', justifyContent:'space-around'}} className='mt-2'>
                        <EButton
                            eSize='small'
                            eVariant="primary"
                            onClick={()=>{
                            }}
                        >
                            {t("No")}
                        </EButton>
                        <EButton
                            eSize='small'
                            eVariant="primary"
                            onClick={()=>{
                            }}
                        >
                            {t("Sure")}
                        </EButton>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    ));

     return (
         <SwipeableDrawer
             PaperProps={{
                 style:{
                     backgroundColor: theme.palette.neutrals.white,
                 }}}
             anchor="right"
             onOpen=''
             onClose=''
             open={tipsDrawerHelper.isOpen}
         >
             <Container style={{width:isWidthUp('sm',currentScreenSize) ? "500px" : "100%"}} className='py-1 px-1'>
                 <Grid container>
                     <Grid item xs={12}>
                         <IconButton variant="contained" size="medium"
                                     style={{backgroundColor:'rgba(82, 57, 112, 1)', width: '30px', height:'30px'}}
                                     onClick={()=>{
                                         setTipsDrawerHelper({isOpen: false})
                                     }}>
                             <MenuIcon style={{fill:'rgba(255,255,255,.95)'}}/>
                         </IconButton>
                         <Grid item xs={12} style={{display:'flex', justifyContent:"center"}}>
                             <Avatar src="/img/welcome_screen/robot.png" style={{width:'70px', height:'70px', backgroundColor:'darkcyan'}}/>
                         </Grid>
                         <Grid item xs={12} style={{display:'flex', justifyContent:"center"}} className='py-3 px-3'>
                             <Typography variant="h5" component="h2" className="text-center" style={{color: `rgba(82, 57, 112, 1)`}}>
                                 {t("Connect with Your student  and help them to fullfill their potential")}
                             </Typography>
                         </Grid>
                         <Grid item xs={12} style={{display:'flex', justifyContent:"center"}} className='px-5 mt-2'>
                             <FormControl  margin="normal" variant="standard" fullWidth>
                                 <InputLabel id="demo-simple-select-label">{t("Select trainee")}</InputLabel>
                                 <Select
                                     labelId="demo-simple-select-label"
                                     id="demo-simple-select"
                                     value={selectedTrainee}
                                     onChange={({target:{value}}) => {
                                         setSelectedTrainee(value);
                                     }}
                                 >
                                     {traineesList}
                                 </Select>
                             </FormControl>
                         </Grid>
                         <Grid item xs={12} style={{display:'flex', justifyContent:"center"}} className='px-2 mt-5'>
                             <Grid container hidden={!selectedTrainee}>
                                 {tipsList}
                             </Grid>
                         </Grid>
                     </Grid>
                 </Grid>
             </Container>
         </SwipeableDrawer>
     )
 }

export default TipsDrawer;