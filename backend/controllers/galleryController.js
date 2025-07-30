const db = require("../db");

// Get media for a specific woo
exports.getWooGallery = async (req, res) => {
  const { woo_id } = req.params;

  try {
    const [media] = await db.query(
      `SELECT * FROM woo_gallery WHERE woo_id = ? ORDER BY created_at DESC`,
      [woo_id]
    );

    res.json(media);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getWooGalleryUserInfoByWooId = async (req, res) => {
  const wooId = req.params.wooId;

  try {
    const [rows] = await db.execute(
      `
      SELECT 
        wg.id AS story_id,
        wg.media_url,
        wg.media_type,
        wg.created_at,
        u.id AS user_id,
        u.username AS username,
        u.profile_pic_url
      FROM woo_gallery wg
      JOIN users u ON wg.user_id = u.id
      WHERE wg.woo_id = ?
      ORDER BY wg.created_at DESC
      `,
      [wooId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No gallery found for this woo" });
    }

    const gallery = rows.map((row) => ({
      id: row.story_id,
      media_url: row.media_url,
      media_type: row.media_type,
      created_at: row.created_at,
      user: {
        id: row.user_id,
        username: row.username,
        profile_pic_url: row.profile_pic_url,
      },
    }));

    res.json({ woo_id: wooId, gallery });
  } catch (error) {
    console.error("Error fetching gallery by woo ID:", error);
    res.status(500).json({ message: "Failed to fetch woo gallery" });
  }
};

// Get media for a specific user
exports.getUserGallery = async (req, res) => {
  const { user_id } = req.params;

  try {
    const [media] = await db.query(
      `SELECT * FROM profile_gallery WHERE user_id = ? ORDER BY created_at DESC`,
      [user_id]
    );

    res.json(media);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
