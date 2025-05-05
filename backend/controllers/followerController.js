const db = require('../db');

// Get followers of a user
exports.getFollowers = async (req, res) => {
  const [rows] = await db.query(
    'SELECT follower_id FROM followers WHERE followee_id = ?', [req.params.id]
  );
  res.json(rows);
};

// Get followees of a user
exports.getFollowees = async (req, res) => {
  const [rows] = await db.query(
    'SELECT followee_id FROM followers WHERE follower_id = ?', [req.params.id]
  );
  res.json(rows);
};

// Follow someone
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

// Unfollow
exports.unfollowUser = async (req, res) => {
  const { follower_id, followee_id } = req.body;
  await db.query(
    'DELETE FROM followers WHERE follower_id = ? AND followee_id = ?', [follower_id, followee_id]
  );
  res.json({ message: 'Unfollowed successfully' });
};


// Get mutual followers
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
  