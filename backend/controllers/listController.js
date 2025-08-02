const db = require("../db");

// Create a list for a Woo
exports.createWooList = async (req, res) => {
  const { woo_id, title, max_items } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO woo_lists (woo_id, title, max_items) VALUES (?, ?, ?)",
      [woo_id, title, max_items]
    );

    res.status(201).json({ id: result.insertId, woo_id, title, max_items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add item to list
exports.addItemToWoo = async (req, res) => {
    const { woo_id, name, media_url, max_quantity } = req.body;
  
    try {
      const [result] = await db.query(
        'INSERT INTO woo_list_items (woo_id, name, media_url, max_quantity) VALUES (?, ?, ?, ?)',
        [woo_id, name, media_url, max_quantity]
      );
  
      res.status(201).json({ id: result.insertId, woo_id, name, media_url, max_quantity });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

// Claim an item
exports.claimItem = async (req, res) => {
  const userId = req.user.id;
  const { itemId } = req.params;
  const { quantity } = req.body;

  try {
    // Get current total claimed
    const [[{ total_claimed = 0 }]] = await db.query(
      "SELECT SUM(quantity) AS total_claimed FROM woo_list_item_claims WHERE item_id = ?",
      [itemId]
    );

    const [[item]] = await db.query(
      "SELECT max_quantity FROM woo_list_items WHERE id = ?",
      [itemId]
    );

    if (!item) return res.status(404).json({ error: "Item not found." });

    if (total_claimed + quantity > item.max_quantity) {
      return res
        .status(400)
        .json({ error: "Claim exceeds available quantity." });
    }

    // Upsert claim
    await db.query(
      `
        INSERT INTO woo_list_item_claims (item_id, user_id, quantity)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
      `,
      [itemId, userId, quantity]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Claim error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Unclaim an item
exports.unclaimItem = async (req, res) => {
  const userId = req.user.id;
  const { itemId } = req.params;
  const { quantity } = req.body;

  try {
    // Fetch current claim
    const [[claim]] = await db.query(
      "SELECT quantity FROM woo_list_item_claims WHERE item_id = ? AND user_id = ?",
      [itemId, userId]
    );

    if (!claim) return res.status(404).json({ error: "No claim found." });

    if (quantity >= claim.quantity) {
      // Remove the claim entirely
      await db.query(
        "DELETE FROM woo_list_item_claims WHERE item_id = ? AND user_id = ?",
        [itemId, userId]
      );
    } else {
      // Reduce quantity
      await db.query(
        "UPDATE woo_list_item_claims SET quantity = quantity - ? WHERE item_id = ? AND user_id = ?",
        [quantity, itemId, userId]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Unclaim error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get full list with claimed status
exports.getWooList = async (req, res) => {
  const wooId = req.params.wooId;

  try {
    const [items] = await db.query(
      "SELECT * FROM woo_list_items WHERE woo_id = ?",
      [wooId]
    );

    if (items.length === 0) {
      return res.json({ items: [], claims: [] }); // No items, empty list
    }

    const [claims] = await db.query(
      `
            SELECT c.item_id, c.user_id, c.quantity, u.first_name, u.last_name, u.username, u.profile_pic_url
            FROM woo_list_item_claims c
            JOIN users u ON c.user_id = u.id
            WHERE c.item_id IN (?)
          `,
      [items.map((i) => i.id)]
    );

    const claimMap = {};
    claims.forEach((c) => {
      if (!claimMap[c.item_id]) claimMap[c.item_id] = [];
      claimMap[c.item_id].push({
        user_id: c.user_id,
        quantity: c.quantity,
        first_name: c.first_name,
        last_name: c.last_name,
        username: c.username,
        profile_pic_url: c.profile_pic_url,
      });
    });

    const enrichedItems = items.map((item) => ({
      ...item,
      claims: claimMap[item.id] || [],
    }));

    res.json({ items: enrichedItems });
  } catch (err) {
    console.error("List fetch error:", err);
    res.status(500).json({ error: err.message });
  }
};
