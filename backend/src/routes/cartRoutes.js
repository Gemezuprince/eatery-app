const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const { addToCartValidator, updateCartItemValidator } = require('../validators/cartValidator');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} = require('../controllers/cartController');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array().map((e) => e.msg).join(', '));
    error.statusCode = 400;
    return next(error);
  }
  next();
};

router.get('/', protect, getCart);
router.post('/', protect, addToCartValidator, handleValidation, addToCart);
router.patch('/:itemId', protect, updateCartItemValidator, handleValidation, updateCartItem);
router.delete('/:itemId', protect, removeCartItem);
router.delete('/', protect, clearCart);

module.exports = router;