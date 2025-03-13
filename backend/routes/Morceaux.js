const app = require('express')
const router = app.Router()

const morceauCtrl = require('../controllers/Morceau')

router.post('/create/song', morceauCtrl.createMorceau)
router.get('/songs/:id', async (req, res) => {
    try {
        const morceaux = await morceauCtrl.getMorceauWithGenre(req.params.id)
        res.json(morceaux)
    } catch (error) {
        console.error(error)
        res.status(500).json({error})
    }
})
router.get('/songs', morceauCtrl.getSongs)

module.exports = router