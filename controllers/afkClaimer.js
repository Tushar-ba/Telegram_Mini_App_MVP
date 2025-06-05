const { User, Transaction } = require('../models/miniApp'); // Assumes models from schema artifact

const claimAfk = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Check if AFK mining is active
    if (!user.afkMiningActive) {
      return res.status(400).json({ error: 'AFK mining is disabled' });
    }

    // Check time since last login
    const now = Date.now();
    const timeSinceLastLogin = (now - user.lastLogin) / 3600000; // Hours
    if (timeSinceLastLogin > 3) {
      return res.status(400).json({ error: 'Cannot claim: last login more than 3 hours ago' });
    }

    // Calculate AFK earnings based on miningRate
    const earnings = Math.floor(timeSinceLastLogin * user.miningRate);
    if (earnings <= 0) {
      return res.status(400).json({ error: 'No AFK earnings to claim' });
    }

    // Update goldCoins and totalGoldEarned
    user.goldCoins += earnings;
    user.totalGoldEarned += earnings;
    user.lastClaimTime = now;
    user.lastLogin = now; // Update lastLogin to current time


    await user.save();

    // Log transaction
    await new Transaction({
      userId: user.userId,
      type: 'afkClaim',
      amount: earnings,
      timestamp: now
    }).save();

    res.json({
      goldCoins: user.goldCoins,
      earnings,
      message: `Claimed ${earnings} Gold Coins from AFK mining`
    });
  } catch (error) {
    console.error('Error in AFK claim:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { claimAfk };