const { authJwt } = require("../middlewares");
const controller = require("../controllers/interest.controller");
const asyncHandler = require("express-async-handler");
const api = "/api/v1/interests/";

module.exports = function(app) {
    app.get(api, [authJwt.verifyToken, authJwt.canCreateContent], asyncHandler(controller.getAllInterests));
}