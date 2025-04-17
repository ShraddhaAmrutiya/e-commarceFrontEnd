import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../redux/hooks';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
  const [error, setError] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [
    // showNotification
    , setShowNotification] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null); 

  const userId =
    useAppSelector((state) => state.authReducer.userId) || localStorage.getItem('userId');
  const token = localStorage.getItem('accessToken');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        if (!userId || !token) {
          setError('User is not authenticated.');
          return;
        }

        const response = await axios.get<CartResponse>(
          `http://localhost:5000/cart/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setCartItems(response.data.cartItems);
      } catch (err) {
        console.error('Error fetching cart items:', err);
        setShowNotification(true); // Show the login popup notification
        setTimeout(() => {
          setShowNotification(false); // Hide after 3 seconds
        }, 3000);
      }
    };

    if (userId && token) {
      fetchCartItems();
    }
  }, [userId, token]);

  const handleRemoveFromCart = async (productId: string) => {
    if (cartItems.length === 1) {
      // If this is the last item in the cart, show the confirmation modal
      setItemToRemove(productId);
      setShowModal(true);
    } else {
      // Directly remove the item if it's not the last one
      await removeItem(productId);
    }
  };

  const removeItem = async (productId: string) => {
    try {
      if (!userId || !token) return;

      const config = {
        headers: { Authorization: `Bearer ${token}` },
        data: { userId, productId },
      };

      const response = await axios.delete('http://localhost:5000/cart', config);

      if (response.status === 200) {
        setCartItems(cartItems.filter((item) => item.productId._id !== productId));
        // toast.success('Item removed from cart successfully!');
      } else {
        throw new Error('Failed to remove item from cart.');
      }
    } catch (err) {
      console.error('Error removing item from cart:', err);
      setError('Failed to remove item from cart.');
      toast.error('Failed to remove item from cart.');
    }
  };

  const confirmRemoveLastItem = async () => {
    if (itemToRemove) {
      await removeItem(itemToRemove);
      setShowModal(false);
    }
  };

  const confirmClearCart = async () => {
    try {
      await axios.delete(`http://localhost:5000/cart/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems([]);
      setShowModal(false);
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError('Failed to clear cart.');
    }
  };

  const handleQuantityChange = async (
    userId: string,
    productId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;

    try {
      const { data } = await axios.put<CartResponse>(
        'http://localhost:5000/cart',
        { userId, productId, quantity: newQuantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCartItems(data.cartItems);
      toast.success(data.message);
    } catch (err) {
      console.error('Error updating item quantity:', err);
      setError('Failed to update quantity.');
      toast.error('Failed to update quantity.');
    }
  };

  const handleCheckout = () => {
    setLoading(true);
    setTimeout(() => {
      navigate('/checkout');
    }, 500);
  };

  if (error) return <h2 className="text-center text-xl mt-6">{error}</h2>;

  if (!cartItems || cartItems.length === 0)
    return <h2 className="text-center text-xl mt-6">🛒 Your cart is empty</h2>;

  return (
    <div className="container relative">
      <h1 className="text-center text-2xl font-bold mb-6 mt-6">🛒 Shopping Cart</h1>

      <div className="cart-items space-y-6">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="cart-item flex items-center space-x-4 border p-4 rounded-lg shadow"
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
              <div className="flex items-center space-x-2 mt-2">
                <button
                  className="bg-gray-200 px-2 rounded"
                  onClick={() =>
                    handleQuantityChange(userId as string, item.productId._id, item.quantity - 1)
                  }
                  disabled={item.quantity === 1}
                >
                  -
                </button>
                <span className="px-2">{item.quantity}</span>
                <button
                  className="bg-gray-200 px-2 rounded"
                  onClick={() =>
                    handleQuantityChange(userId as string, item.productId._id, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>
            </div>

            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => handleRemoveFromCart(item.productId._id)}
            >
              Remove
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
        disabled={loading || cartItems.length === 0}
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
              {itemToRemove ? 'Are you sure you want to remove this item?' : 'Clear Cart'}
            </h2>
            <p className="mb-6">
              {itemToRemove ? 'You are about to remove the last item in your cart.' : 'Are you sure you want to clear your cart?'}
            </p>
            <div className="flex justify-center space-x-4">
              {itemToRemove ? (
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={confirmRemoveLastItem}
                >
                  Yes, Remove
                </button>
              ) : (
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={confirmClearCart}
                >
                  Yes, Clear
                </button>
              )}
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
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
            width: 100%;
            padding: 12px;
            background: green;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 18px;
            cursor: pointer;
            margin-top: 20px;
            transition: background 0.3s ease;
          }

          .checkout-btn:hover {
            background: darkgreen;
          }

          .checkout-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
          }

          .empty-cart-btn:hover {
            background-color: #666;
          }
        `}
      </style>
    </div>
  );
};

export default Cart;
