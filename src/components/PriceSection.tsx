// import { FC } from "react";

// interface PriceSectionProps {
//   price: number;
//   discountPercentage: number;
// }


// const PriceSection: FC<PriceSectionProps> = ({ price, discountPercentage }) => {
//   const discountedPrice = price - (price * discountPercentage) / 100;

//   const formatINR = (amount: number) =>
//     new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(amount);

//   const hasDiscount = discountPercentage > 0;

//   return (
//     <div className="mt-2">
//       <p className="text-lg text-blue-600 font-semibold">
//         {formatINR(hasDiscount ? discountedPrice : price)}
//       </p>

//       {hasDiscount && (
//         <>
//           <p className="text-sm line-through text-gray-500">{formatINR(price)}</p>
//           <p className="text-green-600 text-sm">Save {discountPercentage}%</p>
//         </>
//       )}
//     </div>
//   );
// };

// export default PriceSection;


import { FC } from "react";

interface PriceSectionProps {
  price: number;
  discountPercentage: number;
}

const PriceSection: FC<PriceSectionProps> = ({ price, discountPercentage }) => {
  const discountedPrice = price - (price * discountPercentage) / 100;

  const formatINR = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const hasDiscount = discountPercentage > 0;

  return (
    <div className="mt-2 space-y-1 sm:space-y-1.5 md:space-y-2">
      <p className="text-base sm:text-lg md:text-xl text-blue-600 font-semibold">
        {formatINR(hasDiscount ? discountedPrice : price)}
      </p>

      {hasDiscount && (
        <>
          <p className="text-xs sm:text-sm md:text-base line-through text-gray-500">
            {formatINR(price)}
          </p>
          <p className="text-xs sm:text-sm md:text-base text-green-600">
            Save {discountPercentage}%
          </p>
        </>
      )}
    </div>
  );
};

export default PriceSection;
