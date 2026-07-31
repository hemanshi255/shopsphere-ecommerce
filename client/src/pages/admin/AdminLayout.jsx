import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faBox,
  faUsers,
  faTicket,
  faCartShopping,
  faUserGear,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import api from "../../api/axios";

function AdminLayout() {
  const navigate = useNavigate();
  const notificationRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const [showSidebar, setShowSidebar] = useState(false);
  const [user] = useState(JSON.parse(localStorage.getItem("user")));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getNotifications = async () => {
    try {
      const res = await api.get("/notifications");

      setNotifications(res.data.notifications);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const openNotification = async (notification) => {
    try {
      if (!notification.isRead) {
        await api.patch(`/notifications/${notification._id}/read`);
      }

      getNotifications();

      navigate(notification.link);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Desktop Admin Navbar */}
      <nav className="navbar nav-dark d-none d-lg-flex top-navbar">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 fw-bold text-white">
            ShopSphere
          </span>

          <div className="d-flex align-items-center gap-3">
            <div className="notification-wrapper" ref={notificationRef}>
              <button
                className="notification-btn"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <FontAwesomeIcon icon={faBell} />

                {unreadCount > 0 && (
                  <span className="notification-count">{unreadCount}</span>
                )}
              </button>

              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="notification-header">Notifications</div>

                  {notifications.length === 0 ? (
                    <div className="notification-empty">No Notifications</div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className={`notification-item ${
                          notification.isRead ? "" : "notification-unread"
                        }`}
                        onClick={() => openNotification(notification)}
                      >
                        <div className="notification-title">
                          {notification.title}
                        </div>

                        <div className="notification-message">
                          {notification.message}
                        </div>

                        <div className="notification-time">
                          {new Date(notification.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <button className="btn btn-danger" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="navbar nav-dark d-lg-none">
        <div className="container-fluid">
          <button
            className="btn btn-outline-light"
            onClick={() => setShowSidebar(true)}
          >
            ☰
          </button>

          <span className="navbar-brand mb-0 fw-bold text-white">
            ShopSphere
          </span>

          <div className="notification-wrapper">
            <button
              className="notification-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <FontAwesomeIcon icon={faBell} />

              {unreadCount > 0 && (
                <span className="notification-count">{unreadCount}</span>
              )}
            </button>

            {showNotifications && (
              <div className="notification-dropdown notification-dropdown-mobile">
                <div className="notification-header">Notifications</div>

                {notifications.length === 0 ? (
                  <div className="notification-empty">No Notifications</div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`notification-item ${
                        notification.isRead ? "" : "notification-unread"
                      }`}
                      onClick={() => openNotification(notification)}
                    >
                      <div className="notification-title">
                        {notification.title}
                      </div>

                      <div className="notification-message">
                        {notification.message}
                      </div>

                      <div className="notification-time">
                        {new Date(notification.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {showSidebar && (
        <div
          className="d-lg-none sidebar"
          onClick={() => setShowSidebar(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "280px",
            height: "100vh",
            zIndex: 1040,
          }}
        ></div>
      )}

      <div className="d-flex">
        <div
          className="bg-light text-white p-4 d-none d-lg-block"
          style={{
            width: "280px",
            height: "100vh",
            position: "fixed",
            top: 0,
            left: 0,
            padding: "20px",
          }}
        >
          {/* <h4 className="mb-4">
            Admin Panel
          </h4> */}

          <ul className="nav flex-column">
            <li className="nav-item">
              <div className="d-flex align-items-center py-2 admin-user-box ">
                <img
                  src={
                    user?.profileImage
                      ? `https://shopsphere-ecommerce-backend-i2tb.onrender.com/uploads/${user.profileImage}`
                      : "/default-profile.png"
                  }
                  alt="Profile"
                  width="40"
                  height="40"
                  className="rounded-circle me-2"
                />
                <div>
                  <h4 className="text-green text-capitalize mb-0">
                    {user?.name}
                  </h4>
                  <p className="mb-0">{user?.email}</p>
                </div>
              </div>
            </li>

            <hr />

            <li className="nav-item mb-3">
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `text-green text-decoration-none d-flex align-items-center sidebar-light w-100 ${
                    isActive ? "active" : ""
                  }`
                }
              >
                <FontAwesomeIcon icon={faHouse} className="me-3" />
                <span>Dashboard</span>
              </NavLink>
            </li>

            <li className="nav-item mb-3">
              <NavLink
                to="/admin/products"
                className={({ isActive }) =>
                  `text-green text-decoration-none d-flex align-items-center sidebar-light w-100 ${
                    isActive ? "active" : ""
                  }`
                }
              >
                <FontAwesomeIcon icon={faBox} className="me-3" />
                <span>Products</span>
              </NavLink>
            </li>

            <li className="nav-item mb-3">
              <NavLink
                to="/admin/categories"
                className={({ isActive }) =>
                  `text-green text-decoration-none d-flex align-items-center sidebar-light w-100 ${
                    isActive ? "active" : ""
                  }`
                }
              >
                <FontAwesomeIcon icon={faTags} className="me-2" />
                Categories
              </NavLink>
            </li>

            <li className="nav-item mb-3">
              <NavLink
                to="/admin/orders"
                className={({ isActive }) =>
                  `text-green text-decoration-none d-flex align-items-center sidebar-light w-100 ${
                    isActive ? "active" : ""
                  }`
                }
              >
                <FontAwesomeIcon icon={faCartShopping} className="me-3" />
                <span>Orders</span>
              </NavLink>
            </li>

            <li className="nav-item mb-3">
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `text-green text-decoration-none d-flex align-items-center sidebar-light w-100 ${
                    isActive ? "active" : ""
                  }`
                }
              >
                <FontAwesomeIcon icon={faUsers} className="me-3" />
                <span>Users</span>
              </NavLink>
            </li>

            <li className="nav-item mb-3">
              <NavLink
                to="/admin/coupons"
                className={({ isActive }) =>
                  `text-green text-decoration-none d-flex align-items-center sidebar-light w-100 ${
                    isActive ? "active" : ""
                  }`
                }
              >
                <FontAwesomeIcon icon={faTicket} className="me-3" />
                <span>Coupons</span>
              </NavLink>
            </li>

            <li className="nav-item mb-3">
              <NavLink
                to="/admin/profile"
                className={({ isActive }) =>
                  `text-green text-decoration-none d-flex align-items-center sidebar-light w-100 ${
                    isActive ? "active" : ""
                  }`
                }
              >
                <FontAwesomeIcon icon={faUserGear} className="me-3" />
                <span>My Profile</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <button className="btn btn-danger w-100" onClick={logout}>
                Logout
              </button>
            </li>
          </ul>
        </div>

        <div
          className="bg-light text-white p-4 d-lg-none"
          style={{
            position: "fixed",
            top: 0,
            left: showSidebar ? "0" : "-280px",
            width: "280px",
            height: "100vh",
            transition: "0.3s",
            zIndex: 1050,
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <button
              className="btn add-product-btn btn-sm"
              onClick={() => setShowSidebar(false)}
            >
              ✕
            </button>
          </div>

          <ul className="list-unstyled d-flex flex-column gap-2 p-0 m-0">
            <li className="nav-item">
              <div className="d-flex align-items-center py-2 admin-user-box ">
                <img
                  src={
                    user?.profileImage
                      ? `https://shopsphere-ecommerce-backend-i2tb.onrender.com/uploads/${user.profileImage}`
                      : "/default-profile.png"
                  }
                  alt="Profile"
                  width="40"
                  height="40"
                  className="rounded-circle me-2"
                />
                <div>
                  <h4 className="text-green text-capitalize mb-0">
                    {user?.name}
                  </h4>
                  <p className="mb-0">{user?.email}</p>
                </div>
              </div>
            </li>

            <hr />

            <li className="nav-item mb-3">
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `text-green text-decoration-none d-flex align-items-center sidebar-light w-100 ${
                    isActive ? "active" : ""
                  }`
                }
                onClick={() => setShowSidebar(false)}
              >
                <FontAwesomeIcon icon={faHouse} className="me-3" />
                <span>Dashboard</span>
              </NavLink>
            </li>

            <li className="nav-item mb-3">
              <NavLink
                to="/admin/products"
                className={({ isActive }) =>
                  `text-green text-decoration-none d-flex align-items-center sidebar-light w-100 ${
                    isActive ? "active" : ""
                  }`
                }
                onClick={() => setShowSidebar(false)}
              >
                <FontAwesomeIcon icon={faBox} className="me-3" />
                <span>Products</span>
              </NavLink>
            </li>

              <li className="nav-item mb-3">
              <NavLink
                to="/admin/categories"
                className={({ isActive }) =>
                  `text-green text-decoration-none d-flex align-items-center sidebar-light w-100 ${
                    isActive ? "active" : ""
                  }`
                }
                onClick={() => setShowSidebar(false)}
              >
                <FontAwesomeIcon icon={faTags} className="me-2" />
                Categories
              </NavLink>
            </li>

            <li className="nav-item mb-3">
              <NavLink
                to="/admin/orders"
                className={({ isActive }) =>
                  `text-green text-decoration-none d-flex align-items-center sidebar-light w-100 ${
                    isActive ? "active" : ""
                  }`
                }
                onClick={() => setShowSidebar(false)}
              >
                <FontAwesomeIcon icon={faCartShopping} className="me-3" />
                <span>Orders</span>
              </NavLink>
            </li>

            <li className="nav-item mb-3">
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `text-green text-decoration-none d-flex align-items-center sidebar-light w-100 ${
                    isActive ? "active" : ""
                  }`
                }
                onClick={() => setShowSidebar(false)}
              >
                <FontAwesomeIcon icon={faUsers} className="me-3" />
                <span>Users</span>
              </NavLink>
            </li>

            <li className="nav-item mb-3">
              <NavLink
                to="/admin/coupons"
                className={({ isActive }) =>
                  `text-green text-decoration-none d-flex align-items-center sidebar-light w-100 ${
                    isActive ? "active" : ""
                  }`
                }
                onClick={() => setShowSidebar(false)}
              >
                <FontAwesomeIcon icon={faTicket} className="me-3" />
                <span>Coupons</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <button className="btn btn-danger w-100" onClick={logout}>
                Logout
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-grow-1 p-3 overflow-hidden main-content">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default AdminLayout;
