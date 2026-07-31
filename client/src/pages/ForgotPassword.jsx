import React, { useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post("/auth/forgot-password", {
        email,
      });

      toast.success(response.data.message);
    } catch (error) {
      console.log(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const canonicalUrl = window.location.href;

  return (
    <>
      <Helmet>
        <title>Forgot Password | ShopSphere</title>

        <meta
          name="description"
          content="Reset your ShopSphere account password securely. Enter your registered email address to receive a password reset link."
        />

        <meta
          name="keywords"
          content="ShopSphere forgot password, password reset, account recovery, reset account password, recover account"
        />

        <meta property="og:title" content="Forgot Password | ShopSphere" />

        <meta
          property="og:description"
          content="Reset your ShopSphere account password securely. Enter your registered email address to receive a password reset link."
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
                <h2 className="text-center mb-3">Forgot Password</h2>

                <p className="text-muted text-center mb-4">
                  Enter your email address and we will send you a password reset
                  link.
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>

                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn add-product-btn w-100"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;
