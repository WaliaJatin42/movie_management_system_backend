const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/login', authController.Login);
router.post('/logout', authController.Logout);
router.post('/reset_password', authController.ResetPassword);

module.exports = router;