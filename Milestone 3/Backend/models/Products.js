const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  
  description: {
    type: String
  },
  
  price: {
    type: Number,
    required: true,
    min: 0
  },
  
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  
  image: {
    type: String
  },
  
  category: {
    type: String
  },
  
  brand: {
    type: String
  }
}, {
  timestamps: true
});

productSchema.methods.toJSON = function() {
  const product = this.toObject();
  product.id = product._id;
  return product;
};

module.exports = mongoose.model('Product', productSchema);