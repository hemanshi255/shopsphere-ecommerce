const Coupon = require("../models/coupon");

// Create Coupon (Admin) - POST /api/coupons
const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minimumOrderAmount,
      expiryDate,
      usageLimit,
      isActive,
    } = req.body;

    if (!code || !discountType || discountValue === undefined || !expiryDate || !usageLimit) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const formattedCode = code.trim().toUpperCase();

    // Check duplicate code
    const existingCoupon = await Coupon.findOne({ code: formattedCode });
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: "Coupon code already exists",
      });
    }

    if (!["percentage", "fixed"].includes(discountType)) {
      return res.status(400).json({
        success: false,
        message: "Discount type must be percentage or fixed",
      });
    }

    if (discountType === "percentage" && (discountValue <= 0 || discountValue > 100)) {
      return res.status(400).json({
        success: false,
        message: "Percentage discount must be between 1 and 100",
      });
    }

    const coupon = await Coupon.create({
      code: formattedCode,
      discountType,
      discountValue: Number(discountValue),
      minimumOrderAmount: Number(minimumOrderAmount) || 0,
      expiryDate: new Date(expiryDate),
      usageLimit: Number(usageLimit),
      isActive: isActive !== undefined ? isActive : true,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    console.error("Create Coupon Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// Get All Coupons (Admin) - GET /api/coupons
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: coupons.length,
      coupons,
    });
  } catch (error) {
    console.error("Get All Coupons Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Update Coupon (Admin) - PATCH /api/coupons/:id
const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      code,
      discountType,
      discountValue,
      minimumOrderAmount,
      expiryDate,
      usageLimit,
      isActive,
    } = req.body;

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    if (code) {
      const formattedCode = code.trim().toUpperCase();
      const duplicate = await Coupon.findOne({
        code: formattedCode,
        _id: { $ne: id },
      });
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: "Coupon code already in use by another coupon",
        });
      }
      coupon.code = formattedCode;
    }

    if (discountType) {
      if (!["percentage", "fixed"].includes(discountType)) {
        return res.status(400).json({
          success: false,
          message: "Discount type must be percentage or fixed",
        });
      }
      coupon.discountType = discountType;
    }

    if (discountValue !== undefined) {
      const val = Number(discountValue);
      const type = discountType || coupon.discountType;
      if (type === "percentage" && (val <= 0 || val > 100)) {
        return res.status(400).json({
          success: false,
          message: "Percentage discount must be between 1 and 100",
        });
      }
      coupon.discountValue = val;
    }

    if (minimumOrderAmount !== undefined) {
      coupon.minimumOrderAmount = Number(minimumOrderAmount);
    }

    if (expiryDate) {
      coupon.expiryDate = new Date(expiryDate);
    }

    if (usageLimit !== undefined) {
      coupon.usageLimit = Number(usageLimit);
    }

    if (isActive !== undefined) {
      coupon.isActive = Boolean(isActive);
    }

    await coupon.save();

    res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      coupon,
    });
  } catch (error) {
    console.error("Update Coupon Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// Delete Coupon (Admin) - DELETE /api/coupons/:id
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    await Coupon.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    console.error("Delete Coupon Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Apply Coupon (User) - POST /api/coupons/apply
const applyCoupon = async (req, res) => {
  try {
    const { couponCode, cartTotal } = req.body;

    if (!couponCode || !couponCode.trim()) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required",
      });
    }

    if (cartTotal === undefined || Number(cartTotal) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Cart total must be greater than zero",
      });
    }

    const formattedCode = couponCode.trim().toUpperCase();
    const coupon = await Coupon.findOne({ code: formattedCode });

    // 1. Coupon exists
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon code",
      });
    }

    // 2. Coupon active
    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        message: "This coupon is currently inactive",
      });
    }

    // 3. Expiry check
    if (new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "This coupon has expired",
      });
    }

    // 4. Usage limit check
    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: "This coupon usage limit has been reached",
      });
    }

    // 5. Minimum order amount check
    const numericCartTotal = Number(cartTotal);
    if (numericCartTotal < coupon.minimumOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${coupon.minimumOrderAmount} is required for this coupon`,
      });
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = (numericCartTotal * coupon.discountValue) / 100;
    } else if (coupon.discountType === "fixed") {
      discountAmount = coupon.discountValue;
    }

    // Ensure discount does not exceed total
    discountAmount = Math.min(discountAmount, numericCartTotal);
    discountAmount = Number(discountAmount.toFixed(2));
    const finalAmount = Number((numericCartTotal - discountAmount).toFixed(2));

    res.status(200).json({
      success: true,
      couponCode: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
      finalAmount,
      message: `Coupon '${coupon.code}' applied successfully!`,
    });
  } catch (error) {
    console.error("Apply Coupon Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// Get Active Coupons (User) - GET /api/coupons/active
const getActiveCoupons = async (req, res) => {
  try {

    const coupons = await Coupon.find({
      isActive: true,
      expiryDate: { $gt: new Date() }
    }).sort({ createdAt: -1 });


    res.status(200).json(coupons);

  } catch (error) {

    console.error("Get Active Coupons Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Server Error"
    });
  }
};

module.exports = {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
  getActiveCoupons
};
