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

// Read one user
router.get("/:id", authenticateToken, userController.getUserById);

// Update user - protected and checks ownership
router.put("/:id", authenticateToken, userController.updateUser);

// Update user - protected and checks ownership
router.put("/more-info/:id", authenticateToken, (req, res) => {
    const { id } = req.params;
    // Ensure the logged-in user is updating their own profile
    if (req.user.id !== parseInt(id)) {
      return res.status(403).json({ error: "You can only update your own profile" });
    }
  
    userController.completeProfile(id, req.body, (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "User updated" });
    });
  });

// Delete user - protected and checks ownership
router.delete("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  // Ensure the logged-in user is deleting their own profile
  if (req.user.id !== parseInt(id)) {
    return res.status(403).json({ error: "You can only delete your own profile" });
  }

  userController.deleteUser(id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "User deleted" });
  });
});

module.exports = router;
