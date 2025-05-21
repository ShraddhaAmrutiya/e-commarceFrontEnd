import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { removeFromCart } from "../redux/features/cartSlice";
import BASE_URL from "../config/apiconfig";
import { useTranslation } from "react-i18next";

interface Product {
  _id: string;
  title: string;
  description: string;
  images: string[] | string;
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

interface CartResponse {
  cartItems: CartItem[];
  cartCount: number;
  message: string;
}

const Cart = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [quantityMap, setQuantityMap] = useState<{ [key: string]: number }>({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);

  const navigate = useNavigate();
  const userId = useAppSelector((state) => state.authReducer.userId) || localStorage.getItem("userId");
  const token = localStorage.getItem("accessToken");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchCartItems = async () => {
    if (!userId || !token) return;
    try {
      const { data } = await axios.get<CartResponse>(`${BASE_URL}/cart/${userId}`, { headers });
      setCartItems(data.cartItems);
    } catch {
      toast.error(t("failedFetchCart"));
    }
  };

  useEffect(() => {
    fetchCartItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, token]);

  useEffect(() => {
    const initialQuantities = cartItems.reduce((acc, item) => {
      if (item.productId) {
        acc[item.productId._id] = item.quantity;
      }
      return acc;
    }, {} as { [key: string]: number });

    setQuantityMap(initialQuantities);
  }, [cartItems]);

  const handleQuantityChange = async (productId: string, quantity: number) => {
    if (quantity < 1) return;

    const item = cartItems.find((item) => item.productId?._id === productId);
    if (item && quantity > item.productId?.stock) {
      toast.error(t("onlyXItemsInStock", { count: item.productId.stock }));
      return;
    }

    setQuantityMap((prev) => ({
      ...prev,
      [productId]: quantity,
    }));

    try {
      const { data } = await axios.put<CartResponse>(`${BASE_URL}/cart`, { userId, productId, quantity }, { headers });
      setCartItems(data.cartItems);
    } catch {
      toast.error(t("failedUpdateQuantity"));
    }
  };

  const removeItem = async (productId: string) => {
    if (!userId || !token) return;

    setRemoveLoading(true);
    try {
      const config = {
        headers,
        data: { userId, productId },
      };

      const response = await axios.delete<CartResponse>(`${BASE_URL}/cart`, config);

      if (response.status === 200) {
        setCartItems(response.data.cartItems);
        toast.success(response.data.message || t("itemRemovedFromCart"));
      } else {
        toast.error(t("failedRemoveItem"));
      }
    } catch {
      toast.error(t("failedRemoveItem"));
    } finally {
      setRemoveLoading(false);
    }
  };

  const handleRemoveFromCart = async (productId: string) => {
    if (!userId || !token) return;

    if (cartItems.length === 1) {
      setItemToRemove(productId);
      setShowModal(true);
    } else {
      setRemoveLoading(true);

      try {
        const config = {
          headers,
          data: { userId, productId },
        };
        await axios.delete(`${BASE_URL}/cart`, config);

        dispatch(removeFromCart(productId));
        setCartItems((prev) => prev.filter((item) => item.productId?._id !== productId));
        toast.success(t("itemRemovedFromCart"));
      } catch {
        toast.error(t("failedRemoveItem"));
      } finally {
        setRemoveLoading(false);
      }
    }
  };

  const confirmRemoveLastItem = async () => {
    if (itemToRemove) {
      await removeItem(itemToRemove);
      window.location.reload();
      setItemToRemove(null);
      setShowModal(false);
    }
  };

  const confirmClearCart = async () => {
    if (!userId || !token) return;

    try {
      await axios.delete(`${BASE_URL}/cart/${userId}`, { headers });
      setCartItems([]);
      setShowModal(false);
      window.location.reload();
    } catch {
      toast.error(t("failedClearCart"));
    }
  };

  const handleCheckout = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/checkout", { state: { cartItems } });
    }, 500);
  };

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return <h2 className="text-center text-xl mt-6">🛒 {t("cartEmpty")}</h2>;
  }

  return (
    <div className="container relative">
      <h1 className="text-center text-2xl font-bold mb-6 mt-6">🛒 {t("shoppingCart")}</h1>

      <div className="space-y-8">
        {cartItems
          .filter((item) => item.productId)
          .map((item) => {
            const imageList = Array.isArray(item.productId?.images)
              ? item.productId.images
              : typeof item.productId?.images === "string"
              ? [item.productId.images]
              : [];

            const imageUrl =
              imageList.length > 0
                ? imageList[0].startsWith("/")
                  ? `${BASE_URL}${imageList[0]}`
                  : imageList[0]
                : "/placeholder.jpg";

            return (
              <div key={item._id} className="flex items-center space-x-5 border p-4 rounded-lg shadow">
                <img
                  src={imageUrl}
                  alt={item.productId?.title || t("product")}
                  className="w-24 h-24 object-cover rounded-lg cursor-pointer"
                  onClick={() => navigate(`/products/${item.productId?._id}`)}
                />
                <div className="flex-grow">
                  <h2 className="text-xl font-semibold">{item.productId?.title}</h2>
                  <p className="text-gray-600">{item.productId?.description}</p>
                  <p className="text-green-600 font-bold">
                    {t("price")}: ₹{item.productId?.salePrice || item.productId?.price}
                  </p>
                  {(item.productId?.stock === 0 || item.productId?.stock === undefined) && (
                    <p className="text-red-500 font-semibold">{t("outOfStock")}</p>
                  )}
                  <div className="flex items-center space-x-2 mt-1">
                    <button
                      className="bg-gray-200 px-2 rounded"
                      disabled={quantityMap[item.productId?._id] === 1}
                      onClick={() => handleQuantityChange(item.productId?._id, quantityMap[item.productId?._id] - 1)}
                    >
                      -
                    </button>

                    <input
                      type="number"
                      min="1"
                      max={item.productId?.stock}
                      value={quantityMap[item.productId?._id] || 1}
                      onChange={(e) => handleQuantityChange(item.productId?._id, parseInt(e.target.value))}
                      className="w-16 text-center border rounded px-2 py-1"
                    />

                    <button
                      className="bg-gray-200 px-2 rounded"
                      onClick={() => handleQuantityChange(item.productId?._id, quantityMap[item.productId?._id] + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => handleRemoveFromCart(item.productId?._id)}
                  disabled={removeLoading}
                >
                  {removeLoading ?  t("removing") : t("remove")}
                </button>
              </div>
            );
          })}
      </div>

      <h2 className="text-right text-xl font-bold mt-6">
        {t("total")}: ₹
        {cartItems
          .filter((item) => item.productId)
          .reduce((acc, item) => acc + item.quantity * (item.productId?.salePrice || item.productId?.price), 0)
          .toFixed(2)}
      </h2>

      <button className="checkout-btn" onClick={handleCheckout} disabled={loading}>
        {loading ?  t("processing") : t("proceedToCheckout")}
      </button>

      <button
        className="empty-cart-btn bg-gray-500 text-white px-4 py-2 rounded mt-4 w-full"
        onClick={() => setShowModal(true)}
      >
 {t("emptyCart")}      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
            <h2 className="text-xl font-bold mb-4">{itemToRemove ? t("removeItem") : t("clearCart")}</h2>
            <p className="mb-6">
              {itemToRemove
                ? t("removeLastItemWarning")
                : t("clearCartWarning")}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={itemToRemove ? confirmRemoveLastItem : confirmClearCart}
              >
                {t("yes")}
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded"
                onClick={() => {
                  setShowModal(false);
                  setItemToRemove(null);
                }}
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          .checkout-btn {
            background-color: rgb(15, 87, 241);
            color: white;
            padding: 12px;
            border-radius: 5px;
            width: 100%;
            cursor: pointer;
            margin-top: 20px;
          }

          .checkout-btn:disabled {
            background-color: #ccc;
            cursor: not-allowed;
          }
        `}
      </style>
    </div>
  );
};

export default Cart;
