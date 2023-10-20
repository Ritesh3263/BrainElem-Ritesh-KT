import React, { useEffect, useState } from 'react';
import {useDispatch, useSelector} from "react-redux";
import {myCourseActions} from "app/features/MyCourses/data";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import {useTranslation} from "react-i18next";
import TextField from "@material-ui/core/TextField";
import Chip from "@material-ui/core/Chip";
import LinearProgress from '@material-ui/core/LinearProgress';
import CommonImageUpload from "components/common/Image";
import CourseService from "services/course.service";
import SubjectSessionService from "services/subject_session.service";
import { makeStyles } from "@material-ui/core/styles";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";


const useStyles = makeStyles(theme => ({
    cover: {
      color: theme.palette.primary.darkViolet,
    },
  }))

const Information=()=> {
    const [image, setImage] = useState(null);
    const dispatch = useDispatch();
    const classes = useStyles();
    const {F_getHelper} = useMainContext();
    const {userPermissions:r} = F_getHelper();
    const {t} = useTranslation();
    const {item:{information},itemDetails} = useSelector(_=>_.myCourses);
    const marks = itemDetails?.assignedChapters?.flatMap(chapter=>chapter.assignedContents.map(content=>content.isDone))
    const percentage = (marks?.reduce((a,b)=>a+b,0)/(marks?.length||1)*100).toFixed(2); 

    const teachersList = information?.trainers?.length>0 ? information?.trainers.map(item=>(
        <Chip key={item._id}
              label={`${item?.name||'-'} ${item?.surname||'-'}`}
              className="mr-1 mt-1"
              size="medium" variant="outlined"
              style={{color: `rgba(82, 57, 112, 1)`, backgroundColor:'rgba(255,255,255,0.45)',borderRadius:'6px', borderColor:'rgba(82, 57, 112, 1)', maxWidth:'250px'}}
        />
    )) : [];

    useEffect(()=>{
        if (information?.image) {
            SubjectSessionService.updateImage(information.subjectSessionId, image?._id||null)
            if(information.image !== image?._id) {
                CourseService.getImageDetails(information?.image).then(response => {
                    setImage(response.data)
                })
            }
        }
    },[information.image])

    useEffect(()=>{
        dispatch(myCourseActions.dndAction({type:'CHANGE_IMAGE', payload: image?._id||null }));
    },[image])

     return (
         <Grid container>
             <Grid item xs={12}>
                 <Paper elevation={10} style={{borderRadius:'0px 0px 6px 6px'}} className='p-3'>
                     <Grid container spacing={2}>
                         <Grid item xs={12}>
                             <Typography variant="h6" component="h2" className="text-left font-weight-bold" style={{color: `rgba(82, 57, 112, 1)`}}>
                                 {t("Information about course / subject")}
                             </Typography>
                         </Grid>
                         <Grid item xs={12} className='mt-2'>
                             <TextField
                                 variant="standard"
                                 label="Name"
                                 name='name'
                                 fullWidth={true}
                                 style={{ maxWidth: "400px" }}
                                 margin="dense"
                                 InputLabelProps={{
                                     shrink: true,
                                 }}
                                 InputProps={{
                                     readOnly: true,
                                     disableUnderline: true,
                                 }}
                                 value={information?.name}
                             />
                         </Grid>
                         <Grid item xs={12}>
                             <TextField
                                 variant="standard"
                                 label="Description"
                                 name='description'
                                 fullWidth={true}
                                 style={{ maxWidth: "400px" }}
                                 margin="dense"
                                 multiline={true}
                                 maxRows={3}
                                 InputLabelProps={{
                                     shrink: true,
                                 }}
                                 InputProps={{
                                     readOnly: true,
                                     disableUnderline: true,
                                 }}
                                 value={information?.description}
                             />
                         </Grid>
                         <Grid item xs={12}>
                            <div className={classes.cover}>{t("Cover photo")}</div>
                            <Grid style={{ height: 'min-content' }} item xs={12} >
                                <Grid item xs={12} style={{
                                    height: image?'200px':'0', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', borderRadius: '8px',
                                    backgroundImage: information?.image? `url(/api/v1/courses/images/${information.image}/download)` : 'null'
                                }}>
                                </Grid>
                                {r.isTrainer && <CommonImageUpload name={t("Upload image")} disabled={false} value={image} setValue={setImage} uploadFunction={CourseService.uploadImage} getFileDetailsFunction={CourseService.getImageDetails}/>}
                            </Grid>
                        </Grid>
                         <Grid item xs={12}>
                             <TextField
                                 variant="standard"
                                 label="Level"
                                 name='level'
                                 fullWidth={true}
                                 style={{ maxWidth: "400px" }}
                                 margin="dense"
                                 multiline={true}
                                 maxRows={3}
                                 InputLabelProps={{
                                     shrink: true,
                                 }}
                                 InputProps={{
                                     readOnly: true,
                                     disableUnderline: true,
                                 }}
                                 value={information?.level}
                             />
                         </Grid>
                         <Grid item xs={12}>
                             <TextField
                                 variant="standard"
                                 label="Period"
                                 name='period'
                                 fullWidth={true}
                                 style={{ maxWidth: "400px" }}
                                 margin="dense"
                                 multiline={true}
                                 maxRows={3}
                                 InputLabelProps={{
                                     shrink: true,
                                 }}
                                 InputProps={{
                                     readOnly: true,
                                     disableUnderline: true,
                                 }}
                                 value={information?.period}
                             />
                         </Grid>
                         <Grid item xs={12} className='d-flex flex-column flex-wrap'>
                             <Typography variant="body2" component="h2" className="text-left font-weight-bold mb-2" style={{color: `rgba(82, 57, 112, 1)`}}>
                                 {t("Teachers")}:
                             </Typography>
                             {teachersList}
                         </Grid>
                         <Grid item xs={6} >
                             <Typography variant="body2" component="h2" className="text-left font-weight-bold mb-2" style={{color: `rgba(82, 57, 112, 1)`}}>
                                 {t("Progress of the course")}:
                             </Typography>
                             <Typography variant="body2" component="h2" className="text-center" style={{color: `rgba(82, 57, 112, 1)`, maxWidth:'300px'}}>
                                 {`${percentage||information?.progress}%`}
                             </Typography>
                             <LinearProgress variant="determinate"
                                             value={Math.floor((percentage*100||information?.progress * 100)/100)}
                                             style={{borderRadius: "30px", height: "20px", maxWidth:'300px'}}>

                             </LinearProgress>
                         </Grid>
                     </Grid>
                 </Paper>
             </Grid>
         </Grid>
     )
 }

export default Information;