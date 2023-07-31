const { format } = require("date-fns")

const dateAndTimeFormatted = () => {

    const currentDate = new Date()
    const formattedDateTime = format(currentDate, "dd/MM/yyyy HH:mm:ss") 

    return formattedDateTime
}

module.exports = dateAndTimeFormatted