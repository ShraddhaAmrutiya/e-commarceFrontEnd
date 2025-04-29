
import { FC, useEffect, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { addProducts } from "../redux/features/productSlice";
import ProductCard from "../components/ProductCard";
import { Product } from "../models/Product";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config/apiconfig";
const AllProducts: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const sortRef = useRef<HTMLSelectElement>(null);
  const [currentProducts, setCurrentProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  const allProducts = useAppSelector((state) => state.productReducer.allProducts || []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/products/all`, {
          headers: {
            Authorization: `Bearer YOUR_TOKEN_HERE`, // Replace with actual token
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // console.log("API Response:", data);

        if (!data.categories || !Array.isArray(data.categories)) {
          throw new Error("Invalid API response format");
        }

        const allProducts = data.categories.flatMap((cat: { category: string; products: Product[] }) =>
          (cat.products || []).map((product) => {
            const imageUrl =
            typeof product.image === "string" && product.image.startsWith("/")
              ? `${BASE_URL}${product.image}`
              : typeof product.image === "string"
              ? product.image
              : `${BASE_URL}/uploads/default-image.jpg`; // fallback for File or undefined
          
            return {
              ...product,
              image: imageUrl, 
              category: cat.category,
            };
          })
        );

        // console.log("Processed Products:", allProducts);

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
    setCurrentProducts(allProducts);
  }, [allProducts]);

  const sortProducts = (sortValue: string) => {
    if (sortValue === "default") {
      setCurrentProducts(allProducts); 
      return;
    }
    const sortedProducts = [...currentProducts].sort((a, b) => {
      const aPrice = a.salePrice ?? a.price;
      const bPrice = b.salePrice ?? b.price;

      if (sortValue === "asc") return aPrice - bPrice;
      if (sortValue === "desc") return bPrice - aPrice;
      return 0;
    });

    setCurrentProducts(sortedProducts);
  };

  return (
    <div className="container mx-auto min-h-[83vh] p-4 font-karla">
      {loading ? (
        <div className="text-center text-lg dark:text-white">Loading products...</div>
      ) : (
        <div className="grid grid-cols-4 gap-1">
          <div className="col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg dark:text-white">Products</span>
              <select
                ref={sortRef}
                className="border border-black dark:border-white rounded p-1 dark:text-white dark:bg-slate-600"
                onChange={(e) => sortProducts(e.target.value)}
              >
                <option value="default">Default</option>
                <option value="asc">Price (low to high)</option>
                <option value="desc">Price (high to low)</option>
              </select>
            </div>

            <div className="grid gap-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
              {currentProducts.map((product) => (
                <div
                  key={product._id} // Ensure product.id exists
                  onClick={() => navigate(`/products/${product._id}`)} // Navigate to product details
                >
                  <ProductCard
                    {...product}
                    rating={product.rating ?? 0}
                    image={product.image}
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
