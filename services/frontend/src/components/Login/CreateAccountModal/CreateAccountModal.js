import React, {useEffect, useState} from "react";
import Dialog from "@material-ui/core/Dialog";
import {Button, Checkbox, DialogActions, DialogContent, DialogTitle, Divider} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import RegisterForm from "../UserRegister/RegisterForm";


export default function CreateAccountModal({createAccountModal, setCreateAccountModal}){
    const {t} = useTranslation();
    return(
        <Dialog
            open={createAccountModal.isOpen}
            onClose={() => {setCreateAccountModal({isOpen: false})}}
            maxWidth={"sm"}
            fullWidth={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogContent className="p-0">
                    <RegisterForm setIsRegistration={()=>{}}/>
            </DialogContent>
            <DialogActions className="d-flex justify-content-center mx-1">
                <Button
                    variant="contained"
                    size="small"
                    color="secondary"
                    onClick={() => {setCreateAccountModal({isOpen: false})}}
                >
                    {t("Back")}
                </Button>
            </DialogActions>
        </Dialog>
    )
}