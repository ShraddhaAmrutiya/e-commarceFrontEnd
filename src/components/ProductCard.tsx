// import { FC } from "react";
// import { Product } from "../models/Product";
// import RatingStar from "./RatingStar";
// import { addToCart } from "../redux/features/cartSlice";
// import { useAppDispatch, useAppSelector } from "../redux/hooks";
// import toast from "react-hot-toast";
// import { AiOutlineShoppingCart } from "react-icons/ai";
// import { Link } from "react-router-dom";
// import PriceSection from "./PriceSection";
// import useAuth from "../hooks/useAuth";
// import { CartItem } from "../models/CartItem";
// import BASE_URL from "../config/apiconfig";
// import { useTranslation } from "react-i18next";

// const ProductCard: FC<Product> = ({
//   _id,
//   price,
//   images,
//   title,
//   category,
//   rating,
//   discountPercentage,
//   stock,
// }) => {
//   const { t } = useTranslation();
//   const cartItems = useAppSelector((state) => state.cartReducer.cartItems);
//   const dispatch = useAppDispatch();
//   const { requireAuth } = useAuth();
//   const language = localStorage.getItem("language") || "en";

//   const addCart = async () => {
//     requireAuth(async () => {
//       const userId = localStorage.getItem("userId");
//       if (!userId) {
//         toast.error(t("userNotFoundPleaseLogin"));
//         return;
//       }

//       if (!_id) {
//         toast.error(t("productIdRequired"));
//         return;
//       }

//       const product: Product = {
//         _id,
//         price,
//         images,
//         title,
//         category,
//         rating,
//         discountPercentage,
//         stock,
//       };

//       const existingCartItem = cartItems.find(
//         (item) => item.productId._id === _id
//       );

//     if (product.stock === undefined) {
//   console.warn("Missing stock for product:", product);
//   toast(t("productStockUnavailable"));
//   return;
// }

// const maxQuantity = Math.min(10,product.stock);
//       const newQuantity = existingCartItem
//         ? Math.min(existingCartItem.quantity + 1, maxQuantity)
//         : 1;

//       if (existingCartItem && existingCartItem.quantity >= maxQuantity) {
//         toast(t("maxQuantityReached"));
//         return;
//       }

//       try {
//         const res = await fetch(`${BASE_URL}/cart`, {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//             "Accept-Language": language,
//           },
//           body: JSON.stringify({
//             userId,
//             productId: _id,
//             quantity: newQuantity,
//           }),
//         });

//         const data = await res.json();

//         if (res.ok && data.cartItems) {
//           const cartItem: CartItem = {
//             _id: existingCartItem?._id || "unique-cart-id",
//             productId: product,
//             quantity: newQuantity,
//             title,
//             price,
//             images,
//             category,
//             rating,
//             discountPercentage,
//             stock
//           };

//           dispatch(addToCart(cartItem));

//           toast.success(
//             existingCartItem
//               ? t("quantityIncreasedInCart")
//               : t("addedToCart")
//           );
//         } else {
//           toast.error(data.message || t("failedToAddToCart"));
//         }
//       } catch (error) {
//         toast.error(t("errorAddingToCart"));
//       }
//     });
//   };

//   const imageUrl =
//     Array.isArray(images) && images[0]
//       ? images[0].startsWith("http")
//         ? images[0]
//         : `${BASE_URL}${images[0]}`
//       : null;

//   return (
//     <div className="border border-gray-200 font-lato" data-test="product-card">
//       <div className="text-center border-b border-gray-200">
//         <Link to={`/products/${_id}`}>
//           {imageUrl ? (
//             <img
//               src={imageUrl}
//               alt={title}
//               loading="lazy"
//               className="inline-block h-60 transition-transform duration-200 hover:scale-110"
//             />
//           ) : (
//             <p className="text-gray-400">{t("noImageAvailable")}</p>
//           )}
//         </Link>
//       </div>
//       <div className="px-4 pt-4">
//         <p className="text-gray-500 text-[14px] font-medium dark:text-white">
//           {typeof category === "string"
//             ? category
//             : category?.name ?? t("unknownCategory")}
//         </p>
//         <Link
//           className="font-semibold hover:underline dark:text-white overflow-hidden text-ellipsis whitespace-nowrap block"
//           to={`/products/${_id}`}
//           title={title}
//         >
//           {title}
//         </Link>
//       </div>
//       <div className="px-4">
//         <RatingStar rating={rating} />
//       </div>
//       <div className="flex flex-wrap items-center justify-between px-4 pb-4">
//         <PriceSection discountPercentage={discountPercentage ?? 0} price={price} />
//         <button
//           type="button"
//           className="flex items-center space-x-2 hover:bg-blue-500 text-white py-2 px-4 rounded bg-pink-500"
//           onClick={(e) => {
//             e.stopPropagation();
//             addCart();
//           }}
//           data-test="add-cart-btn"
//           title={t("addToCart")}
//         >
//           <AiOutlineShoppingCart />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;

import { FC } from "react";
import { Product } from "../models/Product";
import RatingStar from "./RatingStar";
import { addToCart } from "../redux/features/cartSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import toast from "react-hot-toast";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link } from "react-router-dom";
import PriceSection from "./PriceSection";
import useAuth from "../hooks/useAuth";
import { CartItem } from "../models/CartItem";
import BASE_URL from "../config/apiconfig";
import { useTranslation } from "react-i18next";

const ProductCard: FC<Product> = ({
  _id,
  price,
  images,
  title,
  category,
  rating,
  discountPercentage,
  stock,
}) => {
  const { t } = useTranslation();
  const cartItems = useAppSelector((state) => state.cartReducer.cartItems);
  const dispatch = useAppDispatch();
  const { requireAuth } = useAuth();
  const language = localStorage.getItem("language") || "en";

  const addCart = async () => {
    requireAuth(async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.error(t("userNotFoundPleaseLogin"));
        return;
      }

      if (!_id) {
        toast.error(t("productIdRequired"));
        return;
      }

      const product: Product = {
        _id,
        price,
        images,
        title,
        category,
        rating,
        discountPercentage,
        stock,
      };

      const existingCartItem = cartItems.find(
        (item) => item.productId._id === _id
      );

      if (product.stock === undefined) {
        toast.error(t("productStockUnavailable"));
        return;
      }

      const maxQuantity = Math.min(10, product.stock);
      const newQuantity = existingCartItem
        ? Math.min(existingCartItem.quantity + 1, maxQuantity)
        : 1;

      if (existingCartItem && existingCartItem.quantity >= maxQuantity) {
        toast(t("maxQuantityReached"));
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/cart`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Accept-Language": language,
          },
          body: JSON.stringify({
            userId,
            productId: _id,
            quantity: newQuantity,
          }),
        });

        const data = await res.json();

        if (res.ok && data.cartItems) {
          const cartItem: CartItem = {
            _id: existingCartItem?._id || "unique-cart-id",
            productId: product,
            quantity: newQuantity,
            title,
            price,
            images,
            category,
            rating,
            discountPercentage,
            stock,
          };

          dispatch(addToCart(cartItem));

          toast.success(
            existingCartItem
              ? t("quantityIncreasedInCart")
              : t("addedToCart")
          );
        } else {
          toast.error(data.message || t("failedToAddToCart"));
        }
      } catch (error) {
        toast.error(t("errorAddingToCart"));
      }
    });
  };

  const imageUrl =
    Array.isArray(images) && images[0]
      ? images[0].startsWith("http")
        ? images[0]
        : `${BASE_URL}${images[0]}`
      : null;

  return (
    <Link to={`/products/${_id}`} className="block">
      <div className="group relative bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-pearl hover:shadow-resin transition-all duration-500 hover:-translate-y-2 border border-resin-100/50 font-poppins cursor-pointer">
      {/* Product Image Container */}
      <div className="relative overflow-hidden bg-gradient-to-br from-pearl-50 to-resin-50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            className="w-full h-48 sm:h-56 md:h-60 object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
          />
        ) : (
          <div className="w-full h-48 sm:h-56 md:h-60 flex items-center justify-center bg-gradient-to-br from-resin-100 to-gold-100">
            <p className="text-resin-500 font-medium">{t("noImageAvailable")}</p>
          </div>
        )}
        
        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-resin-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Floating particles */}
        <div className="absolute top-2 right-2 w-2 h-2 bg-gold-300 rounded-full opacity-0 group-hover:opacity-100 animate-bounce-slow transition-opacity duration-500"></div>
        <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-resin-300 rounded-full opacity-0 group-hover:opacity-100 animate-bounce-slow transition-opacity duration-500" style={{animationDelay: '0.5s'}}></div>
      </div>

      {/* Product Details */}
      <div className="p-4 sm:p-5 space-y-3">
        {/* Category */}
        <p className="text-resin-600 text-xs font-semibold uppercase tracking-wider">
          {typeof category === "string"
            ? category
            : category?.name ?? t("unknownCategory")}
        </p>

        {/* Product Title */}
        <div
          className="font-semibold text-sm sm:text-base hover:text-resin-600 dark:text-white line-clamp-2 block transition-colors duration-300"
          title={title}
        >
          {title}
        </div>

        {/* Rating */}
        <div className="flex items-center">
          <RatingStar rating={rating} />
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between gap-3">
          <PriceSection
            discountPercentage={discountPercentage ?? 0}
            price={price}
          />

          <button
            type="button"
            className="group relative flex items-center justify-center w-10 h-10 bg-resin-gradient text-white rounded-full shadow-resin hover:shadow-gold transition-all duration-300 hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              addCart();
            }}
            title={t("addToCart")}
          >
            {/* Cart Icon (default) */}
            <AiOutlineShoppingCart className="text-lg transition-all duration-300 group-hover:scale-0 group-hover:rotate-180" />

            {/* Plus Icon (on hover) */}
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100">+</span>
            </span>
          </button>
        </div>
      </div>

      {/* Gradient border effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-resin-400/20 via-gold-400/20 to-ocean-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      </div>
    </Link>
  );
};

export default ProductCard;
