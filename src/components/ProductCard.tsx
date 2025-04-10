import { FC } from "react";
import { Product } from "../models/Product";
import RatingStar from "./RatingStar";
import { addToCart } from "../redux/features/cartSlice";
import { useAppDispatch } from "../redux/hooks";
import toast from "react-hot-toast";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link } from "react-router-dom";
import PriceSection from "./PriceSection";
import useAuth from "../hooks/useAuth";
import { CartItem } from "../models/CartItem";

// Define the CartItemForDispatch interface inside ProductCard.tsx
// interface CartItemForDispatch {
//   _id: string; // Unique cart item ID (can be generated or set as a placeholder)
//   productId: string; // The product ID, which is a string
//   quantity: number; // Quantity of the product in the cart
//   title: string;
//   price: number;
//   image?: string;
//   category: string | { name: string };
//   rating: number;
//   discountPercentage?: number;
// }

const ProductCard: FC<Product> = ({
  _id,
  price,
  image,
  title,
  category,
  rating,
  discountPercentage,
}) => {
  const dispatch = useAppDispatch();
  const { requireAuth } = useAuth();
  const addCart = () => {
    requireAuth(() => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.error("User not found. Please log in again.");
        return;
      }
  
      // Fetch full product details if necessary
      const product: Product = {
        _id,
        price,
        image,
        title,
        category,
        rating,
        discountPercentage,
      };
  
      fetch("http://localhost:5000/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId,
          productId: _id, // Using _id directly instead of product._id
          quantity: 1,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.cart) {
            if (!_id) {
              console.error("❌ Error: Product ID is missing!");
              toast.error("Product ID is required.");
              return;
            }
  
            // Dispatch with the full Product object
            const cartItem: CartItem = {
              _id: 'unique-cart-id', // Placeholder for cart item ID
              productId: product,    // Use the full product object
              quantity: 1,
              title,
              price,
              image,
              category,
              rating,
              discountPercentage,
            };
  
            dispatch(addToCart(cartItem)); // Dispatch the full product object
            toast.success("Added to cart!");
          } else {
            toast.error(data.message || "Failed to add to cart!");
          }
        })
        .catch((error) => {
          console.error("Error adding to cart:", error);
          toast.error("Error adding to cart!");
        });
    });
  };
  
  return (
    <div className="border border-gray-200 font-lato" data-test="product-card">
      <div className="text-center border-b border-gray-200">
        <Link to={`/products/${_id}`}>
          {image ? (
            <img
              src={image.startsWith("http") ? image : `http://localhost:5000${image}`} // Add server base URL if needed
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
        {discountPercentage && <PriceSection discountPercentage={discountPercentage} price={price} />}
        <button
          type="button"
          className="flex items-center space-x-2 hover:bg-blue-500 text-white py-2 px-4 rounded bg-pink-500"
          onClick={(e) => {
            e.stopPropagation(); // 👈 Prevent parent click (navigation)
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
