const app = require("./server");
const dbConfig = require("./app/config/db.config");
const http = require('http');
const { createServer } = require("http");
const { Server } = require("socket.io");

const mongoose = require('mongoose');

const db = require("./app/models");
const {searchengine, createMapping, removeIndex} = require("./app/models/search-engine");
const utils = require("./app/utils/database")
const {createBraincorePedagogyTests} = require("./app/utils/database/braincorePedagogyTests")
const {createBraincoreAdultTests} = require("./app/utils/database/braincoreAdultTests")
const {createOrientationTests} = require("./app/utils/orientationTests")
const {initSocket} = require('./app/socketio/index');


mongoose
  .connect(`mongodb://${dbConfig.USER}:${dbConfig.PASS}@${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initializeDatabase()
    startServer()
    pingElasticsearch(10);
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });


function pingElasticsearch(attempts=10){
  console.log("###ELASTICSEARCH### Trying to connect to ElasticSearch");
  searchengine.ping({}, async function (error) {
    if (error) {
      console.error("###ELASTICSEARCH### Could not connect to ElasticSearch. Next attempt after 15s. Attempts left:", attempts);
      attempts--;
      if (attempts>0) setTimeout(function() { pingElasticsearch(attempts); }, 15000);
      else {
        console.log('###ELASTICSEARCH### Failed to connect to ElasticSearch !!!');
      }
    } else {
      console.log('###ELASTICSEARCH### Successfully connect to ElasticSearch');
        await removeIndex('contents')
        await removeIndex('certificationsessions')
        try {
          await createMapping(db.content, 'contents')
          await createMapping(db.certificationSession, 'certificationsessions')
        } catch (e) {
          console.error("###ELASTICSEARCH### Error when creating mappings", e)
        }
    }
  });
}


async function initializeDatabase() {
  
  await utils.createAdminUser()
  await utils.createInterests()
  await utils.createSubinterests()
  await utils.createGradingScaleRef()
  await utils.createRolePermissionRef()
  await utils.createEcosystem()
  await utils.createEcoManager()
  
  if (process.env.BACKEND_ENV == "development"){
    await utils.createDemo()
    await utils.createCloudManager()
    await utils.createSubscriptionOwner()
    await utils.createModuleManager()
    await utils.createAssistant()
    await utils.createModuleCore()
    await utils.createArchitect()
    await utils.createClassManager()
    await utils.createLibrarian()
    await utils.createTrainer()
    await utils.createTrainee()
    await utils.createSentinelTrainee()
    await utils.createParent()
    await utils.createInspector()
    await utils.createTrainingManager()
    await utils.createCoordinator()
    await utils.createTrainingPath()
    await utils.createTrainingModule()
    await utils.createChapter()
    await utils.createContent()
    await utils.createContentFile()
    await utils.initFolder()
    await utils.createGroup()
    await utils.createTeam()
    await utils.createAcademicYearRef()
    await utils.createCategoryRef()
    await utils.createEvent()
    await utils.createResults()
    await utils.createSentinelResults()
    await utils.createBraincoreTestsResults()
    await utils.createSoftSkillsTemplate()
    await utils.createSoftSkill()
    await utils.createCompetenceBlock()
    await utils.createCompetence()
    await utils.createCertificate()
    await utils.createCertificationSession()
    await utils.createCompany()
    await utils.createPartner()
    await utils.createInternship()
    await utils.createEnquiry()
    await utils.createCourse()
    await utils.createCoursePath()
    await utils.createCertificateTemplate()
    await utils.createCoursePathImage()
    await utils.createCourseImage()
    await utils.createFormat()
    await utils.createBook()
    await utils.createBookAuthor()
    await utils.createNotifications()
    await utils.createSubjectSession()
  }

  // This will run for both development and production environments
  await utils.createRoleMasters(); // Role Masters
  await utils.createPermissions(); // permissions
  await utils.createRolePermissionsMappings(); // Role Permissions Mappings

  // Cognitive tests and data
  createBraincorePedagogyTests();
  createBraincoreAdultTests();
  createOrientationTests();

  // Cognitive descriptions - traits/profiles/opportunities
  await utils.createCognitiveData();
}



async function startServer() {
  const PORT = process.env.PORT || 80;
  const httpServer = createServer(app);
  httpServer.listen(PORT, '0.0.0.0',  () => {
    console.log(`Server is running on port ${PORT}.`);
  });

  initSocket(httpServer);
}
