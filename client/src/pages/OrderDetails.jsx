import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet-async";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);

  const getOrderDetails = useCallback(async () => {
    try {
      const res = await api.get(`/orders/${id}`);

      setOrder(res.data.order);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load order details",
      );
    }
  }, [id]);

  const cancelOrder = async () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?",
    );

    if (!confirmCancel) return;

    try {
      await api.patch(`/orders/${order._id}/cancel`);

      toast.success("Order cancelled successfully");

      getOrderDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel order");
    }
  };

  const downloadInvoice = async () => {
    try {
      const response = await api.get(`/invoice/${order._id}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `Invoice-${order._id}.pdf`);

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success("Invoice downloaded successfully");
    } catch (error) {
      console.log(error);

      toast.error("Failed to download invoice");
    }
  };

  const getStatusStyle = (status) => {
    if (status === "Delivered") return "bg-success";

    if (status === "Shipped") return "bg-primary";

    if (status === "Processing") return "bg-info text-dark";

    if (status === "Cancelled") return "bg-danger";

    return "bg-warning text-dark";
  };

  useEffect(() => {
    getOrderDetails();
  }, [getOrderDetails]);

  if (!order) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary"></div>

        <p className="mt-3">Loading order details...</p>
      </div>
    );
  }

  const canonicalUrl = window.location.href;

  return (
    <>
      <Helmet>
        <title>Order Details | ShopSphere</title>

        <meta
          name="description"
          content="View complete details of your ShopSphere order, including purchased items, shipping address, payment method, order status, and delivery updates."
        />

        <meta
          name="keywords"
          content="ShopSphere order details, order status, track order, purchase details, ecommerce order, shipping details"
        />

        <meta property="og:title" content="Order Details | ShopSphere" />

        <meta
          property="og:description"
          content="View complete details of your ShopSphere order, including purchased items, shipping address, payment method, order status, and delivery updates."
        />

        <meta property="og:type" content="website" />

        <meta property="og:url" content={canonicalUrl} />
        <link rel="canonical" href={canonicalUrl} />

        <meta name="robots" content="noindex, nofollow" />

        <meta name="author" content="ShopSphere" />
      </Helmet>
      <div className="container py-4">
        {/* Back Button */}

        <Link to="/my-orders" className="btn btn-outline-secondary mb-4">
          ← Back to Orders
        </Link>

        {/* Header Card */}

        <div className="card shadow-lg border-0 mb-4">
          <div className="card-body shipping-address-product-detail">
            <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
              <div>
                <h3 className="fw-bold mb-2">Order Details</h3>

                <p className="text-muted mb-1">Order ID</p>

                <div className="bg-light p-2 rounded text-break">
                  {order._id}
                </div>
              </div>

              <div className="text-md-end">
                <p className="text-muted mb-2">Order Status</p>

                <span
                  className={`badge px-4 py-2 fs-6 ${getStatusStyle(order.status)}`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Products */}

        <div className="card shadow-lg border-0 mb-4">
          <div className="card-body shipping-address-product-detail">
            <h4 className="fw-bold mb-4">🛒 Products</h4>

            {order.products.map((item) => (
              <div key={item._id} className="border rounded p-3 mb-3">
                <div className="row align-items-center">
                  <div className="col-12 col-md-3 text-center mb-3 mb-md-0">
                    <img
                      src={
                        item.product.image?.startsWith("http")
                          ? item.product.image
                          : `https://shopsphere-ecommerce-backend-i2tb.onrender.com/uploads/${item.product.image}`
                      }
                      alt={item.product.name}
                      className="img-fluid rounded"
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  <div className="col-12 col-md-9">
                    <h5 className="fw-bold">{item.product.name}</h5>

                    <div className="row">
                      <div className="col-6 col-md-4">
                        <p className="mb-1 text-muted">Quantity</p>

                        <strong>{item.quantity}</strong>
                      </div>

                      <div className="col-6 col-md-4">
                        <p className="mb-1 text-muted">Price</p>

                        <strong>₹{item.price}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Tracking */}

        <div className="card shadow-lg border-0 mb-4">
          <div className="card-body shipping-address-product-detail">
            <h4 className="fw-bold mb-4">🚚 Order Tracking</h4>

            {order.statusHistory?.map((item, index) => (
              <div key={index} className="d-flex mb-4">
                <div className="me-3">
                  <div
                    className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: "35px",
                      height: "35px",
                    }}
                  >
                    ✓
                  </div>
                </div>

                <div>
                  <h6 className="fw-bold mb-1">{item.status}</h6>

                  <p className="text-muted mb-0">
                    {new Date(item.date).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}

        {order.shippingAddress && (
          <div className="card shadow-lg border-0 mb-4 ">
            <div className="card-body shipping-address-product-detail">
              <h4 className="fw-bold mb-3">📍 Shipping Address</h4>

              <p className="mb-1">
                <strong>Name:</strong> {order.shippingAddress?.fullName}
              </p>

              <p className="mb-1">
                <strong>Phone:</strong> {order.shippingAddress?.phone}
              </p>

              <p className="mb-1">
                <strong>Address:</strong> {order.shippingAddress?.address}
              </p>

              <p className="mb-1">
                <strong>City:</strong> {order.shippingAddress?.city}
              </p>

              <p className="mb-1">
                <strong>State:</strong> {order.shippingAddress?.state}
              </p>

              <p className="mb-1">
                <strong>Pincode:</strong> {order.shippingAddress?.pincode}
              </p>

              <p className="mb-0">
                <strong>Country:</strong> {order.shippingAddress?.country}
              </p>
            </div>
          </div>
        )}

        {/* Summary */}

        <div className="card shadow-lg border-0">
          <div className="card-body shipping-address-product-detail">
            <h4 className="fw-bold mb-3">📦 Order Summary</h4>

            <div className="d-flex justify-content-between mb-2">
              <span>Total Amount</span>

              <strong>₹{order.totalAmount}</strong>
            </div>

            <div className="d-flex justify-content-between">
              <span>Order Date</span>

              <strong>{new Date(order.createdAt).toLocaleDateString()}</strong>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center gap-2">
          <button
            className="btn btn-primary mt-4 py-3"
            onClick={downloadInvoice}
          >
            <FontAwesomeIcon icon={faDownload} size="lg" /> Download Invoice
          </button>

          {(order.status === "Pending" || order.status === "Processing") && (
            <button className="btn btn-danger mt-4 py-3" onClick={cancelOrder}>
              <FontAwesomeIcon icon={faXmark} size="lg" /> Cancel Order
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default OrderDetails;
