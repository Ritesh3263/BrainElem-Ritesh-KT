const asyncHandler = require("express-async-handler");
const { authJwt } = require("../middlewares");
const controller = require("../controllers/result.controller");
const api = "/api/v1/result/";

const multer = require("multer");
var path = require('path')
//Configuration for Multer
var fileMaxSize = 200 * 1000 * 1000; //200MB
var fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/result/files')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname)
    cb(null, uniqueSuffix)
  }
})


const fileUpload = multer({storage: fileStorage, limits: { fileSize: fileMaxSize }});
module.exports = function(app) {
  app.post(api+"add", [authJwt.verifyTokenIfExists, authJwt.canAddResult], asyncHandler(controller.add));
  app.post(api+"files/upload", [fileUpload.single('file'), authJwt.verifyToken], asyncHandler(controller.uploadFile));
  app.get(api+"files/:fileId", [authJwt.verifyToken], asyncHandler(controller.getFileDetails));
  app.post(api+"files/remove/:fileId", [authJwt.verifyToken], asyncHandler(controller.removeFile));
  app.get(api+"files/download/:fileId", [], asyncHandler(controller.downloadFile));
  app.get(api+"read/:resultId", [authJwt.verifyToken, authJwt.canViewResult], asyncHandler(controller.read));
  // app.get(api+"read/:resultId", [authJwt.verifyToken, authJwt.canReadResult], asyncHandler(controller.read));
  app.put(api+"update/:resultId", [authJwt.verifyToken, authJwt.canEditResult], asyncHandler(controller.update));
  app.put(api+"confirm/:resultId", [authJwt.verifyToken, authJwt.canConfirmResult], asyncHandler(controller.confirm));
  app.get(api+"price/:resultId", [], asyncHandler(controller.getPrice));
  app.put(api+"updateGradeBookResults", [authJwt.verifyToken, authJwt.canUpdateGradebook], asyncHandler(controller.updateGradeBookResults));
  app.delete(api+"delete/:resultId", [authJwt.verifyToken, authJwt.canRemoveResult], asyncHandler(controller.remove));
  app.get(api+"latest/:userId/:contentId", [authJwt.verifyToken, authJwt.canReadResults], asyncHandler(controller.getLatestResultForUser));
  app.get(api+"all/:userId/:contentId", [authJwt.verifyToken, authJwt.canReadResults], asyncHandler(controller.getAllResultsForUser));
  app.get(api+"group/:groupId/:contentId", [authJwt.verifyToken, authJwt.canExamineContent], asyncHandler(controller.getGroupResults));
  app.get(api+"getGrades", [authJwt.verifyToken, authJwt.canViewResults], asyncHandler(controller.getGrades));
};