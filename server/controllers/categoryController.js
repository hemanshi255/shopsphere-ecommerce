const Category = require("../models/category");
const Product = require("../models/product");

const getCategories = async (req, res) => {
  try {

    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const categories = await Category.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json(categories);

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch categories",
      error: error.message,
    });

  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const exists = await Category.findOne({ name });

    if (exists) {
      return res.status(400).json({
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name,
      description,
    });

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create category",
      error: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    const existingCategory = await Category.findOne({
      name,
      _id: { $ne: req.params.id },
    });

    if (existingCategory) {
      return res.status(400).json({
        message: "Category already exists",
      });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        status,
      },
      { new: true },
    );

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update category",
      error: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const products = await Product.countDocuments({
      category: category.name,
    });

    if (products > 0) {
      return res.status(400).json({
        message: `Cannot delete category. ${products} product(s) are using it.`,
      });
    }

    await category.deleteOne();

    res.json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete category",
      error: error.message,
    });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
