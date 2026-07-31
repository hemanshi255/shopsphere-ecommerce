import { useEffect, useState } from "react";
import api from "../../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faUsers,
  faShoppingCart,
  faMoneyBillTrendUp,
  faTriangleExclamation,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";
import SalesChart from "../../components/SalesChart";
import OrderStatusChart from "../../components/OrderStatusChart";
import { Helmet } from "react-helmet-async";


function AdminDashboard() {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,

    recentProducts: [],
    recentUsers: [],
    recentOrders: [],
  });

  const getStats = async () => {
    try {
      const response = await api.get("/admin/stats");

      setStats(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getOrderStatusData = async () => {
    try {
      const res = await api.get("/analytics/order-status");
      setOrderStatusData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getLowStockProducts = async () => {
    try {
      const res = await api.get("/admin/low-stock");

      setLowStockProducts(res.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  const getSalesData = async () => {
    try {
      const res = await api.get("/analytics/sales");

      setSalesData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const chartData = salesData.map((item) => ({
    month: months[item.month],

    totalSales: item.totalSales,
  }));

  const pieData = orderStatusData.map((item) => ({
    name: item._id,
    value: item.value,
  }));

  useEffect(() => {
    getStats();
    getLowStockProducts();
    getSalesData();
    getOrderStatusData();
  }, []);

  const canonicalUrl = window.location.href;

  return (
    
    <>

      <Helmet>
        <title>Admin Dashboard | ShopSphere</title>

        <meta
          name="description"
          content="ShopSphere Admin Dashboard for managing products, orders, users, categories, coupons, and analytics."
        />

        <meta
          name="keywords"
          content="all products, online shopping, ShopSphere products, electronics, fashion, home essentials, accessories, best deals, ecommerce"
        />

        <meta property="og:title" content="Admin Dashboard | ShopSphere" />

        <meta
          property="og:description"
          content="ShopSphere Admin Dashboard for managing products, orders, users, categories, coupons, and analytics."
        />

        <meta property="og:type" content="website" />

        <meta property="og:url" content={canonicalUrl} />
        <link rel="canonical" href={canonicalUrl} />

         <meta
    name="robots"
    content="noindex, nofollow"
  />

        <meta name="author" content="ShopSphere" />
      </Helmet>

    <div className="container-fluid">
      <h2 className="fw-bold mb-4">Dashboard</h2>

      <div className="row">
        <div className="col-12 col-md-6 col-lg-3 mb-4">
          <div className="card card-light-bg shadow h-100 card-border">
            <div className="card-body d-flex flex-column justify-content-between p-4 text-center">
              <div>
                <FontAwesomeIcon icon={faBox} size="lg" />
                <h5 className="mt-3 mb-0">Total Products</h5>
              </div>

              <h4 className="mb-0">{stats.totalProducts}</h4>
            </div>
          </div>
        </div>

        {/* Total Users */}
        <div className="col-12 col-md-6 col-lg-3 mb-4">
          <div className="card card-light-bg shadow h-100 card-border">
            <div className="card-body d-flex flex-column justify-content-between p-4 text-center">
              <div>
                <FontAwesomeIcon icon={faUsers} size="lg" />
                <h5 className="mt-3 mb-0">Total Users</h5>
              </div>

              <h4 className="mb-0">{stats.totalUsers}</h4>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="col-12 col-md-6 col-lg-3 mb-4">
          <div className="card card-light-bg shadow h-100 card-border">
            <div className="card-body d-flex flex-column justify-content-between p-4 text-center">
              <div>
                <FontAwesomeIcon icon={faShoppingCart} size="lg" />
                <h5 className="mt-3 mb-0">Total Orders</h5>
              </div>

              <h4 className="mb-0">{stats.totalOrders}</h4>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="col-12 col-md-6 col-lg-3 mb-4">
          <div className="card card-light-bg shadow h-100 card-border">
            <div className="card-body d-flex flex-column justify-content-between p-4 text-center">
              <div>
                <FontAwesomeIcon icon={faMoneyBillTrendUp} size="lg" />
                <h5 className="mt-3 mb-0">Total Revenue</h5>
              </div>

              <h4 className="mb-0">₹ {stats.totalRevenue}</h4>
            </div>
          </div>
        </div>

        {/* <SalesChart data={chartData} />


        <OrderStatusChart data={pieData} /> */}

        <div className="row justify-content-center mb-4">
          <div className="col-lg-7 mb-4">
            <SalesChart data={chartData} />
          </div>

          <div className="col-lg-5 mb-4">
            <OrderStatusChart data={pieData} />
          </div>
        </div>


       

        <div className="card shadow mt-4">
          <div className="card-body">
            <h4 className="mb-3">
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                className="text-danger me-1"
              />
              Low Stock Products
            </h4>
            {lowStockProducts.length === 0 ? (
              <p>All products have enough stock</p>
            ) : (
              <table className="table table-bordered table-hover">
                <thead className="table-thead-bg">
                  <tr>
                    <th>Product</th>
                    <th>Stock</th>
                  </tr>
                </thead>

                <tbody>
                  {lowStockProducts.map((product) => (
                    <tr key={product._id}>
                      <td>{product.name}</td>

                      <td>
                        <span className="badge bg-danger">{product.stock}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="card shadow mt-4">
          <div className="card-body">
            <h4 className="mb-3">
              <FontAwesomeIcon icon={faBox} className="text-warning me-1" />
              Recent Products
            </h4>
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-thead-bg">
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                  </tr>
                </thead>

                <tbody>
                  {stats.recentProducts.map((product) => (
                    <tr key={product._id}>
                      <td>{product.name}</td>

                      <td>{product.category}</td>

                      <td>₹ {product.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card shadow mt-4">
          <div className="card-body">
            <h4 className="mb-3">
              <FontAwesomeIcon icon={faUsers} className="text-primary me-1" />
              Recent Users
            </h4>
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-thead-bg">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>

                <tbody>
                  {stats.recentUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>

                      <td>{user.email}</td>

                      <td>{user.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card shadow mt-4">
          <div className="card-body">
            <h4 className="mb-3">
              <FontAwesomeIcon
                icon={faCartShopping}
                className="text-success me-1"
              />
              Recent Orders
            </h4>

            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-thead-bg">
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Payment</th>
                    <th>Payment Status</th>
                    <th>Order Status</th>
                    <th>Total</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {stats.recentOrders.length > 0 ? (
                    stats.recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td>#{order._id.slice(-8)}</td>

                        <td>{order.user?.name}</td>
                        <td>
                          <span
                            className={`badge ${
                              order.paymentMethod === "ONLINE"
                                ? "bg-primary"
                                : "bg-secondary"
                            }`}
                          >
                            {order.paymentMethod}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`badge ${
                              order.paymentStatus === "Paid"
                                ? "bg-success"
                                : "bg-warning text-dark"
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`badge
                      ${
                        order.status === "Delivered"
                          ? "bg-success"
                          : order.status === "Shipped"
                            ? "bg-primary"
                            : order.status === "Processing"
                              ? "bg-info text-dark"
                              : order.status === "Cancelled"
                                ? "bg-danger"
                                : "bg-warning text-dark"
                      }`}
                          >
                            {order.status}
                          </span>
                        </td>

                        <td>₹ {order.totalAmount}</td>

                        <td>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No Orders Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
    
  );
}

export default AdminDashboard;
