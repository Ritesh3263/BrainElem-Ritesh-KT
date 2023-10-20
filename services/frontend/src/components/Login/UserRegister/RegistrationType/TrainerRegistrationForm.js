import React, {useState} from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {makeStyles} from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(theme=>({}))

export default function TrainerRegistrationForm({visiblePassword, setVisiblePassword, userFormData, setUserFormData, validators}){
    const { t } = useTranslation(['login-welcome-registration', 'common']);
    const classes = useStyles();
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    return(
        <Grid container justifyContent="center" spacing={0}>
            <Grid item xs={12} md={8} justifyContent="center">
                <TextField label={t("login-welcome-registration:TITLE (OPTIONAL)")} margin="normal"
                           fullWidth={true}
                           variant="filled"
                           InputLabelProps={{
                               shrink: true,
                           }}
                           InputProps={{
                               readOnly: false,
                           }}
                           value={userFormData.academicTitle ? userFormData.academicTitle : ""}
                           onChange={(e=>{setUserFormData(p=>({...p,academicTitle: e.target.value}))})}
                />
                <TextField label={t("common:NAME")} margin="normal"
                           fullWidth={true}
                           variant="filled"
                           InputLabelProps={{
                               shrink: true,
                           }}
                           InputProps={{
                               readOnly: false,
                           }}
                           value={userFormData.name ? userFormData.name : ""}
                           onChange={(e=>{setUserFormData(p=>({...p,name: e.target.value}))})}
                />
                <TextField label={t("common:SURNAME")} margin="normal"
                           fullWidth={true}
                           variant="filled"
                           InputLabelProps={{
                               shrink: true,
                           }}
                           InputProps={{
                               readOnly: false,
                           }}
                           value={userFormData.surname ? userFormData.surname : ""}
                           onChange={(e=>{setUserFormData(p=>({...p,surname: e.target.value}))})}
                />
                <TextField label={t("common:USERNAME")} margin="normal"
                           fullWidth={true}
                           variant="filled"
                           required={true}
                           InputLabelProps={{
                               shrink: true,
                           }}
                           InputProps={{
                               readOnly: false,
                           }}
                           value={userFormData.username ? userFormData.username : ""}
                           onChange={(e=>{setUserFormData(p=>({...p,username: e.target.value}))})}
                />
                <TextField label={t("common:E-MAIL")} margin="normal"
                           fullWidth={true}
                           type="email"
                           variant="filled"
                           required={true}
                           InputLabelProps={{
                               shrink: true,
                           }}
                           InputProps={{
                               readOnly: false,
                           }}
                           value={userFormData.email ? userFormData.email : ""}
                           onChange={(e=>{setUserFormData(p=>({...p,email: e.target.value}))})}
                />
                <TextField label={t("common:PASSWORD")} margin="normal"
                           type={visiblePassword ? 'text' : 'password'}
                           fullWidth={true}
                           size="small"
                           required={true}
                           variant="filled"
                           value={userFormData.password ? userFormData.password : ""}
                           onChange={(e=>{setUserFormData(p=>({...p,password: e.target.value}))})}
                           error={(!validators.isValidate) && validators.errorType.includes("PASSWORD")}
                           InputLabelProps={{
                               shrink: true,
                           }}
                           InputProps={{
                               endAdornment:
                                   <IconButton
                                       aria-label="toggle password visibility"
                                       onClick={()=>{setVisiblePassword(p=>!p)}}
                                       edge="end"
                                   >
                                       {visiblePassword ? <Visibility /> : <VisibilityOff />}
                                   </IconButton>,
                           }}
                           helperText={`${t("common:PASSWORD VALIDATION MESSAGE")} ${validators.errorMessage}`}
                />
                <TextField label={t("common:CONFIRM PASSWORD")} margin="normal"
                           type={isConfirmPasswordVisible ? 'text' : 'password'}
                           fullWidth={true}
                           size="small"
                           required={true}
                           variant="filled"
                           value={userFormData.confirmPassword ? userFormData.confirmPassword : ""}
                           onChange={(e=>{setUserFormData(p=>({...p,confirmPassword: e.target.value}))})}
                           error={`${validators.errorMessage}`}
                           InputLabelProps={{
                               shrink: true,
                           }}
                           InputProps={{
                               endAdornment:
                                   <IconButton
                                       aria-label="toggle password visibility"
                                       onClick={()=>{setIsConfirmPasswordVisible(p=>!p)}}
                                       edge="end"
                                   >
                                       {isConfirmPasswordVisible ? <Visibility /> : <VisibilityOff />}
                                   </IconButton>,
                           }}
                           helperText={`${validators.errorMessage}`}
                />
            </Grid>
        </Grid>
    )
}