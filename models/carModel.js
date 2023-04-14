const mongoose = require('mongoose');

const carSchema = mongoose.Schema({
  color: {
    type: String,
    required: [true, 'A car must have a color!'],
  },
  price: {
    type: Number,
    required: [true, 'A car must have price specified'],
  },
  type: {
    type: 'String',
    required: [true, 'A car must have type specified!'],
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A car must have a description'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A car must have a cover image'],
  },
  images: [String],
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
