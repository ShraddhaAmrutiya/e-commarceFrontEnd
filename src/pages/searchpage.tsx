import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
type Product = {
    _id: string;
    title: string;
    description: string;
    image: string;
    price: number;
    salePrice: number;
    rating: number;
    brand: string;
  };
  
const SearchPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (query) {
          const res = await axios.get<Product[]>(`${BASE_URL}/products/search?q=${query}`);
          setProducts(res.data);
        }
      } catch (err) {
        console.error("Search failed", err);
      }
    };
    fetchData();
  }, [query]);

  const handleClick = (id: string) => {
    navigate(`/products/${id}`);
  };

  return (
    <div className="container mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold mb-4">Search Results for: {query}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              onClick={() => handleClick(product._id)}
              className="border p-4 rounded shadow cursor-pointer hover:shadow-lg transition-all dark:bg-slate-700"
            >
              <img
                src={`${BASE_URL}${product.image}`}
                alt={product.title}
                className="w-full h-40 object-cover mb-2 rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.jpg";
                }}
              />
              <h3 className="text-lg font-semibold">{product.title}</h3>
              <p className="text-sm text-gray-500">{product.brand}</p>
              <p className="text-sm text-gray-600">{product.description}</p>
              <div className="mt-2">
                <p className="text-blue-600 font-bold line-through">₹{product.price}</p>
                <p className="text-green-600 font-bold">₹{product.salePrice}</p>
              </div>
              <p className="text-yellow-500 mt-1">⭐ {product.rating}</p>
            </div>
          ))
        ) : (
          <p className="col-span-full">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
