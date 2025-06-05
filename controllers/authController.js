const jwt = require('jsonwebtoken');
const { User } = require('../models/miniApp');

// Login or Register user based on Telegram userId
exports.login = async (req, res) => {
  try {
    const { userId, walletAddress, avatar } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Find the user or create a new one
    let user = await User.findOne({ userId });
    
    if (!user) {
      // Create new user if not found
      user = new User({
        userId,
        walletAddress: walletAddress || '',
        avatar: avatar || 'https://i.ibb.co/1900x1900/1.png',
        signupTime: new Date()
      });
      await user.save();
    } else {
      // Update wallet address if provided
      if (walletAddress && user.walletAddress !== walletAddress) {
        user.walletAddress = walletAddress;
        await user.save();
      }
      
      // Update last login time
      user.lastLogin = new Date();
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          userId: user.userId,
          walletAddress: user.walletAddress,
          goldCoins: user.goldCoins,
          stars: user.stars,
          apraTokens: user.apraTokens,
          level: user.level,
          energy: user.energy,
          avatar: user.avatar
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};
