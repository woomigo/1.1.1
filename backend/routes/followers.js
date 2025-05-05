const express = require('express');
const router = express.Router();
const followerController = require('../controllers/followerController');
const authenticateToken = require("../../middleware/authMiddleware");

// Protect followers routes with authenticateToken middleware
router.get('/:id/followers', authenticateToken, followerController.getFollowers);
router.get('/:id/followees', authenticateToken, followerController.getFollowees);
router.post('/follow', authenticateToken, followerController.followUser);
router.delete('/unfollow', authenticateToken, followerController.unfollowUser);
router.get('/mutual', authenticateToken, followerController.getMutualFollows);

module.exports = router;
