const express = require("express");
const router = express.Router();
const { getPlans, getPlanBySlug, seedPlans } = require("../controllers/planController");
const authenticate = require("../middleware/authMiddleware");

router.get("/", authenticate, getPlans);
router.get("/seed", authenticate, seedPlans);
router.get("/:slug", authenticate, getPlanBySlug);

module.exports = router;
