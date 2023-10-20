import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";


//Components
import { Box, Grid, Typography } from '@mui/material';
import StyledButton from "new_styled_components/Button/Button.styled";

//Services
import AuthService from "services/auth.service";

//Icons
import { ReactComponent as AttachmentIcon } from 'icons/icons_32/Attachment_2_32.svg';

import { new_theme } from "NewMuiTheme";




export default function Cookies() {
    const { t } = useTranslation(['translation']);
    var user = AuthService.getCurrentUser()
    const [cookiesAccepted, setCookiesAccepted] = useState(localStorage.getItem("cookies_accepted"));
    const location = useLocation(); 

    let newDesignStyles = {
        background: `${new_theme.palette.primary.PinkPurple} !important`, 
        border: 'none !important', 
        '&:hover': {background: `${new_theme.palette.secondary.Turquoise} !important`},
        '&:disabled': {
          backgroundColor: `${new_theme.palette.newSupplementary.NSupGrey} !important`,
        }
    }

    var isNewDesign = location.pathname.includes('braincore/test')


    if (user || cookiesAccepted) return <></>
    else return (<>
        <Grid container sx={{ position: 'fixed', alignItems: 'flex-end', height: '100%', width: '100%', background: new_theme.palette.shades.black40, zIndex: 1000, }}>
            <Grid item container sx={{ p: '24px', background: 'white', width: '100%', flexDirection: 'column', alignItems: 'center' }} >
                <Typography variant="h3" sx={{mb: '16px', color: 'black', fontSize: { xs: '18px', md: '30px' }, fontWeight: 700 }}>
                    {t("COOKIES_HEADER")}
                </Typography>
                <Typography variant="h3"  sx={{ mb: '24px', color: 'black', fontSize: '16px', fontWeight: 400 }}>
                    {t("COOKIES_TEXT")}
                </Typography>
                <StyledButton
                    sx={{ width: { xs: '100%', md: '' }, ...(isNewDesign ? newDesignStyles : {})}} eSize="large" eVariant="primary" onClick={
                    () => {
                        localStorage.setItem("cookies_accepted", true);
                        setCookiesAccepted(true)
                    }}>
                    {t("OK")}
                </StyledButton>
            </Grid>
        </Grid>
    </>
    );
}




