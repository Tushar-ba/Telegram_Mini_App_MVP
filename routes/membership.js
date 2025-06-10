const express = require('express');
const router = express.Router();
const { getCurrentMembership } = require('../controllers/membership/getCurrentMembership');
const { updateMembership } = require('../controllers/membership/updateMembership');
const { getMembership } = require('../controllers/membership/getMembership');
const { authenticateToken } = require('../middleware/auth');

router.get('/getCurrentMembership/:userId', authenticateToken, getCurrentMembership);
router.put('/updateMembership/:userId', authenticateToken, updateMembership);
router.get('/getMembership', getMembership);

module.exports = router;