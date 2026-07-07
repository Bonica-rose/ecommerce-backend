const express = require('express')
const router = express.Router()

const {
    validateProductCreate, validateProductUpdate
} = require('../validators/productValidator')

const { 
    getAllProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/productController')

const validationMiddleware = require('../middleware/validation')
const authenticate = require('../middleware/authentication')
const authorize = require('../middleware/authorize')

router.get('/', authenticate, getAllProducts);
router.post('/', authenticate, authorize('admin'), validateProductCreate, validationMiddleware, createProduct);
router.get('/:id', authenticate, getProductById);
router.put('/:id', authenticate, authorize('admin'), validateProductUpdate, validationMiddleware, updateProduct);
router.delete('/:id', authenticate, authorize('admin'), deleteProduct);

module.exports = router

/* 
** GET /api/products?search=laptop
** GET /api/products?search=electronics
** GET /api/products?category=Mobiles
** GET /api/products?minPrice=10000&maxPrice=30000
** GET /api/products?sortBy=price&order=asc
*/