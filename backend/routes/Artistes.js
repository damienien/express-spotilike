const app = require('express')
const router = app.Router()
const {protect} = require('../middleware/auth')

const ArtisteCtrl = require('../controllers/Artistes')

router.post('/artists/create', protect, ArtisteCtrl.createArtiste)

router.get('/artists/:id', ArtisteCtrl.getArtistById)

router.get('/artist/:id', ArtisteCtrl.getFullArtist)
  
router.get('/artists/:id/songs', ArtisteCtrl.getArtiste)

router.get('/artists', ArtisteCtrl.getAllArtists)

router.put('/artists/:id', protect, ArtisteCtrl.modifyArtiste)

router.delete('/artists/:id', protect, ArtisteCtrl.deleteArtiste)

module.exports = router