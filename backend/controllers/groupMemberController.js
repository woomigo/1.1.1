const db = require('../db'); // Adjust path if needed

// Add member to group with follow + permission checks
exports.addGroupMember = async (req, res) => {
  const { group_id, user_id, added_by } = req.body;

  if (!group_id || !user_id || !added_by) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    // Step 1: Get group + owner
    const [[group]] = await db.query(
      `SELECT * FROM follower_groups WHERE id = ?`,
      [group_id]
    );
    if (!group) {
      return res.status(404).json({ error: "Group not found." });
    }

// Step 2: Check if user being added is following the person adding them
const [[isFollowingAdder]] = await db.query(
    `SELECT EXISTS (
       SELECT 1 FROM followers 
       WHERE follower_id = ? AND followee_id = ?
     ) AS is_follower`,
    [user_id, added_by]
  );
  
  if (!isFollowingAdder.is_follower) {
    return res.status(403).json({ error: "User must be following you before you can add them to a group." });
  }
  

    // Step 3: Check if added_by is authorized (owner or manager in group)
    const isOwner = added_by === group.owner_id;

    const [[auth]] = await db.query(
      `SELECT 
         EXISTS (
           SELECT 1 FROM group_managers WHERE group_id = ? AND user_id = ?
         ) AS is_manager,
         EXISTS (
           SELECT 1 FROM group_members WHERE group_id = ? AND user_id = ?
         ) AS is_member`,
      [group_id, added_by, group_id, added_by]
    );

    if (!isOwner && !(auth.is_manager && auth.is_member)) {
      return res.status(403).json({ error: "Not authorized to add members." });
    }

    // Step 4: Add user to group
    await db.query(
      `INSERT INTO group_members (group_id, user_id) VALUES (?, ?)`,
      [group_id, user_id]
    );

    res.status(201).json({ message: "User added to group." });

  } catch (err) {
    console.error("Error adding group member:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Get all members of a group
exports.getGroupMembers = async (req, res) => {
  const { groupId } = req.params;

  try {
    const [members] = await db.query(
      `SELECT u.uuid, u.username, u.first_name, u.last_name, u.profile_pic_url
       FROM group_members gm
       JOIN users u ON gm.user_id = u.uuid
       WHERE gm.group_id = ?`,
      [groupId]
    );
    res.json(members);
  } catch (err) {
    console.error("Error fetching group members:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Remove a member from a group
exports.removeGroupMember = async (req, res) => {
    const { groupId, userId } = req.params;
    const { removed_by } = req.body;
  
    if (!removed_by) {
      return res.status(400).json({ error: "Missing removed_by field." });
    }
  
    try {
      const [[group]] = await db.query(
        `SELECT owner_id FROM follower_groups WHERE id = ?`,
        [groupId]
      );
  
      if (!group) {
        return res.status(404).json({ error: "Group not found." });
      }
  
      // Allow self-removal (leaving the group)
      const isSelfRemoval = removed_by == userId;
  
      // Otherwise must be owner or manager
      const [[auth]] = await db.query(
        `SELECT EXISTS (
           SELECT 1 FROM group_managers WHERE group_id = ? AND user_id = ?
         ) AS is_manager`,
        [groupId, removed_by]
      );
  
      const isOwner = removed_by == group.owner_id;
  
      if (!isSelfRemoval && !isOwner && !auth.is_manager) {
        return res.status(403).json({ error: "Not authorized to remove this member." });
      }
  
      await db.query(
        `DELETE FROM group_members WHERE group_id = ? AND user_id = ?`,
        [groupId, userId]
      );
  
      // Optionally: remove them from group_managers if they were promoted
      await db.query(
        `DELETE FROM group_managers WHERE group_id = ? AND user_id = ?`,
        [groupId, userId]
      );
  
      res.json({ message: isSelfRemoval ? "You left the group." : "Member removed from group." });
  
    } catch (err) {
      console.error("Error removing group member:", err);
      res.status(500).json({ error: "Internal server error." });
    }
  };
  