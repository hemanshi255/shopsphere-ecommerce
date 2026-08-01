import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getMyOrders();
  }, []);

  const getMyOrders = async () => {
    try {
      const res = await api.get("/orders/my-orders");

      setOrders(res.data.orders);
    } catch (error) {
      console.log(error);
    }
  };

  const getStatusColor = (status) => {
    if (status === "Pending") {
      return "bg-warning text-dark";
    }

    if (status === "Processing") {
      return "bg-info text-dark";
    }

    if (status === "Shipped") {
      return "bg-primary";
    }

    if (status === "Delivered") {
      return "bg-success";
    }

    if (status === "Cancelled") {
      return "bg-danger";
    }

    return "bg-secondary";
  };

  const canonicalUrl = window.location.href;

  return (
    <>
      <Helmet>
        <title>My Orders | ShopSphere</title>

        <meta
          name="description"
          content="View and track all your ShopSphere orders. Check order status, shipping details, payment information, and purchase history in one place."
        />

        <meta
          name="keywords"
          content="ShopSphere orders, my orders, order history, order tracking, ecommerce orders, purchase history, track order"
        />

        <meta property="og:title" content="My Orders | ShopSphere" />

        <meta
          property="og:description"
          content="View and track all your ShopSphere orders. Check order status, shipping details, payment information, and purchase history in one place."
        />

        <meta property="og:type" content="website" />

        <meta property="og:url" content={canonicalUrl} />
        <link rel="canonical" href={canonicalUrl} />

        <meta name="robots" content="noindex, nofollow" />

        <meta name="author" content="ShopSphere" />
      </Helmet>

      <div className="container mt-4">
        <h2 className="mb-4">My Orders</h2>

        {orders.length === 0 ? (
          <div className="alert alert-info">No Orders Found</div>
        ) : (
          orders.map((order) => (
            <div className="card mb-4 shadow-sm" key={order._id}>
              <div className="card-body">
                <div className="d-flex flex-column flex-md-row justify-content-md-between align-items-center text-center gap-3">
                  <h6 className="mb-0 text-break text-center">
                    Order ID:
                    <br className="d-md-none" /> {order._id}
                  </h6>
                  <span
                    className={`badge px-4 py-2 fs-6 fw-semibold  ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>

                <hr />

                {order.products.map((item) => (
                  <div
                    className="d-flex align-items-center mb-3"
                    key={item._id}
                  >
                    <img
                      src={
                        product.image?.startsWith("http")
                          ? product.image
                          : `https://shopsphere-ecommerce-backend-i2tb.onrender.com/uploads/${product.image}`
                      }
                      alt={item.product.name}
                      width="70"
                      height="70"
                      className="rounded me-3"
                    />

                    <div>
                      <h6>{item.product.name}</h6>

                      <p className="mb-0">Quantity: {item.quantity}</p>

                      <p className="mb-0">Price: ₹{item.price}</p>
                    </div>
                  </div>
                ))}

                <hr />

                <h5>Total: ₹{order.totalAmount}</h5>

                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                <Link
                  to={`/orders/${order._id}`}
                  className="btn add-product-btn"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default MyOrders;
