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

    // Calculate days since signup (using minutes for testing)
    const now = new Date();
    const signupTime = new Date(user.signupTime);
    const minutesSinceSignup = Math.floor((now - signupTime) / (1000 * 60));
    
    // Calculate current streak (consecutive claimed days from day 1)
    let currentStreak = 0;
    for (let i = 1; i <= 7; i++) {
      const reward = user.dailyRewards.find(r => r.day === i);
      if (reward && reward.claimed) {
        currentStreak = i;
      } else {
        break;
      }
    }

    // Determine claimable days: days that are unlocked but not claimed
    const claimableDays = [];
    
    // Day X can be claimed if: minutesSinceSignup >= (X-1) AND not already claimed
    for (let day = 1; day <= 7; day++) {
      const reward = user.dailyRewards.find(r => r.day === day);
      const isUnlocked = minutesSinceSignup >= (day - 1); // Day 1 = 0 mins, Day 2 = 1 min, etc.
      
      if (reward && !reward.claimed && isUnlocked) {
        claimableDays.push(day);
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
        minutesSinceSignup,
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
