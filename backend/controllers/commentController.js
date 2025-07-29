const db = require("../db"); // or your DB connection logic

exports.getComments = async (req, res) => {
  const { type, id } = req.query;
  const currentUserId = req.user?.id || null;

  try {
    const [comments] = await db.query(
      `SELECT 
         c.*,
         u.username,
         u.first_name,
         u.last_name,
         u.profile_pic_url,
         (
           SELECT COUNT(*) 
           FROM comments 
           WHERE parent_comment_id = c.id AND is_visible = TRUE
         ) AS reply_count
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.commentable_type = ? 
         AND c.commentable_id = ? 
         AND c.parent_comment_id IS NULL 
         AND c.is_visible = TRUE
       ORDER BY c.created_at ASC`,
      [type, id]
    );

    res.json(comments);
  } catch (err) {
    console.error("Error in getComments:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getReplies = async (req, res) => {
  const { parent_id } = req.params;

  try {
    const [replies] = await db.query(
      `SELECT 
         c.*,
         u.username,
         u.first_name,
         u.last_name,
         u.profile_pic_url
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.parent_comment_id = ? 
         AND c.is_visible = TRUE
       ORDER BY c.created_at ASC`,
      [parent_id]
    );

    res.json(replies);
  } catch (err) {
    console.error("Error in getReplies:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createComment = async (req, res) => {
  const { commentableType, commentableId } = req.params;
  const { user_id, content, parent_comment_id = null } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO comments (user_id, content, commentable_type, commentable_id, parent_comment_id) VALUES (?, ?, ?, ?, ?)`,
      [user_id, content, commentableType, commentableId, parent_comment_id]
    );

    const [newComment] = await db.query(`SELECT * FROM comments WHERE id = ?`, [
      result.insertId,
    ]);

    res.status(201).json(newComment[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    await db.query(`UPDATE comments SET content = ? WHERE id = ?`, [
      content,
      id,
    ]);

    const [updatedComment] = await db.query(
      `SELECT * FROM comments WHERE id = ?`,
      [id]
    );

    res.json(updatedComment[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // from auth middleware

  try {
    // Check if the comment exists and belongs to the user
    const [rows] = await db.query(`SELECT * FROM comments WHERE id = ?`, [id]);
    if (rows.length === 0)
      return res.status(404).json({ message: "Comment not found" });

    const comment = rows[0];
    if (comment.user_id !== userId)
      return res.status(403).json({ message: "Unauthorized" });

    // Soft-delete by setting is_visible to false
    await db.query(`UPDATE comments SET is_visible = FALSE WHERE id = ?`, [id]);

    res.json({ message: "Comment deleted (soft)" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting comment" });
  }
};
