import {useMainContext} from "../_ContextProviders/MainDataContextProvider/MainDataProvider";
import Dialog from "@material-ui/core/Dialog";
import {Button, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import DialogContentText from "@material-ui/core/DialogContentText";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles((theme) => ({}));

export default function ModuleTypeSwitchModal({isOpenModuleTypeSwitchModal, setIsOpenModuleTypeSwitchModal, availableModule, gotoTraining}){
    const { t, i18n, translationsLoaded } = useTranslation();
    const { F_logout, F_reloadUser } = useMainContext();
    const classes = useStyles();
    function logout() {
        setIsOpenModuleTypeSwitchModal(false);
        F_logout();
    }

    return (
        <Dialog open={isOpenModuleTypeSwitchModal} onClose={logout} maxWidth={"md"} fullWidth={true} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title" className="text-center">
                <Typography variant="h5" component="h2" className="text-center text-justify" style={{color: `rgba(82, 57, 112, 1)`}}>
                    {t("No School Module Available")}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Typography variant="body2" style={{color: `rgba(82, 57, 112, 1)`}}>
                        {t(`Looks like you don't have any school module! You have ${availableModule.training} training modules.`)}
                    </Typography>
                    <Typography variant="body2" style={{color: `rgba(82, 57, 112, 1)`}}>
                        {t(`Do you like to continue with training modules?`)}
                    </Typography>
                </DialogContentText>
            </DialogContent>
            <DialogActions className="d-flex justify-content-end ml-3 mr-3">
                <Button classes={{root: classes.root}} variant="contained" size="small" color="secondary" onClick={()=>gotoTraining(true)}>
                    <small>{t("Yes (Switch)")}</small>
                </Button>
                <Button classes={{root: classes.root}} variant="contained" size="small" color="primary" onClick={logout}>
                    <small>{t("No (Logout)")}</small>
                </Button>
            </DialogActions>
        </Dialog>
    );
};