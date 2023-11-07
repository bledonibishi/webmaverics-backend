const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createOne = catchAsync(async (req, res, next) => {
  const newRating = await Order.create({ ...req.body, userID: req.user.id });

  if (!newRating) {
    return next(new AppError('Cannot create new user', 401));
  }

  for (const productItem of req.body.products) {
    const productId = productItem.product;
    const quantity = productItem.quantity;

    const product = await Product.findById(productId);

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    if (product.stock < quantity) {
      return next(
        new AppError('Not enough stock available for a product', 400)
      );
    }
    product.stock -= quantity;
    await product.save();
  }

  await newRating.populate('products.product');

  res.status(200).json(newRating);
});

exports.getWithOrderCode = catchAsync(async (req, res, next) => {
  const order = await Order.find({ orderCode: req.params.orderCode }).populate(
    'products.product'
  );

  console.log('order', order);

  if (!order) {
    return next(new AppError('Couldnt find the order with this code', 400));
  }

  res.status(200).json(order);
});

exports.getOrderWithUserID = catchAsync(async (req, res, next) => {
  const ratings = await Order.find({ userID: req.user.id })
    .populate('products.product')
    .populate('addressID')
    .populate('userID')
    .populate('billingAddress');

  console.log('ratings', ratings);

  if (!ratings) {
    return next(new AppError('Cannot find ratings for this user', 401));
  }

  res.status(200).json(ratings);
});
