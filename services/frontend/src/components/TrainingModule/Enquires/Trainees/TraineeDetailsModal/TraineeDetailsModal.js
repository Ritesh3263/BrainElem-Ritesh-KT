import Dialog from "@material-ui/core/Dialog";
import {Button, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {useTranslation} from "react-i18next";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {ETab, ETabBar} from "styled_components";
import Information from "./Information";
import Contact from "./Contact";
import userService from "services/user.service";
import { theme } from "MuiTheme";

const useStyles = makeStyles((theme) => ({}));

export default function TraineeDetailsModal(props){
    const{
        isOpenTraineeModal,
        setIsOpenTraineeModal=()=>{},
    }=props;
    const {t} = useTranslation();
    const classes = useStyles();
    const [currentUser, setCurrentUser]=useState({});
    const [activeTab, setActiveTab]=useState(0);

    useEffect(()=>{
        if(isOpenTraineeModal.traineeId){
            userService.read(isOpenTraineeModal.traineeId).then(res=>{
                if(res.status === 200 && res.data){
                    setCurrentUser(res.data);
                }
            }).catch(err=>console.log(err));
        }
    },[isOpenTraineeModal]);

    return (
        <Dialog open={isOpenTraineeModal.isOpen}
                onClose={()=>setIsOpenTraineeModal({isOpen: false, traineeId: undefined})}
                maxWidth={"xs"}
                fullWidth={true} aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
            <DialogTitle  style={{background: theme.palette.neutrals.white}} id="alert-dialog-title" className="px-3 pt-2 pb-0">
                <Grid container className="d-flex">
                    <Grid item xs={6} className="d-flex justify-content-start align-content-center">
                        <Typography variant="h3" component="h3" className="text-left text-justify " style={{fontSize:"24px"}}>
                            {t("User information")}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} className="d-flex justify-content-end align-content-center">
                        <IconButton
                            style={{color: `rgba(255, 255, 255, 0.4)`}}
                            title={t("More")}
                            aria-label="More"
                            size="medium"
                            onClick={()=>{}}
                        >
                            <MoreHorizIcon fontSize="small" style={{color: `rgba(82, 57, 112, 1)`}}/>
                        </IconButton>
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent style={{background: theme.palette.neutrals.white}}>

            <ETabBar style={{width:"200px"}} className="mt-1 "
                    value={activeTab}
                    onChange={(e,i)=>setActiveTab(i)}
                    eSize='xsmall'
                >
                    <ETab style={{minWidth:'100px'}} label='Information' eSize='xsmall'/>
                    <ETab style={{minWidth:'100px'}} label='Contact' disabled={true} eSize='xsmall'/>
            </ETabBar>

                {activeTab === 0 && (<Information currentUser={currentUser}/>)}
                {activeTab === 1 && (<Contact currentUser={currentUser}/>)}
            </DialogContent>
            <DialogActions className="d-flex justify-content-end pb-3" style={{background: theme.palette.neutrals.white, }}>
                <Button variant="contained" size="small" color="secondary" onClick={()=>{setIsOpenTraineeModal({isOpen: false, traineeId: undefined})}}>
                    <small>{t("Back")}</small>
                </Button>
            </DialogActions>
        </Dialog>
    );
};