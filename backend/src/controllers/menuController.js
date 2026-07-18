const Menu = require('../models/Menu');

// @route   GET /api/menu
// @desc    Public — list menu items, supports search/filter query params
exports.getMenuItems = async (req, res, next) => {
  try {
    const { search, category, minPrice, maxPrice, isAvailable } = req.query;

    const query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (category) {
      query.category = { $regex: `^${category}$`, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true';
    }

    const items = await Menu.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Menu items retrieved successfully',
      data: { count: items.length, items }
    });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/menu/admin
// @desc    Admin only — list all menu items (including unavailable), with pagination
exports.getAdminMenuItems = async (req, res, next) => {
  try {
    const { search, category, minPrice, maxPrice, isAvailable, page = 1, limit = 20 } = req.query;

    const query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (category) {
      query.category = { $regex: `^${category}$`, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Admin can optionally filter by availability too — but unlike the public route,
    // if no filter is given, admin sees EVERYTHING (available + unavailable)
    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true';
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Menu.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Menu.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      message: 'Admin menu list retrieved successfully',
      data: {
        items,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/menu/:id
// @desc    Public — get a single menu item
exports.getMenuItemById = async (req, res, next) => {
  try {
    const item = await Menu.findById(req.params.id);

    if (!item) {
      const error = new Error('Menu item not found');
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: 'Menu item retrieved successfully',
      data: { item }
    });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/menu
// @desc    Admin only — create a menu item
exports.createMenuItem = async (req, res, next) => {
  try {
    const { name, description, price, category, image, isAvailable } = req.body;

    const item = await Menu.create({ name, description, price, category, image, isAvailable });

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: { item }
    });
  } catch (err) {
    next(err);
  }
};

// @route   PUT /api/menu/:id
// @desc    Admin only — update a menu item
exports.updateMenuItem = async (req, res, next) => {
  try {
    const { name, description, price, category, image, isAvailable } = req.body;

    const item = await Menu.findById(req.params.id);

    if (!item) {
      const error = new Error('Menu item not found');
      error.statusCode = 404;
      return next(error);
    }

    if (name !== undefined) item.name = name;
    if (description !== undefined) item.description = description;
    if (price !== undefined) item.price = price;
    if (category !== undefined) item.category = category;
    if (image !== undefined) item.image = image;
    if (isAvailable !== undefined) item.isAvailable = isAvailable;

    const updatedItem = await item.save();

    res.status(200).json({
      success: true,
      message: 'Menu item updated successfully',
      data: { item: updatedItem }
    });
  } catch (err) {
    next(err);
  }
};

// @route   DELETE /api/menu/:id
// @desc    Admin only — delete a menu item
exports.deleteMenuItem = async (req, res, next) => {
  try {
    const item = await Menu.findById(req.params.id);

    if (!item) {
      const error = new Error('Menu item not found');
      error.statusCode = 404;
      return next(error);
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};