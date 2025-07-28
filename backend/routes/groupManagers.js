const express = require('express');
const router = express.Router();
const groupManagerController = require('../controllers/groupManagerController');

router.post('/', groupManagerController.addManager);
router.get('/:groupId', groupManagerController.getGroupManagers);
router.put('/demote/:groupId/:userId', groupManagerController.demoteManager);

module.exports = router;
