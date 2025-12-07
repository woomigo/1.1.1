const db = require("../db");

exports.getRelationshipStatus = async (req, res) => {
  const viewer_id = req.user.id; // current user from auth
  const profile_id = req.query.profileId; // the target profile

  if (!profile_id) {
    return res.status(400).json({ error: "profileId is required" });
  }

  if (viewer_id === profile_id) {
    return res.json({
      relationship_status: "own_profile",
      button: "none",
    });
  }

  try {
    // 1. Get profile privacy
    const [[profile]] = await db.query(
      `SELECT is_private FROM users WHERE uuid = ?`,
      [profile_id]
    );

    if (!profile) {
      return res.status(404).json({ error: "Profile user not found" });
    }

    const is_private = profile.is_private;

    // 2. Is viewer following profile?
    const [[f1]] = await db.query(
      `SELECT 1 FROM followers WHERE follower_id = ? AND followee_id = ?`,
      [viewer_id, profile_id]
    );

    const is_following = !!f1;

    // 3. Does profile follow viewer?
    const [[f2]] = await db.query(
      `SELECT 1 FROM followers WHERE follower_id = ? AND followee_id = ?`,
      [profile_id, viewer_id]
    );

    const is_followed_by = !!f2;

    // 4. Does viewer have a pending outgoing request?
    const [[reqSent]] = await db.query(
      `SELECT status FROM follow_requests 
       WHERE sender_id = ? AND receiver_id = ? AND status = 'pending'`,
      [viewer_id, profile_id]
    );

    const request_sent = !!reqSent;

    // 5. Does viewer have a pending incoming request?
    const [[reqReceived]] = await db.query(
      `SELECT status FROM follow_requests 
       WHERE sender_id = ? AND receiver_id = ? AND status = 'pending'`,
      [profile_id, viewer_id]
    );

    const request_received = !!reqReceived;

    // 🔥 RELATIONSHIP STATUS DECISION TREE
    if (is_following && is_followed_by) {
      return res.json({ relationship_status: "mutual", button: "unfollow", is_private, is_following, is_followed_by, request_sent, request_received });
    }
    if (is_following) {
      return res.json({ relationship_status: "following", button: "unfollow", is_private, is_following, is_followed_by, request_sent, request_received });
    }
    if (is_followed_by) {
      return res.json({ relationship_status: "follow_back", button: "follow", is_private, is_following, is_followed_by, request_sent, request_received });
    }
    if (request_sent) {
      return res.json({ relationship_status: "requested", button: "requested", is_private, is_following, is_followed_by, request_sent, request_received });
    }
    if (request_received) {
      return res.json({ relationship_status: "request_received", button: "accept_or_decline", is_private, is_following, is_followed_by, request_sent, request_received });
    }
    if (is_private) {
      return res.json({ relationship_status: "not_following_private", button: "request_follow", is_private, is_following, is_followed_by, request_sent, request_received });
    }
    return res.json({ relationship_status: "not_following", button: "follow", is_private, is_following, is_followed_by, request_sent, request_received });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


