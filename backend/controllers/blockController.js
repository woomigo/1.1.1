// blockController.js
const db = require("../db");

// exports.blockUser = async (req, res) => {
//   const blockerId = req.user.id;
//   const { blockedId } = req.body;

//   console.log('BLOCK USER CONTROLLER')
//   try {
//     // Insert block record
//     await db.query(
//       'INSERT IGNORE INTO user_blocks (blocker_id, blocked_id) VALUES (?, ?)',
//       [blockerId, blockedId]
//     );

//     // Soft delete comments by blocked user on blocker’s content
//     await db.query(`
//       UPDATE comments c
//       LEFT JOIN woo w ON (c.commentable_type = 'woo' AND c.commentable_id = w.id)
//       LEFT JOIN woo_media wm ON (c.commentable_type = 'woo_media' AND c.commentable_id = wm.id)
//       LEFT JOIN profile_media pm ON (c.commentable_type = 'profile_media' AND c.commentable_id = pm.id)
//       LEFT JOIN comments pc ON c.parent_comment_id = pc.id
//       SET c.is_visible = FALSE
//       WHERE c.user_id = ?
//       AND (
//         (c.commentable_type = 'woo' AND w.user_id = ?)
//         OR (c.commentable_type = 'woo_media' AND wm.user_id = ?)
//         OR (c.commentable_type = 'profile_media' AND pm.user_id = ?)
//         OR (pc.user_id = ?)
//       )
//     `, [blockedId, blockerId, blockerId, blockerId, blockerId]);

//     res.status(200).json({ message: 'User blocked and relevant comments hidden' });
//   } catch (err) {
//     console.error('Block error:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

exports.blockUser = async (req, res) => {
  try {
    const requesterId = req.user.id;       // numeric ID from auth
    const { blockedId } = req.body;        // UUID string

    if (!blockedId) {
      return res.status(400).json({ error: 'blockedId is required' });
    }

    // Step 1: Fetch UUID of the requester
    const [requesterRows] = await db.query(
      'SELECT uuid FROM users WHERE id = ?',
      [requesterId]
    );

    if (!requesterRows.length) {
      return res.status(404).json({ error: 'Requester not found' });
    }

    const blockerId = requesterRows[0].uuid;

    // Step 2: Make sure blocked user exists
    const [blockedRows] = await db.query(
      'SELECT uuid FROM users WHERE uuid = ?',
      [blockedId]
    );

    if (!blockedRows.length) {
      return res.status(404).json({ error: 'User to block not found' });
    }

    // Step 3: Prevent blocking self
    if (blockerId === blockedId) {
      return res.status(400).json({ error: 'Cannot block yourself' });
    }

    // Step 4: Check for existing block
    const [existing] = await db.query(
      'SELECT 1 FROM user_blocks WHERE blocker_id = ? AND blocked_id = ?',
      [blockerId, blockedId]
    );

    if (existing.length) {
      return res.status(400).json({ error: 'User is already blocked' });
    }

    // Step 5: Insert the block
    await db.query(
      'INSERT INTO user_blocks (blocker_id, blocked_id) VALUES (?, ?)',
      [blockerId, blockedId]
    );

    res.status(200).json({ message: 'User blocked successfully', blockedId });

  } catch (err) {
    console.error('Block user error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getBlockedUsers = async (req, res) => {
  try {
    const requesterId = req.user.id; // numeric ID from auth

    // Step 1: Fetch UUID of the requester
    const [requesterRows] = await db.query(
      'SELECT uuid FROM users WHERE id = ?',
      [requesterId]
    );

    if (!requesterRows.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    const blockerId = requesterRows[0].uuid;

    // Step 2: Fetch blocked users
    const [rows] = await db.query(
      `
      SELECT u.uuid AS blockedId, u.username, u.profile_pic_url, ub.created_at AS blocked_at
      FROM user_blocks ub
      JOIN users u ON u.uuid = ub.blocked_id
      WHERE ub.blocker_id = ?
      ORDER BY ub.created_at DESC
      `,
      [blockerId]
    );

    res.status(200).json({ blocked_users: rows });
  } catch (err) {
    console.error('Get blocked users error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.unblockUser = async (req, res) => {
  try {
    const requesterId = req.user.id; // numeric ID from auth
    const { blockedId } = req.params; // UUID string

    if (!blockedId) return res.status(400).json({ error: 'blockedId is required' });

    // Step 1: Fetch UUID of the requester
    const [requesterRows] = await db.query(
      'SELECT uuid FROM users WHERE id = ?',
      [requesterId]
    );

    if (!requesterRows.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    const blockerId = requesterRows[0].uuid;

    // Step 2: Delete block
    const [result] = await db.query(
      `DELETE FROM user_blocks WHERE blocker_id = ? AND blocked_id = ?`,
      [blockerId, blockedId]
    );

    res.status(200).json({
      message: result.affectedRows ? 'User unblocked' : 'User was not blocked',
      blockedId
    });
  } catch (err) {
    console.error('Unblock user error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};