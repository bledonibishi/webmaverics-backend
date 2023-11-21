const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions');
const path = require('path');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const passport = require('passport');
const passportConfig = require('./utils/passport');
const store = new MongoDBStore({
  uri: process.env.DB,
});

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const bodyParser = require('body-parser');
const compression = require('compression');

const app = express();

// Allow all origins

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const viewRoute = require('./routes/viewRoutes');
const productRoute = require('./routes/productRoutes');
const cartRoute = require('./routes/cartRoutes');
const userRoute = require('./routes/userRoutes');
const countryRoute = require('./routes/countryRoutes');
const wishlistRoute = require('./routes/wishlistRoutes');
const addressRoute = require('./routes/addressRoutes');
const ratingRoute = require('./routes/ratingRoutes');
const orderRoute = require('./routes/orderRoutes');
const paymentRoute = require('./routes/paymentsRoutes');
const returnRequestRoute = require('./routes/returnRequestRoutes');

// app.use(passport.initialize());
// app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

require('./utils/passport');

// app.use(express.static(path.join(__dirname, 'build')));

app.use(cors(corsOptions));

// Set security HTTP headers
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use(cookieParser());

app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.use(compression());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //   console.log('req.headers', req.headers);
  next();
});

store.on('error', function (error) {
  console.log(error);
});
app.use(
  session({
    secret: process.env.REFRESH_TOKEN_SECRET,
    // secret: process.env.REFRESH_TOKEN_SECRET,
    secret: 'This is a secret',
    store: store,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      httpOnly: false, // allow client-side JavaScript to access the cookie
      secure: process.env.NODE_ENV === 'production', // use secure cookies in production
    },
  })
);

app.use('/', viewRoute);
app.use('/api/v1/products', productRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/cart', cartRoute);
app.use('/api/v1/country', countryRoute);
app.use('/api/v1/wishlist', wishlistRoute);
app.use('/api/v1/address', addressRoute);
app.use('/api/v1/ratings', ratingRoute);
app.use('/api/v1/orders', orderRoute);
app.use('/api/v1/payments', paymentRoute);
app.use('/api/v1/returnRequest', returnRequestRoute);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
