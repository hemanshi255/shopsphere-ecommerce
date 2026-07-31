const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { downloadInvoice } = require("../controllers/invoiceController");

router.get("/:id", protect, downloadInvoice);

module.exports = router;