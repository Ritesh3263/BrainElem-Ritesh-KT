import React, {useEffect, useRef} from "react";
import { theme } from "MuiTheme";
import { useTranslation } from "react-i18next";
import {useReactToPrint} from "react-to-print";

// Services
import OrderService from "services/order.service";

//Context
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

// MUI v5
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Grid";


// Styled compnents
import { ETextWithLabel } from "styled_components";
import OptionsButton from "components/common/OptionsButton";

export default function BillingInformation({open, setOpen, certificationSessionId}) {
    const [order, setOrder] = React.useState();
    const { t } = useTranslation();

    const {F_showToastMessage, F_getLocalTime} = useMainContext();
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const buttons = [
        { id: 1, name: t("Download"), action: handlePrint }
    ];


    function fetchOrder(){
        OrderService.getByCertificationSessionId(certificationSessionId).then(res=>{
            setOrder(res.data)
            // If payment is not COMPLETED, refresh the status to make sure
            if (res.data.status != "COMPLETED" || (res.data.invoice?.requested && !res.data?.invoice?.sent)  ){
                OrderService.updateStatus(res.data.providerId).then(res=>{
                    OrderService.getByCertificationSessionId(certificationSessionId).then(res=>{
                        setOrder(res.data)
                    })
                }).catch(err=>{
                    let message = t("Error while updating order status.")
                    if (err.response.data.message) message = t(err.response.data.message)
                    F_showToastMessage(message, "error");
                })

            }
        }).catch(err=>{
            F_showToastMessage(t("Could not load the order"), "error");
        })

    }

    useEffect(()=>{
        if (certificationSessionId){
            fetchOrder();
        }
    },[certificationSessionId]);

    return (
        <Dialog
            ref={componentRef}
            PaperProps={{
                style: { borderRadius: "8px", background: theme.palette.glass.opaque, backdropFilter: "blur(20px)" }
            }}
            maxWidth={"sm"}
            open={open}
            onClose={()=>setOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle >
                <Grid container sx={{ mt: 1 }}>
                    <Grid item xs={10} >
                        <Typography variant="h3" component="h3"
                            style={{ fontWeight: "bold", textAlign: "left", fontSize: "36px", color: theme.palette.primary.lightViolet }}>
                            {t("Order Details")}
                        </Typography>
                    </Grid>
                    <Grid container sx={{ mb:2 }} item xs={2} justifyContent="end" alignItems="end">
                        <OptionsButton iconButton={true} btns={buttons} />
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent>
                {order && <Grid container>
                    <Grid item xs={12} sx={{ mb: 1 }}>
                        <Typography variant="h5" component="h5" style={{ textAlign: "left", fontSize: "18px" }}>
                            {t("General")}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ETextWithLabel label={t("Payment status")} value={t(order.status)} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ETextWithLabel label={t("Order on")} value={F_getLocalTime(order.createdAt)} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ETextWithLabel label={t("Payent method")} value="PayPal" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ETextWithLabel label={t("Order number")} value={order.providerId} />
                    </Grid>

                    <Grid item xs={12} md={12} sx={{mb:1, mt:2}}>
                        <Typography variant="h5" component="h5" style={{ textAlign: "left", fontSize: "18px" }}>
                            {t("Personal details")}
                        </Typography>
                    </Grid>
                    <Grid item md={6}>
                        <ETextWithLabel label={t("First name")} value={order.client.firstName} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ETextWithLabel label={t("Last name")} value={order.client.lastName} />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <ETextWithLabel label={t("Street")} value={order.client.addressStreet} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ETextWithLabel label={t("Postcode")} value={order.client.addressPostcode} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ETextWithLabel label={t("City")} value={order.client.addressCity} />
                    </Grid>

                    {order.invoice.requested && <>
                        <Grid item xs={12} md={12} sx={{mb:1, mt:2}}>
                            <Typography variant="h5" component="h5" style={{ textAlign: "left", fontSize: "18px" }}>
                                {t("Invoice details")}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <ETextWithLabel label={t("Company name")} value={order.invoice.companyName} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <ETextWithLabel label={t("Company ID")} value={order.invoice.companyId} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <ETextWithLabel label={t("Email")} value={order.invoice.email} />
                        </Grid>
                    </>}

                </Grid>}
            </DialogContent>
        </Dialog>
    );
}