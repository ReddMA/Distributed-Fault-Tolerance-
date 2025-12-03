const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({
      error: 'Access denied. No token provided.'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request object
    req.user = decoded;

    // Continue to next middleware/route handler
    next();
  } catch (error) {
    return res.status(403).json({
      error: 'Invalid or expired token.'
    });
  }
};

// Middleware to check if user is faculty
const requireFaculty = (req, res, next) => {
  if (req.user.role !== 'faculty') {
    return res.status(403).json({
      error: 'Access denied. Faculty role required.'
    });
  }
  next();
};

// Middleware to check if user is student
const requireStudent = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({
      error: 'Access denied. Student role required.'
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireFaculty,
  requireStudent
};
