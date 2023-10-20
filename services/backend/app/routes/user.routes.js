const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const api = "/api/v1/users/";
const asyncHandler = require("express-async-handler");
const { canReadUser } = require("../utils/userAuth");

module.exports = function(app) {
  app.put(api+"update/:userId", [authJwt.verifyToken, authJwt.canWriteUser], asyncHandler(controller.update));
  app.get(api+"all", [authJwt.verifyToken, authJwt.canReadAllUsers], asyncHandler(controller.readAll));
	// important: need to verify if the user is allowed to access userdetails 
  // user's basic information
  app.get(api+"read/:userId", [authJwt.verifyToken, authJwt.canReadUser], asyncHandler(controller.read));
  app.get(api+"get-my-roles", [authJwt.verifyToken], asyncHandler(controller.getMyRoles)); // only self can access
  app.put(api+"set-role", [authJwt.verifyToken], asyncHandler(controller.setRole)); // only self can access
  app.put(api+"approve-verification", [authJwt.verifyToken], asyncHandler(controller.approveVerification));
  app.put(api+"verify-all", [authJwt.verifyToken], asyncHandler(controller.approveAll));
  app.get(api+"get-users-certifications", [authJwt.verifyToken], asyncHandler(controller.getUsersCertifications));
  
  // all user information // no service exists, possibly can delete
  app.get(api+"get/:userId", [authJwt.verifyToken, authJwt.canReadUser], asyncHandler(controller.get));
  app.get(api+"admin",[authJwt.verifyToken, authJwt.isAdmin], asyncHandler(controller.adminBoard));
  app.get("/api/v1/getGroupIds/:userId",[authJwt.verifyToken, authJwt.canReadTraineeGroupList], asyncHandler(controller.getGroupIds));
  // My Space(Results)
  app.get(api+"tip/:userId?",[authJwt.verifyToken, authJwt.canReadUser], asyncHandler(controller.getActiveTip));
  app.get(api+"traits/:userId/:resultId",[authJwt.verifyToken, authJwt.canReadUser], asyncHandler(controller.getTraitsForSelectedResult));
  //  My Space(Virtual coach)
  app.get(api+"opportunities/:userId", [authJwt.verifyToken, authJwt.canReadUser], asyncHandler(controller.getOpportunities));
  
  // PDF cognitive report
  //app.get(api+"cognitive-report/data/:userId/:resultId",[authJwt.canDownloadBrainCoreTestReport], asyncHandler(controller.getDataForCognitiveReport));
  app.get(api+"cognitive-report/download/:userId/:resultId",[authJwt.canDownloadBrainCoreTestReport], asyncHandler(controller.downloadCognitiveReport));
  app.post(api+"cognitive-report/send/:userId/:resultId",[authJwt.verifyToken,  authJwt.canReadUser, authJwt.canDownloadBrainCoreTestReport], asyncHandler(controller.sendCognitiveReport));
  // OLD PDF cognitive report
  app.get(api+"old-cognitive-report/download/:userId/:resultId",[authJwt.canDownloadBrainCoreTestReport], asyncHandler(controller.downloadOldCognitiveReport));
  app.get(api+"old-cognitive-report/data/:userId/:resultId",[authJwt.canDownloadBrainCoreTestReport], asyncHandler(controller.getDataForEduCognitiveReport));

  app.post(api+"platform-access/send/:userId",[authJwt.verifyToken, authJwt.canReadUser], asyncHandler(controller.sendAccessToPlafrorm));


  // My Space(Results)
  app.get(api+"opportunities/identified/:userId", [authJwt.verifyToken, authJwt.canReadUser], asyncHandler(controller.getListOfAllIdentifiedOpportunities));
  app.get(api+"resources/favourites/:userId", [authJwt.verifyToken, authJwt.canReadUser], asyncHandler(controller.getFavouriteResources));
  app.get(api+"opportunities/card/:userId/:opportunityId", [authJwt.verifyToken, authJwt.canReadUser], asyncHandler(controller.getDetailsForOpportunityCard));
  app.get(api+"areas/card/:userId/:areaId", [authJwt.verifyToken, authJwt.canReadUser], asyncHandler(controller.getDetailsForAreaOfDevelopmentCard));
  // This will be moved to other controller
  app.get(api+"faq", [authJwt.verifyToken], asyncHandler(controller.getFAQ));


  // Cognitive Center
  // using `post` to send list of users in the body
  app.post(api+"traits",[authJwt.verifyToken, authJwt.canReadUsers], asyncHandler(controller.getTraits));
  // Feedback 
  app.post(api+"tip/feedback/:userId", [authJwt.verifyToken, authJwt.canReadUser], asyncHandler(controller.feedbackForTip));
  app.post(api+"opportunities/feedback/:userId", [authJwt.verifyToken, authJwt.canReadUser], asyncHandler(controller.feedbackForOpportunity));
  app.post(api+"areas/feedback/:userId", [authJwt.verifyToken, authJwt.canReadUser], asyncHandler(controller.feedbackForAreaOfDevelopment));

  // Reports
  app.get(api+"report/:userId/:reportId",[authJwt.verifyToken, authJwt.canReadReport], asyncHandler(controller.getReport));
  app.get(api+"reports/:userId",[authJwt.verifyToken, authJwt.canReadUser], asyncHandler(controller.getReports));
  app.post(api+"report/:userId",[authJwt.verifyToken, authJwt.canCreateReport], asyncHandler(controller.addReport));
  app.put(api+"report/:userId",[authJwt.verifyToken, authJwt.canUpdateReport], asyncHandler(controller.updateReport));
  app.delete(api+"report/:userId/:reportId",[authJwt.verifyToken, authJwt.canDeleteReport], asyncHandler(controller.removeReport));
  app.put(api+"hide-from-me",[authJwt.verifyToken, authJwt.canUpdateReport], asyncHandler(controller.hideFromMe));

  // Stats
  app.get(api+"countUsersInModule", [authJwt.verifyToken], asyncHandler(controller.countUsersInModule)); // can use auth: authJwt.canWriteUser but paremeter needed ,TODO
  app.get(api+"countPartners", [authJwt.verifyToken], asyncHandler(controller.countPartners)); 
  app.get(api+"countArchitects", [authJwt.verifyToken], asyncHandler(controller.countArchitects)); 
  app.get(api+"countTrainingManagers", [authJwt.verifyToken], asyncHandler(controller.countTrainingManagers)); 
  app.get(api+"countLibrarians", [authJwt.verifyToken], asyncHandler(controller.countLibrarians)); 
  app.get(api+"countTrainers", [authJwt.verifyToken], asyncHandler(controller.countTrainers)); 
  app.get(api+"countParents", [authJwt.verifyToken], asyncHandler(controller.countParents)); 
  app.get(api+"countInspectors", [authJwt.verifyToken], asyncHandler(controller.countInspectors)); 
  app.get(api+"countTrainees", [authJwt.verifyToken], asyncHandler(controller.countTrainees)); 
  app.get(api+"countCoordinators", [authJwt.verifyToken], asyncHandler(controller.countCoordinators)); 
  app.put(api+"feedback",[authJwt.verifyToken, authJwt.canWriteUser], asyncHandler(controller.feedback));

  //=> user's devices
  app.get(`${api}devices`,[authJwt.verifyToken], asyncHandler(controller.getDevices));
  app.put(`${api}devices/:deviceId`,[authJwt.verifyToken], asyncHandler(controller.updateDevice));
  app.delete(`${api}devices/:deviceId`,[authJwt.verifyToken], asyncHandler(controller.removeDevice));

  // switch centers
  app.post(`${api}switch-center`, [authJwt.verifyToken], asyncHandler(controller.switchCenter));
};
