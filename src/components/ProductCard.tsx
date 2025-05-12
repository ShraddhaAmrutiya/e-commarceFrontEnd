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

// const ProductCard: FC<Product> = ({ _id, price, images, title, category, rating, discountPercentage,stock  }) => {
//   const cartItems = useAppSelector((state) => state.cartReducer.cartItems);
//   const dispatch = useAppDispatch();
//   const { requireAuth } = useAuth();

//   const addCart = async () => {
//     requireAuth(async () => {
//       const userId = localStorage.getItem("userId");
//       if (!userId) {
//         toast.error("User not found. Please log in again.");
//         return;
//       }
  
//       if (!_id) {
//         toast.error("Product ID is required.");
//         return;
//       }
  
//       // Create the product object
//       const product: Product = {
//         _id,
//         price,
//         images,
//         title,
//         category,
//         rating,
//         discountPercentage,
//         stock 
//       };
  
//       // Check if product is already in cart
//       const existingCartItem = cartItems.find((item) => item.productId._id === _id);
  
//       if (product.stock === undefined) {
//         toast("Product stock information is unavailable.");
//         return;
//       }
//       const maxQuantity = product.stock ;
//       const newQuantity = existingCartItem
//         ? Math.min(existingCartItem.quantity + 1, maxQuantity )
//         : 1;
  
//       if (existingCartItem && existingCartItem.quantity >= maxQuantity) {
//         toast("You've reached the maximum quantity for this product.");
//         return;
//       }
  
//       try {
//         const res = await fetch(`${BASE_URL}/cart`, {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//           },
//           body: JSON.stringify({
//             userId,
//             productId: _id,
//             quantity: newQuantity,
//           }),
//         });
  
//         const data = await res.json();
  
//         if (res.ok && data.cartItems) {
//           // Prepare cart item
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
//           };
  
//           dispatch(addToCart(cartItem)); 
  
//           toast.success(existingCartItem ? "Quantity increased in cart!" : "Added to cart!");
//         } else {
//           toast.error(data.message || "Failed to add to cart!");
//         }
//       } catch (error) {
//         console.error("Error adding to cart:", error);
//         toast.error("Error adding to cart!");
//       }
//     });
//   };
//   const imageUrl =
//     Array.isArray(images) && images[0]
//       ? images[0].startsWith("http")
//         ? images[0]
//         : `${BASE_URL}${images[0]}`
//       : null

//   console.log("imageUrl",  imageUrl);
  
//   return (
//     <div className="border border-gray-200 font-lato" data-test="product-card">
//       <div className="text-center border-b border-gray-200">
//       <Link to={`/products/${_id}`}>
//           <img
//             src={imageUrl}
//             alt={title}
//             loading="lazy"
//             className="inline-block h-60 transition-transform duration-200 hover:scale-110"
//           />
//         </Link>
//       </div>
//       <div className="px-4 pt-4">
//         <p className="text-gray-500 text-[14px] font-medium dark:text-white">
//           {typeof category === "string" ? category : category?.name ?? "Unknown Category"}
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
//       {/* <span>{cartItems.length}</span> */}
//       <div className="flex flex-wrap items-center justify-between px-4 pb-4">
//          <PriceSection discountPercentage={discountPercentage ??0} price={price} />
//         <button
//           type="button"
//           className="flex items-center space-x-2 hover:bg-blue-500 text-white py-2 px-4 rounded bg-pink-500"
//           onClick={(e) => {
//             e.stopPropagation();
//             addCart();
//           }}
//           data-test="add-cart-btn"
//           title="ADD TO CART"
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

const ProductCard: FC<Product> = ({ _id, price, images, title, category, rating, discountPercentage, stock }) => {
  const cartItems = useAppSelector((state) => state.cartReducer.cartItems);
  const dispatch = useAppDispatch();
  const { requireAuth } = useAuth();

  const addCart = async () => {
    requireAuth(async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.error("User not found. Please log in again.");
        return;
      }

      if (!_id) {
        toast.error("Product ID is required.");
        return;
      }

      // Create the product object
      const product: Product = {
        _id,
        price,
        images,
        title,
        category,
        rating,
        discountPercentage,
        stock
      };

      // Check if product is already in cart
      const existingCartItem = cartItems.find((item) => item.productId._id === _id);

      if (product.stock === undefined) {
        toast("Product stock information is unavailable.");
        return;
      }
      const maxQuantity = product.stock;
      const newQuantity = existingCartItem
        ? Math.min(existingCartItem.quantity + 1, maxQuantity)
        : 1;

      if (existingCartItem && existingCartItem.quantity >= maxQuantity) {
        toast("You've reached the maximum quantity for this product.");
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/cart`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            userId,
            productId: _id,
            quantity: newQuantity,
          }),
        });

        const data = await res.json();

        if (res.ok && data.cartItems) {
          // Prepare cart item
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
          };

          dispatch(addToCart(cartItem));

          toast.success(existingCartItem ? "Quantity increased in cart!" : "Added to cart!");
        } else {
          toast.error(data.message || "Failed to add to cart!");
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error("Error adding to cart!");
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
            <p className="text-gray-400">No Image Available</p>
          )}
        </Link>
      </div>
      <div className="px-4 pt-4">
        <p className="text-gray-500 text-[14px] font-medium dark:text-white">
          {typeof category === "string" ? category : category?.name ?? "Unknown Category"}
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
          title="ADD TO CART"
        >
          <AiOutlineShoppingCart />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
