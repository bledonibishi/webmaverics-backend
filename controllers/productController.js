const fetch = require('node-fetch');
const catchAsync = require('../utils/catchAsync');
const Product = require('../models/productModel');
const AppError = require('../utils/appError');

exports.getAllProducts = async (req, res) => {
  const data = await fetch('https://dummyjson.com/products')
    .then((res) => res.json())
    .then((data) => {
      return data.products;
    });

  return res.status(200).json({
    success: 'Success',
    data,
  });
};

exports.getProduct = async (req, res) => {
  const product = await fetch(`https://dummyjson.com/products/${req.params.id}`)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });

  if (!product) {
    return;
  }

  return res.status(200).json({
    success: 'success',
    product,
  });
};

exports.createProduct = catchAsync(async (req, res, next) => {
  const product = await Product.create(req.body);

  if (!product) {
    return next(new AppError('Cant create product', 401));
  }

  res.status(200).json({
    success: 'success',
    product,
  });
});
