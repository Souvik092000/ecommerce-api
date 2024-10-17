const express = require('express');
const {
  addCategory,
  getCategoriesWithProducts,
} = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/add', authMiddleware, addCategory);
router.get('/', getCategoriesWithProducts);

module.exports = router;
