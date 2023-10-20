// import * as React from 'react';
import { Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import Confirm from './Hooks/Confirm';
import { useTranslation } from "react-i18next";
import { Box } from '@mui/system';
import StyledButton from 'new_styled_components/Button/Button.styled';

import { new_theme } from 'NewMuiTheme';

export default function ConfirmModal() {
  const { t } = useTranslation(['translation', 'common']);

  const {
    prompt = "",
    isOpen = true,
    proceed,
    cancel,
    option = {}
  } = Confirm();

  return (
    <Dialog sx={{ '.MuiPaper-root': { p: 3 } }} open={isOpen} maxWidth="xs" fullWidth={true} >
      <DialogTitle sx={{ p: 0, pb: 3 }}>
        <Typography variant="h3" component="div" sx={{ p: 0, textAlign: 'center', color: new_theme.palette.newSupplementary.NSupText }} >
          {t(option.promptHeader || "common:CONFIRM")}
        </Typography>
      </DialogTitle >
      <DialogContent sx={{ p: 0 }}>
        <DialogContentText sx={{ py: 1, fontSize: '16px', textAlign: 'center' }}>
          {prompt}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 0, pb: 0, pt: 3, justifyContent: 'space-between' }}>
        <StyledButton onClick={cancel} eVariant="secondary" eSize='medium' >
          {t(option.cancelText || "common:NO")}
        </StyledButton>
        <StyledButton onClick={proceed} eVariant="primary" eSize='medium' >
          {t(option.proceedText || "common:YES")}
        </StyledButton>
      </DialogActions>
    </Dialog>
  );
}