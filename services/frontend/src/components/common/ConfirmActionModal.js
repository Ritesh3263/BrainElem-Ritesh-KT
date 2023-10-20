import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import {Col, ListGroup} from "react-bootstrap";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import DialogActions from "@material-ui/core/DialogActions";
import Avatar from "@material-ui/core/Avatar";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import DialogContentText from "@material-ui/core/DialogContentText";
import {Typography} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import StyledButton from "new_styled_components/Button/Button.styled";
import './popup.scss'

const useStyles = makeStyles(theme=>({}))

export default function ConfirmActionModal({
    actionModal, setActionModal, actionModalTitle, actionModalMessage, btnText, 
    confirmAction=()=>{console.log("confirmAction")},
    cancelAction=()=>{console.log("cancelAction")}
}){
    const { t } = useTranslation(['common']);
    const classes = useStyles();
    return(
        <Dialog
            className="popupDelete"
            open={actionModal.isOpen}
            onClose={()=>setActionModal(p=>({...p,isOpen: false, returnedValue: false}))}
            maxWidth={'sm'}
            fullWidth={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title" className="text-center">
                <Typography variant="h3" component="h2" className="mt-2 text-center text-justify popupTitle" 
                > {actionModalTitle || "-"}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" className="popupDescription">
                    {actionModalMessage || "-"}
                </DialogContentText>
            </DialogContent>
            <DialogActions className="displayFlex justifyCenter">
                <StyledButton eVariant="secondary" eSize="small" onClick={()=>{
                    setActionModal(p=>({...p,isOpen: false, returnedValue: false}))
                    cancelAction()
                    }}>
                    {t("common:CANCEL")}
                </StyledButton>
                <StyledButton eVariant="primary" eSize="small"
                        onClick={()=>{
                            setActionModal(p=>({...p,isOpen: false, returnedValue: true}))
                            confirmAction()
                            }}>
                    {btnText||t("common:REMOVE")}
                </StyledButton>
            </DialogActions>
        </Dialog>
    )
}