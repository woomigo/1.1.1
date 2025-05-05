const db = require('../db');

// Get all private invites for logged-in user
exports.getMyPrivateWoos = async (req, res) => {
  const userId = req.user.id;

  try {
    const [woos] = await db.query(
      `SELECT w.*
       FROM woos w
       JOIN migos m ON w.id = m.woo_id
       WHERE m.user_id = ?`,
      [userId]
    );
    res.json(woos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
