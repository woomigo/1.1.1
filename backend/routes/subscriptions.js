const express = require("express");
const router = express.Router();
const subscriptionController = require("../controllers/subscriptionController");
const authenticateToken = require("../../middleware/authMiddleware");


router.post('/', authenticateToken, subscriptionController.subscribe);
router.get('/', authenticateToken, subscriptionController.getMySubscriptions);
router.delete('/:wooId', authenticateToken, subscriptionController.unsubscribe);

module.exports = router;