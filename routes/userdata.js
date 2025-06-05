const express = require('express');
const router = express.Router();
const {getUserData} = require('../controllers/userData');
const { authenticateToken } = require('../middleware/auth');
const { updateOnTap } = require('../controllers/updateOnTap');
const { claimAfk } = require('../controllers/afkClaimer');
const { specialOffer } = require('../controllers/specialOffer');


router.get('/:userId', getUserData);
router.put('/updateOnTap/:userId',authenticateToken, updateOnTap);
router.put('/claimAfk', authenticateToken, claimAfk);
router.get('/specialOffer/:userId', authenticateToken, specialOffer);

module.exports = router;