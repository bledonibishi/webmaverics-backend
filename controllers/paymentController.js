const Order = require('../models/orderModel');
const Payment = require('../models/paymentModel');
const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  console.log('req.body', req.body);
  const populatedProducts = [];

  const productIDs = req.body.products.map((productID) => productID.product);
  const lineItems = [];

  for (const productID of productIDs) {
    const product = await Product.findById(productID);
    if (product) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: product.title,
            description: product.description,
            images: [product.imageURL],
          },
          unit_amount: product.price * 100,
        },
        quantity: 1,
      });

      const orderedQuantity = req.body.products.find(
        (item) => item.product.toString() === productID.toString()
      ).quantity;

      if (product.stock < orderedQuantity) {
        return next(
          new AppError('Not enough stock available for a product', 400)
        );
      }

      product.stock -= orderedQuantity;
      await product.save();
    }
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://localhost:3000/checkout/completed?sessionId={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.protocol}://localhost:3000/onepagecheckout#opc-payment_info`,
    customer_email: req.user.email,
    client_reference_id: req.body.orderCode,
    mode: 'payment',
    line_items: lineItems,
  });

  await Order.create({ ...req.body, userID: req.user.id });

  res.status(200).json({ status: 'success', session });
});
exports.retrieveSession = catchAsync(async (req, res, next) => {
  const { sessionId } = req.params;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });
    res.json(session);
  } catch (error) {
    console.error('Error retrieving session data:', error);
    res.status(500).json({ error: 'Error retrieving session data' });
  }
});

exports.createPaymentCheckout = catchAsync(async (req, res, next) => {
  const { sessionId } = req.query;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      const order = await Order.create({ ...req.body, userID: req.user.id });
      return res.render('success', { orderId: order._id });
    }

    return res.render('failure');
  } catch (error) {
    console.error('Error handling successful payment:', error);
    return res.render('error');
  }
});
