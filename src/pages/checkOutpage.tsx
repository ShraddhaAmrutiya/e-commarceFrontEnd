import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from '../config/apiconfig';


interface Product {
  _id: string;
  title: string;
  description: string;
  image: string;
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
        <p className="text-xl text-gray-600">Your cart is empty. Please add items to the cart before proceeding.</p>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    const outOfStockItem = cartItems.find((item) => item.productId.stock < item.quantity);
    if (outOfStockItem) {
      toast.error(` ${outOfStockItem.productId.title} is out of stock`, {
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

      setMessage("Order placed successfully!");

      setTimeout(() => {
        navigate("/orders", { replace: true });
      }, 1500);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error placing order:", error.message);
        setMessage("Failed to place order. Please try again.");
      } else {
        console.error("Unexpected error:", error);
        setMessage("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = cartItems.reduce(
    (acc: number, item: CartItem) => acc + (item.productId.salePrice ?? item.productId.price) * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Checkout</h2>

      {message && (
        <div className={`text-center mb-4 ${message.includes("success") ? "text-green-600" : "text-red-500"}`}>
          {message}
        </div>
      )}

      <div className="grid gap-6">
        {cartItems.map((item: CartItem) => (
          <div key={item._id} className="flex items-center gap-4 bg-white shadow-md rounded-2xl p-4">
            <img
              src={`${BASE_URL}${item.productId.image}`}
              alt={item.productId.title}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{item.productId.title}</h3>
              <p className="text-gray-600">Quantity: {item.quantity}</p>
              <p className="text-gray-600">Price: ₹{item.productId.salePrice ?? item.productId.price}</p>
              <p className="text-gray-800 font-medium">
                Total: ₹{(item.productId.salePrice ?? item.productId.price) * item.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-end">
        <div className="text-xl font-bold mb-4">Total Amount: ₹{totalAmount.toFixed(2)}</div>
        <button
          onClick={handlePlaceOrder}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg rounded-xl shadow-md transition duration-200"
          disabled={loading}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
