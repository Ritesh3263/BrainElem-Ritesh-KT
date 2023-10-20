// Component for email form after taking BrainCore test

import React, { useState, useEffect } from "react";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import { useTranslation } from "react-i18next";


//Components
import FormControlLabel from '@mui/material/FormControlLabel';
import { Grid, Typography } from '@mui/material';
import StyledButton from "new_styled_components/Button/Button.styled";
import { ECheckbox } from "styled_components";
import ETextField from "styled_components/TextField";

//Services
import ValidatorsService from "services/validators.service";
import CommonService from "services/common.service"

import { new_theme } from "NewMuiTheme";

export default function ProvideEmailPage({ contentModelRef, emailRef, emailFromUrlParams, agreedForMarketingRef, classes }) {
    const { t } = useTranslation(['translation', 'braincoreTest']);
    const [email, setEmail] = useState(emailFromUrlParams??'');
    const [emailValid, setEmailValid] = useState(true);
    const [marketingAccepted, setMarketingAccepted] = useState(false);
    const [policyAccepted, setPolicyAccepted] = useState(false);
    const { F_showToastMessage } = useMainContext();
    
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type')

    useEffect(() => {

    }, [])

    return (<Grid spacing="24px" container sx={{ maxWidth: '820px', justifyContent: 'center', alignContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
        <Grid item>
            <img style={{}} src='/img/brand/Head_1x.svg' />
        </Grid>
        <Grid item>
            <Typography variant="h3" sx={{ color: new_theme.palette.primary.MedPurple, fontSize: '30px', fontWeight: 700, textAlign: "center" }}>
                {t("braincoreTest:Great job!")}
            </Typography>
        </Grid>
        <Grid item>
            <Typography sx={{ fontFamily: 'Nunito', color: new_theme.palette.newSupplementary.NSupText, fontSize: '16x', textAlign: "center" }}>
                {emailFromUrlParams ? t("braincoreTest:Click here to send your answers") : t("braincoreTest:Please provide your email")}
            </Typography>
        </Grid>



        {!emailFromUrlParams && <Grid item container sx={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <Grid item sx={{ width: { xs: '100%', md: '330px' } }}>
                <ETextField label={t("braincoreTest:E-mail")}
                    className={classes.newTextField}
                    sx={{ width: { xs: '100%', md: '330px' } }}
                    disabled={emailFromUrlParams?true:false}
                    onChange={(e) => {
                        let isValid = ValidatorsService.isValidEmailAddress(e.target.value)
                        setEmailValid(isValid)
                        setEmail(e.target.value)
                        emailRef.current = e.target.value
                    }}
                    error={!emailValid}
                    
                    value={email}
                />
            </Grid>
        </Grid>}
        {!emailFromUrlParams && <Grid item container sx={{flexDirection: 'column', alignContent: 'center'}}>
            <FormControlLabel
                sx={{ mb: '8px', alignItems: 'flex-start' }}
                label={<Typography sx={{ fontFamily: 'Roboto', color: new_theme.palette.newSupplementary.NSupText, fontSize: '12px !important' }}>
                    {t("braincoreTest:MARKETING_TEXT")}
                </Typography>}
                control={<ECheckbox
                    sx={{marginTop: -1}}
                    className={classes.newCheckbox}
                    checked={marketingAccepted}
                    onChange={() => { 
                        agreedForMarketingRef.current = !marketingAccepted 
                        setMarketingAccepted(!marketingAccepted) }}
                ></ECheckbox>}
            />
            <FormControlLabel
                sx={{ alignItems: 'flex-start' }}
                label={<Typography sx={{ fontFamily: 'Roboto', color: new_theme.palette.newSupplementary.NSupText, fontSize: '12px !important' }}>
                    {t("braincoreTest:PRIVACY_POLICY_TEXT")+" "}<a target="_blank" style={{ color: new_theme.palette.primary.PinkPurple  }} href="https://brainelem.com/reglement-general-sur-la-protection-des-donnees/">{t("braincoreTest:PRIVACY_POLICY_LINK")}</a>{". *"}
                </Typography>}
                control={<ECheckbox
                    sx={{marginTop: -1}}
                    className={classes.newCheckbox}
                    required
                    checked={policyAccepted}
                    onChange={() => { setPolicyAccepted(!policyAccepted) }}
                ></ECheckbox>}
            />
            <Grid container sx={{justifyContent: 'center'}}>
            <Typography sx={{fontFamily: 'Roboto', color: new_theme.palette.newSupplementary.NSupText, fontSize: '12px !important' }}>
                    <a target="_blank" style={{ color: new_theme.palette.primary.PinkPurple  }} href="https://brainelem.com/conditions-generales-dutilisation-du-site-braincore-app/">{t("braincoreTest:Terms and Conditions")}</a>
            </Typography>
            </Grid>
        </Grid>}
        <Grid item container sx={{ justifyContent: 'center' }}>
            <StyledButton disabled={!emailFromUrlParams && !policyAccepted} className={classes.newButtonPrimary} sx={{ width: { xs: '100%', md: '' } }} eSize="large" eVariant="primary" onClick={
                () => {
                    //Email invalid or not provided
                    if (!email || !emailValid) {
                        setEmailValid(false)
                        return F_showToastMessage(t("braincoreTest:Please provide valid email address"), 'error')
                    }
                    else contentModelRef.current.doComplete()
                }}>
                {t("braincoreTest:Send")}
            </StyledButton>
        </Grid>
    </Grid >
    );
}




