import React, { useEffect, useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';

import UserService from "services/user.service";
import { new_theme } from "NewMuiTheme";
import { ThemeProvider } from "@mui/material";
import DetailsDialog from './DetailsDialog';
const UserDetailsDialog = ({ data }) => {

    const [OpenDialog, setOpenDialog] = React.useState(false);
    const [dialogUserDetails, setDialogUserDetails] = React.useState();
    
    const handleClickOpen = () => {
        UserService.read(data._id).then(res => {
            setDialogUserDetails(res.data);
            setOpenDialog(true);
            console.log(res.data);
        }).catch(error => console.error(error))
    };
    const handleClose = () => {
        setOpenDialog(false);
        console.log(dialogUserDetails)
    };
    return (
        <ThemeProvider theme={new_theme}>
            <VisibilityIcon sx={{ cursor: 'pointer' }} onClick={handleClickOpen} />
            <DetailsDialog
                open={OpenDialog}
                onClose={handleClose}
                dialogUserDetails={dialogUserDetails}
            />
        </ThemeProvider>
    )
}

export default UserDetailsDialog;