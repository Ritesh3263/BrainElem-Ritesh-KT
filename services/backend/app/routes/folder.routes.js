const { authJwt } = require("../middlewares");
const controller = require("../controllers/folder.controller");
const api = "/api/v1/folder/";
const asyncHandler = require("express-async-handler");

module.exports = function(app) {
    app.route(api)
        .get([authJwt.verifyToken], asyncHandler(controller.getRootFolder))
        .post([authJwt.verifyToken], asyncHandler(controller.create));

    app.route(`${api}:id`)
        .get([authJwt.verifyToken], asyncHandler(controller.getFolder))
        .put([authJwt.verifyToken], asyncHandler(controller.update))
        .delete([authJwt.verifyToken], asyncHandler(controller.delete));

    app.route(`${api}:id/tail`)
        .get([authJwt.verifyToken], asyncHandler(controller.getFolderTail));

    app.route(`${api}:id/add`)
        .put([authJwt.verifyToken], asyncHandler(controller.addContentsToFolder));
}