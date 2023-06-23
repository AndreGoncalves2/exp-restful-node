const { Router } = require("express");
const NotesController = require("../controllers/NotesControllers");
const ensureAuthenticated = require("../middlewares/ensureAuthenticator");

const notesController = new NotesController();

const notesRoutes = Router();

notesRoutes.use(ensureAuthenticated);

notesRoutes.post("/", notesController.create);
notesRoutes.get("/", notesController.index);
notesRoutes.get("/:id", notesController.show);
notesRoutes.delete("/:id", notesController.delete);

module.exports = notesRoutes;