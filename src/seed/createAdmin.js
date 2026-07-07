const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

mongoose.connect(process.env.MONGODB_URI);

async function createAdmin() {
    try {

        const adminExists = await User.findOne({
            email: "admin@example.com"
        });

        if (adminExists) {
            console.log("Admin already exists.");
            process.exit();
        }

        const hashedPassword = await bcrypt.hash("Admin@123", 10);

        await User.create({
            name: "Administrator",
            email: "admin@example.com",
            password: hashedPassword,
            role: "admin"
        });

        console.log("Admin created successfully.");

    } catch (err) {

        console.error(err);

    } finally {

        mongoose.connection.close();

    }
}

createAdmin();