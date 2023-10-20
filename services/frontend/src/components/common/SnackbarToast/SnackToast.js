import React, {forwardRef, useEffect, useState} from "react";
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {useMainContext} from "../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import {Grow, Slide} from "@material-ui/core";

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SnackToast() {
    const {F_showToastMessage,toastState, F_showToastMessageMui} = useMainContext();
    const [open, setOpen] = useState(false);
    const position = {vertical: 'bottom', horizontal: 'left'};
    const transition = Slide;

    useEffect(()=>{
        if(toastState?.show){
            setOpen(true);
        }
    },[toastState?.show])

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
        setTimeout(()=>{
            F_showToastMessage(false, "", "info", 6000);
        },200)
    };

    return (
        <div>
            <Button variant="outlined" onClick={()=>F_showToastMessageMui(true, "wiadomość", "success", 6000)}>
                Open success snackbar
            </Button>
            <Button variant="outlined" onClick={()=>F_showToastMessageMui(true, "testwe", "warning", 6000)}>
                Open success snackbar
            </Button>
            <Button variant="outlined" onClick={()=>F_showToastMessage()}>
                Open success snackbar
            </Button>
            <Snackbar
                open={open}
                anchorOrigin={position}
                onClose={handleClose}
                TransitionComponent={transition}
                autoHideDuration={toastState?.hideTime || 6000}
            >
                <Alert onClose={handleClose} severity={toastState?.variant || "info"} sx={{ width: '100%' }}>
                    {toastState?.message || "Empty..."}
                </Alert>
            </Snackbar>
            <Alert severity="error">This is an error message!</Alert>
            <Alert severity="warning">This is a warning message!</Alert>
            <Alert severity="info">This is an information message!</Alert>
            <Alert severity="success">This is a success message!</Alert>
        </div>
    );
}