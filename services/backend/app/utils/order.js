var axios = require('axios');
const db = require("../models");

// Return proper PayPal URL based on BACKEND_ENV
exports.getPayPalUrl = () => {
    // Local/dev/stage
    if (process.env.BACKEND_ENV != "production") return 'https://api-m.sandbox.paypal.com';
    // Production
    else return 'https://api-m.paypal.com';

}

// Generate access token for PayPal
exports.getPayPalAccessToken = (callback, callbackError) => {
    axios.post(
        `${this.getPayPalUrl()}/v1/oauth2/token`,// URL 
        'grant_type=client_credentials', // DATA
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            auth: {
                username: process.env.PAYPAL_CLIENT_ID,
                password: process.env.PAYPAL_SECRET
            }
        }
    )
        .then(response => { callback(response.data.access_token) })
        .catch(err => callbackError(err));
}


// Get time in local timezone using UTC time from database 
const getDateForInvoice = (time) => {
    let localTime = new Date(time)
    const offset = localTime.getTimezoneOffset()
    localTime = new Date(localTime.getTime() - (offset * 60 * 1000))
    return localTime.toISOString().split('T')[0]
}


// Generate invoice
// return {status: <boolen>, code: <number>, message: <string>}
exports.createInvoice = async (providerOrder, order, token) => {

    let invoiceDate = getDateForInvoice(order.createdAt);


    //https://developer.paypal.com/docs/invoicing/
    let data = {
        "detail": {
            //"invoice_number": invoiceNumber,
            //"reference": "deal-ref",
            "invoice_date": invoiceDate,
            "currency_code": "EUR",
            //"note": "Thank you for your business.",
            //"term": "No refunds after 30 days.",
            //"memo": "This is a long contract",
            // "payment_term": {
            //     "term_type": "NET_10",
            //     "due_date": "2020-11-22"
            // }
        },
        "invoicer": {
            "name": {
                "given_name": process.env.PAYPAL_INVOICER_FIRSTNAME,
                "surname": process.env.PAYPAL_INVOICER_LASTNAME
            },
            "email_address": process.env.PAYPAL_INVOICER_EMAIL,
            // "phones": [
            //     {
            //         "country_code": "001",
            //         "national_number": "4085551234",
            //         "phone_type": "MOBILE"
            //     }
            // ],
            // "website": "https://example.com",
            "tax_id": process.env.PAYPAL_INVOICER_COMPANY_ID,
            // "logo_url": "https://example.com/logo.PNG",
            // "additional_notes": "example note"
            "business_name": process.env.PAYPAL_INVOICER_COMPANY_NAME,
        },
        "primary_recipients": [
            {
                "billing_info": {
                    "business_name": `${order.invoice.companyName} (id: ${order.invoice.companyId})`,
                    "name": {
                        "given_name": order.client.firstName,
                        "surname": order.client.lastName
                    },
                    "address": {
                        "address_line_1": order.client.addressStreet,
                        "address_line_2": '',
                        "admin_area_2": '',
                        "admin_area_1": order.client.addressCity,
                        "postal_code": order.client.addressPostcode,
                        "country_code": providerOrder.payer.address.country_code
                    },
                    "email_address": order.invoice.email,
                    //"additional_info_value": "add-info"
                },
            }
        ],
        "items": providerOrder.purchase_units[0].items.map(item=>{
            return {...item, tax: {name: "Sales Tax","percent": process.env.PAYPAL_INVOICE_TAX_PERCENTAGE} }
        }),
        "configuration": {
            "tax_inclusive": true,
        },
    }

    try {
        let response = await axios.post(
            `${this.getPayPalUrl()}/v2/invoicing/invoices`,// URL 
            data,
            { headers: { Authorization: "Bearer " + token } }
        )

        order.invoice = { ...order.invoice, href: response.data.href};
        await order.save()
        order.markModified('invoice');
        //console.log('CREATED INVOICE FOR ORDER: ', providerOrder, providerOrder.purchase_units[0])
        return { status: true, code: 200, message: "Invoice created" }
    } catch (error) {
        console.log(error?.response?.data)
        return { status: false, code: 500, message: error.message, data: error?.response?.data }

    }

}

// Send invoice to the customer
// return {status: <boolen>, code: <number>, message: <string>}
exports.sendInvoice = async (order, token) => {
    try {
        let response = await axios.post(
            `${order.invoice.href}/send`,// URL 
            { "send_to_invoicer": true }, // DATA
            { headers: { Authorization: "Bearer " + token } }
        )

        order.invoice = { ...order.invoice, sent: true };
        order.markModified('invoice');
        await order.save()
        return { status: true, code: 200, message: "Invoice sent" }
    } catch (error) {
        console.log('errr', error?.response?.data)
        return { status: false, code: 500, message: error.message, data: error?.response?.data }
    }
}