const app = require('express')
const router = app.Router()
const {protect} = require('../middleware/auth')

const albumCtrl = require('../controllers/Albums')

router.get('/albums', albumCtrl.allAlbums)
router.get('/albums/:id', async(req, res) => {
    try {
        const album = await albumCtrl.getAlbumWithArtists(req.params.id)
        res.json(album)
    } catch (error) {
        console.error(error)
        res.status(500).json({error})
    }
})
router.get('/albums/songs/:id', albumCtrl.getAllSongByAlbum)
router.post('/albums/create', protect, albumCtrl.createAlbum)
router.post('/albums/songs/:id', protect, albumCtrl.addSongToAlbum)
router.put('/albums/:id', protect, albumCtrl.modifyAlbum)
router.delete('/albums/:id', protect, albumCtrl.deleteAlbum)
router.delete('/albums/songs/:id', albumCtrl.deleteSongAlbum)

module.exports = router