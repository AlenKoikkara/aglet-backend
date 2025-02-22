const mongoose = require("mongoose");
const Favourite = require("../models/favouriteModel");

const toggleFav = async (req, res) => {
  const { userId, favourites } = req.body; // Destructure userId and cart from request body
  try {
    let favCart = await Favourite.findOne({ userId });
    if (!favCart) {
      // If user cart doesn't exist, create a new cart document
      favCart = new Favourite({
        userId: userId,
        emailId: req.body.emailId, // Assuming emailId is also sent in the request body
        favourites: favourites, // Initialize with the entire cart from request body
      });
      await favCart.save();
    } else {
      favourites?.forEach(async (item) => {
        const existingItem = favCart.favourites.findIndex(
          (i) => i.productId === item.productId
        );
        if (existingItem < 0) {
          favCart.favourites.push({
            productId: item.productId,
            productName: item.productName,
            subCategory: item.subCategory,
            company: item.company,
            imageUrl: item.imageUrl,
            listPrice: item.listPrice,
          });
        } else {
          favCart.favourites.splice(existingItem, 1);
          // Remove the item if count is zero
        }
      });
      await favCart.save()
      // if (favCart.favourites.length === 0) {
      //   await Favourite.deleteOne({ userId });
      // }
    }
    favCart = await Favourite.findOne({ userId: userId });
    res.status(200).json(favCart);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
};

const getFav = async (req, res) => {
  const { id } = req.params;
  console.log(id)
  try {
    const favCart = await Favourite.findOne({ userId: id });
    res.status(200).json(favCart);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
};

module.exports = {
  toggleFav,
  getFav,
};
