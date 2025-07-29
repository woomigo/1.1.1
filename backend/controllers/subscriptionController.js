const db = require('../db');

// Subscribe to a public woo (only if following the owner)
exports.subscribe = async (req, res) => {
  const userId = req.user.id;
  const { woo_id } = req.body;

  try {
    // Get woo info including owner and type
    const [[woo]] = await db.query(`SELECT owner_uid, type FROM woos WHERE id = ?`, [woo_id]);

    if (!woo) return res.status(404).json({ error: 'Woo not found' });
    if (woo.type === "private")
      return res.status(400).json({ error: 'Cannot subscribe to private woos' });

    // Check if user follows the owner of the woo
    const [[follow]] = await db.query(
      `SELECT 1 FROM followers WHERE follower_id = ? AND followee_id = ?`,
      [userId, woo.owner_uid]
    );

    if (!follow)
      return res.status(403).json({ error: 'You must follow the owner to subscribe to this woo' });

    // Subscribe (ignore if already subscribed)
    await db.query(`INSERT IGNORE INTO subscriptions (woo_id, user_id) VALUES (?, ?)`, [woo_id, userId]);

    res.json({ message: 'Subscribed' });
  } catch (err) {
    console.error('Subscribe error:', err);
    res.status(500).json({ error: 'Internal server error' });
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
    console.error('Get subscriptions error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Unsubscribe from a woo
exports.unsubscribe = async (req, res) => {
  const userId = req.user.id;
  const { wooId } = req.params;

  try {
    await db.query(`DELETE FROM subscriptions WHERE woo_id = ? AND user_id = ?`, [wooId, userId]);
    res.json({ message: 'Unsubscribed from Woo' });
  } catch (err) {
    console.error('Unsubscribe error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

  