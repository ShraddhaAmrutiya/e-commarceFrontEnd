import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAppSelector } from '../redux/hooks';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

interface Product {
  _id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  salePrice: number;
  discountPercentage: number;
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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cartCount, setCartCount] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [removeLoading, setRemoveLoading] = useState<boolean>(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);
console.log(error);

  
  const navigate = useNavigate();
  const userId =
    useAppSelector((state) => state.authReducer.userId) || localStorage.getItem('userId');
  const token = localStorage.getItem('accessToken');

  const headers = { Authorization: `Bearer ${token}` };
  useEffect(() => {
    setCartCount(cartItems.length);
  }, [cartItems]);
  
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!userId || !token) return;
      try {
        const { data } = await axios.get<CartResponse>(
          `http://localhost:5000/cart/${userId}`,
          { headers }
        );
        setCartItems(data.cartItems);
        setCartCount(data.cartCount);
      } catch {
        setError('Failed to fetch cart.');
        toast.error('Failed to fetch cart.');
      }
    };
    fetchCartItems();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, token]);
// console.log(cartItems, 'cartItems');

  const handleQuantityChange = async (productId: string, quantity: number) => {
    if (!userId || !token || quantity < 1) return;

    try {
      const { data } = await axios.put<CartResponse>(
        'http://localhost:5000/cart',
        { userId, productId, quantity },
        { headers }
      );
      setCartItems(data.cartItems);
      setCartCount(data.cartCount);
    } catch {
      toast.error('Failed to update quantity.');
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
      const response = await axios.delete<CartResponse>('http://localhost:5000/cart', config);
  
      if (response.status === 200) {
        const updatedCartItems = cartItems.filter(item => item.productId._id !== productId);
        const backendMessage = response.data?.message || 'Item removed from cart';
        // const itemName = removedItem?.productId?.title || 'Item';
  
        setCartItems(updatedCartItems);
        setCartCount(updatedCartItems.length);
  
        toast.success(` ${backendMessage}`, {
          position: "top-center",
          autoClose: 2000, // correct key for react-toastify
          style: {
            backgroundColor: "#f44336",
            color: "#fff",
            borderRadius: "8px",
            top: "50%",
            transform: "translateY(-50%)",
          },
        });
  
      }
    } catch {
      toast.error('Failed to remove item from cart.');
    } finally {
      setRemoveLoading(false);
    }
  };
  
  
  

  const handleRemoveFromCart = async (productId: string) => {
    if (cartItems.length === 1) {
      setItemToRemove(productId);
      setShowModal(true);
    } else {
      await removeItem(productId);
    }
  };

  const confirmRemoveLastItem = async () => {
    if (itemToRemove) {
      await removeItem(itemToRemove);
      setItemToRemove(null);
      setShowModal(false);
    }
  };

  const confirmClearCart = async () => {
    if (!userId || !token) return;
    try {
      await axios.delete(`http://localhost:5000/cart/${userId}`, { headers });
      setCartItems([]);
      setCartCount(0);
      setShowModal(false);
    } catch {
      toast.error('Failed to clear cart.');
    }
  };

  const handleCheckout = () => {
    setLoading(true);
    setTimeout(() => {
      navigate('/checkout',{ state: { cartItems } }
      );
    }, 500);
  };

  if (cartItems.length === 0) {
    return <h2 className="text-center text-xl mt-6">🛒 Your cart is empty</h2>;
  }

  return (
    <div className="container relative">
      <h1 className="text-center text-2xl font-bold mb-6 mt-6">🛒 Shopping Cart</h1>
      <div className="absolute top-1 right-4 bg-blue-800 text-white px-5 py-2 rounded-full text-sm shadow">
  Items in cart: {cartCount}
</div>

      <div className="space-y-8">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex items-center space-x-5 border p-4 rounded-lg shadow"
          >
            <img
              src={`http://localhost:5000${item.productId.image}`}
              alt={item.productId.title}
              className="w-24 h-24 object-cover rounded-lg cursor-pointer"
              onClick={() => navigate(`/products/${item.productId._id}`)}
            />
            <div className="flex-grow">
              <h2 className="text-xl font-semibold">{item.productId.title}</h2>
              <p className="text-gray-600">{item.productId.description}</p>
              <p className="text-green-600 font-bold">
                Price: ₹{item.productId.salePrice || item.productId.price}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <button
                  className="bg-gray-200 px-2 rounded"
                  disabled={item.quantity === 1}
                  onClick={() =>
                    handleQuantityChange(item.productId._id, item.quantity - 1)
                  }
                >
                  -
                </button>
                <span className="px-2">{item.quantity}</span>
                <button
                  className="bg-gray-200 px-2 rounded"
                  onClick={() =>
                    handleQuantityChange(item.productId._id, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>
            </div>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => handleRemoveFromCart(item.productId._id)}
              disabled={removeLoading}
            >
              {removeLoading ? 'Removing...' : 'Remove'}
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-right text-xl font-bold mt-6">
        Total: ₹
        {cartItems
          .reduce(
            (acc, item) =>
              acc + item.quantity * (item.productId.salePrice || item.productId.price),
            0
          )
          .toFixed(2)}
      </h2>

      <button
        className="checkout-btn"
        onClick={handleCheckout}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Proceed to Checkout'}
      </button>

      <button
        className="empty-cart-btn bg-gray-500 text-white px-4 py-2 rounded mt-4 w-full"
        onClick={() => setShowModal(true)}
      >
        Empty Cart
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
            <h2 className="text-xl font-bold mb-4">
              {itemToRemove ? 'Remove Item' : 'Clear Cart'}
            </h2>
            <p className="mb-6">
              {itemToRemove
                ? 'You are about to remove the last item in your cart.'
                : 'Are you sure you want to clear your cart?'}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={itemToRemove ? confirmRemoveLastItem : confirmClearCart}
              >
                Yes
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded"
                onClick={() => {
                  setShowModal(false);
                  setItemToRemove(null);
                }}
              >
                Cancel
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
