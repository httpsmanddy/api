const config = require("../../../knexfile.js")
const knex = require("knex")

const connectionKnex = knex(config.development)

module.exports = connectionKnex