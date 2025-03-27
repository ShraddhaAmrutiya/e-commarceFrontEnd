  /* eslint-disable @typescript-eslint/no-explicit-any */
  import { FC } from "react";
  import { AiFillStar, AiOutlineStar } from "react-icons/ai";

  // const RatingStar: FC<{ rating: number }> = ({ rating }) => {
  //   const ratingNum = parseFloat(rating.toString());
  //   const main = Math.floor(ratingNum);
  //   const other = 5 - main;

  //   let showing: any;
  //   if (main === 1) {
  //     showing = <AiFillStar />;
  //   } else if (main === 2) {
  //     showing = (
  //       <>
  //         <AiFillStar />
  //         <AiFillStar />
  //       </>
  //     );
  //   } else if (main === 3) {
  //     showing = (
  //       <>
  //         <AiFillStar />
  //         <AiFillStar />
  //         <AiFillStar />
  //       </>
  //     );
  //   } else if (main === 4) {
  //     showing = (
  //       <>
  //         <AiFillStar />
  //         <AiFillStar />
  //         <AiFillStar />
  //         <AiFillStar />
  //       </>
  //     );
  //   } else if (main === 5) {
  //     showing = (
  //       <>
  //         <AiFillStar />
  //         <AiFillStar />
  //         <AiFillStar />
  //         <AiFillStar />
  //         <AiFillStar />
  //       </>
  //     );
  //   } else {
  //     showing = <></>;
  //   }

  //   let notShowing: any;
  //   if (other === 1) {
  //     notShowing = <AiOutlineStar />;
  //   } else if (other === 2) {
  //     notShowing = (
  //       <>
  //         <AiOutlineStar />
  //         <AiOutlineStar />
  //       </>
  //     );
  //   } else if (other === 3) {
  //     notShowing = (
  //       <>
  //         <AiOutlineStar />
  //         <AiOutlineStar />
  //         <AiOutlineStar />
  //       </>
  //     );
  //   } else if (other === 4) {
  //     notShowing = (
  //       <>
  //         <AiOutlineStar />
  //         <AiOutlineStar />
  //         <AiOutlineStar />
  //         <AiOutlineStar />
  //       </>
  //     );
  //   } else if (other === 5) {
  //     notShowing = (
  //       <>
  //         <AiOutlineStar />
  //         <AiOutlineStar />
  //         <AiOutlineStar />
  //         <AiOutlineStar />
  //         <AiOutlineStar />
  //       </>
  //     );
  //   } else {
  //     notShowing = <></>;
  //   }

  //   return (
  //     <div className="flex items-center text-[#ffb21d]">
  //       {showing}
  //       {notShowing}
  //       <span className="ml-2 text-gray-600 font-semibold dark:text-white">
  //         {rating}
  //       </span>
  //     </div>
  //   );
  // };

  // export default RatingStar;

  const RatingStar: FC<{ rating?: number }> = ({ rating = 0 }) => {
    if (typeof rating !== "number" || isNaN(rating)) {
      console.error("Invalid rating:", rating);
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
  