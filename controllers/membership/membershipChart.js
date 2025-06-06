const MEMBERSHIP_DETAILS = [
    {
      type: "gold",
      hourlyProfitMultiplier: 1, // 1x Hourly profit
      cardUpgradeTime: 6, // Normal card upgrade time
      tradingFees: 1, // 1% Trading fees in percentage
      airdropPriority: false,
      miningRate: 10000,//per hr
      cooldown: 3,
    },
    {
      type: "platinum",
      hourlyProfitMultiplier: 1.3, // 1.30x Hourly profit
      cardUpgradeTime: 2, // 2x Faster card upgrade time
      tradingFees: 0, // Zero fees in trading
      airdropPriority: true,
      miningRate: 11300,//per hr
      cooldown: 3,
    },
  ];

module.exports = MEMBERSHIP_DETAILS;