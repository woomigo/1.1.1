const express = require('express');
const router = express.Router();
const followRequestController = require('../controllers/followRequestController');
const authenticateToken = require('../../middleware/authMiddleware')

router.post('/', authenticateToken, followRequestController.sendFollowRequest);
router.delete('/', authenticateToken, followRequestController.cancelFollowRequest);
router.put('/:id/accept', authenticateToken, followRequestController.acceptFollowRequest);
router.put('/:id/decline', authenticateToken, followRequestController.declineFollowRequest);
router.get('/incoming', authenticateToken, followRequestController.getIncomingFollowRequests);
router.get('/outgoing', authenticateToken, followRequestController.getOutgoingFollowRequests);
router.get('/check', authenticateToken, followRequestController.checkIfFollowRequestExists);

module.exports = router;