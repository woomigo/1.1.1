const db = require("../db");

// Like a post
exports.likeWoo = async (req, res) => {
  const userId = req.user.id;
  const { post_id } = req.body;

  try {
    await db.query(
      `INSERT IGNORE INTO woo_likes (woo_id, user_id) VALUES (?, ?)`,
      [woo_id, userId]
    );
    res.json({ message: "woo liked" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Unlike a post
exports.unlikeWoo = async (req, res) => {
  const userId = req.user.id;
  const { woo_id } = req.body;

  try {
    await db.query(`DELETE FROM woo_likes WHERE woo_id = ? AND user_id = ?`, [
      woo_id,
      userId,
    ]);
    res.json({ message: "woo unliked" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get list of likers (owner only)
exports.getLikersForWooOwnerOnly = async (req, res) => {
  const userId = req.user.id;
  const { wooId } = req.params;

  try {
    // Verify ownership
    const [[woo]] = await db.query(`SELECT user_id FROM woos WHERE id = ?`, [
      wooId,
    ]);
    if (!woo) return res.status(404).json({ error: "woo not found" });
    if (woo.user_id !== userId)
      return res.status(403).json({ error: "Not authorized" });

    // Get users who liked the post
    const [likers] = await db.query(
      `SELECT u.id, u.first_name, u.last_name, u.username, u.profile_pic_url
         FROM woo_likes wl
         JOIN users u ON wl.user_id = u.id
         WHERE wl.woo_id = ?`,
      [wooId]
    );

    res.json(likers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get list of likers (public)
exports.getLikersForWooPublic = async (req, res) => {
  const { wooId } = req.params;

  try {
    const [likers] = await db.query(
      `SELECT u.id, u.first_name, u.last_name, u.username, u.profile_pic_url
         FROM woo_likes wl
         JOIN users u ON wl.user_id = u.id
         WHERE wl.woo_id = ?`,
      [wooId]
    );

    res.json(likers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};