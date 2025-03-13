const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {
        type: String, 
        required: [true, "Please add an username"]
    },
    password: {
        type: String,
        required: [true, "Please add a password"]
    },
    email: {
        type: String,
        required: [true, "Please add an email"]
    }
},
{ timestamp: true}
)

module.exports = mongoose.model('user', userSchema)