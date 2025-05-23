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

//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }

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
//     setCurrentProducts(allProducts);
//   }, [allProducts]);

//   const sortProducts = (sortValue: string) => {
//     if (sortValue === "default") {
//       setCurrentProducts(allProducts);
//       return;
//     }

//     const sortedProducts = [...currentProducts].sort((a, b) => {
//       const aPrice =
//         a.discountPercentage === 0 ? a.price : a.salePrice ?? a.price;
//       const bPrice =
//         b.discountPercentage === 0 ? b.price : b.salePrice ?? b.price;

//       if (sortValue === "asc") return aPrice - bPrice;
//       if (sortValue === "desc") return bPrice - aPrice;
//       return 0;
//     });

//     setCurrentProducts(sortedProducts);
//   };

//   return (
//     <div className="container mx-auto min-h-[83vh] p-4 font-karla">
//       {loading ? (
//         <div className="text-center text-lg dark:text-white">
//           {t("loadingProducts")}
//         </div>
//       ) : (
//         <div className="grid grid-cols-4 gap-1">
//           <div className="col-span-4 space-y-4">
//             <div className="flex items-center justify-between">
//               <span className="text-lg dark:text-white">{t("products")}</span>
//               <select
//                 ref={sortRef}
//                 className="border border-black dark:border-white rounded p-1 dark:text-white dark:bg-slate-600"
//                 onChange={(e) => sortProducts(e.target.value)}
//               >
//                 <option value="default">{t("defaultSort")}</option>
//                 <option value="asc">{t("priceLowToHigh")}</option>
//                 <option value="desc">{t("priceHighToLow")}</option>
//               </select>
//             </div>

//             <div className="grid gap-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
//               {currentProducts.map((product) => (
//                 <div
//                   key={product._id}
//                   onClick={() => navigate(`/products/${product._id}`)}
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
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllProducts;


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

  // Helper function to get creation date from MongoDB ObjectId if createdAt is not present
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

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

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

        // Sort by createdAt if exists, else by _id creation time, newest first
        allProducts.sort((a:Product, b:Product) => {
          const dateA = a.createdAt
            ? new Date(a.createdAt).getTime()
            : getCreationTimeFromId(a._id).getTime();
          const dateB = b.createdAt
            ? new Date(b.createdAt).getTime()
            : getCreationTimeFromId(b._id).getTime();
          return dateB - dateA; // newest first
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
    // When allProducts updates, also apply the default sorting (latest first)
    const sortedByDate = [...allProducts].sort((a, b) => {
      const dateA = a.createdAt
        ? new Date(a.createdAt).getTime()
        : getCreationTimeFromId(a._id).getTime();
      const dateB = b.createdAt
        ? new Date(b.createdAt).getTime()
        : getCreationTimeFromId(b._id).getTime();
      return dateB - dateA; // newest first
    });

    setCurrentProducts(sortedByDate);
  }, [allProducts]);

  const sortProducts = (sortValue: string) => {
    if (sortValue === "default") {
      // Default sorting: latest first
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
      const aPrice =
        a.discountPercentage === 0 ? a.price : a.salePrice ?? a.price;
      const bPrice =
        b.discountPercentage === 0 ? b.price : b.salePrice ?? b.price;

      if (sortValue === "asc") return aPrice - bPrice;
      if (sortValue === "desc") return bPrice - aPrice;
      return 0;
    });

    setCurrentProducts(sortedProducts);
  };

  return (
    <div className="container mx-auto min-h-[83vh] p-4 font-karla">
      {loading ? (
        <div className="text-center text-lg dark:text-white">
          {t("loadingProducts")}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-1">
          <div className="col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg dark:text-white">{t("products")}</span>
              <select
                ref={sortRef}
                className="border border-black dark:border-white rounded p-1 dark:text-white dark:bg-slate-600"
                onChange={(e) => sortProducts(e.target.value)}
              >
                <option value="default">{t("defaultSort")}</option>
                <option value="asc">{t("priceLowToHigh")}</option>
                <option value="desc">{t("priceHighToLow")}</option>
              </select>
            </div>

            <div className="grid gap-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
              {currentProducts.map((product) => (
                <div
                  key={product._id}
                  onClick={() => navigate(`/products/${product._id}`)}
                >
                  <ProductCard
                    {...product}
                    rating={product.rating ?? 0}
                    images={product.images}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProducts;
