const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const { protect, adminOnly } = require('../middleware/auth');
const { createMenuValidator, updateMenuValidator } = require('../validators/menuValidator');
const {
  getMenuItems,
  getMenuItemById,
  getAdminMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} = require('../controllers/menuController');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array().map((e) => e.msg).join(', '));
    error.statusCode = 400;
    return next(error);
  }
  next();
};

// Public routes
router.get('/', getMenuItems);

// Admin-only routes — placed BEFORE '/:id' so 'admin' isn't mistaken for an :id value
router.get('/admin', protect, adminOnly, getAdminMenuItems);
router.post('/', protect, adminOnly, createMenuValidator, handleValidation, createMenuItem);
router.put('/:id', protect, adminOnly, updateMenuValidator, handleValidation, updateMenuItem);
router.delete('/:id', protect, adminOnly, deleteMenuItem);

// Public route with :id param — placed LAST among GETs for the same reason
router.get('/:id', getMenuItemById);

module.exports = router;