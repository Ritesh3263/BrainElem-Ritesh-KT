import React from "react";
import { useTranslation } from "react-i18next";
import { ThemeProvider, Box, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from "@mui/material";
import StyledButton from 'new_styled_components/Button/Button.styled';
import { new_theme } from "NewMuiTheme";


export default function AssigmentManageModal({ actionModal, setActionModal, actionModalTitle, actionModalMessage, btnText }) {
    const { t } = useTranslation();
    return (
        <Dialog
            PaperProps={{
                sx: {
                    minWidth: { xs: '90%', sm: '400px', md: '400px', lg: '500px', xl: '500px' },
                    borderRadius: '12px',
                    padding: '26px',
                    overflow: 'hidden',
                    backdropFilter: "blur(20px)"
                }
            }}
            open={actionModal.isOpen}
            onClose={() => setActionModal(p => ({ ...p, isOpen: false, returnedValue: false }))}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <Typography variant="result_title" component="h3" sx={{ color: new_theme.palette.primary.MedPurple, mb: 1, textAlign: 'center' }}> {actionModalTitle || "-"}
            </Typography>
            <Typography variant="subtitle0" component="p" sx={{ mb: 2, color: new_theme.palette.newSupplementary.NSupText, textAlign: 'center' }}>
                {actionModalMessage || "-"}
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px'}}>
                <StyledButton eVariant="secondary" eSize="small" onClick={() => setActionModal(p => ({ ...p, isOpen: false, returnedValue: false }))}>{t("No")}</StyledButton>
                <StyledButton eVariant="primary" eSize="small" onClick={() => setActionModal(p => ({ ...p, isOpen: false, returnedValue: true }))}>{t("Yes")}</StyledButton>
            </Box>
        </Dialog>
    )
}