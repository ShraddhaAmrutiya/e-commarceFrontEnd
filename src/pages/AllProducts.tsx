// import { FC, useEffect, useRef, useState } from "react";
// import { useAppSelector, useAppDispatch } from "../redux/hooks";
// import { addProducts } from "../redux/features/productSlice";
// import ProductCard from "../components/ProductCard";
// import { Product } from "../models/Product";
// import { useNavigate } from "react-router-dom";
// import BASE_URL from "../config/apiconfig";
// import { useTranslation } from "react-i18next";

// const AllProducts: FC = () => {
//   const { t } = useTranslation();
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();
//   const sortRef = useRef<HTMLSelectElement>(null);
//   const [currentProducts, setCurrentProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [hasFetched, setHasFetched] = useState(false);
//   const allProducts = useAppSelector(
//     (state) => state.productReducer.allProducts || []
//   );

//   const getCreationTimeFromId = (id: string) => {
//     return new Date(parseInt(id.substring(0, 8), 16) * 1000);
//   };

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const language = localStorage.getItem("language") || "en";
//       setLoading(true);
//       try {
//         const response = await fetch(`${BASE_URL}/products/all`, {
//           headers: {
//             Authorization: `Bearer YOUR_TOKEN_HERE`,
//             Accept: "application/json",
//             "Accept-Language": language,
//           },
//         });

//         if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

//         const data = await response.json();

//         if (!data.categories || !Array.isArray(data.categories)) {
//           throw new Error("Invalid API response format");
//         }

//         const allProducts = data.categories.flatMap(
//           (cat: { category: string; products: Product[] }) =>
//             (cat.products || []).map((product) => {
//               const imageUrl =
//                 Array.isArray(product.images) && product.images.length > 0
//                   ? `${BASE_URL}${product.images[0]}`
//                   : `${BASE_URL}/uploads/default-image.jpg`;

//               return {
//                 ...product,
//                 image: imageUrl,
//                 category: cat.category,
//               };
//             })
//         );

//         allProducts.sort((a: Product, b: Product) => {
//           const dateA = a.createdAt
//             ? new Date(a.createdAt).getTime()
//             : getCreationTimeFromId(a._id).getTime();
//           const dateB = b.createdAt
//             ? new Date(b.createdAt).getTime()
//             : getCreationTimeFromId(b._id).getTime();
//           return dateB - dateA;
//         });

//         dispatch(addProducts(allProducts));
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (!hasFetched) {
//       fetchProducts();
//       setHasFetched(true);
//     }
//   }, [dispatch, hasFetched]);

//   useEffect(() => {
//     const sortedByDate = [...allProducts].sort((a, b) => {
//       const dateA = a.createdAt
//         ? new Date(a.createdAt).getTime()
//         : getCreationTimeFromId(a._id).getTime();
//       const dateB = b.createdAt
//         ? new Date(b.createdAt).getTime()
//         : getCreationTimeFromId(b._id).getTime();
//       return dateB - dateA;
//     });

//     setCurrentProducts(sortedByDate);
//   }, [allProducts]);

//   const sortProducts = (sortValue: string) => {
//     if (sortValue === "default") {
//       const sortedByDate = [...allProducts].sort((a, b) => {
//         const dateA = a.createdAt
//           ? new Date(a.createdAt).getTime()
//           : getCreationTimeFromId(a._id).getTime();
//         const dateB = b.createdAt
//           ? new Date(b.createdAt).getTime()
//           : getCreationTimeFromId(b._id).getTime();
//         return dateB - dateA;
//       });
//       setCurrentProducts(sortedByDate);
//       return;
//     }

//     const sortedProducts = [...currentProducts].sort((a, b) => {
//       const aPrice = a.discountPercentage === 0 ? a.price : a.salePrice ?? a.price;
//       const bPrice = b.discountPercentage === 0 ? b.price : b.salePrice ?? b.price;

//       if (sortValue === "asc") return aPrice - bPrice;
//       if (sortValue === "desc") return bPrice - aPrice;
//       return 0;
//     });

//     setCurrentProducts(sortedProducts);
//   };

//   return (
//     <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-pink-50 via-yellow-50 to-purple-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 font-karla">
//       <div className="max-w-screen-xl mx-auto">
//         {loading ? (
//           <div className="text-center text-lg text-gray-700 dark:text-white">
//             {t("loadingProducts")}
//           </div>
//         ) : (
//           <div>
//             <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
//               <h1 className="text-3xl font-bold text-gray-800 dark:text-white tracking-wide shadow-sm">
//                 🛍️ {t("products")}
//               </h1>
//               <select
//                 ref={sortRef}
//                 className="border border-gray-400 dark:border-gray-600 bg-white dark:bg-slate-700 dark:text-white px-4 py-2 rounded-md shadow-sm focus:outline-none"
//                 onChange={(e) => sortProducts(e.target.value)}
//               >
//                 <option value="default">{t("defaultSort")}</option>
//                 <option value="asc">{t("priceLowToHigh")}</option>
//                 <option value="desc">{t("priceHighToLow")}</option>
//               </select>
//             </div>

//             <div className="grid gap-6 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
//               {currentProducts.map((product) => (
//                 <div
//                   key={product._id}
//                   onClick={() => navigate(`/products/${product._id}`)}
//                   className="cursor-pointer transform hover:-translate-y-1 transition duration-300"
//                 >
//                   <ProductCard
//                     {...product}
//                     rating={product.rating ?? 0}
//                     images={product.images}
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllProducts;

import { FC, useEffect, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { addProducts } from "../redux/features/productSlice";
import ProductCard from "../components/ProductCard";
import { Product } from "../models/Product";
import BASE_URL from "../config/apiconfig";
import { useTranslation } from "react-i18next";
import { ArrowBigDown } from "lucide-react";

const AllProducts: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
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
    <div className="min-h-screen pt-24 px-4 sm:px-6 py-10 bg-gradient-to-br from-pearl-50 via-resin-50 to-ocean-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 font-poppins relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-resin-200/30 rounded-full animate-float"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-gold-200/30 rounded-full animate-float" style={{animationDelay: '3s'}}></div>
      <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-ocean-200/30 rounded-full animate-float" style={{animationDelay: '1.5s'}}></div>
      
      <div className="max-w-screen-xl mx-auto relative z-10">
        {loading ? (
          <div className="text-center py-20">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-lg text-resin-600 font-medium animate-pulse-slow">
              {t("loadingProducts") || "Loading beautiful resin art..."}
            </p>
          </div>
        ) : (
          <>
            {/* Header Section */}
            <div className="text-center mb-12 animate-fadeInDown">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold resin-text-gradient tracking-wide mb-4">
                ✨ {t("products") || "Our Creations"} ✨
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                Discover our complete collection of handcrafted resin art pieces
              </p>
            </div>

            {/* Sort Controls */}
            <div className="flex flex-col sm:flex-row justify-center items-center mb-8 gap-4 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
              <div className="glass-bg px-6 py-3 rounded-2xl">
                <label className="block text-sm font-semibold text-resin-700 mb-2">
                  Sort by:
                </label>
                <select
                  ref={sortRef}
                  className="border-2 border-resin-300 rounded-xl bg-white/80 backdrop-blur-sm text-resin-700 px-4 py-2 focus:outline-none focus:border-resin-500 transition-all duration-300 font-medium"
                  onChange={(e) => sortProducts(e.target.value)}
                >
                  <option value="default">{t("defaultSort") || "Newest First"}</option>
                  <option value="asc">{t("priceLowToHigh") || "Price: Low to High"}</option>
                  <option value="desc">{t("priceHighToLow") || "Price: High to Low"}</option>
                </select>
              </div>
            </div>

            {/* Decorative Arrow */}
            <div className="flex justify-center mb-8 animate-bounce-slow">
              <div className="bg-resin-gradient p-3 rounded-full shadow-resin hover:shadow-gold transition-all duration-300 hover:scale-110">
                <ArrowBigDown className="text-white w-6 h-6" />
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid gap-8 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
              {currentProducts.map((product, index) => (
                <div
                  key={product._id}
                  className="animate-fadeInUp"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <ProductCard
                    {...product}
                    rating={product.rating ?? 0}
                    images={product.images}
                  />
                </div>
              ))}
            </div>

            {/* Empty State */}
            {currentProducts.length === 0 && !loading && (
              <div className="text-center py-20 animate-fadeInUp">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-2xl font-playfair font-bold resin-text-gradient mb-4">
                  No Products Found
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  We're working on adding more beautiful resin art pieces. Check back soon!
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
