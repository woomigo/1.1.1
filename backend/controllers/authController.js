// controllers/authController.js
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = "supersecretkey"; // 🔐 You’ll want to use an env variable later

// authController.js
exports.getMe = async (req, res) => {
  const userId = req.user.id;

  try {
    const [results] = await db.query(
      `SELECT uuid, email, first_name, last_name, dob, profile_pic_url, username, is_profile_complete
       FROM users
       WHERE uuid = ?`,
      [userId]
    );

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const { uuid, ...rest } = results[0];

    res.json({
      id: uuid,
      ...rest,
    });
  } catch (err) {
    console.error("DB error in getMe:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.register = async (req, res) => {
  const { email, password, isProfileComplete } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user already exists
    const [existingUsers] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ error: "Email is already registered" });
    }

    // Insert new user
    const [result] = await db.query(
      "INSERT INTO users (email, password, is_profile_complete) VALUES (?, ?, ?)",
      [email, hashedPassword, isProfileComplete]
    );

    const [userRows] = await db.query("SELECT uuid FROM users WHERE id = ?", [result.insertId]);
    const userUUID = userRows[0]?.uuid;

    const token = jwt.sign({ id: userUUID, email }, SECRET);
    res.json({ message: "User registered", token });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Error registering user" });
  }
};



exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ error: "Email and new password are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const [result] = await db.query(
      "UPDATE users SET password = ? WHERE email = ?",
      [hashedPassword, email]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  console.log("Login attempt with email:", req.body.email);

  const { email, password } = req.body;

  try {
    // ✅ Await instead of callback
    const [results] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (results.length === 0) {
      console.log("No user found for email:", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = results[0];
    console.log("User found:", user.email);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.uuid, email: user.email }, SECRET);
    console.log("Token created");

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
