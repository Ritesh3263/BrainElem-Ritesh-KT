const { authJwt } = require("../middlewares");
const controller = require("../controllers/order.controller");
const api = "/api/v1/orders/";

module.exports = function(app) {
    app.get(api+"all", [authJwt.verifyToken], controller.getOrders);
    app.get(api+"getByResultId/:resultId", [authJwt.verifyToken, authJwt.canReadResult], controller.getByResultId);
    app.get(api+"getByCertificationSessionId/:certificationSessionId", [authJwt.verifyToken, authJwt.canReadOrderWithCertificationSessionId], controller.getByCertificationSessionId);
    app.post(api+"create", [authJwt.verifyToken], controller.create);
    app.post(api+"updateStatus/:providerId", [authJwt.verifyToken, authJwt.canReadOrderWithProviderId], controller.updateStatus);
}