const { authJwt } = require("../middlewares");
const controller = require("../controllers/subscription.controller");
const asyncHandler = require("express-async-handler");
const api = "/api/v1/subscriptions/";

module.exports = function(app) {
	app.get(api+"readAll",[authJwt.verifyToken], asyncHandler(controller.readAll));
	app.put(api+'update/:subscriptionId', [authJwt.verifyToken, authJwt.canReadSubscription], asyncHandler(controller.update));
	app.delete(api+"remove/:subscriptionId", [authJwt.verifyToken, authJwt.canWriteSubscription], asyncHandler(controller.remove));
	app.post(api+"add/:ecosystemId", [authJwt.verifyToken, authJwt.canReadEcosystem], asyncHandler(controller.add));
	app.post(api+"add-owner/:ecosystemId", [authJwt.verifyToken, authJwt.canReadEcosystem], asyncHandler(controller.addOwner));
	app.put(api+"update-owner/:userId", [authJwt.verifyToken, authJwt.canWriteUser], asyncHandler(controller.updateOwner));
	app.get(api+"get-owners/:ecosystemId",[authJwt.verifyToken, authJwt.canReadEcosystem], asyncHandler(controller.readAllSubscriptionOwners));
	app.get(api+"get-free-owners/:subscriptionId",[authJwt.verifyToken], asyncHandler(controller.readAllFreeSubscriptionOwners));
	app.get(api+"get-subscription-owner/:subscriptionId",[authJwt.verifyToken, authJwt.canReadSubscription], asyncHandler(controller.getSubscriptionOwner)); // authJwt.canReadSubscription removed, TODO: as canReadSubscription is not loading req.param anymore it must be adjusted// getting the subscriptionId in the params now
	app.delete(api+"remove-owner/:userId", [authJwt.verifyToken, authJwt.canWriteUser], asyncHandler(controller.removeOwner));
};
