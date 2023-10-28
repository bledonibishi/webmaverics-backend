const Rating = require('../models/ratingModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createOne = catchAsync(async (req, res, next) => {
  const rating = await Rating.create({
    ...req.body,
    userID: req.user.id,
    productID: req.params.id,
  });

  if (!rating) {
    return next(new AppError('Cannot create the rating', 400));
  }

  res.status(200).json(rating);
});

exports.getRatingsWithProductId = catchAsync(async (req, res, next) => {
  const rating = await Rating.find({ productID: req.params.id })
    .populate('productID')
    .populate('userID');

  if (!rating) {
    return next(new AppError('Cannot create the rating', 400));
  }

  res.status(200).json(rating);
});
exports.getRatingsWithUserId = catchAsync(async (req, res, next) => {
  const rating = await Rating.find({ userID: req.user.id })
    .populate('productID')
    .populate('userID');

  if (!rating) {
    return next(new AppError('Cannot create the rating', 400));
  }

  res.status(200).json(rating);
});

exports.getAll = catchAsync(async (req, res, next) => {
  const ratings = await Rating.find({ userID: req.user.id }).populate(
    'productID'
  );

  if (!ratings) {
    return next(new AppError('Cannot create the rating', 400));
  }

  res.status(200).json(ratings);
});
