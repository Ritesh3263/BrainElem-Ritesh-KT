const { authJwt } = require("../middlewares");
const controller = require("../controllers/event.controller");
const asyncHandler = require("express-async-handler");
const api = "/api/v1/events/";

module.exports = function(app) {
  // Read single event from database
  app.get(api+"overview/:eventId", [authJwt.verifyToken, authJwt.canOverviewEvent], asyncHandler(controller.overview));
  // Read single event with associated content in order to display/preview 
  app.get(api+"display/:eventId", [authJwt.verifyToken, authJwt.canDisplayEvent], asyncHandler(controller.display));
  // Read single event with all details for examination
  app.get(api+"examination/:eventId", [authJwt.verifyToken, authJwt.canExamineEvent], asyncHandler(controller.readForExamination));
  // Allow additional attempt for event
  app.post(api+":eventId/allow-extra-attempt/:userId", [authJwt.verifyToken, authJwt.canTrainUser], asyncHandler(controller.allowExtraAttempt));
  // Disallow additional attempt for event
  app.post(api+":eventId/disallow-extra-attempt/:userId", [authJwt.verifyToken, authJwt.canTrainUser], asyncHandler(controller.disallowExtraAttempt));


  app.post(api+"add", [authJwt.verifyToken], asyncHandler(controller.add)); // temporary unblock for trainingManager action
  app.post(api+"addAlt", [authJwt.verifyToken], asyncHandler(controller.addAlt));
  app.post(api+"addCerificationEvent", [authJwt.verifyToken], asyncHandler(controller.addCerificationEvent));
  app.put(api+"update/:eventId", [authJwt.verifyToken, authJwt.canUpdateEvent], asyncHandler(controller.update));
  app.delete(api+"delete/:eventId", [authJwt.verifyToken, authJwt.canUpdateEvent], asyncHandler(controller.remove));
  app.delete(api+"removeByExam/:eventId", [authJwt.verifyToken, authJwt.canUpdateEvent], asyncHandler(controller.removeByExam)); // TODO: add authurization if the user can delete event and results
  app.get(api+"readAll", [authJwt.verifyToken], asyncHandler(controller.readAll)); // no need of auth, events are loaded according to req.userId
  app.get(api+"getSubjects/:classId/:periodId", [authJwt.verifyToken], asyncHandler(controller.readTrainingModules));
  app.get(api+"getSubjectsForEvents/:classId", [authJwt.verifyToken], asyncHandler(controller.readTrainingModulesForEvents));
  app.get(api+"getTrainingModuleFromTrainingPath/:trainingPathId", [authJwt.verifyToken], asyncHandler(controller.getTrainingModuleFromTrainingPath));

  app.get(api+"readEventsFromSession/:sessionId/:assignedGroup?", [authJwt.verifyToken], asyncHandler(controller.readEventsFromSession));
  app.get(api+"readEventsFromAllSessions", [authJwt.verifyToken], asyncHandler(controller.readEventsFromAllSessions));

  app.get(api+"getEvents/:trainingModuleId?", [authJwt.verifyToken], asyncHandler(controller.getEvents)); // no need of auth, events are loaded according to req.userId
  app.get(api+"readChapters/:subjectId/:trainingPathId", [authJwt.verifyToken], asyncHandler(controller.readChapters));
  app.get(api+"readContents/:chapterId/:trainingPathId/:groupId?", [authJwt.verifyToken], asyncHandler(controller.readContents));
  app.get(api+"readContentsWithGrade/:chapterId/:trainingPathId/:traineeId", [authJwt.verifyToken], asyncHandler(controller.readContentsWithGrade));
  app.get(api+"getMyClasses", [authJwt.verifyToken], asyncHandler(controller.getMyClasses)); // no need of auth, events are loaded according to req.userId
  app.get(api+"getTrainerClassesFromSessions/:trainerId", [authJwt.verifyToken], asyncHandler(controller.getTrainerClassesFromSessions)); // no need of auth, events are loaded according to req.userId

  app.get(api+"getTraineeClasses/:traineeId", [authJwt.verifyToken], asyncHandler(controller.getTraineeClasses));  
  app.get(api+"getAllExamsForTeacherViaEvent", [authJwt.verifyToken], asyncHandler(controller.getAllExamsForTeacherViaEvent));
  app.get(api+"getAllExamsForSession/:currentSessionId", [authJwt.verifyToken], asyncHandler(controller.getAllExamsForSession));
  app.get(api+"getExamEvents", [authJwt.verifyToken], asyncHandler(controller.getExamEvents));
  app.get(api+"getExamsListOfTrainee/:groupId/:contentId", [authJwt.verifyToken], asyncHandler(controller.getExamsListOfTrainee));
  app.get(api+"getHomeworks/:trainingModuleId?", [authJwt.verifyToken], asyncHandler(controller.getHomeworks)); // shall work for both trainer and trainee
  app.get(api+"getExams/:trainingModuleId?", [authJwt.verifyToken], asyncHandler(controller.getExams)); // shall work for both trainer and trainee
  app.get(api+"getTraineePreviewEvents/:groupId", [authJwt.verifyToken], asyncHandler(controller.getTraineePreviewEvents));
  app.get(api+"getAllExamsForParentViaEvent", [authJwt.verifyToken], asyncHandler(controller.getAllExamsForParentViaEvent));
  app.get(api+"readGroupsByParentId/:parentId", [authJwt.verifyToken], asyncHandler(controller.readGroupsByParentId));
  app.get(api+"getTraineeEventExamByContent/:contentId", [authJwt.verifyToken], asyncHandler(controller.getTraineeEventExamByContent));
  app.get(api+"getExamListOfSubject/:classId/:periodId/:trainingModuleId", [authJwt.verifyToken], asyncHandler(controller.getExamListOfSubject));
  app.get(api+"getExamListOfCourse/:groupId/:courseId", [authJwt.verifyToken], asyncHandler(controller.getExamListOfCourse));
  // stats
  app.get(api+"countOnlineClasses/:userId?", [authJwt.verifyToken], asyncHandler(controller.countOnlineClasses));
  app.get(api+"countExams/:userId?", [authJwt.verifyToken], asyncHandler(controller.countExams));
  app.get(api+"countHomeworks/:userId?", [authJwt.verifyToken], asyncHandler(controller.countHomeworks));
  app.get(api+"numberOfUpcomingEvents/:userId?", [authJwt.verifyToken], asyncHandler(controller.numberOfUpcomingEvents));
  app.get(api+"countOnlineClassesInModule", [authJwt.verifyToken], asyncHandler(controller.countOnlineClassesInModule));
  app.get(api+"countExamsInModule", [authJwt.verifyToken], asyncHandler(controller.countExamsInModule));
  app.get(api+"countHomeworksInModule", [authJwt.verifyToken], asyncHandler(controller.countHomeworksInModule));

  app.post(api+":eventId/meeting/start", [authJwt.verifyToken, authJwt.canExamineEvent], asyncHandler(controller.startMeeting));
  app.post(api+":eventId/meeting/end", [authJwt.verifyToken, authJwt.canExamineEvent], asyncHandler(controller.endMeeting));

  app.get(api+":eventId/meeting/url", [authJwt.verifyToken, authJwt.canOverviewEvent], asyncHandler(controller.getMeetingUrl));
  app.get(api+":eventId/meeting/details", [authJwt.verifyToken, authJwt.canOverviewEvent], asyncHandler(controller.getMeetingDetails));
};
