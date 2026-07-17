const { body } = require('express-validator');

exports.registerValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required'),

  body('email')
    .trim()
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

exports.loginValidator = [
  body('email')
    .trim()
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
];

exports.updateProfileValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

  body('phone')
    .optional()
    .trim()
    .isMobilePhone('any').withMessage('Please enter a valid phone number'),

  body('address')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Address must not exceed 200 characters'),

  body('profilePicture')
    .optional()
    .trim()
    .isURL().withMessage('Profile picture must be a valid URL')
];

exports.changePasswordValidator = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),

  body('newPassword')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];