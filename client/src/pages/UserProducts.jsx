import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import StarRating from "../components/StarRating";
import "../css/userproduct.css";
import { Helmet } from "react-helmet-async";

function UserProducts() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

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

  const getCategories = async () => {
    try {
      const response = await api.get("/categories?status=Active");

      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getWishlist = async () => {
    try {
      const response = await api.get("/wishlist");

      const productIds =
        response.data.wishlist?.products.map((product) => product._id) || [];

      setWishlist(productIds);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProducts();
    getWishlist();
  }, [getProducts]);

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, category, sort]);

  const addToWishlist = async (productId) => {
    try {
      await api.post("/wishlist", {
        productId,
      });

      toast.success("Added to Wishlist ❤️");
      getWishlist();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add wishlist");
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);

      toast.success("Removed from Wishlist");

      getWishlist();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to remove from wishlist",
      );
    }
  };

  const addToCart = async (productId) => {
    try {
      await api.post("/cart", {
        productId,
      });

      toast.success("Product added to Cart 🛒");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add cart");
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

        <meta name="robots" content="index, follow" />

        <meta name="author" content="ShopSphere" />
      </Helmet>

      <div className="up-container">
        <div className="up-header">
          <h2 className="up-heading">Products</h2>
        </div>

        {/* Filters */}

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="col-md-4">
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All Categories</option>

                  {categories.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <select
                  className="form-select"
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

        <div className="up-grid">
          {products.length === 0 ? (
            <div className="up-empty">
              <h5>No Products Found</h5>
            </div>
          ) : (
            products.map((product) => (
              <div className="up-card" key={product._id}>
                <div className="up-card-image-wrap">
                  <img
                    src={
                      product.image?.startsWith("http")
                        ? product.image
                        : `https://shopsphere-ecommerce-backend-i2tb.onrender.com/uploads/${product.image}`
                    }
                    className="up-card-image"
                    alt={product.name}
                  />
                  <span className="up-image-badge">{product.category}</span>
                </div>

                <div className="up-card-body">
                  <h5 className="up-card-title">{product.name}</h5>

                  <div className="up-card-subrow">
                    <span className="up-category-pill">{product.category}</span>

                    <div className="up-rating-group">
                      <StarRating
                        rating={product.averageRating || 0}
                        size="0.9rem"
                      />
                      <span className="up-rating-value">
                        {product.averageRating
                          ? product.averageRating.toFixed(1)
                          : "0.0"}
                      </span>
                      <span className="up-rating-count">
                        ({product.totalReviews || 0})
                      </span>
                    </div>
                  </div>

                  <p className="up-description">{product.description}</p>

                  <div className="up-info-box">
                    <div className="up-info-item">
                      <span className="up-info-icon up-info-icon-price">
                        <FontAwesomeIcon icon={faIndianRupeeSign} />
                      </span>
                      <div className="up-info-text">
                        <span className="up-info-label">Price</span>
                        <span className="up-info-value">₹ {product.price}</span>
                      </div>
                    </div>

                    <span className="up-info-divider"></span>

                    <div className="up-info-item">
                      <span className="up-info-icon up-info-icon-stock">
                        <FontAwesomeIcon icon={faBoxOpen} />
                      </span>
                      <div className="up-info-text">
                        <span className="up-info-label">Stock</span>
                        <span className="up-info-value">{product.stock}</span>
                      </div>
                    </div>
                  </div>

                  <div className="up-actions">
                    <button
                      className={
                        wishlist.includes(product._id)
                          ? "up-btn up-btn-wishlist up-btn-wishlist-active"
                          : "up-btn up-btn-wishlist"
                      }
                      onClick={() =>
                        wishlist.includes(product._id)
                          ? removeFromWishlist(product._id)
                          : addToWishlist(product._id)
                      }
                    >
                      <FontAwesomeIcon icon={faHeart} />
                      <span>Wishlist</span>
                    </button>

                    <button
                      className="up-btn up-btn-cart"
                      onClick={() => addToCart(product._id)}
                    >
                      <FontAwesomeIcon icon={faCartShopping} />
                      <span>Add to Cart</span>
                    </button>

                    <button
                      className="up-btn up-btn-view"
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      <FontAwesomeIcon icon={faEye} />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}

        <div className="up-pagination">
          <button
            className="up-page-btn"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>

          <span className="up-page-info">
            Page {page} of {totalPages}
          </span>

          <button
            className="up-page-btn"
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

export default UserProducts;
