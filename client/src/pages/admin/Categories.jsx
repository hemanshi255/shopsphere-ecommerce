import { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import CategoryModal from "../../components/CategoryModal";
import { Helmet } from "react-helmet-async";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const getCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch categories",
      );
    }
  };

  const handleSaveCategory = async (formData) => {
    try {
      if (selectedCategory) {
        await api.put(`/categories/${selectedCategory._id}`, formData);

        toast.success("Category Updated Successfully");
      } else {
        await api.post("/categories", formData);

        toast.success("Category Added Successfully");
      }

      setShowModal(false);

      setSelectedCategory(null);

      getCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation Failed");
    }
  };

  const handleDeleteCategory = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/categories/${id}`);

      toast.success("Category Deleted Successfully");

      getCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete category");
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const canonicalUrl = window.location.href;

  return (
    <>
      <Helmet>
        <title>Manage Categories | ShopSphere Admin</title>

        <meta
          name="description"
          content="Manage product categories in the ShopSphere Admin Dashboard. Add, edit, update, and organize product categories."
        />

        <meta
          name="keywords"
          content="ShopSphere admin, manage categories, product categories, admin dashboard, ecommerce category management"
        />

        <meta
          property="og:title"
          content="Manage Categories | ShopSphere Admin"
        />

        <meta
          property="og:description"
          content="Manage product categories in the ShopSphere Admin Dashboard. Add, edit, update, and organize product categories."
        />

        <meta property="og:type" content="website" />

        <meta property="og:url" content={canonicalUrl} />
        <link rel="canonical" href={canonicalUrl} />

        <meta name="robots" content="noindex, nofollow" />

        <meta name="author" content="ShopSphere" />
      </Helmet>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Categories</h2>

          <button
            className="btn add-product-btn"
            onClick={() => {
              setSelectedCategory(null);
              setShowModal(true);
            }}
          >
            + Add Category
          </button>
        </div>

        <div className="card p-3">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No Categories Found
                    </td>
                  </tr>
                ) : (
                  categories.map((category, index) => (
                    <tr key={category._id}>
                      <td>{index + 1}</td>

                      <td>{category.name}</td>

                      <td>{category.description}</td>

                      <td>{category.status}</td>

                      <td>
                         <div className="d-flex flex-column flex-md-row gap-2">
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => {
                            setSelectedCategory(category);
                            setShowModal(true);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteCategory(category._id)}
                        >
                          Delete
                        </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <CategoryModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSaveCategory}
          initialData={selectedCategory}
        />
      </div>
    </>
  );
}

export default Categories;
