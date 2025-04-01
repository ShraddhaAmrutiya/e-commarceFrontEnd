// CartPage.tsx
// import React from "react";
import { useAppSelector } from "../redux/hooks";

const CartPage = () => {
  const cartItems = useAppSelector((state) => state.cartReducer.cartItems);
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.quantity ?? 0) * (item.price ?? 0),
    0
  );

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <ul>
        {cartItems.map((item) => (
          <li key={item._id}>
            <span>{item.title}</span> - Quantity: {item.quantity} - ${item.price}
          </li>
        ))}
      </ul>
      <div className="total-price">Total: ${totalPrice.toFixed(2)}</div>
    </div>
  );
};

export default CartPage;
