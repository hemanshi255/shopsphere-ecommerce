import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CouponList from "../components/CouponList";
import { Helmet } from "react-helmet-async";

function Cart() {
  const [cart, setCart] = useState([]);
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const navigate = useNavigate();

  const getCart = async () => {
    try {
      const response = await api.get("/cart");
      setCart(response.data.cart?.products || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  const removeFromCart = async (productId) => {
    try {
      await api.delete(`/cart/${productId}`);
      toast.success("Removed from Cart");
      setAppliedCoupon(null);
      getCart();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove");
    }
  };

  const updateQuantity = async (productId, action) => {
    try {
      await api.patch(`/cart/${productId}`, {
        action,
      });
      setAppliedCoupon(null);
      getCart();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update quantity");
    }
  };

  const grandTotal = cart.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalTotal = appliedCoupon
    ? appliedCoupon.finalAmount
    : Math.max(0, grandTotal - discountAmount);

  // Apply Coupon API Call
  const handleApplyCoupon = async (e) => {
    e.preventDefault();

    if (!couponCodeInput.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    if (grandTotal <= 0) {
      toast.error("Cart total must be greater than zero");
      return;
    }

    try {
      setApplyingCoupon(true);
      const response = await api.post("/coupons/apply", {
        couponCode: couponCodeInput.trim(),
        cartTotal: grandTotal,
      });

      if (response.data.success) {
        setAppliedCoupon({
          code: response.data.couponCode,
          discountType: response.data.discountType,
          discountValue: response.data.discountValue,
          discountAmount: response.data.discountAmount,
          finalAmount: response.data.finalAmount,
        });
        toast.success(response.data.message || "Coupon applied successfully!");
      }
    } catch (error) {
      setAppliedCoupon(null);
      toast.error(error.response?.data?.message || "Invalid coupon code");
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput("");
    toast.info("Coupon removed");
  };

  const checkout = () => {
    navigate("/checkout", {
      state: {
        subtotal: grandTotal,
        discountAmount: discountAmount,
        totalAmount: finalTotal,
        appliedCoupon: appliedCoupon,
      },
    });
  };

  const handleApplyCouponFromList = async (coupon) => {
    try {
      setApplyingCoupon(true);

      const response = await api.post("/coupons/apply", {
        couponCode: coupon.code,
        cartTotal: grandTotal,
      });

      if (response.data.success) {
        setAppliedCoupon({
          code: response.data.couponCode,
          discountType: response.data.discountType,
          discountValue: response.data.discountValue,
          discountAmount: response.data.discountAmount,
          finalAmount: response.data.finalAmount,
        });

        toast.success("Coupon applied successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid coupon");
    } finally {
      setApplyingCoupon(false);
    }
  };

  const canonicalUrl = window.location.href;

  return (
    <>
      <Helmet>
        <title>Shopping Cart | ShopSphere</title>

        <meta
          name="description"
          content="Review the products in your ShopSphere shopping cart. Update quantities, apply coupons, and proceed to secure checkout with confidence."
        />

        <meta
          name="keywords"
          content="ShopSphere cart, shopping cart, ecommerce cart, apply coupon, checkout, online shopping"
        />

        <meta property="og:title" content="Shopping Cart | ShopSphere" />

        <meta
          property="og:description"
          content="Review the products in your ShopSphere shopping cart. Update quantities, apply coupons, and proceed to secure checkout with confidence."
        />

        <meta property="og:type" content="website" />

        <meta property="og:url" content={canonicalUrl} />
        <link rel="canonical" href={canonicalUrl} />

        <meta name="robots" content="noindex, nofollow" />

        <meta name="author" content="ShopSphere" />
      </Helmet>

      <div className="container mt-5 mb-5">
        <h2 className="fw-bold mb-4">🛒 My Cart ({cart.length})</h2>

        {cart.length === 0 ? (
          <div className="text-center py-5 bg-light rounded">
            <h5>Your cart is empty</h5>
          </div>
        ) : (
          <>
            <div className="row g-4">
              {cart.map((item) => (
                <div className="col-md-4" key={item.product._id}>
                  <div className="card h-100 shadow-sm">
                    <img
                      src={`https://shopsphere-ecommerce-backend-i2tb.onrender.com/uploads/${item.product.image}`}
                      className="card-img-top"
                      alt={item.product.name}
                      style={{
                        height: "220px",
                        objectFit: "contain",
                      }}
                    />

                    <div className="card-body">
                      <h5>{item.product.name}</h5>
                      <p className="text-muted">{item.product.description}</p>
                      <h5>Price: ₹ {item.product.price}</h5>
                      <p>Available Stock: {item.product.stock}</p>
                      <p className="mb-2">
                        <strong>
                          Subtotal: ₹ {item.product.price * item.quantity}
                        </strong>
                      </p>

                      <div className="d-flex align-items-center gap-2 mb-3">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() =>
                            updateQuantity(item.product._id, "decrease")
                          }
                        >
                          -
                        </button>

                        <strong>{item.quantity}</strong>

                        <button
                          className="btn btn-outline-secondary btn-sm"
                          disabled={item.quantity >= item.product.stock}
                          onClick={() =>
                            updateQuantity(item.product._id, "increase")
                          }
                        >
                          +
                        </button>
                      </div>

                      {item.quantity >= item.product.stock && (
                        <small className="text-danger d-block mb-2">
                          Maximum available stock reached
                        </small>
                      )}

                      <button
                        className="btn btn-danger w-100"
                        onClick={() => removeFromCart(item.product._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <CouponList onApplyCoupon={handleApplyCouponFromList} />

            {/* Coupon & Order Summary Section */}
            <div className="row mt-4">
              {/* Coupon Code Form */}
              <div className="col-md-6 mb-3">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-3">🎟️ Apply Coupon Code</h5>

                    {appliedCoupon ? (
                      <div className="alert alert-success d-flex justify-content-between align-items-center mb-0">
                        <div>
                          <strong>Coupon Applied: </strong>
                          <span className="badge bg-success fs-6 me-2">
                            {appliedCoupon.code}
                          </span>
                          <small className="d-block text-muted mt-1">
                            You save ₹{appliedCoupon.discountAmount} on this
                            order!
                          </small>
                        </div>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={handleRemoveCoupon}
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form
                        onSubmit={handleApplyCoupon}
                        className="d-flex gap-2"
                      >
                        <input
                          type="text"
                          className="form-control text-uppercase"
                          placeholder="Enter coupon code (e.g. SAVE20)"
                          value={couponCodeInput}
                          onChange={(e) => setCouponCodeInput(e.target.value)}
                        />
                        <button
                          type="submit"
                          className="btn add-product-btn px-4"
                          disabled={applyingCoupon}
                        >
                          {applyingCoupon ? "Applying..." : "Apply"}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="col-md-6 mb-3">
                <div className="card shadow-sm border-0">
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-3">📋 Order Summary</h5>
                    <div className="d-flex justify-content-between mb-2 fs-5">
                      <span className="text-muted">Subtotal:</span>
                      <span>₹ {grandTotal}</span>
                    </div>

                    {appliedCoupon && (
                      <div className="d-flex justify-content-between mb-2 fs-5 text-success">
                        <span>Discount ({appliedCoupon.code}):</span>
                        <span>- ₹ {discountAmount}</span>
                      </div>
                    )}

                    <hr />

                    <div className="d-flex justify-content-between mb-3 fs-4 fw-bold">
                      <span>Final Total:</span>
                      <span className="text-success">₹ {finalTotal}</span>
                    </div>

                    <button
                      className="btn btn-success w-100 py-2 fs-5 fw-bold"
                      onClick={checkout}
                    >
                      Proceed to Checkout →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Cart;
