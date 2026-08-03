const Order = require("../models/order");
const Cart = require("../models/cart");
const Product = require("../models/product");
const Coupon = require("../models/coupon");
const User = require("../models/user");
const createNotification = require("../utils/createNotification");

const {
  sendOrderConfirmationEmail,
  sendOrderStatusEmail,
} = require("../utils/email");

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    })
      .populate("products.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const placeOrder = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      address,
      city,
      state,
      pincode,
      country,
      paymentMethod,
      couponCode,
    } = req.body;

    if (
      !fullName ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      !country
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all shipping address fields",
      });
    }

    if (paymentMethod && !["COD", "ONLINE"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "products.product",
    );

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    let subtotal = 0;

    const orderProducts = [];

    for (const item of cart.products) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${item.product.name} is out of stock`,
        });
      }

      item.product.stock -= item.quantity;

      await item.product.save();

      subtotal += item.product.price * item.quantity;

      orderProducts.push({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      });
    }

    // Coupon discount logic
    let couponData = { code: null, discountAmount: 0 };
    let finalPaidAmount = subtotal;

    if (couponCode && typeof couponCode === "string" && couponCode.trim()) {
      const formattedCode = couponCode.trim().toUpperCase();
      const coupon = await Coupon.findOne({ code: formattedCode });

      if (
        coupon &&
        coupon.isActive &&
        new Date(coupon.expiryDate) >= new Date() &&
        coupon.usedCount < coupon.usageLimit &&
        subtotal >= coupon.minimumOrderAmount
      ) {
        let discount = 0;
        if (coupon.discountType === "percentage") {
          discount = (subtotal * coupon.discountValue) / 100;
        } else if (coupon.discountType === "fixed") {
          discount = coupon.discountValue;
        }

        discount = Math.min(discount, subtotal);
        discount = Number(discount.toFixed(2));
        finalPaidAmount = Number((subtotal - discount).toFixed(2));
        couponData = {
          code: coupon.code,
          discountAmount: discount,
        };

        // Increment coupon usedCount
        await Coupon.findByIdAndUpdate(coupon._id, {
          $inc: { usedCount: 1 },
        });
      }
    }

    const order = await Order.create({
      user: req.user.id,

      products: orderProducts,

      totalAmount: finalPaidAmount,

      coupon: couponData,

      paymentMethod: paymentMethod || "COD",

      paymentStatus: paymentMethod === "ONLINE" ? "Paid" : "Pending",

      shippingAddress: {
        fullName,
        phone,
        address,
        city,
        state,
        pincode,
        country,
      },

      statusHistory: [
        {
          status: "Pending",
          date: new Date(),
        },
      ],
    });

    cart.products = [];

    await cart.save();

    const user = await User.findById(req.user.id);

    await createNotification(
      "New Order Received",
      `A new order has been placed by ${user.name}.`,
      "order",
      "/admin/orders",
    );

    if (user && order.paymentMethod === "COD") {
      await sendOrderConfirmationEmail(user.email, user.name, order);
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { search, status } = req.query;

    let filter = {};

    // Status Filter
    if (status && status !== "All") {
      filter.status = status;
    }

    let orders = await Order.find(filter)
      .populate("user", "name email")
      .populate("products.product")
      .sort({ createdAt: -1 });

    // Search Filter
    if (search) {
      orders = orders.filter((order) => {
        const orderId = order._id.toString();

        const name = order.user?.name?.toLowerCase() || "";

        const email = order.user?.email?.toLowerCase() || "";

        return (
          orderId.includes(search.toLowerCase()) ||
          name.includes(search.toLowerCase()) ||
          email.includes(search.toLowerCase())
        );
      });
    }

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email",
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;

    if (status === "Delivered" && order.paymentMethod === "COD") {
      order.paymentStatus = "Paid";
    }

    order.statusHistory.push({
      status: status,
      date: new Date(),
    });

    await order.save();

    // Send response immediately
    res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });

    // Send email in background
    if (order.user) {
      sendOrderStatusEmail(order.user.email, order.user.name, order).catch(
        (err) => {
          console.error("Order status email error:", err);
        },
      );
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("products.product")
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // user can only see their own order
    if (
      order.user._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "products.product",
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    if (
      order.status === "Shipped" ||
      order.status === "Delivered" ||
      order.status === "Cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because it is ${order.status}`,
      });
    }

    for (const item of order.products) {
      item.product.stock += item.quantity;
      await item.product.save();
    }

    order.status = "Cancelled";

    order.statusHistory.push({
      status: "Cancelled",
      date: new Date(),
    });

    await order.save();

    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });

    // Send email in background
    if (user) {
      sendOrderStatusEmail(user.email, user.name, order).catch((err) => {
        console.error("Order cancellation email error:", err);
      });
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
  cancelOrder,
};
