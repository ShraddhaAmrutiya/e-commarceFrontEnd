
import { useEffect, useState } from 'react';
import { useAppSelector } from '../redux/hooks';
import axios from 'axios';

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
  products: CartItem[];
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [error, setError] = useState<string>('');

  const userId =
    useAppSelector((state) => state.authReducer.userId) ||
    localStorage.getItem('userId');
  const token = localStorage.getItem('authToken');

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

        setCartItems(response.data.products);
      } catch (err) {
        console.error('Error fetching cart items:', err);
        setError('Failed to fetch cart items.');
      }
    };

    if (userId && token) {
      fetchCartItems();
    }
  }, [userId, token]);

  const handleRemoveFromCart = async (productId: string) => {
    try {
      if (!userId || !token) {
        setError('User is not authenticated.');
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          userId: userId,
          productId: productId,
        },
      };

      await axios.delete('http://localhost:5000/cart', config);

      setCartItems(cartItems.filter(item => item.productId._id !== productId));
    } catch (err) {
      console.error('Error removing item from cart:', err);
      setError('Failed to remove item from cart.');
    }
  };

  const handleEmptyCart = async () => {
    try {
      if (!userId || !token) {
        setError('User is not authenticated.');
        return;
      }

      await axios.delete(`http://localhost:5000/cart/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartItems([]); // Empty the cart in the state after successful deletion
      alert('Cart has been cleared!');
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError('Failed to clear cart.');
    }
  };

  if (error) return <h2>{error}</h2>;
  if (cartItems.length === 0) return <h2>Your cart is empty</h2>;

  return (
    <div className="container">
      <h1>🛒 Shopping Cart</h1>

      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item._id} className="cart-item flex items-center space-x-4">
            <img
              src={`http://localhost:5000${item.productId.image}`}
              alt={item.productId.title}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="flex-grow">
              <h2>{item.productId.title}</h2>
              <p>{item.productId.description}</p>
              <p>
                Price: ${item.productId.salePrice || item.productId.price}
              </p>
              <p>Quantity: {item.quantity}</p>
            </div>
            <button
              className="remove-btn bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => handleRemoveFromCart(item.productId._id)}
            >
              Remove from Cart
            </button>
          </div>
        ))}
      </div>

      <h2>
        Total: $
        {cartItems
          .reduce(
            (acc, item) =>
              acc + item.quantity * (item.productId.salePrice || item.productId.price),
            0
          )
          .toFixed(2)}
      </h2>

      <button className="checkout-btn">Proceed to Checkout</button>

      {/* Empty Cart Button */}
      <button
        className="empty-cart-btn bg-gray-500 text-white px-4 py-2 rounded mt-4"
        onClick={handleEmptyCart}
      >
        Empty Cart
      </button>

      <style>
        {`
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }

          .container {
            width: 80%;
            margin: 20px auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }

          h1 {
            text-align: center;
            color: #333;
          }

          .cart-items {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }

          .cart-item {
            display: flex;
            align-items: center;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background: #fff;
          }

          .product-image {
            width: 80px;
            height: 80px;
            object-fit: cover;
            margin-right: 15px;
            border-radius: 5px;
          }

          .product-details {
            flex-grow: 1;
          }

          .product-details h2 {
            margin: 0;
            font-size: 18px;
            color: #333;
          }

          .product-details p {
            margin: 5px 0;
            font-size: 14px;
            color: #666;
          }

          .checkout-btn {
            width: 100%;
            padding: 12px;
            background: green;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            margin-top: 20px;
          }

          .checkout-btn:hover {
            background: darkgreen;
          }

          .remove-btn {
            background-color: red;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
          }

          .remove-btn:hover {
            background-color: darkred;
          }

          .empty-cart-btn {
            background-color: #888;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            width: 100%;
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
