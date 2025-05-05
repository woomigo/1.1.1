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
