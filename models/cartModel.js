const mongoose = require('mongoose')

const Schema = mongoose.Schema


const cartItemSchema = new Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  subCategory: { type: String },
  company: { type: String },
  imageUrl: { type: String },
  listPrice: { type: Number },
  count: { type: Number, default: 1 },  // Default count is 1
  size: { type: Number }
});

const cartSchema = new Schema({
  userId: {
    type: String,
    unique: true,
  },
  emailId: {
    type: String,
    required: true,
    unique: true
  },
  cart: {
    type: [cartItemSchema]
  }
})

module.exports = mongoose.model('Cart', cartSchema)