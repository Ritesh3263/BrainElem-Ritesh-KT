const { authJwt } = require("../middlewares");
const asyncHandler = require("express-async-handler");
const controller = require("../controllers/cloud.controller");
const api = "/api/v1/cloud/";

module.exports = function(app) {
    app.get(api+"private/:userId", [authJwt.verifyToken, authJwt.canReadCloud], asyncHandler(controller.getUserPrivateContents));
    app.get(api+"public/:userId", [authJwt.verifyToken, authJwt.canReadCloud], asyncHandler(controller.getUserPublicContents));
    app.get(api+"cocreated/:userId", [authJwt.verifyToken, authJwt.canReadCloud], asyncHandler(controller.getUserCoCreatedContents));
    app.get(api+"all", [authJwt.verifyToken, authJwt.canReadWholeCloud], asyncHandler(controller.getAllContents));
    app.get(api+"awaiting", [authJwt.verifyToken, authJwt.canReadWholeCloud], asyncHandler(controller.getAwaitingContents));
    app.put(api+"manage-content-status", [authJwt.verifyToken, authJwt.canReadWholeCloud], asyncHandler(controller.manageContentStatus));
}