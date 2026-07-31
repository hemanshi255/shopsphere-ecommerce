const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
  cancelOrder
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");


router.post("/", protect, placeOrder);


router.get("/my-orders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);


router.patch(
  "/:id/cancel",
  protect,
  cancelOrder
);

router.patch(
  "/:id/status",
  protect,
  adminOnly,
  updateOrderStatus
);


router.get(
  "/",
  protect,
  adminOnly,
  getAllOrders
);


module.exports = router;