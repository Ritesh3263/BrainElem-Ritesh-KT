// Component for thank you page after taking BrainCore test

import React, { useState, useEffect } from "react";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import { useTranslation } from "react-i18next";


//Components
import { Box, Grid, Typography } from '@mui/material';
import ESvgIcon from "new_styled_components/SvgIcon";

//Icons
import { ReactComponent as AttachmentIcon } from 'icons/icons_32/Attachment_2_32.svg';

import { new_theme } from "NewMuiTheme";


function Link({ text, url }) {
    return <Grid onClick={() => { window.open(url, '_blank').focus() }} item container spacing='16px' sx={{ width: 'fit-content', cursor: 'pointer' }}>
        <Grid item>
            <ESvgIcon sx={{ width: '32px', height: '32px' }} color={new_theme.palette.primary.PinkPurple} viewBox="0 0 32 32" component={AttachmentIcon} />
        </Grid>
        <Grid item>
            <Typography sx={{ fontFamily: 'Nunito', color: `${new_theme.palette.primary.PinkPurple}`, fontSize: '16x', textAlign: "center" }}>
                {text}
            </Typography>
        </Grid>
    </Grid>

}

export default function ThankYouPage({ }) {
    const { t } = useTranslation(['translation', 'braincoreTest']);
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type')

    return (<>
        {<Box sx={{ width: '100%', height: '80px', padding: { xs: '16px 0px 0px 16px', sm: '16px 0px 0px 24px' }, background: new_theme.palette.neutrals.white }}>
            <img style={{ height: '40px' }} src='/img/brand/BrainCore_Solutions_Logo.svg' />
        </Box>}
        <Grid container sx={{ height: '100%', padding: {xs: '16px', lg: '24px'}, justifyContent: 'center', alignContent: 'center', borderRadius: '8px', boxShadow: `0px 1px 24px -1px ${new_theme.palette.shades.back001}` }}>
            <Grid item container sx={{ height: '100%', maxWidth: '820px', background: 'white', justifyContent: 'center', alignContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                <Grid item sx={{mb: '24px'}}>
                    <img style={{ maxWidth: '100%' }} src='/img/brand/Head_3x.svg' />
                </Grid>
                <Grid item sx={{mb: '24px'}}>
                    <Typography variant="h3" sx={{ color: new_theme.palette.primary.MedPurple, fontSize: '30px', fontWeight: 700, textAlign: "center" }}>
                        {t("braincoreTest:Thank you!")}
                    </Typography>
                </Grid>
                <Grid item sx={{ maxWidth: '335px', mb: '24px' }}>
                    <Typography sx={{ fontFamily: 'Nunito', color: new_theme.palette.newSupplementary.NSupText, fontSize: '16x', textAlign: "center" }}>
                        {type=='pedagogy' ? t("braincoreTest:THANK_YOU_MESSAGE_EDU") : t("braincoreTest:THANK_YOU_MESSAGE_PRO")}
                    </Typography>
                </Grid>



                {type!='pedagogy' && <Grid item container spacing="24px" sx={{ width: 'fit-content', flexDirection: 'column', alignItems: 'center', alignItems: 'flex-start' }}>

                    <Link text={t("braincoreTest:Website")} url="https://brainelem.com/"></Link>
                    <Link text={t("braincoreTest:Linkedin")} url="https://www.linkedin.com/company/brainelem"></Link>

                </Grid>}
            </Grid >
        </Grid>
    </>
    );
}




