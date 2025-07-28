const express = require('express');
const router = express.Router();
const followRequestController = require('../controllers/followRequestController');

router.post('/', followRequestController.sendFollowRequest);
router.put('/:id/accept', followRequestController.acceptFollowRequest);
router.put('/:id/decline', followRequestController.declineFollowRequest);

module.exports = router;
