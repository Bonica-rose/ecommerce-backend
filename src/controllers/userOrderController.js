const Order = require('../models/order.model')
const Product = require('../models/product.model')

const getMyOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await Order.aggregate([
            {
                $match: { user: req.user._id, isDeleted: false }
            },
            {
                $sort: { createdAt: -1 } // Latest orders first
            }
        ]);


        res.status(200).json({
            success: true,
            message: 'Orders found',
            count: orders.length,
            data: orders,
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const placeOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const { items, shippingAddress } = req.body;

        let orderItems = [];
        let totalAmt = 0;

        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.product}`
                });
            }

            if (product.quantity < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `${product.name} is out of stock.`
                });
            }

            const subtotal = product.price * item.quantity;
            totalAmt += subtotal;

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            });
        }

        const newOrder = new Order({
            user: userId,
            items: orderItems,
            totalAmount: totalAmt,
            shippingAddress
        });

        const savedOrder = await newOrder.save();

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            data: savedOrder,
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        const userId = req.user._id;        

        const order = await Order.findOne({ _id: orderId, user: userId, isDeleted: false })
            .populate('items.product');
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order found',
            data: order,
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const userId = req.user._id;

        const order = await Order.findOne({ _id: orderId, user: userId, isDeleted: false });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (order.orderStatus !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Only pending orders can be cancelled'
            });
        }

        order.orderStatus = 'cancelled';
        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            data: order,
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    getMyOrders,
    placeOrder,
    getOrderById,
    cancelOrder
}