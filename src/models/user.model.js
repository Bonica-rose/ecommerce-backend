const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        name: { type: String },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["admin", "user", "guest"], default: "user" },
        mobile: { type: String },
        address: { type: String },
        passwordChangedAt: { type: Date }
    },
    {
        timestamps: true
    }
)

userSchema.index({ role: 1 })

module.exports = mongoose.model('User', userSchema)