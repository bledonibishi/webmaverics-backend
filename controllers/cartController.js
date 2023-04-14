const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Cart = require('../models/cartModel');

exports.getAllProducts = (req, res) => {
  return res.status(200).json({
    success: 'success',
    data: 'getAllProducts',
  });
};

exports.addToCart = catchAsync(async (req, res, next) => {
  console.log('req,body', req.body);
  const newProduct = await Cart.create(req.body);

  if (!newProduct) {
    return next(
      new AppError('There was a problem adding a product to cart', 400)
    );
  }

  res.status(200).json({
    success: 'success',
    newProduct,
  });
});
