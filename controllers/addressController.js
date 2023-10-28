const Address = require('../models/addressModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAll = catchAsync(async (req, res, next) => {
  const products = await Address.find();
  console.log('products', products);

  if (!products) {
    return next(
      new AppError('There was something wrong getting wishlist products!', 404)
    );
  }

  res.status(200).json(products);
});

exports.deleteOne = catchAsync(async (req, res, next) => {
  const address = await Address.findById(req.params.id);

  if (!address) {
    return next(new AppError('Cannot find or delete this address', 404));
  }

  await address.deleteOne();

  res.status(200).json({ message: 'The address was successfuly deleted' });
});

exports.getOne = catchAsync(async (req, res, next) => {
  const address = await Address.findById(req.params.id);

  if (!address) {
    return next(new AppError('Cannot find this address', 404));
  }

  res.status(200).json(address);
});
exports.updateOne = catchAsync(async (req, res, next) => {
  const updatedAddress = await Address.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedAddress) {
    return next(new AppError('Cannot find this address', 404));
  }

  res.status(200).json(updatedAddress);
});

exports.addOne = catchAsync(async (req, res, next) => {
  const newAddress = await Address.create({ ...req.body, userId: req.user.id });

  if (!newAddress) {
    return next(new AppError('Cannot create new user', 401));
  }

  res.status(200).json(newAddress);
});
