// import { useAppSelector } from "../redux/hooks";
// import { useTranslation } from "react-i18next";

// const CartPage = () => {
//   const { t } = useTranslation();
//   const cartItems = useAppSelector((state) => state.cartReducer.cartItems);

//   const validCartItems = (cartItems ?? []).filter(
//     (item) => item && item.productId
//   );

//   const totalPrice = validCartItems.reduce(
//     (acc, item) => acc + (item.quantity ?? 0) * (item.price ?? 0),
//     0
//   );

//   return (
//     <div className="cart-page">
//       <h1>{t("yourCart")}</h1>
//       {validCartItems.length === 0 ? (
//         <p>{t("emptyCartMessage")}</p>
//       ) : (
//         <>
//           <ul>
//             {validCartItems.map((item) => {
//               console.log("Cart item productId:", item.productId);

//               return (
//                 <li key={item._id ?? item.productId}>
//                   <span>{item.title ?? t("unknownProduct")}</span> -{" "}
//                   {t("quantity")}: {item.quantity ?? 0} - ${item.price ?? 0}
//                 </li>
//               );
//             })}
//           </ul>
//           <div className="total-price">
//             {t("total")}: ${totalPrice.toFixed(2)}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default CartPage;


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
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-center">{t("yourCart")}</h1>

      {validCartItems.length === 0 ? (
        <p className="text-center text-gray-600">{t("emptyCartMessage")}</p>
      ) : (
        <>
          <ul className="space-y-4">
            {validCartItems.map((item) => (
              <li
                key={item._id ?? item.productId}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 border rounded shadow-sm"
              >
                <div className="flex-1 mb-2 sm:mb-0">
                  <span className="font-medium">
                    {item.title ?? t("unknownProduct")}
                  </span>
                </div>
                <div className="text-sm text-gray-700">
                  {t("quantity")}: <span className="font-medium">{item.quantity ?? 0}</span> <br className="sm:hidden" />
                  ${item.price?.toFixed(2) ?? "0.00"}
                </div>
              </li>
            ))}
          </ul>

          <div className="text-right mt-6 text-xl font-bold text-blue-600">
            {t("total")}: ${totalPrice.toFixed(2)}
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
