const db = require("../db");

exports.sendFollowRequest = async (req, res) => {
  const { sender_id, receiver_id } = req.body;

  if (!sender_id || !receiver_id) {
    return res.status(400).json({ error: "Missing sender_id or receiver_id." });
  }

  try {
    // Check if receiver exists
    const [[receiver]] = await db.query(
      `SELECT is_private FROM users WHERE id = ?`,
      [receiver_id]
    );

    if (!receiver) {
      return res.status(404).json({ error: "Receiver user not found." });
    }

    // Public profile → follow directly
    if (!receiver.is_private) {
      return res.status(400).json({
        error: "This user has a public profile. You can follow them directly.",
      });
    }

    // Check if there is an existing **pending** follow request
    const [[existingPending]] = await db.query(
      `SELECT * FROM follow_requests 
       WHERE sender_id = ? AND receiver_id = ? AND status = 'pending'`,
      [sender_id, receiver_id]
    );

    if (existingPending) {
      return res.status(400).json({ error: "Follow request already sent." });
    }

    // Check if there was a previously declined request
    const [[declinedRequest]] = await db.query(
      `SELECT * FROM follow_requests 
       WHERE sender_id = ? AND receiver_id = ? AND status = 'declined'`,
      [sender_id, receiver_id]
    );

    if (declinedRequest) {
      // Reuse the same row by updating its status
      await db.query(
        `UPDATE follow_requests SET status = 'pending', created_at = NOW() 
         WHERE id = ?`,
        [declinedRequest.id]
      );
      return res.status(200).json({ message: "Follow request re-sent." });
    }

    // If no existing request → insert a new one
    await db.query(
      `INSERT INTO follow_requests (sender_id, receiver_id) VALUES (?, ?)`,
      [sender_id, receiver_id]
    );

    res.status(201).json({ message: "Follow request sent." });
  } catch (err) {
    console.error("Error sending follow request:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.cancelFollowRequest = async (req, res) => {
  const { sender_id, receiver_id } = req.body;

  if (!sender_id || !receiver_id) {
    return res.status(400).json({ error: "Missing sender_id or receiver_id." });
  }

  try {
    const [result] = await db.query(
      `DELETE FROM follow_requests WHERE sender_id = ? AND receiver_id = ?`,
      [sender_id, receiver_id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "No follow request found to cancel." });
    }

    res.status(200).json({ message: "Follow request canceled successfully." });
  } catch (err) {
    console.error("Error canceling follow request:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.acceptFollowRequest = async (req, res) => {
  const requestId = req.params.id;

  try {
    const [[request]] = await db.query(
      `SELECT sender_id, receiver_id FROM follow_requests WHERE id = ?`,
      [requestId]
    );

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    const { sender_id, receiver_id } = request;

    await db.query(
      `UPDATE follow_requests SET status = 'accepted' WHERE id = ?`,
      [requestId]
    );

    const [[existingFollow]] = await db.query(
      `SELECT * FROM followers WHERE follower_id = ? AND followee_id = ?`,
      [sender_id, receiver_id]
    );

    if (!existingFollow) {
      await db.query(
        `INSERT INTO followers (follower_id, followee_id) VALUES (?, ?)`,
        [sender_id, receiver_id]
      );
    }

    res.json({ message: "Follow request accepted" });
  } catch (err) {
    console.error("Error accepting follow request:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.declineFollowRequest = async (req, res) => {
  const requestId = req.params.id;
  try {
    await db.query(
      `UPDATE follow_requests SET status = 'declined' WHERE id = ?`,
      [requestId]
    );
    res.json({ message: "Follow request declined" });
  } catch (err) {
    console.error("Error declining follow request:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getIncomingFollowRequests = async (req, res) => {
  const receiverId = req.user.id;

  try {
    const [requests] = await db.query(
      `SELECT 
         fr.id AS request_id,
         fr.status,
         fr.created_at,
         u.uuid AS user_id,   -- changed from sender_id
         u.username,
         u.first_name,
         u.last_name,
         u.profile_pic_url
       FROM follow_requests fr
       JOIN users u ON fr.sender_id = u.uuid
       WHERE fr.receiver_id = ? AND fr.status = 'pending'
       ORDER BY fr.created_at DESC`,
      [receiverId]
    );

    res.json({ incoming_requests: requests });
  } catch (err) {
    console.error("Error fetching incoming follow requests:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getOutgoingFollowRequests = async (req, res) => {
  const senderId = req.user.id;

  try {
    const [requests] = await db.query(
      `SELECT 
         fr.id AS request_id,
         fr.status,
         fr.created_at,
         u.uuid AS user_id,  -- changed from receiver_id
         u.username,
         u.first_name,
         u.last_name,
         u.profile_pic_url
       FROM follow_requests fr
       JOIN users u ON fr.receiver_id = u.uuid
       WHERE fr.sender_id = ? AND fr.status = 'pending'
       ORDER BY fr.created_at DESC`,
      [senderId]
    );

    res.json({ outgoing_requests: requests });
  } catch (err) {
    console.error("Error fetching outgoing follow requests:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.checkIfFollowRequestExists = async (req, res) => {
  const { sender_id, receiver_id } = req.query;

  if (!sender_id || !receiver_id) {
    return res
      .status(400)
      .json({ error: "Both sender_id and receiver_id are required." });
  }

  try {
    const [[request]] = await db.query(
      `SELECT id, status, created_at
       FROM follow_requests
       WHERE sender_id = ? AND receiver_id = ?`,
      [sender_id, receiver_id]
    );

    if (request) {
      return res.json({ exists: true, request });
    } else {
      return res.json({ exists: false });
    }
  } catch (err) {
    console.error("Error checking follow request existence:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
