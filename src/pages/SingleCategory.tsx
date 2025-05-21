import { FC, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Product } from "../models/Product";
import ProductCard from "../components/ProductCard";
import BASE_URL from "../config/apiconfig";
import { useTranslation } from "react-i18next";

const SingleCategory: FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [productList, setProductList] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("accessToken");
  const language = localStorage.getItem("language") || "en";

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/category/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": language,
          },
        });

        if (!response.ok) throw new Error(t("singleCategory.fetchCategoryError"));
        const data = await response.json();
        setCategoryName(data.name || t("singleCategory.unknownCategory"));
      } catch (error) {
        console.error("Error fetching category details:", error);
        setError(t("singleCategory.errorLoadingCategory"));
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/category/products/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": language,
          },
        });

        if (!response.ok) throw new Error(t("singleCategory.fetchProductsError"));
        const data = await response.json();
        setProductList(data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(t("singleCategory.errorLoadingProducts"));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCategoryDetails();
      fetchProducts();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token, t, language]);

  if (error) {
    return <div className="text-center text-red-500 font-bold">{error}</div>;
  }

  return (
    <div className="container mx-auto min-h-[83vh] p-4 font-karla">
      <div className="flex items-center space-x-2 text-lg dark:text-white">
        <Link to="/categories" className="hover:underline text-blue-600 dark:text-blue-400">
          {t("singleCategory.categories")}
        </Link>
        <span> {">"} </span>
        <span className="font-bold">{loading ? t("singleCategory.loading") : categoryName}</span>
      </div>
      {loading ? (
        <p className="text-center my-4">{t("singleCategory.loadingProducts")}</p>
      ) : (
        <div className="grid gap-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 my-2">
          {productList.length > 0 ? (
            productList.map((product) => <ProductCard key={product._id} {...product} category={categoryName} />)
          ) : (
            <p className="text-center text-gray-500">{t("singleCategory.noProducts")}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SingleCategory;
