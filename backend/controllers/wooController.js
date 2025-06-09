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

    res.json(woos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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
         GROUP BY w.id
         ORDER BY w.created_at DESC`,
      [user_id, user_id]
    );

    res.json(woos);
  } catch (err) {
    console.error("Error in getInvitedWoos:", err);
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
  const [woos] = await db.query(`SELECT * FROM woos WHERE owner_uid = ?`, [
    userId,
  ]);
  res.json(woos);
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

// GET /woos/:wooId/seen
exports.hasSeenWoo = async (req, res) => {
  const userId = req.user.id;
  const wooId = req.params.wooId;

  try {
    const [[status]] = await db.query(
      "SELECT seen FROM migos WHERE woo_id = ? AND user_id = ?",
      [wooId, userId]
    );

    if (!status)
      return res.status(404).json({ error: "No invitation found for this woo" });

    res.json({ seen: !!status.seen });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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
