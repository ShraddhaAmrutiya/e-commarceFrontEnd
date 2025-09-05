import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
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
      const { data } = await axiosInstance.get<CartResponse>(`${BASE_URL}/cart/${userId}`, { headers });
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
      const { data } = await axiosInstance.put<CartResponse>(`${BASE_URL}/cart`, { userId, productId, quantity }, { headers });
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

      const response = await axiosInstance.delete<CartResponse>(`${BASE_URL}/cart`, config);

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
        await axiosInstance.delete(`${BASE_URL}/cart`, config);

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
      await axiosInstance.delete(`${BASE_URL}/cart/${userId}`, { headers });
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
  <div className="container mx-auto px-4 py-6 min-h-[80vh]">
    <h1 className="text-center text-3xl font-bold mb-8">🛒 {t("shoppingCart")}</h1>

    <div className="space-y-6">
      {cartItems
        .filter((item) => item.productId)
        .map((item) => {
          const product = item.productId;
          const imageList = Array.isArray(product.images)
            ? product.images
            : typeof product.images === "string"
              ? [product.images]
              : [];

          const imageUrl = imageList.length > 0
            ? imageList[0].startsWith("/")
              ? `${BASE_URL}${imageList[0]}`
              : imageList[0]
            : "/placeholder.jpg";

          return (
            <div
              key={item._id}
              className="flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-white border border-gray-200 rounded-lg shadow p-4"
            >
              {/* Product Image */}
              <div className="w-32 h-32 flex-shrink-0 cursor-pointer" onClick={() => navigate(`/products/${product._id}`)}>
                <img
                  src={imageUrl}
                  alt={product.title || t("product")}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 w-full">
                <h2 className="text-xl font-semibold text-gray-800">{product.title}</h2>
                <p className="text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                <p className="mt-2 text-lg font-bold text-green-600">
                  ₹{product.salePrice || product.price}
                </p>
                {product.stock === 0 && (
                  <p className="text-red-600 font-semibold mt-1">{t("outOfStock")}</p>
                )}

                {/* Quantity Controls */}
                <div className="flex items-center mt-3 gap-2">
                  <button
                    className="px-3 py-1 bg-gray-200 rounded"
                    disabled={quantityMap[product._id] === 1}
                    onClick={() => handleQuantityChange(product._id, quantityMap[product._id] - 1)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantityMap[product._id] || 1}
                    onChange={(e) => handleQuantityChange(product._id, parseInt(e.target.value))}
                    className="w-16 text-center border border-gray-300 rounded py-1"
                  />
                  <button
                    className="px-3 py-1 bg-gray-200 rounded"
                    onClick={() => handleQuantityChange(product._id, quantityMap[product._id] + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Remove Button */}
              <div className="mt-4 sm:mt-0">
                <button
                  onClick={() => handleRemoveFromCart(product._id)}
                  disabled={removeLoading}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
                >
                  {removeLoading ? t("removing") : t("remove")}
                </button>
              </div>
            </div>
          );
        })}
    </div>

    {/* Cart Total */}
    <div className="mt-8 text-right text-xl font-bold text-gray-800">
      {t("total")}: ₹
      {cartItems
        .filter((item) => item.productId)
        .reduce((acc, item) => acc + item.quantity * (item.productId?.salePrice || item.productId?.price), 0)
        .toFixed(2)}
    </div>

    {/* Buttons */}
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium py-3 px-6 rounded w-full"
        onClick={handleCheckout}
        disabled={loading}
      >
        {loading ? t("processing") : t("proceedToCheckout")}
      </button>
      <button
        className="bg-gray-500 hover:bg-gray-600 text-white text-lg font-medium py-3 px-6 rounded w-full"
        onClick={() => setShowModal(true)}
      >
        {t("emptyCart")}
      </button>
    </div>

    {/* Modal */}
    {showModal && (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md text-center">
          <h2 className="text-xl font-bold mb-4">
            {itemToRemove ? t("removeItem") : t("clearCart")}
          </h2>
          <p className="mb-6">
            {itemToRemove ? t("removeLastItemWarning") : t("clearCartWarning")}
          </p>
          <div className="flex justify-center gap-4">
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              onClick={itemToRemove ? confirmRemoveLastItem : confirmClearCart}
            >
              {t("yes")}
            </button>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
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
  </div>
);
};

export default Cart;
