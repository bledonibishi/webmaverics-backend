const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Cart = require('../models/cartModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const { Socket } = require('socket.io');

exports.getCartProducts = catchAsync(async (req, res, next) => {
  const currentUser = await User.findById(req.user.id).populate('cart');
  const cart = currentUser.cart;

  const populatedCart = await Cart.findById(cart._id).populate('items.product');

  if (!populatedCart) {
    return next(new AppError('Something went wrong fetching the cart', 404));
  }

  const products = populatedCart.items.map((item) => ({
    product: item.product,
    quantity: item.quantity,
    price: item.price,
  }));

  const productsQuantity = products.map((item) => item.quantity);

  const countProducts = productsQuantity.reduce((acc, curr) => {
    if (typeof curr === 'number') {
      return acc + curr;
    } else {
      return acc;
    }
  }, 0);

  res.status(200).json({
    status: 'success',
    results: countProducts,
    products: products,
  });
});

exports.addToCart = catchAsync(async (req, res, next) => {
  const itemIds = req.body.items.map((item) => item.product);
  const products = await Promise.all(itemIds.map((id) => Product.findById(id)));

  if (products.every((product) => product !== null)) {
    const user = await User.findById(req.user._id).populate('cart');
    let cart = user.cart;
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
      await User.findByIdAndUpdate(req.user._id, { cart: cart._id });
    }

    req.body.items.forEach((item) => {
      const index = cart.items.findIndex(
        (cartItem) => cartItem.product.toString() === item.product
      );
      if (index === -1) {
        cart.items.push(item);
      } else {
        cart.items[index].quantity += item.quantity;
        cart.items[index].price += item.price;
      }
    });
    await cart.save();

    Socket.broadcast?.emit('cartUpdated', { cart: cart });

    res.status(200).json({
      status: 'success',
      message: 'The products have been added to the cart',
    });
  } else {
    return next(new AppError('One or more products were not found', 404));
  }
});

exports.removeProduct = catchAsync(async (req, res, next) => {
  const productId = req.params.productId;
  const user = await User.findById(req.user._id).populate('cart');
  const cart = user.cart;

  console.log('cart.items', cart.items);

  // find the index of the item t o remove
  const index = cart.items.findIndex(
    (cartItem) => cartItem.product.toString() === productId
  );

  if (index === -1) {
    return next(new AppError('Product not found in cart', 404));
  }

  // remove the item from the cart
  cart.items.splice(index, 1);
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'The product has been removed from the cart',
  });
});

exports.decreaseProductQuantity = catchAsync(async (req, res, next) => {
  const productId = req.params.productId;
  const user = await User.findById(req.user._id).populate('cart');
  const cart = user.cart;

  const index = cart.items.findIndex(
    (cartItem) => cartItem.product.toString() === productId
  );

  if (index === -1) {
    return next(new AppError('Product not found in cart', 404));
  }

  const item = cart.items[index];
  const product = await Product.findById(item.product);

  if (item.quantity > 1) {
    item.quantity--;
    item.price -= product.price;
  } else {
    cart.items.splice(index, 1);
  }

  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'The product quantity has been decreased',
  });
});

exports.clearCart = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId });

  await cart.updateOne({ $set: { items: [] } });

  res.status(200).json({
    status: 'success',
    message: 'All products have been removed from the cart',
  });
});
