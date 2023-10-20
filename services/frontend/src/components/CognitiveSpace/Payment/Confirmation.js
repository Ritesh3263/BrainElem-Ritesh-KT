import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

import { styled } from '@mui/material/styles';

// Components
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import { ECard, ETextField, ECheckbox } from "styled_components";
import PaymentPayPalButtons from 'components/common/PaymentPayPalButtons'

// Colors
import { new_theme } from "NewMuiTheme";


//Context
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import { useShoppingCartContext } from "components/_ContextProviders/ShoppingCartProvider/ShoppingCartProvider";

const Wrapper = styled(Box)({
    width: '100%',
    background: new_theme.palette.newSupplementary.SupCloudy,
    padding: '16px',
    borderRadius: '16px'
})


export default function PricingBlock({ title, price }) {
    const { t } = useTranslation(['translation', 'payment']);
    let [searchParams] = useSearchParams();
    const navigate = useNavigate()

    const {
        shoppingCartDispatch,
        shoppingCartReducerActionsType,
        getCurrency,
        getTotalPrice,
        currentClient,
        clientDispatch,
        currentInvoice,
        invoiceDispatch
    } = useShoppingCartContext();


    const updateClient = (key, value) => {
        if (value != undefined) clientDispatch({ type: "UPDATE", payload: { key: key, value: value } })
    }

    const updateInvoice = (key, value) => {
        if (value != undefined) invoiceDispatch({ type: "UPDATE", payload: { key: key, value: value } })
    }

    const isValid = () => {
        if (getTotalPrice() == 0) return false
        if (currentClient.email && currentClient.firstName && currentClient.lastName) {
            if (currentInvoice.requested) {
                if (currentInvoice.companyId && currentInvoice.companyName) return true
                else return false
            } else return true

        }
        return false
        // //F_showToastMessage(t('payment:PROVIDE_ALL_REQUIRED'),'error')


        // let isValid = ValidatorsService.isValidEmailAddress(currentClient.email)
        // setEmailValid(isValid)

    }
    return (
        <Grid container sx={{ p: '24px', justifyContent: 'center', width: '100%' }}>
            <Grid item container sx={{
                background: 'white',
                boxShadow: `0px 4px 4px ${new_theme.palette.shades.black25}`,
                border: `1px solid ${new_theme.palette.primary.PBorderColor}`,
                borderRadius: '16px',
                maxWidth: '770px',
                display: "block",
                p: "24px"
            }}>
                <Typography sx={{ mb: '36px', fontSize: "36px", color: new_theme.palette.primary.MedPurple, fontWeight: "bold" }} >
                    {searchParams.get("productName")}
                </Typography>
                <Grid item container sx={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>


                    <Wrapper sx={{ mb: '27px' }}>
                        <Typography sx={{ fontSize: "24px", color: new_theme.palette.primary.PPurple, fontWeight: "bold" }} >
                            {t("payment:PERSONAL_DETAILS")}
                        </Typography>
                        <hr style={{ margin: "0px 0px 24px 0px" }}></hr>

                        <ETextField required label={t("Email")} value={currentClient.email} onChange={(event) => {
                            updateInvoice('email', event.target.value)
                            updateClient('email', event.target.value)
                        }} />
                        <ETextField required label={t("First name")} value={currentClient.firstName} onChange={(event) => updateClient('firstName', event.target.value)} />


                        <ETextField required label={t("Last name")} value={currentClient.lastName} onChange={(event) => updateClient('lastName', event.target.value)} />


                        <FormControlLabel sx={{ width: '100%' }} label={t("payment:I_WANT_INVOICE")} control={<ECheckbox
                            checked={currentInvoice.requested}
                            onChange={() => { updateInvoice('requested', !currentInvoice.requested) }}
                        ></ECheckbox>} />
                        {currentInvoice.requested && <>
                            <ETextField required label={t("payment:COMPANY_ID")} value={currentInvoice.companyId} onChange={(event) => updateInvoice('companyId', event.target.value)} />
                            <ETextField required label={t("payment:COMPANY_NAME")} value={currentInvoice.companyName} onChange={(event) => updateInvoice('companyName', event.target.value)} />

                        </>}


                        <Typography sx={{ mb: '16px', fontSize: "24px", color: new_theme.palette.neutrals.darkGrey, fontWeight: 'bold' }} >
                            {price}
                        </Typography>
                    </Wrapper>
                    <Wrapper sx={{ mb: '27px' }}>
                        <Typography sx={{ fontSize: "24px", color: new_theme.palette.primary.PPurple, fontWeight: "bold" }} >
                            {t("payment:REDEEM_COUPON")}
                        </Typography>
                        <hr style={{ margin: "0px 0px 24px 0px" }}></hr>
                        <ETextField disabled label={t("payment:REDEEM_COUPON")} onChange={() => { }} />




                    </Wrapper>


                    <Wrapper sx={{ mb: '27px' }}>
                        <Typography sx={{ fontSize: "24px", color: new_theme.palette.primary.PPurple, fontWeight: "bold" }} >
                            {t("payment:CONFIRM_AND_PAY")}
                        </Typography>
                        <hr style={{ margin: "0px 0px 24px 0px" }}></hr>

                        <Grid container sx={{ alignItems: 'center', mt: '8px', mb: '32px' }}>
                            <Typography sx={{ fontSize: "16px", mr: '24px', color: new_theme.palette.neutrals.darkGrey }} >
                                {t("payment:TOTAL_PRICE")}
                            </Typography>
                            <Typography sx={{ fontSize: "24px", color: new_theme.palette.newSupplementary.NSupText, fontWeight: 'bold' }} >
                                {getTotalPrice().toString()} {getCurrency()}
                            </Typography>
                        </Grid>
                        <PaymentPayPalButtons 
                            style={{ shape: "pill", width: '100%' }}
                            onApprove={()=>{
                                shoppingCartDispatch({ type: shoppingCartReducerActionsType.REMOVE_ALL })
                                navigate(`/myspace`)
                            }}
                            forceAccepting={false}>
                        </PaymentPayPalButtons>

                        <a href="https://brainelem.com/conditions-generales-dutilisation-du-site-braincore-app/" target="_blank">
                            <Typography sx={{ fontSize: "14px", color: 'black', textAlign: 'left', cursor: 'pointer' }} >

                                {t("payment:YOU_ACCEPT_TERMS_AND_CONDITIONS")}
                            </Typography>
                        </a>
                        <a href="https://brainelem.com/reglement-general-sur-la-protection-des-donnees/'" target="_blank">
                            <Typography sx={{ fontSize: "14px", color: 'black', textAlign: 'left', cursor: 'pointer' }}>
                                {t("payment:YOU_ACCEPT_PRIVACY_POLICY")}
                            </Typography>
                        </a>
                    </Wrapper>
                </Grid>
            </Grid>
        </Grid>
    )
}