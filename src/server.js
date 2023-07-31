require("dotenv/config")
require("express-async-errors")
const AppError = require("./utils/appError.js")

const express = require("express")
const app = express()

const cors = require("cors")
app.use(cors())

app.use(express.json())

const uploadConfig = require("./config/upload.js")
app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER))

const routes = require("../src/routes/index.js")
app.use(routes)

const sqliteConnection = require("./dataBase/sqlite/index.js")
sqliteConnection()

app.use((error, request, response, next) => {

    if(error instanceof AppError){
        return response.status(error.statusCode).json({
            statusCode: error.statusCode,
            message: error.message
        })
    }
    
    console.error(error)

    return response.json({
        statusCode: 500,
        message: "Internal Server Error"
    })
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server is running on port: ${port}`))