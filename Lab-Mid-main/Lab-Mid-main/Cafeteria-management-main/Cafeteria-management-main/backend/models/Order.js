import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: [true, 'Please provide order number'],
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'userModel',
    required: true,
  },
  userModel: {
    type: String,
    required: true,
    enum: ['Student', 'Teacher', 'Administrator'],
  },
  status: {
    type: String,
    enum: ['ordered', 'preparing', 'ready', 'completed', 'cancelled'],
    default: 'ordered',
  },
  totalPrice: {
    type: Number,
    required: [true, 'Please provide total price'],
    min: 0,
  },
  orderTime: {
    type: Date,
    default: Date.now,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'mobile', 'transfer'],
    required: [true, 'Please provide payment method'],
  },
  notes: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
