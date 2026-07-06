const express = require('express')
const router = express.Router()

const {
    registerUser,
    loginUser,
    logoutUser
} = require('../controllers/authController')

const registerValidator = require("../validators/registerValidator");
const loginValidator = require("../validators/loginValidator");

const validationMiddleware = require('../middleware/validation')
const authenticate = require('../middleware/authentication')


router.post('/register', registerValidator, validationMiddleware, registerUser)
router.post('/login', loginValidator, validationMiddleware, loginUser)
router.post('/logout', authenticate, logoutUser)

module.exports = router