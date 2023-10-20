import {useMainContext} from "../_ContextProviders/MainDataContextProvider/MainDataProvider";
import {useNavigate} from "react-router-dom";
import AuthService from "../../services/auth.service";
import qs from "qs";
import {Button, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText, Dialog} from "@material-ui/core";
import React, { useState } from "react";
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import {makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import Typography from "@material-ui/core/Typography";
import { EChip } from "styled_components";
import {theme} from "MuiTheme";
import { new_theme } from "NewMuiTheme";
import { ThemeProvider } from "@mui/system";
import styles from './login.module.scss';
import StyledButton from "new_styled_components/Button/Button.styled";


const useStyles = makeStyles(theme=>({
    icon: {
        '&:hover': {
            cursor:"pointer",
            transform: "scale(1.03, 1.03)"
        }    },
}))

export default function ModuleSelectionModal({moduleSelection, setModuleSelection}){
    const { t } = useTranslation(['login-welcome-registration', 'common']);
    const { F_logout, F_reloadUser, asyncLocalStorage, F_gotoDefaultView, F_selectRole } = useMainContext();
    let user = JSON.parse(localStorage.getItem("user")) ?? { modules: [] };
    const [tcRoles] = useState(['Root','EcoManager','CloudManager','NetworkManager','ModuleManager',"Trainer","Trainee","Librarian","Inspector","Assistant",'Coordinator','TrainingManager','Partner']);
    const [schoolRoles] = useState(['Root','EcoManager','CloudManager','NetworkManager','ModuleManager',"Trainer","Trainee","Librarian","Inspector","Architect","Parent"]);

    function selectModule(moduleId) {
        setModuleSelection({open: false, center: null, module: []})
        AuthService.addModuleToScopes(moduleId);

        let access_token = qs.parse(window.location.search, { ignoreQueryPrefix: true }).token
        AuthService.refreshToken(access_token, moduleId, null, user.selectedPeriod).then(async(res)=>{
            if(res.status === 200){
                F_reloadUser();
                // navigate("/explore-courses");
                // Set user in localstorage
                await asyncLocalStorage.setItem("user", JSON.stringify(res.data))
                // Set user in maindataprovider
                if(!tcRoles.includes(res.data.role)) {
                    let xRole = res.data.availableRoles.includes("Trainer") ? "Trainer" : res.data.availableRoles[0]
                    F_selectRole(xRole)
                    F_gotoDefaultView(xRole, res.data.isInTrainingCenter); // Go to default view
                } else {
                    F_reloadUser();
                    F_gotoDefaultView(res.data.role, res.data.isInTrainingCenter); // Go to default view
                }
                localStorage.setItem('isWelcome', false);
            }
        })
    }
    function logout() {
        setModuleSelection({open: false, center: null, module: []})
        F_logout();
    }

    const classes = useStyles();
    const moduleList = user?.modules?.filter(x=>x.moduleType === moduleSelection.center)?.map((item, index) => (
        <ThemeProvider theme={new_theme}>
    <Grid xs={12} sm={6} md={2.2} className={styles.gridCard}>
        
        <Card className={[styles.cardDiv , classes.icon]} key={index} sx={{ p:0,  m:2, maxWidth:"250px", overflow:'visible'}} onClick={() => selectModule(item._id)}>
            <CardMedia className={styles.cardImage} style={{background: theme.palette.neutrals.darkestGrey}}
                component="img"
                sx={{ 
                    px:3
                }}
                image="/img/brand/robotCropped.png"
                alt="Side Menu"
            />
            <CardContent className={styles.cardContent}>
                <EChip size="small"  className={styles.chipLabel} sx={{ minHeight:50 }}
                    label={item.moduleType}>
                </EChip>
                <Typography gutterBottom variant="h5" component="div" className={styles.cardHeading} sx={{mb:0}}>
                    {item.name}
                </Typography>
                
                <StyledButton eViarant="primary" eSize="small" className={styles.clkBtn} sx={{padding: '4px 16px!important'}}>
                &nbsp;{t("login-welcome-registration:CLICK HERE")}
                </StyledButton>
            </CardContent>
      </Card>
    </Grid>
    </ThemeProvider>
    ));

    return (
        <Dialog 
            PaperProps={{
                style:{borderRadius: "16px", background: theme.palette.glass.opaque, }
            }} 
            open={moduleSelection.open} onClose={(event)=>event.preventDefault()} maxWidth={"lg"} fullWidth={true} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" className="elia-bg">
                <DialogTitle id="alert-dialog-title" className="text-center">
                    <img src={`img/brand/BrainElem_Logo_Academy.svg`} alt="icon"  style={{margin:"10px 0 6px 0"}} className={styles.popupLogo} />
                    <Typography style={{color: "white", fontSize: 24}} className="text-center text-justify" >
                        {t("login-welcome-registration:PLEASE SELECT THE MODULE TO ACCESS")}
                    </Typography>
                </DialogTitle>
                <DialogContent> 
                    <Grid container xs={12} >
                        <Grid xs={12} sx={{ display: 'flex',flexWrap: 'wrap', placeContent:"center" }}>
                            {moduleList}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions className="d-flex justify-content-end ml-3 mr-3 py-4">
                    <StyledButton eVariant="secondary" eSize="medium" classes={{root: classes.root}} onClick={logout}>
                        <small>{t("common:LOGOUT")}</small>
                    </StyledButton>
                </DialogActions>
        </Dialog>
    );
};