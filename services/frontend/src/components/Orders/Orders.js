import React, { useState, useEffect, lazy } from "react";
import { useTranslation } from "react-i18next";

//MUIv5u
import { Grid, Divider, Container, Typography, Dialog } from '@mui/material';

// Custom components
import Navigation from "new_styled_components/Navigation/Navigation.styled";

//Services
import OrderService from "services/order.service";

// Context 
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";


import { styled } from "@mui/system";

// Images
import reportImage from "../../img/cognitive_space/payment-report.jpg";


// Detect size of the screen
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import StyledButton from "new_styled_components/Button/Button.styled";

import { new_theme } from "NewMuiTheme";

const Text = styled(Typography)({
    fontFamily: 'Nunito',
    fontSize: '18px !important'
})


const Title = styled(Text)({
    fontWeight: 'bold'
})

const TitleAndTextContainer = styled(Grid)({
    flexDirection: 'column',
    marginBottom: '24px',
})

function useIsWidthUp(breakpoint) {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.up(breakpoint));
}


function OrderItem({ item }) {
    const { t } = useTranslation(['common', 'payment']);
    return (
        <Grid container sx={{ mr: { xs: 0, md: '48px' }, width: { xs: '100%', md: 'fit-content' }, justifyContent: { xs: 'center', md: 'flex-start' } }}>
            <Grid item container sx={{ width: '160px', flexDirection: 'column', alignItems: 'center' }}>
                <img style={{ width: '100%', maxWidth: '160px' }} src={reportImage} />
                <Title sx={{ textAlign: 'center' }}>{item.name?.replaceAll('-', '')}</Title>
                <Text sx={{ textAlign: 'center' }}>{t("payment:PRICE") + ":"} {item.unit_amount.value} {item.unit_amount.currency_code}</Text>
            </Grid>
        </Grid>
    )
}

function Order({ order, onCloseDetails, setSelectedOrder, details = false }) {
    const { t } = useTranslation(['common', 'payment']);
    const { F_getLocalTime } = useMainContext();

    return (
        <Grid container sx={{ mb: details ? '0px' : '48px', height: 'fit-content', px: details? '24px' : '16px', py: '24px', border: `1px solid ${new_theme.palette.primary.PBorderColor}`, borderRadius: '8px' }}>
            <Grid item container sx={{ mb: '32px', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                <Grid container item sx={{width: {xs:'100%', sm: '50%'}}}>
                    {details && <Typography sx={{ fontSize: '24px !important', fontWeight: 'bold' }}>{t("payment:DETAILS")}</Typography>}
                    {!details && <>
                        <Title sx={{ pr: '8px' }}>{t("payment:ORDER_NUMBER")}</Title>
                        <Text sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{order.providerId}</Text>
                    </>}
                </Grid>
                <Grid item>
                    {!details && <StyledButton sx={{ minWidth: 'unset !important', ml: '5px' }} eVariant="secondary" eSize='xsmall' onClick={() => {
                        setSelectedOrder(order)
                    }}>{t("payment:DETAILS")}</StyledButton>}
                </Grid>
            </Grid>
            <Grid item container>
                {details && <Grid container sx={{ minWidth: '100%', marginBottom: '24px' }}>
                    <Title sx={{ pr: '8px' }}>{t("payment:ORDER_NUMBER")}</Title>
                    <Text sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{order.providerId}</Text>
                </Grid>}
                <TitleAndTextContainer sx={{ mr: { xs: 0, md: '24px', lg: '48px' }, minWidth: { xs: '100%', md: 'unset' } }}>
                    <Title sx={{ pr: '8px' }}>{t("payment:ORDER_DATE")}</Title>
                    <Text>{F_getLocalTime(order.createdAt, true)}</Text>
                </TitleAndTextContainer>
                <TitleAndTextContainer sx={{ mr: { xs: 0, md: '24px', lg: '48px' }, minWidth: { xs: '100%', md: 'unset' } }}>
                    <Title sx={{ pr: '8px' }}>{t("payment:TOTAL_COST")}</Title>
                    <Text>{order.value} {order.currencyCode}</Text>
                </TitleAndTextContainer>
                <TitleAndTextContainer sx={{ mr: { xs: 0, md: '24px', lg: '48px' }, minWidth: { xs: '100%', md: 'unset' } }}>
                    <Title sx={{ pr: '8px' }}>{t("payment:PAYMENT_STATUS")}</Title>
                    <Text>{order.status == "COMPLETED" ? t('payment:STATUS_COMPLETED') : t('payment:STATUS_NOT_COMPLETED')}</Text>
                </TitleAndTextContainer>
            </Grid>
            <Grid item container>
                {order.providerItems.map(item => <OrderItem item={item}></OrderItem>)}
            </Grid>
            {details && <Grid item container sx={{ mt: '24px' }}>
                <TitleAndTextContainer sx={{ mr: { xs: 0, md: '24px', lg: '48px' }, minWidth: { xs: '100%', md: 'unset' } }}>
                    <Title sx={{ pr: '8px' }}>{t('payment:PERSONAL_DETAILS')}</Title>
                    <Text>{order.client.firstName} {order.client.lastName}</Text>
                    <Text>{order.client.email}</Text>
                </TitleAndTextContainer>
                {order.invoice.companyId && <TitleAndTextContainer sx={{ mr: { xs: 0, md: '24px', lg: '48px' }, minWidth: { xs: '100%', md: 'unset' } }}>
                    <Title sx={{ pr: '8px' }}>{t('payment:INVOICE')}</Title>
                    <Text>{order.invoice.companyName}</Text>
                    <Text>{order.invoice.companyId}</Text>
                    <Text>{order.invoice.email}</Text>
                </TitleAndTextContainer>}

                <Grid container sx={{
                    width: '100%', 
                    borderRadius: '4px',
                    padding: '16px',
                    cursor:'pointer',
                    background: new_theme.palette.newSupplementary.SupCloudy,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                }}
                onClick={()=>{onCloseDetails()}}
                
                >
                    <Title sx={{mb: '16px'}}>{t("payment:HELP")}</Title>
                    <Text sx={{textAlign: 'center'}}>{t("payment:TO_GET_HELP_CLICK_HERE")}</Text>
                </Grid>
            </Grid>}


        </Grid>
    )

}

export default function Orders() {
    const { t } = useTranslation(['common', 'payment']);
    const { F_showToastMessage, F_getErrorMessage } = useMainContext();
    const [showHelp, setShowHelp] = useState(false);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState();
    const isSmUp = useIsWidthUp("sm");


    // Get orders in beetween months
    const getOrdersInMonths = (start, end) => {
        let now = new Date()
        let matching = []
        for (let order of orders) {
            let date = new Date(order.createdAt)
            const diffTime = Math.abs(now - date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays >= start * 30) {
                if (!end || diffDays < end * 30) matching.push(order)
            }
        }
        return matching
    }


    const loadOrders = () => {
        // Load active tip #####################
        OrderService.getAll().then(res => {
            setOrders(res.data);
        }).catch(err => {
            F_showToastMessage(F_getErrorMessage(err), 'error');
        });
        //######################################
    }


    useEffect(() => {
        if (orders) {
            for (let order of orders) {
                // If payment is not COMPLETED, refresh the status to make sure
                if (order.status != "COMPLETED" || (order.invoice?.requested && !order?.invoice?.sent)) {
                    OrderService.updateStatus(order.providerId).then(res => {

                    }).catch(err => {
                        let message = t("payment:ERROR_WHEN_UPDATING_ORDER_STATUS")
                        F_showToastMessage(message, "error");
                    })
                }

            }

        }
    }, [orders])

    useEffect(() => {
        loadOrders()
    }, [])

    return (<>
        <Container style={{ height: '100%' }} maxWidth="xl" className="mainContainerDiv main_results">
            <div style={{ marginBottom: '32px' }} className="admin_heading">
                <Typography variant="h1" component="h1">{t("payment:ORDERS")}</Typography>
                <Divider variant="insert" className='heading_divider' />
            </div>
            <Grid container sx={{ height: 'calc(100% - 65px)', flexWrap: 'nowrap', flexDirection: isSmUp ? 'row' : 'column' }} >
                <Navigation triggerActiveIndex={showHelp?1:0} items={[
                    { name: t("payment:MY_ORDERS"), onClick: () => { setShowHelp(false) } },
                    { name: t("payment:HELP"), onClick: () => { setShowHelp(true) } }
                ]}>

                </Navigation>
                <Grid container item>
                    {!showHelp && <>
                        {getOrdersInMonths(0, 1).length > 0 && <Typography sx={{ fontSize: '21px !important', fontWeight: 'bold', marginBottom: '24px' }}>{t("payment:ORDERS_FROM_LAST_MONTH")}</Typography>}
                        {getOrdersInMonths(0, 1).map(order => <Order order={order} setSelectedOrder={setSelectedOrder}></Order>)}

                        {getOrdersInMonths(1, 6).length > 0 && <Typography sx={{ fontSize: '21px !important', fontWeight: 'bold', marginBottom: '24px' }}>{t("payment:ORDERS_FROM_LAST_6_MONTHS")}</Typography>}
                        {getOrdersInMonths(1, 6).map(order => <Order order={order} setSelectedOrder={setSelectedOrder}></Order>)}

                        {getOrdersInMonths(6).length > 0 && <Typography sx={{ fontSize: '21px !important', fontWeight: 'bold', marginBottom: '24px' }}>{t("payment:ORDERS_OLDER_THAN_6_MONTHS")}</Typography>}
                        {getOrdersInMonths(6).map(order => <Order order={order} setSelectedOrder={setSelectedOrder}></Order>)}

                        {orders.length == 0 && <Text>{t("payment:NO_ORDERS_YET")}</Text>}
                    </>}
                    {showHelp && <Text>{t("payment:PAGE_UNDER_CONSTRUCTION")}</Text>}
                </Grid>
            </Grid>
        </Container>
        {selectedOrder && <Dialog
            PaperProps={{
                sx: {
                    maxWidth: { xs: '90%', md: '800px' },
                    borderRadius: '8px'
                }
            }}
            sx={{ display: 'block', scroll: 'auto', zIndex: 1020, overflowX: 'hidden' }}
            open={selectedOrder ? true : false}
            onClose={() => setSelectedOrder(undefined)}
        >
            <Order onCloseDetails={()=>{setSelectedOrder(undefined); setShowHelp(true)}} order={selectedOrder} setSelectedOrder={setSelectedOrder} details={true}></Order>
        </Dialog>}
    </>
    )
}
