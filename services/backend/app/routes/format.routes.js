const { authJwt } = require("../middlewares");
const controller = require("../controllers/format.controller");
const asyncHandler = require("express-async-handler");
const api = "/api/v1/formats/";


module.exports = function(app) { // TODO: add auth
  
  app.post(api+"add", [authJwt.verifyToken], asyncHandler(controller.add));
  app.get(api+"read/:formatId", [authJwt.verifyToken], asyncHandler(controller.read));
  app.get(api+"readAll", [authJwt.verifyToken], asyncHandler(controller.readAll));
  app.get(api+"readAllExceptInit", [authJwt.verifyToken], asyncHandler(controller.readAllExceptInit));
  app.put(api+"update/:formatId", [authJwt.verifyToken], asyncHandler(controller.update));
  app.delete(api+"delete/:formatId", [authJwt.verifyToken], asyncHandler(controller.remove));
};