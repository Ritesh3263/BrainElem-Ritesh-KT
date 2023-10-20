import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// MUI v5
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';

// Icon
import { ReactComponent as Check } from '../../../icons/icons_32/Check.svg';


// Styled compnents
import ShoppingCartNavigation from 'components/ShoppingCart/Navigation';
import { ECard, EButton } from "styled_components";


// Context
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import { useShoppingCartContext } from "components/_ContextProviders/ShoppingCartProvider/ShoppingCartProvider";


// MUI v4
import { theme } from 'MuiTheme'
const palette = theme.palette

export default function Confirmation() {
    const navigate = useNavigate();
    const { t } = useTranslation(['translation', 'common']);
    const [oldShoppingCart, setOldShoppingCart] = useState([])
    const {
        setMyCurrentRoute
    } = useMainContext();

    const {
        setStageIndex,
        currentShoppingCart,
        shoppingCartDispatch,
        shoppingCartReducerActionsType,
    } = useShoppingCartContext();

    useEffect(() => {
        setMyCurrentRoute("Confirmation");
        if (currentShoppingCart.length) setOldShoppingCart(currentShoppingCart)
        else setStageIndex(0)
        // When leaving go back to stage 0
        return () => {setStageIndex(0)}
    }, []);

    useEffect(() => {
        if (oldShoppingCart.length) shoppingCartDispatch({ type: shoppingCartReducerActionsType.REMOVE_ALL })
    }, [oldShoppingCart]);

    return (
        <Grid container justifyContent='space-around'>
            <Grid item xs={12} md={8}>
                <ECard>

                    <Grid container item xs={12} sx={{ margin: 'auto', pt: 3, pb: 5 }} justifyContent="center" alignItems="center">
                        <Grid sx={{margin:"auto", pb:4}} ><ShoppingCartNavigation /></Grid>
                        <Grid container xs={12} justifyContent="center" alignItems="center">
                            <Check />
                        </Grid>
                        <Grid xs={10}>
                            <Typography sx={{ pt: 4, fontSize: "24px", fontWeight: "bold" }} variant="h3" component="h3">
                                {t("Thank you for yor trust!")}
                            </Typography>
                            <Typography sx={{ lineHeight: '40px', pb: 2, fontSize: "24px", fontWeight: "bold" }} variant="h3" component="h3">
                                {t("wish")}
                            </Typography>
                        </Grid>
                        <Grid xs={10}>
                            <Typography variant="h3" component="h3" sx={{ pt: 2, fontSize: "24px" }}>
                                {t("You have successfully purchased")} {oldShoppingCart.length} {t("products!")}
                            </Typography>
                        </Grid>
                        <Grid container item xs={12} lg={10} sx={{ pt: 2 }} alignItems="center" justifyContent='center'>
                            {oldShoppingCart.map(element =>
                                <Grid container sx={{ mt: 3 }} alignItems="center" justifyContent='center' xs={6} md={4} lg={3}>
                                    <img src={element.imageUrl} alt=""
                                        style={{
                                            width: 140,
                                            height: 110,
                                            borderRadius: "8px"
                                        }}
                                    />
                                    <div style={{ width: "140px", height: "50px" }} >
                                        <Typography variant="h3" component="h3" sx={{ mt: 2, fontSize: "16px", color: theme.palette.neutrals.almostBlack }}>
                                            {element?.name}
                                        </Typography>
                                    </div>
                                </Grid>
                            )}
                        </Grid>
                        <Grid container xs={12} sx={{ p: 3, pt: 5 }} justifyContent="center" alignItems="center">
                            <EButton eVariant='primary' eSize='medium'
                                onClick={() => {
                                    navigate('/myspace')
                                    shoppingCartDispatch({ type: shoppingCartReducerActionsType.REMOVE_ALL })
                                }}>
                                {t("Go to")+" "+t("common:MY SPACE")}
                            </EButton>
                        </Grid>

                    </Grid>
                </ECard>
            </Grid>
        </Grid>
    )
}
