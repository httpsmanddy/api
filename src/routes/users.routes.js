const {Router} = require(express);

const usersRoutes = Router();

usersRoutes("/", (request, response) => {
    const { name, email, password } = request.body;
    
    response.json({name, email, password});
});

module.exports = usersRoutes;