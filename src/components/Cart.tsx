
// import { useAppSelector } from "../redux/hooks";

// const CartPage = () => {
//   const cartItems = useAppSelector((state) => state.cartReducer.cartItems);
//   const totalPrice = cartItems.reduce(
//     (acc, item) => acc + (item.quantity ?? 0) * (item.price ?? 0),
//     0
//   );

//   return (
//     <div className="cart-page">
//       <h1>Your Cart</h1>
//       <ul>
//         {cartItems.map((item) => (
//           <li key={item._id}>
//             <span>{item.title}</span> - Quantity: {item.quantity} - ${item.price}
//           </li>
//         ))}
//       </ul>
//       <div className="total-price">Total: ${totalPrice.toFixed(2)}</div>
//     </div>
//   );
// };

// export default CartPage;

import { useAppSelector } from "../redux/hooks";

const CartPage = () => {
  const cartItems = useAppSelector((state) => state.cartReducer.cartItems);

  const validCartItems = (cartItems ?? []).filter(
    (item) => item && item.productId
  );

  const totalPrice = validCartItems.reduce(
    (acc, item) => acc + (item.quantity ?? 0) * (item.price ?? 0),
    0
  );

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {validCartItems.length === 0 ? (
        <p>Your cart is empty or contains invalid items.</p>
      ) : (
        <>
          <ul>
            {validCartItems.map((item) => {
              console.log("Cart item productId:", item.productId); // 🔍 Logging here

              return (
                <li key={item._id ?? item.productId}>
                  <span>{item.title ?? "Unknown Product"}</span> - Quantity: {item.quantity ?? 0} - ${item.price ?? 0}
                </li>
              );
            })}
          </ul>
          <div className="total-price">Total: ${totalPrice.toFixed(2)}</div>
        </>
      )}
    </div>
  );
};

export default CartPage;
