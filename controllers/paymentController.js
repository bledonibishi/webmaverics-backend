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

// exports.getCheckoutSession = catchAsync(async (req, res, next) => {
//   console.log('req.body', req.body);
//   const populatedProducts = [];

//   const productIDs = req.body.products.map((productID) => productID.product);
//   Promise.all(
//     productIDs.map(async (productID) => {
//       const product = await Product.findById(productID);
//       return product;
//     })
//   )
//     .then(async (products) => {
//       populatedProducts.push(...products);
//       console.log('populatedProducts', populatedProducts);

//       const lineItems = populatedProducts.map((product) => {
//         return {
//           price_data: {
//             currency: 'eur',
//             product_data: {
//               name: `${product.title} Product`,
//               description: product.description,
//               images: [
//                 'https://iqq6kf0xmf.gjirafa.net/images/fe01ce44-d103-4ec8-8c5b-732cfa431e6c/fe01ce44-d103-4ec8-8c5b-732cfa431e6c.jpeg?w=1920',
//               ],
//             },
//             unit_amount: product.price * 100,
//           },
//           quantity: 1,
//         };
//       });

//       const session = await stripe.checkout.sessions.create({
//         payment_method_types: ['card'],
//         success_url: `${req.protocol}://localhost:3000/checkout/completed?sessionId={CHECKOUT_SESSION_ID}`,
//         cancel_url: `${req.protocol}://localhost:3000/onepagecheckout#opc-payment_info`,
//         customer_email: req.user.email,
//         client_reference_id: req.body.status,
//         mode: 'payment',
//         line_items: lineItems,
//       });
//       const success_url = `${req.protocol}://localhost:3000/checkout/completed?sessionId=${session.id}`;

//       res.status(200).json({ status: 'success', session, success_url });
//     })
//     .catch((error) => {
//       console.error('Error fetching products:', error);
//     });

// await Order.create({ ...req.body, userID: req.user.id });
// });
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
// exports.getCheckoutSession = catchAsync(async (req, res, next) => {
//   const product = await Product.findById(req.params.productID);

//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ['card'],
//     // success_url: `${req.protocol}://${req.get('host')}/`,
//     success_url: `${req.protocol}://localhost:3000/checkout/completed?products=${req.params.productID}&user=${req.user.id}&price=${product.priceDiscount}`,
//     cancel_url: `${req.protocol}://${req.get('host')}/product/${
//       req.params.productID
//     }`,
//     customer_email: req.user.email,
//     client_reference_id: req.params.productID,
//     mode: 'payment',
//     line_items: [
//       {
//         price_data: {
//           currency: 'eur',
//           product_data: {
//             name: `${product.title} Product`,
//             description: product.description,
//             images: [
//               'https://iqq6kf0xmf.gjirafa.net/images/fe01ce44-d103-4ec8-8c5b-732cfa431e6c/fe01ce44-d103-4ec8-8c5b-732cfa431e6c.jpeg?w=1920',
//             ],
//           },
//           unit_amount: product.price * 100,
//         },
//         quantity: 1,
//       },
//     ],
//   });

//   res.status(200).json({ status: 'success', session });
// });

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

// exports.createPaymentCheckout = catchAsync(async (req, res, next) => {
//   const { products, user, price } = req.query;

//   if (!products && !user && !price) return next();
//   console.log('products', products);
//   console.log('req.originalUrl', req.originalUrl);
//   await Payment.create({ product: products, user, price });

//   res.redirect(req.originalUrl.split('?')[0]);
// });
