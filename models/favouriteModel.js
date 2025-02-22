const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favItem = new Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  subCategory: { type: String },
  company: { type: String },
  imageUrl: { type: String },
  listPrice: { type: Number },
});

const favSchema = new Schema({
  userId: {
    type: String,
    unique: true,
  },
  emailId: {
    type: String,
    required: true,
    unique: true
  },
  favourites: {
    type: [favItem]
  }
});

module.exports = mongoose.model('Favourite', favSchema)