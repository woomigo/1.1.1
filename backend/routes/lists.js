const express = require('express');
const router = express.Router();
const wooListController = require('../controllers/listController');
const authenticateToken = require("../../middleware/authMiddleware");

router.post('/', authenticateToken, wooListController.createWooList);
router.post('/items', authenticateToken, wooListController.addItemToWoo);
router.put('/items/:itemId/claim', authenticateToken, wooListController.claimItem);
router.put('/items/:itemId/unclaim', authenticateToken, wooListController.unclaimItem);
router.get('/:wooId', authenticateToken, wooListController.getWooList);

module.exports = router;
