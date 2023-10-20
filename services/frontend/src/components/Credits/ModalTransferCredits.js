// Modal used to transfer credits between users

import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

// MUI v5
import { Typography, Grid, SvgIcon, Dialog, DialogTitle, DialogContent, DialogActions, ThemeProvider, MenuItem, ListItemText } from '@mui/material';

import TextField from '@mui/material/TextField';
// import Autocomplete from '@mui/material/Autocomplete';
// import Autocomplete from 'new_styled_components/Autocomplete';
import EAutocomplete from 'new_styled_components/Autocomplete/Autocomplete.styled';
import { ESelect } from 'new_styled_components';

// Styled components
import StyledButton from 'new_styled_components/Button/Button.styled';

//Services
import CreditService from "services/credit.service";

// Icons
import { ReactComponent as TransferIcon } from 'icons/icons_32/swap_horiz_32.svg';

// Theme
import { new_theme } from 'NewMuiTheme';


// Modal used to transfer credits between users
// list - list of users with assigned credits
// transferFrom - initial user from which credits will be transfered
// transferTo - initial user to which credits will be transfered
//              when provided this will be Assign Credits modal
// open - while true modal will be opened
// onClose - onClose function takes argunet `reload`, when true it will reload the credits list
export default function ModalTransferCredits({ list, transferFrom, transferTo, open, onClose }) {
    const { t } = useTranslation(['common', 'sentinel-Admin-Credits']);
    const { F_getHelper, F_showToastMessage, F_handleSetShowLoader } = useMainContext();
    const [from, setFrom] = useState()
    const [to, setTo] = useState()

    const [possibleNumberOptions, setPossibleNumberOptions] = useState([{ value: 1, name: '1' }])
    const [selectedNumber, setSelectedNumber] = useState(1)

    useEffect(() => {
        if (from) {
            let possible = []
            let available = from.available
            if (available > 1) possible.push({ name: '1', value: 1 })
            if (available > 1) possible.push({ name: '2', value: 2 })
            if (available > 1) possible.push({ name: '3', value: 3 })
            if (available > 1) possible.push({ name: '4', value: 4 })
            if (available > 5) possible.push({ name: '5', value: 5 })
            if (available > 10) possible.push({ name: '10', value: 10 })
            if (available > 50) possible.push({ name: '50', value: 50 })
            if (available > 100) possible.push({ name: '100', value: 100 })
            if (available > 0) possible.push({ name: available, value: available })
            setPossibleNumberOptions(possible)
        }
    }, [from])


    useEffect(() => {
        // Set the last element on the list
        if (possibleNumberOptions.length) setSelectedNumber(possibleNumberOptions[possibleNumberOptions.length - 1].value)
    }, [possibleNumberOptions])

    useEffect(() => {
        if (transferFrom) setFrom(transferFrom)
        // #############################
        if (transferTo) setTo(transferTo)
        else if (list) setTo(list[0])
    }, [transferFrom, transferTo, list])


    const getFromSelect = () => {
        if (!list) return <></>
        return <EAutocomplete
            variant="outlined"
            fullWidth={true}
            value={from}
            label={t("sentinel-Admin-Credits:TRANSFER FROM")}
            disableClearable={true}
            onChange={(event, newValue) => {
                setFrom(newValue);
            }}
            getOptionLabel={(o) => o.user + ` [${o.available}]`}
            options={list}
            getOptionDisabled={(option) => option.available < 1}
            renderInput={(params) => <TextField {...params} />}
        />
        
        // <FormControl margin="dense" variant="outlined" fullWidth>
        //     <Autocomplete
        //         value={from}
        //         disableClearable={true}
        //         onChange={(event, newValue) => {
        //             setFrom(newValue);
        //         }}
        //         getOptionLabel={(o) => o.user + ` [${o.available}]`}
        //         options={list}
        //         getOptionDisabled={(option) => option.available < 1}
        //         renderInput={(params) => <TextField {...params} label={t("sentinel-Admin-Credits:TRANSFER FROM")} />}
        //     />
        

        //     {/* <Select label="from-label" onChange={(e) => { setFrom(e.target.value) }} value={from}>
        // {list.map(u => <MenuItem disabled={u.available < 1} value={u} >
        // <ListItemText primary={u.user + ` [${u.available}]`} />
        // </MenuItem>)}
        // </Select> */}
        // </FormControl>
    }

    const getToSelect = () => {
        if (!list) return <></>
        return <EAutocomplete
                    variant="outlined"
                    value={to}
                    label={t("sentinel-Admin-Credits:TRANSFER TO")}
                    disableClearable
                    onChange={(event, newValue) => {
                        setTo(newValue);
                    }}
                    getOptionLabel={(o) => o.user + ` [${o.available}]`}
                    options={list}
                    getOptionDisabled={(option) => option == from}
                    renderInput={(params) => <TextField {...params} />}
                    fullWidth={true}
                />
    }

    return (
        <ThemeProvider theme={new_theme}>
            <Dialog PaperProps={{
                    sx: {
                        overflowY: 'unset',
                        p: 3
                    }
                }} 
                open={open} onClose={onClose} maxWidth="sm" fullWidth={true}>
                <DialogTitle sx={{ p: 0, pb: 3 }}>
                    <Typography variant="h3" component="div" sx={{ p: 0, textAlign: 'left', color: new_theme.palette.newSupplementary.NSupText }}>
                        {transferTo && t("sentinel-Admin-Credits:ASSIGN CREDITS")}
                        {!transferTo && t("sentinel-Admin-Credits:TRANSFER CREDITS")}
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ pb: 0, px: 0, overflowY: 'unset' }}>
                    <Grid container spacing={3}>
                        {transferTo && <Grid item xs={12}>
                            {getToSelect()}
                        </Grid>}

                        <Grid item xs={12}>
                            <ESelect
                                label={t("sentinel-Admin-Credits:NUMBER OF CREDITS")}
                                type="round"
                                size="medium"
                                fullWidth={true}
                                onChange={(e) => { setSelectedNumber(e.target.value) }} value={selectedNumber}>
                                {possibleNumberOptions.map((c) =>
                                    <MenuItem value={c.value} >
                                        <ListItemText primary={c.name} />
                                    </MenuItem>)}
                            </ESelect>
                        </Grid>
                        {!transferTo && <>
                            <Grid item sx={{ width: { xs: '100%', md: '45%' } }}>
                                {getFromSelect()}
                            </Grid >
                            <Grid item container sx={{ width: '10%', display: { xs: 'none', md: 'inherit' }, alignContent: 'center', justifyContent: 'center' }}>
                                <SvgIcon sx={{}} viewBox="0 0 24 24" component={TransferIcon} />
                            </Grid>
                            <Grid item sx={{ width: { xs: '100%', md: '45%' } }}>
                                {getToSelect()}
                            </Grid>
                        </>}
                    </Grid>
                    <DialogActions sx={{ px: 0, pt: 3, justifyContent: 'space-between' }}>
                        <StyledButton onClick={onClose} eVariant="secondary" eSize='small' >
                            {t("common:CANCEL")}
                        </StyledButton>
                        <StyledButton onClick={() => {
                            F_handleSetShowLoader(true)
                            CreditService.transferCredits(from.id, to.id, selectedNumber).then(
                                () => {
                                    F_showToastMessage(t("sentinel-Admin-Credits:SUCCESSFULLY TRANSFERRED {{number}} CREDITS", { number: selectedNumber }), 'success')
                                    //F_handleSetShowLoader(false)
                                    onClose()
                                },
                                (error) => {
                                    if (error?.message == "NO_SUFFICIENT_CREDITS") F_showToastMessage(t("sentinel-Admin-Credits:NO SUFFICIENT CREDITS"), 'error')
                                    else F_showToastMessage(t("sentinel-Admin-Credits:COULD NOT TRANSFER CREDITS"), 'error')
                                    F_handleSetShowLoader(false)
                                }
                            )
                        }} eVariant="primary" eSize='small' >
                            {t("common:CONFIRM")}
                        </StyledButton>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </ThemeProvider>
    );
}