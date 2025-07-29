const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.post('/', authenticateToken, commentController.createComment);
router.get('/', authenticateToken, commentController.getComments);        // top-level with reply count
router.get('/replies/:parent_id', authenticateToken, commentController.getReplies); // fetch replies for a comment
router.put('/:id', authenticateToken, commentController.updateComment);
router.delete('/:id', authenticateToken, commentController.deleteComment);


module.exports = router;
