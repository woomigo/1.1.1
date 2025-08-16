const express = require("express");
const router = express.Router();
const tagsController = require("../controllers/tagController");
const authenticateToken = require("../../middleware/authMiddleware");

// User
router.post("/attach", authenticateToken, tagsController.attachTag);
router.get("/search", authenticateToken, tagsController.searchTags); // Search tags for autocomplete
router.get("/", authenticateToken, tagsController.getAllTags); // Public: for autocomplete
router.get("/woo/:wooId", authenticateToken, tagsController.getTagsForWoo); // For Woo detail page

// Admin
router.get("/pending", tagsController.getPendingTags);
router.post("/approve/:id", tagsController.approveTag);
router.post("/reject/:id", tagsController.rejectTag);
router.get("/all", tagsController.getAllTagsWithIDs); // Admin/debug

module.exports = router;
