const express = require("express");
const router = express.Router();
const storyController = require("../controllers/storyController");
const authenticateToken = require("../../middleware/authMiddleware");

// Get stories by a specific woo (event)
router.get("/woos/:wooId/stories", authenticateToken, storyController.getStoriesByWoo);

// Get the story feed for the logged-in user
router.get("/feed", authenticateToken, storyController.getCombinedStoryFeed);

// Mark story as seen when user views
router.post("/:storyId/seen", authenticateToken, storyController.markStorySeen);


module.exports = router;
