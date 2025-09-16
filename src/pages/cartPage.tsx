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
    return (
      <div className="min-h-screen pt-24 px-4 py-10 bg-gradient-to-br from-pearl-50 via-resin-50 to-ocean-50 font-poppins">
        <div className="container mx-auto text-center">
          <div className="animate-fadeInUp">
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-4xl font-playfair font-bold resin-text-gradient mb-4">
              {t("cartEmpty") || "Your Cart is Empty"}
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Discover our beautiful resin art collection
            </p>
            <button
              onClick={() => navigate("/products")}
              className="btn-resin px-8 py-4 text-lg font-semibold"
            >
              ✨ Start Shopping ✨
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-24 px-4 py-10 bg-gradient-to-br from-pearl-50 via-resin-50 to-ocean-50 font-poppins">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 animate-fadeInDown">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold resin-text-gradient mb-4">
            🛒 {t("shoppingCart") || "Shopping Cart"}
          </h1>
          <p className="text-gray-600 text-lg">
            Review your selected resin art pieces
          </p>
        </div>

        <div className="space-y-6">
          {cartItems
            .filter((item) => item.productId)
            .map((item, index) => {
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
                  className="group bg-white/80 backdrop-blur-sm border border-resin-200/50 rounded-2xl shadow-pearl hover:shadow-resin transition-all duration-500 hover:-translate-y-1 p-6 animate-fadeInUp"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="flex flex-col lg:flex-row items-center gap-6">
                    {/* Product Image */}
                    <div 
                      className="w-40 h-40 flex-shrink-0 cursor-pointer group-hover:scale-105 transition-transform duration-300" 
                      onClick={() => navigate(`/products/${product._id}`)}
                    >
                      <img
                        src={imageUrl}
                        alt={product.title || t("product")}
                        className="w-full h-full object-cover rounded-xl shadow-lg"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 w-full text-center lg:text-left">
                      <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-2 group-hover:text-resin-600 transition-colors duration-300">
                        {product.title}
                      </h2>
                      <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                      
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                        <div className="text-2xl font-bold gold-text-gradient">
                          ₹{product.salePrice || product.price}
                        </div>
                        {product.stock === 0 && (
                          <div className="text-red-600 font-semibold bg-red-50 px-3 py-1 rounded-full">
                            {t("outOfStock")}
                          </div>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-center lg:justify-start gap-3">
                        <button
                          className="w-10 h-10 bg-resin-100 hover:bg-resin-200 text-resin-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
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
                          className="w-20 text-center border-2 border-resin-300 rounded-xl py-2 focus:border-resin-500 focus:outline-none transition-colors duration-300"
                        />
                        <button
                          className="w-10 h-10 bg-resin-100 hover:bg-resin-200 text-resin-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                          onClick={() => handleQuantityChange(product._id, quantityMap[product._id] + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleRemoveFromCart(product._id)}
                        disabled={removeLoading}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-red-500/30"
                      >
                        {removeLoading ? t("removing") : "🗑️ Remove"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Cart Total */}
        <div className="mt-12 bg-gradient-to-r from-resin-50 to-gold-50 rounded-2xl p-8 shadow-pearl">
          <div className="text-center">
            <h3 className="text-2xl font-playfair font-bold resin-text-gradient mb-4">
              Order Summary
            </h3>
            <div className="text-4xl font-bold gold-text-gradient mb-6">
              ₹{cartItems
                .filter((item) => item.productId)
                .reduce((acc, item) => acc + item.quantity * (item.productId?.salePrice || item.productId?.price), 0)
                .toFixed(2)}
            </div>
            <p className="text-gray-600 mb-6">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            className="btn-resin text-lg font-semibold py-4 px-8 rounded-2xl shadow-resin hover:shadow-gold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="spinner"></div>
                {t("processing")}
              </div>
            ) : (
              "✨ Proceed to Checkout ✨"
            )}
          </button>
          <button
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-lg font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-red-500/30 transition-all duration-300 hover:scale-105"
            onClick={() => setShowModal(true)}
          >
            🗑️ Clear Cart
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 animate-fadeInUp">
            <div className="bg-white/95 backdrop-blur-lg p-8 rounded-2xl shadow-resin w-full max-w-md text-center border border-resin-200/50">
              <div className="text-6xl mb-4">
                {itemToRemove ? "⚠️" : "🗑️"}
              </div>
              <h2 className="text-2xl font-playfair font-bold resin-text-gradient mb-4">
                {itemToRemove ? t("removeItem") || "Remove Item" : t("clearCart") || "Clear Cart"}
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                {itemToRemove ? t("removeLastItemWarning") || "Are you sure you want to remove this item?" : t("clearCartWarning") || "Are you sure you want to clear your cart?"}
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-red-500/30"
                  onClick={itemToRemove ? confirmRemoveLastItem : confirmClearCart}
                >
                  {t("yes") || "Yes"}
                </button>
                <button
                  className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                  onClick={() => {
                    setShowModal(false);
                    setItemToRemove(null);
                  }}
                >
                  {t("cancel") || "Cancel"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
