const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');

// Woo gallery
router.get('/woo/:woo_id', galleryController.getWooGallery);

// User gallery
router.get('/user/:user_id', galleryController.getUserGallery);

module.exports = router;