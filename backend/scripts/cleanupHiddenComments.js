const db = require('../config/db');

const deleteOldHiddenComments = async () => {
  try {
    // 1. Delete top-level hidden comments older than 30 days
    const [topLevelResult] = await db.query(`
      DELETE FROM comments
      WHERE is_visible = FALSE
        AND created_at < NOW() - INTERVAL 30 DAY
    `);

    console.log(`Deleted ${topLevelResult.affectedRows} top-level hidden comments.`);

    // 2. Delete replies where the parent comment is no longer visible or deleted
    const [orphanedRepliesResult] = await db.query(`
      DELETE c FROM comments c
      LEFT JOIN comments pc ON c.parent_comment_id = pc.id
      WHERE c.parent_comment_id IS NOT NULL
        AND (pc.id IS NULL OR pc.is_visible = FALSE)
    `);

    console.log(`Deleted ${orphanedRepliesResult.affectedRows} orphaned replies.`);

    process.exit();
  } catch (err) {
    console.error('Cleanup failed:', err.message);
    process.exit(1);
  }
};

deleteOldHiddenComments();

