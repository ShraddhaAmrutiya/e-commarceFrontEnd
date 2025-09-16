import { FC, useEffect, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { addProducts } from "../redux/features/productSlice";
import ProductCard from "../components/ProductCard";
import { Product } from "../models/Product";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config/apiconfig";
import { useTranslation } from "react-i18next";

const AllProducts: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const sortRef = useRef<HTMLSelectElement>(null);
  const [currentProducts, setCurrentProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const allProducts = useAppSelector(
    (state) => state.productReducer.allProducts || []
  );

  const getCreationTimeFromId = (id: string) => {
    return new Date(parseInt(id.substring(0, 8), 16) * 1000);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const language = localStorage.getItem("language") || "en";
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/products/all`, {
          headers: {
            Authorization: `Bearer YOUR_TOKEN_HERE`,
            Accept: "application/json",
            "Accept-Language": language,
          },
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();

        if (!data.categories || !Array.isArray(data.categories)) {
          throw new Error("Invalid API response format");
        }

        const allProducts = data.categories.flatMap(
          (cat: { category: string; products: Product[] }) =>
            (cat.products || []).map((product) => {
              const imageUrl =
                Array.isArray(product.images) && product.images.length > 0
                  ? `${BASE_URL}${product.images[0]}`
                  : `${BASE_URL}/uploads/default-image.jpg`;

              return {
                ...product,
                image: imageUrl,
                category: cat.category,
              };
            })
        );

        allProducts.sort((a: Product, b: Product) => {
          const dateA = a.createdAt
            ? new Date(a.createdAt).getTime()
            : getCreationTimeFromId(a._id).getTime();
          const dateB = b.createdAt
            ? new Date(b.createdAt).getTime()
            : getCreationTimeFromId(b._id).getTime();
          return dateB - dateA;
        });

        dispatch(addProducts(allProducts));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!hasFetched) {
      fetchProducts();
      setHasFetched(true);
    }
  }, [dispatch, hasFetched]);

  useEffect(() => {
    const sortedByDate = [...allProducts].sort((a, b) => {
      const dateA = a.createdAt
        ? new Date(a.createdAt).getTime()
        : getCreationTimeFromId(a._id).getTime();
      const dateB = b.createdAt
        ? new Date(b.createdAt).getTime()
        : getCreationTimeFromId(b._id).getTime();
      return dateB - dateA;
    });

    setCurrentProducts(sortedByDate);
  }, [allProducts]);

  const sortProducts = (sortValue: string) => {
    if (sortValue === "default") {
      const sortedByDate = [...allProducts].sort((a, b) => {
        const dateA = a.createdAt
          ? new Date(a.createdAt).getTime()
          : getCreationTimeFromId(a._id).getTime();
        const dateB = b.createdAt
          ? new Date(b.createdAt).getTime()
          : getCreationTimeFromId(b._id).getTime();
        return dateB - dateA;
      });
      setCurrentProducts(sortedByDate);
      return;
    }

    const sortedProducts = [...currentProducts].sort((a, b) => {
      const aPrice = a.discountPercentage === 0 ? a.price : a.salePrice ?? a.price;
      const bPrice = b.discountPercentage === 0 ? b.price : b.salePrice ?? b.price;

      if (sortValue === "asc") return aPrice - bPrice;
      if (sortValue === "desc") return bPrice - aPrice;
      return 0;
    });

    setCurrentProducts(sortedProducts);
  };

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 py-10 bg-gradient-to-br from-pink-50 via-yellow-50 to-purple-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 font-karla">
      <div className="max-w-screen-xl mx-auto">
        {loading ? (
          <div className="text-center text-lg text-gray-700 dark:text-white">
            {t("loadingProducts")}
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white tracking-wide shadow-sm">
                🛍️ {t("products")}
              </h1>
              <select
                ref={sortRef}
                className="border border-gray-400 dark:border-gray-600 bg-white dark:bg-slate-700 dark:text-white px-4 py-2 rounded-md shadow-sm focus:outline-none"
                onChange={(e) => sortProducts(e.target.value)}
              >
                <option value="default">{t("defaultSort")}</option>
                <option value="asc">{t("priceLowToHigh")}</option>
                <option value="desc">{t("priceHighToLow")}</option>
              </select>
            </div>


            <div className="grid gap-6 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
              {currentProducts.map((product) => (
                <div
                  key={product._id}
                  onClick={() => navigate(`/products/${product._id}`)}
                  className="cursor-pointer transform hover:-translate-y-1 transition duration-300"
                >
                  <ProductCard
                    {...product}
                    rating={product.rating ?? 0}
                    images={product.images}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllProducts;