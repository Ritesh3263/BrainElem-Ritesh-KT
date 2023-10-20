import React, { useState, useEffect, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import StyledButton from "new_styled_components/Button/Button.styled";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import { new_theme } from "NewMuiTheme";


import ContentService from "services/content.service";

import './BrainCoreTestSelectionModal.scss'

//openChoice - when set to true window is open 
// setOpenChoice - used to controll the visiblility window
// forMe - boolean - indicates that user will select test for himself - by default true
// callback - function to call after selection is done - 
//            it's called with `testType` argument which may be set to `pedagogy` or `adult`
// onClose - overide default onClose
export default function TestSelection({openChoice, setOpenChoice, forMe=true,  callback, onClose}) {
    const { t } = useTranslation(['mySpace-myResults', 'common']);
    const navigate = useNavigate();

    return (
        <Dialog className="openChoice_dialog" open={openChoice} onClose={() => {if (!onClose) setOpenChoice(false); else onClose()}}>
            <Box sx={{ display: 'flex', gap: '20px', textAlign: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
                <div style={{ border: `1px solid ${new_theme.palette.newSecondary.NSDisabled}`, borderRadius: '6px', padding: '12px 16px', maxWidth:'50%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Typography variant="body1" component="h3" sx={{ mb: 1, color: new_theme.palette.newSupplementary.NSupText }}>
                        {forMe ? t("mySpace-myResults:EDUCATIONAL VERSION TEXT FOR ME") : t("mySpace-myResults:EDUCATIONAL VERSION TEXT FOR OTHERS")}
                    </Typography>
                    <StyledButton eVariant="primary" eSize="large" className="btn_pedagogy" onClick={() => {
                        setOpenChoice(false);
                        if (!callback) navigate(`/content/display/${ContentService.getBraincoreTestId('pedagogy')}`)
                        else callback('pedagogy')
                    }}>{t("mySpace-myResults:EDUCATIONAL BUTTON")}</StyledButton>
                </div>
                <div style={{ border: `1px solid ${new_theme.palette.newSecondary.NSDisabled}`, borderRadius: '6px', padding: '12px 16px', maxWidth:'50%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Typography variant="body1" component="h3" sx={{ mb: 1, color: new_theme.palette.newSupplementary.NSupText }}>
                        {forMe ? t("mySpace-myResults:PROFESSIONAL VERSION TEXT FOR ME") : t("mySpace-myResults:PROFESSIONAL VERSION TEXT FOR OTHERS")}
                        </Typography>
                    <StyledButton eVariant="primary" eSize="large" onClick={() => {
                        setOpenChoice(false);
                        if (!callback) navigate(`/content/display/${ContentService.getBraincoreTestId('adult')}`)
                        else callback('adult')
                    }}>{t("mySpace-myResults:PROFESSIONAL BUTTON")}</StyledButton>
                </div>
            </Box>
        </Dialog>
    )
}