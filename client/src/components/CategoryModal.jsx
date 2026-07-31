import { useState, useEffect } from "react";

function CategoryModal({
  show,
  onClose,
  onSave,
  initialData = null,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
      });
    } else {
      setFormData({
        name: "",
        description: "",
      });
    }
  }, [initialData, show]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!show) return null;

  return (
    <>
      <div className="modal fade show d-block">
        <div className="modal-dialog">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">
                {initialData ? "Edit Category" : "Add Category"}
              </h5>

              <button
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="modal-body">

                <div className="mb-3">
                  <label className="form-label">
                    Category Name
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Description
                  </label>

                  <textarea
                    className="form-control"
                    rows="3"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

              </div>

              <div className="modal-footer">

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn add-product-btn"
                >
                  {initialData ? "Update" : "Save"}
                </button>

              </div>

            </form>

          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show"></div>
    </>
  );
}

export default CategoryModal;