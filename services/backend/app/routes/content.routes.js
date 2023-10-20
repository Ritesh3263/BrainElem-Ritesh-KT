const { authJwt } = require("../middlewares");
const controller = require("../controllers/content.controller");
var path = require('path')
const asyncHandler = require("express-async-handler");
const api = "/api/v1/contents/";

const multer = require("multer");
//Configuration for Multer
var fileMaxSize = 200 * 1000 * 1000; //200MB
var fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/content/files')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname)
    cb(null, uniqueSuffix)
  }
})
const fileUpload = multer({storage: fileStorage, limits: { fileSize: fileMaxSize }});

var imageMaxSize = 5 * 1000 * 1000;//5MB
var imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/content/images')
  },
  filename: function (req, image, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(image.originalname)
    cb(null, uniqueSuffix)
  }
})
var imageFilter = function (req, file, callback) {
  var ext = path.extname(file.originalname);
  if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(new Error('Only images are allowed'))
  }
  callback(null, true)
}

const imageUpload = multer({storage: imageStorage, fileFilter: imageFilter, limits: { fileSize: imageMaxSize }});


module.exports = function(app) {
  app.get(api+"suggest", [authJwt.verifyToken], asyncHandler(controller.suggest));
  app.get(api+"search", [authJwt.verifyToken], asyncHandler(controller.search)); // AUTH, to be limited to ecosystem ID
  app.get(api+"levels", [authJwt.verifyToken], asyncHandler(controller.getAllLevels)); // AUTH perhaps not needed
  app.get(api+"isContentUsedInSession/:contentId", [authJwt.verifyToken, ], asyncHandler(controller.isContentUsedInSession)); // AUTH not needed, just true/false checking, possibly 'isContentUsedInSession' to be moved to auth
  app.get(api+"overview/:contentId", [authJwt.verifyTokenIfExists, authJwt.canOverviewContent], asyncHandler(controller.getContentOverview));
  // Read single content with all details for examination
  app.get(api+"examination/:contentId/all", [authJwt.verifyToken, authJwt.canExamineContent], asyncHandler(controller.readForExamination));
  app.get(api+"examination/:contentId/group/:groupId", [authJwt.verifyToken, authJwt.canExamineContent], asyncHandler(controller.readForExamination));
  app.post(api+"files/upload", [fileUpload.single('file'), authJwt.verifyToken, authJwt.canCreateContent], asyncHandler(controller.uploadFile));
  app.get(api+"files/:fileId", [authJwt.verifyToken], asyncHandler(controller.getFileDetails));
  app.get(api+"files/download/:fileId", [], asyncHandler(controller.downloadFile));
  app.post(api+"images/upload", [imageUpload.single('file'), authJwt.verifyToken, authJwt.canCreateContent], asyncHandler(controller.uploadImage));
  app.post(api+"images/best", [authJwt.verifyToken], asyncHandler(controller.findBestMatchingImageUrl));
  app.get(api+":contentId/image/download", [], asyncHandler(controller.downloadImage));
  app.get(api+"images/:imageId/download", [], asyncHandler(controller.downloadImage));
  app.get(api+"categories/images/:imageName/download", [], asyncHandler(controller.downloadImage));
  app.get(api+"images/details/:imageId", [], asyncHandler(controller.getImageDetails));
  
  // Locking and unlocking elements - to hide/show them to trainees
  app.put(api+"visibility/:groupId?/:contentId?", [authJwt.verifyToken,authJwt.canExamineContent], asyncHandler(controller.changeVisibility));
  app.post(api+":contentId/lock/all", [authJwt.verifyToken, authJwt.canExamineContent], asyncHandler(controller.lockAllElements));
  app.post(api+":contentId/unlock/all", [authJwt.verifyToken, authJwt.canExamineContent], asyncHandler(controller.unlockAllElements));
  app.post(api+":contentId/lock/:elementName", [authJwt.verifyToken, authJwt.canExamineContent], asyncHandler(controller.lockElement));
  app.post(api+":contentId/unlock/:elementName", [authJwt.verifyToken, authJwt.canExamineContent], asyncHandler(controller.unlockElement));

  app.post(api+":contentId/allow-extra-attempt/:userId", [authJwt.verifyToken, authJwt.canExamineContent], asyncHandler(controller.allowExtraAttempt));
  app.post(api+":contentId/disallow-extra-attempt/:userId", [authJwt.verifyToken, authJwt.canExamineContent], asyncHandler(controller.disallowExtraAttempt));


  app.post(api+":contentId/allow-extra-attempt/:userId", [authJwt.verifyToken, authJwt.canTrainUser], asyncHandler(controller.allowExtraAttempt));
  app.post(api+":contentId/disallow-extra-attempt/:userId", [authJwt.verifyToken, authJwt.canTrainUser], asyncHandler(controller.disallowExtraAttempt));
  // This is missing authorization
  app.get(api+"braincore-tests-results/:userId?",[authJwt.verifyToken, authJwt.canReadUser], asyncHandler(controller.getBrainCoreTestResults));
  app.post(api+"assign-to-class", [authJwt.verifyToken], asyncHandler(controller.assignContentToGroup));

  app.get("/api/v1/accepted-content/:contentId", [authJwt.verifyToken, authJwt.canDisplayContent], asyncHandler(controller.getAcceptedContent));
  app.get("/api/v1/getHighestContentCreator", [authJwt.verifyToken], asyncHandler(controller.getHighestContentCreator));
  app.get("/api/v1/numberOfNewContentsPerTime/:basis", [authJwt.verifyToken], asyncHandler(controller.getNumberOfNewContentsPerTime));
  
  // stats
  app.get("/api/v1/countCreatedMaterials", [authJwt.verifyToken], asyncHandler(controller.countCreatedMaterials));
  app.get("/api/v1/countContentAcceptedByLibrarian/:userId?", [authJwt.verifyToken], asyncHandler(controller.countContentAcceptedByLibrarian));
  app.get("/api/v1/countTests:userId?", [authJwt.verifyToken], asyncHandler(controller.countTests));
  app.get("/api/v1/countLessons/:userId?", [authJwt.verifyToken], asyncHandler(controller.countLessons));

  
  // let's put these at the bottom
  app.get(api, [authJwt.verifyToken], asyncHandler(controller.getContents));
  app.post(api, [authJwt.verifyToken, authJwt.canCreateContent], asyncHandler(controller.add));
  app.put(api+":contentId", [authJwt.verifyToken, authJwt.canEditContent], asyncHandler(controller.edit));
  app.delete(api+":contentId", [authJwt.verifyToken, authJwt.canEditContent], asyncHandler(controller.delete));
  app.get(api+":contentId", [authJwt.verifyTokenIfExists, authJwt.canDisplayContent], asyncHandler(controller.getContent));
  
}