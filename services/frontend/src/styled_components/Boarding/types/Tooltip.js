import React, {useEffect, useState} from 'react';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import {EButton} from "styled_components";
import {DialogActions, DialogContent} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@mui/material/Grid";
import CloseIcon from '@mui/icons-material/Close';
import Typography from "@material-ui/core/Typography";
import {useTranslation} from "react-i18next";
import { Zoom } from '@mui/material';


const Tooltip=(props)=> {
    const{
        isOpenBoarding=false,
        item = null,
        boardingActions=({})=>{},
    }=props;
    const { t } = useTranslation();

    const [heightOption, setHeightOption] = useState('BOTTOM'); // 'TOP' or 'BOTTOM
    const { innerWidth: width, innerHeight: height } = window;

    useEffect(()=>{
        if((item?.ref?.current?.getBoundingClientRect()?.top+220)>height){
            setHeightOption('TOP');
        }else{
            setHeightOption("BOTTOM");
        }
    },[width,height, item?.ref]);


    const calculateElPosition=({type,payload})=>{
        if(payload?.current){
            payload.current.focus();
            switch(type){
                case 'top':{
                    let topOffset = payload.current.getBoundingClientRect()?.top  || 0;
                    let elHeight = payload.current.getBoundingClientRect()?.height  || 0;
                    let topOption = 0;
                    if(heightOption === 'TOP'){
                        topOption = payload.current.getBoundingClientRect()?.height + 200;
                    }
                    return `${(topOffset + elHeight)-topOption}px`;
                }
                case 'left':{
                    let leftOffset = payload.current.getBoundingClientRect()?.left || 0;
                    let halfOfEl = payload.current.getBoundingClientRect()?.width >0 ? payload.current.getBoundingClientRect()?.width/2 : 0;
                    let modalWidth = 200;
                    return `${(leftOffset + halfOfEl) - modalWidth}px`;
                }
                default: return '0px';
            }
        }else return '0px';
    }

    return (
        <Dialog open={isOpenBoarding}
                TransitionComponent={Zoom}
                transitionDuration={{enter: 1000, exit: 1000, appear: 1000,}}
                PaperProps={{
                    style:{
                        backgroundColor:'rgba(255,255,255,0)',
                        boxShadow:'none',
                        borderRadius: '8px',
                        position: 'absolute',
                        maxHeight:'220px',
                        margin:0,
                        top: calculateElPosition({type:'top',payload:item.ref}),
                        left: calculateElPosition({type:'left',payload:item.ref}),
                    }
                }}
        >
            {heightOption === 'BOTTOM' && (
                <DialogTitle style={{display:'flex', justifyContent:'center', padding:0}}>
                    <div style={{
                        width:0,
                        height:0,
                        borderLeft: "20px solid transparent",
                        borderRight: "20px solid transparent",
                        borderBottom: "20px solid rgba(255,255,255,0.8)",
                    }}/>
                </DialogTitle>
            )}
            <DialogTitle style={{backgroundColor:'rgba(255,255,255,0.8)',padding:'0px', borderTopLeftRadius:'8px', borderTopRightRadius:'8px'}}>
                <Grid container>
                    <Grid item xs={12} style={{display:'flex', justifyContent: 'end',padding:'6px'}}>
                        <IconButton size="small" color="primary"
                                    onClick={()=>{boardingActions({type:'CLOSE',payload:{}})}}>
                            <CloseIcon/>
                        </IconButton>
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent style={{backgroundColor:'rgba(255,255,255,0.8)', maxWidth:'400px'}}>
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
            {heightOption === 'TOP' && (
                <DialogTitle style={{display:'flex', justifyContent:'center', padding:0}}>
                    <div style={{
                        width:0,
                        height:0,
                        borderLeft: "20px solid transparent",
                        borderRight: "20px solid transparent",
                        borderTop: "20px solid rgba(255,255,255,0.8)",
                    }}/>
                </DialogTitle>
            )}
        </Dialog>
    )
}

export default Tooltip;