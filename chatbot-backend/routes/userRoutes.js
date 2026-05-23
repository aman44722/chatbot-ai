const express = require("express");
const router = express.Router();
const { getUsers, getUser, updateUserRole } = require("../controllers/userController");
const authenticate = require("../middleware/authMiddleware");
const roleCheck = require("../middleware/roleCheck");

router.get("/", authenticate, roleCheck("admin"), getUsers);
router.get("/:id", authenticate, roleCheck("admin"), getUser);
router.put("/:id/role", authenticate, roleCheck("admin"), updateUserRole);

module.exports = router;
