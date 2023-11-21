const { default: mongoose } = require('mongoose');
const shortid = require('shortid');

const orderSchema = mongoose.Schema(
  {
    userID: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'An order must have a user associated'],
      index: true,
    },
    products: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: 'Product',
          required: [true, 'A product in the order must have an ID'],
        },
        quantity: {
          type: Number,
          required: [true, 'Quantity is required'],
        },
      },
    ],
    status: {
      type: String,
      enum: ['rejected', 'pending', 'processed', 'completed'],
      required: true,
      index: true,
    },
    addressID: {
      type: mongoose.Types.ObjectId,
      ref: 'Address',
      required: [true, 'An order must have an address associated'],
    },
    billingAddress: {
      type: mongoose.Types.ObjectId,
      ref: 'Address',
      required: [true, 'An order must have an address associated'],
    },
    transportMode: {
      type: String,
      required: true,
    },
    transportModeStatus: {
      type: String,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentMethodStatus: {
      type: String,
    },
    comments: {
      type: String,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    arrivalDate: {
      type: Date,
      default: Date.now,
      validate: {
        validator: function (arrivalDate) {
          return arrivalDate > this.orderDate;
        },
        message: 'Arrival date must be after order date.',
      },
    },
    orderCode: {
      type: String,
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    totalOrderPrice: {
      type: Number,
      required: true,
    },
    tvsh: {
      type: Number,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    paid: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

orderSchema.virtual('timeToArrival').get(function () {
  return this.arrivalDate - this.orderDate;
});

orderSchema.pre(/^find/, function (next) {
  this.populate('userID');
  next();
});
orderSchema.pre('save', function (next) {
  if (!this.orderCode) {
    this.orderCode = shortid.generate();
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
