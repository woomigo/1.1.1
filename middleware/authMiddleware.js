// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const secret = 'supersecretkey'; // Ideally from environment variables

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expecting "Bearer TOKEN"

  console.log("Received token:", token);

  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    console.log("Decoded JWT payload:", user); // <--- Add this
    req.user = user; // Add user payload to request
    next();
  });
};

module.exports = authenticateToken;
