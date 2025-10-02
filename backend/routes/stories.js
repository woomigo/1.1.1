const express = require("express");
const router = express.Router();
const storyController = require("../controllers/storyController");
const authenticateToken = require("../../middleware/authMiddleware");

// Upload a media item to the profile gallery
router.post("/profile-gallery", authenticateToken, storyController.uploadToProfileGallery);

// Upload a user story
router.post("/user-stories", authenticateToken, storyController.uploadUserStory);

// Get stories only from users the logged-in user follows
router.get("/user-story-feed", authenticateToken, storyController.getUserStoryFeed);

// Get event story feed only (no user stories)
router.get("/woo-story-feed", authenticateToken, storyController.getStoryFeed);

// Get stories by a specific woo (event)
router.get("/woos/:wooId/stories", authenticateToken, storyController.getStoriesByWoo);

// Get the combined story feed for the logged-in user
router.get("/feed", authenticateToken, storyController.getCombinedStoryFeed);

// Get the woo gallery feed (for image/video gallery by woo)
router.get("/woos/gallery-feed", authenticateToken, storyController.getWooGalleryFeed);

// Mark story as seen when user views it
router.post("/:storyId/seen", authenticateToken, storyController.markStorySeen);

module.exports = router;
