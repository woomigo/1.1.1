const db = require('../db');

// Add a manager to a group
exports.addManager = async (req, res) => {
  const { group_id, user_id, added_by } = req.body;

  if (!group_id || !user_id || !added_by) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    // 1. Confirm group exists
    const [[group]] = await db.query(
      `SELECT * FROM follower_groups WHERE id = ?`,
      [group_id]
    );
    if (!group) {
      return res.status(404).json({ error: "Group not found." });
    }

    // 2. Check that user is already a member
    const [[isMember]] = await db.query(
      `SELECT EXISTS (
         SELECT 1 FROM group_members WHERE group_id = ? AND user_id = ?
       ) AS is_member`,
      [group_id, user_id]
    );
    if (!isMember.is_member) {
      return res.status(400).json({ error: "User must be a group member before being made a manager." });
    }

    // 3. Check that added_by is the owner
    if (added_by !== group.owner_id) {
      return res.status(403).json({ error: "Only the group owner can assign managers." });
    }

    // 4. Add manager
    await db.query(
      `INSERT INTO group_managers (group_id, user_id, added_by) VALUES (?, ?, ?)`,
      [group_id, user_id, added_by]
    );

    res.status(201).json({ message: "User promoted to manager." });

  } catch (err) {
    console.error("Error adding manager:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Get all managers for a group
exports.getGroupManagers = async (req, res) => {
  const { groupId } = req.params;

  try {
    const [managers] = await db.query(
      `SELECT u.uuid, u.username, u.first_name, u.last_name, u.profile_pic_url
       FROM group_managers gm
       JOIN users u ON gm.user_id = u.uuid
       WHERE gm.group_id = ?`,
      [groupId]
    );

    res.json(managers);
  } catch (err) {
    console.error("Error fetching managers:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Remove someone from manager status only (demote), but keep in group
exports.demoteManager = async (req, res) => {
    const { groupId, userId } = req.params;
    const { requested_by } = req.body;
  
    if (!requested_by) {
      return res.status(400).json({ error: "Missing requested_by field." });
    }
  
    try {
      const [[group]] = await db.query(
        `SELECT owner_id FROM follower_groups WHERE id = ?`,
        [groupId]
      );
      if (!group) {
        return res.status(404).json({ error: "Group not found." });
      }
  
      if (requested_by !== group.owner_id) {
        return res.status(403).json({ error: "Only the group owner can demote managers." });
      }
  
      await db.query(
        `DELETE FROM group_managers WHERE group_id = ? AND user_id = ?`,
        [groupId, userId]
      );
  
      res.json({ message: "User demoted from manager." });
  
    } catch (err) {
      console.error("Error demoting manager:", err);
      res.status(500).json({ error: "Internal server error." });
    }
  };
  