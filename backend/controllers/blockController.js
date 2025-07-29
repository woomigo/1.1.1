// blockController.js
const db = require('../config/db');

const blockUser = async (req, res) => {
  const blockerId = req.user.id;
  const { blockedId } = req.body;

  try {
    // Insert block record
    await db.query(
      'INSERT IGNORE INTO user_blocks (blocker_id, blocked_id) VALUES (?, ?)',
      [blockerId, blockedId]
    );

    // Soft delete comments by blocked user on blocker’s content
    await db.query(`
      UPDATE comments c
      LEFT JOIN woo w ON (c.commentable_type = 'woo' AND c.commentable_id = w.id)
      LEFT JOIN woo_media wm ON (c.commentable_type = 'woo_media' AND c.commentable_id = wm.id)
      LEFT JOIN profile_media pm ON (c.commentable_type = 'profile_media' AND c.commentable_id = pm.id)
      LEFT JOIN comments pc ON c.parent_comment_id = pc.id
      SET c.is_visible = FALSE
      WHERE c.user_id = ?
      AND (
        (c.commentable_type = 'woo' AND w.user_id = ?)
        OR (c.commentable_type = 'woo_media' AND wm.user_id = ?)
        OR (c.commentable_type = 'profile_media' AND pm.user_id = ?)
        OR (pc.user_id = ?)
      )
    `, [blockedId, blockerId, blockerId, blockerId, blockerId]);

    res.status(200).json({ message: 'User blocked and relevant comments hidden' });
  } catch (err) {
    console.error('Block error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
