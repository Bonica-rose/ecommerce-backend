const User = require('../models/user.model')
const BlacklistedToken = require('../models/blacklistedToken.model');
const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs')

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY }
    )
}

const registerUser = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            })
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: newUser
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not exists'
            })
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Wrong password'
            })
        }

        // Generate JWT token
        const token = generateToken(user);

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            token,
            data: user            
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const logoutUser = async (req, res) => {
    try {
        await BlacklistedToken.create({
            token: req.token,
            expiresAt: new Date(req.tokenExpiry * 1000)
        });

        res.status(200).json({
            success: true,
            message: 'User logged out successfully'
        });
        
    }catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { registerUser, loginUser, logoutUser }