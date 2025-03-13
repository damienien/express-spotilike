const Artiste = require("../models/Artiste");
const Morceau = require("../models/Morceau");

exports.createArtiste = (req, res, next) => {
  delete req.body._id;
  const artiste = new Artiste({
    ...req.body,
  });
  artiste
    .save()
    .then(() => res.status(201).json({ message: "Artiste enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getAllArtists = (req, res) => {
  Artiste.find()
    .then((response) => {
      return res.status(200).json(response);
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.getArtistById = async (req, res) => {
  const artist = await Artiste.findById({ _id: req.params.id });
  if (!artist) {
    return res.status(404).json({ message: "Artiste non trouvé !" });
  }
  res.json(artist["name"]);
};

exports.getFullArtist = async (req, res) => {
    const artist = await Artiste.findById({ _id: req.params.id });
    if (!artist) {
      return res.status(404).json({ message: "Artiste non trouvé !" });
    }
    return res.status(200).json(artist)
}

exports.getArtiste = async (req, res, next) => {
  try {
    const artiste = await Artiste.findById(req.params.id);
    if (!artiste) {
      return res.status(404).json({ message: "Artiste non trouvé !" });
    }

    const morceaux = await Morceau.find({ artiste: req.params.id });

    res.json(morceaux);
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.modifyArtiste = (req, res, next) => {
  Artiste.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Artiste modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteArtiste = async (req, res, next) => {
  try {
    const artisteId = req.params.id
    const artiste = await Artiste.findById(artisteId)
    artiste.remove(artisteId)
    res.status(200).json({ message: "Artiste supprimé(e) avec succès !" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'artiste :", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la suppression de l'artiste" });
  }
};
