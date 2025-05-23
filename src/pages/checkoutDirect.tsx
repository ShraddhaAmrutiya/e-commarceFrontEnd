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
  salePrice: number;
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

  useEffect(() => {
    const storedItem = sessionStorage.getItem("checkoutItem");
    if (!storedItem) {
      toast.error(t("cart.emptyCartMessage") || "No product selected for direct checkout.");
      navigate("/");
      return;
    }

    try {
      const parsed = JSON.parse(storedItem);

      if (parsed.image && !parsed.images) {
        parsed.images = parsed.image;
      }

      setProduct(parsed);
    } catch (err) {
      toast.error(t("cart.invalidProductData") || "Invalid product data.");
      navigate("/");
    }
  }, [navigate, t]);

  const handleDirectOrder = async () => {
    if (!product || !userId || !token) return;

    if (product.stock !== undefined && product.stock < 1) {
      toast.error(t("cart.outOfStockError", { product: product.title }) || `${product.title} is out of stock`);
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post(
        `${BASE_URL}/order/direct`,
        {
          userId,
          productId: product.productId,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": language,
          },
        }
      );

      toast.success(t("order.successMessage") || "Order placed successfully!");
      sessionStorage.removeItem("checkoutItem");
      setTimeout(() => navigate("/orders", { replace: true }), 300);
    } catch (error: unknown) {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message || t("order.failureMessage") || "Order failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    if (product) {
      navigate(`/products/${product.productId}`);
    }
  };

  if (!product) return null;

  const price = product.salePrice ?? product.price;

  return (
    <div className="max-w-2xl mx-auto p-6 relative">
      <button
        onClick={handleBackClick}
        className="absolute top-4 right-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400 transition"
      >
        {t("cart.backToCart") || "Back to product"}
      </button>

      <h2 className="text-2xl font-bold mb-4 text-center">{t("checkout.title") || "Confirm Your Order"}</h2>

      <div className="bg-white rounded-xl shadow-md p-4 flex gap-4 items-center">
        <img
          src={
            product.images?.[0]
              ? product.images[0].startsWith("/")
                ? `${BASE_URL}${product.images[0]}`
                : product.images[0]
              : "/placeholder.jpg"
          }
          alt={product.title}
          className="w-24 h-24 object-cover rounded"
        />

        <div>
          <h3 className="text-lg font-semibold">{product.title}</h3>
          <p className="text-gray-600">{t("cart.price")}: ₹{price}</p>
          <p className="text-gray-700 font-medium">{t("cart.quantity")}: 1</p>
          <p className="text-gray-800 font-bold mt-2">{t("cart.total")}: ₹{price}</p>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleDirectOrder}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white text-lg rounded-xl hover:bg-blue-700 transition"
        >
          {loading ? t("order.placingOrder") || "Placing Order..." : t("order.placeOrder") || "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutDirectPage;
