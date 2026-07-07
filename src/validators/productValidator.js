const validateProduct = (req, res, next) => {
    const { name, description, price, category, quantity, inStock } = req.body;
    const errors = [];

    // Name
    if (!name || name.trim() === "") {
        errors.push({
            field: "name",
            message: "Product name is required."
        });
    } else if (name.trim().length < 2 || name.trim().length > 100) {
        errors.push({
            field: "name",
            message: "Product name must be between 2 and 100 characters."
        });
    }

    // Description
    if (!description || description.trim() === "") {
        errors.push({
            field: "description",
            message: "Description is required."
        });
    } else if (description.trim().length > 1000) {
        errors.push({
            field: "description",
            message: "Description cannot exceed 1000 characters."
        });
    }

    // Price
    if (price === undefined || price === null || price === "") {
        errors.push({
            field: "price",
            message: "Price is required."
        });
    } else if (isNaN(price) || Number(price) < 0) {
        errors.push({
            field: "price",
            message: "Price must be a positive number."
        });
    }

    // Category
    if (!category || category.trim() === "") {
        errors.push({
            field: "category",
            message: "Category is required."
        });
    }

    // Quantity
    if (quantity === undefined || quantity === null || quantity === "") {
        errors.push({
            field: "quantity",
            message: "Quantity is required."
        });
    } else if (!Number.isInteger(Number(quantity)) || Number(quantity) < 1) {
        errors.push({
            field: "quantity",
            message: "Quantity must be a positive integer."
        });
    }

    // inStock (Optional)
    if (
        inStock !== undefined &&
        typeof inStock !== "boolean"
    ) {
        errors.push({
            field: "inStock",
            message: "inStock must be true or false."
        });
    }

    req.validationErrors = errors;
    next();
};

module.exports = validateProduct;