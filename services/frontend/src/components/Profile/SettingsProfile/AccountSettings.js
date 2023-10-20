import React, {useEffect, useState} from "react";
import { useTranslation } from "react-i18next";
import {Grid, Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { EButton } from "styled_components";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import TextField from "@mui/material/TextField";
import { ETextField } from "new_styled_components";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListItem from '@mui/material/ListItem';
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import ClearIcon from '@mui/icons-material/Clear';
import { new_theme } from "NewMuiTheme";
import StyledButton from "new_styled_components/Button/Button.styled";
import ConfirmActionModal from "components/common/ConfirmActionModal";

export default function AccountSettings(props) {
    const {
        changePassword = {},
        setChangePassword = {},
        errorValidator = {},
        currentUser,
    } = props;
    const { t } = useTranslation();
    const [showPass1, setShowPass1] = useState(false);
    const [showPass2, setShowPass2] = useState(false);
    const [showPass3, setShowPass3] = useState(false);
    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false});


    

    return (
        <>
            
            <Box sx={{ maxWidth: '550px' }}>
                <Grid container>
                    <Grid className="detailPreviewParent" item xs={12}>
                        <Typography variant="body2" component="h6" sx={{mb:1}}>{t("AccountDtails Preview")}</Typography>

                        {/* <Typography variant="body2" component="h2" sx={{mb:1}}>{t("common:USERNAME")}</Typography>
                        <Typography variant="body2" component="h3" sx={{mb:1}}>{currentUser?.username??'-'}</Typography>
                        <Typography variant="body2" component="h2" sx={{mb:1}}>{t("common:MAIN ROLE")}</Typography>
                        <Typography variant="body2" component="h3" sx={{mb:1}}>{currentUser?.settings?.role??'-'}</Typography>
                        <Typography variant="body2" component="h2" sx={{mb:1}}>{t("common:E-MAIL")}</Typography>  
                        <Typography variant="body2" component="h3" sx={{mb:1}}>{currentUser?.email??'-'}</Typography>       */}
                        
                        <ETextField label={t("common:USERNAME")} margin="dense"
                            fullWidth={true}
                            variant="standard"
                            type='text'                            
                            value={currentUser?.username??'-'}
                            InputProps={{
                                readOnly:'true'
                            }}
                        />   
                        <ETextField label={t("common:MAIN ROLE")} margin="dense"
                            fullWidth={true}
                            variant="standard"
                            type='text'                            
                            value={currentUser?.settings?.role??'-'}
                            InputProps={{
                                readOnly:'true'
                            }}
                        />   
                        <ETextField label={t("common:E-MAIL")} margin="dense"
                            fullWidth={true}
                            variant="standard"
                            type='text'                            
                            value={currentUser?.email??'-'}
                            InputProps={{
                                readOnly:'true'
                            }}
                        />    

                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body2" component="h6" sx={{mb:1}}>{t("common:CHANGE PASSWORD")}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <ETextField label={t("common:CURRENT PASSWORD")} margin="dense"
                            fullWidth={true}
                            variant="filled"
                            type={showPass1 ? 'text' : 'password'}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPass1(p => !p)}
                                        >
                                            {showPass1 ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            error={errorValidator?.password ? true : false}
                            disabled={false}
                            value={changePassword?.password}
                            onChange={({ target: { value } }) => setChangePassword({...changePassword, password: value })}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <ETextField label={t("common:NEW PASSWORD")} margin="dense"
                            fullWidth={true}
                            variant="filled"
                            type={showPass2 ? 'text' : 'password'}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPass2(p => !p)}
                                        >
                                            {showPass2 ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            error={errorValidator?.newPassword ? true : false}
                            disabled={false}
                            // onBlur={() => {
                            //     if (confirmNewPassword) setError(newPassword !== confirmNewPassword)
                            // }}
                            value={changePassword?.newPassword}
                            onChange={({ target: { value } }) => setChangePassword({...changePassword, newPassword: value })}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <ETextField label={t("common:CONFIRM NEW PASSWORD")} margin="dense"
                            fullWidth={true}
                            variant="filled"
                            type={showPass3 ? 'text' : 'password'}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPass3(p => !p)}
                                        >
                                            {showPass3 ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            error={errorValidator?.confirmNewPassword ? true : false}
                            disabled={false}
                            value={changePassword?.confirmNewPassword}
                            onChange={({ target: { value } }) => setChangePassword({...changePassword, confirmNewPassword: value })}
                        />
                    </Grid>
                </Grid>
            </Box>

            <ConfirmActionModal
                btnText={"Yes"}
                actionModal={actionModal}
                setActionModal={setActionModal}
                actionModalTitle={t("common:RESET PASSWORD")}
                actionModalMessage={t("common:ARE YOU SURE YOU WANT TO RESET PASSWORD? THE ACTION IS NOT REVERSIBLE!")}
            />

        </>
    )
}