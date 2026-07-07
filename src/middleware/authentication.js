const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const BlacklistedToken = require("../models/blacklistedToken.model");

const authentication = async (req, res, next) => {
    try {

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access denied. Token not provided."
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing"
            });
        }        
        
        // Check blacklist
        const blacklisted = await BlacklistedToken.findOne({ token });

        if (blacklisted) {
            return res.status(401).json({
                success: false,
                message: "Token has been revoked"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select('-password -__v');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found."
            });
        }

        // Check password change time
        if (
            user.passwordChangedAt &&
            decoded.iat * 1000 < user.passwordChangedAt.getTime()
        ) {
            return res.status(401).json({
                success: false,
                message: "Password has changed. Please login again."
            });
        }

        req.user = user;
        // console.log("Authenticated user:", user); // Debugging line
        // console.log("Requesting user:", req.user); // Debugging line
        req.token = token;
        req.tokenExpiry = decoded.exp;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });

    }
};

module.exports = authentication;