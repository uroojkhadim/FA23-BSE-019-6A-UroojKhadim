import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: [true, 'Please provide transaction ID'],
    unique: true,
  },
  orderReference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'mobile', 'transfer'],
    required: [true, 'Please provide payment method'],
  },
  amountPaid: {
    type: Number,
    required: [true, 'Please provide amount paid'],
    min: 0,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'pending-verification'],
    default: 'pending',
  },
  paymentDateTime: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
