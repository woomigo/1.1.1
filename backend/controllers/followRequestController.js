exports.sendFollowRequest = async (req, res) => {
    const { requester_id, target_id } = req.body;
  
    if (!requester_id || !target_id) {
      return res.status(400).json({ error: "Missing requester_id or target_id." });
    }
  
    try {
      // Get the target user’s privacy setting
      const [[target]] = await db.query(
        `SELECT is_private FROM users WHERE id = ?`,
        [target_id]
      );
  
      if (!target) {
        return res.status(404).json({ error: "Target user not found." });
      }
  
      // Don’t allow requests to public profiles
      if (!target.is_private) {
        return res.status(400).json({ error: "This user has a public profile. You can follow them directly." });
      }
  
      // Check if request already exists
      const [[existing]] = await db.query(
        `SELECT * FROM follow_requests WHERE requester_id = ? AND target_id = ?`,
        [requester_id, target_id]
      );
  
      if (existing) {
        return res.status(400).json({ error: "Follow request already sent." });
      }
  
      // ✅ Save follow request
      await db.query(
        `INSERT INTO follow_requests (requester_id, target_id) VALUES (?, ?)`,
        [requester_id, target_id]
      );
  
      res.status(201).json({ message: "Follow request sent." });
  
    } catch (err) {
      console.error("Error sending follow request:", err);
      res.status(500).json({ error: "Internal server error." });
    }
  };
  

exports.acceptFollowRequest = async (req, res) => {
  const requestId = req.params.id;
  try {
    // 1. Get sender and receiver from the request
    const [[request]] = await db.query(
      `SELECT sender_id, receiver_id FROM follow_requests WHERE id = ?`,
      [requestId]
    );

    if (!request) return res.status(404).json({ error: "Request not found" });

    // 2. Update request status
    await db.query(
      `UPDATE follow_requests SET status = 'accepted' WHERE id = ?`,
      [requestId]
    );

    // 3. Insert into followers table
    await db.query(
      `INSERT INTO followers (follower_id, followee_id) VALUES (?, ?)`,
      [request.sender_id, request.receiver_id]
    );

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
