const jwt = require("jsonwebtoken");
const User = require('../models/user.model')
const bcrypt = require('bcryptjs')

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        // console.log("Requesting user ID:", req.user._id); // Debugging line
        // console.log("User ID from token:", userId); // Debugging line

        const user = await User.findById(userId).select('-password -__v'); // Exclude password and __v fields
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({
            success: true,
            message: "User profile retrieved successfully",
            data: user
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, username, email, mobile, address } = req.body;

        const user = await User.findById(userId).select('-password -__v'); // Exclude password and __v fields
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Update user profile
        user.name = name || user.name;
        user.username = username || user.username;
        user.email = email || user.email;
        user.mobile = mobile || user.mobile;
        user.address = address || user.address;

        await user.save();

        res.json({
            success: true,
            message: "Profile updated successfully",
            data:user
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateUserPassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if current password matches
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            })
        }

        // Check if new password is not the same as the current password
        const isNewPasswordSameAsCurrent = await bcrypt.compare(newPassword, user.password);
        if (isNewPasswordSameAsCurrent) {
            return res.status(400).json({
                success: false,
                message: 'New password cannot be the same as the current password'
            })
        }

        // Hash the password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        user.password = hashedNewPassword;
        user.passwordChangedAt = new Date();
        await user.save();

        // Blacklist the current token
        const decoded = jwt.decode(req.token);
        await BlacklistedToken.create({
            token: req.token,
            expiresAt: new Date(decoded.exp * 1000)
        });

        res.json({
            success: true,
            message: "Password changed successfully. Please login again."
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getUserProfile, updateUserProfile, updateUserPassword
};