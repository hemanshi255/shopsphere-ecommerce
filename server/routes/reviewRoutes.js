const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  addReview,
  getProductReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

// Get product reviews (Public or optionally authenticated for eligibility status)
router.get("/:productId", getProductReviews);

// Add review (Protected)
router.post("/:productId", protect, addReview);

// Update own review (Protected)
router.put("/:reviewId", protect, updateReview);

// Delete review (Protected - Own review or Admin)
router.delete("/:reviewId", protect, deleteReview);

module.exports = router;
