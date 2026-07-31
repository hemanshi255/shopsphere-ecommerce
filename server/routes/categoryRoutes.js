const express = require("express");
const router = express.Router();

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const { protect } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Get All Categories
router.get("/", getCategories);

// Create Category (Admin Only)
router.post("/", protect, adminMiddleware, createCategory);

// Update Category (Admin Only)
router.put("/:id", protect, adminMiddleware, updateCategory);

// Delete Category (Admin Only)
router.delete("/:id", protect, adminMiddleware, deleteCategory);

module.exports = router;