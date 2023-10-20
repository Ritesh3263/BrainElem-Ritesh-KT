import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

//Icons 
import { ReactComponent as Credit } from 'icons/icons_32/Credit card.svg';
import { ReactComponent as Paypal } from 'icons/icons_32/PayPal.svg';

// Styled compnents
import ShoppingCartElement from "../Element"
import { ECard, EButton } from "styled_components";

// Contexts
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import { useShoppingCartContext } from "components/_ContextProviders/ShoppingCartProvider/ShoppingCartProvider";

// MUI v5
import { styled } from '@mui/material/styles';
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';

// MUI v4
import { theme } from 'MuiTheme'
const palette = theme.palette

const StyledECard = styled(ECard)({
    borderRadius:"16px"
})

// Summary component
export default function Summary() {
    const { t } = useTranslation();

    const {
        setMyCurrentRoute,
    } = useMainContext();

    const {
        isEmpty,
        getCurrency,
        setStageIndex,
        getTotalPrice,
        currentShoppingCart,
    } = useShoppingCartContext();

    useEffect(() => {
        setMyCurrentRoute("Shopping cart");
    }, []);

    return ( 

        <Grid container >
        <Grid item xs={12} lg={8}  >
            <StyledECard sx={{p:3, mb:3}}>
                <Grid item xs={12} md={12}>
                    <Typography sx={{ mb:2 }} style={{ fontSize: "24px", color: theme.palette.primary.darkViolet }} variant="body1" >
                        {` ${t("Cart")} ${currentShoppingCart.length} ${t("item(s)")} `}
                    </Typography>
                    {currentShoppingCart.map(element => (<ShoppingCartElement element={element}></ShoppingCartElement>))}
                </Grid>
            </StyledECard>
        </Grid>

        <Grid item xs={12} lg={4} sx={{ pl: { xs: 0, lg: 2 } }}>
                <StyledECard style={{display:"block", borderRadious:"20px"}}>
                    <div  >
                        <Typography style={{ fontSize: "24px", color: theme.palette.primary.darkViolet }} sx={{ pl: 3, pt: 3 }} > {t("To pay ")}  </Typography>
                        <Grid container justifyContent="center" alignItems="center" item xs={12} sx={{ mt: 1, mb: 1 }} >   
                            <Typography style={{ fontSize: "16px", color: theme.palette.neutrals.darkestGrey }} sx={{ textAlign: 'center',  }} > {t("Total price")}  </Typography>
                        </Grid>
                        <Grid container justifyContent="center" alignItems="center" item xs={12} sx={{ mt: 1, mb: 1 }} >
                          <Typography variant="h3" component="h3" style={{ fontSize: "48px", fontWeight: "bold", color: theme.palette.neutrals.darkestGrey }} > {getTotalPrice()} {getCurrency()} </Typography>
                        </Grid>  
                        <Grid container justifyContent="center" alignItems="center" item xs={12} sx={{ mt: 2, mb: 1 }} >
                            <EButton
                                style={{ minWidth: '200px' }}
                                eSize='medium'
                                eVariant="primary"
                                onClick={() => { setStageIndex(1) }}
                                disabled={isEmpty()}
                            >{t("Proceed to payment")}</EButton>
                        </Grid>
                        <Grid container justifyContent="center" alignItems="center" item xs={12} sx={{ mb: 3 }} >
                            <span style={{ textDecoration:"underline", fontSize: "18px", color: theme.palette.primary.lightViolet, cursor: "pointer" }}
                                onClick={() => { }}
                            >{t('Store’s regulation')}</span>
                        </Grid>
                        <Grid container justifyContent="center" alignItems="center" item xs={12} sx={{ mb: 1 }} >
                            <span style={{ fontSize: "18px", color: theme.palette.neutrals.darkestGrey}}
                                onClick={() => { }}
                            >{t('Accepted')}</span>
                        </Grid>
                        <Grid container justifyContent="center" alignItems="center" item xs={12} sx={{ mb: 4}} >
                          <Grid style ={{letterSpacing:"30px"}} >
                             <Paypal/> <Credit />
                          </Grid>  
                        </Grid>
                    </div>
                </StyledECard>
            </Grid>
            </Grid>
    )
}
