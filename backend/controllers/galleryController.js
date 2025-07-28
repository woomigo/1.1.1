const db = require('../db');

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
