// controllers/userController.js
const { update } = require("lodash");
const db = require("../db");
const bcrypt = require("bcrypt");

// Create user
exports.createUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    db.query(
      "INSERT INTO users ( email, password) VALUES (?, ?)",
      [email, hashedPassword], // Store the hashed password
      (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "User created", userId: result.insertId });
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Error hashing password" });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM users");
    res.json(results);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get username availability
exports.checkUsernameAvailability = (req, res) => {
  const { username } = req.query;

  if (!username || typeof username !== "string") {
    return res
      .status(400)
      .json({ available: false, error: "Username is required" });
  }

  db.query(
    "SELECT uuid FROM users WHERE username = ?",
    [username],
    (err, results) => {
      if (err) {
        console.error("Database error checking username:", err);
        return res
          .status(500)
          .json({ available: false, error: "Internal server error" });
      }

      res.json({ available: results.length === 0 });
    }
  );
};

// Get user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const [results] = await db.query(`SELECT * FROM users WHERE uuid = ?`, [id]);

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(results[0]);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getUsersByIds = async (req, res) => {
  const { userIds } = req.body;

  if (!Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({ error: "userIds must be a non-empty array." });
  }

  try {
    // Create a dynamic placeholder list (?, ?, ?, ...)
    const placeholders = userIds.map(() => '?').join(', ');

    const query = `
      SELECT uuid AS user_id, username, email, first_name, last_name, profile_pic_url, dob, is_profile_complete, created_at, updated_at, is_private, latitude, longitude
      FROM users
      WHERE uuid IN (${placeholders})
    `;

    const [results] = await db.query(query, userIds);

    res.json(results);
  } catch (err) {
    console.error("Error fetching users by IDs:", err);
    res.status(500).json({ error: "Server error" });
  }
};


// Get user by username
exports.getUserByUsername = async (req, res) => {
  let { username } = req.query;

  if (!username || typeof username !== "string") {
    return res.status(400).json({ error: "Username query is required" });
  }

  // Clean the username input
  username = username.trim().replace(/\s+/g, "");

  const searchTerm = `%${username}%`;

  console.log("Cleaned Search term:", JSON.stringify(searchTerm));

  try {
    const [results] = await db.query(
      "SELECT uuid AS user_id, username, email, first_name, last_name, profile_pic_url, dob, is_profile_complete, created_at, updated_at, is_private, latitude, longitude FROM users WHERE username LIKE ?",
      [searchTerm]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.json(results);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateUserLocation = async (req, res) => {
  const { userId, latitude, longitude } = req.body;

  if (!userId || !latitude || !longitude) {
    return res.status(400).json({ error: "Missing data" });
  }

  try {
    await db.execute(
      `UPDATE users SET latitude = ?, longitude = ? WHERE uuid = ?`,
      [latitude, longitude, userId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.completeProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      is_profile_complete,
      first_name,
      last_name,
      dob,
      username,
      profile_pic_url,
    } = req.body;

    console.log("Received profile update:", {
      userId,
      is_profile_complete,
      first_name,
      last_name,
      dob,
      username,
      profile_pic_url,
    });

    // Validate required fields
    if (
      is_profile_complete === undefined ||
      !first_name ||
      !last_name ||
      !dob ||
      !username
    ) {
      throw new Error("Missing required profile fields.");
    }

    const query = `
      UPDATE users SET
        is_profile_complete = ?,
        first_name = ?,
        last_name = ?,
        dob = ?,
        username = ?,
        profile_pic_url = ?
      WHERE uuid = ?
    `;

    const [result] = await db.query(query, [
      is_profile_complete,
      first_name,
      last_name,
      dob,
      username,
      profile_pic_url || null,
      userId,
    ]);

    res.status(200).json({ message: "Profile updated successfully", result });
  } catch (err) {
    console.error("Error in completeProfile:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.updatePassword = async (userId, oldPassword, newPassword) => {
  // 1. Fetch the current hashed password from DB
  const [rows] = await db.query("SELECT password FROM users WHERE id = ?", [userId]);
  if (rows.length === 0) {
    throw new Error("User not found");
  }

  const currentHashedPassword = rows[0].password;

  // 2. Verify old password matches
  const isMatch = await bcrypt.compare(oldPassword, currentHashedPassword);
  if (!isMatch) {
    throw new Error("Old password is incorrect");
  }

  // 3. Hash new password
  const newHashedPassword = await bcrypt.hash(newPassword, 10);

  // 4. Update password in DB
  await db.query("UPDATE users SET password = ? WHERE id = ?", [newHashedPassword, userId]);

  return true; // success
};


exports.updateUser = async (userId, updatedFields) => {
  // Filter out password if it's in the request
  const filteredFields = { ...updatedFields };
  delete filteredFields.password;

  if (Object.keys(filteredFields).length === 0) {
    throw new Error("No valid fields provided to update");
  }

  // Optional: whitelist allowed fields to avoid accidental updates
  const allowedFields = ['username', 'first_name', 'last_name', 'dob', 'profile_pic_url', 'email', 'is_profile_complete'];
  const fieldsToUpdate = {};

  for (const key of Object.keys(filteredFields)) {
    if (allowedFields.includes(key)) {
      fieldsToUpdate[key] = filteredFields[key];
    }
  }

  if (Object.keys(fieldsToUpdate).length === 0) {
    throw new Error("No allowed fields provided to update");
  }

  // Build dynamic query parts
  const columns = [];
  const values = [];

  for (const [key, value] of Object.entries(fieldsToUpdate)) {
    columns.push(`${key} = ?`);
    values.push(value);
  }

  const sql = `UPDATE users SET ${columns.join(", ")} WHERE id = ?`;
  values.push(userId);

  try {
    const [result] = await db.query(sql, values);
    return result;
  } catch (err) {
    throw err;
  }
};


// Delete user
exports.deleteUser = (userId, callback) => {
  db.query("DELETE FROM users WHERE id = ?", [userId], (err, result) => {
    if (err) return callback(err);
    callback(null);
  });
};
