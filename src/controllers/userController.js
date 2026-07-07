const mongoose = require("mongoose");
const User = require('../models/user.model')
const bcrypt = require('bcryptjs')

const getAllUsers = async (req, res) => {
    try {
        const users = await User.aggregate([
            {
                $sort: { createdAt: -1 } // Latest users first
            },
            {
                $project: {
                    password: 0,
                    __v: 0
                }
            }
        ]);

        res.status(200).json({
            success: true,
            message: 'Users found',
            count: users.length,
            data: users,
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const createUser = async (req, res) => {
    try {
        const { username, email, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            })
        } 
        
        const randomPassword = '123456'; // A random password
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        const newUser = await User.create({ ...req.body, password: hashedPassword });

        res.status(201).json({
            success: true,
            message: 'User added successfully',
            data: newUser,
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user id."
            });
        }
        
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        res.status(200).json({
            success: true,
            message: 'User found',
            data: user,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user id."
            });
        }

        const { email, role, address } = req.body;

        const conflictRecord = await User.findOne({ email: email, _id: { $ne: id } });    
        if (conflictRecord) {
            return res.status(400).json({ success: false, message: "Email is already taken by another user." });
        }
        const user = await User.findByIdAndUpdate(id,{ email, role, address } ,{new:true});        

        res.status(200).json({
            success: true,
            message: 'User updated',
            data: user,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user id."
            });
        }

        const user = await User.findByIdAndDelete(id);        

        res.status(200).json({
            success: true,
            message: 'User deleted'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser
}