const { authJwt } = require("../middlewares");
const asyncHandler = require("express-async-handler");
const controller = require("../controllers/competence.controller");
const api = "/api/v1/competences/";

module.exports = function(app) {
  app.post(api+"add", [authJwt.verifyToken, authJwt.canReadAllCompetences], asyncHandler(controller.add));
  app.get(api+"read/:competenceId", [authJwt.verifyToken, authJwt.canReadCompetence], asyncHandler(controller.read));
  app.put(api+"checkTitle", [authJwt.verifyToken], asyncHandler(controller.checkTitle));
  app.get(api+"readAll", [authJwt.verifyToken, authJwt.canReadAllCompetences], asyncHandler(controller.readAll));
  app.put(api+"update/:competenceId", [authJwt.verifyToken, authJwt.canReadCompetence], asyncHandler(controller.update));
  app.delete(api+"delete/:competenceId", [authJwt.verifyToken, authJwt.canReadCompetence], asyncHandler(controller.remove));
};