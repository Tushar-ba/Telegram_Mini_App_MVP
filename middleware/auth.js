const jwt = require('jsonwebtoken');
const { User } = require('../models/miniApp');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists in database
    const user = await User.findOne({ userId: decoded.userId });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Add user info to request object
    req.user = {
      userId: decoded.userId,
      walletAddress: user.walletAddress
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }

    return res.status(500).json({ 
      success: false, 
      message: 'Server error during authentication' 
    });
  }
};

// Optional middleware for routes that can work with or without authentication
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ userId: decoded.userId });
      
      if (user) {
        req.user = {
          userId: decoded.userId,
          walletAddress: user.walletAddress
        };
      }
    }
    
    next();
  } catch (error) {
    // For optional auth, we don't return error, just continue without user
    next();
  }
};

module.exports = {
  authenticateToken,
  optionalAuth
}; 