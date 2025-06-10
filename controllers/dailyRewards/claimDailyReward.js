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

    // Check if user can claim this day based on signup time
    const now = new Date();
    const signupTime = new Date(user.signupTime);
    const minutesSinceSignup = Math.floor((now - signupTime) / (1000 * 60));
    
    // Day X can be claimed if: minutesSinceSignup >= (X-1)
    // Day 1 = 0 mins, Day 2 = 1 min, Day 3 = 2 mins, etc.
    const requiredMinutes = dayNumber - 1;
    
    if (minutesSinceSignup < requiredMinutes) {
      return res.status(400).json({
        success: false,
        message: `Day ${dayNumber} is not unlocked yet. Wait ${requiredMinutes - minutesSinceSignup} more minute(s).`
      });
    }

    // Check if user has claimed previous consecutive days (optional strict mode)
    // For now, we'll allow claiming any available day
    
    // Find all days from 1 to dayNumber that need to be claimed (catch-up mechanism)
    const daysToClaim = [];
    let totalRewards = {
      goldCoins: 0,
      stars: 0
    };
    
    for (let i = 1; i <= dayNumber; i++) {
      const rewardIndex = user.dailyRewards.findIndex(r => r.day === i);
      if (rewardIndex !== -1 && !user.dailyRewards[rewardIndex].claimed) {
        const dayReward = user.dailyRewards[rewardIndex];
        daysToClaim.push({
          day: i,
          rewardIndex: rewardIndex,
          reward: dayReward.reward
        });
        
        // Calculate total rewards
        if (dayReward.reward.type === 'goldCoins') {
          totalRewards.goldCoins += dayReward.reward.amount;
        } else if (dayReward.reward.type === 'stars') {
          totalRewards.stars += dayReward.reward.amount;
        }
      }
    }
    
    // If no days to claim, user has already claimed everything up to this day
    if (daysToClaim.length === 0) {
      return res.status(400).json({
        success: false,
        message: `All rewards up to Day ${dayNumber} have already been claimed`
      });
    }
    
    // Apply all the rewards
    user.goldCoins += totalRewards.goldCoins;
    user.totalGoldEarned += totalRewards.goldCoins;
    user.stars += totalRewards.stars;

    // Mark all days as claimed
    const claimedDays = [];
    for (const dayInfo of daysToClaim) {
      user.dailyRewards[dayInfo.rewardIndex].claimed = true;
      user.dailyRewards[dayInfo.rewardIndex].claimedAt = now;
      claimedDays.push(dayInfo.day);
      
      // Log transaction for each day
      await new Transaction({
        userId: user.userId,
        type: 'dailyReward',
        amount: dayInfo.reward.amount,
        details: { 
          day: dayInfo.day, 
          rewardType: dayInfo.reward.type,
          rewardId: `day${dayInfo.day}`
        },
        timestamp: now
      }).save();
    }

    // Save user
    await user.save();

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

    // Create descriptive message
    let rewardMessage = '';
    if (totalRewards.goldCoins > 0 && totalRewards.stars > 0) {
      rewardMessage = `${totalRewards.goldCoins} gold coins and ${totalRewards.stars} stars`;
    } else if (totalRewards.goldCoins > 0) {
      rewardMessage = `${totalRewards.goldCoins} gold coins`;
    } else if (totalRewards.stars > 0) {
      rewardMessage = `${totalRewards.stars} stars`;
    }
    
    const daysClaimedText = claimedDays.length === 1 
      ? `Day ${claimedDays[0]}` 
      : `Days ${claimedDays.join(', ')}`;

    return res.status(200).json({
      success: true,
      message: `Successfully claimed ${daysClaimedText} rewards: ${rewardMessage}!${bonusMessage}`,
      data: {
        claimedDays: claimedDays,
        totalRewards: totalRewards,
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