const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.post('/', commentController.createComment); // Create
router.get('/', commentController.getComments); // Get top-level comments
router.get('/replies/:parent_id', commentController.getReplies); // Get replies
router.put('/:id', commentController.updateComment); // Update
router.delete('/:id', commentController.deleteComment); // Delete

module.exports = router;
