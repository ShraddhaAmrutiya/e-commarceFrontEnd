import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchWishlistItems, removeWishlistItem } from "../redux/features/WishlistSlice";
import { useNavigate } from "react-router-dom";

const Wishlist: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { wishlistItems, loading, error } = useSelector(
    (state: RootState) => state.wishlistReducer
  );

  // Fetch wishlist items on component mount
  useEffect(() => {
    dispatch(fetchWishlistItems());
  }, [dispatch]);

  // Handle removing an item from the wishlist
  const handleRemove = (productId: string) => {
    dispatch(removeWishlistItem({ productId }));
  };

  // Handle redirect to single product page
  const handleCardClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Wishlist</h2>

      {loading && <p className="text-gray-500">Loading wishlist items...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && wishlistItems.length === 0 && (
        <p className="text-gray-600">Your wishlist is empty.</p>
      )}

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems && wishlistItems.length > 0 ? (
          wishlistItems.map((wishlist) => {
            // Iterate through the products array in each wishlist item
            return wishlist.products && wishlist.products.length > 0 ? (
              wishlist.products.map((item) => {
                const product = item.productId;

                if (!product) return null;

                const imageUrl =
                  product.image && product.image.startsWith("/")
                    ? `http://localhost:5000${product.image}`
                    : product.image || "/placeholder.jpg";

                return (
                  <div
                    key={product._id}
                    className="border p-4 rounded-lg shadow-lg bg-white cursor-pointer hover:shadow-xl transition"
                    onClick={() => handleCardClick(product._id)}
                  >
                    {/* Product Image */}
                    <div className="relative">
                      <img
                        src={imageUrl}
                        alt={product.title || "Product Image"}
                        className="w-full h-52 object-cover rounded-md"
                      />
                    </div>

                    {/* Product Details */}
                    <h3 className="text-lg font-semibold mt-2">
                      {product.title || "No Title"}
                    </h3>
                    <p className="text-gray-600">
                      Price: ₹{product.price ? product.price.toFixed(2) : "N/A"}
                    </p>

                    {/* Remove Button */}
                    <div className="mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // prevent card click from firing
                          handleRemove(product._id);
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })
            ) : null;
          })
        ) : (
          <p className="text-gray-600">No items in wishlist</p>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
