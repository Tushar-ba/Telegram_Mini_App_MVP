const { User } = require('../../models/miniApp');

const getStars = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findOne({ userId });
    if(!user) return res.status(404).json({ error: 'User not found' });
    return res.status(200).json({
        message: user.stars
    })
  } catch (error) {
    console.error('Error in getStars:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { getStars };