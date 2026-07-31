const PDFDocument = require("pdfkit");
const Order = require("../models/order");

const downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("products.product", "name");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const doc = new PDFDocument({
      margin: 40,
      size: "A4",
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Invoice-${order._id}.pdf`
    );

    doc.pipe(res);

   //  ===================================================
    // HEADER
    // ===================================================

    doc
      .rect(0, 0, 595, 90)
      .fill("#0D5C63");

    doc
      .fillColor("white")
      .fontSize(28)
      .font("Helvetica-Bold")
      .text("ShopSphere", 40, 25);

    doc
      .fontSize(16)
      .font("Helvetica")
      .text("INVOICE", 450, 35);

    doc.moveDown(3);

    // ===================================================
    // INVOICE INFO BOX
    // ===================================================

    doc
      .roundedRect(40, 110, 515, 100, 8)
      .lineWidth(1)
      .strokeColor("#dcdcdc")
      .stroke();

    doc
      .fillColor("#0D5C63")
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("Invoice Information", 55, 125);

    doc
      .fillColor("black")
      .fontSize(11)
      .font("Helvetica");

    doc.text(`Invoice No : ${order._id}`, 55, 150);

    doc.text(
      `Invoice Date : ${new Date(order.createdAt).toLocaleDateString()}`,
      55,
      170
    );

    doc.text(`Order Status : ${order.status}`, 330, 150);

    doc.text(
      `Payment : ${order.paymentMethod} (${order.paymentStatus})`,
      330,
      170
    );

    // ===================================================
    // CUSTOMER DETAILS
    // ===================================================

    doc
      .roundedRect(40, 230, 250, 165, 8)
      .strokeColor("#dcdcdc")
      .stroke();

    doc
      .fillColor("#0D5C63")
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("Customer Details", 55, 245);

    doc
      .fillColor("black")
      .fontSize(11)
      .font("Helvetica");

    doc.text(`Name : ${order.user.name}`, 55, 270);

    doc.text(`Email : ${order.user.email}`, 55, 290);

    // ===================================================
    // SHIPPING ADDRESS
    // ===================================================

    doc
      .roundedRect(305, 230, 250, 165, 8)
      .strokeColor("#dcdcdc")
      .stroke();

    doc
      .fillColor("#0D5C63")
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("Shipping Address", 320, 245);

    doc
      .fillColor("black")
      .fontSize(11)
      .font("Helvetica");

    doc.text(order.shippingAddress.fullName, 320, 270);

    doc.text(order.shippingAddress.phone, 320, 288);

    doc.text(order.shippingAddress.address, 320, 306, {
      width: 210,
    });

    doc.text(
      `${order.shippingAddress.city}, ${order.shippingAddress.state}`,
      320,
      338
    );

    doc.text(
      `${order.shippingAddress.pincode}, ${order.shippingAddress.country}`,
      320,
      356
    );

    // ===================================================
    // PRODUCTS TITLE
    // ===================================================

    doc
      .fillColor("#0D5C63")
      .fontSize(16)
      .font("Helvetica-Bold")
      .text("Products", 40, 390);

    // ===================================================
    // TABLE HEADER
    // ===================================================

    const tableTop = 420;

    doc
      .rect(40, tableTop, 515, 28)
      .fill("#0D5C63");

    doc.fillColor("white").fontSize(11).font("Helvetica-Bold");

    doc.text("Product", 55, tableTop + 8);

    doc.text("Qty", 300, tableTop + 8);

    doc.text("Price", 380, tableTop + 8);

    doc.text("Total", 470, tableTop + 8);

    let y = tableTop + 30;

    doc.font("Helvetica").fillColor("black");

    order.products.forEach((item) => {

  const rowHeight = 40;

  doc.rect(40, y, 515, rowHeight).stroke("#dcdcdc");

  doc.text(item.product.name, 55, y + 10, {
    width: 220,
  });

  doc.text(item.quantity.toString(), 300, y + 10, {
    width: 40,
    align: "center",
  });

  doc.text(`Rs. ${item.price}`, 360, y + 10, {
    width: 80,
    align: "right",
  });

  doc.text(`Rs. ${item.price * item.quantity}`, 455, y + 10, {
    width: 80,
    align: "right",
  });

  y += rowHeight;

});

    // ===================================================
    // TOTAL BOX
    // ===================================================

    y += 25;

    doc
      .roundedRect(340, y, 215, 80, 8)
      .fill("#F8F9FA")
      .stroke("#dcdcdc");

    doc
      .fillColor("#0D5C63")
      .fontSize(15)
      .font("Helvetica-Bold")
      .text("Grand Total", 360, y + 15);

    doc
      .fillColor("black")
      .fontSize(22)
      .font("Helvetica-Bold")
      .text(`Rs. ${order.totalAmount}`, 360, y + 42);

    // ===================================================
    // FOOTER
    // ===================================================

    doc
      .fillColor("#777")
      .fontSize(10)
      .font("Helvetica")
      .text(
        "Thank you for shopping with ShopSphere!",
        40,
        760,
        {
          align: "center",
          width: 515,
        }
      );

    doc.end();
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  downloadInvoice,
};