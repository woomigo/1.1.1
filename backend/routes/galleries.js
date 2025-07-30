const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const authenticateToken = require('../../middleware/authMiddleware');

// Woo gallery
router.get('/woo/:woo_id', authenticateToken, galleryController.getWooGallery);

// Woo Gallery With User Info
router.get("/woo/:wooId/user", authenticateToken, galleryController.getWooGalleryUserInfoByWooId);


// User gallery
router.get('/user/:user_id', authenticateToken, galleryController.getUserGallery);

module.exports = router;