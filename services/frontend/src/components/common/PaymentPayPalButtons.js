import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";


// PayPal
import { PayPalButtons } from "@paypal/react-paypal-js";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

//Services
import AuthService from "services/auth.service";
import OrderService from "services/order.service";
import ValidatorsService from "services/validators.service";


//Context
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import { useShoppingCartContext } from "components/_ContextProviders/ShoppingCartProvider/ShoppingCartProvider";



const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID


export default function PaymentPayPalButtons({ style, onApprove, forceAccepting = true }) {
    const { t } = useTranslation(['translation']);

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

    const currentClientRef = useRef(currentClient)
    const currentInvoiceRef = useRef(currentInvoice)
    const currentShoppingCartRef = useRef(currentShoppingCart)


    useEffect(() => {
        currentClientRef.current = currentClient
        currentInvoiceRef.current = currentInvoice
        currentShoppingCartRef.current = currentShoppingCart
    }, [currentClient, currentInvoice, currentShoppingCartRef])


    const disabled = () => {
        if (getTotalPrice() == 0) return true
        
        if (forceAccepting && (currentClient.acceptTerms && currentClient.acceptPolicy)) return false
        else if (forceAccepting && (!currentClient.acceptTerms || !currentClient.acceptPolicy)) return true

        if (currentClient.email && currentClient.firstName && currentClient.lastName) {
            if (currentInvoice.requested) {
                if (currentInvoice.companyId && currentInvoice.companyName) return false
                else return true
            } else return false

        }
        return true
        // //F_showToastMessage(t('payment:PROVIDE_ALL_REQUIRED'),'error')
        // let isValid = ValidatorsService.isValidEmailAddress(currentClient.email)
        // setEmailValid(isValid)
    }

    const getPurchaseUnits = () => {
        return [
            {
                description: "BrainCore Academy",
                amount: {
                    currency_code: getCurrencyCode(),
                    value: getTotalPrice().toString(),
                    breakdown: {
                        item_total: { value: getTotalPrice().toString(), currency_code: getCurrencyCode() }
                    },
                },
                items: currentShoppingCartRef.current.map(e => {
                    return {
                        name: e.name,
                        quantity: '1',
                        unit_amount: { value: e.price.toString(), currency_code: getCurrencyCode() }
                    }
                })
            }
        ]

    }

    return (
        <PayPalScriptProvider options={{
            "client-id": PAYPAL_CLIENT_ID,
            currency: getCurrencyCode(),
            intent: "capture"
        }}>
            <PayPalButtons style={style}
                disabled={disabled()}
                createOrder={(data, actions) => {

                    // If email is invalid do not sent it to PayPal
                    // This would couse 400 400 Bad Request Error
                    let email = AuthService.getCurrentUser().email;
                    var re = /\S+@\S+\.\S+/;
                    if (email && !re.test(email)) email = undefined


                    return actions.order.create({
                        payer: {
                            "name": {
                                "given_name": currentClient.firstName,
                                "surname": currentClient.lastName
                            },
                            "email_address": email,
                        },
                        purchase_units: getPurchaseUnits(),
                    }).then(async function (orderId) {
                        let purchaseUnits = getPurchaseUnits()
                        await OrderService.create(orderId, purchaseUnits[0].items, currentClientRef.current, currentInvoiceRef.current, getCurrencyCode(), currentShoppingCartRef.current)
                        return orderId
                    });;
                }}
                onApprove={(data, actions) => {
                    return actions.order.capture().then((details) => {
                        F_handleSetShowLoader(true)
                        OrderService.updateStatus(details.id).then(res => {
                            F_handleSetShowLoader(false)
                            onApprove()
                        }).catch(err => {
                            F_showToastMessage(t("Could not update the payment status."), 'error')
                            F_handleSetShowLoader(false)
                            onApprove()
                        });

                    });
                }}
                onError={(err) => {
                    console.log(err)
                    F_showToastMessage(t("Payment failed, please try again."), 'error')
                }}
                onCancel={(data) => {
                    F_showToastMessage(t("Payment canceled, please try again."), 'info')
                }}

            />
        </PayPalScriptProvider>

    );
}




