const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Menu item name is required'],
      trim: true
    },

    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },

    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Main meals', 'Protein & sides', 'Drinks & beverages', 'Desserts & snacks'],
        message: 'Category must be one of: Main meals, Protein & sides, Drinks & beverages, Desserts & snacks'
      },
      trim: true
    },

    image: {
      type: String,
      default: ''
    },

    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Menu', menuSchema);