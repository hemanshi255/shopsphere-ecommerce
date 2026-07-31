const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
} = require("../controllers/couponController");
const Coupon = require("../models/coupon");

// User route to apply coupon
router.post("/apply", protect, applyCoupon);

// Admin routes for coupon management
router.post("/", protect, adminMiddleware, createCoupon);
router.get("/", protect, adminMiddleware, getAllCoupons);
router.patch("/:id", protect, adminMiddleware, updateCoupon);
router.delete("/:id", protect, adminMiddleware, deleteCoupon);

router.get("/active", async (req, res) => {
  try {
    const coupons = await Coupon.find({
      isActive: true,
      expiryDate: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    res.json(coupons);

  } catch (error) {

    console.log("Active Coupon Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});


module.exports = router;
