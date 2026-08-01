const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const sendWelcomeEmail = async (email, name) => {

  try {

    transporter.sendMail({

      from: process.env.EMAIL_USER,

      to: email,

      subject: "Welcome to Product Management",

      html: `
        <h2>Welcome ${name}!</h2>

        <p>Thank you for registering in our Product Management System.</p>

        <p>We are happy to have you with us.</p>

        <br>

        <p>Best Regards,</p>

        <p><strong>Product Management Team</strong></p>
      `,

    })
    .then(() => {
        console.log("Welcome email sent successfully");
    })
    .catch((error)=>{
        console.log("Email Error:", error.message);
    });

  } catch (error) {

    console.log("Email Error:", error);

  }

};


const sendResetPasswordEmail = async (email, resetUrl) => {
  try {

    await transporter.sendMail({

      from: process.env.EMAIL_USER,

      to: email,

      subject: "Password Reset Request",

      html: `
        <h2>Password Reset</h2>

        <p>You requested to reset your password.</p>

        <p>Click the button below to reset your password.</p>

        <a
          href="${resetUrl}"
          style="
            display:inline-block;
            padding:12px 20px;
            background:#0d6efd;
            color:#fff;
            text-decoration:none;
            border-radius:5px;
          "
        >
          Reset Password
        </a>

        <p>This link will expire in 10 minutes.</p>

        <p>If you did not request this, please ignore this email.</p>
      `,

    });

    console.log("Reset password email sent successfully");

  } catch (error) {

    console.log("Email Error:", error);

  }
};

const sendOrderConfirmationEmail = async (
  email,
  name,
  order
) => {
  try {

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Order Confirmed Successfully",

      html: `
        <h2>Hello ${name},</h2>

        <p>Your order has been placed successfully.</p>

        <p>
          <b>Order ID:</b> ${order._id}
        </p>

        <p>
          <b>Total Amount:</b> ₹${order.totalAmount}
        </p>

        <p>
          <b>Payment Method:</b> ${order.paymentMethod}
        </p>

        <p>
          Thank you for shopping with us.
        </p>
      `
    });

    console.log("Order confirmation email sent");

  } catch (error) {

    console.log("Email Error:", error);

  }
};

const sendOrderStatusEmail = async (
  email,
  name,
  order
) => {
  try {

    let subject = "Order Status Updated";
    let message = "";


    if (order.status === "Shipped") {

      subject = "Your Order Has Been Shipped 📦";

      message = `
        <p>Your order has been shipped and is on the way.</p>
        <p>You will receive your order soon.</p>
      `;

    }
    else if (order.status === "Delivered") {

      subject = "Your Order Has Been Delivered ✅";

      message = `
        <p>Your order has been delivered successfully.</p>
        <p>Thank you for shopping with us.</p>
      `;

    }
    else if (order.status === "Cancelled") {

      subject = "Your Order Has Been Cancelled ❌";

      message = `
        <p>Your order has been cancelled.</p>
        <p>If you have any questions, please contact support.</p>
      `;

    }
    else {

      message = `
        <p>Your order status is now ${order.status}.</p>
      `;
    }


    await transporter.sendMail({

      from: process.env.EMAIL_USER,

      to: email,

      subject: subject,

      html: `
        <h2>Hello ${name},</h2>

        ${message}

        <p>
          <b>Order ID:</b> ${order._id}
        </p>

        <p>
          <b>Total Amount:</b> ₹${order.totalAmount}
        </p>

        <br>

        <p>Thank you for shopping with us.</p>
      `
    });


    console.log("Order status email sent");


  } catch (error) {

    console.log("Order status email error:", error);

  }
};

module.exports = {
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusEmail
};