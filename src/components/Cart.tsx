import { useAppSelector } from "../redux/hooks";
import { useTranslation } from "react-i18next";

const CartPage = () => {
  const { t } = useTranslation();
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
      <h1>{t("yourCart")}</h1>
      {validCartItems.length === 0 ? (
        <p>{t("emptyCartMessage")}</p>
      ) : (
        <>
          <ul>
            {validCartItems.map((item) => {
              console.log("Cart item productId:", item.productId);

              return (
                <li key={item._id ?? item.productId}>
                  <span>{item.title ?? t("unknownProduct")}</span> -{" "}
                  {t("quantity")}: {item.quantity ?? 0} - ${item.price ?? 0}
                </li>
              );
            })}
          </ul>
          <div className="total-price">
            {t("total")}: ${totalPrice.toFixed(2)}
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
