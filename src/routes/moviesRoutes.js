const express = require("express")
const moviesNotesRoutes = express()

const moviesNotesController = require("../controllers/moviesNotesController.js")
const containsData = require("../middlewares/containsData.js")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated.js")

moviesNotesRoutes.use(ensureAuthenticated)

moviesNotesRoutes.post("/", containsData, moviesNotesController.createMoviesNotes)
moviesNotesRoutes.delete("/:movie_note_id", moviesNotesController.deleteMoviesNotes)
moviesNotesRoutes.get("/:movie_note_id", moviesNotesController.showMoviesNotes)
moviesNotesRoutes.get("/", moviesNotesController.indexMoviesNotes)

module.exports = moviesNotesRoutes
