const express = require('express');
const router = express.Router();
const {getUserData} = require('../controllers/userData');
const { authenticateToken } = require('../middleware/auth');
const { updateOnTap } = require('../controllers/updateOnTap');
const { getAfkEarnings, claimAfk } = require('../controllers/afkClaimer');
const { specialOffer } = require('../controllers/specialOffer');
const {purchaseSpecialOffer} = require ("../controllers/PurchaseSpecialOffer");
const { getUserWithoutAuth } = require('../controllers/getUser');
const { levelUp } = require('../controllers/levelUp');
const { leaderboard } = require('../controllers/Leaderboard/leaderboard');


router.get('/leaderboard', leaderboard);
router.get('/:userId', authenticateToken, getUserData);
router.get('/checkUser/:userId', getUserWithoutAuth);
router.put('/updateOnTap/:userId',authenticateToken, updateOnTap);
router.get('/getAfkEarnings/:userId', authenticateToken, getAfkEarnings);
router.put('/claimAfk', authenticateToken, claimAfk);
router.get('/specialOffer/:userId', authenticateToken, specialOffer);
router.put('/purchaseSpecialOffer/:userId', authenticateToken, purchaseSpecialOffer);
router.post('/levelUp/:userId', authenticateToken, levelUp);

module.exports = router;