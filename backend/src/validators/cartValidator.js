const { body } = require('express-validator');

exports.addToCartValidator = [
  body('menuItem')
    .notEmpty().withMessage('Menu item is required'),
  body('quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1')
];

exports.updateCartItemValidator = [
  body('quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1')
];