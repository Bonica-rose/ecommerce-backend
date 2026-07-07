const mongoose = require("mongoose");
const Product = require('../models/product.model')

const getAllProducts = async (req, res) => {
    try {

        const {
            search,
            category,
            minPrice,
            maxPrice,
            sortBy = "createdAt",
            order = "desc"
        } = req.query;

        const pipeline = [];

        // Filter
        const filter = {};

        if (search) {
            // filter.name = {
            //     $regex: search,
            //     $options: "i"
            // };
            filter.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    category: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        if (category) {
            filter.category = category;
        }

        if (minPrice || maxPrice) {
            filter.price = {};

            if (minPrice)
                filter.price.$gte = Number(minPrice);

            if (maxPrice)
                filter.price.$lte = Number(maxPrice);
        }

        if (Object.keys(filter).length > 0) {
            pipeline.push({
                $match: filter
            });
        }

        // Allowed sort fields
        const allowedSortFields = ["name", "price", "category"];
        const field = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

        pipeline.push({
            $sort: {
                [field]: order === "asc" ? 1 : -1
            }
        });

        const products = await Product.aggregate(pipeline);
        // const products = await Product.aggregate([
        //     {
        //         $sort: { createdAt: -1 }
        //     }
        // ]);

        res.status(200).json({
            success: true,
            message: 'Products found',
            count: products.length,
            data: products,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, quantity } = req.body;

        // Check if product already exists
        const existingProduct = await Product.findOne({
            name: name.trim(),
            category: category.trim()
        });
        if (existingProduct) {
            return res.status(400).json({
                success: false,
                message: 'Product already exists'
            })
        } 

        const newProduct = await Product.create({ ...req.body });

        res.status(201).json({
            success: true,
            message: 'Product added successfully',
            data: newProduct,
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product id."
            });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Product found',
            data: product,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product id."
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, description, price, category, quantity },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: updatedProduct,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product id."
            });
        }
        const product = await Product.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Product deleted'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    getAllProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
}