import  { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../redux/features/OrderSlice"; // async thunk
import { RootState, AppDispatch } from "../redux/store"; // Import the AppDispatch type

const OrdersPage = () => {
  const dispatch = useDispatch<AppDispatch>();  // Type the dispatch function

  // Corrected selector: state.orderReducer.orders
  const orders = useSelector((state: RootState) => state.orderReducer.orders);
  const user = useSelector((state: RootState) => state.authReducer); // Corrected to state.authReducer

  useEffect(() => {
    if (user.userId) {
      dispatch(fetchOrders(user.userId));  // Dispatch correctly typed thunk
    }
  }, [dispatch, user.userId]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border p-3 rounded mb-4">
            <h3 className="text-lg font-semibold">Order #{order._id}</h3>
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <p>Total: ${order.totalAmount}</p>
            <ul>
              {order.items.map((item) => (
                <li key={item._id}>
                  {item.name} - {item.quantity} × ${item.price}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default OrdersPage;
