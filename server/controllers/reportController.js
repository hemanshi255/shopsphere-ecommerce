const ExcelJS = require("exceljs");
const Order = require("../models/order");
const PDFDocument = require("pdfkit");

// Export Orders Excel
const exportOrdersExcel = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Orders Report");

    // Report Title
    worksheet.mergeCells("A1:H1");
    worksheet.getCell("A1").value = "ShopSphere - Orders Report";
    worksheet.getCell("A1").font = {
      bold: true,
      size: 18,
      color: { argb: "FFFFFFFF" },
    };
    worksheet.getCell("A1").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "0D5C63" },
    };
    worksheet.getCell("A1").alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    // Report Date
    worksheet.mergeCells("A2:H2");
    worksheet.getCell("A2").value =
      `Generated On: ${new Date().toLocaleString()}`;
    worksheet.getCell("A2").font = {
      italic: true,
    };
    worksheet.getCell("A2").alignment = {
      horizontal: "center",
    };

    worksheet.columns = [
      { header: "", key: "orderId", width: 25 },
      { header: "", key: "customer", width: 25 },
      { header: "", key: "email", width: 30 },
      { header: "", key: "paymentMethod", width: 20 },
      { header: "", key: "paymentStatus", width: 20 },
      { header: "", key: "status", width: 20 },
      { header: "", key: "totalAmount", width: 18 },
      { header: "", key: "date", width: 18 },
    ];

    worksheet.getRow(4).values = [
      "Order ID",
      "Customer",
      "Email",
      "Payment Method",
      "Payment Status",
      "Order Status",
      "Total Amount",
      "Date",
    ];

    worksheet.getRow(4).height = 22;

    worksheet.getRow(4).eachCell((cell) => {
      cell.font = {
        bold: true,
        color: { argb: "FFFFFFFF" },
      };

      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "0D5C63",
        },
      };

      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
      };
    });

    orders.forEach((order) => {
      worksheet.insertRow(5 + worksheet.rowCount - 4, {
        orderId: order._id.toString(),
        customer: order.user?.name || "N/A",
        email: order.user?.email || "N/A",
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        status: order.status,
        totalAmount: order.totalAmount,
        date: new Date(order.createdAt).toLocaleDateString(),
      });
    });

    worksheet.getRow(1).font = { bold: true };

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="Orders_Report.xlsx"',
    );

    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };

        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
        };
      });
    });

    await workbook.xlsx.write(res);

    res.end();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const exportOrdersPdf = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const doc = new PDFDocument({
      margin: 30,
      size: "A4",
    });

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="Orders_Report.pdf"',
    );

    doc.pipe(res);

    doc.rect(20, 20, 555, 70).fill("#0D5C63");

    doc
      .fillColor("white")
      .fontSize(24)
      .font("Helvetica-Bold")
      .text("ShopSphere", 20, 35, {
        align: "center",
      });

    doc.fontSize(16).text("Orders Report", {
      align: "center",
    });

    doc.fontSize(10).text(`Generated On: ${new Date().toLocaleString()}`, {
      align: "center",
    });

    doc.moveDown(4);

    doc.fillColor("black");

    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0,
    );

    doc
      .font("Helvetica-Bold")
      .fontSize(13)
      .text(`Total Orders : ${orders.length}`);

    doc.text(`Total Revenue : Rs.${totalRevenue}`);

    doc.moveDown();

    // Table Header
    let y = doc.y;

    doc.fontSize(10).font("Helvetica-Bold").fillColor("#0D5C63");

    doc.text("Order ID", 30, y);
    doc.text("Customer", 110, y);
    doc.text("Payment", 220, y);
    doc.text("Status", 310, y);
    doc.text("Amount", 400, y);
    doc.text("Date", 480, y);

    doc.moveDown();

    doc.fillColor("black").font("Helvetica");

    // Order Rows
    orders.forEach((order) => {
      y = doc.y + 10;

      doc.text(`#${order._id.toString().slice(-8)}`, 30, y);

      doc.text(order.user?.name || "N/A", 110, y);

      doc.text(order.paymentMethod || "N/A", 220, y);

      doc.text(order.status, 310, y);

      doc.text(`Rs.${order.totalAmount}`, 400, y);

      doc.text(new Date(order.createdAt).toLocaleDateString(), 480, y);

      // row line
      doc
        .moveTo(30, y + 15)
        .lineTo(560, y + 15)
        .stroke();

      doc.moveDown(1.5);
    });

    // Footer
    const range = doc.bufferedPageRange();

    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);

      doc
        .fontSize(9)
        .fillColor("gray")
        .text("Generated by ShopSphere Admin Panel", 30, 780, {
          align: "left",
        });

      doc.text(`Page ${i + 1}`, 500, 780, {
        align: "right",
      });
    }

    doc.end();

    doc.end();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  exportOrdersExcel,
  exportOrdersPdf,
};
