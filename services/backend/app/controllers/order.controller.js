const db = require("../models");
const mongoose = require('mongoose')
const orderUtils = require("../utils/order")
const resultUtils = require("../utils/result");
const certificationSessionUtils = require("../utils/certificationSession");
const certificationSessionAuthUtils = require("../utils/certificationSessionAuth");
var axios = require('axios');



/**
 * @openapi
 * /api/v1/orders/all:
 *   get:
 *     description: |
 *       Get all orders for the user
 *     tags:
 *      - _orders
 *     responses:
 *       200:
 *        description: List of orders
 *        example: [{"certificationSessions":[],"results":[{"_id":"4444444446ba4d0fbef5bbbb","content":"60ccccef2b4c80000732fdf5"}],"status":"COMPLETED","providerItems":[{"name":"Report - BrainCore Pro - 04/04/2021","unit_amount":{"currency_code":"EUR","value":"19.99"},"quantity":"1"}],"_id":"64954297dc4fcf0027032d46","providerId":"8BX75844K6975332P","user":"999979999999900000000001","value":19.99,"client":{"email":"adrihanu@gmail.com","firstName":"Adrian","lastName":"Hanusiak","addressStreet":"","addressCity":"","addressPostcode":"","acceptTerms":false,"acceptPolicy":false},"invoice":{"requested":false,"email":"adrihanu@gmail.com","companyId":"","companyName":""},"currencyCode":"EUR","createdAt":"2023-06-23T06:58:31.797Z","updatedAt":"2023-06-23T06:59:08.345Z","__v":1},{"certificationSessions":[],"results":[{"_id":"642289e0a551e6039dbd46eb","content":"60ccccef2b4c80000732fdf5"}],"status":"COMPLETED","providerItems":[{"name":"Rapport - BrainCore Pro - 28/03/2023","unit_amount":{"currency_code":"CHF","value":"19.99"},"quantity":"1"}],"_id":"64955cffdc4fcf0027035dcc","providerId":"0KY903199S363680A","user":"999979999999900000000001","value":19.99,"client":{"email":"adrihanu@gmail.com","firstName":"Adrian","lastName":"Hanusiak","addressStreet":"","addressCity":"","addressPostcode":"","acceptTerms":false,"acceptPolicy":false},"invoice":{"requested":true,"email":"adrihanu@gmail.com","companyId":"Adrian","companyName":"Adrian Hanusiak","href":"https://api.sandbox.paypal.com/v2/invoicing/invoices/INV2-V4PR-E4LK-96UR-SNT9","sent":true},"currencyCode":"CHF","createdAt":"2022-06-23T08:51:11.814Z","updatedAt":"2023-06-23T08:51:59.687Z","__v":1}]
 * 
*/
exports.getOrders = async (req, res) => {
    let orders = await db.order.find({ user: req.userId })
        .sort("-createdAt")
        .populate({ path: "results", select: 'content' })

    res.status(200).json(orders);

}

/**
 * @openapi
 * /api/v1/orders/getByResultId/{resultId}:
 *   get:
 *     description: |
 *       Find order using result ID
 *     parameters:
 *       - name: resultId
 *         in: path
 *         required: true
 *         type: string
 *         example: 647cbdcf56514c12aaafce11
 *         description: Id of result
 *     tags:
 *      - _orders
 *     responses:
 *       200:
 *        description: Order object
 * 
*/
exports.getByResultId = async (req, res) => {
    db.order.findOne({ user: req.userId, results: req.params.resultId }, {}, { sort: { 'createdAt': -1 } },
        (err, order) => {
            if (err) res.status(500).send({ message: err });
            else if (!order) res.status(404).send({ message: "Order not found" });
            else res.status(200).json(order);
        })


}

/**
 * @openapi
 * /api/v1/orders/getByCertificationSessionId/{certificationSessionId}:
 *   get:
 *     description: |
 *       Find order using certification session ID
 *     parameters:
 *       - name: certificationSessionId
 *         in: path
 *         required: true
 *         type: string
 *         example: 647cbdcf56514c12aaafce11
 *         description: Id of certification session
 *     tags:
 *      - _orders
 *     responses:
 *       200:
 *        description: Order object
 * 
*/
exports.getByCertificationSessionId = async (req, res) => {
    db.order.findOne({ user: req.userId, certificationSessions: req.params.certificationSessionId }, {}, { sort: { 'createdAt': -1 } },
        (err, order) => {
            if (err) res.status(500).send({ message: err });
            else if (!order) res.status(404).send({ message: "Order not found" });
            else res.status(200).json(order);
        })


}




/**
 * @openapi
 * /api/v1/orders/create:
 *   post:
 *     description: | 
 *       Add new order based on data from request body.
 *       Object must follow all the rules from OrderSchema, 
 *       otherwise the validation errors will be returned when saving to database. 
 *     tags:
 *      - _orders
 *     parameters:
 *       - name: order
 *         in: body
 *         schema:
 *           type: object
 *           required:
 *             - providerId
 *           properties:
 *             providerId:
 *                type: string
 *                description: Id from provider(eg. PayPal)
 *                example: 6KD74050E0745505N
 *             providerItems:
 *                type: object
 *                description: Items objects send to provider
 *                example: [{"name":"Raport - BrainCore Pro - 28/03/2023","quantity":"1","unit_amount":{"value":"99.99","currency_code":"PLN"}}]
 *             currencyCode:
 *                type: string
 *                description: Currency code (ISO 4217)
 *                enum:
 *                - CHF
 *                - EUR
 *                - PLN
 *                example: PLN
 *             client:
 *                type: object
 *                description: Client object with name/lastname and contact details
 *                example: {"firstName":"Mark","lastName":"Jobs","addressStreet":"","addressCity":"","addressPostcode":"","acceptTerms":false,"acceptPolicy":false,"email":"test@gmail.com"}
 *             invoice:
 *                type: object
 *                description: Invoice object - when requested, invoice will be sent to provided email 
 *                example: {"requested":true,"email":"test@gmail.com","companyId":"12312123213123","companyName":"Braicore"}
 *             products:
 *                type: object
 *                description: List of products objects - those can be `results` or `certificationSessions`
 *                example: [{"_id":"642289e0a551e6039dbd46eb","name":"Raport - BrainCore Pro - 28/03/2023","price":99.99,"productType":"result"}]
 *     responses:
 *       200:
 *         example: {"message": "Created new order","orderId": "64959dc4a560410bf817c62a"}
 */
exports.create = async (req, res) => {

    var products = req.body.products

    // Byuing certification sessions
    let sessions = products.filter(p => p.productType == 'session')
    var sessionsValue = 0
    var certificationSessionsIds = []
    console.log(sessions)
    if (sessions.length) {
        certificationSessionsIds = sessions.map(e => mongoose.Types.ObjectId(e._id))
        // Get price of all sessions directly from databsae to prevent cheating
        var certificationSessions = await db.certificationSession.find({ '_id': { $in: certificationSessionsIds } }, {}, { sort: { 'createdAt': -1 } })
        sessionsValue = certificationSessions.map((cs) => { return cs.price }).reduce((a, b) => a + b);
        // Check if the each of session in shopping cart can be bought by this user 
        for (const cs of certificationSessions) {
            let canBuy = await certificationSessionAuthUtils.canBuyCertificationSession(req.userId, cs)
            if (!canBuy) return res.status(output.code).send({ message: output.message })
        }
    }

    var resultsValue = 0
    let results = products.filter(p => p.productType == 'result')
    let resultsIds = results.map(r => mongoose.Types.ObjectId(r._id))


    if (results.length) {
        for (let result of results) {
            let hasAccess = await resultUtils.hasAccessToFullReport(req.userId, result._id)
            if (hasAccess) return res.status(400).send({ message: "User already has access to full report" });

            let price = await resultUtils.getPrice(result._id, req.body.currencyCode)
            if (price != result.price) return res.status(403).send({ message: "Order price mismatch. Contact the administrator." });
            resultsValue += price
        }
    }


    var value = sessionsValue + resultsValue


    // Create order
    let order = new db.order({
        providerId: req.body.providerId,
        providerItems: req.body.providerItems,
        user: req.userId,
        value: value,
        results: resultsIds,
        certificationSessions: certificationSessionsIds,
        client: req.body.client,
        invoice: req.body.invoice,
        currencyCode: req.body.currencyCode
    })

    order.save(async (err, element) => {
        if (err) res.status(500).send({ message: err });
        else {
            if (certificationSessions) {
                for (const cs of certificationSessions) {
                    let alreadyEnrolled = await certificationSessionAuthUtils.isAlreadyEnrolled(req.userId, cs)
                    if (!alreadyEnrolled)
                        await certificationSessionUtils.enrollForCertificationSession(req.userId, cs._id)
                }
            }
            res.status(200).json({ message: "Created new order", orderId: element._id })
        }
    })
};


/**
 * @openapi
 * /api/v1/orders/updateStatus/{providerId}:
 *   post:
 *     description: | 
 *       Fetch order status from PayPal
 *     tags:
 *      - _orders
 *     parameters:
 *       - name: providerId
 *         in: path
 *         required: true
 *         type: string
 *         example: 6KD74050E0745505N
 *         description: Id of order on provider side
 *     responses:
 *       200:
 *         example: {"message": "Updated successfully"}
 */
exports.updateStatus = (req, res) => {
    orderUtils.getPayPalAccessToken(
        (token) => {
            axios.get(`${orderUtils.getPayPalUrl()}/v2/checkout/orders/${req.params.providerId}`,
                { headers: { Authorization: "Bearer " + token } })
                .then((response) => {
                    db.order.findOne(
                        { providerId: req.params.providerId }, {}, { sort: { 'createdAt': -1 } },
                        async (err, order) => {
                            if (err) res.status(500).send({ message: err });
                            else if (!order) res.status(404).send({ message: "Could not find order with such providerID" });

                            order.providerItems = response.data.purchase_units[0].items
                            order.markModified('providerItems')
                            await order.save()

                            if (order.value != response.data.purchase_units[0].amount.value) {
                                // Price calculated and saved in database is different than price paid on PayPal
                                res.status(403).send({ message: "Order price mismatch. Please contact the administrator." });
                            }
                            else if (order.currencyCode != response.data.purchase_units[0].amount.currency_code) {
                                // Currency saved in database is different than currency used on PayPal
                                res.status(403).send({ message: "Order currency mismatch. Please contact the administrator." });
                            }
                            else {
                                order.status = response.data.status
                                await order.save()
                                if (order.status == "COMPLETED" && order.invoice.requested && !order.invoice.sent) {
                                    if (!order.invoice.href) {
                                        let invoiceCreated = await orderUtils.createInvoice(response.data, order, token)
                                        if (!invoiceCreated.status) return res.status(invoiceCreated.code).send({ message: invoiceCreated.message });
                                    }

                                    let orderSent = await orderUtils.sendInvoice(order, token)
                                    if (!orderSent.status) return res.status(orderSent.code).send({ message: orderSent.message });
                                    else res.status(200).json({ message: "Updated successfully" });

                                } else res.status(200).json({ message: "Updated successfully" });
                            }
                        })
                },
                    (error) => {
                        res.status(500).send({ message: 'Could not get order status from PayPal - ' + error?.message });
                    });
        },
        (err) => {
            res.status(500).send({ message: "Could not connect to PayPal - " + err?.message });
        }
    );




};
