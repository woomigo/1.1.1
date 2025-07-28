const db = require('../db'); // Replace with your actual DB connection logic

exports.createComment = async (req, res) => {
  const { user_id, target_type, target_id, parent_id, content } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO comments (user_id, target_type, target_id, parent_id, content)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, target_type, target_id, parent_id || null, content]
    );
    res.status(201).json({ id: result.insertId, message: 'Comment created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getComments = async (req, res) => {
  const { target_type, target_id } = req.query;
  try {
    const [comments] = await db.query(
      `SELECT * FROM comments WHERE target_type = ? AND target_id = ? AND parent_id IS NULL ORDER BY created_at DESC`,
      [target_type, target_id]
    );
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReplies = async (req, res) => {
  const { parent_id } = req.params;
  try {
    const [replies] = await db.query(
      `SELECT * FROM comments WHERE parent_id = ? ORDER BY created_at ASC`,
      [parent_id]
    );
    res.json(replies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  try {
    await db.query(`UPDATE comments SET content = ? WHERE id = ?`, [content, id]);
    res.json({ message: 'Comment updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(`DELETE FROM comments WHERE id = ?`, [id]);
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
