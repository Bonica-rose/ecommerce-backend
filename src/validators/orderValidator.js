const mongoose = require("mongoose");

const orderValidator = (req, res, next) => {
    const errors = [];
    const { items, shippingAddress } = req.body;    

    // Shipping Address
    if (!shippingAddress || typeof shippingAddress !== "string" || shippingAddress.trim() === "") {
        errors.push({
            field: "shippingAddress",
            message: "Shipping address is required."
        });
    }

    // Items
    if (!Array.isArray(items) || items.length === 0) {
        errors.push({
            field: "items",
            message: "At least one order item is required."
        });
    }

    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        // Product
        if (!item.product) {
            errors.push({
                field: "product",
                message: `Product is required for item ${i + 1}.`
            });
        }

        if (!mongoose.Types.ObjectId.isValid(item.product)) {
            errors.push({
                field: "product",
                message: `Invalid product id for item ${i + 1}.`
            });
        }

        // Quantity
        if (item.quantity === undefined || item.quantity === null || item.quantity === '') {
            errors.push({
                field: "quantity",
                message: `Quantity is required for item ${i + 1}.`
            });
        }

        if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
            errors.push({
                field: "quantity",
                message: `Quantity must be a positive integer for item ${i + 1}.`
            });
        }

        // Client should NOT send price
        if (item.price !== undefined) {
            errors.push({
                field: "price",
                message: "Price should not be provided by the client."
            });
        }
    }
    
    req.validationErrors = errors;
    next();
};

module.exports = orderValidator;