const express = require("express");
const router = express.Router();
const subscriptionController = require("../controllers/subscriptionController");
const authenticateToken = require("../../middleware/authMiddleware");


router.post('/', authenticateToken, subscriptionController.subscribe);
router.get('/', authenticateToken, subscriptionController.getMySubscriptions);
router.get('/:wooId', authenticateToken, subscriptionController.getSubscriptionsByWooId)
router.get('/user/:userId', authenticateToken, subscriptionController.getSubscriptionsByUserId);
router.delete('/:wooId', authenticateToken, subscriptionController.unsubscribe);

module.exports = router;