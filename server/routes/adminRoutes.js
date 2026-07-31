const express = require("express");
const router = express.Router();

const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");

const { protect } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");



router.get(
  "/stats",
  protect,
  adminMiddleware,
  async (req,res)=>{

    try{

      const totalProducts = await Product.countDocuments();

const totalUsers = await User.countDocuments();

const totalOrders = await Order.countDocuments();

const revenue = await Order.aggregate([
  {
    $match: {
      status: {
        $ne: "Cancelled",
      },
    },
  },
  {
    $group: {
      _id: null,
      total: {
        $sum: "$totalAmount",
      },
    },
  },
]);

const totalRevenue =
  revenue.length > 0 ? revenue[0].total : 0;


const recentProducts = await Product.find()
  .sort({ createdAt: -1 })
  .limit(5)
  .select("name category price");

  const recentUsers = await User.find()
  .select("name email role")
  .sort({ createdAt: -1 })
  .limit(5);

  const recentOrders = await Order.find()
  .populate("user", "name")
  .sort({ createdAt: -1 })
  .limit(5);

    res.json({
  success: true,

  totalProducts,
  totalUsers,
  totalOrders,
  totalRevenue,

  recentProducts,
  recentUsers,
  recentOrders,
});

    }catch(error){

      res.status(500).json({

        success:false,

        message:"Server Error"

      });

    }

  }
);


router.get(
  "/low-stock",
  protect,
  adminMiddleware,
  async (req, res) => {

    try {

      const products = await Product.find({
        stock: { $lt: 5 }
      })
      .select("name stock price image");

      res.status(200).json({
        success: true,
        products
      });

    } catch(error){

      res.status(500).json({
        success:false,
        message:error.message
      });

    }

  }
);



module.exports = router;