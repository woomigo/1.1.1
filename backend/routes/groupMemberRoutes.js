const express = require('express');
const router = express.Router();
const groupMemberController = require('../controllers/groupMemberController');

router.post('/', groupMemberController.addGroupMember);
router.get('/:groupId', groupMemberController.getGroupMembers);
router.delete('/:groupId/:userId', groupMemberController.removeGroupMember);

module.exports = router;
