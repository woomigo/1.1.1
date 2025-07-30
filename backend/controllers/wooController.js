const db = require("../db");

exports.createWoo = async (req, res) => {
  const { title, content, is_private, migos = [] } = req.body;
  const owner_uid = req.user.id;

  try {
    const [result] = await db.query(
      `INSERT INTO woos (owner_uid, media_url, start_date, end_date, start_time, end_time, location, type) VALUES (?, ?, ?, ?)`,
      [owner_uid, title, content, is_private]
    );

    const wooID = result.insertId;

    // If private, add migos
    if (type === "private" && migos.length) {
      const values = migos.map((uid) => [wooID, uid]);
      await db.query(`INSERT INTO migos (woo_id, user_id) VALUES ?`, [values]);
    }

    res.status(201).json({ message: "Woo created", woo_id: wooID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Helper to fetch profile pics of subscribers for a set of woo IDs
async function getSubscriberPics(wooIds) {
  if (wooIds.length === 0) return {};

  const [rows] = await db.query(
    `SELECT s.woo_id, u.profile_pic_url
     FROM subscriptions s
     JOIN users u ON s.user_id = u.id
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

// Helper to fetch profile pics of migos for a set of woo IDs
async function getMigoPics(wooIds) {
  if (wooIds.length === 0) return {};

  const [rows] = await db.query(
    `SELECT m.woo_id, u.profile_pic_url
     FROM migos m
     JOIN users u ON m.user_id = u.id
     WHERE m.woo_id IN (?)`,
    [wooIds]
  );

  // Group profile pics by woo_id
  return rows.reduce((acc, { woo_id, profile_pic_url }) => {
    if (!acc[woo_id]) acc[woo_id] = [];
    acc[woo_id].push(profile_pic_url);
    return acc;
  }, {});
}


// For HOME FEED - Public Woos + subscriber pics
exports.getPublicFeed = async (req, res) => {
  const user_id = req.user.id;

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
         u.id AS user_id,
         u.first_name,
         u.last_name,
         u.username,
         u.profile_pic_url,
         COUNT(wl_all.user_id) AS like_count,
         MAX(wl_me.user_id IS NOT NULL) AS liked_by_me
       FROM woos w
       JOIN followers f ON w.owner_uid = f.followee_id
       JOIN users u ON w.owner_uid = u.id
       LEFT JOIN woo_likes wl_all ON wl_all.woo_id = w.id
       LEFT JOIN woo_likes wl_me ON wl_me.woo_id = w.id AND wl_me.user_id = ?
       WHERE f.follower_id = ? AND w.type = "public"
       GROUP BY w.id
       ORDER BY w.created_at DESC`,
      [user_id, user_id]
    );

    const wooIds = woos.map(w => w.woo_id);
    const subscriberPics = await getSubscriberPics(wooIds);

    // Add sub_profile_pics array to each woo
    woos.forEach(w => {
      w.sub_profile_pics = subscriberPics[w.woo_id] || [];
    });

    res.json(woos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// For HOME FEED - Private Woos + migo pics
exports.getPrivateFeed = async (req, res) => {
  const user_id = req.user.id;

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
         u.id AS user_id,
         u.first_name,
         u.last_name,
         u.username,
         u.profile_pic_url,
         m.seen AS seen,                                 
         COUNT(wl_all.user_id) AS like_count,
         MAX(wl_me.user_id IS NOT NULL) AS liked_by_me
       FROM migos m
       JOIN woos w ON w.id = m.woo_id                
       JOIN users u ON w.owner_uid = u.id
       LEFT JOIN woo_likes wl_all ON wl_all.woo_id = w.id
       LEFT JOIN woo_likes wl_me ON wl_me.woo_id = w.id AND wl_me.user_id = ?
       WHERE m.user_id = ? AND w.type = "private"
       GROUP BY w.id`,
      [user_id, user_id]
    );

    // Sort: unseen (seen = 0 or false) first, then by created_at DESC
    woos.sort((a, b) => {
      if (!a.seen && b.seen) return -1;
      if (a.seen && !b.seen) return 1;
      return new Date(b.created_at) - new Date(a.created_at);
    });

    const wooIds = woos.map(w => w.woo_id);
    const migoPics = await getMigoPics(wooIds);

    // Add migo_profile_pics array to each woo
    woos.forEach(w => {
      w.migo_profile_pics = migoPics[w.woo_id] || [];
    });

    res.json(woos);
  } catch (err) {
    console.error("Error in getPrivateFeed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// For PROFILE FEED - Woos by User ID, add subscriber or migo pics accordingly
exports.getWoosByUserId = async (req, res) => {
  const userId = parseInt(req.params.userId); // whose woos are being viewed
  const viewerId = req.user.id; // who is viewing

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

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
         u.id AS user_id,
         u.first_name,
         u.last_name,
         u.username,
         u.profile_pic_url,
         COUNT(wl_all.user_id) AS like_count,
         MAX(wl_me.user_id IS NOT NULL) AS liked_by_me
       FROM woos w
       JOIN users u ON w.owner_uid = u.id
       LEFT JOIN woo_likes wl_all ON wl_all.woo_id = w.id
       LEFT JOIN woo_likes wl_me ON wl_me.woo_id = w.id AND wl_me.user_id = ?
       WHERE w.owner_uid = ?
         AND (
           w.type = 'public'
           OR ? = ?
           OR EXISTS (
             SELECT 1 FROM migos m
             WHERE m.woo_id = w.id AND m.user_id = ?
           )
         )
       GROUP BY w.id
       ORDER BY w.created_at DESC`,
      [viewerId, userId, viewerId, userId, viewerId]
    );

    const wooIds = woos.map(w => w.woo_id);

    // For public woos, get subscriber pics; for private, get migo pics
    const publicWoos = woos.filter(w => w.type === "public");
    const privateWoos = woos.filter(w => w.type === "private");

    const subscriberPics = await getSubscriberPics(publicWoos.map(w => w.woo_id));
    const migoPics = await getMigoPics(privateWoos.map(w => w.woo_id));

    woos.forEach(w => {
      if (w.type === "public") {
        w.sub_profile_pics = subscriberPics[w.woo_id] || [];
      } else {
        w.migo_profile_pics = migoPics[w.woo_id] || [];
      }
    });

    res.json(woos);
  } catch (err) {
    console.error("Error fetching user's woos:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};



exports.getWooById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const [[woo]] = await db.query(`SELECT * FROM woos WHERE id = ?`, [id]);

    if (!woo) return res.status(404).json({ error: "Woo not found" });

    if (woo.type === "private") {
      const [[invited]] = await db.query(
        `SELECT 1 FROM migos WHERE woo_id = ? AND user_id = ?`,
        [id, userId]
      );
      if (!invited && woo.owner_uid !== userId)
        return res.status(403).json({ error: "Unauthorized" });
    }

    res.json(woo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyWoos = async (req, res) => {
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
         u.id AS user_id,
         u.first_name,
         u.last_name,
         u.username,
         u.profile_pic_url,
         COUNT(wl_all.user_id) AS like_count,
         MAX(wl_me.user_id IS NOT NULL) AS liked_by_me
       FROM woos w
       JOIN users u ON w.owner_uid = u.id
       LEFT JOIN woo_likes wl_all ON wl_all.woo_id = w.id
       LEFT JOIN woo_likes wl_me ON wl_me.woo_id = w.id AND wl_me.user_id = ?
       WHERE w.owner_uid = ?
       GROUP BY w.id
       ORDER BY w.created_at DESC`,
      [userId, userId]
    );

    const wooIds = woos.map(w => w.woo_id);
    const publicWooIds = woos.filter(w => w.type === 'public').map(w => w.woo_id);
    const privateWooIds = woos.filter(w => w.type === 'private').map(w => w.woo_id);

    const [subscriberPics, migoPics] = await Promise.all([
      getSubscriberPics(publicWooIds),
      getMigoPics(privateWooIds),
    ]);

    woos.forEach(w => {
      if (w.type === 'public') {
        w.sub_profile_pics = subscriberPics[w.woo_id] || [];
      } else if (w.type === 'private') {
        w.migo_profile_pics = migoPics[w.woo_id] || [];
      }
    });

    res.json(woos);
  } catch (err) {
    console.error("Error fetching my woos:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.removeInvitation = async (req, res) => {
  const requesterId = req.user.id;
  const { wooID, userId } = req.params;

  try {
    // Check if requester is either the event owner OR the invitee
    const [[woo]] = await db.query(`SELECT user_id FROM woos WHERE id = ?`, [
      wooID,
    ]);
    if (!woo) return res.status(404).json({ error: "Woo not found" });

    const isOwner = woo.user_id === requesterId;
    const isInvitee = parseInt(userId) === requesterId;

    if (!isOwner && !isInvitee) {
      return res
        .status(403)
        .json({ error: "Not authorized to remove this invitation" });
    }

    await db.query(`DELETE FROM migos WHERE woo_id = ? AND user_id = ?`, [
      wooID,
      userId,
    ]);
    res.json({ message: "Invitation removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// // GET /woos/:wooId/seen
// exports.hasSeenWoo = async (req, res) => {
//   const userId = req.user.id;
//   const wooId = req.params.wooId;

//   try {
//     const [[status]] = await db.query(
//       "SELECT seen FROM migos WHERE woo_id = ? AND user_id = ?",
//       [wooId, userId]
//     );

//     if (!status)
//       return res.status(404).json({ error: "No invitation found for this woo" });

//     res.json({ seen: !!status.seen });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// POST /woos/:wooId/seen
exports.markWooAsSeen = async (req, res) => {
  const userId = req.user.id;
  const wooId = req.params.wooId;

  try {
    const [result] = await db.query(
      "UPDATE migos SET seen = TRUE WHERE woo_id = ? AND user_id = ?",
      [wooId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "No invitation found for this woo" });
    }

    res.json({ message: "Woo marked as seen" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
