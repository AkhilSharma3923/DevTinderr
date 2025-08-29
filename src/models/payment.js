const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    paymentId: {
      type: String, // Razorpay payment ID
      default: null,
    },
    orderId: {
      type: String, // Razorpay order ID
      required: true,
    },
    status: {
      type: String,
      enum: ['created', 'paid', 'failed'],
      default: 'created',
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    receipt: {
      type: String,
    },
    notes: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      membershipType: {
        type: String,
        enum: ['silver', 'gold'],
      },
    },
    isPremium: {
      type: Boolean,
      default: false
    },
    membershipType: {
      type: String
    },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
