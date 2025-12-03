const jwt = require('jsonwebtoken');
require('dotenv').config();

// Mock user database (for development only)
// In production, this would query a real user database
const MOCK_USERS = [
  {
    id: 1,
    email: 'student@test.com',
    password: 'student123',
    name: 'John Student',
    role: 'student'
  },
  {
    id: 2,
    email: 'faculty@test.com',
    password: 'faculty123',
    name: 'Dr. Jane Faculty',
    role: 'faculty'
  }
];

/**
 * Login function - authenticates user and returns JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    // Find user by email
    const user = MOCK_USERS.find(u => u.email === email);

    // Validate credentials
    if (!user || user.password !== password) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Prepare user data (without password)
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    // Return token and user data
    res.json({
      token,
      user: userData
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      error: 'Login failed',
      message: error.message
    });
  }
};

module.exports = {
  login
};
