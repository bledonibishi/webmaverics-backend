const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A product must have title'],
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    productID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    updatedAt: {
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

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
