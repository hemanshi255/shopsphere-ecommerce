const Wishlist = require("../models/wishlist");


// Add product to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({
      user: req.user.id,
    });


    // If user has no wishlist create new one
    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user.id,
        products: [productId],
      });

      return res.status(201).json({
        message: "Product added to wishlist",
        wishlist,
      });
    }


    // Check product already exists
    if (wishlist.products.includes(productId)) {
      return res.status(400).json({
        message: "Product already in wishlist",
      });
    }


    wishlist.products.push(productId);

    await wishlist.save();


    res.status(200).json({
      message: "Product added to wishlist",
      wishlist,
    });


  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// Get user wishlist
const getWishlist = async (req, res) => {
  try {

    const wishlist = await Wishlist.findOne({
      user: req.user.id,
    }).populate("products");


    res.status(200).json({
      wishlist,
    });


  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};



// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
  try {

    const { productId } = req.params;


    const wishlist = await Wishlist.findOne({
      user: req.user.id,
    });


    if (!wishlist) {
      return res.status(404).json({
        message: "Wishlist not found",
      });
    }


    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );


    await wishlist.save();


    res.status(200).json({
      message: "Product removed from wishlist",
      wishlist,
    });


  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};



module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};