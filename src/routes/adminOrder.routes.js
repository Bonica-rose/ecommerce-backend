const express = require('express')
const router = express.Router()

const {     
    getAllOrders,
    updateOrderStatus,
    updatePaymentStatus,
    getOrderById,
    deleteOrder
} = require('../controllers/adminOrderController')

const validationMiddleware = require('../middleware/validation')
const authenticate = require('../middleware/authentication')
const authorize = require('../middleware/authorize')

// Apply authentication and authorization middleware to all admin routes
router.use(authenticate, authorize('admin')) 

//admin routes
router.get('/', getAllOrders)
router.patch('/:id/status', updateOrderStatus)
router.patch('/:id/payment-status', updatePaymentStatus)
router.get('/:id', getOrderById)
router.delete('/:id', deleteOrder)

module.exports = router