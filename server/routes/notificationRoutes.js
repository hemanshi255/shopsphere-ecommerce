const express = require("express");
const router = express.Router();

const {
  getNotifications,
  markAsRead,
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Get all notifications
router.get(
  "/",
  protect,
  adminMiddleware,
  getNotifications
);

// Mark notification as read
router.patch(
  "/:id/read",
  protect,
  adminMiddleware,
  markAsRead
);

module.exports = router;