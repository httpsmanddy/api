const AppError = require("../utils/appError")
const knex = require("../dataBase/knex/index.js")
const {hash, compare} = require("bcrypt")
const dateAndTimeFormatted = require("../utils/dateAndTimeFormatted.js")

class UsersController {

    async createUser(request, response){
        const {name, email, password, confirmPassword} = request.body
        
        const [checkUserExists] = await knex.select("*").from("users").where("email", email)
        
        if(checkUserExists){
            throw new AppError("Usuário já cadastrado no sistema",401)
        }

        if(password != confirmPassword){
            throw new AppError("Confirmação de senha invalida", 401)
        }

        const hashedPassword = await hash(password,8)

        await knex("users").insert({
            name,
            email,
            password: hashedPassword,
            created_at: dateAndTimeFormatted(),
            updated_at: dateAndTimeFormatted()
        })

        response.json({
            statusCode: 200,
            message: "Usuário Cadastrado com sucesso"
        })
    }

    async updateUser (request, response) {
        const id = request.user.id
        const {name, email, password, oldPassword} = request.body
        
        const [user] = await knex("users").where("id", id)
        
        if(!user){
            throw new AppError("Usuário não encontrado", 400)
        }

        const [emailExists] = await knex.select("*").from("users").where("email", email)

        if(emailExists && emailExists.id != user.id){
            throw new AppError("E-mail encontra-se em uso")
        }

        if(!oldPassword && !password){
            user.name = name ?? user.name
            user.email = email ?? user.email
            user.updated_at = dateAndTimeFormatted()

            await knex.update({
                name: user.name,
                email: user.email,
            }).table("users").where("id", id)

            return response.json({
                statusCode: 200,
                message: "Usuário atualizado com sucesso"
            })
        }

        const checkOldPassword = await compare(oldPassword, user.password)

        if(!checkOldPassword){
            throw new AppError("Senha antiga não confere")
        }

        if(!password){
            throw new AppError("Necessário informar a nova senha")
        }

        const newHashPassword = await hash(password, 8)

        user.name = name ?? user.name
        user.email = email ?? user.email
        user.password = newHashPassword
        user.updated_at = dateAndTimeFormatted()

        await knex.update({
            name: user.name,
            email: user.email,
            password: user.password,
            updated_at: user.updated_at
        }).table("users").where("id", id)

        return response.json({
            statusCode: 200,
            message: "Usuário atualizado com sucesso"
        })

    }

    async deleteUser (request, response) {
        const {isAdmin} = request.body
        const {user_id} = request.params

        if(!isAdmin){
            throw new AppError("Usuário não é administrador", 401)
        }

        const [user] = await knex("users").where("id", user_id)
        
        if(!user){
            throw new AppError("Usuário não encontrado", 401)
        }

        await knex("users").where("id", user_id).delete()

        return response.json({
            statusCode: 200,
            message: "Usuário deletado com sucesso"
        })

    }
}

module.exports = new UsersController
