import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  const getWishlist = async () => {
    try {
      const response = await api.get("/wishlist");

      setWishlist(response.data.wishlist?.products || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getWishlist();
  }, []);

  const removeWishlist = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);

      toast.success("Removed from Wishlist");

      getWishlist();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove");
    }
  };

  const canonicalUrl = window.location.href;

  return (
    <>
      <Helmet>
        <title>My Wishlist | ShopSphere</title>

        <meta
          name="description"
          content="View and manage your favorite products in your ShopSphere wishlist. Save items for later and easily add them to your cart."
        />

        <meta
          name="keywords"
          content="ShopSphere wishlist, saved products, favorite products, online shopping wishlist, ecommerce wishlist"
        />

        <meta property="og:title" content="My Wishlist | ShopSphere" />

        <meta
          property="og:description"
          content="View and manage your favorite products in your ShopSphere wishlist. Save items for later and easily add them to your cart."
        />

        <meta property="og:type" content="website" />

        <meta property="og:url" content={canonicalUrl} />
        <link rel="canonical" href={canonicalUrl} />

        <meta name="robots" content="noindex, nofollow" />

        <meta name="author" content="ShopSphere" />
      </Helmet>

      <div className="container mt-5">
        <h2 className="fw-bold mb-4">❤️ My Wishlist ({wishlist.length})</h2>

        {wishlist.length === 0 ? (
          <div className="text-center">
            <h5>Your wishlist is empty</h5>
          </div>
        ) : (
          <div className="row g-4 justify-content-center">
            {wishlist.map((product) => (
              <div className="col-md-4" key={product._id}>
                <div className="card h-100 shadow-sm">
                  <img
                    src={`https://shopsphere-ecommerce-backend-i2tb.onrender.com/uploads/${product.image}`}
                    className="card-img-top"
                    alt={product.name}
                    style={{
                      height: "220px",
                      objectFit: "contain",
                    }}
                  />

                  <div className="card-body">
                    <h5>{product.name}</h5>

                    <p className="text-muted">{product.description}</p>

                    <h5>₹ {product.price}</h5>

                    <button
                      className="btn btn-danger w-100"
                      onClick={() => removeWishlist(product._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Wishlist;
