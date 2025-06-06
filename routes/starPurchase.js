const express = require('express');
const router = express.Router();
const { purchaseStars } = require('../controllers/stars/PurchaseStars');
const { getStars } = require('../controllers/stars/getStars');
const { getPriceOfStars } = require('../controllers/stars/getPriceOfStars');
const { authenticateToken } = require('../middleware/auth');

router.post('/purchaseStars', authenticateToken, purchaseStars);
router.get('/getStars/:userId', authenticateToken, getStars);
router.get('/getPriceOfStars', getPriceOfStars);

module.exports = router;