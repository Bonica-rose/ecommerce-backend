const Product = require("../models/product.model");

const cosineSimilarity = (a, b) => {

    let dot = 0;
    let magA = 0;
    let magB = 0;

    for (let i = 0; i < a.length; i++) {

        dot += a[i] * b[i];
        magA += a[i] * a[i];
        magB += b[i] * b[i];

    }

    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
};

const getRecommendations = async (productId) => {

    const current = await Product.findById(productId);

    const products = await Product.find({
        _id: { $ne: productId }
    });

    const recommendations = products.map(product => ({
        product,
        score: cosineSimilarity(current.embedding, product.embedding)
    }));

    recommendations.sort((a, b) => b.score - a.score);

    return recommendations.slice(0, 5);

};

module.exports = {
    getRecommendations
};