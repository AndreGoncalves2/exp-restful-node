const { Router } = require("express");
const TagsController = require("../controllers/TagsControllers");

const ensureAuthenticated = require("../middlewares/ensureAuthenticator");


const tagsController = new TagsController();

const tagsRoutes = Router();

tagsRoutes.get("/", ensureAuthenticated, tagsController.index);

module.exports = tagsRoutes;