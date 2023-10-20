const { authJwt } = require("../middlewares");
const controller = require("../controllers/admin.controller");
const asyncHandler = require("express-async-handler");
const api = "/api/v1/admin/";

module.exports = function(app) {
    app.get(api+"tasks/mail/:mailId", [authJwt.verifyToken, authJwt.isAdmin], asyncHandler(controller.sendMail));
    app.get(api+"tasks/tips/:userId", [authJwt.verifyToken, authJwt.isAdmin], asyncHandler(controller.assignTips));
    
    // scripts
    app.get(api+"addEventId", [authJwt.verifyToken, authJwt.isAdmin], asyncHandler(controller.addEventId));
    app.get(api+"changePasswords", [authJwt.verifyToken, authJwt.isAdmin], asyncHandler(controller.changePasswords)); 
    app.get(api+"publishGrades", [authJwt.verifyToken, authJwt.isAdmin], asyncHandler(controller.publishGrades)); 
    app.get(api+"addEvents", [authJwt.verifyToken, authJwt.isAdmin], asyncHandler(controller.addEvents)); 
    app.get(api+"addResults", [authJwt.verifyToken, authJwt.isAdmin], asyncHandler(controller.addResults)); 
    app.get(api+"removeOldResults", [authJwt.verifyToken, authJwt.isAdmin], asyncHandler(controller.removeOldResults)); 
    app.get(api+"removeDatabase", [authJwt.verifyToken, authJwt.isAdmin], asyncHandler(controller.removeDatabase)); 
    app.get(api+"updateLevels", [authJwt.verifyToken, authJwt.isAdmin], asyncHandler(controller.updateLevels)); 
    app.get(api+"updateRoles", [authJwt.verifyToken, authJwt.isAdmin], asyncHandler(controller.updateRoles)); 
    app.get(api+"updateContentLevels", [authJwt.verifyToken, authJwt.isAdmin], asyncHandler(controller.updateContentLevels)); 
    app.get(api+"insertDefaultCoefficientToExams", [authJwt.verifyToken, authJwt.isAdmin], asyncHandler(controller.insertDefaultCoefficientToExams)); 
    app.post(api+"migrations/:migrationName", [authJwt.verifyToken, authJwt.isAdmin], asyncHandler(controller.runMigration)); 
    app.get(api+"database/models", [authJwt.verifyToken, authJwt.isAdmin], asyncHandler(controller.getDatabaseModels)); 
    app.get(api+"database/diagram", [authJwt.verifyToken, authJwt.isAdmin], asyncHandler(controller.getDatabaseDiagram)); 
}