// Modal used to review requests for credits

import { useState } from 'react';
import { useTranslation } from "react-i18next";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import Confirm from "components/common/Hooks/Confirm";

// MUI v5
import { Typography, Grid, DialogContentText, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { TextField } from '@mui/material';



// Styled components
import StyledButton from 'new_styled_components/Button/Button.styled';

//Services
import CreditService from "services/credit.service";


// Theme
import { new_theme } from 'NewMuiTheme';


// Modal used to review requests for credits
export default function ModalReviewRequestCredits({ request, myCredits, open, onClose }) {
    const { t } = useTranslation(['common', 'sentinel-Admin-Credits']);
    const { F_showToastMessage, F_handleSetShowLoader, F_getLocalTime } = useMainContext();
    const { isConfirmed } = Confirm();
    return (
        <Dialog sx={{ '.MuiPaper-root': { p: 3 } }} open={open} onClose={onClose} maxWidth="xs" fullWidth={true} >
            <DialogTitle sx={{ p: 0, pb: 3 }}>
                <Typography variant="h3" component="div" sx={{ p: 0, textAlign: 'left', color: new_theme.palette.newSupplementary.NSupText }}>
                    {t("sentinel-Admin-Credits:REVIEW REQUEST")}

                </Typography>
            </DialogTitle>
            <DialogContent sx={{ pb: 0, px: 0 }}>
                <Grid container spacing={3}>


                    <Grid item xs={12}>
                        <TextField sx={{ width: '100%' }} InputProps={{ readOnly: true }} value={request?.user}></TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField sx={{ width: '100%' }} InputProps={{ readOnly: true }} value={F_getLocalTime(request?.createdAt, true)}></TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField sx={{ width: '100%' }} InputProps={{ readOnly: true }} value={request?.number}></TextField>
                    </Grid>
                </Grid>
                <DialogActions sx={{ px: 0, pt: 3, justifyContent: 'space-between' }}>
                    <StyledButton onClick={async () => {
                        let confirm = await isConfirmed(t("sentinel-Admin-Credits:DO YOU WANT TO CONFIRM THE REVIEW"));
                        if (!confirm) return onClose()
                        F_handleSetShowLoader(true)
                        CreditService.rejectRequestForCredits(request.id).then(
                            () => {
                                F_showToastMessage(t("sentinel-Admin-Credits:REQUEST REJECTED"), 'success')
                                F_handleSetShowLoader(false)
                                onClose()
                            },
                            (error) => {
                                F_showToastMessage(t("sentinel-Admin-Credits:COULD NOT REJECT REQUEST"), 'error')
                                onClose()
                                F_handleSetShowLoader(false)
                            }
                        )


                    }} eVariant="secondary" eSize='small' >
                        {t("common:REJECT")}
                    </StyledButton>
                    <StyledButton onClick={async () => {
                        let confirm = await isConfirmed(t("sentinel-Admin-Credits:DO YOU WANT TO CONFIRM THE REVIEW"));
                        if (!confirm) return onClose()
                        F_handleSetShowLoader(true)
                        CreditService.acceptRequestForCredits(request.id).then(
                            () => {
                                F_showToastMessage(t("sentinel-Admin-Credits:SUCCESSFULLY TRANSFERRED {{number}} CREDITS", { number: request.number }), 'success')
                                F_handleSetShowLoader(false)
                                onClose()
                            },
                            (error) => {
                                if (error?.response.data?.message == "NO_SUFFICIENT_CREDITS") F_showToastMessage(t("sentinel-Admin-Credits:NO SUFFICIENT CREDITS"), 'error')
                                else F_showToastMessage(t("sentinel-Admin-Credits:COULD NOT TRANSFER CREDITS"), 'error')
                                onClose()
                                F_handleSetShowLoader(false)
                            }
                        )


                    }} eVariant="primary" eSize='small' >
                        {t("common:ACCEPT")}
                    </StyledButton>
                </DialogActions>
            </DialogContent>
        </Dialog >
    );
}