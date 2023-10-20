import React, {useEffect, useState} from 'react';
import Dialog from "@material-ui/core/Dialog";
import {Button, DialogActions, DialogTitle, DialogContent} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {useTranslation} from "react-i18next";
import {EButton} from "styled_components";
import {Badge} from "@mui/material";
import Box from '@material-ui/core/Box';
import newDashboardService from "services/new_dashboard.service";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import { theme } from "MuiTheme"

const _mock_c_details={
    _id: '0f78rf7r',
    libraryStatus: 'AWAITING',
    type: 'Lesson',
    size: '2gb',
    location:'public library/subject name/.../...',
    sessionName: 'Subject 1',
    title: 'Id venenatis donec dictumst sollicitudin auctor aliquam vitae non.',
    librarianFeedback:'Eu cursus et lacinia egestas quis sed. Mi massa ac in tristique. Amet porta sed pretium, neque consectetur nullam diam. Risus ut eget erat vulputate amet sem lacus, tempus molestie. Pellentesque consequat volutpat morbi nunc eu. At mollis vitae in sed. Sit elit, ultricies porttitor nunc laoreet etiam nisl mattis. Vel feugiat fermentum sed ut mauris. Auctor vitae, eu gravida dolor in egestas. Laoreet eget imperdiet tincidunt pretium, est sed. Nisi, viverra fermentum aenean vulputate lacus a, mauris.',
}

function PreviewContentStatus(props) {
    const {
        dialogHelper={isOpen:false, contentId:undefined},
        setDialogHelper=({})=>{},
    } = props;
    const {t} = useTranslation();
    const {F_handleSetShowLoader,F_showToastMessage,F_getErrorMessage} = useMainContext();
    const [contentDetails,setContentDetails]=useState(_mock_c_details);

    useEffect(()=>{
        if(dialogHelper.isOpen && dialogHelper.contentId){
            newDashboardService.loadContentDetails(dialogHelper.contentId).then(res=>{
                if(res.status === 200 && res.data){
                    setContentDetails(res.data)
                    F_handleSetShowLoader(false);
                }
            }).catch(err=>{
                console.log(err);
                F_handleSetShowLoader(false);
                F_showToastMessage(F_getErrorMessage(err), 'error');
            });
        }
    },[dialogHelper]);

    const statusHelper=(status)=>{
        switch(status){
            case 'ACCEPTED':{
                return(
                    <Box>
                        <Typography variant="body1" component="h6" className="text-left"
                                    style={{color: `rgba(82, 57, 112, 1)`,fontWeight:'bold'}}>
                            <Badge color="success" variant="dot" className='mr-3'/>
                            {status.toLowerCase()||'-'}
                        </Typography>
                    </Box>
                );
            }
            case 'REJECTED':{
                return (
                    <Box>
                        <Typography variant="body1" component="h6" className="text-left"
                                    style={{color: `rgba(82, 57, 112, 1)`,fontWeight:'bold'}}>
                            <Badge color="error" variant="dot" className='mr-3'/>
                            {status.toLowerCase()||'-'}
                        </Typography>
                    </Box>
                )
            }
            case 'AWAITING':{
                return(
                    <Box>
                        <Typography variant="body1" component="h6" className="text-left"
                                    style={{color: `rgba(82, 57, 112, 1)`,fontWeight:'bold'}}>
                            <Badge color="info" variant="dot" className='mr-3'/>
                            {status.toLowerCase()||'-'}
                        </Typography>
                    </Box>
                )
            }
            default:{
                return (
                    <Box>
                        <Typography variant="body1" component="h6" className="text-left"
                                    style={{color: `rgba(82, 57, 112, 1)`,fontWeight:'bold'}}>
                            <Badge color="warning" variant="dot" className='mr-3'/>
                            {t('undefined')}
                        </Typography>
                    </Box>
                )
            }
        }
    }

    return (
        <Dialog
            PaperProps={{
                style:{borderRadius: "16px", background: theme.palette.glass.opaque, backdropFilter: "blur(20px)"}
            }} 
            open={dialogHelper.isOpen}
            onClose={() => {setDialogHelper({isOpen:false,contentId:undefined})}}
            maxWidth={'md'}
            fullWidth={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title" className="text-center">
                <Typography variant="h5" component="h3" className="text-left text-justify mt-2" style={{fontSize:"24px"}}>
                    {t("Detailed information")}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>

                    <Grid item xs={12} style={{ borderRadius:'8px'}} className='my-2'>
                        <Grid container>
                            <Grid item xs={4}>
                                <Typography variant="body1" component="h6" className="text-left"
                                            style={{color: `rgba(73, 81, 81, 1)`,fontWeight:'bold'}}>
                                    {t('Library status')}:
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                {statusHelper(contentDetails?.libraryStatus)}
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} style={{ borderRadius:'8px'}} className='my-2'>
                        <Grid container>
                            <Grid item xs={4}>
                                    <Typography variant="body1" component="h6" className="text-left"
                                                style={{color: `rgba(73, 81, 81, 1)`,fontWeight:'bold'}}>
                                        {t('Type')}:
                                    </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography variant="body1" component="h6" className="text-left"
                                            style={{color: `rgba(82, 57, 112, 1)`,fontWeight:'bold'}}>
                                    {contentDetails?.contentType||'-'}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} style={{borderRadius:'8px'}} className='my-2'>
                        <Grid container>
                            <Grid item xs={4}>
                                    <Typography variant="body1" component="h6" className="text-left"
                                                style={{color: `rgba(73, 81, 81, 1)`,fontWeight:'bold'}}>
                                        {t('Size')}:
                                    </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography variant="body1" component="h6" className="text-left"
                                            style={{color: `rgba(82, 57, 112, 1)`,fontWeight:'bold'}}>
                                    {contentDetails?.size||'-'}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} style={{borderRadius:'8px'}} className='my-2'>
                        <Grid container>
                            <Grid item xs={4}>
                                    <Typography variant="body1" component="h6" className="text-left"
                                                style={{color: `rgba(73, 81, 81, 1)`,fontWeight:'bold'}}>
                                        {t('Location')}:
                                    </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography variant="body1" component="h6" className="text-left"
                                            style={{color: `rgba(82, 57, 112, 1)`,fontWeight:'bold'}}>
                                    {contentDetails?.location||'-'}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} style={{borderRadius:'8px'}} className='my-2'>
                        <Grid container>
                            <Grid item xs={4}>
                                    <Typography variant="body1" component="h6" className="text-left"
                                                style={{color: `rgba(73, 81, 81, 1)`,fontWeight:'bold'}}>
                                        {t('Subject name')}:
                                    </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography variant="body1" component="h6" className="text-left"
                                            style={{color: `rgba(82, 57, 112, 1)`,fontWeight:'bold'}}>
                                    {(contentDetails?.subjectName|| contentDetails?.sessionName)||'-'}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} style={{borderRadius:'8px'}} className='my-2'>
                        <Grid container>
                            <Grid item xs={4}>
                                    <Typography variant="body1" component="h6" className="text-left"
                                                style={{color: `rgba(73, 81, 81, 1)`,fontWeight:'bold'}}>
                                        {t('Content\'s title')}:
                                    </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography variant="body1" component="h6" className="text-left"
                                            style={{color: `rgba(82, 57, 112, 1)`,fontWeight:'bold'}}>
                                    {contentDetails?.title||'-'}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} style={{borderRadius:'8px'}} className='my-2'>
                        <Grid container>
                            <Grid item xs={4}>
                                <Typography variant="body1" component="h6" className="text-left"
                                            style={{color: `rgba(73, 81, 81, 1)`,fontWeight:'bold'}}>
                                    {t('Feedback from Librarian')}:
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography variant="body1" component="h6" className="text-left"
                                            style={{color: `rgba(82, 57, 112, 1)`,fontWeight:'bold'}}>
                                    {contentDetails?.librarianFeedback||contentDetails?.description||'-'}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>
            </DialogContent>

            <DialogActions className="d-flex justify-content-end mr-3 mb-2" >
                <EButton eVariant="secondary" eSize="small"
                         onClick={()=>{setDialogHelper({isOpen: false, contentId:undefined})}}>
                    {t("Close")}
                </EButton>
            </DialogActions>
        </Dialog>
    );
}

export default PreviewContentStatus;