const { body } = require('express-validator');

exports.createMenuValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 500 }),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('image').optional().trim().isURL().withMessage('Image must be a valid URL'),
  body('isAvailable').optional().isBoolean().withMessage('isAvailable must be true or false')
];

exports.updateMenuValidator = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty').isLength({ max: 500 }),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
  body('image').optional().trim().isURL().withMessage('Image must be a valid URL'),
  body('isAvailable').optional().isBoolean().withMessage('isAvailable must be true or false')
];