const AppError = require("../utils/appError")

const containsData = (request, response, next) => {

    const arrayObject = Object.keys(request.body);
    const arrayValue = Object.values(request.body);

    for(let i = 0; i < arrayObject.length; i++){

        if(arrayValue[i] === 0){
            return next()
        }

        if(arrayValue[i] == false){
            throw new AppError(`Necessary to inform: ${arrayObject[i]}`, 401)
        }
    }

    next()
}

module.exports = containsData