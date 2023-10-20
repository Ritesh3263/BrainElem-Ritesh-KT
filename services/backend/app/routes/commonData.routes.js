const { authJwt } = require("../middlewares");
const asyncHandler = require("express-async-handler");
const controller = require("../controllers/commonData.controller");
const api = "/api/v1/commonData/";

module.exports = function(app) {
    app.get(`${api}readAvailableRoles/:type`, [authJwt.verifyToken], asyncHandler(controller.readAvailableRoles));
    app.get(`${api}popular/event-types`, [authJwt.verifyToken], asyncHandler(controller.getPopularEventTypes));
    app.get(`${api}popular/subjects`, [authJwt.verifyToken], asyncHandler(controller.getPopularSubjects));
    app.get(`${api}popular/levels`, [authJwt.verifyToken], asyncHandler(controller.getPopularLevels));
    app.get(`${api}popular/content`, [authJwt.verifyToken], asyncHandler(controller.getPopularContent));
    app.get(`${api}count/programs/:contentId`, [authJwt.verifyToken], asyncHandler(controller.countProgramsByContent));
    app.get(`${api}count/assignment`, [authJwt.verifyToken], asyncHandler(controller.getAssignmentCount));
    app.put(`${api}markCompleted/:userId?`, [authJwt.verifyToken], asyncHandler(controller.markCompleted));
    app.get(`${api}period/:periodId`, [authJwt.verifyToken], asyncHandler(controller.getPeriod));
    app.get(`${api}allPeriods`, [authJwt.verifyToken], asyncHandler(controller.getAllPeriods));
}