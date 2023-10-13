const { default: mongoose } = require('mongoose');

const productCategorySchema = mongoose.Schema({
  name: {
    type: 'String',
    required: [true, 'A city must have a name'],
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'A product category must have a description'],
  },
  image: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const ProductCategory = mongoose.model(
  'ProductCategory',
  productCategorySchema
);

module.exports = ProductCategory;
