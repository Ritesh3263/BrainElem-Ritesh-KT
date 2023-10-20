const { authJwt } = require("../middlewares");
const asyncHandler = require("express-async-handler");
const controller = require("../controllers/internship.controller");
const api = "/api/v1/internships/";

module.exports = function(app) {
  app.post(api+"add", [authJwt.verifyToken], asyncHandler(controller.add));
  app.put(api+"addCredit/:sessionId/:traineeId", [authJwt.verifyToken], asyncHandler(controller.addCredit));
  app.get(api+"readAll", [authJwt.verifyToken], asyncHandler(controller.readAll));
  app.get(api+"read/:internshipId", [authJwt.verifyToken], asyncHandler(controller.read));
  app.put(api+"update/:internshipId", [authJwt.verifyToken], asyncHandler(controller.update));
  app.delete(api+"delete/:internshipId", [authJwt.verifyToken], asyncHandler(controller.remove));
  app.get(api+"readAllExaminers", [authJwt.verifyToken], asyncHandler(controller.readAllExaminers));
  app.get(api+"readAllTrainees", [authJwt.verifyToken], asyncHandler(controller.readAllTrainees));
  app.get(`${api}readAllCompanies`, [authJwt.verifyToken], asyncHandler(controller.readAllCompanies));
};
