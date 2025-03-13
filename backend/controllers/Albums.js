const { default: mongoose } = require("mongoose");
const album = require("../models/Album");
const morceau = require("../models/Morceau");

exports.allAlbums = (req, res, next) => {
  album
    .find()
    .then((albums) => res.status(200).json(albums))
    .catch((error) => res.status(400).json({ error }));
};

exports.getAlbum = (req, res, next) => {
  album
    .findById({ _id: req.params.id })
    .then((album) => res.status(200).json(album))
    .catch((error) => res.status(400).json({ error }));
};

exports.getAlbumWithArtists = async (id) => {
  try {
    const result = await album.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "artistes",
          localField: "artistes",
          foreignField: "_id",
          as: "artisteInfo",
        },
      },
      {
        $unwind: "$artisteInfo",
      },
      {
        $project: {
          _id: id,
          title: 1,
          cover: 1,
          date: 1,
          morceaux: 1,
          artistes: "$artisteInfo.name",
        },
      },
    ]);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getAllSongByAlbum = (req, res, next) => {
  const albumId = req.params.id;
  morceau
    .find({ album: albumId })
    .then((morc) => res.status(200).json(morc))
    .catch((error) => res.status(500).json({ error }));
};

exports.createAlbum = (req, res, next) => {
  delete req.body._id;

  const alb = new album({
    ...req.body,
  });
  
  alb
    .save()
    .then(() => res.status(200).json({ message: "Album créé avec succès !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifyAlbum = (req, res, next) => {
  album
    .updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Album modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.addSongToAlbum = async (req, res) => {
  const morceauxId = req.body.morceaux;
  try {
    const Album = await album.findById({ _id: req.params.id });
    const morceauxObjectId = morceauxId.map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    Album.morceaux = Album.morceaux.concat(morceauxObjectId);

    await Album.save();
    return res
      .status(200)
      .json({ message: "Morceaux ajoutés à l'album avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'ajout du morceau à l'album :", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de l'ajout du morceau à l'album" });
  }
};

exports.deleteAlbum = (req, res, next) => {
  album
    .deleteOne({ _id: req.params.id })
    .then(() =>
      res.status(200).json({ message: "Album supprimé avec succès !" })
    )
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSongAlbum = async (req, res) => {
  const idSong = req.body._id;
  try {
    const Album = await album.findById({ _id: req.params.id });
    Album.morceaux = Album.morceaux.filter(
      (morceauId) => morceauId.toString() !== idSong
    );
    Album.save()
    res.status(200).json({ message: 'Morceau retiré de l\'album avec succès' });
  } catch (error) {
    console.error(
      "Erreur lors de la suppression du morceau de l'album :",
      error
    );
    res
      .status(500)
      .json({
        message: "Erreur serveur lors de la suppression du morceau de l'album",
      });
  }
};
