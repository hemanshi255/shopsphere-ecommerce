const express = require("express");

const router = express.Router();

const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");

const { protect } = require("../middleware/authMiddleware");

// Add product to wishlist
router.post(
  "/",
  protect,
  addToWishlist
);


// Get user wishlist
router.get(
  "/",
  protect,
  getWishlist
);


// Remove product from wishlist
router.delete(
  "/:productId",
  protect,
  removeFromWishlist
);


module.exports = router;