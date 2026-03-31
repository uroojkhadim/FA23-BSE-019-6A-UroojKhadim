import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  menuItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true,
  },
  quantity: {
    type: Number,
    required: [true, 'Please provide quantity'],
    min: 1,
  },
  unitPrice: {
    type: Number,
    required: [true, 'Please provide unit price'],
    min: 0,
  },
  lineItemTotal: {
    type: Number,
    required: [true, 'Please provide line item total'],
    min: 0,
  },
}, {
  timestamps: true,
});

const OrderItem = mongoose.model('OrderItem', orderItemSchema);

export default OrderItem;
