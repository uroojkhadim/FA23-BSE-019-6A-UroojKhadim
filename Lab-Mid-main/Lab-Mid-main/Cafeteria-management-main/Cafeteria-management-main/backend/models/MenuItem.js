import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: [true, 'Please provide item name'],
    trim: true,
  },
  itemPrice: {
    type: Number,
    required: [true, 'Please provide item price'],
    min: 0,
  },
  itemDescription: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Snacks', 'Beverages', 'Desserts'],
    default: 'Lunch',
  },
  dietaryRestrictions: {
    type: String,
    trim: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  itemImage: {
    type: String,
  },
}, {
  timestamps: true,
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

export default MenuItem;
