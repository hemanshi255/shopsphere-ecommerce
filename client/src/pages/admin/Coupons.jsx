import { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";


function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minimumOrderAmount: "0",
    expiryDate: "",
    usageLimit: "100",
    isActive: true,
  });

  const getCoupons = async () => {
    try {
      setLoading(true);
      const response = await api.get("/coupons");
      if (response.data.success) {
        setCoupons(response.data.coupons || []);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
      toast.error("Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCoupons();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      code: "",
      discountType: "percentage",
      discountValue: "",
      minimumOrderAmount: "0",
      expiryDate: "",
      usageLimit: "100",
      isActive: true,
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (coupon) => {
    setIsEditing(true);
    setEditingId(coupon._id);

    // Format date for date input YYYY-MM-DD
    const dateObj = new Date(coupon.expiryDate);
    const formattedDate = dateObj.toISOString().split("T")[0];

    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minimumOrderAmount: coupon.minimumOrderAmount || 0,
      expiryDate: formattedDate,
      usageLimit: coupon.usageLimit,
      isActive: coupon.isActive,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.code.trim()) {
      toast.error("Coupon code is required");
      return;
    }
    if (!formData.discountValue || Number(formData.discountValue) <= 0) {
      toast.error("Please enter a valid discount value");
      return;
    }
    if (!formData.expiryDate) {
      toast.error("Expiry date is required");
      return;
    }
    if (!formData.usageLimit || Number(formData.usageLimit) <= 0) {
      toast.error("Please enter a valid usage limit");
      return;
    }

    try {
      if (isEditing) {
        const response = await api.patch(`/coupons/${editingId}`, formData);
        if (response.data.success) {
          toast.success("Coupon updated successfully");
          setShowModal(false);
          getCoupons();
        }
      } else {
        const response = await api.post("/coupons", formData);
        if (response.data.success) {
          toast.success("Coupon created successfully");
          setShowModal(false);
          getCoupons();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;

    try {
      const response = await api.delete(`/coupons/${id}`);
      if (response.data.success) {
        toast.success("Coupon deleted successfully");
        getCoupons();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete coupon");
    }
  };

    const canonicalUrl = window.location.href;

  return (
    <>

 <Helmet>
        <title>Manage Coupons | ShopSphere Admin</title>

        <meta
          name="description"
          content="Manage discount coupons from the ShopSphere Admin Dashboard. Create, update, and control promotional offers for your ecommerce store."
        />

        <meta
          name="keywords"
          content="ShopSphere admin, manage coupons, discount coupons, promo codes, ecommerce offers, admin dashboard"
        />

        <meta property="og:title" content="Manage Coupons | ShopSphere Admin" />

        <meta
          property="og:description"
          content="Manage discount coupons from the ShopSphere Admin Dashboard. Create, update, and control promotional offers for your ecommerce store."
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

     <div className="container-fluid py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Coupon Management</h2>
        <button className="btn add-product-btn" onClick={handleOpenAddModal}>
          + Add New Coupon
        </button>
      </div>

      {/* Coupon List Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-thead-bg">
                <tr>
                  <th>Code</th>
                  <th>Discount Type</th>
                  <th>Value</th>
                  <th>Min Order</th>
                  <th>Expiry Date</th>
                  <th>Usage (Used/Limit)</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      Loading coupons...
                    </td>
                  </tr>
                ) : coupons.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-muted">
                      No coupons found. Click "+ Add New Coupon" to create one.
                    </td>
                  </tr>
                ) : (
                  coupons.map((coupon) => {
                    const isExpired = new Date(coupon.expiryDate) < new Date();
                    return (
                      <tr key={coupon._id}>
                        <td>
                          <span className="badge bg-secondary fs-6">
                            {coupon.code}
                          </span>
                        </td>
                        <td className="text-capitalize">
                          {coupon.discountType}
                        </td>
                        <td className="fw-bold text-success">
                          {coupon.discountType === "percentage"
                            ? `${coupon.discountValue}%`
                            : `₹ ${coupon.discountValue}`}
                        </td>
                        <td>₹ {coupon.minimumOrderAmount || 0}</td>
                        <td>
                          {new Date(coupon.expiryDate).toLocaleDateString()}
                          {isExpired && (
                            <span className="badge bg-danger ms-2">Expired</span>
                          )}
                        </td>
                        <td>
                          {coupon.usedCount} / {coupon.usageLimit}
                        </td>
                        <td>
                          <span
                            className={`badge ${coupon.isActive && !isExpired
                              ? "bg-success"
                              : "bg-danger"
                              }`}
                          >
                            {coupon.isActive
                              ? isExpired
                                ? "Expired"
                                : "Active"
                              : "Inactive"}
                          </span>
                        </td>
                        <td>
                             <div className="d-flex flex-column flex-md-row gap-2">
                               <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleOpenEditModal(coupon)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(coupon._id)}
                          >
                            Delete
                          </button>
                             </div>
                         
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {isEditing ? "Edit Coupon" : "Add New Coupon"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Coupon Code</label>
                    <input
                      type="text"
                      className="form-control text-uppercase"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      placeholder="e.g. SAVE20"
                      required
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Discount Type</label>
                      <select
                        className="form-select"
                        name="discountType"
                        value={formData.discountType}
                        onChange={handleChange}
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount (₹)</option>
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">
                        Discount Value ({formData.discountType === "percentage" ? "%" : "₹"})
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="discountValue"
                        value={formData.discountValue}
                        onChange={handleChange}
                        placeholder={formData.discountType === "percentage" ? "20" : "150"}
                        required
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Min Order Amount (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="minimumOrderAmount"
                        value={formData.minimumOrderAmount}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Usage Limit</label>
                      <input
                        type="number"
                        className="form-control"
                        name="usageLimit"
                        value={formData.usageLimit}
                        onChange={handleChange}
                        placeholder="100"
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Expiry Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="isActive"
                      id="isActiveCheck"
                      checked={formData.isActive}
                      onChange={handleChange}
                    />
                    <label className="form-check-label fw-semibold" htmlFor="isActiveCheck">
                      Active Coupon
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn add-product-btn">
                    {isEditing ? "Save Changes" : "Create Coupon"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
   
  );
}

export default Coupons;
