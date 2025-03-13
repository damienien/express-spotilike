const { default: mongoose } = require('mongoose')
const Morceau = require('../models/Morceau')
exports.createMorceau = (req, res, next) => {
    delete req.body._id
    const morceau = new Morceau({
        ...req.body
    })
    morceau.save()
    .then(morceau => res.status(200).json({ message: `Morceau ${morceau} créé avec succès !`}))
    .catch(error => res.status(400).json({error}))
}

exports.getSongs = (req, res) => {
    Morceau.find()
    .then(response => { return res.status(200).json(response)})
    .catch(error => res.status(400).json({error}))
}

exports.getMorceauWithGenre = async (id) => {
    try {
        const result = await Morceau.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: 'genres',
                    localField: 'genre',
                    foreignField: '_id',
                    as: 'genreInfo'
                }
            },
            {
                $unwind: '$genreInfo'
            },
            {
                $lookup: {
                    from: 'artistes',
                    localField: 'artiste',
                    foreignField: '_id',
                    as: 'artisteInfo'
                }
            },
            {
                $unwind: '$artisteInfo'
            },
            {
                $lookup: {
                    from: 'albums',
                    localField: 'album',
                    foreignField: '_id',
                    as: 'albumInfo'
                }
            },
            {
                $unwind: '$albumInfo'
            },
            {
                $project: {
                    _id: id,
                    title: 1,
                    length: 1,
                    artiste: '$artisteInfo.name',
                    album: '$albumInfo.title',
                    genre: '$genreInfo.title'
                }
            }
        ])
        return result
    } catch(error){
        console.error(error)
        throw error
    }
}