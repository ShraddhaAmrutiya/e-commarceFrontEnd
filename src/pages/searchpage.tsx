import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BASE_URL from "../config/apiconfig";
import axios from "axios";
import { useTranslation } from "react-i18next";

type Product = {
  _id: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  salePrice: number;
  rating: number;
  brand: string;
};

const SearchPage = () => {
  const { t } = useTranslation();
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
        console.error(t("search.error"), err);
      }
    };
    fetchData();
  }, [query, t]);

  const getImageSrc = (imagePath?: string): string => {
    if (!imagePath) return "/placeholder.jpg";
    return imagePath.startsWith("http") ? imagePath : `${BASE_URL}${imagePath}`;
  };

  const handleClick = (id: string) => {
    navigate(`/products/${id}`);
  };

  return (
    <div className="container mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold mb-4">
        {t("search.resultsFor")} {query}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              onClick={() => handleClick(product._id)}
              className="border p-4 rounded shadow cursor-pointer hover:shadow-lg transition-all dark:bg-slate-700"
            >
              <img
                src={getImageSrc(product.images?.[0])}
                alt={product.title}
                className="w-full h-40 object-cover mb-2 rounded"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  if (!img.src.includes("/placeholder.jpg")) {
                    img.src = "/placeholder.jpg";
                  }
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
          <p className="col-span-full">{t("search.noProducts")}</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
