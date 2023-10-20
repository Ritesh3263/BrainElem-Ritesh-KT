import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

// Contexts
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import { useShoppingCartContext } from "components/_ContextProviders/ShoppingCartProvider/ShoppingCartProvider";

// Styled compnents
import ShoppingCartNavigation from 'components/ShoppingCart/Navigation';
import { ECard, ETextField, EButton, ECheckbox } from "styled_components";

// MUI v5
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';

// Icon
import { ReactComponent as CartIcon } from '../../../icons/icons_32/cart.svg';

// MUI v4
import { theme } from 'MuiTheme'
const palette = theme.palette

const StyledECard = styled(ECard)({
    borderRadius:"16px"
})

export default function Details() {
    const { t } = useTranslation();

    const {
        setMyCurrentRoute
    } = useMainContext();

    const {
        setStageIndex,
        currentClient,
        clientDispatch,
        currentInvoice,
        invoiceDispatch,
    } = useShoppingCartContext();


    const updateClient = (key, value) => {
        if (value!=undefined) clientDispatch({ type: "UPDATE", payload: { key: key, value: value } })
    }

    const updateInvoice = (key, value) => {
        if (value!=undefined) invoiceDispatch({ type: "UPDATE", payload: { key: key, value: value } })
    }

    useEffect(() => {
        setMyCurrentRoute("Details");
    }, []);

    return (
        <form onSubmit={() => setStageIndex(2)} >
            <Grid container justifyContent='space-around'>
                <Grid item xs={12} lg={6}>  
                    <StyledECard>
                        <div>
                            <Grid container item xs={12} sx={{margin:"auto", pt:3}} justifyContent='space-around'>
                                <Grid item   sx={{ margin:"auto"}} >
                                    <ShoppingCartNavigation />
                                </Grid>
                            </Grid>    
                            <Grid container item xs={10} md={12} sx={{margin:"auto", p:{sm: 1, md:3}}} justifyContent='space-around'>
                                <Grid item xs={12} sx={{p:{md:1}, pt:2}}>
                                    <Typography style={{ color: theme.palette.neutrals.almostBlack }}>{t("Personal details for the payment")}</Typography>
                                </Grid>
                                <Grid item xs={12} md={6}sx={{p:{md:1}, pb:0, pt:1}} >
                                    <ETextField required label={t("First name")} value={currentClient.firstName} onChange={(event) => updateClient('firstName', event.target.value)} />
                                </Grid>
                                <Grid item xs={12} md={6}sx={{p:{md:1}, pb:0 }} >
                                    <ETextField required label={t("Last name")} value={currentClient.lastName} onChange={(event) => updateClient('lastName', event.target.value)} />
                                </Grid>
                                <Grid item xs={12} md={12} sx={{p:{md:1}, pb:0 }} >
                                    <ETextField required label={t("Street, number")} value={currentClient.addressStreet} onChange={(event) => updateClient('addressStreet', event.target.value)} />
                                </Grid>
                                <Grid item xs={12} md={6} sx={{p:{md:1}, pb:0 }} >
                                    <ETextField required label={t("City")} value={currentClient.addressCity} onChange={(event) => updateClient('addressCity', event.target.value)} />
                                </Grid>
                                <Grid item xs={12} md={6} sx={{p:{md:1}, pb:0 }} >
                                    <ETextField required label={t("Postcode")} value={currentClient.addressPostcode} onChange={(event) => updateClient('addressPostcode', event.target.value)} />
                                </Grid>
                                <Grid item xs={12} sx={{p:{md:1}, pl:1 }} >
                                    <FormControlLabel label={t("I want to recieve a company invoice on e-mail")} control={<ECheckbox
                                        checked={currentInvoice.requested}
                                        onChange={() => { updateInvoice('requested', !currentInvoice.requested) }}
                                    ></ECheckbox>} />
                                </Grid>

                                {currentInvoice.requested && <>

                                    <Grid item xs={12} sx={{p:{md:1}, pl:{md:1} }} >
                                        <ETextField required label={t("Email")} value={currentInvoice.email} onChange={(event) => updateInvoice('email', event.target.value)} />
                                    </Grid>
                                    <Grid item xs={12} sx={{p:{md:1}, pl:{md:1} }} >
                                        <ETextField required label={t("Company ID")} value={currentInvoice.companyId} onChange={(event) => updateInvoice('companyId', event.target.value)} />
                                    </Grid>
                                    <Grid item xs={12} sx={{p:{md:1}, pb:2 }} >
                                        <ETextField required label={t("Company name")} value={currentInvoice.companyName} onChange={(event) => updateInvoice('companyName', event.target.value)} />
                                    </Grid>
                                </>}
                                    <Grid item xs={6} ><EButton eVariant="secondary" onClick={() => { setStageIndex(0) }} >{t("Back")}</EButton></Grid>
                                    <Grid item xs={6} sx={{ textAlign: 'end', mb:2  }}><EButton eVariant="primary" type="submit">{t("Next")}</EButton></Grid>
                            </Grid>
                        </div>          
                    </StyledECard>
                </Grid>
            </Grid >
        </form>
    )
}
