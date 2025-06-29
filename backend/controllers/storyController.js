const db = require("../db");

exports.uploadToProfileGallery = async (req, res) => {
  const userId = req.user.id;
  const { media_url, media_type } = req.body;

  try {
    const [result] = await db.execute(
      `INSERT INTO profile_gallery (user_id, media_url, media_type) VALUES (?, ?, ?)`,
      [userId, media_url, media_type]
    );
    res.status(201).json({ id: result.insertId, media_url, media_type });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to upload to profile gallery" });
  }
};

exports.uploadUserStory = async (req, res) => {
  const userId = req.user.id;
  const { media_url, media_type } = req.body;
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // expires in 24h

  try {
    const [result] = await db.execute(
      `INSERT INTO stories (user_id, media_url, media_type, expires_at) VALUES (?, ?, ?, ?)`,
      [userId, media_url, media_type, expiresAt]
    );
    res.status(201).json({ id: result.insertId, media_url, media_type, expires_at: expiresAt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to upload story" });
  }
};


exports.getStoriesByWoo = async (req, res) => {
  const wooId = req.params.wooId;
  const userId = req.user?.id; // <- depends on your auth setup

  try {
    const [stories] = await db.execute(
      `SELECT 
           wg.id,
           wg.media_url,
           wg.media_type,
           wg.created_at,
           u.username,
           u.profile_pic_url,
           wgv.viewer_id IS NOT NULL AS seen
         FROM woo_gallery wg
         JOIN users u ON wg.user_id = u.id
         LEFT JOIN woo_gallery_views wgv
           ON wg.id = wgv.gallery_id AND wgv.viewer_id = ?
         WHERE wg.woo_id = ? AND wg.expires_at > NOW()
         ORDER BY wg.created_at DESC`,
      [userId, wooId]
    );

    res.json({ stories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load stories" });
  }
};

// controllers/storyController.js

exports.getWooGalleryFeed = async (req, res) => {
  const currentUserId = req.user.id;

  try {
    const [rows] = await db.execute(
      `
      SELECT 
        wg.id AS story_id,
        wg.media_url,
        wg.media_type,
        wg.created_at,
        wg.woo_id,
        w.media_url AS woo_media_url,
        w.owner_uid AS woo_owner_id,
        owner.username AS woo_owner_username,
        owner.profile_pic_url AS woo_owner_avatar,

        poster.id AS story_user_id,
        poster.username AS story_user_username,
        poster.profile_pic_url AS story_user_avatar,

        wgv.viewer_id IS NOT NULL AS seen

      FROM woo_gallery wg
      JOIN woos w ON wg.woo_id = w.id
      JOIN users poster ON wg.user_id = poster.id
      JOIN users owner ON w.owner_uid = owner.id
      LEFT JOIN woo_gallery_views wgv 
        ON wg.id = wgv.gallery_id AND wgv.viewer_id = ?

      WHERE (
        (w.type = 'private' AND EXISTS (
            SELECT 1 FROM migos m
            WHERE m.woo_id = w.id AND m.user_id = ?
        ))
        OR
        (w.type = 'public' AND EXISTS (
            SELECT 1 FROM followers f
            WHERE f.follower_id = ? AND f.followee_id = w.owner_uid
        ))
      )

      ORDER BY wg.woo_id, wg.created_at DESC
      `,
      [currentUserId, currentUserId, currentUserId]
    );

    const feedMap = {};
    for (const row of rows) {
      if (!feedMap[row.woo_id]) {
        feedMap[row.woo_id] = {
          woo_id: row.woo_id,
          woo_media_url: row.woo_media_url,
          woo_owner: {
            id: row.woo_owner_id,
            username: row.woo_owner_username,
            avatar: row.woo_owner_avatar,
          },
          unseen: false,
          stories: [],
        };
      }

      feedMap[row.woo_id].stories.push({
        id: row.story_id,
        media_url: row.media_url,
        media_type: row.media_type,
        created_at: row.created_at,
        seen: !!row.seen,
        user: {
          id: row.story_user_id,
          username: row.story_user_username,
          avatar: row.story_user_avatar,
        },
      });

      if (!row.seen) {
        feedMap[row.woo_id].unseen = true;
      }
    }

    res.json(Object.values(feedMap));
  } catch (error) {
    console.error("Error fetching woo gallery feed:", error);
    res.status(500).json({ message: "Failed to load woo gallery feed" });
  }
};

exports.getProfileGalleryFeed = async (req, res) => {
  const currentUserId = req.user.id;

  try {
    const [rows] = await db.execute(
      `
      SELECT 
        pg.id AS story_id,
        pg.media_url,
        pg.media_type,
        pg.created_at,

        u.id AS user_id,
        u.username,
        u.profile_pic_url,

        pgv.viewer_id IS NOT NULL AS seen

      FROM profile_gallery pg
      JOIN users u ON pg.user_id = u.id
      LEFT JOIN profile_gallery_views pgv 
        ON pg.id = pgv.gallery_id AND pgv.viewer_id = ?

      WHERE EXISTS (
        SELECT 1 FROM followers f
        WHERE f.follower_id = ? AND f.followee_id = pg.user_id
      )
      ORDER BY pg.created_at DESC
      `,
      [currentUserId, currentUserId]
    );

    const userFeedMap = {};

    for (const row of rows) {
      if (!userFeedMap[row.user_id]) {
        userFeedMap[row.user_id] = {
          user: {
            id: row.user_id,
            username: row.username,
            avatar: row.profile_pic_url,
          },
          unseen: false,
          stories: [],
        };
      }

      userFeedMap[row.user_id].stories.push({
        id: row.story_id,
        media_url: row.media_url,
        media_type: row.media_type,
        created_at: row.created_at,
        seen: !!row.seen,
      });

      if (!row.seen) {
        userFeedMap[row.user_id].unseen = true;
      }
    }

    res.json(Object.values(userFeedMap));
  } catch (error) {
    console.error("Error fetching profile gallery feed:", error);
    res.status(500).json({ message: "Failed to load profile gallery feed" });
  }
};



exports.getStoryFeed = async (req, res) => {
  const currentUserId = req.user.id; // your auth setup

  try {
    const [rows] = await db.execute(
      `
        SELECT 
        wg.id AS story_id,
        wg.media_url,
        wg.media_type,
        wg.created_at,
        wg.woo_id,
        w.media_url AS woo_media_url,
        w.owner_uid AS woo_owner_id,
        owner.username AS woo_owner_username,
        owner.profile_pic_url AS woo_owner_avatar,

        poster.id AS story_user_id,
        poster.username AS story_user_username,
        poster.profile_pic_url AS story_user_avatar,

        wgv.viewer_id IS NOT NULL AS seen

        FROM woo_gallery wg
        JOIN woos w ON wg.woo_id = w.id
        JOIN users poster ON wg.user_id = poster.id
        JOIN users owner ON w.owner_uid = owner.id
        LEFT JOIN woo_gallery_views wgv 
        ON wg.id = wgv.gallery_id AND wgv.viewer_id = ?

        WHERE (
        (w.type = 'private' AND EXISTS (
            SELECT 1 FROM migos m
            WHERE m.woo_id = w.id AND m.user_id = ?
        ))
        OR
        (w.type = 'public' AND EXISTS (
            SELECT 1 FROM followers f
            WHERE f.follower_id = ? AND f.followee_id = w.owner_uid
        ))
        )
        AND wg.expires_at > NOW()
        ORDER BY wg.woo_id, wg.created_at DESC
      `,
      [currentUserId, currentUserId, currentUserId]
    );

    // Group stories by woo_id
    const feedMap = {};
    for (const row of rows) {
      if (!feedMap[row.woo_id]) {
        feedMap[row.woo_id] = {
          woo_id: row.woo_id,
          woo_media_url: row.woo_media_url,
          woo_owner: {
            id: row.woo_owner_id,
            username: row.woo_owner_username,
            avatar: row.woo_owner_avatar,
          },
          unseen: false,
          stories: [],
        };
      }

      feedMap[row.woo_id].stories.push({
        id: row.story_id,
        media_url: row.media_url,
        media_type: row.media_type,
        created_at: row.created_at,
        seen: !!row.seen,
        user: {
          id: row.story_user_id,
          username: row.story_user_username,
          avatar: row.story_user_avatar,
        },
      });

      if (!row.seen) {
        feedMap[row.woo_id].unseen = true;
      }
    }

    // Sort stories inside each group: unseen first, then by created_at DESC
    Object.values(feedMap).forEach(group => {
      group.stories.sort((a, b) => {
        if (!a.seen && b.seen) return -1;
        if (a.seen && !b.seen) return 1;
        return new Date(b.created_at) - new Date(a.created_at);
      });
    });

    // Sort groups: unseen groups first, then by latest story created_at DESC
    const sortedGroups = Object.values(feedMap).sort((a, b) => {
      if (a.unseen && !b.unseen) return -1;
      if (!a.unseen && b.unseen) return 1;

      const aLatest = new Date(a.stories[0]?.created_at || 0);
      const bLatest = new Date(b.stories[0]?.created_at || 0);
      return bLatest - aLatest;
    });

    res.json(sortedGroups);
  } catch (error) {
    console.error("Error fetching story feed:", error);
    res.status(500).json({ message: "Failed to load story feed" });
  }
};

exports.getCombinedStoryFeed = async (req, res) => {
  const currentUserId = req.user.id;

  try {
    // 1) Event stories
    const [eventStories] = await db.execute(
      `SELECT 
         wg.id AS story_id,
         wg.media_url,
         wg.media_type,
         wg.created_at,
         wg.woo_id,
         w.media_url AS woo_media_url,
         w.owner_uid AS woo_owner_id,
         owner.username AS woo_owner_username,
         owner.profile_pic_url AS woo_owner_avatar,
         poster.id AS story_user_id,
         poster.username AS story_user_username,
         poster.profile_pic_url AS story_user_avatar,
         wgv.viewer_id IS NOT NULL AS seen
       FROM woo_gallery wg
       JOIN woos w ON wg.woo_id = w.id
       JOIN users poster ON wg.user_id = poster.id
       JOIN users owner ON w.owner_uid = owner.id
       LEFT JOIN woo_gallery_views wgv ON wg.id = wgv.gallery_id AND wgv.viewer_id = ?
       WHERE ((w.type = 'private' AND EXISTS (
         SELECT 1 FROM migos m WHERE m.woo_id = w.id AND m.user_id = ?
       )) OR (w.type = 'public' AND EXISTS (
         SELECT 1 FROM followers f WHERE f.follower_id = ? AND f.followee_id = w.owner_uid
       ))) AND wg.expires_at > NOW()`,
      [currentUserId, currentUserId, currentUserId]
    );

    // 2) User stories
    const [userStories] = await db.execute(
      `SELECT 
         s.id AS story_id,
         s.media_url,
         s.media_type,
         s.created_at,
         s.expires_at,
         u.id AS story_user_id,
         u.username AS story_user_username,
         u.profile_pic_url AS story_user_avatar,
         sv.viewer_id IS NOT NULL AS seen
       FROM stories s
       JOIN users u ON s.user_id = u.id
       LEFT JOIN story_views sv ON s.id = sv.story_id AND sv.viewer_id = ?
       WHERE s.user_id IN (
         SELECT followee_id FROM followers WHERE follower_id = ?
       )
       AND s.expires_at > NOW()`,
      [currentUserId, currentUserId]
    );

    // 3) Merge stories
    const combinedStories = [...eventStories, ...userStories].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    // 4) Group stories by woo_id or user story owner
    const feedMap = {};

    for (const story of combinedStories) {
      const groupKey = story.woo_id || `user_${story.story_user_id}`;

      if (!feedMap[groupKey]) {
        feedMap[groupKey] = {
          id: groupKey,
          woo_id: story.woo_id || null,
          woo_media_url: story.woo_media_url || null,
          woo_owner: story.woo_owner_id
            ? {
                id: story.woo_owner_id,
                username: story.woo_owner_username,
                avatar: story.woo_owner_avatar,
              }
            : null,
          user_story_owner: !story.woo_id
            ? {
                id: story.story_user_id,
                username: story.story_user_username,
                avatar: story.story_user_avatar,
              }
            : null,
          unseen: false,
          stories: [],
        };
      }

      feedMap[groupKey].stories.push({
        id: story.story_id,
        media_url: story.media_url,
        media_type: story.media_type,
        created_at: story.created_at,
        seen: !!story.seen,
        user: {
          id: story.story_user_id,
          username: story.story_user_username,
          avatar: story.story_user_avatar,
        },
      });

      if (!story.seen) feedMap[groupKey].unseen = true;
    }

    // Sort stories inside each group: unseen first, then by created_at DESC
    Object.values(feedMap).forEach(group => {
      group.stories.sort((a, b) => {
        if (!a.seen && b.seen) return -1;
        if (a.seen && !b.seen) return 1;
        return new Date(b.created_at) - new Date(a.created_at);
      });
    });

    // Sort groups: unseen groups first, then by latest story created_at DESC
    const sortedGroups = Object.values(feedMap).sort((a, b) => {
      if (a.unseen && !b.unseen) return -1;
      if (!a.unseen && b.unseen) return 1;

      const aLatest = new Date(a.stories[0]?.created_at || 0);
      const bLatest = new Date(b.stories[0]?.created_at || 0);
      return bLatest - aLatest;
    });

    res.json(sortedGroups);
  } catch (error) {
    console.error("Error fetching combined story feed:", error);
    res.status(500).json({ message: "Failed to load combined story feed" });
  }
};



// exports.markStorySeen = async (req, res) => {
//     const userId = req.user.id;
//     const storyId = req.params.storyId;
  
//     try {
//       await db.execute(
//         `INSERT IGNORE INTO woo_gallery_views (gallery_id, viewer_id) VALUES (?, ?)`,
//         [storyId, userId]
//       );
//       res.sendStatus(204);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: "Failed to mark as seen" });
//     }
//   };

  exports.markStorySeen = async (req, res) => {
    const userId = req.user.id;
    const storyId = req.params.storyId;
    const { type } = req.query; // 'event' or 'user'
  
    let table, idColumn;
  
    if (type === "event") {
      table = "woo_gallery_views";
      idColumn = "gallery_id";
    } else if (type === "user") {
      table = "story_views";
      idColumn = "story_id";
    } else {
      return res.status(400).json({ message: "Invalid story type" });
    }
  
    try {
      await db.execute(
        `INSERT IGNORE INTO ${table} (${idColumn}, viewer_id) VALUES (?, ?)`,
        [storyId, userId]
      );
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to mark story as seen" });
    }
  };
  
  
  
