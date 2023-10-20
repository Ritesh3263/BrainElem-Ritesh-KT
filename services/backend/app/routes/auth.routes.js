const { verifySignUp } = require("../middlewares");
const { authJwt } = require("../middlewares");
const asyncHandler = require("express-async-handler");
const controller = require("../controllers/auth.controller");
const api = "/api/v1/auth/";

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    api+"signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail
    ],
    controller.signup
  );

  app.post(api+"signin", asyncHandler(controller.signin));
  app.post( api+"resetPassword", [], asyncHandler(controller.resetPassword));
  app.post( api+"changePassword", [authJwt.verifyToken], asyncHandler(controller.changePassword));
  app.post( api+"resetMyPassword", [authJwt.verifyToken], asyncHandler(controller.resetMyPassword));
  app.post( api+"confirmEmail", [authJwt.verifyToken], asyncHandler(controller.confirmEmail));
  app.post( api+"isUsernameTaken", [], asyncHandler(controller.isUsernameTaken));
  app.post( api+"isEmailTaken", [], asyncHandler(controller.isEmailTaken));
  app.post( api+"refreshToken", [authJwt.verifyToken], asyncHandler(controller.refreshToken));
  app.post( api+"addModuleToScopes", [authJwt.verifyToken], asyncHandler(controller.addModuleToScopes));
};
