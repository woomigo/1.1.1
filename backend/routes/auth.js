// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require("../../middleware/authMiddleware");

router.get('/me', authenticateToken, authController.getMe);
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
