const controller = require("../controllers/orientation_test.controller");
const api = "/api/v1/orientationTests/";

module.exports = function(app) {
  app.get(api+"images/:imageId/download", [], controller.downloadImage);
}
