import React from "react";
import Grid from "@material-ui/core/Grid";
import {Divider} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import {makeStyles} from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import {EUserRoleChip} from "../../../../../styled_components";
import { theme } from "../../../../../MuiTheme";
import { useMainContext } from "../../../../_ContextProviders/MainDataContextProvider/MainDataProvider";

const useStyles = makeStyles((theme) => ({}));

export default function Information({currentUser}){
    const classes = useStyles();
    const { t } = useTranslation();
    const { F_getHelper } = useMainContext();
    const isInTrainingCenter = F_getHelper().manageScopeIds.isTrainingCenter;


    const renderUserAvatar=(role)=>{
        switch (role){
            case "Root": return "Root";
            case "EcoManager": return "EcoMan";
            case "NetworkManager": return "NetworkMan";
            case "ModuleManager": return "ModuleMan";
            case "Assistant": return "ModuleMan";
            case "Architect": return "Architect";          
            case "Librarian": return "Librarian";
            case "Trainee": return "Student";
            case "Parent": return "Parent";
            case "Trainer": return "Teacher";
            default:  return "Student";
        }
    }

    return(
        <Grid container className="mt-3">
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={2} className="d-flex justify-content-center align-items-center">
                        <Avatar
                            style={{width: '80px', height: '80px'}}
                            alt="user-icon-avatar"
                            src={`/img/user_icons_by_roles/${renderUserAvatar(currentUser?.settings?.role)}.png`}/>
                    </Grid>
                    <Grid item xs={10} className="pl-4">
                        <div>
                                <Typography variant="body" component="span" className="text-left"
                                            style={{color: `rgba(82, 57, 112, 1)`}}
                                >
                                    {currentUser?.settings?.isActive ? t('active') : t('inActive')}
                                </Typography>
                        </div>
                        <div className="mt-2">
                            <Typography variant="h5" component="span" className="text-left font-weight-bold"
                                        style={{color: `rgba(82, 57, 112, 1)`}}
                            >
                                {`${currentUser?.name} ${currentUser?.surname}`}
                            </Typography>
                        </div>
                        <div className='mt-2'>
                            <EUserRoleChip  style={{maxWidth:"100px"}}
                                  size="small"
                                  label={currentUser?.settings?.role||'-'} />
                        </div>
                    </Grid>
                </Grid>
            </Grid>
            {isInTrainingCenter && ( 
                <Grid item xs={12} className='mt-3'>
                    <img
                            src="/img/icons/sidebar_subjects.svg"
                            style={{ height: "25px", width:"25px" }}
                        /><small className='ml-1' style={{color:theme.palette.primary.darkViolet}}> {t("Assigned sessions")}</small>
                </Grid>
            )}
            {isInTrainingCenter && ( 
                <Grid item xs={12} className='mt-2'>
                    {["session 1","session 2"].map(item =>
                        (<Chip style={{ margin: 1 }} key={item} size="small" label={item} />)
                    )}
                </Grid>
            )}
            {currentUser.settings?.role === "Trainee" && (
                <Grid item xs={12} className='mt-3'>
                <img
                        src="/img/icons/sidebar_gradingScale.svg"
                        style={{ height: "25px", width:"25px" }}
                    /><small className='ml-1' style={{color:theme.palette.primary.darkViolet}}> {t("Level")}</small>
                </Grid>
            )}    
            {currentUser.settings?.role === "Trainee" && (
                <Grid item xs={12} className='mt-2'>
                        <Chip style={{ margin: 1 }} size="small" label={currentUser?.settings?.level||'-'} />
                </Grid>
            )} 

            <Grid item xs={12} className='mt-3'>
              <Typography variant="h5" component="h5" className="text-left">
               {t("Account information")}
              </Typography>
                <Grid container>
                    <Grid item xs={6}>
                        <TextField label={t("E-mail")} margin="normal"
                                   InputProps={{
                                       readOnly: true,
                                       disableUnderline: true,
                                   }}
                                   name='filed'
                                   fullWidth
                                   style={{maxWidth: "400px"}}
                                   variant='standard'
                                   required={false}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={currentUser?.email||'-'}
                                   onInput={(e) => {}}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label={t("Username")} margin="normal"
                                   InputProps={{
                                       readOnly: true,
                                       disableUnderline: true,
                                   }}
                                   name='filed'
                                   fullWidth
                                   style={{maxWidth: "400px"}}
                                   variant='standard'
                                   required={false}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={currentUser?.username||'-'}
                                   onInput={(e) => {}}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} className='mt-3'>
              <Typography variant="h5" component="h5" className="text-left">
                  {t("Additional information")}
              </Typography>
                <Grid container>
                    <Grid item xs={6}>
                        <TextField label={t("Gender")} margin="normal"
                                   InputProps={{
                                       readOnly: true,
                                       disableUnderline: true,
                                   }}
                                   name='filed'
                                   fullWidth
                                   style={{maxWidth: "400px"}}
                                   variant='standard'
                                   required={false}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={currentUser?.details?.gender||'-'}
                                   onInput={(e) => {}}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label={t("Created at")} margin="normal"
                                   InputProps={{
                                       readOnly: true,
                                       disableUnderline: true,
                                   }}
                                   name='filed'
                                   fullWidth
                                   style={{maxWidth: "400px"}}
                                   variant='standard'
                                   required={false}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={currentUser?.settings?.createdAt ? (new Date (currentUser?.settings?.createdAt).toLocaleDateString()) : '-'}
                                   onInput={(e) => {}}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label={t("Language")} margin="normal"
                                   InputProps={{
                                       readOnly: true,
                                       disableUnderline: true,
                                   }}
                                   name='filed'
                                   fullWidth
                                   style={{maxWidth: "400px"}}
                                   variant='standard'
                                   required={false}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={currentUser?.settings?.language}
                                   onInput={(e) => {}}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label={t("Birth date")} margin="normal"
                                   InputProps={{
                                       readOnly: true,
                                       disableUnderline: true,
                                   }}
                                   name='filed'
                                   fullWidth
                                   style={{maxWidth: "400px"}}
                                   variant='standard'
                                   required={false}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={currentUser?.details?.dateOfBirth ? (new Date (currentUser?.details?.dateOfBirth).toLocaleDateString()) : '-'}
                                   onInput={(e) => {}}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}