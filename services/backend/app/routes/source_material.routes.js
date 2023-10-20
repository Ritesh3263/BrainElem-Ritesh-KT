const { authJwt } = require("../middlewares");
const asyncHandler = require("express-async-handler");
const controller = require("../controllers/source_material.controller");
const api = "/api/v1/source-material/";

module.exports = function(app) {
    // => auth [permissions]?
    app.post(api+"add",[authJwt.verifyToken], asyncHandler(controller.add));
    app.get(api+"read/:sourceMaterialId",[authJwt.verifyToken], asyncHandler(controller.read));
    app.get(api+"readAll",[authJwt.verifyToken], asyncHandler(controller.readAll));
    app.put(api+"update/:sourceMaterialId",[authJwt.verifyToken], asyncHandler(controller.update));
    app.delete(api+"delete/:sourceMaterialId",[authJwt.verifyToken], asyncHandler(controller.remove));

    app.post(api+"addBookAuthor",[authJwt.verifyToken], asyncHandler(controller.addBookAuthor));
    app.get(api+"readBookAuthor/:authorId",[authJwt.verifyToken], asyncHandler(controller.readBookAuthor));
    app.get(api+"readAllBookAuthors",[authJwt.verifyToken], asyncHandler(controller.readAllBookAuthors));
    app.put(api+"updateBookAuthor/:authorId",[authJwt.verifyToken], asyncHandler(controller.updateBookAuthor));
    app.delete(api+"deleteBookAuthor/:authorId",[authJwt.verifyToken], asyncHandler(controller.deleteBookAuthor));
};