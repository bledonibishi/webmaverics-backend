const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A user must have a name'],
      trim: true,
      unique: true,
    },
    surname: {
      type: 'String',
      required: [true, 'A user must have a surname'],
      trim: true,
    },
    gender: {
      type: 'String',
      required: [true, 'A user must have a gender'],
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
      required: [true, 'Please select a country'],
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: [true, 'Please select a city'],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Please provide your email!'],
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    photo: { type: String, default: 'default.jpg' },
    birthYear: {
      type: Number,
      required: [true, 'Please provide your birth year'],
      min: 1900,
      max: new Date().getFullYear(),
    },
    birthMonth: {
      type: Number,
      required: [true, 'Please provide your birth month'],
      min: 1,
      max: 12,
    },
    birthDay: {
      type: Number,
      required: [true, 'Please provide your birth day'],
      min: 1,
      max: 31,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minLength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        // This only works on SAVE or CREATE!!!
        validator: function (el) {
          return el === this.password;
        },
        message: 'Password are not the same!',
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cart',
    },
    wishlist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wishlist',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});
// if its have delay while registring it in database
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
// method to check if user has changes password after loging in
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimeStamp;
  }
  // false mean NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
