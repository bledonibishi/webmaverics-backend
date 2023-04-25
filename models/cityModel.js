const mongoose = require('mongoose');

const citySchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A city must have a name'],
    unique: true,
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: [true, 'A city must belong to a country'],
  },
});

const City = mongoose.model('City', citySchema);

module.exports = City;
