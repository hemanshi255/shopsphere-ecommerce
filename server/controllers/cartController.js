const Cart = require("../models/cart");
const Product = require("../models/product");

// Add product to cart
const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      if (product.stock <= 0) {
        return res.status(400).json({
          message: "Product is out of stock",
        });
      }

      cart = await Cart.create({
        user: req.user.id,
        products: [
          {
            product: productId,
            quantity: 1,
          },
        ],
      });

      return res.status(201).json({
        message: "Product added to cart",
        cart,
      });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (productIndex > -1) {
      if (cart.products[productIndex].quantity >= product.stock) {
        return res.status(400).json({
          message: `Only ${product.stock} items available`,
        });
      }

      cart.products[productIndex].quantity += 1;
    } else {
      if (product.stock <= 0) {
        return res.status(400).json({
          message: "Product is out of stock",
        });
      }

      cart.products.push({
        product: productId,
        quantity: 1,
      });
    }

    await cart.save();

    res.status(200).json({
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get user cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user.id,
    }).populate("products.product");

    res.status(200).json({
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Remove product from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.products = cart.products.filter(
      (item) => item.product.toString() !== productId,
    );

    await cart.save();

    res.status(200).json({
      message: "Product removed from cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { action } = req.body;

    const cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.products.find(
      (item) => item.product.toString() === productId,
    );

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (!item) {
      return res.status(404).json({
        message: "Product not found in cart",
      });
    }

    if (action === "increase") {
      if (item.quantity >= product.stock) {
        return res.status(400).json({
          message: `Only ${product.stock} items available`,
        });
      }

      item.quantity += 1;
    }

    if (action === "decrease") {
      if (item.quantity > 1) {
        item.quantity -= 1;
      }
    }

    await cart.save();

    res.status(200).json({
      message: "Quantity updated",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  updateQuantity,
};
