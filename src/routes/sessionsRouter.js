const express = require("express")
const sessionsRoutes = express()

const sessionsController = require("../controllers/sessionsController.js")

sessionsRoutes.post("/", sessionsController.create)

module.exports = sessionsRoutes