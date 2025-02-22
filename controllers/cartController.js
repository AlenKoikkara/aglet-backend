const Cart = require("../models/cartModel");
const mongoose = require("mongoose");

const addCart = async (req, res) => {
  const { userId, cart } = req.body;  // Destructure userId and cart from request body

  try {
    let userCart = await Cart.findOne({ userId });
    if (!userCart) {
      // If user cart doesn't exist, create a new cart document
      userCart = new Cart({
        userId,
        emailId: req.body.emailId, // Assuming emailId is also sent in the request body
        cart: cart, // Initialize with the entire cart from request body
      });
  
      await userCart.save();
    } else {
      // If user cart exists, update the cart items
      cart.forEach((item) => {
        // Find the corresponding item in the existing cart or create new if not found
        const existingItem = userCart.cart.find(
          (i) => ((i.productId === item.productId) && (i.size === item.size))
        );
        console.log(existingItem)
        if (existingItem) {
          // Increment the count of the existing item
          existingItem.count += item.count;
        } else {
          // Add the new item to the cart
          userCart.cart.push({
            productId: item.productId,
            productName: item.productName,
            subCategory: item.subCategory,
            company: item.company,
            imageUrl: item.imageUrl,
            listPrice: item.listPrice,
            count: item.count,
            size: item.size,
          });
        }
      });
      // Save the updated cart document
      await userCart.save();
    }
    userCart = await Cart.findOne({ userId });
    res.status(200).json(userCart);
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
};

const removeCart = async (req, res) => {
  const { userId, productId, size } = req.body;  // Destructure userId and cart from request body
  
  try {
    let userCart = await Cart.findOne({ userId });
    if (userCart) {
      const itemIndex = userCart.cart.findIndex(
        (i) => ((i.productId === productId) && (i.size === size))
      )
  
      if (userCart.cart[itemIndex].count > 1) {
        userCart.cart[itemIndex].count -= 1;
      } else {
        userCart.cart.splice(itemIndex, 1); // Remove the item if count is zero
      }
  
      if (userCart.cart.length === 0) {
        await Cart.deleteOne({ userId });
      } else {
        await userCart.save();
      }
    }
  
    userCart = await Cart.findOne({ userId });
    res.status(200).json(userCart);
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
};

const getCart = async (req, res) => {
  const { id } = req.params;

  try {
    const cart = await Cart.findOne({ userId: id });
    res.status(200).json(cart);
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
};

module.exports = {
  addCart,
  getCart,
  removeCart,
};
