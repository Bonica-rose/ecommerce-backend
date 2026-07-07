const Order = require('../models/order.model')

const allowedOrderStatus = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const allowedPaymentStatus = ['Pending', 'Paid', 'Failed', 'Refunded', 'Partially Refunded'];

const getAllOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await Order.aggregate([
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

const updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (!allowedOrderStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid order status'
            });
        }

        order.orderStatus = status;
        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const updatePaymentStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { paymentStatus } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (!allowedPaymentStatus.includes(paymentStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment status'
            });
        }

        order.paymentStatus = paymentStatus;
        await order.save();

        res.status(200).json({
            success: true,
            message: 'Payment status updated successfully',
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;     

        const order = await Order.findOne({ _id: orderId });
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

const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id;

        const removingOrder = await Order.findById(orderId);
        if (!removingOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        removingOrder.isDeleted = true;
        removingOrder.deletedAt = new Date();

        await removingOrder.save();

        res.status(200).json({
            success: true,
            message: 'Order deleted successfully',
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    getAllOrders,
    updateOrderStatus,
    updatePaymentStatus,
    getOrderById,
    deleteOrder
}