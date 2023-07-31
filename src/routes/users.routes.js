const express = require("express")
const usersRoutes = express()
const multer = require("multer")

const uploadConfig = require("../config/upload")

const containsData = require("../middlewares/containsData.js")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated.js")

const usersController = require("../controllers/usersController.js")
const UserAvatarController = require("../controllers/userAvatarController")


const upload = multer(uploadConfig.MULTER)

usersRoutes.post("/", containsData, usersController.createUser)
usersRoutes.put("/", ensureAuthenticated, usersController.updateUser)
usersRoutes.delete("/:user_id", usersController.deleteUser)
usersRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), UserAvatarController.updateFile)

module.exports = usersRoutes;