const api = require('express')
const router = api.Router()
const { protect } = require('../middleware/auth')
const { registerUser, loginUser, getMe } = require('../controllers/Users')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)

module.exports = router