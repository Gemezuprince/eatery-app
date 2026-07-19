const Cart = require('../models/Cart');
const Menu = require('../models/Menu');

// @route   GET /api/cart
// @desc    Private — get the logged-in user's cart
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.menuItem');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.status(200).json({
      success: true,
      message: 'Cart retrieved successfully',
      data: { cart }
    });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/cart
// @desc    Private — add an item to the cart (or increase quantity if already in cart)
exports.addToCart = async (req, res, next) => {
  try {
    const { menuItem, quantity } = req.body;

    const item = await Menu.findById(menuItem);

    if (!item) {
      const error = new Error('Menu item not found');
      error.statusCode = 404;
      return next(error);
    }

    if (!item.isAvailable) {
      const error = new Error(`Menu item is currently unavailable: ${item.name}`);
      error.statusCode = 400;
      return next(error);
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(
      (entry) => entry.menuItem.toString() === menuItem
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ menuItem, quantity });
    }

    await cart.save();
    await cart.populate('items.menuItem');

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: { cart }
    });
  } catch (err) {
    next(err);
  }
};

// @route   PUT /api/cart/:itemId
// @desc    Private — update the quantity of a specific cart item
exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      const error = new Error('Cart not found');
      error.statusCode = 404;
      return next(error);
    }

    const item = cart.items.id(req.params.itemId);

    if (!item) {
      const error = new Error('Item not found in cart');
      error.statusCode = 404;
      return next(error);
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.menuItem');

    res.status(200).json({
      success: true,
      message: 'Cart item updated',
      data: { cart }
    });
  } catch (err) {
    next(err);
  }
};

// @route   DELETE /api/cart/:itemId
// @desc    Private — remove a specific item from the cart
exports.removeCartItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      const error = new Error('Cart not found');
      error.statusCode = 404;
      return next(error);
    }

    const item = cart.items.id(req.params.itemId);

    if (!item) {
      const error = new Error('Item not found in cart');
      error.statusCode = 404;
      return next(error);
    }

    item.deleteOne();
    await cart.save();
    await cart.populate('items.menuItem');

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: { cart }
    });
  } catch (err) {
    next(err);
  }
};

// @route   DELETE /api/cart
// @desc    Private — clear the entire cart
exports.clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      const error = new Error('Cart not found');
      error.statusCode = 404;
      return next(error);
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      data: { cart }
    });
  } catch (err) {
    next(err);
  }
};