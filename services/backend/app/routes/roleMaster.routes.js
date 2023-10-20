const { authJwt } = require("../middlewares");
const controller = require("../controllers/roleMaster.controller");
const api = "/api/v1/rolemasters/";
const asyncHandler = require("express-async-handler");

module.exports = function(app) {
    app.get(`${api}list`, [authJwt.verifyToken, authJwt.canViewRolesPermissions], asyncHandler(controller.getAllRolePermissionsMappings))
    app.route(api)
    .get([authJwt.verifyToken, authJwt.canViewRolesPermissions], asyncHandler(controller.getAllRoleMasters))
    .post([authJwt.verifyToken, authJwt.canEditRolesPermissions], asyncHandler(controller.createRoleMaster));

    app.route(`${api}:id`)
    .get([authJwt.verifyToken, authJwt.canViewRolesPermissions], asyncHandler(controller.findRoleMasterById))
    .patch([authJwt.verifyToken, authJwt.canEditRolesPermissions], asyncHandler(controller.updateRoleMasterByQuery))
    .delete([authJwt.verifyToken, authJwt.canEditRolesPermissions], asyncHandler(controller.deleteRoleMaster));
}