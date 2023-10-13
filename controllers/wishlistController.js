const Wishlist = require('../models/wishlishtModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const Product = require('../models/productModel');

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  const userWishlist = user.wishlist;

  const wishlist = await Wishlist.findById(userWishlist._id).populate(
    'products'
  );
  const products = wishlist.products;

  if (!products) {
    return next(
      new AppError('There was something wrong getting wishlist products!', 404)
    );
  }

  res.status(200).json(products);
});

exports.createOne = catchAsync(async (req, res, next) => {
  const itemIds = req.body.products;
  const products = await Promise.all(itemIds.map((id) => Product.findById(id)));

  if (products.every((product) => product !== null)) {
    const user = await User.findById(req.user._id).populate('wishlist');
    let wishlist = user.wishlist;

    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user._id, products: [] });
      await User.findByIdAndUpdate(req.user._id, { wishlist: wishlist._id });
    }

    let productFound = false;
    let updatedItems = [];

    req.body.products.forEach((product) => {
      const index = wishlist.products.findIndex(
        (item) => item.toString() === product
      );

      if (index === -1) {
        updatedItems.push(product);
      } else {
        productFound = true;
      }
    });
    if (productFound) {
      res.status(401).json({
        status: 'fail',
        message: 'This product is already in your wishlist!',
      });
    } else {
      wishlist.products = [...wishlist.products, ...updatedItems];
      await wishlist.save();

      res.status(200).json({
        status: 'success',
        message: 'Product added to wishlist successfully!',
        wishlist,
      });
    }
  } else {
    return next(new AppError('One or more products was not found ', 404));
  }
});

exports.deleteOne = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  const userWishlist = user.wishlist;

  const product = userWishlist.products.findIndex(
    (item) => item.toString() === req.body.product
  );

  if (product === -1) {
    return next(new AppError('This product is not in your wishlist!', 404));
  }

  userWishlist.products.splice(product, 1);
  await userWishlist.save();

  res.status(200).json({
    status: 'success',
    message: 'The product removed from wishlist successfuly',
  });
});

exports.deleteAll = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  const userWishlist = user.wishlist;

  userWishlist.products.splice(0, userWishlist.products.length);
  await userWishlist.save();

  res.status(200).json({
    status: 'success',
    message: 'The products has been deleted!',
  });
});
