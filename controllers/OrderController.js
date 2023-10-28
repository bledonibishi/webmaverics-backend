const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');

exports.createOne = catchAsync(async (req, res, next) => {
  const newRating = await Order.create({ ...req.body, userID: req.user.id });

  if (!newRating) {
    return next(new AppError('Cannot create new user', 401));
  }

  await newRating.populate('products.product');

  res.status(200).json(newRating);
});

exports.getOrderWithUserID = catchAsync(async (req, res, next) => {
  const ratings = await Order.find({ userID: req.user.id })
    .populate('products.product')
    .populate('addressID')
    .populate('userID')
    .populate('billingAddress');

  if (!ratings) {
    return next(new AppError('Cannot find ratings for this user', 401));
  }

  res.status(200).json(ratings);
});
