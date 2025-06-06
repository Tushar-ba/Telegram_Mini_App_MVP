const { User } = require('../../models/miniApp');

// Default daily rewards configuration
const DEFAULT_DAILY_REWARDS = [
  { rewardId: "day1", day: 1, reward: { type: "goldCoins", amount: 1000 }, claimed: false },
  { rewardId: "day2", day: 2, reward: { type: "goldCoins", amount: 2000 }, claimed: false },
  { rewardId: "day3", day: 3, reward: { type: "goldCoins", amount: 3000 }, claimed: false },
  { rewardId: "day4", day: 4, reward: { type: "goldCoins", amount: 4000 }, claimed: false },
  { rewardId: "day5", day: 5, reward: { type: "goldCoins", amount: 5000 }, claimed: false },
  { rewardId: "day6", day: 6, reward: { type: "goldCoins", amount: 6000 }, claimed: false },
  { rewardId: "day7", day: 7, reward: { type: "stars", amount: 7 }, claimed: false },
];

const getDailyRewards = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find user
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Initialize daily rewards if they don't exist
    if (!user.dailyRewards || user.dailyRewards.length === 0) {
      user.dailyRewards = DEFAULT_DAILY_REWARDS.map(reward => ({ ...reward }));
      await user.save();
    }

    // Calculate which days are claimable based on lastLogin
    const now = new Date();
    const lastLogin = user.lastLogin ? new Date(user.lastLogin) : user.signupTime;
    const daysSinceLastLogin = Math.floor((now - lastLogin) / (1000 * 60 * 60 * 24));
    
    // Determine claimable days (user can claim missed days + current day)
    const claimableDays = [];
    for (let i = 1; i <= Math.min(7, daysSinceLastLogin + 1); i++) {
      const reward = user.dailyRewards.find(r => r.day === i);
      if (reward && !reward.claimed) {
        claimableDays.push(i);
      }
    }

    // Calculate current streak (consecutive claimed days)
    let currentStreak = 0;
    for (let i = 1; i <= 7; i++) {
      const reward = user.dailyRewards.find(r => r.day === i);
      if (reward && reward.claimed) {
        currentStreak = i;
      } else {
        break;
      }
    }

    // Check if all rewards are claimed (cycle complete)
    const allClaimed = user.dailyRewards.every(reward => reward.claimed);
    
    return res.status(200).json({
      success: true,
      data: {
        dailyRewards: user.dailyRewards,
        claimableDays,
        currentStreak,
        daysSinceLastLogin,
        allClaimed,
        nextResetTime: allClaimed ? new Date(now.getTime() + 24 * 60 * 60 * 1000) : null
      }
    });

  } catch (error) {
    console.error('Error in getDailyRewards:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = { getDailyRewards };
