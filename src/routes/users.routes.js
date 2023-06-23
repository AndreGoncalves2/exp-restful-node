const { Router } = require("express");
const UsersController = require("../controllers/UsersControllers");

const ensureAuthenticated = require("../middlewares/ensureAuthenticator");

const usersController = new UsersController();

const userRoutes = Router();

userRoutes.post("/", usersController.create);
userRoutes.put("/", ensureAuthenticated, usersController.update);


module.exports = userRoutes;