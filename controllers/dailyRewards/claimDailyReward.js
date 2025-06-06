const { User, Transaction } = require('../../models/miniApp');

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

const claimDailyReward = async (req, res) => {
  try {
    const { userId, day } = req.body;

    // Validate input
    if (!userId || !day) {
      return res.status(400).json({
        success: false,
        message: 'userId and day are required'
      });
    }

    // Convert day to number to ensure proper comparison
    const dayNumber = parseInt(day);
    
    if (dayNumber < 1 || dayNumber > 7) {
      return res.status(400).json({
        success: false,
        message: 'Day must be between 1 and 7'
      });
    }

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

    // Find the specific reward
    const rewardIndex = user.dailyRewards.findIndex(r => r.day === dayNumber);
    if (rewardIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Daily reward not found'
      });
    }

    const reward = user.dailyRewards[rewardIndex];

    // Safety check: prevent double claiming
    if (reward.claimed) {
      return res.status(400).json({
        success: false,
        message: 'This reward has already been claimed'
      });
    }

    // Check if user can claim this day based on lastLogin
    const now = new Date();
    const lastLogin = user.lastLogin ? new Date(user.lastLogin) : user.signupTime;
    const daysSinceLastLogin = Math.floor((now - lastLogin) / (1000 * 60 * 60 * 24));
    
    // User can only claim rewards up to (daysSinceLastLogin + 1) days
    if (dayNumber > daysSinceLastLogin + 1) {
      return res.status(400).json({
        success: false,
        message: 'Cannot claim future rewards. You can only claim rewards for days since your last login.'
      });
    }

    // Check if user has claimed previous consecutive days (optional strict mode)
    // For now, we'll allow claiming any available day
    
    // Apply the reward
    if (reward.reward.type === 'goldCoins') {
      user.goldCoins += reward.reward.amount;
      user.totalGoldEarned += reward.reward.amount;
    } else if (reward.reward.type === 'stars') {
      user.stars += reward.reward.amount;
    }

    // Mark reward as claimed
    user.dailyRewards[rewardIndex].claimed = true;
    user.dailyRewards[rewardIndex].claimedAt = now;

    // Update last login to current time
    user.lastLogin = now;

    // Save user
    await user.save();

    // Log transaction
    await new Transaction({
      userId: user.userId,
      type: 'dailyReward',
      amount: reward.reward.amount,
      details: { 
        day: dayNumber, 
        rewardType: reward.reward.type,
        rewardId: reward.rewardId 
      },
      timestamp: now
    }).save();

    // Check if all rewards are claimed for bonus message
    const allClaimed = user.dailyRewards.every(r => r.claimed);
    let bonusMessage = '';
    if (allClaimed) {
      bonusMessage = ' Congratulations! You have completed the full 7-day cycle. Rewards will reset tomorrow.';
    }

    // Calculate current streak after this claim
    let currentStreak = 0;
    for (let i = 1; i <= 7; i++) {
      const streakReward = user.dailyRewards.find(r => r.day === i);
      if (streakReward && streakReward.claimed) {
        currentStreak = i;
      } else {
        break;
      }
    }

    return res.status(200).json({
      success: true,
      message: `Successfully claimed Day ${dayNumber} reward: ${reward.reward.amount} ${reward.reward.type}!${bonusMessage}`,
      data: {
        claimedReward: {
          day: dayNumber,
          type: reward.reward.type,
          amount: reward.reward.amount
        },
        updatedBalance: {
          goldCoins: user.goldCoins,
          stars: user.stars
        },
        currentStreak,
        allClaimed
      }
    });

  } catch (error) {
    console.error('Error in claimDailyReward:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = { claimDailyReward }; 