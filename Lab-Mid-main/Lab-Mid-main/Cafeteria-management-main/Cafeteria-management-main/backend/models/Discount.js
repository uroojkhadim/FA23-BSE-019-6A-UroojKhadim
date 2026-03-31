import mongoose from 'mongoose';

const discountSchema = new mongoose.Schema({
  discountCode: {
    type: String,
    required: [true, 'Please provide discount code'],
    unique: true,
    uppercase: true,
    trim: true,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: [true, 'Please provide discount type'],
  },
  discountValue: {
    type: Number,
    required: [true, 'Please provide discount value'],
    min: 0,
  },
  minimumOrderAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  validFrom: {
    type: Date,
    default: Date.now,
  },
  validUntil: {
    type: Date,
  },
  description: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

const Discount = mongoose.model('Discount', discountSchema);

export default Discount;
