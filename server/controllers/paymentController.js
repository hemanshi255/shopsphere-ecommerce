const razorpay = require("../utils/razorpay");

const createPayment = async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100,

      currency: "INR",

      receipt: "receipt_" + Date.now(),
    };

    

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,

      order,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: "Payment creation failed",
    });
  }
};

module.exports = {
  createPayment,
};
