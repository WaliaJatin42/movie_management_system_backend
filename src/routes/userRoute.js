const express = require('express');
const { createUser } = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create_user', authenticateToken, authorizeRoles('admin', 'superadmin'), createUser);

module.exports = router;