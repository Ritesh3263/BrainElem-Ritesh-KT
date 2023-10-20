import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';

import EButton from 'styled_components/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { useTranslation } from "react-i18next";

const useStyles = makeStyles(theme => ({
  dialogPaper: {
    background: theme.palette.neutrals.white,
    borderRadius: 8,
  },
  dialogActionsRoot: {
    justifyContent: 'center'
  },
  dialogContentTextroot: {
    color: theme.palette.neutrals.almostBlack,
    fontSize: 18
  }
}))


const Confirmation = ({ show, onHide, action, title, question }) => {
  const classes = useStyles();
  const { t, i18n, translationsLoaded } = useTranslation();

  const handleConfirm = (e) => {
    action();
    onHide();
    e.stopPropagation()
  }

  const handleClose = (e) => {
    onHide();
    e.stopPropagation()
  }

  return (


    <Dialog
      classes={{ paper: `${classes.dialogPaper} p-3` }}
      open={show}
      onClose={onHide}
    >
      <DialogContent>
        <DialogContentText classes={{ root: classes.dialogContentTextroot }}>
          {question}
        </DialogContentText>
      </DialogContent>
      <DialogActions classes={{ root: classes.dialogActionsRoot }}>
        <EButton autoFocus onClick={handleClose} eVariant="secondary" sx={{mr:4}}>
          {t("No")}
        </EButton>
        <EButton onClick={handleConfirm} eVariant="primary" sx={{ml:4}}>
          {t("Yes")}
        </EButton>
      </DialogActions>
    </Dialog>
  );
}



export default Confirmation;
