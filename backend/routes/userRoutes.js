const express = require('express');
const router = express.Router();
const {
  loginUser,
  registerUser,
  inviteUser,
  setupPassword,
  getAllUsers,
  deleteUser,
  updateUserRole,
  updateProfile,
  getProfile
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { uploadProfile } = require('../middleware/uploadMiddleware');

router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/setup-password', setupPassword);

router.get('/profile', protect, getProfile);
router.put('/profile', protect, uploadProfile.single('profilePicture'), updateProfile);

router.post('/invite', protect, inviteUser);
router.get('/', protect, getAllUsers);
router.delete('/:id', protect, deleteUser);
router.put('/:id/role', protect, updateUserRole);

module.exports = router;