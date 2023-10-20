const { authJwt } = require("../middlewares");
const asyncHandler = require("express-async-handler");
const controller = require("../controllers/training_module.controller");
const api = "/api/v1/training-modules/";

module.exports = function(app) {
  app.get(api+"search", [authJwt.verifyToken], asyncHandler(controller.search));
  app.get(api+"all", [authJwt.verifyToken, authJwt.canReadAllTrainingModules], asyncHandler(controller.readAll));
  app.get(api+":trainingModuleId", [authJwt.verifyToken, authJwt.canReadTrainingModule], asyncHandler(controller.read));
  app.get(api+":trainingModuleId/books", [authJwt.verifyToken], asyncHandler(controller.readBooks));
}
