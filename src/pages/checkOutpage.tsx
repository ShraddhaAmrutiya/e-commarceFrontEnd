import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../config/apiconfig";
import { useTranslation } from "react-i18next";

interface Product {
  _id: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  salePrice: number;
  discountPercentage: number;
  stock: number;
}

interface CartItem {
  _id: string;
  productId: Product;
  quantity: number;
}

const CheckoutPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const cartItems = location.state?.cartItems;
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("accessToken");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">{t("checkout.emptyCartMessage")}</p>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    const outOfStockItem = cartItems.find((item) => item.productId.stock < item.quantity);
    if (outOfStockItem) {
      toast.error(t("checkout.outOfStockError", { product: outOfStockItem.productId.title }), {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${BASE_URL}/order/cart/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            userId,
          },
        }
      );

      setMessage(t("checkout.orderSuccess"));

      setTimeout(() => {
        navigate("/orders", { replace: true });
      }, 1500);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(t("checkout.orderFailure"));
      } else {
        setMessage(t("checkout.somethingWentWrong"));
      }
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = cartItems.reduce(
    (acc: number, item: CartItem) => acc + (item.productId.salePrice ?? item.productId.price) * item.quantity,
    0
  );

  const handleBackToCart = () => {
    if (userId) {
      navigate(`/cart/${userId}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back to Cart Button */}
      <button
        onClick={handleBackToCart}
        className="mb-4 px-6 py-3 bg-gray-300 text-gray-800 text-lg rounded-xl hover:bg-gray-400 transition"
      >
        {t("checkout.backToCart")}
      </button>

      <h2 className="text-3xl font-bold mb-6 text-center">{t("checkout.titlecheckout")}</h2>

      {message && (
        <div className={`text-center mb-4 ${message.includes(t("checkout.orderSuccess")) ? "text-green-600" : "text-red-500"}`}>
          {message}
        </div>
      )}

      <div className="grid gap-6">
        {cartItems.map((item: CartItem) => (
          <div key={item._id} className="flex items-center gap-4 bg-white shadow-md rounded-2xl p-4">
            <img
              src={
                item.productId.images?.[0]
                  ? item.productId.images[0].startsWith("/")
                    ? `${BASE_URL}${item.productId.images[0]}`
                    : item.productId.images[0]
                  : "/placeholder.jpg"
              }
              alt={item.productId.title}
              className="w-24 h-24 object-cover rounded-lg"
            />

            <div className="flex-1">
              <h3 className="text-xl font-semibold">{item.productId.title}</h3>
              <p className="text-gray-600">{t("checkout.quantity")}: {item.quantity}</p>
              <p className="text-gray-600">{t("checkout.price")}: ₹{item.productId.salePrice ?? item.productId.price}</p>
              <p className="text-gray-800 font-medium">
                {t("checkout.total")}: ₹{(item.productId.salePrice ?? item.productId.price) * item.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-end">
        <div className="text-xl font-bold mb-4">{t("checkout.totalAmount")}: ₹{totalAmount.toFixed(2)}</div>
        <button
          onClick={handlePlaceOrder}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg rounded-xl shadow-md transition duration-200"
          disabled={loading}
        >
          {loading ? t("checkout.placingOrder") : t("checkout.placeOrder")}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
