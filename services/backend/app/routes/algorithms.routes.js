const { authJwt } = require("../middlewares");
const controller = require("../controllers/algorithms.controller");
const asyncHandler = require("express-async-handler");
const api = "/api/v1/algorithms/";

module.exports = function (app) {
    app.post(api+"detect/capsules", [authJwt.verifyToken, authJwt.canCreateContent], asyncHandler(controller.detectCapsules));
    app.post(api+"detect/chapters", [authJwt.verifyToken, authJwt.canCreateContent], asyncHandler(controller.detectChapters));
    app.post(api+"detect/training-modules", [authJwt.verifyToken, authJwt.canCreateContent], asyncHandler(controller.detectTrainingModules));
    app.post(api+"detect/levels", [authJwt.verifyToken, authJwt.canCreateContent], asyncHandler(controller.detectLevels));

    app.post(api+"suggest/capsules", [authJwt.verifyToken], asyncHandler(controller.suggestCapsules));
    app.post(api+"suggest/chapters", [authJwt.verifyToken], asyncHandler(controller.suggestChapters));
}
