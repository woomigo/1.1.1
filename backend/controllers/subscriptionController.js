const db = require('../db');

// Helper to fetch profile pics of subscribers for a set of woo IDs
async function getSubscriberPics(wooIds) {
  if (wooIds.length === 0) return {};

  const [rows] = await db.query(
    `SELECT s.woo_id, u.profile_pic_url
     FROM subscriptions s
     JOIN users u ON s.user_id = u.uuid
     WHERE s.woo_id IN (?)`,
    [wooIds]
  );

  // Group profile pics by woo_id
  return rows.reduce((acc, { woo_id, profile_pic_url }) => {
    if (!acc[woo_id]) acc[woo_id] = [];
    acc[woo_id].push(profile_pic_url);
    return acc;
  }, {});
}

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
      `SELECT 
         w.id AS woo_id,
         w.media_url,
         w.start_date,
         w.end_date,
         w.start_time,
         w.end_time,
         w.location,
         w.type,
         w.created_at,
         w.updated_at,
         u.uuid AS user_id,
         u.first_name,
         u.last_name,
         u.username,
         u.profile_pic_url,
         COUNT(wl_all.user_id) AS like_count,
         MAX(wl_me.user_id IS NOT NULL) AS liked_by_me
       FROM woos w
       JOIN subscriptions s ON w.id = s.woo_id
       JOIN users u ON w.owner_uid = u.uuid
       LEFT JOIN woo_likes wl_all ON wl_all.woo_id = w.id
       LEFT JOIN woo_likes wl_me ON wl_me.woo_id = w.id AND wl_me.user_id = ?
       WHERE s.user_id = ?
       GROUP BY w.id
       ORDER BY w.created_at DESC`,
      [userId, userId]
    );

    // Get woo IDs to fetch subscriber profile pics
    const wooIds = woos.map(w => w.woo_id);

    // Get subscriber pics grouped by woo_id
    const subscriberPics = await getSubscriberPics(wooIds);

    // Attach subscriber profile pics to each woo
    woos.forEach(w => {
      w.sub_profile_pics = subscriberPics[w.woo_id] || [];
    });

    res.json(woos);
  } catch (err) {
    console.error('Get subscriptions error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};



exports.getSubscriptionsByUserId = async (req, res) => {
  const userId = req.params.userId;

  try {
    const [woos] = await db.query(
      `SELECT 
         w.id AS woo_id,
         w.media_url,
         w.start_date,
         w.end_date,
         w.start_time,
         w.end_time,
         w.location,
         w.type,
         w.created_at,
         w.updated_at,
         u.uuid AS user_id,
         u.first_name,
         u.last_name,
         u.username,
         u.profile_pic_url,
         COUNT(wl_all.user_id) AS like_count,
         MAX(wl_me.user_id IS NOT NULL) AS liked_by_me
       FROM woos w
       JOIN subscriptions s ON w.id = s.woo_id
       JOIN users u ON w.owner_uid = u.uuid
       LEFT JOIN woo_likes wl_all ON wl_all.woo_id = w.id
       LEFT JOIN woo_likes wl_me ON wl_me.woo_id = w.id AND wl_me.user_id = ?
       WHERE s.user_id = ?
       GROUP BY w.id
       ORDER BY w.created_at DESC`,
      [userId, userId]
    );

    res.json(woos);
  } catch (err) {
    console.error('Get subscriptions by user ID error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all subs for a woo
exports.getSubscriptionsByWooId = async (req, res) => {
  const wooId = req.params.wooId;

  try {
    const [users] = await db.query(
      `SELECT 
         u.uuid AS user_id,
         u.first_name,
         u.last_name,
         u.username,
         u.profile_pic_url,
         s.subscribed_at AS subscription_date
       FROM subscriptions s
       JOIN users u ON s.user_id = u.uuid
       WHERE s.woo_id = ?
       ORDER BY s.subscribed_at DESC`,
      [wooId]
    );

    res.json(users);
  } catch (err) {
    console.error('Get subscriptions by woo ID error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};



// exports.getSubscriptionsByWooId = async (req, res) => {
//   const wooId = parseInt(req.params.wooId);
//   const requesterId = req.user.id;

//   if (!wooId) {
//     return res.status(400).json({ error: "Woo ID is required." });
//   }

//   try {
//     const [[woo]] = await db.query(`SELECT * FROM woos WHERE id = ?`, [wooId]);
//     if (!woo) return res.status(404).json({ error: "Woo not found." });

//     if (woo.owner_uid !== requesterId) {
//       const [[isSub]] = await db.query(
//         `SELECT 1 FROM subscriptions WHERE woo_id = ? AND user_id = ?`,
//         [wooId, requesterId]
//       );
//       if (!isSub) {
//         return res.status(403).json({ error: "Not authorized to view migos." });
//       }
//     }

//     const [subs] = await db.query(
//       `SELECT 
//          m.user_id, 
//          u.first_name, 
//          u.last_name, 
//          u.username, 
//          u.profile_pic_url, 
//          m.created_at,
//          m.seen
//        FROM subscriptions m
//        JOIN users u ON m.user_id = u.uuid
//        WHERE m.woo_id = ?`,
//       [wooId]
//     );

//     res.json(subs);
//   } catch (err) {
//     console.error("Error fetching subs for woo:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

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

  