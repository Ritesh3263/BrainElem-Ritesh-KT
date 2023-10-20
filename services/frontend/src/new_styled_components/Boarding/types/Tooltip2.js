import React, {useEffect} from 'react';
import {useTranslation} from "react-i18next";
import {Zoom} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import Tooltip from "@mui/material/Tooltip";
import Grid from "@material-ui/core/Grid";
import {EButton} from "../../index";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const Tooltip2=(props)=> {
    const{
        isOpenBoarding=false,
        item = null,
        boardingActions=({})=>{},
    }=props;
    const { t } = useTranslation();


    const tipEvHandler=({type})=>{
        switch(type){
            case 'BTN':{
                item.ref.current.isOnBoarding = true;
                item.ref.current.click();
                break;
            }
            case 'FILL_FIELD':{
                item.ref.current.value = item?.evt?.value || 'new';
                break;
            }
            default: break;
        }
        boardingActions({type:'NEXT',payload:{}})
    }

    useEffect(()=>{
        if(item){
            item?.ref?.current?.focus();
        }
    },[item]);

     return (
         <Dialog open={isOpenBoarding}
                 TransitionComponent={Zoom}
                 transitionDuration={{enter: 1000, exit: 1000, appear: 1000,}}
         >
             <Tooltip
                 style={{zIndex:9999999}}
                 open={isOpenBoarding}
                 transitionDuration={{enter: 1000, exit: 1000, appear: 1000,}}
                 TransitionComponent={Zoom}
                 componentsProps={{
                     tooltip:{
                         style:{
                             backgroundColor:'rgba(255,255,255,.95)',
                             color:'black',
                             paddingRight:'4px',
                             paddingLeft:'4px'
                         }
                     },
                     arrow:{
                       style:{
                           color:'rgba(255,255,255,.95)',
                       }
                     }
                 }}
                 PopperProps={{
                     anchorEl: item?.ref?.current,
                 }}
                 arrow
                 title={(
                     <Grid container>
                         <Grid item xs={12} style={{display:'flex', justifyContent: 'end',padding:'0px'}}>
                             <IconButton size="small" color="primary"
                                         onClick={()=>{boardingActions({type:'CLOSE',payload:{}})}}>
                                 <CloseIcon/>
                             </IconButton>
                         </Grid>
                         <Grid item xs={12} style={{marginTop:'7px', paddingLeft:'5px', paddingRight:'5px'}}>
                             {item?.children}
                         </Grid>
                         <Grid item xs={12} style={{marginTop:'10px'}}>
                             {item?.evt && (
                                 <EButton
                                     eSize='small'
                                     eVariant="secondary"
                                     onClick={()=>{
                                         setTimeout(()=>{
                                             tipEvHandler({type:item?.evt?.type});
                                         },200)
                                     }}
                                 >
                                     {t(item?.evt?.title)}
                                 </EButton>
                             )}
                         </Grid>
                         <Grid item xs={12} style={{display:'flex', flexDirection:'row', justifyContent:'space-between', marginTop:'10px'}}>
                             <EButton
                                 disabled={item?.disablePrev}
                                 eSize='small'
                                 eVariant="secondary"
                                 onClick={()=>{
                                     boardingActions({type:'PREV',payload:{}})
                                 }}
                             >
                                 {t("Prev")}
                             </EButton>
                             <EButton
                                 disabled={item?.disableNext}
                                 eSize='small'
                                 eVariant="secondary"
                                 onClick={()=>{
                                     boardingActions({type:'NEXT',payload:{}})
                                 }}
                             >
                                 {t("Next")}
                             </EButton>
                         </Grid>
                     </Grid>
                 )}><div></div></Tooltip>
         </Dialog>
     )
 }

export default Tooltip2;