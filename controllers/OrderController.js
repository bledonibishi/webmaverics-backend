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

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find().populate('products.product');

  if (!orders) {
    return next(new AppError('Cannot find orders ', 401));
  }

  res.status(200).json(orders);
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const { orderID } = req.params;
  const { action, status } = req.body;

  const order = await Order.findById(orderID);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (action === 'complete') {
    order.status = 'completed';
  } else if (action === 'deny') {
    order.status = 'rejected';
  } else if (action === 'processed') {
    order.status = 'processed';
  } else if (action === 'setPending') {
    order.status = 'pending';
  } else {
    return next(new AppError('Invalid action', 400));
  }

  await order.save();

  res.status(200).json({
    message: 'Order status updated successfully',
    status: 'success',
    order,
  });
});
