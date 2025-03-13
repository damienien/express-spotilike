const mongoose = require('mongoose')

const albumSchema = mongoose.Schema({
    title: {type: String, required: true},
    cover: {type: String, required: true},
    date: {type: Date, required: true},
    morceaux: [{type: mongoose.Schema.Types.ObjectId, ref: 'morceau', required: true}],
    artistes: {type: mongoose.Schema.Types.ObjectId, ref: 'artiste', required: true}
})

module.exports = mongoose.model('album', albumSchema)