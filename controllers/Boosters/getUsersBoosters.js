const { User } = require('../../models/miniApp');

const getUserBoosters = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user
    const user = await User.findOne({ userId }).select('boosters');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Format boosters data
    const boosters = user.boosters.map(booster => ({
      boosterId: booster.id,
      type: booster.type,
      level: booster.level,
      boostRate: booster.boostRate,
      cost: booster.cost,
      cooldown: booster.cooldown,
    }));

    return res.status(200).json({
      success: true,
      message: 'User boosters retrieved successfully',
      data: {
        boosters,
        totalBoosters: boosters.length,
      },
    });
  } catch (error) {
    console.error('Error in getUserBoosters:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = { getUserBoosters };