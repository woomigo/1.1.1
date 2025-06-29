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
exports.getAllUsers = (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
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
exports.getUserById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0)
      return res.status(404).json({ message: "User not found" });
    res.json(results[0]);
  });
};

// Update user
// exports.updateUser = async (req, res) => {
//     console.log('req.params:', req.params);
//     console.log('req.params:', req.body);

//     const { id } = req.params;
//     let fields = { ...req.body };

//     // Handle password separately
//     if (fields.password) {
//       try {
//         fields.password = bcrypt.hashSync(fields.password, 10);
//       } catch (err) {
//         console.error('Password hashing failed:', err);
//         return res.status(500).json({ error: 'Internal error while hashing password' });
//       }
//     }

//     // If no fields to update, exit early
//     if (Object.keys(fields).length === 0) {
//       return res.status(400).json({ error: 'No fields provided for update' });
//     }

//     // Build dynamic SQL query
//     const setClause = Object.keys(fields)
//       .map((field) => `${field} = ?`)
//       .join(', ');
//     const values = Object.values(fields);
//     values.push(id); // Add user ID for WHERE clause

//     const query = `UPDATE users SET ${setClause} WHERE id = ?`;

//     db.query(query, values, (err, result) => {
//       if (err) {
//         console.error('Error updating user:', err);
//         return res.status(500).json({ error: err });
//       }

//       res.json({ message: 'User updated successfully' });
//     });
//   };
exports.completeProfile = (userId, updatedData, callback) => {
  console.log("UPDATED DATA: " + JSON.stringify(updatedData));
  const {
    is_profile_complete,
    first_name,
    last_name,
    dob,
    username,
    profile_pic_url,
  } = updatedData;
  db.query(
    "UPDATE users SET is_profile_complete = ?, first_name = ?, last_name = ?, dob=?, username = ?, profile_pic_url = ? WHERE id = ?",
    [
      is_profile_complete,
      first_name,
      last_name,
      dob,
      username,
      profile_pic_url,
      userId,
    ], // If no password, pass null
    (err, result) => {
      if (err) return callback(err);
      callback(null);
    }
  );
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Ensure the logged-in user is updating their own profile
  if (req.user.id !== parseInt(id)) {
    return res
      .status(403)
      .json({ error: "You can only update your own profile" });
  }

  // Fields to ignore in the update
  const fieldsToIgnore = ["password", "updated_at"];

  // Filter out fields we don't want to update
  const filteredUpdates = Object.keys(updates)
    .filter((field) => !fieldsToIgnore.includes(field))
    .reduce((obj, key) => {
      obj[key] = updates[key];
      return obj;
    }, {});

  // Dynamically create the SET clause for the SQL query
  const fields = Object.keys(filteredUpdates)
    .map((k) => `${k} = ?`)
    .join(", ");
  const values = Object.values(filteredUpdates);

  // Execute the query
  await db.query(`UPDATE users SET ${fields} WHERE id = ?`, [...values, id]);
  res.json({ message: "User updated" });
};

exports.updateUser = (userId, updatedData, callback) => {
  const fields = [];
  const values = [];

  if (updatedData.email) {
    fields.push("email = ?");
    values.push(updatedData.email);
  }

  if (updatedData.password) {
    const hashedPassword = bcrypt.hashSync(updatedData.password, 10);
    fields.push("password = ?");
    values.push(hashedPassword);
  }

  if (updatedData.isProfileComplete !== undefined) {
    fields.push("is_profile_complete = ?");
    values.push(updatedData.isProfileComplete);
  }

  if (updatedData.firstName) {
    fields.push("first_name = ?");
    values.push(updatedData.firstName);
  }

  if (updatedData.lastName) {
    fields.push("last_name = ?");
    values.push(updatedData.lastName);
  }

  if (updatedData.username) {
    fields.push("username = ?");
    values.push(updatedData.username);
  }

  if (updatedData.profilePicture) {
    fields.push("profile_pic_url = ?");
    values.push(updatedData.profilePicture);
  }

  if (fields.length === 0) {
    return callback(new Error("No valid fields provided for update"));
  }

  const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
  values.push(userId);

  db.query(sql, values, (err, result) => {
    if (err) return callback(err);
    callback(null);
  });
};

// Delete user
exports.deleteUser = (userId, callback) => {
  db.query("DELETE FROM users WHERE id = ?", [userId], (err, result) => {
    if (err) return callback(err);
    callback(null);
  });
};


// Controller 2
exports.getUserFollowCounts = async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required in the URL." });
  }
  try {
    // 1. Get user's basic info
    const [userResult] = await db.query(
      `SELECT id, username, first_name, last_name, profile_pic_url FROM users WHERE id = ?`,
      [userId]
    );
    if (userResult.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = userResult[0];

    // 2. Get follower and followee counts
    const [[counts]] = await db.query(
      `SELECT 
         (SELECT COUNT(*) FROM followers WHERE followee_id = ?) AS follower_count,
         (SELECT COUNT(*) FROM followers WHERE follower_id = ?) AS followee_count`,
      [userId, userId]
    );

    res.json({
      user,
      follower_count: counts.follower_count,
      followee_count: counts.followee_count
    });
  } catch (err) {
    console.error("Error fetching follow counts:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Controller 1
exports.getUserWithFollowersAndFollowingInfo = async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required in the URL." });
  }
  try {
    // 1. Get user's basic info
    const [userResult] = await db.query(
      `SELECT id, username, first_name, last_name, profile_pic_url FROM users WHERE id = ?`,
      [userId]
    );
    if (userResult.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = userResult[0];

    // 2. Get followers (users who follow this user)
    const [followers] = await db.query(
      `SELECT u.id, u.username, u.first_name, u.last_name, u.profile_pic_url
       FROM followers f
       JOIN users u ON f.follower_id = u.id
       WHERE f.followee_id = ?`,
      [userId]
    );

    // 3. Get followees (users this user is following)
    const [followees] = await db.query(
      `SELECT u.id, u.username, u.first_name, u.last_name, u.profile_pic_url
       FROM followers f
       JOIN users u ON f.followee_id = u.id
       WHERE f.follower_id = ?`,
      [userId]
    );

    res.json({
      user,
      followers,
      followees
    });
  } catch (err) {
    console.error("Error fetching user + follow info:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
