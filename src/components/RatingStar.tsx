  /* eslint-disable @typescript-eslint/no-explicit-any */
  import { FC } from "react";
  import { AiFillStar, AiOutlineStar } from "react-icons/ai";

 
  const RatingStar: FC<{ rating?: number }> = ({ rating = 0 }) => {
    if (typeof rating !== "number" || isNaN(rating)) {
      // console.error("Invalid rating:", rating);
      return null;
    }
  
    const ratingNum = Math.max(0, Math.min(5, Math.floor(rating))); // Ensure rating is between 0 and 5
    const emptyStars = 5 - ratingNum;
  
    return (
      <div className="flex items-center text-[#ffb21d]">
        {/* Filled Stars */}
        {Array.from({ length: ratingNum }).map((_, index) => (
          <AiFillStar key={index} />
        ))}
        {/* Empty Stars */}
        {Array.from({ length: emptyStars }).map((_, index) => (
          <AiOutlineStar key={index} />
        ))}
        <span className="ml-2 text-gray-600 font-semibold dark:text-white">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };
  export default RatingStar;
  