const express = require('express')
const router = express.Router()

const {
    getUserProfile,
    updateUserProfile,
    updateUserPassword
} = require('../controllers/userProfileController')

const { 
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser    
} = require('../controllers/userController')

const {
    profileValidator, passwordValidator,
    createUserValidator, updateUserValidator
} = require("../validators/userValidator");

const validationMiddleware = require('../middleware/validation')
const authenticate = require('../middleware/authentication')
const authorize = require('../middleware/authorize')

router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, profileValidator, validationMiddleware , updateUserProfile);
router.put('/change-password', authenticate, passwordValidator, validationMiddleware, updateUserPassword);

router.get('/', authenticate, authorize('admin'), getAllUsers);
router.post('/', authenticate, authorize('admin'), createUserValidator, validationMiddleware, createUser);
router.get('/:id', authenticate, authorize('admin'), getUserById);
router.put('/:id', authenticate, authorize('admin'), updateUserValidator, validationMiddleware, updateUser);
router.delete('/:id', authenticate, authorize('admin'), deleteUser);

module.exports = router