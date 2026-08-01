const Product = require("../models/product");
// const fs = require("fs");
// const path = require("path");
const cloudinary = require("../config/cloudinary");

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

    const imageUrls = imageFiles.map((file) => file.path);
    const imagePublicIds = imageFiles.map((file) => file.filename);

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      image: imageUrls.length > 0 ? imageUrls[0] : "",
      imagePublicId: imagePublicIds.length > 0 ? imagePublicIds[0] : "",
      images: imageUrls,
      imagePublicIds,
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
      // Delete old Cloudinary images
      if (product.imagePublicIds && product.imagePublicIds.length > 0) {
        for (const publicId of product.imagePublicIds) {
          await cloudinary.uploader.destroy(publicId);
        }
      } else if (product.imagePublicId) {
        await cloudinary.uploader.destroy(product.imagePublicId);
      }

      const imageUrls = req.files.map((file) => file.path);
      const imagePublicIds = req.files.map((file) => file.filename);

      product.image = imageUrls[0];
      product.imagePublicId = imagePublicIds[0];
      product.images = imageUrls;
      product.imagePublicIds = imagePublicIds;
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
    if (product.imagePublicIds && product.imagePublicIds.length > 0) {
      for (const publicId of product.imagePublicIds) {
        await cloudinary.uploader.destroy(publicId);
      }
    } else if (product.imagePublicId) {
      await cloudinary.uploader.destroy(product.imagePublicId);
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
