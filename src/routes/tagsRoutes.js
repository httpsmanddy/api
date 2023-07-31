const express = require("express")
const moviesTagsRoutes = express()

const moviesTagsController = require("../controllers/moviesTagsController.js")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated.js")

moviesTagsRoutes.get("/", ensureAuthenticated, moviesTagsController.indexMoviesTags)

module.exports = moviesTagsRoutes