const mongoose = require('mongoose');

const BoosterSchema = new mongoose.Schema({
  id: { type: String, required: true }, // e.g., "ride1", "dig2", "shop3"
  type: { type: String, required: true, enum: ['ride', 'dig', 'shop'] }, // Booster category
  level: { type: Number, default: 1, min: 1, max: 4 }, // Levels 1 to 5
  boostRate: { type: Number, required: true }, // Boost rate (e.g., 1.2 for ride1 at level 1)
  cost: { type: Number, required: true }, // Gold Coins for next upgrade
  cooldown: { type: Number, required: true }, // Cooldown time in seconds
});

const TaskSchema = new mongoose.Schema({
  taskId: { type: String, required: true }, // e.g., "dailyLogin"
  progress: Number,
  completed: { type: Boolean, default: false },
  reward: { type: { type: String, required: true }, amount: { type: Number, required: true } }, // e.g., { type: "goldCoins", amount: 5000 }
});

const DailyRewardSchema = new mongoose.Schema({
  rewardId: { type: String, required: true }, // e.g., "day1"
  day: { type: Number, required: true }, // 1 to 7 for weekly cycle
  reward: { type: { type: String, required: true }, amount: { type: Number, required: true } }, // e.g., { type: "stars", amount: 10 }
  claimed: { type: Boolean, default: false },
  claimedAt: Date,
});

const MembershipSchema = new mongoose.Schema({
  type: { type: String, default: 'gold', enum: ['gold', 'platinum'] }, // Membership type
  miningRate: { type: Number, required: true }, // Hourly profit from miningRate
  cooldown: { type: Number, default: 0 }, // Cooldown time in seconds
});

const UserSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true }, // Telegram ID as primary key
  avatar: { type: String, default: 'https://images.lifestyleasia.com/wp-content/uploads/sites/2/2022/01/14164044/mutant-975x1024-1.jpeg', required: true },
  walletAddress: String, // TON wallet address
  signupTime: { type: Date, default: Date.now },
  lastClaimTime: Date, // For AFK mining
  lastLogin: Date, // For daily rewards
  goldCoins: { type: Number, default: 10000 }, // Signup reward
  stars: { type: Number, default: 100 }, // Signup reward
  apraTokens: { type: Number, default: 10 }, // Signup reward
  totalGoldEarned: { type: Number, default: 0 }, // For level progression
  level: { type: Number, default: 1 },
  targetGold: { type: Number, default: 50000 }, // Gold needed for next level
  energy: { type: Number, default: 100 }, // For tap/shake
  miningRate: { type: Number, default: 10000 }, // Gold Coins per hour
  tapAmount: { type: Number, default: 10 }, // Gold Coins per tap
  afkMiningActive: { type: Boolean, default: false },
  boosters: [BoosterSchema], // All user boosters (up to 12: 4 rides, 4 digs, 4 shops)
  dailyRewards: [DailyRewardSchema],
  nextRewardUnlockTime: Date,
  tasks: [TaskSchema],
  membership: { type: String, default: 'gold', enum: ['gold', 'platinum'] },
  wheelSpins: { type: Number, default: 0 }, // Available spins
  specialOfferClaimed: { type: Boolean, default: false },
});

const TransactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, required: true }, // e.g., "tap", "afkClaim", "boosterPurchase"
  amount: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = {
  User: mongoose.model('User', UserSchema),
  Transaction: mongoose.model('Transaction', TransactionSchema),
};