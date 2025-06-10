const { User, Transaction } = require('../../models/miniApp');
const BOOSTERS_DETAILS = require('./boosters');
const MEMBERSHIP_DETAILS = require('../membership/membershipChart');

const purchaseOrUpgradeBooster = async (req, res) => {
  try {
    const { userId } = req.params;
    const { boosterId } = req.body;

    // Find user
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Find booster configuration in BOOSTERS_DETAILS
    const boosterConfig = BOOSTERS_DETAILS.find(booster => booster.id === boosterId);
    if (!boosterConfig) {
      return res.status(404).json({
        success: false,
        message: 'Booster not found',
      });
    }

    // Get membership details
    const membershipDetails = MEMBERSHIP_DETAILS.find(m => m.type === user.membership);
    if (!membershipDetails) {
      return res.status(500).json({
        success: false,
        message: 'Membership configuration not found',
      });
    }

    // Check if booster is already purchased
    const currentBooster = user.boosters.find(b => b.id === boosterId);
    let isPurchase = !currentBooster; // True if booster is not owned (purchase), false if owned (upgrade)
    let targetLevel, levelConfig, actionMessage, transactionType;

    if (isPurchase) {
      // Purchase case: Start at level 1
      targetLevel = 1;
      levelConfig = boosterConfig.levels.find(level => level.level === targetLevel);
      if (!levelConfig) {
        return res.status(500).json({
          success: false,
          message: 'Level 1 configuration not found for booster',
        });
      }
      actionMessage = `Booster ${boosterId} purchased successfully at level 1`;
      transactionType = 'boosterPurchase';
    } else {
      // Upgrade case: Check current level and target next level
      if (currentBooster.level >= 4) {
        return res.status(400).json({
          success: false,
          message: `Booster ${boosterId} is already at the maximum level (4) and cannot be upgraded further`,
        });
      }
      targetLevel = currentBooster.level + 1;
      levelConfig = boosterConfig.levels.find(level => level.level === targetLevel);
      if (!levelConfig) {
        return res.status(500).json({
          success: false,
          message: `Configuration for level ${targetLevel} of booster ${boosterId} not found`,
        });
      }
      actionMessage = `Booster ${boosterId} upgraded to level ${targetLevel}`;
      transactionType = 'boosterUpgrade';
    }

    // Check if user has enough goldCoins
    if (user.goldCoins < levelConfig.cost) {
      return res.status(400).json({
        success: false,
        message: `You do not have enough gold coins to ${isPurchase ? 'purchase' : 'upgrade'} this booster`,
      });
    }

    // Calculate effective cooldown based on membership
    const effectiveCooldown = membershipDetails.cardUpgradeTime === 2 
      ? levelConfig.cooldown / 2 
      : levelConfig.cooldown;

    // Create or update booster document
    const boosterDocument = {
      id: boosterConfig.id,
      type: boosterConfig.type,
      level: levelConfig.level,
      boostRate: levelConfig.boostRate,
      cost: levelConfig.cost,
      cooldown: levelConfig.cooldown, // Store base cooldown
    };

    // Update user's miningRate and goldCoins
    if (isPurchase) {
      // For purchase: Add new booster and increase miningRate
      user.boosters.push(boosterDocument);
      user.miningRate += levelConfig.boostRate;
    } else {
      // For upgrade: Adjust miningRate (remove old boostRate, add new boostRate)
      user.miningRate = user.miningRate - currentBooster.boostRate + levelConfig.boostRate;
      // Update existing booster in user's boosters array
      const boosterIndex = user.boosters.findIndex(b => b.id === boosterId);
      user.boosters[boosterIndex] = boosterDocument;
    }

    // Deduct goldCoins
    user.goldCoins -= levelConfig.cost;

    // Record transaction
    await Transaction.create({
      userId,
      type: transactionType,
      amount: -levelConfig.cost, // Negative for expenditure
      timestamp: new Date(),
    });

    // Save user
    await user.save();

    return res.status(200).json({
      success: true,
      message: actionMessage,
      data: {
        boosterId,
        level: levelConfig.level,
        effectiveCooldown,
        miningRate: user.miningRate,
        goldCoins: user.goldCoins,
      },
    });
  } catch (error) {
    console.error('Error in purchaseOrUpgradeBooster:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = { purchaseOrUpgradeBooster };