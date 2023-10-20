import { useMainContext } from "../_ContextProviders/MainDataContextProvider/MainDataProvider";
import Dialog from "@material-ui/core/Dialog";
import { Button, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import DialogContentText from "@material-ui/core/DialogContentText";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Grid, FormControl, ThemeProvider, Box, TextField } from '@mui/material';
import { useTranslation } from "react-i18next";
import FormHelperText from "@material-ui/core/FormHelperText";
import { ETextField } from "new_styled_components";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import CircularProgress from "@mui/material/CircularProgress";
import AuthService from "../../services/auth.service";
import { now } from "moment";
import styles from './login.module.scss';
import StyledButton from "new_styled_components/Button/Button.styled";
import { new_theme } from "NewMuiTheme";

//Services
import ValidatorsService from "services/validators.service";
import { Container } from "@mui/material";

const useStyles = makeStyles((theme) => ({}));

export default function ResetPasswordModal({ isOpenResetPasswordModal, setIsOpenResetPasswordModal }) {
    const { t } = useTranslation(['common', 'login-welcome-registration']);
    const classes = useStyles();
    const { F_logout,
        F_reloadUser,
        F_showToastMessage,
        F_getErrorMessage } = useMainContext();
    const [email, setEmail] = useState('');
    const [emailValid, setEmailValid] = useState(true);

    useEffect(() => {
        setEmail('');
        setEmailValid(true);
    }, [isOpenResetPasswordModal])

    function handleResetPassword() {
        if (!email || !emailValid) return  setEmailValid(false)
        if (emailValid) {
            AuthService.resetPassword(email).then(
                (response) => {
                    let message = t("common:THE EMAIL WAS SENT SUCCESSFULLY");
                    F_showToastMessage(message, "success");
                },
                (error) => {
                    let errorMessage = F_getErrorMessage(error);
                    if (error.response.status === 404)
                        errorMessage = t("login-welcome-registration:THE USER WITH SUCH EMAIL DOES NOT EXISTS");
                    F_showToastMessage(errorMessage, "error");
                }
            );
            setEmailValid(true);
            setIsOpenResetPasswordModal(false);
        }
    };

    return (
        <ThemeProvider theme={new_theme}>
            <div className={styles.login_container}>
                <div className={styles.login_inner}>
                    <div className={styles.loginsubinner}>
                        <Grid container sx={{ height: '100%' }}>
                            <Grid item xs={12} className={styles.login_content_parent}>
                                <Box className={styles.reset_content}>
                                    <Box>
                                        <Typography variant="h2" component="h2" sx={{color: new_theme.palette.primary.MedPurple}}>
                                            {t("common:RESET THE PASSWORD")}
                                        </Typography>
                                        <Typography variant="body4" component="p" sx={{mb: 3}}>
                                            {t("common:PLEASE ENTER YOUR E-MAIL")}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <FormControl fullWidth={true} >
                                            <ETextField label={t("common:E-MAIL")}
                                                sx={{mb: 0}}
                                                required={true}
                                                variant="filled"
                                                size="medium"
                                                value={email}
                                                onChange={(e) => {
                                                    setEmailValid(ValidatorsService.isValidEmailAddress(e.target.value))
                                                    setEmail(e.target.value)
                                                }}
                                                error={!emailValid}
                                            />
                                            {!emailValid && (<FormHelperText error={true}>{t("common:INCORRECT E-MAIL")}</FormHelperText>)}
                                        </FormControl>
                                        <StyledButton eVariant="primary" eSize="medium" onClick={handleResetPassword} sx={{mt: 3}}>
                                            {t("common:SEND E-MAIL")}
                                        </StyledButton>
                                    </Box>
                                </Box>
                            </Grid>
                            {/* <Grid item xs={12} sm={6} className={styles.login_image_parent}>
                                <div className={styles.login_image}>
                                    <img src='/img/brand/login_pic.png' className='img-fluid' />
                                </div>
                            </Grid> */}
                        </Grid>
                    </div>
                </div>
            </div>


            {/* <Dialog open={isOpenResetPasswordModal} onClose={() => { setIsOpenResetPasswordModal(false) }} maxWidth={"sm"} fullWidth={true} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title" className="text-center">
                    <Typography variant="h5" component="h2" className="text-center text-justify">
                        {t("login-welcome-registration:RESET PASSWORD")}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {"A link will be sent to the e-mail address provided to create a new password"}
                    </DialogContentText>
                    <Grid container className="d-flex justify-content-center align-items-center">
                        <Grid item md={6}>
                            <FormControl fullWidth={true} >
                                {!emailValid && (<FormHelperText error={true} className="text-center">{t("common:INCORRECT E-MAIL")}</FormHelperText>)}
                                <TextField label={t("common:E-MAIL")} margin="normal"
                                    required={true}
                                    variant="filled"
                                    size="small"
                                    value={email}
                                    onChange={(e) => {
                                        const reg = /@/i;
                                        if (!reg.test(e.target.value)) setEmailValid(false)
                                        else setEmailValid(true)
                                        setEmail(e.target.value)
                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        //readOnly: true,
                                    }}
                                    error={!emailValid}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions className="d-flex justify-content-end ml-3 mr-3">
                    <Button classes={{ root: classes.root }} size="small" variant="contained" color="primary" onClick={handleResetPassword}>
                        {t('Reset')}
                    </Button>
                </DialogActions>
            </Dialog> */}
        </ThemeProvider>
    );
};