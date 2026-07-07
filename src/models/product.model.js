const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, index: true },
        description: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0, index: true  },
        category: { type: String, required: true, trim: true, index: true  },
        quantity: { type: Number, required: true, min: 1, default: 1 },
        inStock: { type: Boolean, default: true },
        embedding: { type: [Number], default: [] }
    },
    {
        timestamps: true
    }
)

productSchema.index(
    { name: 1, category: 1 },
    { unique: true }
);

module.exports = mongoose.model('Product', productSchema)