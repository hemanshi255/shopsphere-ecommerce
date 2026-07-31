const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    coupon: {
      code: {
        type: String,
        default: null,
      },
      discountAmount: {
        type: Number,
        default: 0,
      },
    },

    paymentMethod: {
  type: String,
  enum: ["COD", "ONLINE"],
  default: "COD",
},

paymentStatus: {
  type: String,
  enum: ["Pending", "Paid", "Failed"],
  default: "Pending",
},

paymentId: {
  type: String,
  default: null,
},

    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    statusHistory: [
  {
    status: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
],

shippingAddress: {
  fullName: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },

  city: {
    type: String,
    required: true,
  },

  state: {
    type: String,
    required: true,
  },

  pincode: {
    type: String,
    required: true,
  },

  country: {
    type: String,
    required: true,
  },
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("order", orderSchema);