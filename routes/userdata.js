const express = require('express');
const router = express.Router();
const {getUserData} = require('../controllers/userData');
const { authenticateToken } = require('../middleware/auth');
const { updateOnTap } = require('../controllers/updateOnTap');
const { claimAfk } = require('../controllers/afkClaimer');


router.get('/:userId', getUserData);
router.put('/updateOnTap/:userId',authenticateToken, updateOnTap);
router.put('/claimAfk', authenticateToken, claimAfk);

module.exports = router;