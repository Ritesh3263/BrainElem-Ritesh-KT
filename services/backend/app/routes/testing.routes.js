const { authJwt } = require("../middlewares");
const asyncHandler = require("express-async-handler");
const controller = require("../controllers/testing.controller");

const api = "/api/v1/test";

module.exports = function (app){
    app.post(`${api}/mobile-notification`, [authJwt.verifyToken], asyncHandler(controller.sendMobileNotification));
}