const { authJwt } = require("../middlewares");
const controller = require("../controllers/permissions.controller");
const api = "/api/v1/permissions/";
const asyncHandler = require("express-async-handler");

module.exports = function(app) {
    app.route(api)
    .get([authJwt.verifyToken, authJwt.canViewRolesPermissions], asyncHandler(controller.getAllPermissions))
    .post([authJwt.verifyToken, authJwt.canEditRolesPermissions], asyncHandler(controller.createPermissions));

    app.route(`${api}:id`)
    .get([authJwt.verifyToken, authJwt.canViewRolesPermissions], asyncHandler(controller.findPermissionsById))
    .patch([authJwt.verifyToken, authJwt.canEditRolesPermissions], asyncHandler(controller.updatePermissionsByQuery))
    .delete([authJwt.verifyToken, authJwt.canEditRolesPermissions], asyncHandler(controller.deletePermissions));
}