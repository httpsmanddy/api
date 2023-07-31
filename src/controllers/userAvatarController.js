const AppError = require("../utils/appError")
const knex = require("../dataBase/knex/index.js")
const diskStorage = require("../providers/diskStorage")

const dateAndTimeFormatted = require("../utils/dateAndTimeFormatted.js")


class UserAvatarController {

  async updateFile(request, response) {
    
    const user_id = request.user.id
    const avatarFilename = request.file.filename

    const user = await knex("users").where({id: user_id}).first()

    if(!user){
      throw new AppError("Somente usuários autenticados podem efetuar alterações do avatar", 401)
    }

    if(user.avatar){
     await diskStorage.deleteFile(user.avatar)
    }

    const filename = await diskStorage.saveFile(avatarFilename)

    user.avatar = filename
    user.updated_at = dateAndTimeFormatted()

    await knex("users").update(user).where({id: user_id})

    return response.json(user)

  }
}

module.exports = new UserAvatarController()