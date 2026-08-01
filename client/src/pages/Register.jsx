import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

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

      // await api.post("/auth/register", formData);

      // toast.success("Registration Successful");

      // navigate("/login");
      
      const response = await api.post("/auth/register", formData);

      console.log(response);

      toast.success("Registration Successful");

      navigate("/login");
    } catch (error) {
      console.log(error.response?.data);

      toast.error(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  const canonicalUrl = window.location.href;

  return (
    <>
      <Helmet>
        <title>Register | ShopSphere</title>

        <meta
          name="description"
          content="Create your ShopSphere account to shop online, save your favorite products, track orders, and enjoy a secure and personalized shopping experience."
        />

        <meta
          name="keywords"
          content="ShopSphere register, create account, sign up, ecommerce registration, online shopping account"
        />

        <meta property="og:title" content="Register | ShopSphere" />

        <meta
          property="og:description"
          content="Create your ShopSphere account to shop online, save your favorite products, track orders, and enjoy a secure and personalized shopping experience."
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
                <h2 className="text-center mb-4">Create Account</h2>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>

                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

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
                      placeholder="Create password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn add-product-btn w-100"
                    disabled={loading}
                  >
                    {loading ? "Registering..." : "Register"}
                  </button>
                  <p>
                    Already have an account? <a href="/login">Login</a>
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

export default Register;
