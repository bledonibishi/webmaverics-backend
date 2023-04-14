const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A product must have title'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    // details: [
    //   {
    //     type: {
    //       type: String,
    //       enum: ['size', 'color', 'weight'], // Example of enum validation
    //       required: true,
    //     },
    //     value: {
    //       type: String, // Can be changed to Number if value is numeric
    //       required: true,
    //     },
    //   },
    // ],
    details: [String],
    summary: {
      type: String,
      trim: true,
      required: [true, 'Atour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    price: {
      type: 'Number',
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price ',
      },
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// This virtual field calculates the number of times this product has been added to a cart
productSchema.virtual('timesAddedToCart', {
  ref: 'Cart',
  localField: '_id',
  foreignField: 'items.product',
  count: true,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
