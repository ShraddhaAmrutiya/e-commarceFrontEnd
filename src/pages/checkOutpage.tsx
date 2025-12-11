import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import BASE_URL from "../config/apiconfig";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../redux/hooks";
import { fetchCartItems } from "../models/CartSlice";

interface Product {
  _id: string;
  title: string;
  images: string[];
  price: number;
  salePrice: number;
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
  const dispatch = useAppDispatch();

  const userId = localStorage.getItem("userId") || "";
  const token = localStorage.getItem("accessToken") || "";

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Customization & image upload
  const [customization, setCustomization] = useState<{ [key: string]: string }>({});
  const [images, setImages] = useState<{ [key: string]: File | null }>({});

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen px-4">
        <p className="text-lg text-gray-600 text-center">{t("checkout.emptyCartMessage")}</p>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    const outOfStockItem = cartItems.find((item) => item.productId.stock < item.quantity);
    if (outOfStockItem) {
      toast.error(t("checkout.outOfStockError", { product: outOfStockItem.productId.title }), { autoClose: 2000 });
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("userId", userId);

      // Append product data
      cartItems.forEach((item, index) => {
        formData.append(`products[${index}][productId]`, item.productId._id);
        formData.append(`products[${index}][quantity]`, item.quantity.toString());
        formData.append(`products[${index}][customization]`, customization[item.productId._id] || "");

        if (images[item.productId._id]) {
          formData.append("images", images[item.productId._id] as File);
        }
      });

      await axiosInstance.post(`${BASE_URL}/order/cart/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(t("checkout.orderSuccess"));
      dispatch(fetchCartItems(userId));

      setTimeout(() => navigate("/orders", { replace: true }), 1500);
    } catch (error) {
      console.error(error);
      setMessage(t("checkout.orderFailure"));
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = cartItems.reduce(
    (acc: number, item: CartItem) => acc + (item.productId.salePrice ?? item.productId.price) * item.quantity,
    0
  );

  const handleBackToCart = () => {
    navigate(`/cart/${userId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={handleBackToCart}
        className="mb-6 px-6 py-3 bg-gray-300 text-gray-800 rounded-xl hover:bg-gray-400 transition"
      >
        {t("checkout.backToCart")}
      </button>

      <h2 className="text-3xl font-bold mb-8 text-center">{t("checkout.titlecheckout")}</h2>

      {message && (
        <p className={`text-center mb-6 text-lg ${message.includes("success") ? "text-green-600" : "text-red-500"}`}>
          {message}
        </p>
      )}

      <div className="grid gap-8">
        {cartItems.map((item: CartItem) => (
          <div key={item._id} className="bg-white shadow-md rounded-2xl p-6 space-y-6">
            
            {/* IMAGE + PRODUCT DETAILS */}
            <div className="flex flex-col sm:flex-row gap-6">
              <img
                src={
                  item.productId.images?.[0]
                    ? item.productId.images[0].startsWith("/")
                      ? `${BASE_URL}${item.productId.images[0]}`
                      : item.productId.images[0]
                    : "/placeholder.jpg"
                }
                className="w-32 h-32 object-cover rounded-xl"
                alt={item.productId.title}
              />

              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-semibold">{item.productId.title}</h3>
                <p className="text-gray-600">
                  {t("checkout.quantity")}: {item.quantity}
                </p>
                <p className="text-gray-600">
                  {t("checkout.price")}: ₹{item.productId.salePrice ?? item.productId.price}
                </p>
                <p className="font-medium">
                  {t("checkout.total")}: ₹{(item.productId.salePrice ?? item.productId.price) * item.quantity}
                </p>
              </div>
            </div>

            {/* CUSTOMIZATION */}
            <div className="space-y-3">
              <label className="text-lg font-medium text-gray-700">
                {t("customization Description") || "Customization Description"}
              </label>

              <textarea
                placeholder={t("Add custamization suggetion")}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 min-h-[100px]"
                onChange={(e) =>
                  setCustomization((prev) => ({
                    ...prev,
                    [item.productId._id]: e.target.value,
                  }))
                }
              />
            </div>

            {/* IMAGE UPLOAD */}
            <div className="space-y-3">
              <label className="text-lg font-medium text-gray-700">
                {t("Upload image for refrance") || "Upload Photo"}
              </label>

              <input
                type="file"
                accept="image/*"
                className="block w-full border rounded-lg p-3 bg-gray-50"
                onChange={(e) =>
                  setImages((prev) => ({
                    ...prev,
                    [item.productId._id]: e.target.files?.[0] || null,
                  }))
                }
              />
            </div>
          </div>
        ))}
      </div>

      {/* TOTAL + BUTTON */}
      <div className="mt-10 text-right">
        <p className="text-xl font-bold mb-4">
          {t("checkout.totalAmount")}: ₹{totalAmount.toFixed(2)}
        </p>

        <button
          onClick={handlePlaceOrder}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md"
          disabled={loading}
        >
          {loading ? t("checkout.placingOrder") : t("checkout.placeOrder")}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
