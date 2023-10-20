const { authJwt } = require("../middlewares");
const controller = require("../controllers/module.controller");
const asyncHandler = require("express-async-handler");
const api = "/api/v1/modules/"

module.exports = function(app) {
	app.post(api+"add", [authJwt.verifyToken, authJwt.isSubscriptionOwner], asyncHandler(controller.add)); // AUTH: checking in controller for correct subscriptionId
	app.get(api+"all/:subscriptionId", [authJwt.verifyToken, authJwt.canReadSubscription], asyncHandler(controller.readAll));
	app.post(api+"import-users", [authJwt.verifyToken], asyncHandler(controller.importUsersFromModules));
	app.get(api+"read/:moduleId", [authJwt.verifyToken, authJwt.canReadModule], asyncHandler(controller.read));
	app.put(api+"update/:moduleId", [authJwt.verifyToken, authJwt.canWriteModule], asyncHandler(controller.update));
	app.delete(api+"remove/:moduleId", [authJwt.verifyToken, authJwt.canWriteModule], asyncHandler(controller.remove));
	
	app.post(api+"add-manager/:subscriptionId", [authJwt.verifyToken, authJwt.canReadSubscription], asyncHandler(controller.addManager));
	app.get(api+"get-managers/:subscriptionId", [authJwt.verifyToken, authJwt.canReadSubscription], asyncHandler(controller.readAllManagers));
	app.get(api+"get-free-managers/:moduleId", [authJwt.verifyToken, authJwt.isSubscriptionOwner], asyncHandler(controller.readFreeManagers)); // auth checked in controller
	app.get(api+"get-managers-in-module/:moduleId",[authJwt.verifyToken], asyncHandler(controller.getManagersInModule));
	app.get(api+"get-architects-in-module/:moduleId",[authJwt.verifyToken], asyncHandler(controller.getArchitectsInModule));
	app.get(api+"get-remaining-user/:moduleId",[authJwt.verifyToken, authJwt.canReadModule], asyncHandler(controller.getRemainingUser));
	app.put(api+'update-manager/:userId', [authJwt.verifyToken, authJwt.isSubscriptionOwner], asyncHandler(controller.updateManager)); 
	app.delete(api+"removeModuleFromManager/:userId", [authJwt.verifyToken, authJwt.isSubscriptionOwner], asyncHandler(controller.removeModuleFromManager)); 
	app.delete(api+"removeModuleManger/:userId", [authJwt.verifyToken, authJwt.isSubscriptionOwner], asyncHandler(controller.removeModuleManger)); 
	
	app.get(api+"training-modules",[authJwt.verifyToken], asyncHandler(controller.readAllTrainingModules));
	app.get(api+":moduleId/training-modules",[authJwt.verifyToken, authJwt.canReadModule], asyncHandler(controller.readAllTrainingModules));
	app.get(api+"trainers",[authJwt.verifyToken], asyncHandler(controller.readAllTrainers));
	app.get(api+":moduleId/trainers",[authJwt.verifyToken], asyncHandler(controller.readAllTrainers));
	app.get(api+"trainersInModule",[authJwt.verifyToken], asyncHandler(controller.readAllTrainersInModule));
	app.get(api+":moduleId/trainersInModule",[authJwt.verifyToken, authJwt.canReadModule], asyncHandler(controller.readAllTrainersInModule));
	app.get(api+"get-class-managers-groups",[authJwt.verifyToken], asyncHandler(controller.readClassManagersGroups));
	app.get(api+"groups",[authJwt.verifyToken], asyncHandler(controller.readAllGroups));
	app.get(api+":moduleId/groups",[authJwt.verifyToken, authJwt.canReadModule], asyncHandler(controller.readAllGroups));
	app.get(api+"getAllGroupsForArchitect",[authJwt.verifyToken], asyncHandler(controller.getAllGroupsForArchitect));

	app.get(api+":moduleId?/get-module-users",[authJwt.verifyToken], asyncHandler(controller.getModuleUsers));
};
