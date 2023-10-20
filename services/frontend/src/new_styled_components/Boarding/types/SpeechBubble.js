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
import DialogContext from "@mui/material/Dialog/DialogContext";
import {Slide} from "@mui/material";


const SpeechBubble=(props)=> {
    const{
        isOpenBoarding=false,
        item = null,
        boardingActions=({})=>{},
    }=props;
    const { t } = useTranslation();

    return (
        <Dialog open={isOpenBoarding}
                TransitionComponent={Slide}
                TransitionProps={{direction:'up'}}
                transitionDuration={{enter: 1000, exit: 1000, appear: 1000}}
                maxWidth={'sm'}
                fullWidth={true}
                PaperProps={{
                    style:{
                        backgroundColor:'rgba(255,255,255,0)',
                        boxShadow:'none',
                        borderRadius: '8px',
                        position: 'absolute',
                        right:'0px',
                        bottom: "5px",
                    }
                }}
        >
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
            <DialogContent style={{backgroundColor:'rgba(255,255,255,0.8)'}}>
                {item?.children}
            </DialogContent>
            <DialogActions style={{backgroundColor:'rgba(255,255,255,0.8)', display:'flex', justifyContent:'space-around', borderBottomLeftRadius:'8px', borderBottomRightRadius:'8px'}}>
                <EButton
                    eSize='small'
                    eVariant="secondary"
                    onClick={()=>{
                        boardingActions({type:'PREV',payload:{}})
                    }}
                >
                    {t("Prev")}
                </EButton>
                <EButton
                    eSize='small'
                    eVariant="secondary"
                    onClick={()=>{
                        boardingActions({type:'NEXT',payload:{}})
                    }}
                >
                    {t("Next")}
                </EButton>
            </DialogActions>
            <DialogContent style={{display:'flex', justifyContent:'end', marginTop:0, paddingTop:0, paddingRight:0}}>
                <div style={{
                    position:"relative",
                    top:"-10px",
                    right:"-25px",
                    width:0,
                    height:0,
                    borderLeft: "20px solid transparent",
                    borderRight: "30px solid transparent",
                    borderTop: "20px solid rgba(255,255,255,0.8)",
                    transform: 'rotate(90deg)',
                }}/>
                <Avatar
                    style={{backgroundColor:'darkcyan', width:'90px', height:'90px',marginTop:"20px"}}
                    src="/img/welcome_screen/robot.png"
                />
            </DialogContent>
        </Dialog>
    )
}

export default SpeechBubble;