const express = require('express');
const dotenv = require('dotenv').config()
const cors = require('cors')

const app = express();
const artistesRoute = require('./routes/Artistes')
const genresRoute = require('./routes/Genres')
const morceauxRoute = require('./routes/Morceaux')
const albumsRoute = require('./routes/Albums')
const userRoute = require('./routes/Users')
const client_id = process.env.SPOTIFY_CLIENT_ID // Spotify CLIENT ID
const client_secret = process.env.SPOTIFY_KEY // Spotify SECRET KEY
const Artiste = require('./models/Artiste')
const Morceau = require('./models/Morceau')
const Album = require('./models/Album')

const connectDB = require('./config/db')
connectDB()

app.use(cors())
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
})

app.use('/api', artistesRoute)
app.use('/api', genresRoute)
app.use('/api', morceauxRoute)
app.use('/api', albumsRoute)
app.use('/api/user', userRoute)


module.exports = app;
