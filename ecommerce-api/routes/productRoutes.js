const express = require('express');
const {
  addProduct,
  getProducts,
  getProductsOutOfStock,
  editProduct,
  deleteProduct,
  sendProductListByEmail,
} = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/add', authMiddleware, addProduct);
router.get('/', getProducts);
router.get('/outofstock', getProductsOutOfStock);
router.put('/:id', authMiddleware, editProduct);
router.delete('/:id', authMiddleware, deleteProduct);
router.post('/sendemail', authMiddleware, sendProductListByEmail);

module.exports = router;
