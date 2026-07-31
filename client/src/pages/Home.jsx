import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faTruckFast,
  faShieldHalved,
  faHeadset,
} from "@fortawesome/free-solid-svg-icons";
import "../css/home.css";
import { Helmet } from "react-helmet-async";

function Home() {
  const navigate = useNavigate();

  const canonicalUrl = window.location.href;

  return (
    <>
      <Helmet>
        <title>ShopSphere | Buy Quality Products Online at Best Prices</title>

        <meta
          name="description"
          content="ShopSphere offers electronics, fashion, home essentials and more at affordable prices. Secure shopping, fast delivery and trusted customer support."
        />

        <meta
          name="keywords"
          content="ShopSphere, online shopping, ecommerce, electronics, fashion, home products, best deals, secure shopping"
        />

        <meta
          property="og:title"
          content="ShopSphere | Buy Quality Products Online"
        />

        <meta
          property="og:description"
          content="Discover quality products with secure shopping and fast delivery."
        />

        <meta property="og:type" content="website" />

        <meta property="og:url" content={canonicalUrl} />
        <link rel="canonical" href={canonicalUrl} />

        <meta name="robots" content="index, follow" />

        <meta name="author" content="ShopSphere" />
      </Helmet>

      <div className="home-page">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-overlay"></div>

          <div className="hero-content text-center">
            <h1>
              Welcome to <span>ShopSphere</span>
            </h1>

            <p>
              Discover quality products at the best prices. Shop easily with
              secure payments and fast delivery.
            </p>

            <button
              className="btn explore-btn"
              onClick={() => navigate("/products")}
            >
              Explore Products
              <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="container py-5">
          <div className="row text-center">
            <div className="col-md-4 mb-4">
              <div className="feature-card shadow">
                <FontAwesomeIcon icon={faTruckFast} size="2x" />

                <h4 className="mt-3">Fast Delivery</h4>

                <p>Get your products delivered quickly and safely.</p>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="feature-card shadow">
                <FontAwesomeIcon icon={faShieldHalved} size="2x" />

                <h4 className="mt-3">Secure Shopping</h4>

                <p>Safe payments and trusted shopping experience.</p>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="feature-card shadow">
                <FontAwesomeIcon icon={faHeadset} size="2x" />

                <h4 className="mt-3">Customer Support</h4>

                <p>We are always here to help you.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;
