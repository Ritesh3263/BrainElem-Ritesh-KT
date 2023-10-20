const db = require("../models");

const moduleUtils = require("../utils/module");

const creditUtils = require("../utils/credit");

/**
 * @openapi
 * /api/v1/credits/modules:
 *   get:
 *     description: |
 *       Get credits for the user himself
 *     tags:
 *      - _credits
 *     responses:
 *       200:
 *        description: List of users with credits
 *        example: []
 * 
*/
exports.getCreditsForUser = async (req, res) => {
    let user = await db.user.findById(req.userId)

    // By default take current module
    var moduleId = req.moduleId
    if (!moduleId) {// For marketing manager - he does not have a moduleId in credits interface
        let usersModules = await user.getModules()
        moduleId = usersModules.filter(m => m.moduleType == 'COGNITIVE')[0]._id
    }

    let moduleCore = await db.moduleCore.findOne({ moduleId: moduleId })
    if (!moduleCore) return res.status(404).json({ 'message': 'MODULE_NOT_FOUND', 'module': moduleId });


    let data = creditUtils.getCreditData(user, moduleCore)

    res.status(200).json(data);

}

/**
 * @openapi
 * /api/v1/credits/modules/{moduleId}:
 *   get:
 *     description: |
 *       Get credits for all the users in module. This can be used to mangege credits in a module
 *     tags:
 *      - _credits
 *     parameters:
 *       - name: moduleId
 *         in: path
 *         required: true
 *         type: string
 *         example: "333000000000000000000000"
 *         description: Id of the module
 *     responses:
 *       200:
 *        description: List of users with credits
 *        example: []
 * 
*/
exports.getCreditsForModule = async (req, res) => {
    moduleId = req.params.moduleId;
    let moduleCore = await db.moduleCore.findOne({ moduleId: moduleId })
    if (!moduleCore) return res.status(404).json({ 'message': 'MODULE_NOT_FOUND', 'module': moduleId });


    let moduleUsers = await moduleUtils.getAllUsersInModule(req.userId, moduleId, false)

    let credits = [];
    for (let user of moduleUsers) {

        let blockedByCredits = await db.result.count({ inviter: user._id, blockedByCredits: true })
        let available = creditUtils.getAvailableCreditNumber(user._id, moduleCore)
        let used = creditUtils.getUsedCreditNumber(user._id, moduleCore)
        let percentage = creditUtils.getUsedCreditPercentage(user._id, moduleCore)
        let requested = 0
        let requestedDate = '-'
        let requestedStatus = '-'
        let userName = user.name + " " + user.surname
        if (user.name == '_') userName = user.email

        let data = { id: user._id, user: userName, available: available, used: used, percentage: percentage, blockedByCredits: blockedByCredits, requested: requested, requestedDate: requestedDate, requestedStatus: requestedStatus }
        credits.push(data)
    }
    res.status(200).json(credits);

}

/**
 * @openapi
 * /api/v1/credits/requests/modules/{moduleId}:
 *   get:
 *     description: |
 *       Get requests for all the users in module. This can be used to mangege requests in a module
 *     tags:
 *      - _credits
 *     parameters:
 *       - name: moduleId
 *         in: path
 *         required: true
 *         type: string
 *         example: "333000000000000000000000"
 *         description: Id of the module
 *     responses:
 *       200:
 *        description: List of users with requests
 *        example: []
 * 
*/
exports.getCreditsRequestsForModule = async (req, res) => {
    moduleId = req.params.moduleId;
    let moduleCore = await db.moduleCore.findOne({ moduleId: moduleId })
    if (!moduleCore) return res.status(404).json({ 'message': 'MODULE_NOT_FOUND', 'module': moduleId });
    let moduleUsers = await moduleUtils.getAllUsersInModule(req.userId, moduleId, false)
    let moduleUsersIds = moduleUsers.map(u => u._id)
    let requests = await db.creditsRequest.find({ user: { $in: moduleUsersIds } })
    .populate({ path: "user", select: 'name surname email' })
    .sort({ createdAt: -1 });

    let requestsToReturn = []
    for (let request of requests) {
        let user = request.user
        let userName = user.name + " " + user.surname
        if (user.name == '_') userName = user.email
        let requestToReturn = { ...request.toObject(), id: request._id, user: userName, userId: user._id }

        requestsToReturn.push(requestToReturn)
    }
    res.status(200).json(requestsToReturn);

}

/**
 * @openapi
 * /api/v1/credits/modules/all:
 *   get:
 *     description: |
 *       Get credits for all modules. This can be used by marketing manager.
 *     tags:
 *      - _credits
 *     responses:
 *       200:
 *        description: List of modules
 *        example: []
 * 
*/
exports.getCreditsForModules = async (req, res) => {
    let user = await db.user.findById(req.userId)

    // Find the first subscription for the user
    // multiple subscriptions are not supported
    let subscriptions = await user.getSubscriptions()
    let subscription = subscriptions[0].toObject()
    // Take only cognitive modules (Sentinel + BrainCore EDU)
    let modules = subscription?.modules?.filter(m => m.moduleType == 'COGNITIVE')
    modules = await Promise.all(modules.map(async x => {
        x.assignedManagers = await db.user.find(
            { "scopes.name": "modules:all:" + x._id },
            "name surname username")
        return x
    }))
    for (let module of modules) {
        module.id = module._id
        let moduleCore = await db.moduleCore.findOne({ _id: module.core }, { 'credits': 1, moduleId: 1 })
        module.used = moduleCore.credits.reduce((n, { used }) => n + used, 0)
        module.available = 0
        // Calculate available credits
        let users = await moduleUtils.getAllUsersInModule(req.userId, moduleCore.moduleId, false)
        for (let user of users) {
            let available = creditUtils.getAvailableCreditNumber(user._id, moduleCore)
            if (available >= 0) module.available += available
        }
    }



    res.status(200).json(modules);

}

/**
 * @openapi
 * /api/v1/credits/reject/{requestId}:
 *   post:
 *     description: |
 *       Reject request forc
 *     tags:
 *      - _credits
 *     parameters:
 *       - name: requestId
 *         in: path
 *         required: true
 *         type: string
 *         example: "333000000000000000000000"
 *         description: Id of the request
 *     responses:
 *       200:
 *        description: Message
 *        example: {}
 * 
*/
exports.rejectCreditRequest = async (req, res) => {
    let request = await db.creditsRequest.findOne({ _id: req.params.requestId, status: "AWAITING" })
    if (!request) return res.status(404).json({ message: "REQUEST_NOT_FOUND" })

    var to = await db.user.findById(request.user)
    // By default take current module 
    var toModuleId = req.moduleId;
    if (moduleUtils.isMarketingManager(req.userId)) {// For marketing manager find them
        let toModules = await to.getModules()
        toModuleId = toModules.filter(m => m.moduleType == 'COGNITIVE')[0]._id
    }
    // Get available users and make sure the user has access
    let toUsers = await moduleUtils.getAllUsersInModule(req.userId, toModuleId, false)
    if (toUsers.map(u => u._id).includes(to._id)) return res.status(404).json({ message: "USER_NOT_FOUND" })


    request.status = "REJECTED"
    await request.save()
    res.status(200).json({ message: "REQUEST_REJECTED" })
}

/**
 * @openapi
 * /api/v1/credits/transfer:
 *   post:
 *     description: |
 *       Transfer credits from one user to another. 
 *       This is used for accepting the credits requests when `requestId` is provided.
 *       Parameter `from`, `to` and `number` can be used as an alternative to requestId. 
 *     tags:
 *      - _credits
 * 
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *            type: object
 *            properties:
 *              requestId:
 *                type: string
 *                description: Id of request for which transfer will take place. When not provided, others paramerers will be used.
 *                example: "333000000000000000000000"
 *              from:
 *                type: string
 *                description: Id of user from which credits will be transfered - only used when requestId is not provided
 *                example: "333000000000000000000000"
 *              to:
 *                type: string
 *                description: Id of user to which credits will be transfered  - only used when requestId is not provided
 *                example: "333000000000000000000000"
 *              number:
 *                type: number
 *                description: Number of credits to be transfered - only used when requestId is not provided
 *                example: 5
 *     responses:
 *       200:
 *        description: Message
 *        example: {message: "TRANSFER_SUCCESSFUL"}
 * 
*/
exports.transferCredits = async (req, res) => {
    var from, to, number, request;

    if (req.body.requestId) { // TRANSFER FOR THE REQUEST ######
        request = await db.creditsRequest.findOne({ _id: req.body.requestId, status: "AWAITING" })
        if (!request) return res.status(404).json({ message: "REQUEST_NOT_FOUND" })
        number = request.number
        from = await db.user.findById(req.userId)
        to = await db.user.findById(request.user)
    } else {// TRNASFER WITHOUT REQUEST ########################
        number = req.body.number
        // Find users
        from = await db.user.findById(req.body.from)
        to = await db.user.findById(req.body.to)
    }


    // Validate number
    if (!Number.isInteger(number) || number < 0) return res.status(400).json({ message: "INVALID_NUMBER", number: number })

    // Make sure users exist
    if (!from || !to) return res.status(404).json({ message: "USER_NOT_FOUND" })

    // By default take current module 
    var fromModuleId = req.moduleId;
    var toModuleId = req.moduleId;
    if (moduleUtils.isMarketingManager(req.userId)) {// For marketing manager find them
        let fromModules = await from.getModules()
        fromModuleId = fromModules.filter(m => m.moduleType == 'COGNITIVE')[0]._id
        let toModules = await to.getModules()
        toModuleId = toModules.filter(m => m.moduleType == 'COGNITIVE')[0]._id
    }
    // Check if module ids exists
    if (!fromModuleId || !toModuleId) return res.status(404).json({ message: "MODULE_NOT_FOUND" })

    // Find module cores
    let fromModuleCore = await db.moduleCore.findOne({ moduleId: fromModuleId })
    let toModuleCore = await db.moduleCore.findOne({ moduleId: toModuleId })
    if (!fromModuleCore || !toModuleCore) return res.status(404).json({ message: "MODULE_CORE_NOT_FOUND" })

    // Get available users
    // Chek if users are allowed to be eddited (if they are on the list) 
    let fromUsers = await moduleUtils.getAllUsersInModule(req.userId, fromModuleId, false)
    let toUsers = await moduleUtils.getAllUsersInModule(req.userId, toModuleId, false)
    if (fromUsers.map(u => u._id).includes(from._id) || toUsers.map(u => u._id).includes(to._id)) return res.status(404).json({ message: "USER_NOT_FOUND" })

    // Get available credits and check if there is sufficient number
    let fromAvailable = creditUtils.getAvailableCreditNumber(from._id, fromModuleCore)
    if (number > fromAvailable) return res.status(403).json({ message: "NO_SUFFICIENT_CREDITS" })

    // Transfer the credits
    await creditUtils.deductCredits(from._id, fromModuleId, number, countUsed = false)
    await creditUtils.assignCredits(to._id, toModuleId, number)

    if (request) {
        request.status = "ACCEPTED"
        await request.save()
        return res.status(200).json({ message: "REQUEST_ACCEPTED" })
    } else {
        res.status(200).json({ message: "TRANSFER_SUCCESSFUL" })
    }
}


/**
 * @openapi
 * /api/v1/credits/request:
 *   post:
 *     description: |
 *       Request credits for the user
 *     tags:
 *      - _credits
 * 
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *            type: object
 *            properties:
 *              number:
 *                type: number
 *                description: Number of credits to be requested
 *                example: 5
 *     responses:
 *       200:
 *        description: Message
 *        example: {message: "REQUESTED_SUCCESSFULLY"}
 * 
*/
exports.requestCredits = async (req, res) => {
    // Check number of credits
    let number = req.body.number
    let request = new db.creditsRequest({ user: req.userId, number: number })
    await request.save()
    res.status(200).json({ message: "REQUESTED_SUCCESSFULLY" })

}