const { authJwt } = require("../middlewares");
const asyncHandler = require("express-async-handler");
const controller = require("../controllers/certification_session.controller");
const api = "/api/v1/certification_session/"

module.exports = function(app) {
  app.post(api+"add", [authJwt.verifyToken, authJwt.canCreateSession], asyncHandler(controller.add));
  app.post(api+"newAdd", [authJwt.verifyToken, authJwt.canCreateSession], asyncHandler(controller.newAdd));
  app.get(api+"read/:certificationSessionId", [authJwt.verifyToken, authJwt.canReadSession], asyncHandler(controller.read));
  
  // For some reason `authJwt.canReadSession` was missing in this route. 
  // I added it, as it was needed for checking if payment was completed
  app.get(api+"newRead/:certificationSessionId", [authJwt.verifyToken, authJwt.canReadSession], asyncHandler(controller.newRead));
  // /overview retuns less information than newRead, just for overview in Explore
  app.get(api+"overview/:certificationSessionId", [authJwt.verifyToken], asyncHandler(controller.getCertificationSessionOverview));
  app.get(api+"newReadPublic/:certificationSessionId", asyncHandler(controller.newReadPublic));
  app.get(api+"newGetContent/:contentId", [authJwt.verifyToken], asyncHandler(controller.newGetContent)); // TODO AUTH
  app.get(api+"newReadCourse/:courseId", [authJwt.verifyToken], asyncHandler(controller.newReadCourse));
  app.get(api+"readAll", [authJwt.verifyToken, authJwt.canReadAllSessions], asyncHandler(controller.readAll)); // TODO
  app.get(api+"readAllTemplateSessions", [authJwt.verifyToken], asyncHandler(controller.readAllTemplateSessions)); // TODO AUTH
  app.get(api+"readAllUserSessions", [authJwt.verifyToken], asyncHandler(controller.readAllUserSessions)); // TODO AUTH
  app.get(api+"readAllUserSessionsWithoutCompany", [authJwt.verifyToken], asyncHandler(controller.readAllUserSessionsWithoutCompany)); // TODO AUTH
  app.get(api+"readAllArchivedSessions", [authJwt.verifyToken], asyncHandler(controller.readAllArchivedSessions)); // TODO AUTH
  app.get(api+"readAllArchivedSessionsWithoutCompany", [authJwt.verifyToken], asyncHandler(controller.readAllArchivedSessionsWithoutCompany)); // TODO AUTH
  app.get(api+"readAllUserSessionsInCertificate/:certificationId", [authJwt.verifyToken], asyncHandler(controller.readAllUserSessionsInCertificate));
  app.get(api+"countReceivedCertifications", [authJwt.verifyToken], asyncHandler(controller.countReceivedCertifications)); // TODO AUTH
  app.get(api+"countFinishedSessions/:userId", [authJwt.verifyToken, authJwt.canReadUserSessions], asyncHandler(controller.countFinishedSessions));
  app.get(api+"readTraineeSessions/:traineeId", [authJwt.verifyToken, authJwt.canReadUserSessions], asyncHandler(controller.readTraineeSessions));
  app.put(api+"update/:certificationSessionId", [authJwt.verifyToken, authJwt.canReadSession], asyncHandler(controller.update));
  app.delete(api+"delete/:certificationSessionId", [authJwt.verifyToken, authJwt.canReadSession], asyncHandler(controller.remove));
  app.put(api+"archive/:certificationSessionId", [authJwt.verifyToken, authJwt.canReadSession], asyncHandler(controller.archive));
  app.put(api+"restore/:certificationSessionId", [authJwt.verifyToken, authJwt.canReadSession], asyncHandler(controller.restore));

  app.get(api+"readUserTrackers/:userId/:certificationSessionId", [authJwt.verifyToken, authJwt.canReadSession], asyncHandler(controller.readUserTrackers));
  app.put(api+"saveUserTracker/:certificationSessionId/:chapterId/:contentId", [authJwt.verifyToken, authJwt.canReadSession], asyncHandler(controller.saveUserTracker));
  
  app.get(api+"readUserContentProgress/:userId/:contentId/:certificationSessionId", [authJwt.verifyToken], asyncHandler(controller.readUserContentProgress)); // update user itself
  app.get(api+"readAllContentProgressOfUserInSession/:userId/:certificationSessionId", [authJwt.verifyToken], asyncHandler(controller.readAllContentProgressOfUserInSession)); // update user itself
  app.put(api+"saveContentProgress/:contentId", [authJwt.verifyToken], asyncHandler(controller.saveContentProgress)); // update user itself
  
  // app.get(api+"takeCourse/:certificationSessionId", [authJwt.verifyToken, authJwt.canReadSession], asyncHandler(controller.takeCourse));
  app.get(api+"takeCourse/:certificationSessionId", [authJwt.verifyToken, authJwt.canEnrollForCertificationSession], asyncHandler(controller.takeCourse));
  app.post(api+"unenroll/:certificationSessionId", [authJwt.verifyToken, authJwt.canUnenrollFromCertificationSession], asyncHandler(controller.unenroll));

  app.get(api+"readAllTraineeSessions/:traineeId", [authJwt.verifyToken], asyncHandler(controller.readAllTraineeSessions)); // TODO AUTH
  app.get(api+"readAllTraineesFromTemplate/:certificationSessionId", [authJwt.verifyToken], asyncHandler(controller.readAllTraineesFromTemplate)); // TODO AUTH
  
  app.get(api+"issueInternship/:certificationSessionId/:userId", [authJwt.verifyToken], asyncHandler(controller.issueInternship));

  app.get(api+"getSessionsForExplore", [authJwt.verifyTokenIfExists], asyncHandler(controller.getSessionsForExplore));

  app.get(`${api}getAllTrainingManagers`, [authJwt.verifyToken], asyncHandler(controller.readAllTrainingManagers));
  app.get(`${api}getAllTrainingManagersByModule`, [authJwt.verifyToken], asyncHandler(controller.getAllTrainingManagersByModule));
  app.get(`${api}readAllCoordinators`, [authJwt.verifyToken], asyncHandler(controller.readAllCoordinators));

  app.get(`${api}getMostPopularSessions`, [authJwt.verifyToken], asyncHandler(controller.getMostPopularSessions));
};