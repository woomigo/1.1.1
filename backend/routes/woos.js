const express = require("express");
const router = express.Router();
const wooController = require("../controllers/wooController");
const authenticateToken = require("../../middleware/authMiddleware");

router.post('/', authenticateToken, wooController.createWoo);
router.get('/mine', authenticateToken, wooController.getMyWoos);
router.get('/:id', authenticateToken, wooController.getWooById);
router.delete('/:wooId/:userId', authenticateToken, wooController.removeInvitation);


module.exports = router;