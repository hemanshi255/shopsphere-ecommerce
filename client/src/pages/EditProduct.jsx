import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";

function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);

        const product = response.data.product;

        setFormData({
          name: product.name,
          description: product.description,
          category: product.category,
          price: product.price,
          stock: product.stock,
        });

        if (product.images && product.images.length > 0) {
          setPreviews(
            product.images.map((img) =>
              img?.startsWith("http")
                ? img
                : `https://shopsphere-ecommerce-backend-i2tb.onrender.com/uploads/${img}`,
            ),
          );
        } else if (product.image) {
          setPreviews([
            product.image?.startsWith("http")
              ? product.image
              : `https://shopsphere-ecommerce-backend-i2tb.onrender.com/uploads/${product.image}`,
          ]);
        }
      } catch (error) {
        console.log(error);

        alert("Failed to load product");
      }
    };

    fetchProduct();
  }, [id]);

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

      await api.patch(`/products/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product Updated Successfully");

      navigate("/admin/products");
    } catch (error) {
      console.log(error.response?.data);

      toast.error(error.response?.data?.message || "Failed to Update Product");
    } finally {
      setLoading(false);
    }
  };

  const getCategories = async () => {
    const response = await api.get("/categories?status=Active");
    setCategories(response.data);
  };

  useEffect(() => {
    getCategories();
  }, []);

  const canonicalUrl = window.location.href;

  return (
    <>
      <Helmet>
        <title>Edit Product | ShopSphere Admin</title>

        <meta
          name="description"
          content="Edit and update product details from the ShopSphere Admin Dashboard. Manage product information, pricing, categories, stock, and images."
        />

        <meta
          name="keywords"
          content="ShopSphere admin, edit product, update product, product management, ecommerce inventory, admin dashboard"
        />

        <meta property="og:title" content="Edit Product | ShopSphere Admin" />

        <meta
          property="og:description"
          content="Edit and update product details from the ShopSphere Admin Dashboard. Manage product information, pricing, categories, stock, and images."
        />

        <meta property="og:type" content="website" />

        <meta property="og:url" content={canonicalUrl} />
        <link rel="canonical" href={canonicalUrl} />

        <meta name="robots" content="noindex, nofollow" />

        <meta name="author" content="ShopSphere" />
      </Helmet>

      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body p-4">
                <h2 className="text-center mb-4">Edit Product</h2>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Product Name</label>

                    <input
                      type="text"
                      className="form-control"
                      name="name"
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
                        value={formData.stock}
                        onChange={handleChange}
                      />
                    </div>
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

                  <div className="mb-3">
                    <label className="form-label">Change Image</label>

                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      multiple
                      onChange={handleImage}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-warning w-100"
                    disabled={loading}
                  >
                    {loading ? "Updating Product..." : "Update Product"}
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

export default EditProduct;
