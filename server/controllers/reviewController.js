const Review = require("../models/review");
const Product = require("../models/product");
const Order = require("../models/order");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const createNotification = require("../utils/createNotification");

// Helper to recalculate and update product averageRating and totalReviews
const updateProductRatingStats = async (productId) => {
  const reviews = await Review.find({ product: productId });
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? Number(
          (
            reviews.reduce((acc, item) => acc + item.rating, 0) / totalReviews
          ).toFixed(1),
        )
      : 0;

  await Product.findByIdAndUpdate(productId, {
    averageRating,
    totalReviews,
  });
};

// Add Review (POST /api/reviews/:productId)
const addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    // Check if user is admin
    if (req.user && req.user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admins cannot submit reviews",
      });
    }

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating is required and must be between 1 and 5",
      });
    }

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment is required",
      });
    }

    // Check product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if duplicate review
    const existingReview = await Review.findOne({
      user: req.user.id,
      product: productId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    // Check if user purchased and status is Delivered
    const deliveredOrder = await Order.findOne({
      user: req.user.id,
      status: "Delivered",
      "products.product": productId,
    });

    if (!deliveredOrder) {
      const anyOrder = await Order.findOne({
        user: req.user.id,
        "products.product": productId,
      });

      if (anyOrder) {
        return res.status(400).json({
          success: false,
          message:
            "You can review this product only after your order is delivered.",
        });
      }

      return res.status(403).json({
        success: false,
        message:
          "Only customers who purchased this product can leave a review.",
      });
    }

    // Create review
    const review = await Review.create({
      user: req.user.id,
      product: productId,
      order: deliveredOrder._id,
      rating: Number(rating),
      comment: comment.trim(),
    });
    const user = await User.findById(req.user.id);

    await createNotification(
      "New Product Review",
      `${user.name} reviewed ${product.name}.`,
      "review",
      "/admin/products",
    );

    // Automatically update product rating stats
    await updateProductRatingStats(productId);

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    console.error("Add Review Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// Get Product Reviews (GET /api/reviews/:productId)
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate("user", "name email profileImage")
      .sort({ createdAt: -1 });

    const product = await Product.findById(productId).select(
      "averageRating totalReviews",
    );

    // Optional user token decoding for eligibility state
    let currentUser = null;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        currentUser = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        currentUser = null;
      }
    }

    let userReview = null;
    let canReview = false;
    let reviewMessage = "";

    if (currentUser) {
      if (currentUser.role === "admin") {
        canReview = false;
        reviewMessage = "Admins cannot submit reviews.";
      } else {
        userReview = reviews.find(
          (r) => r.user && r.user._id.toString() === currentUser.id,
        );

        if (userReview) {
          canReview = false;
          reviewMessage = "You have already reviewed this product.";
        } else {
          const deliveredOrder = await Order.findOne({
            user: currentUser.id,
            status: "Delivered",
            "products.product": productId,
          });

          if (deliveredOrder) {
            canReview = true;
            reviewMessage = "";
          } else {
            const anyOrder = await Order.findOne({
              user: currentUser.id,
              "products.product": productId,
            });

            if (anyOrder) {
              canReview = false;
              reviewMessage =
                "You can review this product only after your order is delivered.";
            } else {
              canReview = false;
              reviewMessage =
                "Only customers who purchased this product can leave a review.";
            }
          }
        }
      }
    } else {
      canReview = false;
      reviewMessage = "Please log in to leave a review.";
    }

    res.status(200).json({
      success: true,
      count: reviews.length,
      averageRating: product ? product.averageRating : 0,
      totalReviews: product ? product.totalReviews : reviews.length,
      reviews,
      userReview,
      canReview,
      reviewMessage,
    });
  } catch (error) {
    console.error("Get Reviews Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Update Own Review (PUT /api/reviews/:reviewId)
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    if (req.user && req.user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admins cannot edit reviews",
      });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this review",
      });
    }

    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5",
        });
      }
      review.rating = Number(rating);
    }

    if (comment !== undefined) {
      if (!comment.trim()) {
        return res.status(400).json({
          success: false,
          message: "Comment is required",
        });
      }
      review.comment = comment.trim();
    }

    await review.save();
    await updateProductRatingStats(review.product);

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    console.error("Update Review Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// Delete Review (DELETE /api/reviews/:reviewId)
// User can delete their own review; Admin can delete any review.
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const isOwner = review.user.toString() === req.user.id;
    const isAdmin = req.user && req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this review",
      });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(reviewId);
    await updateProductRatingStats(productId);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete Review Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

module.exports = {
  addReview,
  getProductReviews,
  updateReview,
  deleteReview,
};
