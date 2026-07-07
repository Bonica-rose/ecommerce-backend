const registerValidator = (req, res, next) => {

    const errors = [];

    const { username, email, password, confirmPassword } = req.body;

    if (!username || username.trim() === "") {
        errors.push({
            field: "username",
            message: "Username is required"
        });
    } else {
        const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;        
        if (!usernameRegex.test(username)) {
            errors.push({
                field: "username",
                message: "Username must be 3-30 characters and contain only letters, numbers and underscore."
            });
        }
    }

    if (!email || email.trim() === "") {
        errors.push({
            field: "email",
            message: "Email is required"
        });
    } else {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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