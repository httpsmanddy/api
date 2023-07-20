const {Router} = require(express);

const usersController = require("../controllers/usersController");

const usersRoutes = Router();

const usersController = new usersController();

usersRoutes.post("/", usersController.create);

module.exports = usersRoutes;