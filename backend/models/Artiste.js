const mongoose = require("mongoose");
const Album = require("./Album");
const Morceau = require("./Morceau");

const artisteSchema = mongoose.Schema({
  name: { type: String, required: true },
  avatar: { type: String, required: false },
  bio: { type: String, required: true },
});

artisteSchema.methods.remove =  async function (artisteId) {
    await Album.deleteMany({ artistes: artisteId });
    await this.deleteOne({ _id: artisteId })
};

module.exports = mongoose.model("artiste", artisteSchema);
