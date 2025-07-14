import { useAppSelector } from "../redux/hooks";
import ProductList from "./ProductList";
import { useTranslation } from "react-i18next";

const TrendingProducts = () => {
  const { t } = useTranslation();
  const featuredProducts = useAppSelector(
    (state) => state.productReducer.featuredProducts
  );

  return (
    <div className="relative z-10 py-12 px-4 md:px-8 lg:px-16 bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 rounded-3xl shadow-lg my-10">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white drop-shadow-sm tracking-wide">
           {t("trendingProducts")}  
        </h2>
      </div>

      <ProductList products={featuredProducts} title="" />
    </div>
  );
};

export default TrendingProducts;
