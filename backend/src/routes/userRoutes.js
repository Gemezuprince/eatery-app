const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
  updateProfileValidator,
  changePasswordValidator
} = require('../validators/userValidator');
const {
  getProfile,
  updateProfile,
  changePassword
} = require('../controllers/userController');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array().map((e) => e.msg).join(', '));
    error.statusCode = 400;
    return next(error);
  }
  next();
};

const passwordChangeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  handler: (req, res, next) => {
    const error = new Error('Too many password change attempts, please try again later');
    error.statusCode = 429;
    next(error);
  }
});

router.get('/profile', protect, getProfile);

router.patch('/profile', protect, updateProfileValidator, handleValidation, updateProfile);

router.put(
  '/profile/change-password',
  protect,
  passwordChangeLimiter,
  changePasswordValidator,
  handleValidation,
  changePassword
);

module.exports = router;