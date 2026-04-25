import { FC, useEffect, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { addProducts } from "../redux/features/productSlice";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import { Product } from "../models/Product";
import BASE_URL from "../config/apiconfig";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const AllProducts: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [currentProducts, setCurrentProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const hasFetchedRef = useRef(false);

  const allProducts = useAppSelector((state) => state.productReducer.allProducts || []);

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

        const fetchedProducts = data.categories.flatMap((cat: { category: string; products: Product[] }) =>
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

        fetchedProducts.sort((a: Product, b: Product) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : getCreationTimeFromId(a._id).getTime();
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : getCreationTimeFromId(b._id).getTime();
          return dateB - dateA;
        });

        const uniqueCategories: string[] = Array.from(
          new Set(fetchedProducts.map((p: Product) => String(p.category)))
        ).filter((c) => c !== "") as string[];
        
        setCategories(uniqueCategories);
        dispatch(addProducts(fetchedProducts));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchProducts();
    }
  }, [dispatch]);

  useEffect(() => {
    let filteredProducts = [...allProducts];

    if (selectedCategory !== "all") {
      filteredProducts = filteredProducts.filter((p) => p.category === selectedCategory);
    }

    const sortedByDate = [...filteredProducts].sort((a, b) => {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-900 font-inter">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight font-poppins">
              Our Collection
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm sm:text-base">
              Discover premium quality and modern designs.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <select
              className="flex-1 sm:flex-none border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-4 py-2.5 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-600 transition-all text-sm font-medium cursor-pointer"
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
              className="flex-1 sm:flex-none border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-4 py-2.5 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-600 transition-all text-sm font-medium cursor-pointer"
              onChange={(e) => sortProducts(e.target.value)}
            >
              <option value="default">{t("defaultSort")}</option>
              <option value="asc">{t("priceLowToHigh")}</option>
              <option value="desc">{t("priceHighToLow")}</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : currentProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700">
            <p className="text-xl font-medium text-zinc-500 dark:text-zinc-400">No products found.</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {currentProducts.map((product) => (
              <ProductCard key={product._id} {...product} rating={product.rating ?? 0} images={product.images} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
