import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import ReviewSection from "../components/ReviewSection";
import StarRating from "../components/StarRating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import {
  WhatsappShareButton,
  FacebookShareButton,
  TwitterShareButton,
} from "react-share";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { WhatsappIcon, FacebookIcon, TwitterIcon } from "react-share";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({
    transformOrigin: "center center",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        const productData = response.data.product;

        setProduct(productData);

        if (productData.images && productData.images.length > 0) {
          setSelectedImage(productData.images[0]);
        } else {
          setSelectedImage(productData.image);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <h3 className="text-center mt-5">Loading Product...</h3>;
  }

  const avgRating = product.averageRating || 0;
  const totalRev = product.totalReviews || 0;

  const imageList =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
    });
  };

  const previousImage = () => {
    const currentIndex = imageList.indexOf(selectedImage);

    if (currentIndex > 0) {
      setSelectedImage(imageList[currentIndex - 1]);
    } else {
      setSelectedImage(imageList[imageList.length - 1]);
    }
  };

  const nextImage = () => {
    const currentIndex = imageList.indexOf(selectedImage);

    if (currentIndex < imageList.length - 1) {
      setSelectedImage(imageList[currentIndex + 1]);
    } else {
      setSelectedImage(imageList[0]);
    }
  };

  const shareUrl = window.location.href;

  const shareTitle = `${product.name} - ₹${product.price}`;

  const copyProductLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);

      toast.success("Product link copied successfully!");
    } catch (error) {
      toast.error("Failed to copy link.");
    }
  };

  const canonicalUrl = window.location.href;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",

    name: product.name,

    image: imageList.map((img) =>
      img?.startsWith("http")
        ? img
        : `https://shopsphere-ecommerce-backend-i2tb.onrender.com/uploads/${img}`,
    ),

    description: product.description,

    category: product.category,

    sku: product._id,

    brand: {
      "@type": "Brand",
      name: "ShopSphere",
    },

    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avgRating,
      reviewCount: totalRev,
    },

    offers: {
      "@type": "Offer",
      url: canonicalUrl,
      priceCurrency: "INR",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      <Helmet>
        <title>{`${product.name} | ShopSphere`}</title>

        <meta
          name="description"
          content={`Buy ${product.name} online at ShopSphere. Explore product features, pricing, customer reviews, availability, and enjoy secure shopping with fast delivery.`}
        />

        <meta
          name="keywords"
          content={`${product.name}, ${product.category}, buy ${product.name}, ${product.category} online, ShopSphere, ecommerce, online shopping, best price`}
        />

        <meta property="og:title" content={`${product.name} | ShopSphere`} />

        <meta
          property="og:description"
          content={`Buy ${product.name} online at ShopSphere. Explore product features, pricing, customer reviews, availability, and enjoy secure shopping with fast delivery.`}
        />

        <meta property="og:type" content="website" />

        <meta property="og:url" content={canonicalUrl} />
        <link rel="canonical" href={canonicalUrl} />

        <meta name="robots" content="index, follow" />

        <meta name="author" content="ShopSphere" />

        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      </Helmet>
      <div className="container mt-5 mb-5">
        <button
          className="btn btn-secondary mb-4"
          onClick={() => window.history.back()}
        >
          ← Back
        </button>

        <div className="card shadow-lg border-0">
          <div className="card-body p-4">
            <div className="row align-items-center">
              {/* Product Image */}
              <div className="col-md-5 text-center">
                <div
                  style={{
                    overflow: "hidden",
                    borderRadius: "10px",
                    background: "#f8f9fa",
                    position: "relative",
                  }}
                >
                  {/* Previous Button */}
                  <button
                    className="btn btn-light position-absolute top-50 start-0 translate-middle-y"
                    onClick={previousImage}
                    style={{ zIndex: 10 }}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>

                  <img
                    src={
                      selectedImage?.startsWith("http")
                        ? selectedImage
                        : `https://shopsphere-ecommerce-backend-i2tb.onrender.com/uploads/${selectedImage}`
                    }
                    alt={product.name}
                    className="img-fluid product-main-image"
                    onMouseMove={handleMouseMove}
                    onClick={() => setShowImageModal(true)}
                    style={{
                      ...zoomStyle,
                      width: "100%",
                      height: "400px",
                      objectFit: "contain",
                      transition: "transform 0.4s ease",
                      cursor: "zoom-in",
                    }}
                  />

                  {/* Next Button */}
                  <button
                    className="btn btn-light position-absolute top-50 end-0 translate-middle-y"
                    onClick={nextImage}
                    style={{ zIndex: 10 }}
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </div>
                <div className="d-flex justify-content-center flex-wrap gap-2 mt-3">
                  {(product.images && product.images.length > 0
                    ? product.images
                    : [product.image]
                  ).map((img, index) => (
                    <img
                      key={index}
                      src={
                        img?.startsWith("http")
                          ? img
                          : `https://shopsphere-ecommerce-backend-i2tb.onrender.com/uploads/${img}`
                      }
                      alt={`Thumbnail ${index + 1}`}
                      onClick={() => setSelectedImage(img)}
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                        border:
                          selectedImage === img
                            ? "2px solid #198754"
                            : "1px solid #ddd",
                        borderRadius: "8px",
                        cursor: "pointer",
                        padding: "2px",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Product Information */}
              <div className="col-md-7">
                <h1 className="fw-bold mb-2">{product.name}</h1>

                <div className="d-flex align-items-center gap-2 mb-3">
                  <span className="badge bg-primary">{product.category}</span>
                  <div className="d-inline-flex align-items-center gap-1 ms-2">
                    <StarRating rating={avgRating} size="1.2rem" />
                    <span className="fw-bold ms-1 text-dark">
                      {avgRating > 0 ? avgRating.toFixed(1) : "0.0"}
                    </span>
                    <span className="text-muted">
                      ({totalRev} {totalRev === 1 ? "Review" : "Reviews"})
                    </span>
                  </div>
                </div>

                <h2 className="text-success mb-3">₹ {product.price}</h2>

                <p className="text-muted fs-5">{product.description}</p>

                <hr />

                <div className="mt-4 mb-3">
                  <h6 className="fw-bold mb-3">Share Product</h6>

                  <div className="d-flex gap-3 align-items-center">
                    <WhatsappShareButton url={shareUrl} title={shareTitle}>
                      <WhatsappIcon size={40} round />
                    </WhatsappShareButton>

                    <FacebookShareButton url={shareUrl} quote={shareTitle}>
                      <FacebookIcon size={40} round />
                    </FacebookShareButton>

                    <TwitterShareButton url={shareUrl} title={shareTitle}>
                      <TwitterIcon size={40} round />
                    </TwitterShareButton>

                    <button
                      className="btn btn-outline-dark rounded-circle"
                      onClick={copyProductLink}
                      title="Copy Link"
                    >
                      <FontAwesomeIcon icon={faLink} />
                    </button>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <p>
                      <strong>Stock:</strong> {product.stock}
                    </p>
                  </div>

                  <div className="col-md-6">
                    <p>
                      <strong>Added:</strong>{" "}
                      {new Date(product.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showImageModal && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{
              background: "rgba(0,0,0,0.85)",
              zIndex: 9999,
            }}
          >
            <button
              className="btn btn-light position-absolute top-0 end-0 m-4"
              onClick={() => setShowImageModal(false)}
            >
              ✕
            </button>

            <img
              src={
                product.image?.startsWith("http")
                  ? product.image
                  : `https://shopsphere-ecommerce-backend-i2tb.onrender.com/uploads/${product.image}`
              }
              alt={product.name}
              style={{
                maxWidth: "90%",
                maxHeight: "90%",
                objectFit: "contain",
              }}
            />
          </div>
        )}

        {/* Review Section */}
        <ReviewSection productId={id} />
      </div>
    </>
  );
}

export default ProductDetails;
