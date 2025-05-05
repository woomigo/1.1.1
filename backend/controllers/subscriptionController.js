const db = require('../db');

// Subscribe to a public woo
exports.subscribe = async (req, res) => {
  const userId = req.user.id;
  const { woo_id } = req.body;

  try {
    const [[woo]] = await db.query(`SELECT type FROM woos WHERE id = ?`, [woo_id]);

    if (!woo || woo.type === "private")
      return res.status(400).json({ error: 'Cannot subscribe to private woos' });

    await db.query(`INSERT IGNORE INTO subscriptions (woo_id, user_id) VALUES (?, ?)`, [woo_id, userId]);
    res.json({ message: 'Subscribed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all woos user subscribed to
exports.getMySubscriptions = async (req, res) => {
  const userId = req.user.id;

  try {
    const [woos] = await db.query(
      `SELECT w.*
       FROM woos w
       JOIN subscriptions s ON w.id = s.woo_id
       WHERE s.user_id = ?`,
      [userId]
    );
    res.json(woos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.unsubscribe = async (req, res) => {
    const userId = req.user.id;
    const { wooId } = req.params;
  
    try {
      await db.query(`DELETE FROM subscriptions WHERE woo_id = ? AND user_id = ?`, [wooId, userId]);
      res.json({ message: 'Unsubscribed from Woo' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  