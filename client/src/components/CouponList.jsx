import { useEffect, useState } from "react";
import { getActiveCoupons } from "../api/couponApi";

function CouponList({ onApplyCoupon }) {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await getActiveCoupons();

      console.log("Coupons:", res.data);

      setCoupons(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="card p-3 mt-3">
      <h5>Available Coupons</h5>

      {coupons.length === 0 ? (
        <p>No Coupons Available</p>
      ) : (
        coupons.map((coupon) => (
          <div key={coupon._id} className="border rounded p-3 mb-2">
            <h6>{coupon.code}</h6>

            <p>
              Get {coupon.discountValue}
              {coupon.discountType === "percentage" ? "%" : "₹"} OFF
            </p>

            <p>Minimum Order: ₹{coupon.minimumOrderAmount}</p>

            <button
              className="btn btn-success btn-sm"
              onClick={() => onApplyCoupon(coupon)}
            >
              Apply
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default CouponList;
