const express = require('express')
const router = express.Router()

const {     
    getMyOrders,
    placeOrder,
    getOrderById,
    cancelOrder
} = require('../controllers/userOrderController')

const orderValidator = require('../validators/orderValidator')

const validationMiddleware = require('../middleware/validation')
const authenticate = require('../middleware/authentication')
const authorize = require('../middleware/authorize')

// Apply authentication and authorization middleware to all user routes
router.use(authenticate, authorize('user')) 

// user routes
router.get('/', getMyOrders)
router.post('/', orderValidator, validationMiddleware, placeOrder)
router.get('/:id', getOrderById)
router.put('/:id/cancel', cancelOrder)

module.exports = router