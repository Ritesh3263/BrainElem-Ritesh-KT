const asyncHandler = require("express-async-handler");
const { authJwt } = require("../middlewares");
const moduleUtils = require("../utils/module");
const controller = require("../controllers/credit.controller");
const api = "/api/v1/credits/";

module.exports = function (app) {
  // ### Credits for current user ###############################################
  app.get(api, [authJwt.verifyToken], asyncHandler(controller.getCreditsForUser));
  // ### Credits for all modules ###############################################
  app.get(api + "modules/all", [authJwt.verifyToken, (req, res, next) => {
    if (moduleUtils.isMarketingManager(req.userId)) next();
    else return res.status(403).send({ message: "Not authorized" });
  }], asyncHandler(controller.getCreditsForModules));
  // ### Get credits in the module #############################################
  app.get(api + "modules/:moduleId", [authJwt.verifyToken, (req, res, next) => {
    if (req.moduleId == req.params.moduleId) next()
    else if (moduleUtils.isMarketingManager(req.userId)) next()
    else return res.status(403).json();
  }], asyncHandler(controller.getCreditsForModule));
  // ### Transfer credits from one account to another ##########################
  app.post(api + "transfer", [authJwt.verifyToken, (req, res, next) => {
    //transferCredits
    next()
  }], asyncHandler(controller.transferCredits));
  // ### Request credits ##########################
  app.post(api + "request", [authJwt.verifyToken], asyncHandler(controller.requestCredits));
  app.post(api + "requests/reject/:requestId", [authJwt.verifyToken], asyncHandler(controller.rejectCreditRequest));
  app.get(api + "requests/modules/:moduleId", [authJwt.verifyToken, (req, res, next) => {
    if (req.moduleId == req.params.moduleId) next()
    else if (moduleUtils.isMarketingManager(req.userId)) next()
    else return res.status(403).json();
  }], asyncHandler(controller.getCreditsRequestsForModule));
};