const mongoose = require('mongoose');
const shortid = require('shortid');

const returnRequestSchema = mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order', // Reference to the original order
      required: [true, 'A return request must reference an order'],
      index: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'An address must have a user associated'],
    },
    requestId: {
      type: String,
      unique: true,
    },
    reason: {
      type: String,
      required: true,
    },
    productsDetails: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: [true, 'A product in the return request must have an ID'],
        },
        quantity: {
          type: Number,
          required: [true, 'Quantity is required'],
        },
      },
    ],
    requestDate: {
      type: Date,
      default: Date.now,
    },
    returningAction: {
      type: String,
      enum: ['refund', 'exchange', 'credit'], // Add any other relevant options
      required: true,
    },
    returningStatus: {
      type: String,
      default: 'pending',
      enum: ['pending', 'approved', 'rejected', 'completed'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

returnRequestSchema.index({ returningStatus: 1 });

returnRequestSchema.pre('save', function (next) {
  if (!this.requestId) {
    this.requestId = shortid.generate();
  }
  next();
});

const ReturnRequest = mongoose.model('ReturnRequest', returnRequestSchema);

module.exports = ReturnRequest;
