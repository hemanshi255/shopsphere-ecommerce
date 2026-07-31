const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  exportOrdersExcel,
  exportOrdersPdf,
} = require("../controllers/reportController");

router.get(
  "/orders/excel",
  protect,
  adminMiddleware,
  exportOrdersExcel,
);


router.get(
  "/orders/pdf",
  protect,
  adminMiddleware,
  exportOrdersPdf
);
module.exports = router;