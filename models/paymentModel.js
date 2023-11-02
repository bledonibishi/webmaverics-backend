const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
  product: {
    type: mongoose.Types.ObjectId,
    ref: 'Product',
    required: [true, 'A product in the order must have an ID'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  price: {
    type: Number,
    require: [true, 'Booking must have a price'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

paymentSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'product',
    select: 'title',
  });
  next();
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
