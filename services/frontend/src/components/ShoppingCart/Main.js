import React, { lazy, useEffect } from "react";

// Context

import { useShoppingCartContext } from "components/_ContextProviders/ShoppingCartProvider/ShoppingCartProvider";


//MUIv5
import Box from '@mui/material/Box';

// From MaterialUI V4 - to use the same screen as in Navigation.js
import { isWidthUp } from '@material-ui/core/withWidth';

// Stages
const Summary = lazy(() => import("./stages/Summary"));
const Details = lazy(() => import("./stages/Details"));
const Payment = lazy(() => import("./stages/Payment"));
const Confirmation = lazy(() => import("./stages/Confirmation"));

const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID


export default function Main() {

    const {
        stageIndex,
        getCurrencyCode,
    } = useShoppingCartContext();
    return (
        // For smaller screens leave place for navigation:
        <Box sx={{ px: 2, pt: 1 }}>
                {stageIndex == 0 && <Summary />}
                {stageIndex == 1 && <Details />}
                {stageIndex == 2 && <Payment />}
                {stageIndex == 3 && <Confirmation />}
        </Box>

    )
}
