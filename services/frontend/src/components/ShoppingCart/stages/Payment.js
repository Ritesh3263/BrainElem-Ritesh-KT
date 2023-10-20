import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// PayPal
import PaymentPayPalButtons from 'components/common/PaymentPayPalButtons'

// MUI v5
import Grid from "@mui/material/Grid";
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import { IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';


// Services
import AuthService from "services/auth.service";
import OrderService from "services/order.service";


// Styled compnents
import ShoppingCartElement from "../Element"
import ShoppingCartNavigation from 'components/ShoppingCart/Navigation';
import { ECard, ECheckbox, EButton } from "styled_components";

//Context
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import { useShoppingCartContext } from "components/_ContextProviders/ShoppingCartProvider/ShoppingCartProvider";

// Icons
import { BsPencil } from "react-icons/bs";

// MUI v4
import { theme } from 'MuiTheme'
const palette = theme.palette


export default function Payment() {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const {
        setMyCurrentRoute,
        F_showToastMessage,
        F_handleSetShowLoader
    } = useMainContext();

    const {
        currentShoppingCart,
        shoppingCartDispatch,
        shoppingCartReducerActionsType,
        setStageIndex,
        getCurrency,
        getCurrencyCode,
        getTotalPrice,
        currentClient,
        clientDispatch,
        currentInvoice,
        invoiceDispatch
    } = useShoppingCartContext();

    const update = (key, value) => {
        clientDispatch({ type: "UPDATE", payload: { key: key, value: value } })
    }

    const StyledCard = styled(Card)({
        borderRadius: "16px",
        background: palette.glass.medium,
    })

    const StyledDivider = styled(Divider)({
        background: "white"
    })


    useEffect(() => {
        setMyCurrentRoute("Payment");
    }, []);

    return (
        <StyledCard>
            <Grid container>
                <Grid sx={{ margin: "auto", pb: 3, pt: 3 }}>
                    <ShoppingCartNavigation />
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12} >

                    <Typography sx={{ ml: 2, mb: 2 }} style={{ color: theme.palette.neutrals.almostBlack, fontSize: "18px" }}>{t("Check and place an order")}</Typography>
                </Grid>
                <Grid item xs={12} lg={7} >
                    <ECard sx={{ ml: 2, mr: 2 }}>
                        <Grid item sx={{ p: 3 }} xs={12} lg={11}>
                            <Typography sx={{ pb: 1 }} style={{ color: theme.palette.primary.darkViolet, fontSize: "18px" }}>{t("Order")}</Typography>
                            <StyledDivider sx={{ mb: 3 }} />
                            {currentShoppingCart.map(element => (<ShoppingCartElement element={element}></ShoppingCartElement>))}
                        </Grid>
                    </ECard>
                </Grid>
                <Grid item xs={12} lg={5} sx={{ pl: { xs: 0, lg: 2 }, mt: { xs: 2, lg: 0 } }}>
                    <ECard sx={{ mr: 2, ml: 2, p: 3, pt: 3 }}>
                        <Grid container>
                            <Grid container item xs={10} sx={{ margin: 'auto' }}>
                                <Typography style={{ color: theme.palette.primary.darkViolet, fontSize: "18px" }}>{t("Payment’s details")}</Typography>
                            </Grid>
                            <Grid item container justifyContent="end" alignItems="end" xs={2}    >
                                <IconButton onClick={() => { setStageIndex(1) }} size="small" variant="contained" style={{ background: theme.palette.shades.white70 }}>
                                    <BsPencil />
                                </IconButton>

                            </Grid>

                            <Grid item xs={12} >
                                <StyledDivider sx={{ mt: 1, mb: 2 }} />
                                <div>{currentClient.firstName} {currentClient.lastName}</div>
                                <div>{currentClient.addressStreet} </div>
                                <div>{currentClient.addressPostcode + " " + currentClient.addressCity}</div>
                            </Grid>
                        </Grid>
                    </ECard>
                    {currentInvoice.requested &&
                        <ECard sx={{ m: 2, p: 3, pt: 3 }}>
                            <Grid container>
                                <Grid container item xs={10} sx={{ margin: 'auto' }}>
                                    <Typography style={{ color: theme.palette.primary.darkViolet, fontSize: "18px" }}>{t("Invoice details")}</Typography>
                                </Grid>
                                <Grid item container justifyContent="end" alignItems="end" xs={2}    >
                                    <IconButton onClick={() => { setStageIndex(1) }} size="small" variant="contained" style={{ background: theme.palette.shades.white70 }}>
                                        <BsPencil />
                                    </IconButton>

                                </Grid>
                                <Grid item xs={12}  >
                                    <StyledDivider sx={{ mt: 1, mb: 2 }} />
                                    <div> {currentInvoice.requested && <>{t("Company Name") + " : " + ` ${currentInvoice.companyName} `}</>}</div>
                                    <div> {currentInvoice.requested && <>{t("Company Fid") + " : " + ` ${currentInvoice.companyId}`}</>}</div>
                                    <div> {currentInvoice.requested && <>{t("Email") + " : " + ` ${currentInvoice.email} `}</>}</div>
                                </Grid>
                            </Grid>
                        </ECard>
                    }
                    <ECard sx={{ m: 2, mt: 2, p: 3, pt: 3 }}>
                        <Grid container>
                            <Grid item xs={12} sx={{ margin: 'auto' }}>
                                <Typography style={{ color: theme.palette.primary.darkViolet, fontSize: "18px" }}>{t("Confirm and pay with")}</Typography>
                                <StyledDivider sx={{ mt: 1, mb: 2 }} />
                            </Grid>
                            <Grid container justifyContent="left" alignItems="left" item xs={6} sx={{ mt: 1, mb: 1 }} >
                                <Typography style={{ fontSize: "18px", color: theme.palette.neutrals.darkestGrey }} sx={{ textAlign: 'center', marginTop: "auto", marginBottom: "auto" }} > {t("Total price")}  </Typography>
                            </Grid>
                            <Grid container justifyContent="end" alignItems="end" item xs={5} sx={{ mt: 1, mb: 1, ml: 2 }} >
                                <Typography variant="h3" component="h3" style={{ fontSize: "28px", marginTop: "auto", marginBottom: "auto", fontWeight: "bold", color: theme.palette.neutrals.darkestGrey }} > {getTotalPrice()} {getCurrency()} </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel label={<>{t("I have read and accept the") + " "}<a target="_blank" href="/">{t("terms and conditions")}</a></>}
                                    control={<ECheckbox
                                        required
                                        checked={currentClient.acceptTerms}
                                        onChange={() => { update('acceptTerms', !currentClient.acceptTerms) }}
                                    ></ECheckbox>}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ mb: 2 }}>
                                <FormControlLabel label={<>{t("I have read and accept the") + " "}<a target="_blank" href="/">{t("shop policy")}</a></>}
                                    control={<ECheckbox
                                        required
                                        checked={currentClient.acceptPolicy}
                                        onChange={() => { update('acceptPolicy', !currentClient.acceptPolicy) }}
                                    ></ECheckbox>}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <div style={{ maxWidth: "300px", minHeight: "200px", margin: "auto" }}>
                                    <PaymentPayPalButtons
                                        style={{ shape: "pill" }}
                                        onApprove={()=>setStageIndex(3)}
                                        forceAccepting={true}>
                                    </PaymentPayPalButtons>
                                   
                                </div>
                            </Grid>
                        </Grid>
                    </ECard>
                </Grid>
            </Grid>
        </StyledCard>
    )
}


