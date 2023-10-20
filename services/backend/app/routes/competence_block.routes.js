const { authJwt } = require("../middlewares");
const controller = require("../controllers/competence_block.controller");
const asyncHandler = require("express-async-handler");
const api = "/api/v1/competence_blocks/";

module.exports = function(app) {
  app.post(api+"add", [authJwt.verifyToken, authJwt.canReadAllBlocks], asyncHandler(controller.add));
  app.get(api+"read/:competenceBlockId", [authJwt.verifyToken, authJwt.canReadBlock], asyncHandler(controller.read));
  app.put(api+"checkTitle", [authJwt.verifyToken], asyncHandler(controller.checkTitle));
  app.put(api+"identificationCode", [authJwt.verifyToken], asyncHandler(controller.identificationCode));
  app.get(api+"readAll", [authJwt.verifyToken, authJwt.canReadAllBlocks], asyncHandler(controller.readAll));
  app.put(api+"update/:competenceBlockId", [authJwt.verifyToken, authJwt.canReadBlock], asyncHandler(controller.update));
  app.delete(api+"delete/:competenceBlockId", [authJwt.verifyToken, authJwt.canReadBlock], asyncHandler(controller.remove));
};