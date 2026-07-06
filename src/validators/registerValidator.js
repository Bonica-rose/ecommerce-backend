const registerValidator = (req, res, next) => {

    const errors = [];

    const { username, email, password, confirmPassword } = req.body;

    if (!username || username.trim() === "") {
        errors.push({
            field: "username",
            message: "Username is required"
        });
    } else if (username.trim().length < 3) {
        errors.push({
            field: "username",
            message: "Username must be at least 3 characters"
        });
    }

    if (!email || email.trim() === "") {
        errors.push({
            field: "email",
            message: "Email is required"
        });
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            errors.push({
                field: "email",
                message: "Invalid email format"
            });
        }
    }

    if (!password) {
        errors.push({
            field: "password",
            message: "Password is required"
        });
    }

    if (password && password.length < 6) {
        errors.push({
            field: "password",
            message: "Password must be at least 6 characters"
        });
    }

    if (password !== confirmPassword) {
        errors.push({
            field: "confirmPassword",
            message: "Passwords do not match"
        });
    }

    req.validationErrors = errors;
    next();
}

module.exports = registerValidator;