
import { FC } from "react";
import ReactStarRatings from "react-star-ratings";

const RatingStar: FC<{ rating?: number }> = ({ rating = 0 }) => {
  if (typeof rating !== "number" || isNaN(rating)) {
    return null;
  }

  const ratingNum = Math.max(0, Math.min(5, rating)); 

  return (
    <div className="flex items-center">
      <ReactStarRatings
        rating={ratingNum} 
        starRatedColor="#ffb21d" 
        starEmptyColor="#d3d3d3" 
        numberOfStars={5} 
        name="rating" 
        starDimension="25px" 
        starSpacing="1px"
      />
      <span className="ml-2 text-gray-600 font-semibold dark:text-white">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

export default RatingStar;
