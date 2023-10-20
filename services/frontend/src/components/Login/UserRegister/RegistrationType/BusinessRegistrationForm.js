import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { FormControl, Input, Box } from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiFilledInput-input': {
            //padding:"15px" ??????????????
        }
    },
}));

export default function BusinessRegistrationForm({ visiblePassword, setVisiblePassword, userFormData, setUserFormData, validators }) {
    const { t } = useTranslation(['login-welcome-registration', 'common']);
    const classes = useStyles();
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);


    return (
        <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
                <TextField margin="dense"
                    placeholder={`${t("common:NAME")}*`}
                    fullWidth={true}
                    variant="outlined"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        readOnly: false,
                    }}
                    value={userFormData.name || ""}
                    onChange={(e => { setUserFormData(p => ({ ...p, name: e.target.value })) })}
                    error={(!validators.isValidate) && validators.errorType.includes("NAME")}
                    helperText={((!validators.isValidate) && validators.errorType.includes("NAME")) && `${validators.errorMessage}`}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField margin="dense"
                    fullWidth={true}
                    placeholder={`${t("common:SURNAME")}*`}
                    variant="outlined"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        readOnly: false,
                    }}
                    value={userFormData.surname || ""}
                    onChange={(e => { setUserFormData(p => ({ ...p, surname: e.target.value })) })}
                    error={(!validators.isValidate) && validators.errorType.includes("SURNAME")}
                    helperText={((!validators.isValidate) && validators.errorType.includes("SURNAME")) && `${validators.errorMessage}`}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField margin="dense"
                    placeholder={`${t("login-welcome-registration:COMPANY NAME")}*`}
                    required={true}
                    fullWidth={true}
                    variant="outlined"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        readOnly: false,
                    }}
                    value={userFormData.companyName || ""}
                    onChange={(e => { setUserFormData(p => ({ ...p, companyName: e.target.value })) })}
                    error={(!validators.isValidate) && validators.errorType.includes("COMPANY_NAME")}
                    helperText={((!validators.isValidate) && validators.errorType.includes("COMPANY_NAME")) && `${validators.errorMessage}`}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField margin="dense"
                    disabled={false}
                    placeholder={`${t("login-welcome-registration:POSITION IN THE COMPANY")}*`}
                    fullWidth={true}
                    variant="outlined"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        readOnly: false,
                    }}
                    value={userFormData.ownerPosition || ""}
                    onChange={(e => { setUserFormData(p => ({ ...p, ownerPosition: e.target.value })) })}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField margin="dense"
                    fullWidth={true}
                    placeholder={`${t("common:USERNAME")}*`}
                    variant="outlined"
                    required={true}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        readOnly: false,
                    }}
                    value={userFormData.username || ""}
                    onChange={(e => { setUserFormData(p => ({ ...p, username: e.target.value })) })}
                    error={(!validators.isValidate) && validators.errorType.includes("USERNAME")}
                    helperText={((!validators.isValidate) && validators.errorType.includes("USERNAME")) && `${validators.errorMessage}`}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField margin="dense"
                    fullWidth={true}
                    placeholder={`${t("common:E-MAIL")}*`}
                    variant="outlined"
                    type="email"
                    required={true}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        readOnly: false,
                    }}
                    value={userFormData.email ? userFormData.email : ""}
                    onChange={(e => { setUserFormData(p => ({ ...p, email: e.target.value })) })}
                    error={(!validators.isValidate) && validators.errorType.includes("EMAIL")}
                    helperText={((!validators.isValidate) && validators.errorType.includes("EMAIL")) && `${validators.errorMessage}`}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField margin="dense"
                    type={visiblePassword ? 'text' : 'password'}
                    fullWidth={true}
                    placeholder={`${t("common:PASSWORD")}*`}
                    size="small"
                    required={true}
                    variant="outlined"
                    value={userFormData.password || ""}
                    onChange={(e => { setUserFormData(p => ({ ...p, password: e.target.value })) })}
                    InputLabelProps={{
                        shrink: true,
                        
                    }}
                    InputProps={{
                        endAdornment:
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => { setVisiblePassword(p => !p) }}
                            edge="end"
                          >
                            {visiblePassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>,
                    }}
                    error={(!validators.isValidate) && validators.errorType.includes("PASSWORD")}
                    helperText={(!validators.isValidate) && validators.errorType.includes("PASSWORD") && `${validators.errorMessage}`}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField margin="dense"
                    type={isConfirmPasswordVisible ? 'text' : 'password'}
                    fullWidth={true}
                    placeholder={`${t("common:CONFIRM PASSWORD")}`}
                    size="small"
                    required={true}
                    variant="outlined"
                    value={userFormData.confirmPassword || ""}
                    onChange={(e => { setUserFormData(p => ({ ...p, confirmPassword: e.target.value })) })}
                    InputLabelProps={{
                        shrink: true,
                        endAdornment:
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => { setIsConfirmPasswordVisible(p => !p) }}
                                edge="end"
                                >
                                {isConfirmPasswordVisible ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                    }}
                    // InputProps={{
                    //     endAdornment:
                    //         <IconButton
                    //             aria-label="toggle password visibility"
                    //             onClick={() => { setVisiblePassword(p => !p) }}
                    //             edge="end"
                    //         >
                    //             {visiblePassword ? <Visibility /> : <VisibilityOff />}
                    //         </IconButton>,
                    // }}
                    error={(!validators.isValidate) && validators.errorType.includes("CONFIRM_PASSWORD")}
                    helperText={((!validators.isValidate) && validators.errorType.includes("CONFIRM_PASSWORD")) && `${validators.errorMessage}`}
                />
            </Grid>
        </Grid>
    )
}