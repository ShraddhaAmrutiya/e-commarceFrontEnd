import { FC, useEffect, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { addProducts } from "../redux/features/productSlice";
import ProductCard from "../components/ProductCard";
import { Product } from "../models/Product";
import BASE_URL from "../config/apiconfig";
import { useTranslation } from "react-i18next";

const AllProducts: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const sortRef = useRef<HTMLSelectElement>(null);

  const [currentProducts, setCurrentProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const [showLoadingPopup, setShowLoadingPopup] = useState(true);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);

  const allProducts = useAppSelector((state) => state.productReducer.allProducts || []);

  const getCreationTimeFromId = (id: string) => {
    return new Date(parseInt(id.substring(0, 8), 16) * 1000);
  };
  useEffect(() => {
    const images = ["/mahakumbh.jpg", "/banner.jpg", "/gbkeychains.jpg"];

    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % images.length);
    }, 1000); // Change every 1.8 seconds

    return () => clearInterval(interval);
  }, []);

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

        const allProducts = data.categories.flatMap((cat: { category: string; products: Product[] }) =>
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
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : getCreationTimeFromId(a._id).getTime();
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : getCreationTimeFromId(b._id).getTime();
          return dateB - dateA;
        });

        const uniqueCategories: string[] = Array.from(
          new Set(allProducts.map((p: Product) => String(p.category)))
        ).filter((c) => c !== "") as string[];
        setCategories(uniqueCategories);
        dispatch(addProducts(allProducts));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);

        // Auto close popup with fade animation
        setTimeout(() => {
          setShowLoadingPopup(false);
        }, 800);
      }
    };

    if (!hasFetched) {
      fetchProducts();
      setHasFetched(true);
    }
  }, [dispatch, hasFetched]);

  useEffect(() => {
    let filteredProducts = [...allProducts];

    if (selectedCategory !== "all") {
      filteredProducts = filteredProducts.filter((p) => p.category === selectedCategory);
    }

    const sortedByDate = filteredProducts.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : getCreationTimeFromId(a._id).getTime();
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : getCreationTimeFromId(b._id).getTime();
      return dateB - dateA;
    });

    setCurrentProducts(sortedByDate);
  }, [allProducts, selectedCategory]);

  const sortProducts = (sortValue: string) => {
    const filteredProducts = [...currentProducts];

    if (sortValue === "default") {
      filteredProducts.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : getCreationTimeFromId(a._id).getTime();
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : getCreationTimeFromId(b._id).getTime();
        return dateB - dateA;
      });
    } else {
      filteredProducts.sort((a, b) => {
        const aPrice = a.discountPercentage === 0 ? a.price : a.salePrice ?? a.price;
        const bPrice = b.discountPercentage === 0 ? b.price : b.salePrice ?? b.price;

        if (sortValue === "asc") return aPrice - bPrice;
        if (sortValue === "desc") return bPrice - aPrice;
        return 0;
      });
    }

    setCurrentProducts(filteredProducts);
  };

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 py-10 bg-gradient-to-br from-pink-50 via-yellow-50 to-purple-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 font-karla">
      <div className="max-w-screen-xl mx-auto">
        {/* ------------ LOADING POPUP ------------- */}
        {showLoadingPopup && (
          <div
            className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-500 ${
              !loading ? "opacity-0 pointer-events-none" : "opacity-100"
              // "opacity-100"
            }`}
          >
            <div className="bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-3xl shadow-2xl w-[90%] max-w-[420px] animate-fade-in">
              <h2 className="text-xl sm:text-2xl font-semibold text-center mb-6 text-gray-700 dark:text-gray-200">
                Loading Products...
              </h2>

              {/* 🌟 Auto-Sliding Image Loader */}
              <div className="flex justify-center mb-10">
                <img
                  src={["/mahakumbh.jpg", "/banner.jpg", "/gbkeychains.jpg"][slideIndex]}
                  onClick={() => setZoomImage(["/mahakumbh.jpg", "/banner.jpg", "/gbkeychains.jpg"][slideIndex])}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl shadow-lg cursor-pointer animate-fade transition-all duration-500"
                />
              </div>

              {/* 🔍 Fullscreen Zoom Modal */}
              {zoomImage && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[999]">
                  <div className="relative">
                    {/* Close button */}
                    <button
                      onClick={() => setZoomImage(null)}
                      className="absolute -top-6 -right-6 bg-white text-black rounded-full w-10 h-10 text-xl shadow-lg hover:bg-gray-200"
                    >
                      ✕
                    </button>

                    {/* Zoomed Image */}
                    <img
                      src={zoomImage}
                      className="max-w-[90vw] max-h-[80vh] rounded-2xl shadow-2xl transform transition-all duration-300 scale-100"
                    />
                  </div>
                </div>
              )}

              {/* Three bouncing dots */}
              <div className="flex justify-center mt-2 space-x-3">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-purple-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-pink-500 rounded-full animate-bounce delay-150"></div>
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-500 rounded-full animate-bounce delay-300"></div>
              </div>

              <p className="text-center mt-5 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                Please wait, products are loading...
              </p>
            </div>
          </div>
        )}

        {/* ------------ END POPUP ------------- */}

        {loading ? (
          <div>
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-xl font-semibold text-gray-700 dark:text-white mb-4">
                Please wait, products are loading...
              </p>

              <div className="flex space-x-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
                <div
                  className="w-3 h-3 bg-pink-500 rounded-full animate-bounce"
                  style={{ animationDelay: ".2s" }}
                ></div>
                <div
                  className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce"
                  style={{ animationDelay: ".4s" }}
                ></div>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 animate-pulse px-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-md space-y-4">
                  <div className="w-full h-48 bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded-md w-3/4"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded-md w-1/2"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded-md w-16"></div>
                    <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white tracking-wide shadow-sm">
                🛍️ {t("products")}
              </h1>

              <div className="flex gap-3">
                <select
                  className="border border-gray-400 dark:border-gray-600 bg-white dark:bg-slate-700 dark:text-white px-4 py-2 rounded-md shadow-sm focus:outline-none"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">{t("All Categories")}</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

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
            </div>

            <div className="grid gap-6 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
              {currentProducts.map((product) => (
                <div key={product._id} className="transform hover:-translate-y-1 transition duration-300">
                  <ProductCard {...product} rating={product.rating ?? 0} images={product.images} />
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
