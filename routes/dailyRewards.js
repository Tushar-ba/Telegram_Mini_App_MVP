const express = require('express');
const router = express.Router();
const { getDailyRewards } = require('../controllers/dailyRewards/getDailyRewards');
const { claimDailyReward } = require('../controllers/dailyRewards/claimDailyReward');
const { authenticateToken } = require('../middleware/auth');

// GET /api/dailyRewards/:userId - Get daily rewards status
router.get('/:userId', authenticateToken, getDailyRewards);

// POST /api/dailyRewards/claim - Claim a specific daily reward
router.post('/claim', authenticateToken, claimDailyReward);

module.exports = router; 