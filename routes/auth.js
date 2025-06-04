const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login/Register route
router.post('/login', authController.login);

module.exports = router;
