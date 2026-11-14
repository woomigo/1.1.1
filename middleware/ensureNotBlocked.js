const ensureNotBlocked = async (req, res, next) => {
  const actorId = req.user.id;
  const targetId =
    req.body.userId ||
    req.params.userId ||
    req.params.targetId;

  if (!targetId) return next(); // nothing to check

  try {
    const [rows] = await db.query(
      `
      SELECT 1
      FROM user_blocks
      WHERE
        (blocker_id = ? AND blocked_id = ?)
        OR
        (blocker_id = ? AND blocked_id = ?)
      LIMIT 1
      `,
      [actorId, targetId, targetId, actorId]
    );

    if (rows.length) {
      return res.status(403).json({
        error: 'Interaction not allowed',
      });
    }

    next();
  } catch (err) {
    console.error('Block middleware error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = ensureNotBlocked;