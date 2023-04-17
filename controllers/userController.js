const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  console.log('newObj', newObj);
  return newObj;
};

exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  if (!newUser) {
    return next(new AppError('Cannot create new user', 401));
  }

  res.status(200).json({
    success: 'success',
    data: {
      user: newUser,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  console.log('req.user', req.user._id);

  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('Password should not be posted here', 400));
  }

  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: 'success',
    data: {
      user: updatedUser,
    },
  });
});
