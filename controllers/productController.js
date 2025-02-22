const Product = require('../models/productModel')
const mongoose = require('mongoose')

// get all products
const getProducts = async (req, res) => {
  try {
    const excludeFields = ["limit", "page", "productCount"];
    const querObj = {...req?.query};
    excludeFields.forEach((item) => {
      delete querObj[item];
    })
    const products = await Product.find(querObj).limit(req?.query?.limit || "");
    if (!products) {
      return res.status(404).json({ error: "no products" });
    }
    res.status(200).json({products:products})
  }
  catch (error) {
    console.log(error.message);
    res.status(500).json(error.message)
  }
}

const getPaginatedProducts = async (req, res) => {
  try {
    const page = parseInt(req?.query?.page)
    const excludeFields = ["limit", "page", "productCount"];
    const querObj = {...req?.query};
    excludeFields.forEach((item) => {
      delete querObj[item];
    })
    const data = await Product.countDocuments(querObj)
    const start = page * req?.query?.limit
    const end = start + parseInt(req?.query?.limit)
    const products = await Product.find(querObj).limit(req?.query?.limit || "").skip(start);
    const nextPage = end < data ? page + 1 : null
    if (start > data) {
      return res.status(404).json({ error: "Invalid Page" });
    }
    res.status(200).json({nextPage: nextPage, products:products})
  }
  catch (error) {
    console.log(error.message);
    res.status(500).json(error.message)
  }
}

// get a single product
const getProduct = async (req, res) => {
  try {
    const { id } = req?.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({error: 'No such product'})
    }
    const product = await Product.findById({_id: id})
    if (!product) {
      return res.status(404).json({error: 'No such product'})
    }
    res.status(200).json(product)
  }
  catch (error) {
    console.log(error.message);
    res.status(500).json(error.message)
  }
}

const getFeatured = async (req, res) => {
  try {
    const queryObj = req.body
    const products = await Product.find(queryObj).limit(6)
    if (!products) {
      return res.status(404).json({ error: "no products" });
    }
    res.status(200).json(products)
  }
  catch (error) {
    console.log(error.message);
    res.status(500).json(error.message)
  }
}

const searchProducts = async (req, res) => {
  try {
    const query = req.query.qs;
    console.log(req.query?.qs)
    let products = [];
    if (query) {
      products = await Product.aggregate().search({
        text: {
          query: query,
          path: {
            wildcard: "*",
          },
        },
        index: "productSearch",
      }
    ).limit(5)
    }
    res.status(200).json(products)
  }
  catch (error) {
    console.log(error.message);
    res.status(500).json(error.message)
  }
}

module.exports = {
  getProducts,
  getProduct,
  getFeatured,
  getPaginatedProducts,
  searchProducts
}