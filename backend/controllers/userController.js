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
    "SELECT id FROM users WHERE username = ?",
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
    const [results] = await db.query(`SELECT * FROM users WHERE id = ?`, [id]);

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(results[0]);
  } catch (err) {
    console.error("Database error:", err);
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
      "SELECT id AS user_id, username, email, first_name, last_name, profile_pic_url, dob, is_profile_complete, created_at, updated_at, is_private, latitude, longitude FROM users WHERE username LIKE ?",
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




// Update user
exports.updateUser = async (req, res) => {
  console.log("req.params:", req.params);
  console.log("req.params:", req.body);

  const { id } = req.params;
  let fields = { ...req.body };

  // Handle password separately
  if (fields.password) {
    try {
      fields.password = bcrypt.hashSync(fields.password, 10);
    } catch (err) {
      console.error("Password hashing failed:", err);
      return res
        .status(500)
        .json({ error: "Internal error while hashing password" });
    }
  }

  // If no fields to update, exit early
  if (Object.keys(fields).length === 0) {
    return res.status(400).json({ error: "No fields provided for update" });
  }

  // Build dynamic SQL query
  const setClause = Object.keys(fields)
    .map((field) => `${field} = ?`)
    .join(", ");
  const values = Object.values(fields);
  values.push(id); // Add user ID for WHERE clause

  const query = `UPDATE users SET ${setClause} WHERE id = ?`;

  console.log("Updating user with fields:", fields);

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error updating user:", err);
      return res.status(500).json({ error: err });
    }

    res.json({ message: "User updated successfully" });
  });
};

exports.updateUserLocation = async (req, res) => {
  const { userId, latitude, longitude } = req.body;

  if (!userId || !latitude || !longitude) {
    return res.status(400).json({ error: "Missing data" });
  }

  try {
    await db.execute(
      `UPDATE users SET latitude = ?, longitude = ? WHERE id = ?`,
      [latitude, longitude, userId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// exports.completeProfile = (userId, updatedData, callback) => {
//   console.log("UPDATED DATA: " + JSON.stringify(updatedData));
//   const {
//     is_profile_complete,
//     first_name,
//     last_name,
//     dob,
//     username,
//     profile_pic_url,
//   } = updatedData;
//   db.query(
//     "UPDATE users SET is_profile_complete = ?, first_name = ?, last_name = ?, dob=?, username = ?, profile_pic_url = ? WHERE id = ?",
//     [
//       is_profile_complete,
//       first_name,
//       last_name,
//       dob,
//       username,
//       profile_pic_url,
//       userId,
//     ], // If no password, pass null
//     (err, result) => {
//       if (err) return callback(err);
//       callback(null);
//     }
//   );
// };

// exports.updateUser = async (req, res) => {
//   const { id } = req.params;
//   const updates = req.body;

//   // Ensure the logged-in user is updating their own profile
//   if (req.user.id !== parseInt(id)) {
//     return res
//       .status(403)
//       .json({ error: "You can only update your own profile" });
//   }

//   // Fields to ignore in the update
//   const fieldsToIgnore = ["password", "updated_at"];

//   // Filter out fields we don't want to update
//   const filteredUpdates = Object.keys(updates)
//     .filter((field) => !fieldsToIgnore.includes(field))
//     .reduce((obj, key) => {
//       obj[key] = updates[key];
//       return obj;
//     }, {});

//   // Dynamically create the SET clause for the SQL query
//   const fields = Object.keys(filteredUpdates)
//     .map((k) => `${k} = ?`)
//     .join(", ");
//   const values = Object.values(filteredUpdates);

//   // Execute the query
//   await db.query(`UPDATE users SET ${fields} WHERE id = ?`, [...values, id]);
//   res.json({ message: "User updated" });
// };

// exports.updateUser = (userId, updatedData, callback) => {
//   const fields = [];
//   const values = [];

//   if (updatedData.email) {
//     fields.push("email = ?");
//     values.push(updatedData.email);
//   }

//   if (updatedData.password) {
//     const hashedPassword = bcrypt.hashSync(updatedData.password, 10);
//     fields.push("password = ?");
//     values.push(hashedPassword);
//   }

//   if (updatedData.isProfileComplete !== undefined) {
//     fields.push("is_profile_complete = ?");
//     values.push(updatedData.isProfileComplete);
//   }

//   if (updatedData.firstName) {
//     fields.push("first_name = ?");
//     values.push(updatedData.firstName);
//   }

//   if (updatedData.lastName) {
//     fields.push("last_name = ?");
//     values.push(updatedData.lastName);
//   }

//   if (updatedData.username) {
//     fields.push("username = ?");
//     values.push(updatedData.username);
//   }

//   if (updatedData.profilePicture) {
//     fields.push("profile_pic_url = ?");
//     values.push(updatedData.profilePicture);
//   }

//   if (fields.length === 0) {
//     return callback(new Error("No valid fields provided for update"));
//   }

//   const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
//   values.push(userId);

//   db.query(sql, values, (err, result) => {
//     if (err) return callback(err);
//     callback(null);
//   });
// };

// Delete user
exports.deleteUser = (userId, callback) => {
  db.query("DELETE FROM users WHERE id = ?", [userId], (err, result) => {
    if (err) return callback(err);
    callback(null);
  });
};
