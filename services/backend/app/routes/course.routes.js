const { authJwt } = require("../middlewares");
const controller = require("../controllers/course.controller");
const api = "/api/v1/courses/";
const asyncHandler = require("express-async-handler");
var path = require('path')

const multer = require("multer");
//Configuration for Multer
var imageMaxSize = 5 * 1000 * 1000;//5MB
var imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/course/images')
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
  //for librarian to accept courses
  app.get(api+"all-courses", [authJwt.verifyToken, authJwt.canReadWholeLibrary], asyncHandler(controller.getAllCourses));
  app.post(api+"create", [authJwt.verifyToken], asyncHandler(controller.create));
  app.get(api+"read/:courseId", [authJwt.verifyToken], asyncHandler(controller.read));
  app.put(api+"update/:courseId", [authJwt.verifyToken], asyncHandler(controller.update));
  app.put(api+"updateFromSession/:courseId", [authJwt.verifyToken], asyncHandler(controller.updateFromSession));
  app.delete(api+"remove/:courseId", [authJwt.verifyToken], asyncHandler(controller.remove));
  app.put(api+"manage-course-status", [authJwt.verifyToken, authJwt.canReadWholeLibrary], asyncHandler(controller.manageCourseStatus));

  app.get(api+"getCategoryRefs", [authJwt.verifyToken], asyncHandler(controller.getCategoryRefs));
  app.get(api+"getCategoryRefsFromModule", [authJwt.verifyToken], asyncHandler(controller.getCategoryRefsFromModule));
  app.get(api+"getChaptersFromCourse/:courseId", [authJwt.verifyToken], asyncHandler(controller.getChaptersFromCourse));

  app.post(api+"images/upload", [imageUpload.single('file'), authJwt.verifyToken, authJwt.canCreateContent], asyncHandler(controller.uploadImage));
  app.get(api+"images/:imageId/download", [], asyncHandler(controller.downloadImage));
  app.get(api+"images/details/:imageId", [], asyncHandler(controller.getImageDetails));
  app.get(api+":courseId", [authJwt.verifyToken], asyncHandler(controller.getCourse)); // to add  authJwt.canDisplayCourse

}
