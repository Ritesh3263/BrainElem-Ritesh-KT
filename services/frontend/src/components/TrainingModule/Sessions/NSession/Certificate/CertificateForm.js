import React from "react";
import { ThemeProvider, Typography, Grid, Paper } from "@mui/material";
import { ListItemIcon, ListItemSecondaryAction } from "@material-ui/core";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField"
import { useTranslation } from "react-i18next";
import Chip from "@material-ui/core/Chip";
import { KeyboardDatePicker } from "@material-ui/pickers";
import TodayIcon from "@mui/icons-material/Today";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { now } from "moment";
import { IconButton } from "@mui/material";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import { new_theme } from "NewMuiTheme";
import "./Certificate.scss";

export default function CertificateForm({ currentCertificate = {} }) {
    const { t } = useTranslation();
    if (Object.keys(currentCertificate).length === 0) return <Typography variant="h5" component="h2" className="text-left" style={{ color: new_theme.palette.secondary.DarkPurple }}>
    </Typography>

    const competenceBlocks = currentCertificate?.assignedCompetenceBlocks ? currentCertificate?.assignedCompetenceBlocks.map((item, index) => (
        <Paper elevation={10} className="my-2 p-0" key={item._id} id={index} style={{ borderRadius: '8px' }}>
            <ListItem dense="true">
                <ListItemIcon>
                    <Avatar style={{ width: "25px", height: "25px", backgroundColor: new_theme.palette.secondary.DarkPurple }}>{index + 1}</Avatar>
                </ListItemIcon>
                <ListItemText
                    className="mr-5"
                    primary={item?.title}
                />
                <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="preview" onClick={() => { window.open(`/certifications/competenceBlocks`, '_blank') }}>
                        <VisibilityIcon style={{ color: new_theme.palette.secondary.DarkPurple }} />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
            {item.competences.map((item, index) => (
                <ListItem dense="true">
                    {/* <ListItemIcon>
                            </ListItemIcon> */}
                    <ListItemText
                        className="mr-5"
                        primary={"- " + item?.title}
                    />
                </ListItem>
            ))}
        </Paper>
    )) : [];

    const externalCompetences = currentCertificate?.externalCompetences ? currentCertificate?.externalCompetences.map((item, index) => (
        <Paper elevation={10} className="my-2 p-0" key={item._id} id={index} style={{ borderRadius: '8px' }}>
            <ListItem dense="true">
                <ListItemIcon>
                    <Avatar style={{ fontSize: "12px", width: "18px", height: "18px", backgroundColor: new_theme.palette.secondary.DarkPurple }}>{index + 1}</Avatar>
                </ListItemIcon>
                <ListItemText
                    className="mr-5"
                    primary={item?.title}
                />
                <ListItemSecondaryAction>
                    {/* <IconButton edge="end" aria-label="preview" onClick={()=>{window.open(`/certifications/certificates`, '_blank')}}>
                        <VisibilityIcon style={{color: new_theme.palette.secondary.DarkPurple}}/>
                    </IconButton> */}
                </ListItemSecondaryAction>
            </ListItem>
        </Paper>
    )) : [];

    return (
        <ThemeProvider theme={new_theme}>
            <Grid container>
                <Grid item xs={12} className="d-flex mt-2">
                    <Typography variant="h3" component="h3" sx={{ color: new_theme.palette.newSupplementary.NSupText, display: 'flex', alignItems: 'center' }}>
                        {currentCertificate?.name} &nbsp;
                        <Typography variant="body4" component="span" sx={{ color: new_theme.palette.newSupplementary.NSupText }}>{"(" + currentCertificate?.EQFLevel || "-" + ")"}</Typography>
                    </Typography>
                </Grid>

                <Grid item xs={12} className='mt-2'>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            <TextField label={t("Description")} margin="normal"
                                InputProps={{
                                    readOnly: true,
                                }}
                                name='description'
                                fullWidth
                                multiline={true}
                                variant='filled'
                                required={false}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={currentCertificate?.description}
                                onInput={(e) => { }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} className='mt-2'>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <KeyboardDatePicker
                                className="datePickerH"
                                InputProps={{
                                    readOnly: true,
                                }}
                                keyboardIcon={null}
                                rightArrowIcon={null}
                                readOnly={true}
                                name='expires'
                                fullWidth
                                id="date-picker-dialog"
                                label={t("Expiration date")}
                                format="DD.MM.yyyy"
                                minDate={new Date(now()).toISOString().split("T")[0]}
                                maxDate={new Date(2099, 12, 24, 24, 0).toISOString()}
                                minDateMessage={"It is a past date"}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputVariant='filled'
                                style={{ width: '100%', marginTop: '8px', height: '70px' }}
                                value={currentCertificate?.expires ?? (new Date(2099, 12, 24, 24, 0).toISOString())}
                                KeyboardButtonProps={{
                                    "aria-label": "change date",
                                }}
                                onChange={(date) => { }}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField label={t("Certificate template")} margin="normal"
                                InputProps={{
                                    readOnly: true,
                                    startAdornment: (
                                        <IconButton disabled={true}>
                                            <VisibilityIcon />
                                        </IconButton>
                                    )
                                }}
                                name='certificateTemplate'
                                sx={{ mt: 1 }}
                                fullWidth
                                multiline={true}
                                variant='filled'
                                required={false}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={currentCertificate?.template ? currentCertificate.template : '-'}
                                onInput={(e) => { }}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField label={t("Assigned materials")} margin="normal"
                                InputProps={{
                                    readOnly: true,
                                    startAdornment: (
                                        <IconButton disabled={true}>
                                            <VisibilityIcon />
                                        </IconButton>
                                    )
                                }}
                                name='assignedMaterials'
                                fullWidth
                                multiline={true}
                                sx={{ mt: 1 }}
                                variant='filled'
                                required={false}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={currentCertificate?.assignedMaterials ? currentCertificate.assignedMaterials : '-'}
                                onInput={(e) => { }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} className='mt-4'>
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography variant="h3" component="h3" sx={{ color: new_theme.palette.newSupplementary.NSupText, textAlign: 'left' }}>{t("Assigned Blocks & Skills")}</Typography>
                            <hr style={{ marginTop: '8px', marginBottom: '0px' }} />
                        </Grid>
                        <Grid item xs={6} className="mt-3 pr-2">
                            <Typography variant="body4" component="h6">{t("Assigned competence blocks")}</Typography>
                            <List>
                                {competenceBlocks}
                            </List>
                        </Grid>
                        <Grid item xs={6} className="mt-3 pl-2">
                            <Typography variant="body4" component="h6">{t("Extra competences")}</Typography>
                            <List>
                                {externalCompetences}
                            </List>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </ThemeProvider>
    )
}