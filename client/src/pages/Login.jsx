import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post("/auth/login", formData);

      localStorage.setItem("token", response.data.token);

      localStorage.setItem("user", JSON.stringify(response.data.user));

      window.dispatchEvent(new Event("storage"));

      toast.success("Login Successfully");

      const user = response.data.user;

      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(error.response?.data);

      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  const canonicalUrl = window.location.href;

  return (
    <>
      <Helmet>
        <title>Login | ShopSphere</title>

        <meta
          name="description"
          content="Sign in to your ShopSphere account to manage your profile, orders, wishlist, cart, and enjoy a secure online shopping experience."
        />

        <meta
          name="keywords"
          content="ShopSphere login, sign in, ecommerce login, customer account, secure login, online shopping"
        />

        <meta property="og:title" content="Login | ShopSphere" />

        <meta
          property="og:description"
          content="Sign in to your ShopSphere account to manage your profile, orders, wishlist, cart, and enjoy a secure online shopping experience."
        />

        <meta property="og:type" content="website" />

        <meta property="og:url" content={canonicalUrl} />
        <link rel="canonical" href={canonicalUrl} />

        <meta name="robots" content="noindex, nofollow" />

        <meta name="author" content="ShopSphere" />
      </Helmet>

      <div className="container">
        <div className="row justify-content-center mt-5">
          <div className="col-md-5">
            <div className="card shadow">
              <div className="card-body p-4">
                <h2 className="text-center mb-4">Login</h2>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>

                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder="Enter email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Password</label>

                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>

                  <p style={{ textAlign: "center" }}>
                    <Link to="/forgot-password">Forgot Password?</Link>
                  </p>

                  <button
                    type="submit"
                    className="btn add-product-btn w-100"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>

                  <p style={{ marginTop: "20px", textAlign: "center" }}>
                    Don't have an account? <a href="/register">Register</a>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
