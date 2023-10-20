import React, {lazy, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {ThemeProvider, Box, Grid, Typography, TextField} from "@mui/material";
import { ETextField } from "new_styled_components";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {EAccordion, EButton} from "styled_components";
import {KeyboardDatePicker} from "@material-ui/pickers";
import ModuleCoreService from "services/module-core.service";
import { TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from "@material-ui/lab";
import { FormControlLabel, Switch, Button, Divider } from "@mui/material";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import Periods from "components/Period/Periods";
import { new_theme } from "NewMuiTheme";
import './profile.scss'




const UserAssignedRoles = lazy(() => import("./AssignedRoles/UserAssignedRoles"));

export default function PersonalInformation({user, setUser}){

    const [showRoleDialog, setShowRoleDialog] = useState(false)
    const {t} = useTranslation(['common']);

    const { F_showToastMessage, F_getHelper } = useMainContext();
    const {user:u,manageScopeIds} = F_getHelper();
    const [moduleType, setModuleType] = useState(null);
    const [MSAcademicYears, setMSAcademicYears] = useState([]);
    const [showPeriodDialog, setShowPeriodDialog] = useState(false);
    const [currentYear, setCurrentYear] = useState(null);

    useEffect(() => {
        if(!manageScopeIds.isTrainingCenter){
            ModuleCoreService.readModuleCore(manageScopeIds.moduleId).then(res=>{
                if(res.data.academicYears){
                    setMSAcademicYears(res.data.academicYears)
                    setCurrentYear(res.data.academicYears[0]._id)
                }
            }).catch(error=>console.error(error))
        }
        setModuleType(()=>{
            let module = u.modules.find(m=>m._id === u.moduleId)
            return module?.moduleType
        })
    }, []);



    return(
        <ThemeProvider theme={new_theme}>
            <Grid container>
                {/* <Grid item xs={12} sm={6} md={2}>
                    <Box sx={{display: 'flex', alignItems: 'center', width:'max-content'}}>
                    <Typography variant="body2" component="h6" sx={{mr:2, textWrap:'nowrap'}}>{t("common:SELECT LANGUAGE")}</Typography>
                    <FormControl margin="dense" fullWidth={true}
                                        variant="outlined">
                        <InputLabel id="demo-simple-select-label">{t("Select")}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            label="select"
                            id="demo-simple-select"
                            size="small"
                            value={user.settings.language}
                            // renderValue={p=> p.curriculumName}
                            //input={<Input/>}
                            onChange={({target:{value}}) => {
                                let selectedLanguage = "en_EN"
                                switch(value){
                                    case "en":
                                        selectedLanguage = "en_GB"; break;
                                    case "fr":
                                        selectedLanguage = "fr_FR"; break;
                                    case "pl":
                                        selectedLanguage = "pl_PL"; break;
                                    default: selectedLanguage = "en_GB"; break;
                                }
                                setUser(p=>({...p,settings: {...p.settings, language: value, origin: selectedLanguage}}))
                            }}
                        >
                            <MenuItem value={"en"}>English (Great Britain)</MenuItem>
                            <MenuItem value={"fr"}>Français (France)</MenuItem>
                            <MenuItem value={"pl"}>Polski (Polska)</MenuItem>
                        </Select>
                    </FormControl>
                    </Box>
                </Grid> */}

                {/* <Grid item xs={12} sx={{ mt: 3 }}>
                    <Typography variant="h3" component="h2" className="text-left text-justify" sx={{color:new_theme.palette.newSupplementary.NSupText}}>
                        {t("Personal information")}
                    </Typography>
                    <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Divider variant="insert" sx={{ mb: 4, my: 2 }} />
                    </Grid>

                </Grid> */}
                <Grid item xs={12} md={7} sx={{mb:2}}>
                    <Typography variant="body2" component="h6" sx={{ mb: 1 }}>{t("common:GENERAL INFORMATION")}</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <ETextField label={t("common:NAME")}
                                fullWidth={true}
                                variant="filled"
                                disabled={moduleType === "SCHOOL" && u.role === "Trainee"}
                                value={user.name}
                                onInput={({ target: { value } }) => {
                                    setUser(p => ({ ...p, name: value }))
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <ETextField label={t("common:SURNAME")}
                                fullWidth={true}
                                disabled={moduleType === "SCHOOL" && u.role === "Trainee"}
                                variant="filled"
                                value={user.surname}
                                onInput={({ target: { value } }) => {
                                    setUser(p => ({ ...p, surname: value }))
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <ETextField label={t("common:ABOUT ME")}
                                fullWidth={true}
                                variant="filled"
                                multiline
                                rowsMax={6}
                                value={user.details.aboutMe}
                                onInput={({ target: { value } }) => {
                                    setUser(p => ({ ...p, details: { ...p.details, aboutMe: value } }))
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                {/* <Grid item xs={12} className='mt-4'>
                    <EAccordion
                        className='colapsible-head'
                        headerName={t("Assigned roles")}
                        //headerBackground
                        defaultExpanded={false}
                        typoVariant='body2'
                    >
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <UserAssignedRoles user={user} showRoleDialog={showRoleDialog} setShowRoleDialog={setShowRoleDialog}/>
                        </Grid>
                        <Grid item xs={12} md={3} alignSelf='center'>
                            
                            <StyledButton eSize='large' eVariant='primary'
                                    onClick={()=>{setShowRoleDialog(true)}}
                            >{t('Switch role')}</StyledButton> */}
                        

                            {/* <FormControl margin="dense" variant="filled" fullWidth={true}>
                                <InputLabel id="demo-simple-select-label">{t("Switch Role")}</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    defaultValue={1}
                                >
                                    
                                    <MenuItem value={1}>Training Manager</MenuItem>
                                    <MenuItem>Module Manager</MenuItem>
                                    <MenuItem>Trainee</MenuItem>
                                </Select>
                            </FormControl> */}


                        {/* </Grid>
                    </Grid>
                    </EAccordion>
                </Grid> */}
                <Grid className="mb-m-0" item xs={12} md={7} sx={{mb:2}}>
                    <Typography variant="body2" component="h6" sx={{ mb: 1 }}>{t("common:CONTACT INFORMATION")}</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <ETextField label={t("common:PHONE")}
                                fullWidth={true}
                                variant="filled"
                                value={user.details.phone}
                                onInput={({ target: { value } }) => {
                                    setUser(p => ({ ...p, details: { ...p.details, phone: value } }))
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <ETextField label={t("common:E-MAIL")}
                                fullWidth={true}
                                variant="filled"
                                value={user.email}
                                onInput={({ target: { value } }) => {
                                    setUser(p => ({ ...p, email: value || undefined }))
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <ETextField label={t("common:STREET")}
                                fullWidth={true}
                                variant="filled"
                                value={user.details.street}
                                onInput={({ target: { value } }) => {
                                    setUser(p => ({ ...p, details: { ...p.details, street: value } }))
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <ETextField label={t("common:POST CODE")}
                                fullWidth={true}
                                variant="filled"
                                value={user.details.postcode}
                                onInput={({ target: { value } }) => {
                                    setUser(p => ({ ...p, details: { ...p.details, postcode: value } }))
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <ETextField label={t("common:CITY")}
                                fullWidth={true}
                                variant="filled"
                                value={user.details.city}
                                onInput={({ target: { value } }) => {
                                    setUser(p => ({ ...p, details: { ...p.details, city: value } }))
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <ETextField label={t("common:COUNTRY")}
                                fullWidth={true}
                                variant="filled"
                                value={user.details.country}
                                onInput={({ target: { value } }) => {
                                    setUser(p => ({ ...p, details: { ...p.details, country: value } }))
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <KeyboardDatePicker
                                className="date-picker-height"
                                inputVariant="filled"
                                fullWidth={true}
                                KeyboardButtonProps={{
                                    "aria-label": "change date",
                                }}
                                id="date-picker-dialog"
                                label={t("common:DATE OF BIRTH")}
                                format="DD.MM.yyyy"
                                value={user.details.dateOfBirth}
                                // KeyboardButtonProps={{
                                //     'aria-label': 'change date',
                                // }}
                                onChange={(date) => {
                                    if (date && date._isValid) {
                                        setUser(p => ({ ...p, details: { ...p.details, dateOfBirth: new Date(date).toISOString() } }))
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                {/* <Grid item xs={12} md={7} sx={{mb: 2}}>
                    <Typography variant="body2" component="h6" sx={{ mb: 1 }}>{t("common:SOCIAL MEDIA")}</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                                <div className="icon-box">
                                    <img src="/img/icons/FacebookVector.svg"></img>
                                </div>
                                <TextField label="Facebook"
                                    fullWidth={true}
                                    variant="filled"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={user.details.socialMedia?.facebook}

                                    onInput={({ target: { value } }) => {
                                        setUser(p => ({ ...p, details: { ...p.details, socialMedia: { ...p.details.socialMedia, facebook: value } } }))
                                    }}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                                <div className="icon-box">
                                        <img src="/img/icons/YoutubeVector.svg"></img>
                                    </div>

                                    <TextField label="YouTube"
                                        fullWidth={true}
                                        variant="filled"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={user.details.socialMedia?.youtube}

                                        onInput={({ target: { value } }) => {
                                            setUser(p => ({ ...p, details: { ...p.details, socialMedia: { ...p.details.socialMedia, youtube: value } } }))
                                        }}
                                    />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div className="icon-box">
                                    <img src="/img/icons/InstaVector.svg"></img>
                                </div>

                                <TextField label="Instagram"
                                    fullWidth={true}
                                    variant="filled"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={user.details.socialMedia?.instagram}

                                    onInput={({ target: { value } }) => {
                                        setUser(p => ({ ...p, details: { ...p.details, socialMedia: { ...p.details.socialMedia, instagram: value } } }))
                                    }}
                                />
                            </Box>

                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div className="icon-box">
                                    <img src="/img/icons/LinkedinVector.svg"></img>
                                </div>

                                <TextField label="LinkedIn"
                                    fullWidth={true}
                                    variant="filled"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={user.details.socialMedia?.linkedin}

                                    onInput={({ target: { value } }) => {
                                        setUser(p => ({ ...p, details: { ...p.details, socialMedia: { ...p.details.socialMedia, linkedin: value } } }))
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Grid> */}
                {/* <Grid item xs={12} className='mt-4'>
                    <EAccordion
                        className='colapsible-head'
                        headerName={t("Select period")}
                        //headerBackground
                        defaultExpanded={false}
                        typoVariant='body2'
                    >
                        <Grid container>
                            <Grid item xs={12} md={6}>
                                <StyledButton eVariant="primary" eSize="medium" onClick={()=>{setShowPeriodDialog(true)} }>
                                    {t("Select Period")}
                                </StyledButton>
                            </Grid>
                        </Grid>
                    </EAccordion>
                </Grid> */}
                <Periods showPeriodDialog={showPeriodDialog} setShowPeriodDialog={setShowPeriodDialog}/>
            </Grid>
        </ThemeProvider>
    )
}