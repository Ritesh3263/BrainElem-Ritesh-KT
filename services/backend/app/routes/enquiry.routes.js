const { authJwt } = require("../middlewares");
const controller = require("../controllers/enquiry.controller");
const asyncHandler = require("express-async-handler");
const api = "/api/v1/enquiry/";


module.exports = function(app) { // TODO: add auth
  app.post(api+"add/:sessionId", [authJwt.verifyToken], asyncHandler(controller.add));
  app.post(api+"addByModuleManager", [authJwt.verifyToken], asyncHandler(controller.addByModuleManager));
  app.get(api+"read/:enquiryId", [authJwt.verifyToken], asyncHandler(controller.read));
  app.get(api+"readAll", [authJwt.verifyToken], asyncHandler(controller.readAll));
  app.get(api+"readAllMyEnquiries", [authJwt.verifyToken], asyncHandler(controller.readAllMyEnquiries));
  app.put(api+"update/:enquiryId", [authJwt.verifyToken], asyncHandler(controller.update));
  app.get(api+"createSessionFromEnquiry/:enquiryId", [authJwt.verifyToken], asyncHandler(controller.createSessionFromEnquiry));
  app.delete(api+"delete/:enquiryId", [authJwt.verifyToken], asyncHandler(controller.remove));

  app.get(api+"readAllSessionTemplates/:moduleId", [authJwt.verifyToken], asyncHandler(controller.readAllSessionTemplates));

};