import { useState } from "react";

function StarRating({ rating = 0, setRating, interactive = false, size = "1.25rem" }) {
  const [hoverRating, setHoverRating] = useState(0);

  const activeRating = interactive ? hoverRating || rating : rating;

  return (
    <div
      className="d-inline-flex align-items-center gap-1"
      onMouseLeave={() => interactive && setHoverRating(0)}
      style={{ userSelect: "none" }}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= Math.floor(activeRating);
        const isHalf = !isFilled && star - 0.5 <= activeRating;

        return (
          <span
            key={star}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onClick={() => interactive && setRating && setRating(star)}
            style={{
              fontSize: size,
              cursor: interactive ? "pointer" : "default",
              color: isFilled || isHalf ? "#ffc107" : "#e4e5e9",
              transition: "transform 0.15s ease, color 0.15s ease",
              transform: interactive && hoverRating >= star ? "scale(1.2)" : "scale(1)",
              display: "inline-block",
            }}
            title={`${star} Star${star > 1 ? "s" : ""}`}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

export default StarRating;
