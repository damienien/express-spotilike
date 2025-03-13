const mongoose = require('mongoose')
const Album = require('./Album')

// Un morceau n'est pas forcément attribuer à un album mais un album à obligatoirement des morceaux
const morceauSchema = mongoose.Schema({
    title: {type: String, required: true},
    length: {type: Number, required: true},
    artiste: {type: mongoose.Schema.Types.ObjectId, ref: 'artiste', required: true},
    genre: {type: mongoose.Schema.Types.ObjectId, ref: 'genre', required: true},
    album: {type: mongoose.Schema.Types.ObjectId, ref: 'album', required: false}
})

morceauSchema.pre("remove", async function(next){
    try{
        await Album.deleteMany({morceaux: this._id})
        next()
    } catch(error){
        next(error)
    }
})

module.exports = mongoose.model('morceau', morceauSchema)