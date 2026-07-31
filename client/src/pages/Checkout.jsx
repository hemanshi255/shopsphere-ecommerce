import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const subtotal = location.state?.subtotal || location.state?.totalAmount || 0;

  const discountAmount = location.state?.discountAmount || 0;

  const appliedCoupon = location.state?.appliedCoupon || null;

  const selectedCoupon = appliedCoupon;

  const discount = discountAmount;

  const totalAmount = subtotal - discount;

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    paymentMethod: "COD",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderPayload = {
      ...formData,
      // couponCode: appliedCoupon?.code || null,
      couponCode: selectedCoupon?.code || null,
    };

    try {
      if (formData.paymentMethod === "COD") {
        await api.post("/orders", orderPayload);

        toast.success("Order placed successfully");
        navigate("/my-orders");
      } else {
        const paymentResponse = await api.post("/payment/create", {
          amount: totalAmount,
        });

        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount: paymentResponse.data.order.amount,
          currency: paymentResponse.data.order.currency,
          name: "Product Management",
          description: "Order Payment",
          order_id: paymentResponse.data.order.id,

          handler: async function (response) {
            await api.post("/orders", {
              ...orderPayload,
              paymentId: response.razorpay_payment_id,
            });

            toast.success("Payment successful");
            navigate("/my-orders");
          },

          prefill: {
            name: formData.fullName,
            contact: formData.phone,
          },

          theme: {
            color: "#198754",
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Order placement failed");
    }
  };

  const canonicalUrl = window.location.href;

  return (
    <>
      <Helmet>
        <title>Checkout | ShopSphere</title>

        <meta
          name="description"
          content="Complete your purchase securely at ShopSphere. Review your order, enter your shipping address, choose a payment method, and place your order with confidence."
        />

        <meta
          name="keywords"
          content="ShopSphere checkout, secure checkout, online payment, cash on delivery, shipping address, order confirmation"
        />

        <meta property="og:title" content="Checkout | ShopSphere" />

        <meta
          property="og:description"
          content="Complete your purchase securely at ShopSphere. Review your order, enter your shipping address, choose a payment method, and place your order with confidence."
        />

        <meta property="og:type" content="website" />

        <meta property="og:url" content={canonicalUrl} />
        <link rel="canonical" href={canonicalUrl} />

        <meta name="robots" content="noindex, nofollow" />

        <meta name="author" content="ShopSphere" />
      </Helmet>

      <div className="container py-4 mb-5">
        <div className="row g-4">
          {/* Shipping Address Form */}
          <div className="col-lg-7">
            <div className="card shadow border-0">
              <div className="card-body p-4">
                <h2 className="fw-bold mb-4">🚚 Shipping Address</h2>

                <form className="row" onSubmit={handleSubmit}>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 mb-3">
                    <label className="form-label">Address</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      className="form-control"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Pincode</label>
                    <input
                      type="text"
                      className="form-control"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 mb-4">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      className="form-control"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 mb-4">
                    <label className="form-label fw-bold">Payment Method</label>

                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={formData.paymentMethod === "COD"}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">
                        Cash on Delivery
                      </label>
                    </div>

                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        value="ONLINE"
                        checked={formData.paymentMethod === "ONLINE"}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">Online Payment</label>
                    </div>
                  </div>

                  <div className="col-12">
                    <button
                      className="btn btn-success w-100 py-2 fs-5"
                      type="submit"
                    >
                      Place Order (₹ {totalAmount})
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="col-lg-5">
            <div className="card shadow border-0">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-3">🛍️ Order Summary</h4>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal:</span>
                  <span className="fw-bold">₹ {subtotal}</span>
                </div>

                {selectedCoupon && (
                  <div className="d-flex justify-content-between mb-2 text-success">
                    <span>
                      Coupon Discount (<strong>{selectedCoupon.code}</strong>):
                    </span>
                    <span className="fw-bold">- ₹ {discount}</span>
                  </div>
                )}

                <hr />

                <div className="d-flex justify-content-between mb-3 fs-4 fw-bold">
                  <span>Final Total:</span>
                  <span className="text-success">₹ {totalAmount}</span>
                </div>

                {selectedCoupon && (
                  <div className="alert alert-success mb-0 p-2 text-center">
                    <small>
                      Coupon <strong>{selectedCoupon.code}</strong> applied! You
                      saved ₹{discount}.
                    </small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;
