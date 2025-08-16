const db = require("../db");

const sanitizeTag = (tag) => tag.trim().toLowerCase();

exports.attachTag = async (req, res) => {
  const { wooId, tag } = req.body;
  const sanitized = sanitizeTag(tag);

  if (!wooId || !sanitized)
    return res.status(400).json({ error: "Woo ID and tag are required" });

  // Check if tag exists in approved tags
  const [existing] = await db.query("SELECT id FROM tags WHERE name = ?", [
    sanitized,
  ]);

  if (existing.length > 0) {
    const tagId = existing[0].id;

    // Add to woo_tags as approved
    await db.query(
      "INSERT IGNORE INTO woo_tags (woo_id, tag_id, pending_approval) VALUES (?, ?, FALSE)",
      [wooId, tagId]
    );

    return res.json({
      message: "Tag attached",
      tag: sanitized,
      approved: true,
    });
  } else {
    // Insert into pending_tags
    await db.query(
      "INSERT IGNORE INTO pending_tags (name, submitted_by_user_id, submitted_woo_id) VALUES (?, ?, ?)",
      [sanitized, req.user?.id || null, wooId]
    );

    // Add to woo_tags as pending
    await db.query(
      "INSERT IGNORE INTO woo_tags (woo_id, tag_name, pending_approval) VALUES (?, ?, TRUE)",
      [wooId, sanitized]
    );

    return res.json({
      message: "Custom tag submitted for approval",
      tag: sanitized,
      approved: false,
    });
  }
};

exports.getPendingTags = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM pending_tags WHERE approved = FALSE AND rejected = FALSE"
  );
  res.json(rows);
};

exports.approveTag = async (req, res) => {
  const tagId = req.params.id;

  // Get pending tag
  const [[tagRow]] = await db.query("SELECT * FROM pending_tags WHERE id = ?", [
    tagId,
  ]);
  if (!tagRow) return res.status(404).json({ error: "Tag not found" });

  const sanitized = sanitizeTag(tagRow.name);

  // Insert into global tags
  const [result] = await db.query("INSERT IGNORE INTO tags (name) VALUES (?)", [
    sanitized,
  ]);

  const tag_id =
    result.insertId ||
    (await db.query("SELECT id FROM tags WHERE name = ?", [sanitized]))[0][0]
      .id;

  // Update woo_tags
  await db.query(
    `UPDATE woo_tags 
     SET tag_id = ?, pending_approval = FALSE
     WHERE tag_name = ? AND woo_id = ?`,
    [tag_id, sanitized, tagRow.submitted_woo_id]
  );

  // Mark as approved
  await db.query(
    `UPDATE pending_tags SET approved = TRUE, reviewed_at = NOW() WHERE id = ?`,
    [tagId]
  );

  res.json({ message: "Tag approved and linked", tag: sanitized });
};

exports.rejectTag = async (req, res) => {
  const tagId = req.params.id;
  const { reason } = req.body;

  // Get pending tag
  const [[tagRow]] = await db.query("SELECT * FROM pending_tags WHERE id = ?", [
    tagId,
  ]);
  if (!tagRow) return res.status(404).json({ error: "Tag not found" });

  const sanitized = sanitizeTag(tagRow.name);

  // Remove from woo_tags
  await db.query("DELETE FROM woo_tags WHERE tag_name = ? AND woo_id = ?", [
    sanitized,
    tagRow.submitted_woo_id,
  ]);

  // Mark as rejected
  await db.query(
    `UPDATE pending_tags 
     SET rejected = TRUE, rejection_reason = ?, reviewed_at = NOW() 
     WHERE id = ?`,
    [reason || "", tagId]
  );

  res.json({ message: "Tag rejected and removed", tag: sanitized });
};

// Get all approved tags
exports.getAllTags = async (req, res) => {
  try {
    const [tags] = await db.query("SELECT * FROM tags ORDER BY name ASC");
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tags" });
  }
};

// Get all tags (approved + pending) for a Woo
exports.getTagsForWoo = async (req, res) => {
  const { wooId } = req.params;
  if (!wooId) return res.status(400).json({ error: "Woo ID required" });

  try {
    const [tags] = await db.query(
      `SELECT 
           wt.tag_id, 
           wt.tag_name, 
           t.name AS approved_name,
           wt.pending_approval
         FROM woo_tags wt
         LEFT JOIN tags t ON wt.tag_id = t.id
         WHERE wt.woo_id = ?
         ORDER BY wt.created_at ASC`,
      [wooId]
    );

    // Normalize output for frontend
    const result = tags.map((tag) => ({
      name: tag.approved_name || tag.tag_name,
      pending: tag.pending_approval,
    }));

    res.json(result);
  } catch (err) {
    console.error("Error fetching tags for woo:", err);
    res.status(500).json({ error: "Failed to fetch tags for woo" });
  }
};

// Get all tags with IDs (for admin/debug)
exports.getAllTagsWithIDs = async (req, res) => {
  try {
    const [tags] = await db.query(
      "SELECT id, name, created_at FROM tags ORDER BY name ASC"
    );
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tag list" });
  }
};

exports.searchTags = async (req, res) => {
  const { query } = req.query;

  if (!query || query.length < 2) {
    return res.status(400).json({ error: "Search query too short" });
  }

  try {
    const [results] = await db.query(
      `SELECT name FROM tags WHERE name LIKE ? ORDER BY name ASC LIMIT 10`,
      [`%${query.trim().toLowerCase()}%`]
    );
    res.json(results.map((row) => row.name));
  } catch (err) {
    res.status(500).json({ error: "Autocomplete failed" });
  }
};
