const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productSchema = new Schema({
  articleNo: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  productName: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Product', productSchema)