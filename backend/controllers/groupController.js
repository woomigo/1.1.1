const db = require('../db');

// CREATE follower group
exports.createGroup = async (req, res) => {
  const { name, description, owner_id, profile_pic_url } = req.body;

  if (!name || !owner_id) {
    return res.status(400).json({ error: "Name and owner_id are required." });
  }

  try {
    // Start transaction to ensure atomicity
    await db.query('START TRANSACTION');

    const [result] = await db.query(
      `INSERT INTO follower_groups (name, description, owner_id, profile_pic_url) VALUES (?, ?, ?, ?)`,
      [name, description || null, owner_id, profile_pic_url || null]
    );

    const newGroupId = result.insertId;

    // Insert owner as member too
    await db.query(
      `INSERT INTO group_members (group_id, user_id, joined_at) VALUES (?, ?, NOW())`,
      [newGroupId, owner_id]
    );

    await db.query('COMMIT');

    res.status(201).json({
      id: newGroupId,
      name,
      description,
      owner_id,
      profile_pic_url
    });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error("Error creating group:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


// READ all follower groups
exports.getAllGroups = async (req, res) => {
  try {
    const [groups] = await db.query(`SELECT * FROM follower_groups`);
    res.json(groups);
  } catch (err) {
    console.error("Error fetching groups:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getGroupsByUserId = async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  try {
    const [groups] = await db.query(
      `SELECT 
         fg.*, 
         (fg.owner_id = ?) AS isOwner,
         EXISTS (
           SELECT 1 FROM group_managers gm 
           WHERE gm.group_id = fg.id AND gm.user_id = ?
         ) AS isManager,
         (
           SELECT COUNT(*) 
           FROM group_members gm_count 
           WHERE gm_count.group_id = fg.id
         ) AS member_count,
         (
           SELECT JSON_ARRAYAGG(u.profile_pic_url)
           FROM group_members gm_pics
           JOIN users u ON gm_pics.user_id = u.uuid
           WHERE gm_pics.group_id = fg.id
         ) AS member_profile_pics
       FROM follower_groups fg
       JOIN group_members gm ON fg.id = gm.group_id
       WHERE gm.user_id = ?`,
      [userId, userId, userId]
    );

    res.json(groups);
  } catch (err) {
    console.error("Error fetching user's groups with details:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};



// UPDATE a follower group
exports.updateGroup = async (req, res) => {
  const groupId = req.params.id;
  const { name, description, profile_pic_url } = req.body;

  if (!name && !description && !profile_pic_url) {
    return res.status(400).json({ error: "Nothing to update." });
  }

  try {
    await db.query(
      `UPDATE follower_groups SET 
         name = COALESCE(?, name),
         description = COALESCE(?, description),
         profile_pic_url = COALESCE(?, profile_pic_url)
       WHERE id = ?`,
      [name, description, profile_pic_url, groupId]
    );

    res.json({ message: "Group updated." });
  } catch (err) {
    console.error("Error updating group:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE a follower group
exports.deleteGroup = async (req, res) => {
  const groupId = req.params.id;

  try {
    await db.query(`DELETE FROM follower_groups WHERE id = ?`, [groupId]);
    res.json({ message: "Group deleted." });
  } catch (err) {
    console.error("Error deleting group:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
