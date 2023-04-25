const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const http = require('http');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES,
  });
};

const createSendToken = (user, status, res) => {
  const token = signToken(user._id);

  const refreshToken = generateRefreshToken(user._id);

  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
    // secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  user.password = undefined;

  res.status(status).json({
    status: 'success',
    token,
    refreshToken,
    user,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  createSendToken(newUser, 200, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(user, 200, res);
});

exports.handleRefreshToken = catchAsync(async (req, res) => {
  // Get the refresh token from the cookie
  const refreshToken = req.cookies.jwt;

  // Verify the refresh token
  const decoded = await promisify(jwt.verify)(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  // Find the user associated with the refresh token
  const user = await User.findById(decoded.id);

  // Generate a new access token
  const accessToken = signToken(user._id);

  // Send the new access token to the client
  res.status(200).json({ accessToken });
});

exports.protect = catchAsync(async (req, res, next) => {
  // getting token and check if its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  console.log('Authorization header:', req.headers.authorization);
  console.log('token', token);

  if (!token) {
    return next(
      new AppError('You are not logged in.Please log in to get access!', 401)
    );
  }

  //   verificating token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if user still exists because the user could be deleted but jwt token still exists(for more security)
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists', 401)
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'User recently changed password after the token was issued',
        401
      )
    );
  }

  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // get user with email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('There is no user with this email address', 404));
  }

  // generate the random token
  const resetToken = user.createPasswordResetToken();

  console.log('resetToken', resetToken);
  await user.save({ validateBeforeSave: false });

  // send it to user email
  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    console.log('resetURL', resetURL);

    const message = `Forget your password? Go here ${resetURL}`;

    await sendEmail({
      email: user.email,
      subject: 'Your password reset token is valid for 10min',
      message: message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });

    // await new Email(user, resetURL).sendPasswordReset();
    //     res.status(200).json({
    //       status: 'Success',
    //       message: 'Token send to email',
    //     });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email.Try again later', 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token in invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res);
});

exports.updateMyPassword = catchAsync(async (req, res, next) => {
  // Get user from collection
  const user = await User.findById(req.user.id).select('+password');
  console.log('req.body', req.body);
  console.log('user', user);
  //  check if posted current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }

  // If so update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will not work as intented

  //  Log user in,send JWT
  createSendToken(user, 200, res);
});
