import React, {useEffect, useState} from 'react';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import {EButton} from "styled_components";
import Avatar from "@material-ui/core/Avatar";
import {DialogActions, DialogContent} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@mui/material/Grid";
import CloseIcon from '@mui/icons-material/Close';
import Typography from "@material-ui/core/Typography";
import {useTranslation} from "react-i18next";
import {Zoom} from "@mui/material";


const Modal=(props)=> {
    const{
        isOpenBoarding=false,
        item = null,
        boardingActions=({})=>{},
    }=props;
    const { t } = useTranslation();

     return (
         <Dialog open={isOpenBoarding}
                 maxWidth={'sm'}
                 fullWidth={true}
                 TransitionComponent={Zoom}
                 transitionDuration={{enter: 1000, exit: 1000, appear: 1000,}}
                 PaperProps={{
                     style:{
                         backgroundColor:'rgba(255,255,255,0)',
                         boxShadow:'none',
                         borderRadius: '8px'
                         //position: 'absolute',
                         //top: "232px",
                         //left: `${tooltip2.current.offsetLeft}px`
                     }
                 }}
         >
             <DialogTitle style={{display:'flex', justifyContent:'center', padding:0}}>
                 <Avatar
                     style={{top:"40px", backgroundColor:'darkcyan', width:'90px', height:'90px'}}
                     src="/img/welcome_screen/robot.png"
                 />
             </DialogTitle>
             <DialogTitle style={{backgroundColor:'rgba(255,255,255,0.8)',padding:'0px', borderTopLeftRadius:'8px', borderTopRightRadius:'8px'}}>
                <Grid container>
                    <Grid item xs={11} style={{paddingTop:'20px', paddingLeft:'10px', paddingRight: '10px', paddingBottom: '5px'}}>
                        <Typography variant="h6"
                                    component="h6" className="text-left"
                                    style={{color: `rgba(82, 57, 112, 1)`, fontWeight:'bold', paddingLeft:'10px'}}>
                            {item?.title}
                        </Typography>
                    </Grid>
                    <Grid item xs={1} style={{display:'flex', justifyContent: 'end',padding:'6px'}}>
                        <IconButton size="small" color="primary"
                                    onClick={()=>{boardingActions({type:'CLOSE',payload:{}})}}>
                            <CloseIcon/>
                        </IconButton>
                    </Grid>
                </Grid>
             </DialogTitle>
             <DialogContent style={{backgroundColor:'rgba(255,255,255,0.8)', overflowY:'scroll'}}>
                 {item?.children}
             </DialogContent>
             <DialogActions style={{backgroundColor:'rgba(255,255,255,0.8)', display:'flex', flexWrap:'wrap', justifyContent:'space-around'}}>
                 {item?.intro && (
                     <>
                         <EButton
                             sx={{my:1}}
                             eSize='small'
                             eVariant="primary"
                             onClick={()=>{
                                 boardingActions({type:'NEXT',payload:{}})
                             }}
                         >
                             {t("Yes, show me")}
                         </EButton>
                         <EButton
                             sx={{my:1}}
                             eSize='small'
                             eVariant="secondary"
                             onClick={()=>{
                                 boardingActions({type:'POSTPONE',payload:{}})
                             }}
                         >
                             {t("Not right now")}
                         </EButton>
                     </>
                 )}
                 {
                     item?.end && (
                         <>
                             <EButton
                                 sx={{my:1}}
                                 eSize='small'
                                 eVariant="secondary"
                                 onClick={()=>{
                                     boardingActions({type:'PREV',payload:{}})
                                 }}
                             >
                                 {t("Previous")}
                             </EButton>
                             <EButton
                                 sx={{my:1}}
                                 eSize='small'
                                 eVariant="primary"
                                 onClick={()=>{
                                     boardingActions({type:'END',payload:{}})
                                 }}
                             >
                                 {t("End Tour")}
                             </EButton>
                         </>
                     )
                 }
             </DialogActions>

         </Dialog>
     )
 }

export default Modal;