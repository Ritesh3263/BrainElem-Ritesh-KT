const { authJwt } = require("../middlewares");
const asyncHandler = require("express-async-handler");
const controller = require("../controllers/group.controller");
const api = "/api/v1/groups/";

module.exports = function(app) {
	app.get(api+"getGroup/:groupId",[authJwt.verifyToken, authJwt.isTrainerFromGroup], asyncHandler(controller.getGroup));
	app.get(api+"getTraineesSubjectsAverages/:groupId/:periodId",[authJwt.verifyToken], asyncHandler(controller.getTraineesSubjectsAverages)); // controller managing to check if 'teacher' access those subjects // TODO: remark: trainee can't read the group, ref: blocked in groupAuth.js:12
};
