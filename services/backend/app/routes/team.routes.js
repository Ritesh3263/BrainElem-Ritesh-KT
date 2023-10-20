const { authJwt } = require("../middlewares");
const controller = require("../controllers/team.controller");
const api = "/api/v1/teams/";
const asyncHandler = require("express-async-handler");

module.exports = function(app) {
    app.get(`${api}users/:teamId`, [authJwt.verifyToken, authJwt.canViewMyTeams], asyncHandler(controller.getTeamUsers))
    
    app.route(api)
        .get([authJwt.verifyToken, authJwt.canViewMyTeams], asyncHandler(controller.getAllTeams))
        .post([authJwt.verifyToken, authJwt.canEditMyTeams], asyncHandler(controller.createTeam));

    app.route(`${api}:id`)
        .get([authJwt.verifyToken, authJwt.canViewMyTeams], asyncHandler(controller.findTeamById))
        .patch([authJwt.verifyToken, authJwt.canEditMyTeams], asyncHandler(controller.updateTeamByQuery))
        .delete([authJwt.verifyToken, authJwt.canEditMyTeams], asyncHandler(controller.deleteTeam));

    app.post(`${api}generate/demo`, [authJwt.verifyToken], asyncHandler(controller.generateDemoTeam))
}