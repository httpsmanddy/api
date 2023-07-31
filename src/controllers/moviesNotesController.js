const AppError = require("../utils/appError")
const knex = require("../dataBase/knex/index.js")
const dateAndTimeFormatted = require("../utils/dateAndTimeFormatted.js")

class UsersController {

    async createMoviesNotes(request, response){
        const user_id = request.user.id
        const {title, description, rating, tags} = request.body

        const [user] = await knex("users").where("id", user_id)
        
        if(!user){
            throw new AppError("Usuário não encontrado")
        }

        const ratingRange = rating >= 1 && rating <=5

        if(!ratingRange){
            throw new AppError("Informe uma nota entre 1 e 5!")
        }

        const [movie_notes_id] = await knex("movie_notes").insert({
            title,
            description,
            rating,
            user_id,
            created_at: dateAndTimeFormatted(),
            updated_at: dateAndTimeFormatted()
        })
        
        const tagsInsert = tags.map(tag => {
            return {
                name: tag,
                movie_notes_id,
                user_id
            }
        })

        await knex("movie_tags").insert(tagsInsert)

        response.json({
            statusCode: 200,
            message: "Nota de filme cadastrada com sucesso"
        })
    }

    async deleteMoviesNotes(request, response){
        const {movie_note_id} = request.params

        await knex("movie_notes").where("id", movie_note_id).delete()
        
        response.json({
            statusCode: 200,
            message: " Nota de filme deletada com sucesso"
        })
    }

    async showMoviesNotes(request, response){
        const {movie_note_id} = request.params

        const movieNote = await knex.select(
            "id",
            "user_id",
            "rating",
            "title",
            "description",
            "created_at"
        )
        .from('movie_notes').where('id', movie_note_id).first()
        
        const movieTags = await knex("movie_tags")
            .where("movie_notes_id", movie_note_id)
            .orderBy("id")

        return response.json({
            ...movieNote,
            movieTags
        })
    }

    async indexMoviesNotes(request, response){
        const { title, movieTags} = request.query
        const user_id = request.user.id

        let movieNote

        if(movieTags){
            const filterMoviesTags = movieTags.split(",").map(movieTag => movieTag.trim())
            movieNote = await knex("movie_tags")
            .select([
                "movie_notes.id",
                "movie_notes.user_id",
                "movie_notes.title",
                "movie_notes.description",
                "movie_notes.rating",
            ])
            .where("movie_notes.user_id", user_id)
            .whereLike("movie_notes.title", `%${title}%`)
            .whereIn("name", filterMoviesTags)
            .innerJoin("movie_notes", "movie_notes.user_id","movie_tags.user_id")
            .orderBy("movie_notes.title")

        }else{
            movieNote = await knex.select(
                "id",
                "user_id",
                "title",
                "description",
                "rating",
            ).from("movie_notes")
            .where({user_id})
            .whereLike("title",`%${title}%`)
            .orderBy("title")
        }

        const movieTagsByUserId = await knex("movie_tags").where("user_id", user_id)
        
        const movieNotesWithMovieTags = movieNote.map(notesMovie => {
            const movieNoteTags = movieTagsByUserId.filter(tags => tags.movie_notes_id === notesMovie.id)
            
            return{
                ...notesMovie,
                movieNoteTags
            }
        })

        response.json(movieNotesWithMovieTags)

    }
}

module.exports = new UsersController