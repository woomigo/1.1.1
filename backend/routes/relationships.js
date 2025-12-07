const express = require('express');
const router = express.Router();

const relationshipController = require('../controllers/relationshipController');
const authenticateToken = require('../../middleware/authMiddleware');

router.get('/status', authenticateToken, relationshipController.getRelationshipStatus);

module.exports = router;
