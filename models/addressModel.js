const { default: mongoose } = require('mongoose');
const validator = require('validator');

const addressSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'An address must have a user associated'],
    },
    type: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: [true, 'A user must have a name'],
      trim: true,
    },
    surname: {
      type: 'String',
      required: [true, 'A user must have a surname'],
      trim: true,
    },
    company: {
      type: String,
    },
    fiscalNumber: {
      type: String,
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
    address: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    telephone: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
