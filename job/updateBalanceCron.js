const mongoose = require('mongoose');
const cron = require('node-cron');
const { User, Transaction } = require('../models/miniApp');  

class GoldCoinUpdateJob {
  constructor() {
    this.isRunning = false;
    this.cronExpression = '*/30 * * * * *'; // Every 30 seconds
    this.job = null;
  }

  start() {
    if (this.job) return console.log('AFK Mining cron job already running');
    console.log('Starting AFK Mining update job (every 30 seconds for afkMiningActive: false)');
    this.job = cron.schedule(this.cronExpression, async () => {
      await this.updateBalances();
    }, { scheduled: true, timezone: 'UTC' });
  }

  async updateBalances() {
    if (this.isRunning) return console.log('AFK Mining job already running, skipping...');
    this.isRunning = true;
    try {
      const users = await User.find({
        afkMiningActive: false,
        lastLogin: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      });

      for (const user of users) {
        const timeElapsed = (Date.now() - (user.lastClaimTime || user.lastLogin)) / 3600000; 
        const earnings = Math.floor(timeElapsed * user.miningRate);

        if (earnings > 0) {
          user.goldCoins += earnings;
          user.totalGoldEarned += earnings;
          user.lastClaimTime = Date.now();

          await user.save();

          await new Transaction({
            userId: user.userId,
            type: 'afkUpdate',
            amount: earnings,
            timestamp: Date.now()
          }).save();
        }
      }
      console.log(`Updated balances for ${users.length} users with AFK mining off`);
    } catch (error) {
      console.error('Error in AFK Mining update job:', error);
    } finally {
      this.isRunning = false;
    }
  }
}

const goldCoinJob = new GoldCoinUpdateJob();
goldCoinJob.start();

module.exports = GoldCoinUpdateJob;