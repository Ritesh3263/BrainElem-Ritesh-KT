const { authJwt } = require("../middlewares");
const controller = require("../controllers/ecosystem.controller");
const asyncHandler = require("express-async-handler");
const api = "/api/v1/ecosystems/";

module.exports = function(app) {
	app.get(api+"all",[authJwt.verifyToken, authJwt.isEcoManager], asyncHandler(controller.readAll));
	app.post(api+"add", [authJwt.verifyToken, authJwt.isAdmin], asyncHandler(controller.add));
	app.put(api+'update/:id', [authJwt.verifyToken, authJwt.isAdmin], asyncHandler(controller.update));
	app.delete(api+"remove/:id", [authJwt.verifyToken, authJwt.isAdmin], asyncHandler(controller.remove));
	app.get(api+"get-managers",[authJwt.verifyToken, authJwt.isAdmin], asyncHandler(controller.readAllManagers));
	app.get(api+"get-one-manager/:ecosystemId",[authJwt.verifyToken, authJwt.isAdmin], asyncHandler(controller.getOneManager));
	app.get(api+"get-manager/:userId",[authJwt.verifyToken, authJwt.isAdmin], asyncHandler(controller.getManager));
	app.get(api+"get-free-managers/:ecosystemId?",[authJwt.verifyToken, authJwt.isAdmin], asyncHandler(controller.readAllFreeManagers));
	app.post(api+"add-manager", [authJwt.verifyToken, authJwt.isAdmin], asyncHandler(controller.addManager));
	app.put(api+'update-manager/:id', [authJwt.verifyToken, authJwt.isAdmin], asyncHandler(controller.updateManager));
	app.delete(api+"remove-manager/:id", [authJwt.verifyToken, authJwt.isAdmin], asyncHandler(controller.removeManager));
	app.put(api+'enable-cloud/:ecosystemId', [authJwt.verifyToken, authJwt.canManageCloud], asyncHandler(controller.enableCloud));
	
};
