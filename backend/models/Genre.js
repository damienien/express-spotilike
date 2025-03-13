const mongoose = require('mongoose')

const genreSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: false}
})

module.exports = mongoose.model("genre", genreSchema)