const db = require('../db');

exports.getFollowers = async (req, res) => {
  const [rows] = await db.query(
    'SELECT follower_id FROM followers WHERE followee_id = ?', [req.params.id]
  );
  res.json(rows);
};

exports.getFollowings = async (req, res) => {
  const [rows] = await db.query(
    'SELECT followee_id FROM followers WHERE follower_id = ?', [req.params.id]
  );
  res.json(rows);
};

exports.followUser = async (req, res) => {
  const { follower_id, followee_id } = req.body;
  if (follower_id === followee_id) {
    return res.status(400).json({ error: 'Cannot follow yourself' });
  }

  try {
    await db.query(
      'INSERT INTO followers (follower_id, followee_id) VALUES (?, ?)', [follower_id, followee_id]
    );
    res.status(201).json({ message: 'Followed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.unfollowUser = async (req, res) => {
  const { follower_id, followee_id } = req.body;
  await db.query(
    'DELETE FROM followers WHERE follower_id = ? AND followee_id = ?', [follower_id, followee_id]
  );
  res.json({ message: 'Unfollowed successfully' });
};

exports.getMutualFollows = async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT f1.follower_id AS user1, f1.followee_id AS user2
        FROM followers f1
        JOIN followers f2
          ON f1.follower_id = f2.followee_id
         AND f1.followee_id = f2.follower_id
      `);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
exports.getUserFollowCounts = async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required in the URL." });
  }
  try {

    const [userResult] = await db.query(
      `SELECT uuid, username, first_name, last_name, profile_pic_url, is_private FROM users WHERE uuid = ?`,
      [userId]
    );
    if (userResult.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = userResult[0];

    const [[counts]] = await db.query(
      `SELECT 
         (SELECT COUNT(*) FROM followers WHERE followee_id = ?) AS follower_count,
         (SELECT COUNT(*) FROM followers WHERE follower_id = ?) AS followee_count`,
      [userId, userId]
    );

    res.json({
      user,
      follower_count: counts.follower_count,
      followee_count: counts.followee_count
    });
  } catch (err) {
    console.error("Error fetching follow counts:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUserWithFollowersAndFollowingInfo = async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required in the URL." });
  }
  try {
    const [userResult] = await db.query(
      `SELECT uuid, username, first_name, last_name, profile_pic_url FROM users WHERE uuid = ?`,
      [userId]
    );
    if (userResult.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = userResult[0];

    const [followers] = await db.query(
      `SELECT u.uuid AS user_id, u.username, u.first_name, u.last_name, u.profile_pic_url
       FROM followers f
       JOIN users u ON f.follower_id = u.uuid
       WHERE f.followee_id = ?`,
      [userId]
    );

    const [followees] = await db.query(
      `SELECT u.uuid AS user_id, u.username, u.first_name, u.last_name, u.profile_pic_url
       FROM followers f
       JOIN users u ON f.followee_id = u.uuid
       WHERE f.follower_id = ?`,
      [userId]
    );

    res.json({
      user,
      followers,
      followees
    });
  } catch (err) {
    console.error("Error fetching user + follow info:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getFollowersInfo = async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required in the URL." });
  }
  try {
    const [userResult] = await db.query(
      `SELECT uuid, username, first_name, last_name, profile_pic_url FROM users WHERE uuid = ?`,
      [userId]
    );
    if (userResult.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = userResult[0];

    const [followers] = await db.query(
      `SELECT u.uuid, u.username, u.first_name, u.last_name, u.profile_pic_url
       FROM followers f
       JOIN users u ON f.follower_id = u.uuid
       WHERE f.followee_id = ?`,
      [userId]
    );

    res.json({
      user,
      followers,
    });
  } catch (err) {
    console.error("Error fetching user + follow info:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getFollowingsInfo = async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required in the URL." });
  }
  try {
    const [userResult] = await db.query(
      `SELECT uuid, username, first_name, last_name, profile_pic_url FROM users WHERE uuid = ?`,
      [userId]
    );
    if (userResult.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = userResult[0];

    const [followees] = await db.query(
      `SELECT u.uuid, u.username, u.first_name, u.last_name, u.profile_pic_url
       FROM followers f
       JOIN users u ON f.followee_id = u.uuid
       WHERE f.follower_id = ?`,
      [userId]
    );

    res.json({
      user,
      followees
    });
  } catch (err) {
    console.error("Error fetching user + follow info:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
