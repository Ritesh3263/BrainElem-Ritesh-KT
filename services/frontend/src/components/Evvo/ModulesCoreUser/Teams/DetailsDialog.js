import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import Dialog from '@mui/material/Dialog';
import { Divider } from "@mui/material";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Typography from '@mui/material/Typography';
import StyledButton from 'new_styled_components/Button/Button.styled';
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { new_theme } from "NewMuiTheme";
import { ThemeProvider } from "@mui/material";
import "./teams.scss";
const DetailsDialog=(props)=> {
    const { onClose, open, dialogUserDetails } = props;
    const handleClose = () => {
        onClose();
    };
    const { t } = useTranslation();
    return <>
        <Dialog open={open} onClose={handleClose} className="userDetailsPopup"
            PaperProps={{
                sx: {
                    minWidth: { xs: '90%', sm: '90%', md: '90%', lg: '90%', xl: '1600px' },
                    borderRadius: '12px',
                    minHeight: '500px',
                    padding: '26px',
                }
            }}>
            <Grid container spacing={2}>
                {/* <Grid item xs={12} sx={{ mt: 3 }}>
                    <Typography variant="h1" component="h1">{dialogUserDetails?.username}</Typography>
                    <Divider className='heading_divider' variant="insert" />
                </Grid> */}
                <Grid item xs={12} sx={{ mt: 3 }}>
                    <Typography variant="h2" component="h2" style={{ color: new_theme.palette.newSupplementary.NSupText }}>{t("Account information")}</Typography>
                    <Divider variant="insert" sx={{ mb: 4, my: 2 }} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField label={t("Username")} margin="dense"
                        fullWidth={true}
                        name='username'
                        variant="filled"
                        value={dialogUserDetails?.username}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField label={t("Name of user")} margin="dense"
                        fullWidth={true}
                        variant="filled"
                        name='name'
                        value={dialogUserDetails?.name}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField label={t("Surname")} style={{ maxWidth: '400px' }} margin="dense"
                        fullWidth={true}
                        name='surname'
                        variant="filled"
                        value={dialogUserDetails?.surname}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField label={t("E-mail")} margin="dense"
                        fullWidth={true}
                        variant="filled"
                        name='email'
                        value={dialogUserDetails?.email}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KeyboardDatePicker
                        className="datePickerH"
                        inputVariant="filled"
                        id="date-picker-dialog"
                        label={t("Date of birth")}
                        format="DD.MM.yyyy"
                        style={{width: '100%', height: '65px'}}
                        value={dialogUserDetails?.details?.dateOfBirth ? new Date(dialogUserDetails?.details?.dateOfBirth).toISOString() : null}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth={true}
                        variant="filled"
                    >
                        <InputLabel id="demo-simple-select-label">{t("Status")}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            name={['settings', 'isActive']}
                            value={dialogUserDetails?.settings?.isActive ? 1 : 0}
                        >
                            <MenuItem value={1} className="text-success">{t("Active")}</MenuItem>
                            <MenuItem value={0} className="text-danger">{t("inActive")}</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth={true}
                        variant="filled"
                    >
                        <InputLabel id="demo-simple-select-label">{t("Select language")}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            name={['settings', 'language']}
                            value={dialogUserDetails?.settings?.language}
                        >
                            <MenuItem value={"en"}>English (Great Britain)</MenuItem>
                            <MenuItem value={"fr"}>Français (France)</MenuItem>
                            <MenuItem value={"pl"}>Polski (Polska)</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    {(dialogUserDetails?.settings?.role === "Trainee" || dialogUserDetails?.settings?.availableRoles.includes("Trainee")) &&
                        <FormControl style={{ maxWidth: '400px' }} fullWidth={true} margin="dense"
                            variant="filled"
                        >
                            <InputLabel id="select-student-label">{t("Trainee level")}</InputLabel>
                            <Select
                                labelId="select-student-label"
                                id="select-student"
                                name={['settings', 'level']}
                                value={dialogUserDetails?.settings?.level}
                            >

                            </Select>
                        </FormControl>}
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sx={{ mt: 3 }}>
                    <Typography variant="h2" component="h2" style={{ color: new_theme.palette.newSupplementary.NSupText }}>{t("Contact Details")}</Typography>
                    <Divider variant="insert" sx={{ mb: 4, my: 2 }} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField label={t("Build nr / flat")} margin="dense"
                        fullWidth={true}
                        variant="filled"
                        name={['details', 'buildNr']}
                        value={dialogUserDetails?.details?.buildNr}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField label={t("Street")} margin="dense"
                        fullWidth={true}
                        variant="filled"
                        name={['details', 'street']}
                        value={dialogUserDetails?.details?.street}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField label={t("City")} margin="dense"
                        fullWidth={true}
                        variant="filled"
                        name={['details', 'city']}
                        value={dialogUserDetails?.details?.city}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField label={t("Postcode")} margin="dense"
                        fullWidth={true}
                        variant="filled"
                        name={['details', 'postcode']}
                        value={dialogUserDetails?.details?.postcode}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField label={t("Country")} margin="dense"
                        fullWidth={true}
                        variant="filled"
                        name={['details', 'country']}
                        value={dialogUserDetails?.details?.country}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField label={t("Phone")} margin="dense"
                        fullWidth={true}
                        variant="filled"
                        name={['details', 'phone']}
                        value={dialogUserDetails?.details?.phone}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sx={{textAlign: 'right'}}>
                    <StyledButton eVariant="secondary" onClick={handleClose} sx={{mr:2, cursor: 'pointer'}}>{t("Close")}</StyledButton>
                </Grid>
            </Grid>
        </Dialog>
    </>
}

export default DetailsDialog;