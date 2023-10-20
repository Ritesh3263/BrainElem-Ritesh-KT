const { authJwt } = require("../middlewares");
const controller = require("../controllers/company.controller");
const api = "/api/v1/company/";
const asyncHandler = require("express-async-handler");

module.exports = function(app) {
  app.post(api+"add", [authJwt.verifyToken, authJwt.canCreateCompany], asyncHandler(controller.add));
  app.get(api+"read/:companyId", [authJwt.verifyToken, authJwt.canReadCompany], asyncHandler(controller.read));
  app.get(api+"readByOwner/:ownerId", [authJwt.verifyToken], asyncHandler(controller.readByOwner));
  app.get(api+"readAll", [authJwt.verifyToken, authJwt.canReadAllCompanies], asyncHandler(controller.readAll));
  app.get(api+"readAllPartnerExaminers/:companyId", [authJwt.verifyToken, authJwt.canReadCompany], asyncHandler(controller.readAllPartnerExaminers));
  app.get(api+"readAllPartnerTrainees/:companyId", [authJwt.verifyToken, authJwt.canReadCompany], asyncHandler(controller.readAllPartnerTrainees));
  app.get(api+"readAllPartnerExaminersAndTrainees/:companyId", [authJwt.verifyToken, authJwt.canReadCompany], asyncHandler(controller.readAllPartnerExaminersAndTrainees));
  app.put(api+"update/:companyId", [authJwt.verifyToken, authJwt.canReadCompany], asyncHandler(controller.update));
  app.delete(api+"delete/:companyId", [authJwt.verifyToken, authJwt.canReadCompany], asyncHandler(controller.remove));
  
  app.post(api+"addExaminer/:companyId", [authJwt.verifyToken, authJwt.canReadCompany], asyncHandler(controller.addExaminer));
  app.get(api+"readExaminer/:examinerId", [authJwt.verifyToken, authJwt.canReadAllCompanies], asyncHandler(controller.readExaminer));
  app.delete(api+"removeExaminer/:examinerId/:companyId", [authJwt.verifyToken, authJwt.canReadCompany], asyncHandler(controller.removeExaminer));
  // => read all examiners
};