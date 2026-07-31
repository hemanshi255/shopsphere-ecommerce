import { useEffect, useState, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { toast } from "react-toastify";
import StarRating from "./StarRating";

function ReviewSection({ productId }) {
  const { user } = useContext(AuthContext);

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [userReview, setUserReview] = useState(null);
  const [canReview, setCanReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/reviews/${productId}`);
      if (response.data.success) {
        setReviews(response.data.reviews || []);
        setAverageRating(response.data.averageRating || 0);
        setTotalReviews(response.data.totalReviews || 0);
        setUserReview(response.data.userReview || null);
        setCanReview(response.data.canReview);
        setReviewMessage(response.data.reviewMessage || "");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Handle start editing existing review
  const handleStartEdit = () => {
    if (userReview) {
      setRating(userReview.rating);
      setComment(userReview.comment);
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setRating(0);
    setComment("");
  };

  // Submit Review (Add or Update)
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!rating || rating < 1 || rating > 5) {
      toast.error("Please select a rating between 1 and 5 stars");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please enter a review comment");
      return;
    }

    try {
      setSubmitting(true);
      if (isEditing && userReview) {
        // Update review
        const response = await api.put(`/reviews/${userReview._id}`, {
          rating,
          comment: comment.trim(),
        });

        if (response.data.success) {
          toast.success("Review updated successfully.");
          setIsEditing(false);
          setRating(0);
          setComment("");
          fetchReviews();
        }
      } else {
        // Add review
        const response = await api.post(`/reviews/${productId}`, {
          rating,
          comment: comment.trim(),
        });

        if (response.data.success) {
          toast.success("Review added successfully.");
          setRating(0);
          setComment("");
          fetchReviews();
        }
      }
    } catch (error) {
      const errMsg =
        error.response?.data?.message || "Failed to submit review";
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      const response = await api.delete(`/reviews/${reviewId}`);
      if (response.data.success) {
        toast.success("Review deleted successfully.");
        if (isEditing) {
          setIsEditing(false);
          setRating(0);
          setComment("");
        }
        fetchReviews();
      }
    } catch (error) {
      const errMsg =
        error.response?.data?.message || "Failed to delete review";
      toast.error(errMsg);
    }
  };

  return (
    <div className="mt-5">
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h3 className="fw-bold mb-4">Customer Reviews & Ratings</h3>

          {/* Average Rating & Total Reviews Header */}
          <div className="row align-items-center bg-light p-3 rounded mb-4">
            <div className="col-md-4 text-center border-end">
              <h1 className="display-4 fw-bold text-warning mb-0">
                {averageRating ? averageRating.toFixed(1) : "0.0"}
              </h1>
              <StarRating rating={averageRating} size="1.5rem" />
              <p className="text-muted mt-1 mb-0">
                {totalReviews} {totalReviews === 1 ? "Review" : "Reviews"}
              </p>
            </div>
            <div className="col-md-8 px-4">
              <h5 className="fw-bold mb-2">Overall Customer Satisfaction</h5>
              <p className="text-muted mb-0">
                Ratings and reviews are verified and written by customers who
                purchased and received this product.
              </p>
            </div>
          </div>

          {/* User Status / Action Form */}
          <div className="mb-5">
            {/* If user already reviewed and is NOT currently editing */}
            {userReview && !isEditing && (
              <div className="alert alert-info d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <strong>You have already reviewed this product.</strong>
                  <div className="mt-1">
                    <StarRating rating={userReview.rating} size="1rem" />
                    <span className="ms-2">"{userReview.comment}"</span>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={handleStartEdit}
                  >
                    Edit Review
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteReview(userReview._id)}
                  >
                    Delete Review
                  </button>
                </div>
              </div>
            )}

            {/* Edit Review Form OR Add Review Form */}
            {(canReview || isEditing) && (
              <div className="border rounded p-4 bg-white shadow-xs">
                <h5 className="fw-bold mb-3">
                  {isEditing ? "Edit Your Review" : "Write a Customer Review"}
                </h5>
                <form onSubmit={handleSubmitReview}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold d-block">
                      Rating <span className="text-danger">*</span>
                    </label>
                    <StarRating
                      rating={rating}
                      setRating={setRating}
                      interactive={true}
                      size="2rem"
                    />
                    {rating > 0 && (
                      <span className="ms-3 text-muted fw-bold">
                        {rating} out of 5 Stars
                      </span>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="commentTextarea" className="form-label fw-semibold">
                      Your Review Comment <span className="text-danger">*</span>
                    </label>
                    <textarea
                      id="commentTextarea"
                      className="form-control"
                      rows="3"
                      placeholder="Share details of your experience with this product..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submitting}
                    >
                      {submitting
                        ? "Submitting..."
                        : isEditing
                        ? "Save Changes"
                        : "Submit Review"}
                    </button>
                    {isEditing && (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleCancelEdit}
                        disabled={submitting}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* Notice if user cannot review and hasn't reviewed yet */}
            {!userReview && !canReview && reviewMessage && (
              <div className="alert alert-warning mb-0">
                <i className="bi bi-info-circle me-2"></i>
                {reviewMessage}
              </div>
            )}
          </div>

          {/* Reviews List */}
          <div>
            <h4 className="fw-bold mb-3">Customer Reviews</h4>

            {loading ? (
              <p className="text-muted">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <div className="text-center py-4 bg-light rounded">
                <p className="text-muted mb-0 fs-5">
                  No reviews yet. Be the first customer to review this product.
                </p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {reviews.map((rev) => {
                  const isOwner = user && rev.user && user.id === rev.user._id;
                  const isAdmin = user && user.role === "admin";

                  return (
                    <div
                      key={rev._id}
                      className="card border-0 shadow-sm bg-light"
                    >
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h6 className="fw-bold mb-0">
                              {rev.user?.name || "Verified Customer"}
                            </h6>
                            <div className="d-flex align-items-center gap-2 mt-1">
                              <StarRating rating={rev.rating} size="1rem" />
                              <small className="text-muted">
                                {new Date(rev.createdAt).toLocaleDateString(
                                  undefined,
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </small>
                            </div>
                          </div>
                          {(isOwner || isAdmin) && (
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteReview(rev._id)}
                              title={
                                isAdmin && !isOwner
                                  ? "Delete Inappropriate Review (Admin)"
                                  : "Delete Review"
                              }
                            >
                              Delete
                            </button>
                          )}
                        </div>
                        <p className="card-text mb-0">{rev.comment}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewSection;
