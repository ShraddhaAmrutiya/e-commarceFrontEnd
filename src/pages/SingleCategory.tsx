import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../models/Product";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";

const SingleCategory: FC = () => {
  const { id } = useParams();
  const [productList, setProductList] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Assuming you're storing the token in localStorage (you can use a context or state if needed)
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/category/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Include token for authentication
          },
        });

        if (!response.ok) throw new Error("Failed to fetch category details");
        const data = await response.json();
        setCategoryName(data.name || "Unknown Category");
      } catch (error) {
        console.error("Error fetching category details:", error);
        setError("Error loading category");
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/category/products/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Include token for authentication
          },
        });

        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProductList(data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Error loading products");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCategoryDetails();
      fetchProducts();
    }
  }, [id, token]);

  if (error) {
    return <div className="text-center text-red-500 font-bold">{error}</div>;
  }

  return (
    <div className="container mx-auto min-h-[83vh] p-4 font-karla">
      <div className="flex items-center space-x-2 text-lg dark:text-white">
        <Link to="/categories" className="hover:underline text-blue-600 dark:text-blue-400">
          Categories
        </Link>
        <span> {">"} </span>
        <span className="font-bold">{loading ? "Loading..." : categoryName}</span>
      </div>
      {loading ? (
        <p className="text-center my-4">Loading products...</p>
      ) : (
        <div className="grid gap-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 my-2">
          {productList.length > 0 ? (
            productList.map((product) => <ProductCard key={product._id} {...product} category={categoryName} />)
          ) : (
            <p className="text-center text-gray-500">No products found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SingleCategory;
