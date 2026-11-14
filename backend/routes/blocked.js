const express = require('express');
const router = express.Router();
const authenticateToken = require("../../middleware/authMiddleware");
const blockController = require('../controllers/blockController');

router.post('/', authenticateToken, blockController.blockUser);
router.get('/', authenticateToken, blockController.getBlockedUsers);
router.delete('/:blockedId', authenticateToken, blockController.unblockUser);

module.exports = router;