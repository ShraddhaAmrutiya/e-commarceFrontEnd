import { FC } from "react";
import { Product } from "../models/Product";
import RatingStar from "./RatingStar";
import { addToCart } from "../redux/features/cartSlice";
import { useAppDispatch,useAppSelector  } from "../redux/hooks";
import toast from "react-hot-toast";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link } from "react-router-dom";
import PriceSection from "./PriceSection";
import useAuth from "../hooks/useAuth";
import { CartItem } from "../models/CartItem";


const ProductCard: FC<Product> = ({
  _id,
  price,
  image,
  title,
  category,
  rating,
  discountPercentage,
}) => {
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
  
      // Check if the product is already in the cart
      const alreadyInCart = cartItems.some((item) => item.productId._id === _id);
      if (alreadyInCart) {
        toast("This product is already in your cart!");
        return;
      }
  
      // Create the product object
      const product: Product = {
        _id,
        price,
        image,
        title,
        category,
        rating,
        discountPercentage,
      };
  
      // Make the API call to update the cart on the backend
      try {
        const res = await fetch("http://localhost:5000/cart", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            userId,
            productId: _id,
            quantity: 1,
          }),
        });
  
        const data = await res.json();
  
        // Log the data to check what the backend is returning
  
        // Check if the response indicates a successful cart update
        if (res.ok && data.cartItems) {
          // Create the cart item to dispatch to Redux
          const cartItem: CartItem = {
            _id: 'unique-cart-id',  // You can replace this with a unique id if needed
            productId: product,
            quantity: 1,
            title,
            price,
            image,
            category,
            rating,
            discountPercentage,
          };
  
          // Dispatch the action to add the item to the Redux store
          dispatch(addToCart(cartItem));
  
          // Show success toast with backend message
          toast.success(data.message || "Added to cart!");
  
          // Optionally, you can update the cart count or other relevant UI elements
          // For example, you can update the cartCount directly from the response:
          // console.log(`Cart count updated: ${data.cartCount}`);
        } else {
          // If there's no cartItems or res.ok is false, show the backend message as an error
          const errorMessage = data.message || "Failed to add to cart!";
          console.error("Backend error:", errorMessage);
          toast.error(errorMessage);
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error("Error adding to cart!");
      }
    });
  };
  
  
  
  return (
    <div className="border border-gray-200 font-lato" data-test="product-card">
      <div className="text-center border-b border-gray-200">
        <Link to={`/products/${_id}`}>
          {image ? (
           <img
           src={
             typeof image === "string"
               ? image.startsWith("http")
                 ? image
                 : `http://localhost:5000${image}`
               : URL.createObjectURL(image)
           }
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
      {/* <span>{cartItems.length}</span> */}
      <div className="flex flex-wrap items-center justify-between px-4 pb-4">
        {discountPercentage && <PriceSection discountPercentage={discountPercentage} price={price} />}
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
