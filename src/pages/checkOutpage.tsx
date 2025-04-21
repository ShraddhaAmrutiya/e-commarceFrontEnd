import { useSelector, useDispatch } from "react-redux";
import { placeOrder } from "../redux/features/OrderSlice";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { ThunkDispatch } from "@reduxjs/toolkit";
import { AnyAction } from "redux";

interface RootState {
  cartReducer: {
    cartItems: OrderItem[];
    cartOpen: boolean;
    cartCount: number;
    totalQuantity: number;
    totalPrice: number;
  };
  authReducer: {
    isLoggedIn: boolean;
    userName: string;
    userId: string;
    accessToken: string;
    Role: string;
  };
}

interface OrderItem {
  _id: string;
  name: string;
  salePrice: number;
  quantity: number;
}

const CheckoutPage = () => {
  const cartItems = useSelector((state: RootState) => state.cartReducer.cartItems);
  const { userId, userName, accessToken, Role } = useSelector((state: RootState) => state.authReducer);
console.log("cartItems", cartItems);

  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("Redux full state on CheckoutPage mount:", {
      cartItems,
      userId,
      userName,
      accessToken,
      Role,
    });
  }, [cartItems, userId, userName, accessToken, Role]);

  const handlePlaceOrder = async () => {
    console.log("Cart Items in Checkout:", cartItems);
    console.log("Cart Items Length:", cartItems?.length);

    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add items to the cart before proceeding.");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        userId,
        items: cartItems.map(item => ({
          _id: item._id,
          name: item.name,
          price: item.salePrice,
          quantity: item.quantity,
        })),
        totalAmount: cartItems.reduce((acc, item) => acc + item.salePrice * item.quantity, 0),
      };

      console.log("Placing Order with data:", orderData);

      const res = await dispatch(placeOrder(orderData));

      if (res.meta.requestStatus === "fulfilled") {
        navigate("/orders");
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing the order.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    console.log("Cart is empty at render.");
    return <p>Your cart is empty. Please add items to the cart before proceeding.</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      {cartItems.map((item) => (
        <div key={item._id} className="border p-2 rounded mb-2">
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <p>Quantity: {item.quantity}</p>
          <p>Price: ₹{item.salePrice}</p>
          <p>Total: ₹{item.salePrice * item.quantity}</p>
        </div>
      ))}
      <div className="font-bold mt-4">
        Total Amount: ₹
        {cartItems.reduce((acc, item) => acc + item.salePrice * item.quantity, 0)}
      </div>
      <button
        onClick={handlePlaceOrder}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        disabled={loading}
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
};

export default CheckoutPage;
