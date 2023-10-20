const { authJwt } = require("../middlewares");
const controller = require("../controllers/course_path.controller");
const api = "/api/v1/coursePaths/";
const asyncHandler = require("express-async-handler");
var path = require('path')

const multer = require("multer");
//Configuration for Multer
var imageMaxSize = 5 * 1000 * 1000;//5MB
var imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/course_path/images')
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
  app.get(api+"all", [authJwt.verifyToken], asyncHandler(controller.readAll));
  app.post(api+"create", [authJwt.verifyToken], asyncHandler(controller.create));
  app.get(api+"read/:coursePathId", [authJwt.verifyToken], asyncHandler(controller.read));
  // => /without auth, for /store
  app.get(api+"readWithDetails/:coursePathId", asyncHandler(controller.readWithDetails));
  app.put(api+"update/:coursePathId", [authJwt.verifyToken], asyncHandler(controller.update));
  app.delete(api+"remove/:coursePathId", [authJwt.verifyToken], asyncHandler(controller.remove)); 

  app.post(api+"images/upload", [imageUpload.single('file'), authJwt.verifyToken, authJwt.canCreateContent], asyncHandler(controller.uploadImage));
  app.get(api+"images/:imageId/download", [], asyncHandler(controller.downloadImage));
}
