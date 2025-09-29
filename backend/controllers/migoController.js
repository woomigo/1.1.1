const db = require('../db');

// Add a migo to a woo
exports.addMigo = async (req, res) => {
  const { wooId, userIdToAdd } = req.body;
  const ownerId = req.user.id;

  if (!wooId || !userIdToAdd) {
    return res.status(400).json({ error: "wooId and userIdToAdd are required." });
  }

  try {
    // Confirm woo ownership
    const [[woo]] = await db.query(`SELECT * FROM woos WHERE id = ?`, [wooId]);
    if (!woo) return res.status(404).json({ error: "Woo not found." });
    if (woo.owner_uid !== ownerId) {
      return res.status(403).json({ error: "Only the owner can add migos." });
    }

    // Prevent duplicates
    const [[existing]] = await db.query(
      `SELECT 1 FROM migos WHERE woo_id = ? AND user_id = ?`,
      [wooId, userIdToAdd]
    );
    if (existing) {
      return res.status(409).json({ error: "User is already a migo." });
    }

    await db.query(
      `INSERT INTO migos (woo_id, user_id, created_at, seen) VALUES (?, ?, NOW(), 0)`,
      [wooId, userIdToAdd]
    );

    res.status(201).json({ message: "Migo added successfully." });
  } catch (err) {
    console.error("Error adding migo:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Remove a migo from a woo (owner or self)
exports.removeMigo = async (req, res) => {
  const wooId = parseInt(req.params.wooId);
  const userIdToRemove = parseInt(req.params.userId);
  const requesterId = req.user.id;

  if (!wooId || !userIdToRemove) {
    return res.status(400).json({ error: "wooId and userId are required." });
  }

  try {
    // Confirm woo exists
    const [[woo]] = await db.query(`SELECT * FROM woos WHERE id = ?`, [wooId]);
    if (!woo) return res.status(404).json({ error: "Woo not found." });

    // Owner can remove anyone, users can remove themselves only
    if (requesterId !== woo.owner_uid && requesterId !== userIdToRemove) {
      return res.status(403).json({ error: "Not authorized to remove this migo." });
    }

    const [result] = await db.query(
      `DELETE FROM migos WHERE woo_id = ? AND user_id = ?`,
      [wooId, userIdToRemove]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Migo not found." });
    }

    res.json({ message: "Migo removed successfully." });
  } catch (err) {
    console.error("Error removing migo:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all migos for a woo
exports.getMigosByWooId = async (req, res) => {
  const wooId = parseInt(req.params.wooId);
  const requesterId = req.user.id;

  if (!wooId) {
    return res.status(400).json({ error: "Woo ID is required." });
  }

  try {
    const [[woo]] = await db.query(`SELECT * FROM woos WHERE id = ?`, [wooId]);
    if (!woo) return res.status(404).json({ error: "Woo not found." });

    if (woo.owner_uid !== requesterId) {
      const [[isMigo]] = await db.query(
        `SELECT 1 FROM migos WHERE woo_id = ? AND user_id = ?`,
        [wooId, requesterId]
      );
      if (!isMigo) {
        return res.status(403).json({ error: "Not authorized to view migos." });
      }
    }

    const [migos] = await db.query(
      `SELECT 
         m.user_id, 
         u.first_name, 
         u.last_name, 
         u.username, 
         u.profile_pic_url, 
         m.invited_at,
         m.seen
       FROM migos m
       JOIN users u ON m.user_id = u.uuid
       WHERE m.woo_id = ?`,
      [wooId]
    );

    res.json(migos);
  } catch (err) {
    console.error("Error fetching migos for woo:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
