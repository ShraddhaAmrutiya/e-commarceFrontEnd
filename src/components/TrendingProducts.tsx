import { useAppSelector } from "../redux/hooks";
import ProductList from "./ProductList";
import { useTranslation } from "react-i18next";

const TrendingProducts = () => {
  const { t } = useTranslation();
  const featuredProducts = useAppSelector(
    (state) => state.productReducer.featuredProducts
  );

  return <ProductList title={t("trendingProducts")} products={featuredProducts} />;
};

export default TrendingProducts;
