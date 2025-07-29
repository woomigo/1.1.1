const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const blockController = require('../controllers/blockController');

router.post('/', authenticateToken, blockController.blockUser);

module.exports = router;
