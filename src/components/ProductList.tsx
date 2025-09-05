import { FC } from "react";
import { Product } from "../models/Product";
import ProductCard from "./ProductCard";

const ProductList: FC<{ title: string; products: Product[] }> = ({
  title,
  products,
}) => (
  <div className="container mx-auto px-4 py-6 sm:py-8 md:py-10 dark:bg-slate-800">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold font-lora dark:text-white">
        {title}
      </h2>
    </div>

    <div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6"
      data-test="product-list-container"
    >
      {products?.map((product) => (
        <ProductCard
          key={product._id}
          _id={product._id}
          category={product.category}
          title={product.title}
          price={product.price}
          images={product.images}
          rating={product.rating}
          discountPercentage={product.discountPercentage}
          stock={product.stock}
        />
      ))}
    </div>
  </div>
);

export default ProductList;
