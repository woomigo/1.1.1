const express = require('express');
const router = express.Router();
const migoController = require('../controllers/migoController');
const authenticateToken = require("../../middleware/authMiddleware");

// Add migo (owner only)
router.post('/', authenticateToken, migoController.addMigo);

// Remove migo (owner or self)
router.delete('/:wooId/:userId', authenticateToken, migoController.removeMigo);

// Get all migos for a woo
router.get('/:wooId', authenticateToken, migoController.getMigosByWooId);

module.exports = router;
