import { FC } from "react";
import ReactStarRatings from "react-star-ratings";

const RatingStar: FC<{ rating?: number }> = ({ rating = 0 }) => {
  if (typeof rating !== "number" || isNaN(rating)) {
    return null;
  }

  const ratingNum = Math.max(0, Math.min(5, rating)); // Clamp between 0 and 5

  return (
    <div className="flex items-center space-x-2 mt-1 sm:mt-2">
      <ReactStarRatings
        rating={ratingNum}
        starRatedColor="#ffb21d"
        starEmptyColor="#b8c5b4ff"
        numberOfStars={5}
        name="rating"
        starDimension="20px"
        starSpacing="1px"
      />
      <span className="text-sm font-semibold text-gray-700 dark:text-white">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

export default RatingStar;
