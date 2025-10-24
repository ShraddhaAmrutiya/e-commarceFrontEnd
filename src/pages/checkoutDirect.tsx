import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import BASE_URL from "../config/apiconfig";
import { useTranslation } from "react-i18next";

interface Product {
  productId: string;
  title: string;
  images: string[];
  price: number;
  salePrice?: number;
  stock?: number;
}

const CheckoutDirectPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("accessToken");
  const language = localStorage.getItem("language") || "en";

  // ✅ Load product from sessionStorage safely
  useEffect(() => {
    const storedItem = sessionStorage.getItem("checkoutItem");

    if (!storedItem) {
      toast.error(t("noProductSelected") || "No product selected for direct checkout.");
      navigate("/", { replace: true });
      return;
    }

    try {
      const parsed: Product = JSON.parse(storedItem);

      // Ensure images is an array
      if (parsed && parsed.images && !Array.isArray(parsed.images)) {
        parsed.images = [parsed.images];
      }

      setProduct(parsed);
    } catch {
      toast.error(t("invalidProductData") || "Invalid product data.");
      navigate("/", { replace: true });
    }
  }, [navigate, t]);

  const handleDirectOrder = async () => {
    if (!product || !userId || !token) return;

    if (product.stock !== undefined && product.stock < 1) {
      toast.error(`${product.title} ${t("outOfStock") || "is out of stock"}`);
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post(
        `${BASE_URL}/order/direct`,
        { userId, productId: product.productId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": language,
          },
        }
      );

      toast.success(t("orderSuccess") || "Order placed successfully!");
      sessionStorage.removeItem("checkoutItem");
      navigate("/orders", { replace: true });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          t("orderFailed") ||
          "Order failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    if (product) navigate(`/products/${product.productId}`);
  };

  if (!product) return null;

  const price = product.salePrice ?? product.price;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Back Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleBackClick}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400 transition"
        >
          {t("backToProduct") || "Back to product"}
        </button>
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-bold mb-6 text-center">
        {t("confirmOrder") || "Confirm Your Order"}
      </h2>

      {/* Product Card */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={
            product.images?.[0]
              ? product.images[0].startsWith("/")
                ? `${BASE_URL}${product.images[0]}`
                : product.images[0]
              : "/placeholder.jpg"
          }
          alt={product.title}
          className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-md"
        />

        <div className="flex-1 w-full">
          <h3 className="text-lg sm:text-xl font-semibold">{product.title}</h3>
          <p className="text-gray-600 mt-1">{t("price") || "Price"}: ₹{price}</p>
          <p className="text-gray-700">{t("quantity") || "Quantity"}: 1</p>
          <p className="text-gray-800 font-bold mt-2">{t("total") || "Total"}: ₹{price}</p>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="mt-8 flex justify-center sm:justify-end">
        <button
          onClick={handleDirectOrder}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white text-lg rounded-xl hover:bg-blue-700 transition w-full sm:w-auto"
        >
          {loading ? t("placingOrder") || "Placing Order..." : t("placeOrder") || "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutDirectPage;
