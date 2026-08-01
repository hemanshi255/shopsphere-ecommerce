import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import "../css/navbar.css";
import defaultProfile from "../assets/img/defaultProfile.webp";

function Navbar() {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);

    navigate("/login");
  };

  const getCartCount = async () => {
    try {
      const response = await api.get("/cart");

      setCartCount(response.data.cart?.products.length || 0);
    } catch (error) {
      console.log(error);
    }
  };

  const getWishlistCount = async () => {
    try {
      const response = await api.get("/wishlist");

      setWishlistCount(response.data.wishlist?.products.length || 0);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const updateUser = () => {
      const savedToken = localStorage.getItem("token");
      const savedUser = JSON.parse(localStorage.getItem("user"));

      setToken(savedToken);
      setUser(savedUser);

      if (savedToken && savedUser?.role === "user") {
        getCartCount();
        getWishlistCount();
      }
    };

    updateUser();

    window.addEventListener("storage", updateUser);

    return () => {
      window.removeEventListener("storage", updateUser);
    };
  }, []);
  return (
    <nav className="navbar navbar-expand-lg nav-dark">
      <div className="container">
        <Link className="navbar-brand fw-bold text-white" to="/">
          ShopSphere
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarMenu">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            {token ? (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link text-center text-white"
                    to={isAdmin ? "/admin/products" : "/products"}
                  >
                    Products
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link text-center text-white"
                    to="/profile"
                  >
                    My Profile
                  </Link>
                </li>

                {isUser && (
                  <li className="nav-item">
                    <Link
                      className="nav-link text-center text-white"
                      to="/my-orders"
                    >
                      My Orders
                    </Link>
                  </li>
                )}

                {isUser && (
                  <li className="nav-item text-center my-2 mx-lg-2">
                    <Link
                      to="/wishlist"
                      className="position-relative d-flex justify-content-center align-items-center mx-auto"
                      style={{
                        width: "40px",
                        height: "40px",
                        background: "#fff",
                        borderRadius: "50%",
                        textDecoration: "none",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faHeart}
                        size="lg"
                        style={{ color: "red" }}
                      />

                      {wishlistCount > 0 && (
                        <span
                          className="position-absolute badge rounded-pill bg-danger"
                          style={{
                            top: "-6px",
                            right: "-8px",
                            fontSize: "11px",
                          }}
                        >
                          {wishlistCount}
                        </span>
                      )}
                    </Link>
                  </li>
                )}

                {isUser && (
                  <li className="nav-item text-center my-2 mx-lg-2">
                    <Link
                      to="/cart"
                      className="position-relative d-flex justify-content-center align-items-center mx-auto"
                      style={{
                        width: "40px",
                        height: "40px",
                        background: "#fff",
                        borderRadius: "50%",
                        textDecoration: "none",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faCartShopping}
                        size="lg"
                        style={{ color: "#000" }}
                      />

                      {cartCount > 0 && (
                        <span
                          className="position-absolute badge rounded-pill bg-danger"
                          style={{
                            top: "-6px",
                            right: "-8px",
                            fontSize: "11px",
                          }}
                        >
                          {cartCount}
                        </span>
                      )}
                    </Link>
                  </li>
                )}

                {isAdmin && (
                  <li className="nav-item">
                    <Link
                      className="nav-link text-center text-white"
                      to="/add-product"
                    >
                      Add Product
                    </Link>
                  </li>
                )}

                <li className="nav-item">
                  <div className="d-flex align-items-center justify-content-center px-lg-3 py-2">
                    <img
                      src={
                        user?.profileImage
                          ? `https://shopsphere-ecommerce-backend-i2tb.onrender.com/uploads/${user.profileImage}`
                          : defaultProfile
                      }
                      alt="Profile"
                      width="40"
                      height="40"
                      className="rounded-circle me-2"
                    />

                    <span className="text-white">{user?.name}</span>
                  </div>
                </li>

                <li className="nav-item text-center">
                  <button
                    className="btn btn-danger mt-2 mt-lg-0 ms-lg-3"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/login">
                    Login
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link text-white" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
