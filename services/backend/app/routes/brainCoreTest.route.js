const { authJwt } = require("../middlewares");
const controller = require("../controllers/brainCoreTest.controller");
const api = "/api/v1/bctest/";
const asyncHandler = require("express-async-handler");

module.exports = (app) => {
    app.get(`${api}users/:moduleId`, [authJwt.verifyToken, authJwt.canViewBrainCoreTestRegistrations], asyncHandler(controller.getModuleUsers));
    app.get(`${api}teams`, [authJwt.verifyToken, authJwt.canViewBrainCoreTestRegistrations], asyncHandler(controller.getTeams));
    app.get(`${api}teams-with-progress/:userId/:sessionId`, [authJwt.verifyToken, authJwt.canViewBrainCoreTestRegistrations], asyncHandler(controller.getTeamsWithProgress));
    app.get(`${api}teams-traits`, [authJwt.verifyToken, authJwt.canViewMyTeamsStatistics], asyncHandler(controller.getTeamsWithTraits));
    app.post(`${api}bctestregister`, [authJwt.verifyToken, authJwt.canEditBrainCoreTestRegistrations], asyncHandler(controller.bcTestRegister));
};