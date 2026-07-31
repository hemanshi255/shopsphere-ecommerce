import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../css/product.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPenToSquare,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet-async";

function Products() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const isAdmin = user?.role === "admin";

  const getCategories = async () => {
    try {
      const response = await api.get("/categories?status=Active");

      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getProducts = useCallback(async () => {
    try {
      const response = await api.get(
        `/products?search=${search}&category=${category}&sort=${sort}&page=${page}&limit=6`,
      );

      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log(error);
    }
  }, [search, category, sort, page]);

  useEffect(() => {
    getProducts();
    getCategories();
  }, [getProducts]);

  useEffect(() => {
    setPage(1);
  }, [search, category, sort]);

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) return;

    try {
      setDeleteLoading(id);

      await api.delete(`/products/${id}`);

      toast.success("Product Deleted Successfully");

      getProducts();
    } catch (error) {
      console.log(error.response?.data);

      toast.error(error.response?.data?.message || "Failed to Delete Product");
    } finally {
      setDeleteLoading(null);
    }
  };

  const canonicalUrl = window.location.href;

  return (
    <>
      <Helmet>
        <title>All Products | ShopSphere</title>

        <meta
          name="description"
          content="Browse all products at ShopSphere. Discover electronics, fashion, home essentials, accessories, and more at affordable prices with secure shopping and fast delivery."
        />

        <meta
          name="keywords"
          content="all products, online shopping, ShopSphere products, electronics, fashion, home essentials, accessories, best deals, ecommerce"
        />

        <meta property="og:title" content="All Products | ShopSphere" />

        <meta
          property="og:description"
          content="Browse all products at ShopSphere. Discover electronics, fashion, home essentials, accessories, and more at affordable prices with secure shopping and fast delivery."
        />

        <meta property="og:type" content="website" />

        <meta property="og:url" content={canonicalUrl} />
        <link rel="canonical" href={canonicalUrl} />

        <meta name="robots" content="noindex, nofollow" />

        <meta name="author" content="ShopSphere" />
      </Helmet>

      <div className="container mt-2">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Products</h2>

          {isAdmin && (
            <button
              className="btn add-product-btn"
              onClick={() => navigate("/admin/add-product")}
            >
              <i className="bi bi-plus-circle"></i> Add Product
            </button>
          )}
        </div>

        {/* Filters */}

        <div className="shadow-sm mb-4 ">
          <div className="filter-main-border">
            <div className="row g-3">
              <div className="col-md-4">
                <input
                  type="text"
                  className="search-inner-filter"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="col-md-4">
                <select
                  className="input-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All Categories</option>

                  {categories.map((item) => (
                    <option key={item._id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <select
                  className="input-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="newest">Newest First</option>

                  <option value="oldest">Oldest First</option>

                  <option value="price">Price Low to High</option>

                  <option value="-price">Price High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Products */}

        <div className="row g-4">
          {products.length === 0 ? (
            <div className="text-center">
              <h5>No Products Found</h5>
            </div>
          ) : (
            products.map((product) => (
              <div className="col-12 col-md-6 col-xl-4" key={product._id}>
                <div className="card product-card h-100">
                  {/* Product Image */}
                  <div className="product-image-wrapper">
                    <img
                      src={`https://shopsphere-ecommerce-backend-i2tb.onrender.com/uploads/${product.image}`}
                      alt={product.name}
                      className="product-image"
                    />

                    <span className="category-badge">{product.category}</span>
                  </div>

                  {/* Card Body */}
                  <div className="card-body product-body">
                    <h5 className="product-name">{product.name}</h5>

                    <p className="product-description">{product.description}</p>

                    {/* Price & Stock */}
                    <div className="product-info">
                      <div className="info-box">
                        <span className="info-title">Price</span>

                        <h5 className="info-value">₹ {product.price}</h5>
                      </div>

                      <div className="info-divider"></div>

                      <div className="info-box">
                        <span className="info-title">Stock</span>

                        <h5 className="info-value">{product.stock}</h5>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="product-actions">
                      <button
                        className="btn view-detail-bg action-btn"
                        onClick={() =>
                          navigate(`/admin/product/${product._id}`)
                        }
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>

                      {isAdmin && (
                        <>
                          <button
                            className="btn edit-btn-light-warning action-btn"
                            onClick={() =>
                              navigate(`/admin/edit-product/${product._id}`)
                            }
                          >
                            <FontAwesomeIcon icon={faPenToSquare} />
                          </button>

                          <button
                            className="btn delete-btn-light-danger action-btn"
                            disabled={deleteLoading === product._id}
                            onClick={() => deleteProduct(product._id)}
                          >
                            {deleteLoading === product._id ? (
                              "..."
                            ) : (
                              <FontAwesomeIcon icon={faTrashCan} />
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}

        <div className="d-flex justify-content-center align-items-center mt-5">
          <button
            className="btn btn-outline-primary"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>

          <span className="mx-3 fw-bold">
            Page {page} of {totalPages}
          </span>

          <button
            className="btn btn-outline-primary"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default Products;
