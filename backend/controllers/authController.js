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
      `SELECT id, email, first_name, last_name, dob, profile_pic_url, username, is_profile_complete
       FROM users
       WHERE id = ?`,
      [userId]
    );

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(results[0]);
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

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (email, password, is_profile_complete) VALUES (?, ?, ?)",
    [email, hashedPassword, isProfileComplete],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error registering user" });
      }

      // Automatically login after registration
      const token = jwt.sign({ id: result.insertId, email: email }, SECRET, {
        expiresIn: "1h",
      });

      // Return the token to the client
      res.json({ message: "User registered", token: token });
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0)
        return res.status(401).json({ error: "Invalid credentials" });

      const user = results[0];
      try {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ error: "Invalid credentials" });
        }
      } catch (compareErr) {
        return res.status(500).json({ error: "Internal server error" });
      }
      

      const token = jwt.sign({ id: user.id, email: user.email }, SECRET, {
        // expiresIn: "1h",
      });

      res.json({ message: "Login successful", token });
    }
  );
};
