const express = require('express');
const router = express.Router();
const { getRides } = require('../controllers/Boosters/getRides');
const { getDigs } = require('../controllers/Boosters/getDigs');
const { getShops } = require('../controllers/Boosters/getShops');
const { purchaseOrUpgradeBooster } = require('../controllers/Boosters/makeBoosterPurchase');
const { authenticateToken } = require('../middleware/auth');
const { getUserBoosters } = require('../controllers/Boosters/getUsersBoosters');

router.get('/rides', getRides);
router.get('/digs', getDigs);
router.get('/shops', getShops);
router.post('/purchase/:userId', authenticateToken, purchaseOrUpgradeBooster);
router.get('/user-boosters/:userId', authenticateToken, getUserBoosters);


module.exports = router;
