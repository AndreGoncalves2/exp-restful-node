const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");

const UsersController = require("../controllers/UsersControllers");
const UsersAvatarControllers = require("../controllers/UsersAvatarControllers");

const ensureAuthenticated = require("../middlewares/ensureAuthenticator");

const usersController = new UsersController();
const usersAvatarControllers = new UsersAvatarControllers();

const userRoutes = Router();
const upload = multer(uploadConfig.MULTER);


userRoutes.post("/", usersController.create);
userRoutes.put("/", ensureAuthenticated, usersController.update);
userRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), usersAvatarControllers.update)


module.exports = userRoutes;