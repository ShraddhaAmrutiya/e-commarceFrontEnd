import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchWishlistItems, removeWishlistItem } from "../redux/features/WishlistSlice";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config/apiconfig";
import { useTranslation } from "react-i18next";

const Wishlist: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { wishlistItems, loading, error } = useSelector((state: RootState) => state.wishlistReducer);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchWishlistItems());
  }, [dispatch]);

  const handleRemove = (productId: string) => {
    dispatch(removeWishlistItem({ productId }));
  };

  const handleCardClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };
const allProducts = wishlistItems?.flatMap((w) => w.products || []) || [];

  // ✅ Empty state full-page UI
  if (!loading && allProducts.length === 0) {
    return (
      <div className="h-screen overflow-hidden pt-24 px-4 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 font-poppins flex items-center justify-center">
        <div className="container mx-auto text-center">
          <div className="animate-fadeInUp">
            <div className="text-8xl mb-6">💖</div>
            <h2 className="text-4xl font-playfair font-bold mb-4 resin-text-gradient">
              {t("wishlist.empty") || "Your Wishlist is Empty"}
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Save your favorite items and find them all in one place.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="px-10 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-pink-500/30 bg-gradient-to-r from-pink-500 to-purple-600 text-white transition-all duration-300 hover:scale-105"
            >
              ✨ Start Shopping ✨
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Normal wishlist page with items
  return (
    <div className="container mx-auto p-6 font-karla min-h-[83vh]">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">{t("wishlist.title")}</h2>

      {loading && <p className="text-gray-500">{t("wishlist.loading")}</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-4">
        {wishlistItems &&
          wishlistItems.length > 0 &&
          wishlistItems.map((wishlist) =>
            wishlist.products?.map((item) => {
              const product = item.productId;
              if (!product) return null;

              const images = Array.isArray(product.images) ? product.images : [];
              const imageUrl =
                images.length > 0
                  ? images[0].startsWith("/")
                    ? `${BASE_URL}${images[0]}`
                    : images[0]
                  : "/placeholder.jpg";

              return (
                <div
                  key={product._id}
                  className="flex gap-4 items-start bg-white dark:bg-slate-700 shadow-sm hover:shadow-md transition rounded-lg p-4 cursor-pointer"
                  onClick={() => handleCardClick(product._id)}
                >
                  {/* Image Box */}
                  <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                    <img
                      src={imageUrl}
                      alt={product.title || t("wishlist.productImageAlt")}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {product.title || t("wishlist.noTitle")}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                      ₹
                      {product.salePrice && product.salePrice > 0
                        ? product.salePrice.toFixed(2)
                        : product.price.toFixed(2)}
                    </p>

                    {/* Remove Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(product._id);
                      }}
                      className="mt-3 text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      {t("wishlist.remove")}
                    </button>
                  </div>
                </div>
              );
            })
          )}
      </div>
    </div>
  );
};

export default Wishlist;
