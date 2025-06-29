const express = require("express");
const router = express.Router();
const wooController = require("../controllers/wooController");
const authenticateToken = require("../../middleware/authMiddleware");

router.post('/', authenticateToken, wooController.createWoo);
router.get('/privatefeed', authenticateToken, wooController.getPrivateFeed);
router.get('/publicfeed', authenticateToken, wooController.getPublicFeed);
router.get('/mine', authenticateToken, wooController.getMyWoos);
router.get('/:id', authenticateToken, wooController.getWooById);
router.delete('/:wooId/:userId', authenticateToken, wooController.removeInvitation);
// router.get('/:wooId/seen', authenticateToken, wooController.hasSeenWoo);
router.post('/:wooId/seen', authenticateToken, wooController.markWooAsSeen);



module.exports = router;