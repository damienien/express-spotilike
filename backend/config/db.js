const mongoose = require('mongoose');

const connectDb = async () => {
  try {
    const cn = mongoose.connect(process.env.MONGO_URI, {dbName: 'spotilike'},
    { useNewUrlParser: true,
      useUnifiedTopology: true })
    
    console.log(`Connexion à mongoDB réussi`)
  } catch (err){
    console.log(err)
    process.exit(1)
  }
}

module.exports = connectDb