const express = require("express");
const router = express.Router();
const migoController = require("../controllers/migoController");
const authenticateToken = require("../../middleware/authMiddleware");

router.get('/', authenticateToken, migoController.getMyPrivateWoos);


module.exports = router;