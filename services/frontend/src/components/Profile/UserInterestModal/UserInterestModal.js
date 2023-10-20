import React, {useEffect, useState} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import {Stack} from "@mui/material";
import DialogActions from "@material-ui/core/DialogActions";
import {EButton} from "styled_components";
import {Button} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import CommonService from "services/common.service";
import {Paper} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import UserService from "services/user.service";
import ModuleCoreService from "services/module-core.service";
import {Hidden} from "@material-ui/core";
import {isWidthUp} from "@material-ui/core/withWidth";

const useStyles = makeStyles(theme=>({
    blur:{
        background: theme.palette.glass.medium,
        backdropFilter:"blur(20px)",
    },
    paper:{
        minHeight:"110px",
        borderRadius: '8px',
        backgroundColor:'rgba(255,255,255,.75)',
        cursor:'pointer',
        '&:hover': {
            backgroundColor:'rgba(255,255,255,.95)',
        },
    }
}));


export default function UserInterestModal(props){
    const { t } = useTranslation();
    const classes = useStyles();
    const{
        interestModalHelper={isOpen:false},
        setInterestModalHelper=({isOpen})=>{},
    }=props;
    const {F_getHelper, F_showToastMessage, currentScreenSize} = useMainContext();
    const {user} = F_getHelper();
    const [interests, setInterests]=useState([]);
    const [user1, setUser1]=useState({});

    useEffect(()=>{
        // && user
        if(interestModalHelper.isOpen){
            CommonService.getAllInterests().then(res=>{
                if(res.status===200){
                    setInterests(res.data);
                    //console.log(res.data)
                }
            }).catch(err=>console.log(err));

            if (user?.id) {
                UserService.read(user.id).then(res=>{
                    if(res.status===200){
                        setUser1(res.data);
                    }
                }).catch(err=>console.log(err));
            }
        }
    },[interestModalHelper.isOpen]);

    const save=()=>{
        const subinterests=[];
        if(interests.some(i=> i?.isSelected === true)){
            interests.map(inter=>{
               if(inter?.isSelected === true){
                   inter.subinterests.map(sub=>{
                       subinterests.push(sub._id);
                   })
               }
            });
            //setUser1(p=>({...p, details: {...p.details, subinterests:[...subinterests]}}));
            ModuleCoreService.updateModuleUser({...user1, details: {...user1.details, subinterests:[...subinterests]}}).then(res=>{
                F_showToastMessage(t("Interests was saved"),"success");
                setInterestModalHelper({isOpen: false});
            }).catch(error=>console.error(error));
        }else{
            setInterestModalHelper({isOpen: false});
        }
    }

    const interestsList = interests?.length>0 ? interests.map((item,index)=>(
        <Grid item xs={6} md={3} key={item._id} className='d-flex flex-grow-1 text-center'>
           <Paper elevation={17}
                  className={` align-items-center justify-content-center pt-4 mb-1 d-flex flex-grow-1 ${classes.paper}`}
                  style={{backgroundColor: `${item?.isSelected ? 'rgba(168, 92, 255, 1)' : 'rgba(255, 255, 255, 0.5)'}`}}
                  onClick={()=>{
                      setInterests(p=>{
                          let val = [...p];
                          val[index].isSelected = !val[index]?.isSelected;
                          return val;
                      })
                  }}>
               <Typography variant="h5" component="h5"  style={{color: `rgba(82, 57, 112, 1)`, marginRight:"auto", marginLeft:"auto"}}>
                   <strong>{item.name}</strong>
               </Typography>
           </Paper>
        </Grid>))
        : []

    return(
        <Dialog
            PaperProps={{
                style: { borderRadius: "16px"}}
            }
            open={interestModalHelper.isOpen}
            //onClose={()=>setInterestModalHelper({isOpen:false})}
            maxWidth={isWidthUp('sm',currentScreenSize) ? "md" : "100%"}
            fullWidth={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <Hidden smDown={true}>
                <img src="/img/popup/thinking.png" height={"230px"} 
                alt="thinking"
                style={{
                    position: "absolute",
                    bottom: "10px",
                    right: "20px",
                    zIndex: 1000,
                }}/>
            </Hidden>
            <DialogTitle id="alert-dialog-title" className={`text-center pb-0 ${classes.blur}`} >
                <Typography variant="h5" component="h2" className="text-left text-justify mt-4" style={{color: `rgba(168, 92, 255, 1)`, fontSize: '36px',lineHeight:"1.1"}}>
                    {t("Customise Your Elia experience")}
                </Typography>
                <Typography variant="body2" component="h2" className="text-left text-justify mt-3 ml-1" style={{color: `rgba(82, 57, 112, 1)`}}>
                    {t("Choose what you are following")}
                </Typography>
            </DialogTitle>
            <DialogContent className={`pt-0 px-4 pt-3 ${classes.blur}`} >
                <Grid container spacing={2}>
                    {interestsList}
                </Grid>
            </DialogContent>
            <DialogActions className={classes.blur}>
                <Stack  alignItems="center" justifyContent="center" spacing={2} className="d-flex flex-fill mb-4">
                        <Button size="small" variant="contained" color="primary"
                                 onClick={save}
                        >{t('Confirm')}</Button>
                        <span style={{color:"#A85CFF",cursor:"pointer" }}
                             onClick={()=>{setInterestModalHelper({isOpen: false})}}
                        >{t('I will do it later')}</span>
                </Stack>
            </DialogActions>
        </Dialog>
    )
}