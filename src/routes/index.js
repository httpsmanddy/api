const express = require("express")
const routes = express()

const usersRoutes = require("../routes/usersRoutes.js")
const moviesRoutes = require("../routes/moviesRoutes.js")
const tagsRoutes = require("../routes/tagsRoutes.js")
const sessionsRoutes = require("../routes/sessionsRouter.js")

routes.use("/users", usersRoutes)
routes.use("/movies_notes", moviesRoutes)
routes.use("/movies_tags", tagsRoutes)
routes.use("/sessions", sessionsRoutes)

module.exports = routes