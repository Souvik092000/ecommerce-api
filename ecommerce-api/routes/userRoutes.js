const express = require('express');
const {
  getUserProfile,
  updateUserProfile,
} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router
  .route('/profile')
  .get(authMiddleware, getUserProfile)
  .put(authMiddleware, updateUserProfile);

module.exports = router;
