const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { validationResult } = require('express-validator');
const { registerValidator, loginValidator } = require('../validators/userValidator');
const { signup, login } = require('../controllers/authController');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array().map((e) => e.msg).join(', '));
    error.statusCode = 400;
    return next(error);
  }
  next();
};

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  handler: (req, res, next) => {
    const error = new Error('Too many login attempts, please try again later');
    error.statusCode = 429;
    next(error);
  }
});

const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  handler: (req, res, next) => {
    const error = new Error('Too many signup attempts, please try again later');
    error.statusCode = 429;
    next(error);
  }
});

router.post('/signup', signupLimiter, registerValidator, handleValidation, signup);
router.post('/login', loginLimiter, loginValidator, handleValidation, login);

module.exports = router;