const express = require("express");
// const bodyParser = require("body-parser");
require('dotenv').config({path: '../../.env'});
const cors = require("cors");
const app = express();
var morgan = require('morgan')

//generate_swagger_documentation()


// Static files with extracted SCORM packages
app.use('/api/v1/static/scorm', express.static('/app/public/tmp/scorm'))
// Serve static pdf files
app.use('/api/v1/static/pdf', express.static(__dirname + '/public/result/files/'));

// For development enable all CORS Requests
// This will allow local services to connect to the backend on the development environment 
if (process.env.BACKEND_ENV == 'development') {
  app.use(cors())
}else {
  var corsOptions = {"origin": '[]'};// Only the same domain
  app.use(cors(corsOptions));
}

// Allow bigger request for inline files in ContentFactory
app.use(express.json({limit: '20mb'}));
app.use(express.urlencoded({extended: true}));

// parse requests of content-type - application/json
// app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }));

// Log all request in console for production
// following describes morgan token details
// combined=> :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"
// dev => :method :url :status :res[content-length] - :response-time ms
// short => :remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms
// tiny => :method :url :status :res[content-length] - :response-time ms
// other tokens => :total-time[digits] :response-time[digits] :req[header] :res[header] :req[querystring] :res[querystring] :req[body] :res[body]
if (process.env.BACKEND_ENV == "production"){
  app.use(morgan('combined', {
    skip: function (req, res) { 
      return process.env.NODE_ENV === 'test' // skip morgan logging in test mode (e.g. unit tests)
      // || res.statusCode < 400 // only log error responses
    } 
  }))
} else { // morgan token when not in production
  morgan.token('params', function (req, res) { return JSON.stringify(req.params) });
  morgan.token('query', function (req, res) { return JSON.stringify(req.query) });
  // morgan.token('headers', function (req, res) { return JSON.stringify(req.headers) });
  morgan.token('body', function (req, res) { return JSON.stringify(req.body) });
  // morgan.token('cookies', function (req, res) { return JSON.stringify(req.cookies) });
  // morgan.token('userId', function (req, res) { return JSON.stringify(req.userId) });

  app.use(morgan(':method >>> :url >>> :status >>> :res[content-length] >>> :response-time ms >>> :params >>> :query >>> :body', {
    skip: function (req, res) { 
      return process.env.NODE_ENV === 'test' // skip logging in test mode (e.g. unit tests)
      // || res.statusCode < 400 // only log error responses
    } 
  }));

  // Generate swagger documentation only for dev or elia.lc
  if (process.env.BACKEND_ENV != "production" ) generate_swagger_documentation()
}

// routes
app.get("/healthz",(req, res)=>res.sendStatus(200)); // health check
app.get("/.well-known/*",(req, res)=>res.sendStatus(200)); // health check
require("./app/routes/admin.routes")(app);
require("./app/routes/blockchain.routes")(app);
require("./app/routes/log.routes")(app);
require("./app/routes/algorithms.routes")(app);
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/interest.routes")(app);
require("./app/routes/training_module.routes")(app);
require("./app/routes/chapter.routes")(app);
require("./app/routes/event.routes")(app);
require("./app/routes/soft_skills_template.routes")(app);
require("./app/routes/ecosystem.routes")(app);
require("./app/routes/subscription.routes")(app);
require("./app/routes/module.routes")(app);
require("./app/routes/module-core.routes")(app);
require("./app/routes/content.routes")(app);
require("./app/routes/library.routes")(app);
require("./app/routes/cloud.routes")(app);
require("./app/routes/certificate.routes")(app);
require("./app/routes/certification_session.routes")(app);
require("./app/routes/subject_session.routes")(app);
require("./app/routes/competence_block.routes")(app);
require("./app/routes/competence.routes")(app);
require("./app/routes/company.routes")(app);
require("./app/routes/course.routes")(app);
require("./app/routes/course_path.routes")(app);
require("./app/routes/internship.routes")(app);
require("./app/routes/result.routes")(app);
require("./app/routes/group.routes")(app);
require("./app/routes/enquiry.routes")(app);
require("./app/routes/format.routes")(app);
require("./app/routes/commonData.routes")(app);
require("./app/routes/source_material.routes")(app);
require("./app/routes/notification.routes")(app);
require("./app/routes/order.routes")(app);
require("./app/routes/dashboard_stats.routes")(app);
require("./app/routes/orientation_test.routes")(app);
require("./app/routes/roleMaster.routes")(app);
require("./app/routes/permissions.routes")(app);
require("./app/routes/team.routes")(app);
require("./app/routes/brainCoreTest.route")(app);
require("./app/routes/projects.routes")(app);
require("./app/routes/folder.routes")(app);
require("./app/routes/credit.routes")(app);

//testing
require("./app/routes/testing.routes")(app);

// mobile
require("./app/routes/mobile/mian.route")(app);

module.exports = app;


function generate_swagger_documentation(){
    const init = {
      "definition": {
        "info": {
          "title": "Backend - documentation",
          "version": "1.1.0",
          "license": {
            "name": "ISC"
          },
          "description": `Specification JSONs: [v2](/api-spec/v2), [v3](/api-spec/v3).
          
[List_of_HTTP_status_code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)

Only endpoints with tags starting with '_' are manually created and validated. 
Tags for the remaining endpoints were generated automatically and might not fully support the 'Try it out' function.


`
        },
        "paths": {},
        "schemes": [
          "http","https"
        ],
        "securityDefinitions": {
          "bearerAuthJWT": {
            "name": "authorization",
            "description": `In order to generate the JWT:
- Use **/api/v1/auth/signin/** endpoint to login as one of the users 
- Copy returned **access_token** from the response
- In the input below put: **Bearer <access_token>**`,
            "default": 'Bearer ',
            "in": "header",
            "type": "apiKey"
          },
          // "OAuth2": {
          //   "type": "oauth2",
          //   "flow": "password",
          //   "tokenUrl": "/api/v1/auth/signin",
          //   "scopes": {
          //     "HELP": "In case you want to test some specific scopes you can use root account in order to request specific scopes from the list below:",
          //     "users:read:all": "Grants read access for all users",
          //     "users:read:999999999999999999999999": "Grants read access for initial user",
          //     "recommendations:all:all": "Grants all access for all recommendations",
          //     "recommendations:write:all": "Grants write access for all recommendations",
          //     "chapters:read:all": "Grants read access for all Chapters",
          //     "training_modules:read:all": "Grants read access for all Training Modules",
          //     "all:all:all": "Grants all access to all resources"
          //   }
          // }
        },
        "security": [{'bearerAuthJWT': []}],
        "swagger": "2.0",
        "tags": [],
      
      },
      apis: ['./app/controllers/*.controller.js', './app/controllers/mobile/*.controller.js']
    }

    const db = require("./app/models");
    if(process.env.BACKEND_ENV == 'development') {
      // Initial documentation based om `@openapi` declaration
      const swaggerJsdoc = require('swagger-jsdoc');
      const initialData = swaggerJsdoc(init);

      // Automated docs for all rutes with missing `@openapi` declaration
      const expressOasGenerator = require('express-oas-generator');
      
      //var data = require("./swagger/swagger.json");
      expressOasGenerator.init(app, initialData, undefined, 6 * 1000, 'docs', db.mongoose.modelNames(), [
      // New groups with manually created docs
      "_auth", "_admin", "_credits", "_contents", "_results", "_orders", "_projects", "_projects_collections", "_library", '_my_results', '_virtual_coach', '_resources', '_team_module', '_feedback', '_Brain Core Test Registration', '_Cognitive User Module', '_Permissions', '_Role Master', '_Team',
      // Old automated groups
      'admin', 'algorithms', 'auth', 'blockchain', 'certificates', 'certification_session', 'chapters', 'cloud', 'commonData', 'company', 'competence_block', 'competences', 'contents', 'coursePaths', 'courses', 'dashboard_stats', 'ecosystems', 'enquiry', 'events', 'formats', 'groups', 'internships', 'library', 'logs', 'mobile', 'module-core', 'modules', 'notifications', 'orders', 'result', 'soft-skills', 'source-material', 'subject_session', 'subscriptions', 'training-modules', 'users']);
    }
}