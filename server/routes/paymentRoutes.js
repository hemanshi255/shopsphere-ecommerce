const express = require("express");
const router = express.Router();

const { createPayment } = require("../controllers/paymentController");

const { protect } = require("../middleware/authMiddleware");


router.post(
  "/create",
  protect,
  createPayment
);


module.exports = router;