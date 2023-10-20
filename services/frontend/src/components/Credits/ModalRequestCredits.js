// Modal used to transfer credits between users

import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

// MUI v5
import { Typography, Grid, DialogContentText, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem, ListItemText } from '@mui/material';



// Styled components
import StyledButton from 'new_styled_components/Button/Button.styled';

//Services
import CreditService from "services/credit.service";


// Theme
import { new_theme } from 'NewMuiTheme';


// Modal used to transfer credits between users



export default function ModalRequestCredits({ open, onClose }) {
    const { t } = useTranslation(['common', 'sentinel-Admin-Credits']);
    const { F_getHelper, F_showToastMessage, F_handleSetShowLoader } = useMainContext();
    const [possibleNumberOptions, setPossibleNumberOptions] = useState([
        { value: 1, name: '1' },
        { value: 2, name: '2' },
        { value: 3, name: '3' },
        { value: 4, name: '4' },
        { value: 5, name: '5' },
        { value: 10, name: '10' },
        { value: 25, name: '25' },
        { value: 50, name: '50' },
        { value: 100, name: '100' }
    ])
    const [selectedNumber, setSelectedNumber] = useState(5)

    return (
        <Dialog sx={{ '.MuiPaper-root': { p: 3 } }} open={open} onClose={onClose} maxWidth="xs" fullWidth={true} >
            <DialogTitle sx={{ p: 0, pb: 3 }}>
                <Typography variant="h3" component="div" sx={{ p: 0, textAlign: 'left', color: new_theme.palette.newSupplementary.NSupText }}>
                    {t("sentinel-Admin-Credits:REQUEST CREDITS")}

                </Typography>
            </DialogTitle>
            <DialogContent sx={{ pb: 0, px: 0 }}>
                <DialogContentText></DialogContentText>
                <Grid container spacing={3}>


                    <Grid item xs={12}>
                        <FormControl margin="dense" variant="outlined" fullWidth>
                            <InputLabel id="number-label">{t("sentinel-Admin-Credits:NUMBER OF CREDITS")}</InputLabel>
                            <Select label="number-label" onChange={(e) => { setSelectedNumber(e.target.value) }} value={selectedNumber}>
                                {possibleNumberOptions.map((c) =>
                                    <MenuItem value={c.value} >
                                        <ListItemText primary={c.name} />
                                    </MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <DialogActions sx={{ px: 0, pt: 3, justifyContent: 'space-between' }}>
                    <StyledButton onClick={onClose} eVariant="secondary" eSize='small' >
                        {t("common:CANCEL")}
                    </StyledButton>
                    <StyledButton onClick={() => {
                        F_handleSetShowLoader(true)
                        CreditService.requestCredits(selectedNumber).then(
                            () => {
                                F_showToastMessage(t("sentinel-Admin-Credits:SUCCESSFULLY REQUESTED {{number}} CREDITS", { number: selectedNumber }), 'success')
                                F_handleSetShowLoader(false)
                                onClose()
                            },
                            (error) => {
                                if (error?.message == "NO_SUFFICIENT_CREDITS") F_showToastMessage(t("sentinel-Admin-Credits:COULD NOT REQUEST CREDITS"), 'error')
                                //
                                F_handleSetShowLoader(false)
                            }
                        )


                    }} eVariant="primary" eSize='small' >
                        {t("common:CONFIRM")}
                    </StyledButton>
                </DialogActions>
            </DialogContent>
        </Dialog >
    );
}