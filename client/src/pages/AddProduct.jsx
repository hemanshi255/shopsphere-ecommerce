import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";

function AddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    const files = Array.from(e.target.files);

    setImages(files);

    const imagePreviews = files.map((file) => URL.createObjectURL(file));

    setPreviews(imagePreviews);
  };

  const getCategories = async () => {
    try {
      const response = await api.get("/categories?status=Active");

      setCategories(response.data);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append("stock", formData.stock);

      images.forEach((image) => {
        data.append("images", image);
      });

      await api.post("/products", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product Added Successfully");

      navigate("/admin/products");
    } catch (error) {
      console.log(error.response?.data);

      toast.error(error.response?.data?.message || "Failed to Add Product");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getCategories();
  }, []);
    const canonicalUrl = window.location.href;

  return (
    <>

  <Helmet>
        <title>Add Product | ShopSphere Admin</title>

        <meta
          name="description"
          content="Add new products to the ShopSphere ecommerce store from the admin dashboard. Manage product details, pricing, categories, stock, and images."
        />

        <meta
          name="keywords"
          content="ShopSphere admin, add product, product management, ecommerce products, inventory management, admin dashboard"
        />

        <meta property="og:title" content="Add Product | ShopSphere Admin" />

        <meta
          property="og:description"
          content="Add new products to the ShopSphere ecommerce store from the admin dashboard. Manage product details, pricing, categories, stock, and images."
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

      <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Add Product</h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Product Name</label>

                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>

                  <textarea
                    className="form-control"
                    rows="4"
                    name="description"
                    placeholder="Enter description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Category</label>

                  <select
                    className="form-select"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">Select Category</option>

                    {categories.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Price</label>

                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      placeholder="Price"
                      value={formData.price}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Stock</label>

                    <input
                      type="number"
                      className="form-control"
                      name="stock"
                      placeholder="Stock"
                      value={formData.stock}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Product Image</label>

                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    multiple
                    onChange={handleImage}
                  />
                </div>

                {previews.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {previews.map((preview, index) => (
                      <img
                        key={index}
                        src={preview}
                        alt={`preview-${index}`}
                        className="img-thumbnail"
                        style={{
                          width: "120px",
                          height: "120px",
                          objectFit: "cover",
                        }}
                      />
                    ))}
                  </div>
                )}
                <button
                  type="submit"
                  className="btn add-product-btn w-100"
                  disabled={loading}
                >
                  {loading ? "Adding Product..." : "Add Product"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  
  );
}

export default AddProduct;
