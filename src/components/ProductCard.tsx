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
  console.warn("Missing stock for product:", product);
  toast(t("productStockUnavailable"));
  return;
}

      const maxQuantity = product.stock;
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
            stock
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
        console.error("Error adding to cart:", error);
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
    <div className="border border-gray-200 font-lato" data-test="product-card">
      <div className="text-center border-b border-gray-200">
        <Link to={`/products/${_id}`}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              loading="lazy"
              className="inline-block h-60 transition-transform duration-200 hover:scale-110"
            />
          ) : (
            <p className="text-gray-400">{t("noImageAvailable")}</p>
          )}
        </Link>
      </div>
      <div className="px-4 pt-4">
        <p className="text-gray-500 text-[14px] font-medium dark:text-white">
          {typeof category === "string"
            ? category
            : category?.name ?? t("unknownCategory")}
        </p>
        <Link
          className="font-semibold hover:underline dark:text-white overflow-hidden text-ellipsis whitespace-nowrap block"
          to={`/products/${_id}`}
          title={title}
        >
          {title}
        </Link>
      </div>
      <div className="px-4">
        <RatingStar rating={rating} />
      </div>
      <div className="flex flex-wrap items-center justify-between px-4 pb-4">
        <PriceSection discountPercentage={discountPercentage ?? 0} price={price} />
        <button
          type="button"
          className="flex items-center space-x-2 hover:bg-blue-500 text-white py-2 px-4 rounded bg-pink-500"
          onClick={(e) => {
            e.stopPropagation();
            addCart();
          }}
          data-test="add-cart-btn"
          title={t("addToCart")}
        >
          <AiOutlineShoppingCart />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
