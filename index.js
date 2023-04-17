const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const carRoute = require('./routes/carRoutes');
const viewRoute = require('./routes/viewRoutes');
const productRoute = require('./routes/productRoutes');
const cartRoute = require('./routes/cartRoutes');
const userRoute = require('./routes/userRoutes');
// const productRoute = require('./routes/productRoutes');

const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //   console.log('req.headers', req.headers);
  next();
});

app.use('/', viewRoute);
app.use('/api/v1/cars', carRoute);
app.use('/api/v1/products', productRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/cart', cartRoute);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
