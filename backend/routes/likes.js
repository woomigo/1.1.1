const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const authenticateToken = require("../../middleware/authMiddleware");

router.post('/like', authenticateToken, likeController.likeWoo);
router.post('/unlike', authenticateToken, likeController.unlikeWoo);
router.get('/:wooId/likes/owner', authenticateToken, likeController.getLikersForWooOwnerOnly);
router.get('/:wooId/likes', authenticateToken, likeController.getLikersForWooPublic);

module.exports = router;