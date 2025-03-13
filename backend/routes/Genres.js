const app = require('express')
const router = app.Router()

const genreCtrl = require('../controllers/Genre')

router.post('/create/genre', genreCtrl.createGenre )

router.get('/genres', genreCtrl.getGenres )

router.put('/genres/:id', genreCtrl.modifyGenre)


module.exports = router