const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/User')

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '5d'
    })
}


exports.registerUser = asyncHandler(async (req, res) => {
    const { username, password, email } = req.body

    if(!username || !password || !email) {
        res.status(400)
        throw new Error('Please add all fields !')
    }

    const userExist = await User.findOne({ email })
    if(userExist){
        res.status(400)
        throw new Error('User already exists !')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = await User.create({
        username,
        password: hashedPassword,
        email
    })

    if(newUser){
        res.status(201).json({
            _id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            token: generateToken(newUser.id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})
exports.loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body

    const user = await User.findOne({ email })

    if(user && (await bcrypt.compare(password, user.password))){
        res.status(201).json({
            _id: user.id,
            username: user.username,
            email: user.email,
            token: generateToken(user.id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid credentials !')
    }
})
exports.getMe = asyncHandler(async (req, res)=> {
    res.status(200).json({ message: 'User data'})
})