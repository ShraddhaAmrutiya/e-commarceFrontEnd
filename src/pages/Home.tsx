import { FC, useEffect } from "react";
// import HeroSection from "../components/HeroSection";
import SlidingBannerq from "./SlidingBanner";
// import Features from "../components/Features";
import TrendingProducts from "../components/TrendingProducts";
import { useAppDispatch } from "../redux/hooks";
import BASE_URL from "../config/apiconfig";
interface Category {
  category: string;
  products: Product[];
}
import { updateNewList, updateFeaturedList } from "../redux/features/productSlice";
import { Product } from "../models/Product";

const Home: FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetchProducts = () => {
      fetch(`${BASE_URL}/products/all?limit=24`)
        .then((res) => res.json())
        .then(({ categories }) => {

          const productList: Product[] = [];

          categories.forEach(({ category, products }: Category) => {
            products.forEach((product: Product) => {
              productList.push({
                _id: product._id,
                title: product.title,
                images: Array.isArray(product.images)
                  ? product.images.map((img) => (img.startsWith("/") ? `${BASE_URL}${img}` : img))
                  : ["default_image_url"],
                price: product.price,
                rating: product.rating || 0,
                description: product.description,
                category,
                discountPercentage: product.discountPercentage,
                stock:product.stock
              });
            });
          });


          dispatch(updateFeaturedList(productList.slice(0, 8)));
          dispatch(updateNewList(productList.slice(8, 16)));
        })
        .catch((error) => console.error("Error fetching products:", error));
    };

    fetchProducts();
  }, [dispatch]);

  return (
    <div className="dark:bg-slate-800">
      <SlidingBannerq />
      {/* <Features /> */}
      <TrendingProducts />
      <br />
    </div>
  );
};

export default Home;
