const { authJwt, verifySignUp } = require("../../middlewares");
const asyncHandler = require('express-async-handler')
const mobile_api = "/api/v1/mobile";

const {mobileTest} = require('../../controllers/mobile/test.controller');

const {getAllInterests} = require("../../controllers/interest.controller");
const _authCtrl = require("../../controllers/auth.controller");

module.exports = function (app){
    app.get(`${mobile_api}/test`,asyncHandler(mobileTest));


    //=> auth

    app.post(`${mobile_api}/auth/signin`,asyncHandler(_authCtrl.signin));
    app.post(`${mobile_api}/auth/updateToken`,asyncHandler(_authCtrl.refreshToken));
    app.post(`${mobile_api}/auth/registerDevice`, [authJwt.verifyToken],asyncHandler(_authCtrl.registerDevice));
    // using the existing auth controller
    app.post(`${mobile_api}/auth/signup`, [verifySignUp.checkDuplicateUsernameOrEmail], asyncHandler(_authCtrl.signup));
    app.post(`${mobile_api}/auth/isUsernameTaken`, asyncHandler(_authCtrl.isUsernameTaken));
    app.post(`${mobile_api}/auth/isEmailTaken`, asyncHandler(_authCtrl.isEmailTaken));
    app.post(`${mobile_api}/auth/resetPassword`, asyncHandler(_authCtrl.resetPasswordByOTP));
    app.post(`${mobile_api}/auth/verifyOTP`, asyncHandler(_authCtrl.verifyOtp));
    app.post(`${mobile_api}/auth/changePasswordByOtp`, asyncHandler(_authCtrl.changePasswordByOtp));
    app.post(`${mobile_api}/auth/changePassword`, [authJwt.verifyToken], asyncHandler(_authCtrl.changePassword));
    // app.post(`${mobile_api}/auth/resetMyPassword`, [authJwt.verifyToken], asyncHandler(_authCtrl.resetMyPassword));


    //=> interests
    app.get(`${mobile_api}/interests`,[authJwt.verifyToken], asyncHandler(getAllInterests));

}