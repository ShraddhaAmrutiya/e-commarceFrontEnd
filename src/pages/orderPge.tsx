
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, OrderItem } from "../redux/features/OrderSlice";
import { RootState, AppDispatch } from "../redux/store";
import BASE_URL from "../config/apiconfig";
import { Link } from "react-router-dom";  

const OrdersPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const orderResponse = useSelector((state: RootState) => state.orderReducer.orders);
  const pastOrders = orderResponse?.pastOrders || [];
  const user = useSelector((state: RootState) => state.authReducer);

  useEffect(() => {
    if (user.userId) {
      dispatch(fetchOrders(user.userId));
    }
  }, [dispatch, user.userId]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
      {pastOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        pastOrders.map((order) => (
          <div key={order.orderId} className="border p-4 rounded mb-6 shadow">
            <h3 className="text-lg font-semibold mb-2">Order #{order.orderId}</h3>
            <p className="text-sm text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <p className="text-sm text-gray-600 mb-2">Status: {order.status}</p>
            <p className="font-medium mb-4">Total: ₹{order.totalPrice.toFixed(2)}</p>
            <ul className="space-y-3">
              {order.products.map((item: OrderItem, index: number) => (
                <li key={index} className="border-b pb-3">
                  <Link
                    to={`/products/${item.productId}`}
                    className="flex items-start gap-4 hover:bg-gray-50 p-2 rounded transition"
                  >
                    <img
                      src={`${BASE_URL}${item.image}`}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-lg">{item.name}</p>
                      <p className="text-sm text-gray-700">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-700">
                        Price: ₹{item.salePrice} × {item.quantity} = ₹{item.totalPrice}
                      </p>
                    </div>
                  </Link>
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
