import React, {lazy, useEffect, useState} from 'react';
import Dialog from "@material-ui/core/Dialog";
import {isWidthUp} from "@material-ui/core/withWidth";
import {Hidden} from "@material-ui/core";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import DialogActions from "@material-ui/core/DialogActions";
import {Stack} from "@mui/material";
import {EButton} from "styled_components";
import {useTranslation} from "react-i18next";
import {makeStyles} from "@material-ui/core/styles";
import {useMainContext} from "../../../_ContextProviders/MainDataContextProvider/MainDataProvider";


const Assistance = lazy(()=>import("../Assistance"));
// const TipsForLearning = lazy(()=>import("../TipsForLearning"));
const MyPerformance = lazy(()=>import("../MyPerformance"));
const MyAccomplishments = lazy(()=>import("../MyAccomplishments"));
const ActivityPreview = lazy(()=>import("../ActivityPreview"));
const UpcomingEvents = lazy(()=>import("../UpcomingEvents"));
const MyLastContent = lazy(()=>import("../MyLastContent"));


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

const AdHocDialog =()=>{
    const { t } = useTranslation();
    const classes = useStyles();
    const [isOpen, setIsOpen] = useState(false);
    const {currentScreenSize} = useMainContext();
    const {
        F_getHelper
    } = useMainContext();
    const {user} = F_getHelper();

    useEffect(()=>{
        if(user.role === 'Parent'){
            if(window.localStorage.getItem('welcomeParent')){
                const {isTaken} = JSON.parse(window.localStorage.getItem('welcomeParent'));
                if(!isTaken){
                    setIsOpen(false)
                }else{
                    setIsOpen(false)
                }
            }else{
                window.localStorage.setItem('welcomeParent', JSON.stringify({isTaken: false}));
            }
        }
    },[]);

    const save=()=>{
        window.localStorage.setItem('welcomeParent', JSON.stringify({isTaken: true}));
        setIsOpen(false);
    }

    return(
        <Dialog
            PaperProps={{
                style: { borderRadius: "16px"}}
            }
            open={isOpen}
            style={{minHeight:'400px'}}
            maxWidth={isWidthUp('sm',currentScreenSize) ? "md" : "100%"}
            fullWidth={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <Hidden xsDown={true}>
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
                    {t("Welcome to the Academy")}
                </Typography>
            </DialogTitle>
            <DialogContent className={`pt-0 px-4 pt-3 pb-4 ${classes.blur}`} >
                <Typography variant="h5" component="h2" className="text-left text-justify mt-4" style={{color: `rgba(82, 57, 112, 1)`, paddingRight: isWidthUp('sm',currentScreenSize) ? "120px" : "0px" , lineHeight: 1.5}}>
                    {t("Cher parent, un grand merci de vous être connecté sur ELIA " +
                        "! Ce début d'année est consacré à la formation des élèves à la prise en main de cette plateforme. " +
                        "Elle sera donc opérationnelle pour les parents dès le 29 août!")}
                </Typography>
            </DialogContent>
            <DialogActions className={classes.blur}>
                <Stack  alignItems="center" justifyContent="center" spacing={2} className="d-flex flex-fill mb-2">
                    <EButton eSize='medium' eVariant='secondary'
                             onClick={save}
                    >{t('Close')}</EButton>
                </Stack>
            </DialogActions>
        </Dialog>
    )
}


const ParentDashboard=()=> {

    return (
        <>
            <Assistance />
            {/* <TipsForLearning /> */}
            <MyPerformance type={'PARENT'}/> {/* performance of kids */}
            <MyAccomplishments/>{/* accomplishments of kids */}
            {/* <ActivityPreview sizeType='2/3'/> */}
            <UpcomingEvents /> {/* events of kids */}
            <Assistance beginning={3} size={3} />
            <AdHocDialog />
        </>
    )
}

export default ParentDashboard;


