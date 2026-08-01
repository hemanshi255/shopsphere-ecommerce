import { useEffect, useState, useCallback } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import "../../css/navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faCalendarDays,
  faEnvelope,
  faLocationDot,
  faRectangleList,
  faUser,
  faFileExcel,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet-async";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("All");

  const getOrders = useCallback(async () => {
    try {
      const response = await api.get(
        `/orders?search=${search}&status=${status}`,
      );

      setOrders(response.data.orders || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to get orders");
    }
  }, [search, status]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  const updateStatus = async (orderId, status) => {
    try {
      await api.patch(`/orders/${orderId}/status`, {
        status,
      });

      toast.success("Status updated");

      getOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const statusClass = (status) => {
    if (status === "Delivered") return "bg-primary";

    if (status === "Shipped") return "bg-primary";

    if (status === "Processing") return "bg-info text-dark";

    if (status === "Cancelled") return "bg-danger";

    return "bg-warning text-dark";
  };

  const exportOrdersExcel = async () => {
    try {
      const response = await api.get("/reports/orders/excel", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");

      link.href = url;
      link.download = "Orders_Report.xlsx";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success("Orders Excel downloaded successfully");
    } catch (error) {
      toast.error("Failed to download Excel");
    }
  };

  const exportOrdersPdf = async () => {
    try {
      const response = await api.get("/reports/orders/pdf", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");

      link.href = url;

      link.download = "Orders_Report.pdf";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success("Orders PDF downloaded successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to download PDF");
    }
  };

  const canonicalUrl = window.location.href;

  return (
    <>
      <Helmet>
        <title>Manage Orders | ShopSphere Admin</title>

        <meta
          name="description"
          content="Manage and track customer orders from the ShopSphere Admin Dashboard. Update order status, review order details, and handle customer purchases."
        />

        <meta
          name="keywords"
          content="ShopSphere admin, manage orders, ecommerce orders, order management, customer orders, admin dashboard"
        />

        <meta property="og:title" content="Manage Orders | ShopSphere Admin" />

        <meta
          property="og:description"
          content="Manage and track customer orders from the ShopSphere Admin Dashboard. Update order status, review order details, and handle customer purchases."
        />

        <meta property="og:type" content="website" />

        <meta property="og:url" content={canonicalUrl} />
        <link rel="canonical" href={canonicalUrl} />

        <meta name="robots" content="noindex, nofollow" />

        <meta name="author" content="ShopSphere" />
      </Helmet>

      <div className="container mt-4">
        <h2 className="fw-bold mb-4">Manage Orders</h2>

        <div className="shadow-sm mb-4 ">
          <div className="filter-main-border">
            <div className="row g-3 align-items-center">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by order id, name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="col-md-4">
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="col-md-4">
                <div className="row g-2">
                  <div className="col-6">
                    <button
                      className="btn btn-success w-100"
                      onClick={exportOrdersExcel}
                    >
                      <FontAwesomeIcon icon={faFileExcel} className="me-2" />
                      Excel
                    </button>
                  </div>

                  <div className="col-6">
                    <button
                      className="btn btn-danger flex-fill w-100"
                      onClick={exportOrdersPdf}
                    >
                      <FontAwesomeIcon icon={faFilePdf} className="me-2" />
                      PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {orders.map((order) => (
          <div className="card shadow-sm mb-4 border-0" key={order._id}>
            <div className="card-header nav-dark text-white d-flex justify-content-between align-items-center">
              <div>
                <strong>Order #{order._id.slice(-8)}</strong>

                <br />

                <small>
                  {" "}
                  <FontAwesomeIcon icon={faCalendarDays} className="me-1" />
                  {new Date(order.createdAt).toLocaleDateString()}
                </small>
              </div>
              <h5>
                <span className={`badge ${statusClass(order.status)}`}>
                  {order.status}
                </span>
              </h5>
            </div>

            <div className="card-body">
              <div className="mb-3">
                <h5 className="fw-bold">
                  <FontAwesomeIcon
                    icon={faRectangleList}
                    className="me-1 text-primary"
                  />
                  Customer Details
                </h5>

                <p className="mb-1">
                  <FontAwesomeIcon icon={faUser} className="me-1" />{" "}
                  {order.user?.name}
                </p>

                <p>
                  <FontAwesomeIcon icon={faEnvelope} className="me-1" />{" "}
                  {order.user?.email}
                </p>
              </div>
              <hr />
              <h5 className="fw-bold mt-4">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="me-1 text-danger"
                />
                Shipping Address
              </h5>

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

              <p className="mb-3">
                <strong>Country:</strong> {order.shippingAddress?.country}
              </p>
              <hr />
              <h5 className="fw-bold">
                <FontAwesomeIcon icon={faBox} className="me-1 text-warning" />{" "}
                Products
              </h5>

              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Product</th>

                      <th>Quantity</th>

                      <th>Price</th>
                    </tr>
                  </thead>

                  <tbody>
                    {order.products.map((item) => (
                      <tr key={item._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={
                                item.product.image?.startsWith("http")
                                  ? item.product.image
                                  : `https://shopsphere-ecommerce-backend-i2tb.onrender.com/uploads/${item.product.image}`
                              }
                              width="60"
                              height="60"
                              className="rounded me-3"
                              alt=""
                            />

                            {item.product.name}
                          </div>
                        </td>

                        <td>{item.quantity}</td>

                        <td>₹{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <h5 className="fw-bold">Total: ₹{order.totalAmount}</h5>

                <select
                  className="form-select"
                  style={{
                    width: "200px",
                  }}
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                >
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default AdminOrders;
