import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function NotFound() {
  const canonicalUrl = window.location.href;

  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | ShopSphere</title>

        <meta
          name="description"
          content="The page you are looking for could not be found. Return to ShopSphere to continue shopping for quality products."
        />

        <meta
          name="keywords"
          content="404, page not found, ShopSphere, ecommerce"
        />

        <meta property="og:title" content="404 - Page Not Found | ShopSphere" />

        <meta
          property="og:description"
          content="The page you are looking for could not be found. Return to ShopSphere to continue shopping for quality products."
        />

        <meta property="og:type" content="website" />

        <meta property="og:url" content={canonicalUrl} />
        <link rel="canonical" href={canonicalUrl} />

        <meta name="robots" content="index, follow" />

        <meta name="author" content="ShopSphere" />
      </Helmet>
      <div className="container text-center mt-5">
        <h1 className="display-1 fw-bold">404</h1>

        <h3>Page Not Found</h3>

        <p className="text-muted">
          Sorry, the page you are looking for does not exist.
        </p>

        <Link to="/" className="btn add-product-btn">
          Go Home
        </Link>
      </div>
    </>
  );
}

export default NotFound;
