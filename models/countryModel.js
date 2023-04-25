const mongoose = require('mongoose');

const countrySchema = mongoose.Schema({
  name: {
    type: 'String',
    required: [true, 'A country must have a name'],
    unique: true,
  },
  code: {
    type: 'String',
    required: [true, 'A country must have a code'],
    unique: true,
  },
  cities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
    },
  ],
});
countrySchema.statics.getAll = function () {
  return this.find({});
};

const Country = mongoose.model('Country', countrySchema);

module.exports = Country;
