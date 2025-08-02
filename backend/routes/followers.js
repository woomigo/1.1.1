const express = require('express');
const router = express.Router();
const followerController = require('../controllers/followerController');
const authenticateToken = require("../../middleware/authMiddleware");

// Protect followers routes with authenticateToken middleware
router.get('/:id/followers', authenticateToken, followerController.getFollowers);
router.get('/:id/followings', authenticateToken, followerController.getFollowings);
router.get('/:id/followerIds', authenticateToken, followerController.getFollowerIds);
router.get('/:id/followingIds', authenticateToken, followerController.getFollowingIds);
router.post('/follow', authenticateToken, followerController.followUser);
router.delete('/unfollow', authenticateToken, followerController.unfollowUser);
router.get('/mutual', authenticateToken, followerController.getMutualFollows);
router.get('/:id/network', authenticateToken, followerController.getUserWithFollowersAndFollowingInfo);
router.get('/:id/follow-counts', authenticateToken,  followerController.getUserFollowCounts);

module.exports = router;
