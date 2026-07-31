const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const imageFiles = req.files || [];

    const imageNames = imageFiles.map((file) => file.filename);

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      image: imageNames.length > 0 ? imageNames[0] : "",
      images: imageNames,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { search, category, sort, page = 1, limit = 10 } = req.query;

    // Query object
    const query = {};

    // Search by product name
    if (search) {
      query.name = {
        $regex: search,
        $options: "i",
      };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Sorting
    let sortOption = { createdAt: -1 };

    if (sort === "price") {
      sortOption = { price: 1 };
    } else if (sort === "-price") {
      sortOption = { price: -1 };
    } else if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    } else if (sort === "newest") {
      sortOption = { createdAt: -1 };
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Total products matching the query
    const totalProducts = await Product.countDocuments(query);

    // Fetch products

    const products = await Product.find(query)
      .populate("createdBy", "name email")
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      totalProducts,
      currentPage: Number(page),
      totalPages: Math.ceil(totalProducts / Number(limit)),
      count: products.length,
      products,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "createdBy",
      "name email",
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Update text fields
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.category = req.body.category || product.category;
    product.stock = req.body.stock || product.stock;

    // Image update will be added next

   if (req.files && req.files.length > 0) {
  // Delete old images
  if (product.images && product.images.length > 0) {
    product.images.forEach((img) => {
      const imagePath = path.join(__dirname, "../uploads", img);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });
  } else if (product.image) {
    // Support old products with only one image
    const imagePath = path.join(__dirname, "../uploads", product.image);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  const imageNames = req.files.map((file) => file.filename);

  product.image = imageNames[0];
  product.images = imageNames;
}

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete image if it exists
    if (product.image) {
      const imagePath = path.join(__dirname, "../uploads", product.image);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete product from database
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
