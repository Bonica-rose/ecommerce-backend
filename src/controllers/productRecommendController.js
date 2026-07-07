const recommendationService = require("../services/recommendationService");

const getRecommendations = async (req, res, next) => {
    try {
        const { id } = req.params;
        const recommendations = await recommendationService.getRecommendations(id);

        return res.status(200).json({
            success: true,
            message: "Recommended products fetched successfully.",
            count: recommendations.length,
            data: recommendations
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getRecommendations
};