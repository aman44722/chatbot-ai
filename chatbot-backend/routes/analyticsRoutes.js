const express = require("express");
const router = express.Router();
const { getOverview } = require("../controllers/analyticsController");
const authenticate = require("../middleware/authMiddleware");

router.get("/overview", authenticate, getOverview);

module.exports = router;
