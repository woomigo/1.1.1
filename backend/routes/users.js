// routes/users.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateToken = require("../../middleware/authMiddleware");

// Create user
router.post("/", userController.createUser);

// Read all users
router.get("/", authenticateToken, userController.getAllUsers);

// Check if a username is available
router.get('/check-username', userController.checkUsernameAvailability);

// Get user by username
router.get('/search', authenticateToken, userController.getUserByUsername);

// Read one user
router.get("/:id", authenticateToken, userController.getUserById);

router.post('/batch', authenticateToken, userController.getUsersByIds);

router.post('/update-location', authenticateToken, userController.updateUserLocation);

router.put('/complete-profile', authenticateToken, userController.completeProfile);

router.post('/password-reset', async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ error: "Token and new password required" });

  try {
    const decoded = jwt.verify(token, RESET_SECRET);
    const userId = decoded.id;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, userId]);

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid or expired token" });
  }
});

router.put("/password-reset", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: "Both old and new passwords are required" });
  }

  try {
    await userController.updatePassword(userId, oldPassword, newPassword);
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message || "Password update failed" });
  }
});



router.put("/modify", authenticateToken, async (req, res) => {
  const { id } = req.params;
  // Ensure the logged-in user is updating their own profile
  if (req.user.id !== id) {
    return res.status(403).json({ error: "You can only update your own profile" });
  }

  try {
    await userController.updateUser(req.user.id, req.body);
    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message || "Update failed" });
  }
});

// Delete user - protected and checks ownership
router.delete("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  // Ensure the logged-in user is updating their own profile
  if (req.user.id !== id) {
    return res.status(403).json({ error: "You can only update your own profile" });
  }

  userController.deleteUser(id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "User deleted" });
  });
});

module.exports = router;