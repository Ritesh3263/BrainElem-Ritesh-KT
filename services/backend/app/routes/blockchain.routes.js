const { authJwt } = require("../middlewares");
const controller = require("../controllers/blockchain.controller");
const asyncHandler = require("express-async-handler");
const api = "/api/v1/blockchain/";

module.exports = function(app) {
    app.get(api+"contracts", [authJwt.verifyToken, authJwt.isAdmin], asyncHandler(controller.getContracts));
    app.post(api+"contracts/:contractName/networks", [authJwt.verifyToken, authJwt.isAdmin], asyncHandler(controller.addNetwork));
    app.get(api+"scripts/:scriptName", [], asyncHandler(controller.getScript));
}