import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  console.log(token);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await api.post(`/auth/reset-password/${token}`, {
        password,
      });

      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      console.log(error.response?.data);

      toast.error(error.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  const canonicalUrl = window.location.href;

  return (
    <>
      <Helmet>
        <title>Reset Password | ShopSphere</title>

        <meta
          name="description"
          content="Create a new password for your ShopSphere account securely. Reset your password to regain access and continue shopping safely."
        />

        <meta
          name="keywords"
          content="ShopSphere reset password, create new password, account recovery, password reset, secure account"
        />

        <meta property="og:title" content="Reset Password | ShopSphere" />

        <meta
          property="og:description"
          content="Create a new password for your ShopSphere account securely. Reset your password to regain access and continue shopping safely."
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
                <h2 className="text-center mb-3">Reset Password</h2>

                <p className="text-muted text-center mb-4">
                  Create a new password for your account.
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">New Password</label>

                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn add-product-btn w-100"
                    disabled={loading}
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>

                  <p className="text-center mt-3">
                    <Link to="/login">Back to Login</Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
