const Genre = require('../models/Genre')

exports.createGenre = (req, res, next) => {
    delete req.body._id
    const genre = new Genre({
        ...req.body
    })
    genre.save()
    .then(() => res.status(200).json({ message: "Genre créé avec succès !"}))
    .catch((error) => res.status(400).json({ error }))
}

exports.getGenres = (req, res, next) => {
    Genre.find()
    .then((genre) => res.status(200).json(genre))
    .catch(error => res.status(400).json({error}))
}

exports.modifyGenre = (req, res, next) => {
    Genre.updateOne({id_: req.params.id}, {...req.body, _id: req.params.id})
    .then(() => res.status(200).json({ message: "Genre modifié !" }))
    .catch((error) => res.status(400).json({ error }))
}