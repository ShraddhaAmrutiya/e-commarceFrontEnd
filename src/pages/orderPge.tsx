import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, OrderItem } from "../redux/features/OrderSlice";
import { RootState, AppDispatch } from "../redux/store";
import BASE_URL from "../config/apiconfig";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const OrdersPage = () => {
  const { t } = useTranslation();
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
      <h2 className="text-2xl font-bold mb-4">{t("orders.title")}</h2>
      {pastOrders.length === 0 ? (
        <p>{t("orders.empty")}</p>
      ) : (
        pastOrders.map((order) => (
          <div key={order.orderId} className="border p-4 rounded mb-6 shadow">
            <h3 className="text-lg font-semibold mb-2">
              {t("orders.order")} #{order.orderId}
            </h3>
            <p className="text-sm text-gray-600">
              {t("orders.date")}: {new Date(order.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              {t("orders.status")}: {order.status}
            </p>
            <p className="font-medium mb-4">
              {t("orders.total")}: ₹{order.totalPrice.toFixed(2)}
            </p>

            <ul className="space-y-3">
              {order.products.map((item: OrderItem, index: number) => {
                const imagePath =
                  Array.isArray(item.images) && item.images.length > 0
                    ? item.images[0].startsWith("http")
                      ? item.images[0]
                      : `${BASE_URL}${item.images[0]}`
                    : `${BASE_URL}/default-image.jpg`;

                return (
                  <li key={index} className="border-b pb-3">
                    <Link
                      to={item.name === "Unknown Product" ? "#" : `/products/${item.productId}`}
                      onClick={(e) => {
                        if (item.name === "Unknown Product") {
                          e.preventDefault();
                          toast.error("Product not found.");
                        }
                      }}
                      className={`flex items-start gap-4 p-2 rounded transition ${
                        item.name === "Unknown Product" ? "cursor-not-allowed opacity-60" : "hover:bg-gray-50"
                      }`}
                    >
                      <img src={imagePath} alt={item.name} className="w-20 h-20 object-cover rounded" />
                      <div className="flex-1">
                        <p className="font-medium text-lg">{item.name}</p>
                        <p className="text-sm text-gray-700">
                          {t("orders.quantity")}: {item.quantity}
                        </p>
                        <p className="text-sm text-gray-700">
                          {t("orders.price")}: ₹{item.salePrice} × {item.quantity} = ₹{item.totalPrice}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default OrdersPage;
