const Country = require('../models/countryModel');
const City = require('../models/cityModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAll = catchAsync(async (req, res, next) => {
  const countries = await Country.getAll().populate('cities');

  if (!countries.length) {
    return next(new AppError('There are no countries!', 404));
  }

  res.status(200).json(countries);
});

exports.addCountry = catchAsync(async (req, res, next) => {
  const country = await Country.create(req.body);

  if (!country) {
    return next(new AppError('Cannot find any data', 400));
  }

  res.status(200).json(country);
});
exports.addCity = catchAsync(async (req, res, next) => {
  const city = await City.create(req.body);

  if (!city) {
    return next(new AppError('Cannot find any data', 400));
  }

  res.status(200).json(city);
});
