const express = require('express');
const { createUser, getUserById,
    getAllUsers,
    updateUserById,
    deleteUserById } = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create_user', authenticateToken, authorizeRoles('admin', 'superadmin'), createUser);
router.get('/get_all_users', authenticateToken, authorizeRoles('admin', 'superadmin'), getAllUsers);
router.get('/get_user_details/:user_id', authenticateToken, authorizeRoles('admin', 'superadmin'), getUserById);
router.put('/update_user/:user_id', authenticateToken, authorizeRoles('admin', 'superadmin'), updateUserById);
router.delete('/delete_user/:user_id', authenticateToken, authorizeRoles('admin', 'superadmin'), deleteUserById);

module.exports = router;