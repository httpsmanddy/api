const {Router} = require("express");

const UsersController = require("../controllers/usersController");

const usersRoutes = Router();

const UsersController = new UsersController();

usersRoutes.post("/", UsersController.create);

module.exports = usersRoutes;