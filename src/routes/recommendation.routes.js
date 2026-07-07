const express = require("express");
const router = express.Router();

const { getRecommendations } = require("../controllers/productRecommendController");

/* /GET api/products/recommend/:id */
router.get("/:id", getRecommendations);

module.exports = router;