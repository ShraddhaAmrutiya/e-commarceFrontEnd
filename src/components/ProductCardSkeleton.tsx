import { FC } from "react";

const ProductCardSkeleton: FC = () => {
  return (
    <div className="group relative bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-sm border border-zinc-100 dark:border-zinc-700 h-full animate-pulse">
      {/* Skeleton Image */}
      <div className="relative overflow-hidden bg-zinc-200 dark:bg-zinc-700 w-full h-64 sm:h-72 md:h-80"></div>

      {/* Skeleton Details */}
      <div className="p-4 sm:p-5 flex flex-col gap-3">
        {/* Skeleton Title */}
        <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded-md w-3/4"></div>

        {/* Skeleton Price & Button Area */}
        <div className="flex items-center justify-between mt-2">
          {/* Price */}
          <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded-md w-1/3"></div>
          {/* Button */}
          <div className="h-8 w-8 bg-zinc-200 dark:bg-zinc-700 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
